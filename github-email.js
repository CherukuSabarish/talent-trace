// api/github-email.js — TalentTrace
// Finds a GitHub user's public commit email. Git records an author email inside every
// commit object, and GitHub exposes it through the REST API unless the user has enabled
// "Keep my email addresses private" (in which case commits carry a @users.noreply.github.com
// address, which we filter out as useless for outreach).
//
// Strategy, cheapest call first, stopping as soon as a usable address turns up:
//   1. GET /users/{login}/events/public — recent PushEvents embed commit author emails
//      inline, so one call often answers it outright. Only covers ~90 days of activity.
//   2. GET /search/commits?q=author:{login} — searches commits across ALL public repos
//      they've contributed to, not just their own, so it catches people whose own repos
//      are empty or fork-only. This is the highest-yield step.
//   3. GET /users/{login}/repos then /repos/{login}/{repo}/commits?author={login} —
//      last resort for accounts the commit index hasn't picked up. GitHub's commit-search
//      `author:` qualifier (step 2) only matches commits whose git email is *verified* on
//      the user's GitHub account, so anyone who ever committed with an unverified/work
//      address is invisible to step 2 no matter how many commits they have — step 3's raw
//      per-repo commit history doesn't have that restriction, which is why it still matters
//      even though step 2 is usually higher-yield. Probes up to MAX_REPOS_TO_PROBE repos
//      (recent, non-forks first) rather than a candidate's entire repo list, since GitHub's
//      Search API also carries a much tighter secondary rate limit (30 req/min) than normal
//      REST calls — we report how many of the account's repos were actually checked so a
//      "no email found" here reads as "not found in what we checked," not "definitely has none."
//
// Why some people still come back empty: GitHub's "Keep my email addresses private"
// setting rewrites the commit author to <id>+<login>@users.noreply.github.com. That is
// what is actually stored in the commit, so there is no real address to recover — the
// API is not hiding it from us, it was never recorded. We report that case distinctly
// (masked: true) rather than pretending we simply failed to look hard enough.
//
// Same server-side-token model as github-search.js: GITHUB_TOKEN, never sent to the browser.
//
// Docs: https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user
//       https://docs.github.com/en/rest/search/search#search-commits
//       https://docs.github.com/en/rest/commits/commits#list-commits

const GITHUB_API = 'https://api.github.com';
const MAX_REPOS_TO_PROBE = 15; // caps worst-case calls per lookup

