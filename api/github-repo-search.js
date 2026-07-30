// api/github-repo-search.js — TalentTrace
// Proxies repository search to GitHub's Search Repositories API, so a recruiter can
// find a repo by name, owner/name, or topic (e.g. "kubernetes", "facebook/react") and
// then pull its contributor list as a candidate pool via api/github-repo-contributors.js.
// Same server-side-key model as the other api/github-*.js functions — GITHUB_TOKEN
// lives only here and never reaches the browser.
//
// Docs: https://docs.github.com/en/rest/search/search#search-repositories

const GITHUB_API = 'https://api.github.com';
const MAX_RESULTS = 25; // per-request cap, matches the other GitHub endpoints in this app

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

  const { query, limit, page } = req.body || {};
  if (!query || !String(query).trim()) {
    res.status(400).json({ error: 'query is required — a repo name, owner/name, or keyword.' });
    return;
  }

  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 15, 1), MAX_RESULTS);
  const safePage = Math.max(parseInt(page, 10) || 1, 1);

  const ghHeaders = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'TalentTrace'
  };

  try {
    // Sorted by stars — for a "which repo should I source contributors from" search,
    // the most-starred match is almost always the most relevant one (e.g. searching
    // "kubernetes" should surface kubernetes/kubernetes first, not a random fork).
    const searchUrl = GITHUB_API + '/search/repositories?q=' + encodeURIComponent(String(query).trim()) +
      '&sort=stars&order=desc&per_page=' + safeLimit + '&page=' + safePage;
    const r = await fetch(searchUrl, { headers: ghHeaders });
    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      const detail = Array.isArray(data.errors) && data.errors.length
        ? ' — ' + data.errors.map(e => e.message || e.code).filter(Boolean).join('; ')
        : '';
      res.status(r.status).json({
        error: (data.message || ('GitHub repo search failed (HTTP ' + r.status + ')')) + detail
      });
      return;
    }

    const items = Array.isArray(data.items) ? data.items : [];
    const repos = items.map(it => ({
      fullName: it.full_name,
      owner: it.owner ? it.owner.login : '',
      name: it.name,
      description: it.description || '',
      stars: it.stargazers_count ?? 0,
      forks: it.forks_count ?? 0,
      language: it.language || '',
      updatedAt: it.pushed_at || it.updated_at || '',
      url: it.html_url,
      avatar: it.owner ? it.owner.avatar_url : ''
    }));

    // Same 1000-result pagination ceiling GitHub enforces on every search endpoint.
    const maxPage = Math.max(1, Math.floor(1000 / safeLimit));
    const totalCount = data.total_count || 0;
    res.status(200).json({
      totalCount,
      page: safePage,
      hasMore: items.length === safeLimit && safePage < maxPage && safePage * safeLimit < totalCount,
      repos
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach GitHub: ' + err.message });
  }
}
