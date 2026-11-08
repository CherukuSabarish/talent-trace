// Runs on the Talent Trace app pages. It lets the app and the extension share:
//   - the Google Sheet (Apps Script) URL you saved in the app, so you only paste it once
//   - the role tag / experience of the X-ray search you just opened from the Boolean
//     Builder, so the Google results land in the right Sheet tab automatically.
// It only reads Talent Trace's own "tt_" settings, and only on Talent Trace's own
// addresses (the live site and its Vercel previews) - any other *.vercel.app site is
// ignored straight away.
(function () {
  const host = location.hostname;
  const isTalentTrace =
    host === 'akamai-talent-trace.vercel.app' ||
    /^deploypackage-[a-z0-9-]+-cherukusabarishs-projects\.vercel\.app$/.test(host);
  if (!isTalentTrace) return;

  // Lets the app show "extension connected".
  document.documentElement.setAttribute('data-tt-extension', chrome.runtime.getManifest().version);

  function send(msg) {
    try { chrome.runtime.sendMessage(msg); } catch (e) { /* extension was reloaded; ignore */ }
  }

  function readLocal(key) {
    try { return localStorage.getItem(key) || ''; } catch (e) { return ''; }
  }

  // Webhook already saved in the app from an earlier visit.
  const saved = readLocal('tt_gh_webhook') || readLocal('tt_cd_webhook');
  if (saved) send({ type: 'tt-set-webhook', url: saved, from: 'app' });

  // Live messages from the app page (see ttTellExtension() in index.html).
  window.addEventListener('message', (ev) => {
    if (ev.source !== window || !ev.data || ev.data.source !== 'talent-trace-app') return;
    const d = ev.data;
    if (d.type === 'webhook' && d.url) send({ type: 'tt-set-webhook', url: d.url, from: 'app' });
    if (d.type === 'xray-open' && d.query) {
      send({ type: 'tt-xray-context', query: d.query, role: d.role || '', expRange: d.expRange || '', platform: d.platform || '' });
    }
  });
})();
