// api/crustdata-search.js — TalentTrace v9
// Proxies people search to Crustdata's REST API. The API key lives only in this
// serverless function's environment (CRUSTDATA_API_KEY, set in Vercel Project
// Settings → Environment Variables) — it never reaches the browser.

const CRUSTDATA_BASE = 'https://api.crustdata.com';
const CRUSTDATA_API_VERSION = '2025-11-01';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST.' });
    return;
  }

  const apiKey = process.env.CRUSTDATA_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'CRUSTDATA_API_KEY is not configured. Add it in Vercel → Project Settings → Environment Variables, then redeploy.'
    });
    return;
  }

  const { title, location, limit, mustSkills, currentCompany, minExp, maxExp, seniority } = req.body || {};

  if (!title || !String(title).trim()) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  // Build filter conditions array.
  //
  // IMPORTANT — validated against Crustdata's actual error responses (do not "clean up"
  // these without re-testing against a live call):
  //   - filters.type must be one of: =, !=, <, =<, >, =>, in, not_in, (.), (!), [.],
  //     geo_distance, geo_exclude, has_all — 'contains'/'gte'/'lte'/'equals' are NOT
  //     valid and will 400. Use '[.]' for substring/text matching, '=>' for >=, '=<'
  //     for <=, and '=' for exact match.
  //   - 'location.raw' is not a valid top-level field — Crustdata's "Unsupported
  //     filter field" response confirms the real field is nested under
  //     'professional_network.location.raw'.
  //   - The filters payload must always be wrapped as { op, conditions: [...] }, even
  //     for a single condition — a bare condition object 400s with
  //     "Missing required field: filters.op". This applies to OR-groups too.
  const conditions = [];

  // Job title (required)
  conditions.push({
    field: 'experience.employment_details.current.title',
    type: '[.]',
    value: String(title).trim()
  });

  // Location
  if (location && String(location).trim()) {
    conditions.push({
      field: 'professional_network.location.raw',
      type: '[.]',
      value: String(location).trim()
    });
  }

  // Current company(s) — comma-separated list ORed together, same pattern as mustSkills below
  if (currentCompany && String(currentCompany).trim()) {
    const companyList = String(currentCompany).split(',').map(s => s.trim()).filter(Boolean);
    if (companyList.length === 1) {
      conditions.push({ field: 'experience.employment_details.current.company', type: '[.]', value: companyList[0] });
    } else if (companyList.length > 1) {
      conditions.push({
        op: 'or',
        conditions: companyList.map(c => ({ field: 'experience.employment_details.current.company', type: '[.]', value: c }))
      });
    }
  }

  // Must-have skills — OR across each skill
  if (mustSkills && String(mustSkills).trim()) {
    const skillsList = String(mustSkills).split(',').map(s => s.trim()).filter(Boolean);
    if (skillsList.length === 1) {
      conditions.push({ field: 'skills', type: '[.]', value: skillsList[0] });
    } else if (skillsList.length > 1) {
      conditions.push({
        op: 'or',
        conditions: skillsList.map(s => ({ field: 'skills', type: '[.]', value: s }))
      });
    }
  }

  // Experience range (years)
  const minExpNum = parseInt(minExp, 10);
  const maxExpNum = parseInt(maxExp, 10);
  if (!isNaN(minExpNum) && minExpNum > 0) {
    conditions.push({ field: 'experience.total_years_of_experience', type: '=>', value: minExpNum });
  }
  if (!isNaN(maxExpNum) && maxExpNum > 0) {
    conditions.push({ field: 'experience.total_years_of_experience', type: '=<', value: maxExpNum });
  }

  // Seniority level — Crustdata field name inferred; adjust if it 400s
  if (seniority && String(seniority).trim()) {
    conditions.push({ field: 'seniority_level', type: '=', value: String(seniority).trim() });
  }

  const filters = { op: 'and', conditions };

  try {
    const crustRes = await fetch(CRUSTDATA_BASE + '/person/search', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'x-api-version': CRUSTDATA_API_VERSION
      },
      body: JSON.stringify({ filters, limit: safeLimit })
    });
    const data = await crustRes.json().catch(() => ({}));

    if (!crustRes.ok) {
      // Crustdata's error field is sometimes a string, sometimes a structured object —
      // never assume it's a string, or the frontend ends up displaying "[object Object]".
      const rawError = data.description || data.reason || data.error;
      const message = typeof rawError === 'string'
        ? rawError
        : (rawError && rawError.message) || (rawError ? JSON.stringify(rawError) : ('Crustdata search failed (HTTP ' + crustRes.status + ')'));
      res.status(crustRes.status).json({ error: message });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Crustdata: ' + err.message });
  }
}
