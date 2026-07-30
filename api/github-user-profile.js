// api/github-user-profile.js — TalentTrace
// Fetches one GitHub user's full public profile (name, company, location, bio,
// public email, followers, repos, join date). Used by the frontend's "Enrich
// Profiles" bulk action to fill in a repo-extracted contributor's details lazily,
// a small batch at a time, rather than api/github-repo-contributors.js doing it
// eagerly for every contributor in one shot (see that file's header comment for
// why: timeout risk on a big repo, and no visibility for the user into the work).
// Same server-side-key model as the other api/github-*.js functions — GITHUB_TOKEN
// never reaches the browser.
//
// Docs: https://docs.github.com/en/rest/users/users#get-a-user

const GITHUB_API = 'https://api.github.com';

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

  const { login } = req.body || {};
  if (!login || !String(login).trim()) {
    res.status(400).json({ error: 'login is required.' });
    return;
  }

  const ghHeaders = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'TalentTrace'
  };

  try {
    const r = await fetch(GITHUB_API + '/users/' + encodeURIComponent(String(login).trim()), { headers: ghHeaders });
    const u = await r.json().catch(() => ({}));

    if (!r.ok) {
      res.status(r.status).json({
        error: u.message || ('Could not load @' + login + ' (HTTP ' + r.status + ')')
      });
      return;
    }

    res.status(200).json({
      name: u.name || '',
      company: u.company || '',
      location: u.location || '',
      bio: u.bio || '',
      email: u.email || '',           // only if the user made it public
      blog: u.blog || '',
      followers: u.followers ?? null,
      publicRepos: u.public_repos ?? null,
      joinedAt: u.created_at || null,
      hireable: u.hireable === true
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach GitHub: ' + err.message });
  }
}
