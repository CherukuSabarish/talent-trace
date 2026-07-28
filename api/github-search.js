// api/github-search.js — TalentTrace
// Proxies candidate search to GitHub's Search Users API. Same server-side-key model
// as crustdata-search.js — the token lives only in this serverless function's
// environment (GITHUB_TOKEN, set in Vercel Project Settings → Environment Variables)
// and never reaches the browser.
//
// Flow: 1) GET /search/users with qualifiers built from the form fields.
//       2) The search result only has login/avatar/html_url, so we enrich each hit
//          with GET /users/{login} (name, company, location, bio, public email,
//          followers, repos) — fetched in parallel, capped at 30 per request.
//
// Docs: https://docs.github.com/en/rest/search/search#search-users
//       https://docs.github.com/en/search-github/searching-on-github/searching-users

const GITHUB_API = 'https://api.github.com';
const MAX_RESULTS = 30; // per-request cap — each result costs one extra enrich call

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

  const { keywords, language, location, minFollowers, minRepos, limit, page } = req.body || {};

  // Build the search qualifier string. Keywords match login/name/bio/email by default.
  const parts = [];
  if (keywords && String(keywords).trim()) parts.push(String(keywords).trim());
  if (language && String(language).trim()) {
    // GitHub's language qualifier takes one language at a time; multiple are ANDed,
    // which is usually what a recruiter means ("knows Go AND Python").
    String(language).split(',').map(s => s.trim()).filter(Boolean)
      .forEach(l => parts.push('language:"' + l.replace(/"/g, '') + '"'));
  }
  if (location && String(location).trim()) {
    String(location).split(',').map(s => s.trim()).filter(Boolean)
      .forEach(l => parts.push('location:"' + l.replace(/"/g, '') + '"'));
  }
  const minF = parseInt(minFollowers, 10);
  if (!isNaN(minF) && minF > 0) parts.push('followers:>=' + minF);
  const minR = parseInt(minRepos, 10);
  if (!isNaN(minR) && minR > 0) parts.push('repos:>=' + minR);
  parts.push('type:user'); // people, not orgs

  // Require at least one real search term besides type:user
  if (parts.length <= 1) {
    res.status(400).json({ error: 'Provide at least one of: keywords, language, or location.' });
    return;
  }

  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), MAX_RESULTS);
  // GitHub's Search API refuses to paginate past the first 1000 results, so cap the
  // page number at whatever stays inside that window for this page size.
  const maxPage = Math.max(1, Math.floor(1000 / safeLimit));
  const safePage = Math.min(Math.max(parseInt(page, 10) || 1, 1), maxPage);
  const q = parts.join(' ');

  const ghHeaders = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'TalentTrace'
  };

  try {
    const searchUrl = GITHUB_API + '/search/users?q=' + encodeURIComponent(q) +
      '&sort=followers&order=desc&per_page=' + safeLimit + '&page=' + safePage;
    const searchRes = await fetch(searchUrl, { headers: ghHeaders });
    const searchData = await searchRes.json().catch(() => ({}));

    if (!searchRes.ok) {
      // GitHub 422s on bad qualifiers with a message + errors[]; 403 on rate limit.
      const detail = Array.isArray(searchData.errors) && searchData.errors.length
        ? ' — ' + searchData.errors.map(e => e.message || e.code).filter(Boolean).join('; ')
        : '';
      res.status(searchRes.status).json({
        error: (searchData.message || ('GitHub search failed (HTTP ' + searchRes.status + ')')) + detail
      });
      return;
    }

    const items = Array.isArray(searchData.items) ? searchData.items : [];

    // Enrich each hit with the full user profile (parallel; individual failures
    // degrade to the bare search result instead of failing the whole request).
    const profiles = await Promise.all(items.map(async (item) => {
      let u = {};
      try {
        const uRes = await fetch(GITHUB_API + '/users/' + encodeURIComponent(item.login), { headers: ghHeaders });
        if (uRes.ok) u = await uRes.json();
      } catch (e) { /* keep bare result */ }
      return {
        login: item.login,
        name: u.name || '',
        url: item.html_url,
        avatar: item.avatar_url,
        company: u.company || '',
        location: u.location || '',
        bio: u.bio || '',
        email: u.email || '',           // only if the user made it public
        blog: u.blog || '',
        followers: u.followers ?? null,
        publicRepos: u.public_repos ?? null,
        hireable: u.hireable === true
      };
    }));

    const total = searchData.total_count || 0;
    res.status(200).json({
      totalCount: total,
      page: safePage,
      // False once we've served the last page of matches, or hit GitHub's 1000-result
      // pagination ceiling — the client uses this to hide its "Load More" button.
      hasMore: items.length === safeLimit && safePage < maxPage && safePage * safeLimit < total,
      profiles
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach GitHub: ' + err.message });
  }
}
