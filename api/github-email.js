// api/github-email.js — TalentTrace
// Finds a GitHub user's public commit email. Git records an author email inside every
// commit object, and GitHub exposes it through the REST API unless the user has enabled
// "Keep my email addresses private" (in which case commits carry a @users.noreply.github.com
// address, which we filter out as useless for outreach).
//
// Strategy, cheapest call first:
//   1. GET /users/{login}/events/public — recent PushEvents embed commit author emails
//      inline, so one call often answers it outright.
//   2. Fallback: GET /users/{login}/repos (newest pushed first), then for a few of them
//      GET /repos/{login}/{repo}/commits?author={login} and read commit.author.email.
//
// Same server-side-token model as github-search.js: GITHUB_TOKEN, never sent to the browser.
//
// Docs: https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user
//       https://docs.github.com/en/rest/commits/commits#list-commits

const GITHUB_API = 'https://api.github.com';
const MAX_REPOS_TO_PROBE = 5; // caps worst-case calls per lookup

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
  const addHit = (email, name) => {
    if (isUsableEmail(email) && !found.has(email.toLowerCase())) {
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

    // ── 2. Fallback: probe recent repos' commit history ──
    if (!found.size) {
      const repoRes = await fetch(
        GITHUB_API + '/users/' + encodeURIComponent(login) + '/repos?sort=pushed&per_page=' + MAX_REPOS_TO_PROBE,
        { headers }
      );
      if (repoRes.ok) {
        const repos = await repoRes.json().catch(() => []);
        const names = (Array.isArray(repos) ? repos : [])
          .filter(r => !r.fork)                        // forks are usually other people's commits
          .slice(0, MAX_REPOS_TO_PROBE)
          .map(r => r.name);

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

    res.status(200).json({ login, emails: Array.from(found.values()) });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach GitHub: ' + err.message });
  }
}
