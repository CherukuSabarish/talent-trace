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
  // IMPORTANT — field names and operators below are validated against Crustdata's
  // actual /person/search (v2025-11-01) schema and error responses. Do not "clean up"
  // or "simplify" these without re-testing against a live call — several of these
  // exact names were only discovered by triggering Crustdata's "Unsupported filter
  // field" error and reading its returned list of valid fields:
  //   - filters.type must be one of: =, !=, <, =<, >, =>, in, not_in, (.), (!), [.],
  //     geo_distance, geo_exclude, has_all — 'contains'/'gte'/'lte'/'equals' are NOT
  //     valid and will 400. Use '[.]' for substring/text matching, '=>' for >=, '=<'
  //     for <=, and '=' for exact match.
  //   - Location is 'basic_profile.location' (a free-text field) — NOT 'location.raw'
  //     or 'professional_network.location.raw' (both rejected as unsupported).
  //   - Current company is 'experience.employment_details.current.company_name' — NOT
  //     '...current.company' (rejected as unsupported).
  //   - Skills is 'skills.professional_network_skills' — NOT bare 'skills' (rejected).
  //   - Years of experience is the TOP-LEVEL field 'years_of_experience_raw' — NOT
  //     nested under 'experience.total_years_of_experience'.
  //   - Seniority is nested: 'experience.employment_details.current.seniority_level' —
  //     NOT a top-level 'seniority_level' field.
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
      field: 'basic_profile.location',
      type: '[.]',
      value: String(location).trim()
    });
  }

  // Current company(s) — comma-separated list ORed together, same pattern as mustSkills below
  if (currentCompany && String(currentCompany).trim()) {
    const companyList = String(currentCompany).split(',').map(s => s.trim()).filter(Boolean);
    if (companyList.length === 1) {
      conditions.push({ field: 'experience.employment_details.current.company_name', type: '[.]', value: companyList[0] });
    } else if (companyList.length > 1) {
      conditions.push({
        op: 'or',
        conditions: companyList.map(c => ({ field: 'experience.employment_details.current.company_name', type: '[.]', value: c }))
      });
    }
  }

  // Must-have skills — OR across each skill
  if (mustSkills && String(mustSkills).trim()) {
    const skillsList = String(mustSkills).split(',').map(s => s.trim()).filter(Boolean);
    if (skillsList.length === 1) {
      conditions.push({ field: 'skills.professional_network_skills', type: '[.]', value: skillsList[0] });
    } else if (skillsList.length > 1) {
      conditions.push({
        op: 'or',
        conditions: skillsList.map(s => ({ field: 'skills.professional_network_skills', type: '[.]', value: s }))
      });
    }
  }

  // Experience range (years) — top-level field, not nested under experience.*
  const minExpNum = parseInt(minExp, 10);
  const maxExpNum = parseInt(maxExp, 10);
  if (!isNaN(minExpNum) && minExpNum > 0) {
    conditions.push({ field: 'years_of_experience_raw', type: '=>', value: minExpNum });
  }
  if (!isNaN(maxExpNum) && maxExpNum > 0) {
    conditions.push({ field: 'years_of_experience_raw', type: '=<', value: maxExpNum });
  }

  // Seniority level — nested under current employment, not a top-level field
  if (seniority && String(seniority).trim()) {
    conditions.push({ field: 'experience.employment_details.current.seniority_level', type: '=', value: String(seniority).trim() });
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
