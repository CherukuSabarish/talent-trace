// api/github-repo-contributors.js — TalentTrace
// Pulls a repository's contributor list (GitHub already sorts it by contribution
// count) — login, avatar, contribution count, nothing more. Deliberately NOT
// enriched here: enriching up to 100 contributors inline would mean up to 100
// parallel /users/{login} calls inside a single serverless invocation, which risks
// a slow response or an outright timeout on a big repo, and gives the recruiter no
// visibility into that work happening. Instead the frontend's "Enrich Profiles"
// button calls api/github-user-profile.js per contributor in small batches, at the
// user's own pace, with a visible pause control — same idea as the reference
// contributor-extraction tool this was modeled after.
//
// Capped at MAX_CONTRIBUTORS (GitHub's own per_page ceiling) rather than paginating
// through every contributor on a mega-repo — kubernetes/kubernetes alone has 5,800+,
// and contribution counts trail off fast past the top of the list, so walking every
// page would mean dozens of extra requests for very little sourcing value. When the
// repo has more than we fetched, `hasMore` says so instead of silently truncating.
// Same server-side-key model as the other api/github-*.js functions.
//
// Docs: https://docs.github.com/en/rest/repos/repos#list-repository-contributors

const GITHUB_API = 'https://api.github.com';
const MAX_CONTRIBUTORS = 100;

// GitHub paginates with a `Link: <url>; rel="next", <url>; rel="last"` response
// header — checking for rel="next" tells us there's another page without having to
// actually fetch it.
function hasNextLink(linkHeader) {
  return !!linkHeader && /rel="next"/.test(linkHeader);
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

  const { owner, repo } = req.body || {};
  if (!owner || !repo) {
    res.status(400).json({ error: 'owner and repo are required.' });
    return;
  }

  const ghHeaders = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'TalentTrace'
  };

  try {
    // anon=false excludes contributors GitHub can't map to a real account (deleted
    // users, mailmap-only entries) — there'd be no profile to enrich or link to anyway.
    const url = GITHUB_API + '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) +
      '/contributors?per_page=' + MAX_CONTRIBUTORS + '&page=1&anon=false';
    const r = await fetch(url, { headers: ghHeaders });
    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      // Common non-fatal cases here: 204/empty for a repo with no contributor stats
      // yet (GitHub computes these async for large repos), 404 for a bad owner/repo.
      res.status(r.status).json({
        error: data.message || ('Could not list contributors for ' + owner + '/' + repo + ' (HTTP ' + r.status + ')')
      });
      return;
    }

    const items = Array.isArray(data) ? data.filter(c => c && c.login && c.type === 'User') : [];
    const hasMore = hasNextLink(r.headers.get('link'));

    // Bare shape only - no /users/{login} call here (see header comment). The
    // frontend fills in name/company/location/bio/email/etc. later via the
    // Enrich Profiles action, one small batch at a time.
    const profiles = items.map((item) => ({
      login: item.login,
      url: item.html_url,
      avatar: item.avatar_url,
      contributions: item.contributions ?? null,
      sourceRepo: owner + '/' + repo,
      enriched: false
    }));

    res.status(200).json({
      cappedAt: MAX_CONTRIBUTORS,
      returned: profiles.length,
      hasMore,
      profiles
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach GitHub: ' + err.message });
  }
}
