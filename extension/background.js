// TalentTrace 2.0 extension - background worker.
// Keeps the settings and the "collected" lists, and does the actual send to the
// Google Sheet's Apps Script URL (the extension is allowed to call script.google.com
// directly, so there are no browser CORS problems here).

const DEFAULTS = {
  webhook: '',
  defaultRole: '',
  defaultExp: '',
  profilesOnly: true,   // skip Google results that aren't person profiles (repos, blog posts...)
  autoCollect: true     // add each results page to the list as you open it
};
const MAX_CONTEXTS = 60;

// One list per Google search string: { [query]: { items: { [key]: profile }, pages: [n], updatedAt } }
async function getBaskets() {
  const { baskets } = await chrome.storage.local.get('baskets');
  return baskets || {};
}
async function setBaskets(b) { await chrome.storage.local.set({ baskets: b }); }

async function getSettings() {
  const s = await chrome.storage.local.get(Object.keys(DEFAULTS));
  return Object.assign({}, DEFAULTS, s);
}

// Role/experience for searches opened from the Talent Trace Boolean Builder.
async function getContexts() {
  const { contexts } = await chrome.storage.local.get('contexts');
  return contexts || {};
}

function normQuery(q) {
  return String(q || '').replace(/\s+/g, ' ').trim();
}