// GitHub's privacy-mode placeholder addresses are not real inboxes — drop them.
function isUsableEmail(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) return false;
  const lower = email.toLowerCase();
  if (lower.endsWith('users.noreply.github.com')) return false;
  if (lower.endsWith('noreply.github.com')) return false;
  if (lower === 'no-reply@github.com') return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST.' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({
      error: 'GITHUB_TOKEN is not configured. Add it in Vercel → Project Settings → Environment Variables, then redeploy.'
    });
    return;
  }

  const login = (req.body && req.body.login ? String(req.body.login) : '').trim();
  if (!login || !/^[A-Za-z0-9-]+$/.test(login)) {
    res.status(400).json({ error: 'A valid GitHub login is required.' });
    return;
  }

  const headers = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'TalentTrace'
  };

  // Collected as name -> email so we can show who the commits were authored as.
  const found = new Map();
  // Tracks whether we saw commits at all but every one was privacy-masked — that's a
  // meaningfully different answer from "this person has no visible commits".
  let sawMasked = false;
  const addHit = (email, name) => {
    if (!email || typeof email !== 'string') return;
    if (!isUsableEmail(email)) { if (email.includes('@')) sawMasked = true; return; }
    if (!found.has(email.toLowerCase())) {
      found.set(email.toLowerCase(), { email, name: name || '' });
    }
  };

  try {
    // ── 1. Public events (PushEvents embed the commits, including author email) ──
    const evRes = await fetch(GITHUB_API + '/users/' + encodeURIComponent(login) + '/events/public?per_page=100', { headers });
    if (evRes.ok) {
      const events = await evRes.json().catch(() => []);
      (Array.isArray(events) ? events : []).forEach(ev => {
        if (ev.type === 'PushEvent' && ev.payload && Array.isArray(ev.payload.commits)) {
          ev.payload.commits.forEach(c => {
            if (c.author) addHit(c.author.email, c.author.name);
          });
        }
      });
    } else if (evRes.status === 401 || evRes.status === 403) {
      const body = await evRes.json().catch(() => ({}));
      res.status(evRes.status).json({ error: body.message || 'GitHub rejected the request (HTTP ' + evRes.status + ').' });
      return;
    }

    // ── 2. Commit search across every public repo they've contributed to ──
    // Much broader than their own repos: catches contributors to other people's
    // projects, which is most working engineers. But it only surfaces commits whose
    // git email is verified on the user's GitHub account (see header comment), and it
    // shares GitHub's tight Search API rate limit (30 req/min) — a 403 here just means
    // "this step didn't help," not "no commits exist," so we track it rather than
    // silently swallowing it.
    let commitSearchRateLimited = false;
    if (!found.size) {
      try {
        const csRes = await fetch(
          GITHUB_API + '/search/commits?q=' + encodeURIComponent('author:' + login) +
          '&sort=author-date&order=desc&per_page=50',
          { headers }
        );
        if (csRes.ok) {
          const cs = await csRes.json().catch(() => ({}));
          (Array.isArray(cs.items) ? cs.items : []).forEach(item => {
            if (item.commit && item.commit.author) addHit(item.commit.author.email, item.commit.author.name);
          });
        } else if (csRes.status === 403 || csRes.status === 429) {
          commitSearchRateLimited = true;
        }
      } catch (e) { /* fall through to repo probing */ }
    }

    // ── 3. Fallback: probe recent repos' commit history ──
    // Not restricted to verified emails like step 2, so this is what actually catches
    // someone who's only ever committed with an unverified/work address. We still cap
    // how many repos we probe per lookup (GitHub's normal REST limit is generous, but a
    // serverless function has its own time budget) — reported back below so a "no email
    // found" here is honest about being "not found in the N of M repos we checked."
    let reposTotal = 0;
    let reposChecked = 0;
    if (!found.size) {
      const repoRes = await fetch(
        GITHUB_API + '/users/' + encodeURIComponent(login) + '/repos?sort=pushed&per_page=100',
        { headers }
      );
      if (repoRes.ok) {
        const repos = await repoRes.json().catch(() => []);
        // Prefer their own repos, but fall back to forks — plenty of accounts have
        // nothing but forks, and their commits inside those still carry an email.
        const list = Array.isArray(repos) ? repos : [];
        reposTotal = list.length;
        const names = [...list.filter(r => !r.fork), ...list.filter(r => r.fork)]
          .slice(0, MAX_REPOS_TO_PROBE)
          .map(r => r.name);
        reposChecked = names.length;

        // Parallel, and a failing repo just contributes nothing.
        await Promise.all(names.map(async (repo) => {
          try {
            const cRes = await fetch(
              GITHUB_API + '/repos/' + encodeURIComponent(login) + '/' + encodeURIComponent(repo) +
              '/commits?author=' + encodeURIComponent(login) + '&per_page=20',
              { headers }
            );
            if (!cRes.ok) return;
            const commits = await cRes.json().catch(() => []);
            (Array.isArray(commits) ? commits : []).forEach(c => {
              if (c.commit && c.commit.author) addHit(c.commit.author.email, c.commit.author.name);
            });
          } catch (e) { /* skip this repo */ }
        }));
      }
    }

    res.status(200).json({
      login,
      emails: Array.from(found.values()),
      // true = we found their commits, but GitHub's privacy setting replaced the real
      // address with a noreply placeholder. No amount of extra searching recovers it.
      masked: !found.size && sawMasked,
      // true = we came back empty, but only checked part of their repo history (either
      // GitHub's search rate limit blocked step 2, or they have more repos than we
      // probed in step 3) — so this is "not found yet," not a confirmed dead end.
      incomplete: !found.size && !sawMasked && (commitSearchRateLimited || reposChecked < reposTotal),
      reposChecked,
      reposTotal
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach GitHub: ' + err.message });
  }
}
