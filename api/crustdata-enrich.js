// api/crustdata-enrich.js — TalentTrace v8
// Proxies profile + contact enrichment to Crustdata's REST API for a batch of LinkedIn
// URLs (max 25 per Crustdata's own limit). Same server-side-key model as
// crustdata-search.js — see that file for why this runs as a serverless function
// instead of calling api.crustdata.com from the browser.
//
// Docs: https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset
//       https://docs.crustdata.com/api-reference/person-apis/enrich-only-person-contact-data-from-cached-dataset

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

  const { urls } = req.body || {};
  if (!Array.isArray(urls) || !urls.length) {
    res.status(400).json({ error: 'urls[] is required' });
    return;
  }
  if (urls.length > 25) {
    res.status(400).json({ error: 'Max 25 URLs per enrich batch (Crustdata API limit) — the dashboard should already be chunking these.' });
    return;
  }

  const headers = {
    'Authorization': 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
    'x-api-version': CRUSTDATA_API_VERSION
  };

  try {
    const [enrichRes, contactRes] = await Promise.all([
      fetch(CRUSTDATA_BASE + '/person/enrich', {
        method: 'POST',
        headers,
        body: JSON.stringify({ professional_network_profile_urls: urls, fields: ['basic_profile', 'experience'] })
      }),
      fetch(CRUSTDATA_BASE + '/person/contact/enrich', {
        method: 'POST',
        headers,
        body: JSON.stringify({ professional_network_profile_urls: urls })
      })
    ]);

    const [enrichData, contactData] = await Promise.all([
      enrichRes.json().catch(() => ({})),
      contactRes.json().catch(() => ({}))
    ]);

    if (!enrichRes.ok && !contactRes.ok) {
      res.status(enrichRes.status).json({
        error: enrichData.description || enrichData.reason || enrichData.error || 'Crustdata enrich failed'
      });
      return;
    }

    // Partial success is normal (e.g. contact data can be missing for a profile that
    // still enriches fine) — return whichever side succeeded and an empty array for
    // the side that didn't, so the caller can merge what's available.
    res.status(200).json({
      enrich: enrichRes.ok ? enrichData : [],
      contact: contactRes.ok ? contactData : []
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Crustdata: ' + err.message });
  }
}