function profileKey(p) {
  let u = String(p.url || '').trim().toLowerCase();
  u = u.replace(/^https?:\/\//, '').replace(/[?#].*$/, '').replace(/\/+$/, '').replace(/^www\./, '');
  u = u.replace(/^[a-z]{2,3}\.linkedin\.com/, 'linkedin.com');
  return u;
}

function isValidWebhook(url) {
  return /^https:\/\/script\.google\.com\/(a\/macros\/[^/]+\/|macros\/)s\/[^/]+\/(exec|dev)\b/.test(String(url || '').trim());
}

async function contextFor(query) {
  const contexts = await getContexts();
  const settings = await getSettings();
  const c = contexts[normQuery(query)] || {};
  return {
    role: c.role || settings.defaultRole || '',
    expRange: c.expRange || settings.defaultExp || '',
    platform: c.platform || '',
    fromApp: !!contexts[normQuery(query)]
  };
}

async function state(query) {
  const q = normQuery(query);
  const baskets = await getBaskets();
  const b = baskets[q] || { items: {}, pages: [] };
  const settings = await getSettings();
  return {
    count: Object.keys(b.items).length,
    pages: (b.pages || []).slice().sort((a, b2) => a - b2),
    context: await contextFor(q),
    hasWebhook: !!settings.webhook,
    settings
  };
}

async function collect(query, items, page) {
  const q = normQuery(query);
  if (!q) return state(q);
  const baskets = await getBaskets();
  const b = baskets[q] || { items: {}, pages: [] };
  (items || []).forEach((p) => {
    const k = profileKey(p);
    if (k && !b.items[k]) b.items[k] = p;
  });
  if (page && b.pages.indexOf(page) === -1) b.pages.push(page);
  b.updatedAt = Date.now();
  baskets[q] = b;
  await setBaskets(baskets);
  return state(q);
}

async function postToSheet(webhook, payload) {
  let res;
  try {
    res = await fetch(webhook, {
      method: 'POST',
      // Same as the app: plain text body holding JSON, which Apps Script reads
      // with JSON.parse(e.postData.contents).
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
  } catch (e) {
    throw new Error('Could not reach your Google Sheet script. Check your internet connection and the Sheet URL.');
  }
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch (e) {
    if (/<html|<!doctype/i.test(text)) {
      throw new Error('Google asked for a sign-in instead of saving. Redeploy the Apps Script with "Who has access: Anyone".');
    }
    throw new Error('The Sheet script sent back something unexpected (HTTP ' + res.status + ').');
  }
  if (data.status !== 'ok') throw new Error(data.message || 'The Sheet script reported an error.');
  return data;
}

async function send(query, roleOverride, expOverride) {
  const q = normQuery(query);
  const settings = await getSettings();
  if (!settings.webhook) throw new Error('No Google Sheet URL yet. Click the Talent Trace icon in the toolbar and paste it, or save it once in the Talent Trace app.');
  if (!isValidWebhook(settings.webhook)) throw new Error('The saved Sheet URL does not look like an Apps Script web app URL (it should end in /exec).');

  const baskets = await getBaskets();
  const b = baskets[q];
  const profiles = b ? Object.values(b.items) : [];
  if (!profiles.length) throw new Error('Nothing collected for this search yet.');

  const ctx = await contextFor(q);
  const role = (roleOverride || ctx.role || 'General').trim();
  const expRange = (expOverride !== undefined ? expOverride : ctx.expRange) || '';

  const result = await postToSheet(settings.webhook, {
    profiles,
    role,
    expRange,
    searchString: q
  });

  // Sent - empty this search's list so the next send only has new pages.
  delete baskets[q];
  await setBaskets(baskets);
  return { added: result.added, skipped: result.skipped, role: result.role || role };
}

async function remember(query, role, expRange, platform) {
  const q = normQuery(query);
  if (!q) return;
  const contexts = await getContexts();
  contexts[q] = Object.assign({}, contexts[q] || {}, {
    role: role !== undefined ? role : (contexts[q] || {}).role,
    expRange: expRange !== undefined ? expRange : (contexts[q] || {}).expRange,
    platform: platform || (contexts[q] || {}).platform || '',
    at: Date.now()
  });
  // Keep only the most recent searches.
  const keys = Object.keys(contexts).sort((a, b) => (contexts[b].at || 0) - (contexts[a].at || 0));
  keys.slice(MAX_CONTEXTS).forEach((k) => delete contexts[k]);
  await chrome.storage.local.set({ contexts });
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  (async () => {
    switch (msg && msg.type) {
      case 'tt-set-webhook':
        if (isValidWebhook(msg.url)) await chrome.storage.local.set({ webhook: msg.url.trim() });
        return { ok: true };
      case 'tt-xray-context':
        await remember(msg.query, msg.role || '', msg.expRange || '', msg.platform || '');
        return { ok: true };
      case 'tt-set-role':
        await remember(msg.query, msg.role, msg.expRange);
        return { ok: true };
      case 'tt-collect':
        return { ok: true, state: await collect(msg.query, msg.items, msg.page) };
      case 'tt-state':
        return { ok: true, state: await state(msg.query) };
      case 'tt-clear': {
        const baskets = await getBaskets();
        delete baskets[normQuery(msg.query)];
        await setBaskets(baskets);
        return { ok: true, state: await state(msg.query) };
      }
      case 'tt-send':
        return { ok: true, result: await send(msg.query, msg.role, msg.expRange) };
      case 'tt-list': {
        const baskets = await getBaskets();
        const contexts = await getContexts();
        return {
          ok: true,
          lists: Object.keys(baskets).map((q) => ({
            query: q,
            count: Object.keys(baskets[q].items).length,
            pages: baskets[q].pages || [],
            role: (contexts[q] || {}).role || '',
            updatedAt: baskets[q].updatedAt || 0
          })).sort((a, b) => b.updatedAt - a.updatedAt)
        };
      }
      case 'tt-test': {
        const url = (msg.url || (await getSettings()).webhook || '').trim();
        if (!isValidWebhook(url)) throw new Error('That does not look like an Apps Script web app URL (it should start with https://script.google.com/ and end in /exec).');
        let res;
        try { res = await fetch(url, { redirect: 'follow' }); }
        catch (e) { throw new Error('Could not reach that URL.'); }
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch (e) {
          if (/doGet/.test(text)) throw new Error('Connected, but this is an older Sheet script. Paste in the TalentTrace 2.0 script and deploy a new version.');
          throw new Error('Reached Google, but the script is not shared with "Anyone" (it asked for a sign-in).');
        }
        if (data.app !== 'TalentTrace 2.0 Sheet') {
          throw new Error('Connected, but this is an older Sheet script. Paste in the TalentTrace 2.0 script and deploy a new version.');
        }
        return { ok: true, info: data };
      }
      default:
        return { ok: false, error: 'Unknown request' };
    }
  })().then(reply, (err) => reply({ ok: false, error: String(err && err.message || err) }));
  return true; // keep the channel open for the async reply
});
