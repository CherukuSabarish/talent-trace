// api/crustdata-search.js — TalentTrace v8
// Proxies people search to Crustdata's REST API. The API key lives only in this
// serverless function's environment (CRUSTDATA_API_KEY, set in Vercel Project
// Settings → Environment Variables) — it never reaches the browser, and since this
// runs same-origin with the dashboard, there's no CORS problem calling it from the UI.
//
// Docs: https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting

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
      error: 'CRUSTDATA_API_KEY is not configured on the server. Add it in Vercel → Project Settings → Environment Variables, then redeploy.'
    });
    return;
  }

  const { title, location, limit } = req.body || {};
  if (!title || !String(title).trim()) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  // ASSUMPTION FLAGGED: Crustdata's docs only confirm an exact-match ("=") filter
  // example on experience.employment_details.current.title — exact match on a job
  // title is nearly useless for sourcing ("SRE" won't match "Site Reliability
  // Engineer"). "contains" is the standard operator name for this kind of filter API,
  // so that's what's used here, but it isn't in their documented example. If a search
  // 400s, Crustdata's error body names the valid operator enum — this is the one
  // object to adjust. location.raw is similarly inferred from the /person/enrich
  // response shape (basic_profile.location.raw), not from a confirmed search-filter
  // field example.
  const titleCondition = {
    field: 'experience.employment_details.current.title',
    type: 'contains',
    value: String(title).trim()
  };
  const filters = location && String(location).trim()
    ? { and: [titleCondition, { field: 'location.raw', type: 'contains', value: String(location).trim() }] }
    : titleCondition;

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
      res.status(crustRes.status).json({
        error: data.description || data.reason || data.error || ('Crustdata search failed (HTTP ' + crustRes.status + ')')
      });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Crustdata: ' + err.message });
  }
}
