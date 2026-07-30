// api/anthropic-chat.js — TalentTrace
// Server-side proxy for Claude calls used by JD Analyzer, Intake, and Market
// Intelligence. Previously these three called https://api.anthropic.com/v1/messages
// directly from the browser using a key the end user pasted into the page and
// stored in their own localStorage (a deliberate, documented pattern — see
// CLAUDE.md). This endpoint replaces that: the key now lives once, server-side,
// as ANTHROPIC_API_KEY in Vercel → Project Settings → Environment Variables, and
// never reaches the browser at all. Same server-side-key model as the other
// api/*.js functions in this project (crustdata-search.js, github-search.js, etc.)
// — GITHUB_TOKEN/CRUSTDATA_API_KEY never reach the browser either.
//
// Trade-off worth knowing: this is now one shared Anthropic key/bill for every
// user of the app, with no per-user isolation or quota. If usage grows, add
// rate limiting here.
//
// Docs: https://docs.claude.com/en/api/messages

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-opus-4-5';
const MAX_TOKENS_CEILING = 4000; // guard against a runaway request driving up the shared bill

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST.' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not configured. Add it in Vercel → Project Settings → Environment Variables, then redeploy.'
    });
    return;
  }

  const { messages, system, max_tokens } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) {
    res.status(400).json({ error: 'messages (non-empty array) is required.' });
    return;
  }

  const safeMaxTokens = Math.min(Math.max(parseInt(max_tokens, 10) || 1500, 1), MAX_TOKENS_CEILING);

  try {
    const r = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: safeMaxTokens,
        ...(system ? { system } : {}),
        messages
      })
    });
    const data = await r.json().catch(() => ({}));

    if (!r.ok || data.error) {
      res.status(r.status || 502).json({
        error: (data.error && (data.error.message || JSON.stringify(data.error))) || ('Claude API request failed (HTTP ' + r.status + ')')
      });
      return;
    }

    res.status(200).json({ text: data.content?.[0]?.text || '' });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Anthropic: ' + err.message });
  }
}
