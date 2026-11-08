// TalentTrace 2.0 extension - runs on Google search result pages.
// Reads the organic results on the page, picks out LinkedIn / Stack Overflow /
// GitHub profiles, adds them to this search's list, and shows a small
// "Send to Sheet" panel in the bottom-right corner.
(function () {
  if (window.__ttLoaded) return;
  window.__ttLoaded = true;

  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').replace(/\s+/g, ' ').trim();
  if (!query) return;
  // Only the normal "All" results tab - not Images, News, Shopping etc.
  const tbm = params.get('tbm') || params.get('udm');
  if (tbm && tbm !== '14' && tbm !== 'web') return;
  const page = Math.floor((parseInt(params.get('start') || '0', 10) || 0) / 10) + 1;

  // ── Talking to the background worker ─────────────────────────────
  function ask(msg) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(msg, (r) => {
          if (chrome.runtime.lastError) resolve({ ok: false, error: 'The extension was updated - reload this page.' });
          else resolve(r || { ok: false, error: 'No reply' });
        });
      } catch (e) {
        resolve({ ok: false, error: 'The extension was updated - reload this page.' });
      }
    });
  }

  // ── Reading results ──────────────────────────────────────────────
  const GH_RESERVED = new Set(['about', 'apps', 'blog', 'collections', 'contact', 'customer-stories', 'enterprise',
    'events', 'explore', 'features', 'issues', 'login', 'marketplace', 'new', 'notifications', 'orgs', 'organizations',
    'pricing', 'pulls', 'search', 'security', 'settings', 'site', 'sponsors', 'team', 'topics', 'trending', 'join',
    'readme', 'resources', 'solutions', 'signup', 'mobile', 'codespaces', 'copilot', 'premium-support', 'github']);

  function text(el) { return el ? (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

  function cleanUrl(href) {
    try {
      const u = new URL(href, location.href);
      // Google sometimes wraps links as /url?q=<real link>
      if (/google\./.test(u.hostname) && u.pathname === '/url') return cleanUrl(u.searchParams.get('q') || u.searchParams.get('url') || '');
      u.hash = '';
      // Tracking params aren't part of a profile address.
      ['trk', 'originalSubdomain', 'original_referer', 'utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => u.searchParams.delete(k));
      return u.toString();
    } catch (e) { return ''; }
  }

  function platformOf(url) {
    let u;
    try { u = new URL(url); } catch (e) { return null; }
    const host = u.hostname.replace(/^www\./, '');
    const parts = u.pathname.split('/').filter(Boolean);
    if (/(^|\.)linkedin\.com$/.test(host)) {
      return { source: 'LinkedIn', profile: parts[0] === 'in' && !!parts[1] };
    }
    if (/(^|\.)stackoverflow\.com$/.test(host) || /(^|\.)stackexchange\.com$/.test(host)) {
      return { source: 'StackOverflow', profile: parts[0] === 'users' && /^\d+$/.test(parts[1] || '') };
    }
    if (host === 'github.com') {
      // A repo page (github.com/jane/project) still points at a person, so it's
      // collected as that person's profile, like the old v1.6 extension did.
      const login = parts[0] || '';
      const profile = !!login && !GH_RESERVED.has(login.toLowerCase()) && /^[a-z0-9-]+$/i.test(login);
      return { source: 'GitHub', profile, login: profile ? login : '', profileUrl: profile ? 'https://github.com/' + login : '' };
    }
    return { source: host, profile: false };
  }

  // "Jane Doe - Senior SRE - Akamai Technologies | LinkedIn" → parts
  function splitTitle(t) {
    return t.replace(/\s*[|·]\s*LinkedIn\s*$/i, '').replace(/\s+-\s+LinkedIn\s*$/i, '')
      .split(/\s+[-–—|]\s+/).map((s) => s.trim()).filter(Boolean);
  }

  function findSnippet(container, title) {
    const el = container.querySelector('.VwiC3b, [data-sncf="1"], [data-snf], div[style*="-webkit-line-clamp"]');
    let s = text(el);
    if (!s) {
      s = text(container).replace(title, '').trim();
    }
    return s.slice(0, 500);
  }

  // LinkedIn results often have a grey line like
  // "Bengaluru, Karnataka, India · Senior Engineer · Akamai Technologies"
  function findMetaLine(container, snippet) {
    const cands = Array.from(container.querySelectorAll('span, div')).filter((el) => {
      if (el.children.length > 3) return false;
      const t = text(el);
      return t.length > 5 && t.length < 200 && t.indexOf('·') !== -1 && (!snippet || snippet.indexOf(t) === -1);
    });
    return cands.length ? text(cands[cands.length - 1]) : '';
  }

  function parseLinkedIn(title, snippet, meta, item) {
    const parts = splitTitle(title);
    item.name = parts[0] || '';
    item.jobTitle = parts[1] || '';
    item.company = parts[2] || '';
    const segs = meta.split('·').map((s) => s.trim()).filter(Boolean);
    segs.forEach((s) => {
      if (!item.location && /,|india|area|region|metropolitan/i.test(s) && !/\d+\+? (followers|connections)/i.test(s)) item.location = s;
    });
    if (!item.company && segs.length >= 3) item.company = segs[2];
    if (!item.jobTitle && segs.length >= 2) item.jobTitle = segs[1];
    const loc = snippet.match(/Location:\s*([^·|]+?)(?:\s*[·|]|\s+\d+\+? connections|$)/i);
    if (loc && !item.location) item.location = loc[1].trim();
    const exp = snippet.match(/Experience:\s*([^·|]+?)(?:\s*[·|]|$)/i);
    if (exp && !item.company) item.company = exp[1].trim();
  }

  function parseStackOverflow(title, snippet, item) {
    item.name = title.replace(/\s+-\s+Stack (Overflow|Exchange).*$/i, '').replace(/^User\s+/i, '').trim();
    // The Sheet's "Company / Score" column holds reputation for Stack Overflow people.
    const rep = snippet.match(/([\d,.]+[kKmM]?)\s*reputation/i);
    if (rep) item.company = rep[1] + ' rep';
    const loc = snippet.match(/(?:^|[.·]\s*)([A-Z][A-Za-z .'-]+,\s*[A-Z][A-Za-z .'-]+(?:,\s*[A-Z][A-Za-z .'-]+)?)(?=\s*[.·]|$)/);
    if (loc) item.location = loc[1].trim();
  }

  function parseGitHub(title, snippet, item, login) {
    const t = title.replace(/\s*[·\-]\s*GitHub\s*$/i, '').replace(/\s+-\s+Overview\s*$/i, '').trim();
    let m = t.match(/^(\S+)\s+\((.+)\)$/);         // "janedoe (Jane Doe)"
    if (m) item.name = m[2];
    else {
      m = t.match(/^(.+?)\s+(\S+)$/);               // "Jane Doe janedoe"
      item.name = m && m[2].toLowerCase() === login.toLowerCase() ? m[1] : t;
    }
    if (!item.name || item.name.toLowerCase() === login.toLowerCase()) item.name = item.name || login;
    item.githubLogin = login;
    const f = snippet.match(/([\d.,]+k?)\s+followers/i);
    if (f) {
      let n = f[1].toLowerCase().replace(/,/g, '');
      item.followers = n.endsWith('k') ? Math.round(parseFloat(n) * 1000) : parseInt(n, 10);
    }
  }

  function readResults(profilesOnly) {
    const root = document.querySelector('#rso') || document.querySelector('#search') || document.body;
    const seen = new Set();
    const out = [];
    root.querySelectorAll('a[href] h3').forEach((h3) => {
      const a = h3.closest('a');
      if (!a) return;
      let url = cleanUrl(a.getAttribute('href'));
      if (!url || /^https?:\/\/([a-z]+\.)?google\./.test(url)) return;
      const pl = platformOf(url);
      if (!pl) return;
      if (profilesOnly && !pl.profile) return;
      if (pl.profileUrl) url = pl.profileUrl;
      const seenKey = url.toLowerCase().replace(/\/+$/, '');
      if (seen.has(seenKey)) return;
      seen.add(seenKey);

      const container = a.closest('.MjjYud') || a.closest('div.g') || a.closest('[data-hveid]') || a.parentElement;
      const title = text(h3);
      const snippet = findSnippet(container, title);
      const item = {
        source: pl.source,
        name: '', jobTitle: '', company: '', location: '',
        url,
        snippet,
        searchString: query,
        scrapedAt: new Date().toISOString()
      };
      if (pl.source === 'LinkedIn') parseLinkedIn(title, snippet, findMetaLine(container, snippet), item);
      else if (pl.source === 'StackOverflow') parseStackOverflow(title, snippet, item);
      else if (pl.source === 'GitHub' && pl.login) {
        if (/github\.com\/[^/]+\/[^/]+/i.test(cleanUrl(a.getAttribute('href')))) {
          // Repo result: the title is the repo, not the person.
          item.name = pl.login;
          item.githubLogin = pl.login;
          item.snippet = ('Repo: ' + title + ' · ' + snippet).slice(0, 500);
        } else parseGitHub(title, snippet, item, pl.login);
      }
      else item.name = title;
      if (!item.name) item.name = title;
      out.push(item);
    });
    return out;
  }

  // ── Panel ────────────────────────────────────────────────────────
  let host, shadow, els = {};
  let lastState = null;
  let onPage = [];
  let minimized = false;

  function buildPanel() {
    host = document.createElement('div');
    host.id = 'talent-trace-panel';
    host.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:2147483646;';
    shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { all: initial; }
        .box { font: 13px/1.4 -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #1b2430;
               background: #fff; border: 1px solid #d6dde6; border-radius: 12px; width: 290px;
               box-shadow: 0 8px 28px rgba(11,47,91,.18); overflow: hidden; }
        .head { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: #0b2f5b; color: #fff; cursor: pointer; }
        .head b { flex: 1; font-size: 13px; }
        .head .x { font-size: 16px; opacity: .8; }
        .body { padding: 12px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .muted { color: #66717f; font-size: 12px; }
        label { display: block; font-size: 11px; color: #66717f; margin: 10px 0 3px; text-transform: uppercase; letter-spacing: .03em; }
        input { width: 100%; box-sizing: border-box; padding: 7px 9px; border: 1px solid #ccd5df; border-radius: 7px; font: inherit; }
        .two { display: flex; gap: 8px; } .two > div { flex: 1; }
        button { font: inherit; border-radius: 8px; padding: 8px 10px; cursor: pointer; border: 1px solid #ccd5df; background: #fff; }
        .send { width: 100%; margin-top: 12px; background: #ff9900; border-color: #ff9900; color: #1b2430; font-weight: 600; }
        .send:disabled { opacity: .5; cursor: default; }
        .links { display: flex; gap: 8px; margin-top: 8px; }
        .links button { flex: 1; font-size: 12px; padding: 6px; }
        .status { margin-top: 10px; font-size: 12px; padding: 7px 9px; border-radius: 7px; display: none; }
        .status.ok { display: block; background: #e7f6ec; color: #17663a; }
        .status.err { display: block; background: #fdecec; color: #9b1c1c; }
        .status.info { display: block; background: #eef3f9; color: #0b2f5b; }
        .pill { font: 600 13px -apple-system, "Segoe UI", Roboto, Arial, sans-serif; background: #0b2f5b; color: #fff; border: 0;
                border-radius: 999px; padding: 9px 14px; box-shadow: 0 6px 20px rgba(11,47,91,.25); cursor: pointer; }
      </style>
      <button class="pill" id="pill" style="display:none"></button>
      <div class="box" id="box">
        <div class="head" id="head"><b>📊 TalentTrace 2.0</b><span class="x" title="Minimise">–</span></div>
        <div class="body">
          <div class="row"><span>On this page</span><b id="onpage">0</b></div>
          <div class="row"><span>Collected for this search</span><b id="count">0</b></div>
          <div class="muted" id="pages"></div>
          <div class="two">
            <div><label>Role tag</label><input id="role" placeholder="e.g. SRE"></div>
            <div><label>Experience</label><input id="exp" placeholder="e.g. 3-8 yrs"></div>
          </div>
          <button class="send" id="send">Send to Google Sheet</button>
          <div class="links">
            <button id="add" title="Add this page's results to the list">＋ Add this page</button>
            <button id="clear" title="Empty the list for this search">Clear list</button>
          </div>
          <div class="status" id="status"></div>
        </div>
      </div>`;
    ['pill', 'box', 'head', 'onpage', 'count', 'pages', 'role', 'exp', 'send', 'add', 'clear', 'status']
      .forEach((id) => { els[id] = shadow.getElementById(id); });

    els.head.addEventListener('click', () => setMin(true));
    els.pill.addEventListener('click', () => setMin(false));
    els.add.addEventListener('click', () => addPage(true));
    els.clear.addEventListener('click', clearList);
    els.send.addEventListener('click', sendList);
    const saveRole = () => ask({ type: 'tt-set-role', query, role: els.role.value.trim(), expRange: els.exp.value.trim() });
    els.role.addEventListener('change', saveRole);
    els.exp.addEventListener('change', saveRole);
    document.documentElement.appendChild(host);
  }

  function setMin(v) {
    minimized = v;
    els.box.style.display = v ? 'none' : '';
    els.pill.style.display = v ? '' : 'none';
    try { sessionStorage.setItem('tt_panel_min', v ? '1' : ''); } catch (e) {}
  }

  function status(kind, msg) {
    els.status.className = 'status ' + (kind || '');
    els.status.textContent = msg || '';
  }

  function render(st) {
    lastState = st || lastState;
    if (!lastState) return;
    const n = lastState.count;
    els.onpage.textContent = onPage.length;
    els.count.textContent = n;
    els.pages.textContent = lastState.pages.length ? 'From page' + (lastState.pages.length > 1 ? 's ' : ' ') + lastState.pages.join(', ') +
      ' · open the next Google page to add more' : '';
    els.send.disabled = !n;
    els.send.textContent = n ? `Send ${n} to Google Sheet` : 'Send to Google Sheet';
    els.pill.textContent = `📊 ${n} ready for Sheet`;
    if (document.activeElement !== host) {
      if (!els.role.value) els.role.value = lastState.context.role || '';
      if (!els.exp.value) els.exp.value = lastState.context.expRange || '';
    }
    if (!lastState.hasWebhook) {
      status('info', 'Add your Google Sheet URL first: click the TalentTrace 2.0 icon in Chrome\'s toolbar (or save it once in the Talent Trace app).');
    }
  }

  async function addPage(manual) {
    const r = await ask({ type: 'tt-collect', query, items: onPage, page });
    if (!r.ok) { status('err', r.error); return; }
    render(r.state);
    if (manual) status('ok', `Added this page (${onPage.length} results).`);
  }

  async function clearList() {
    const r = await ask({ type: 'tt-clear', query });
    if (r.ok) { render(r.state); status('info', 'List cleared for this search.'); }
  }

  async function sendList() {
    els.send.disabled = true;
    status('info', 'Sending to your Google Sheet…');
    const r = await ask({ type: 'tt-send', query, role: els.role.value.trim(), expRange: els.exp.value.trim() });
    if (!r.ok) { status('err', r.error); els.send.disabled = false; return; }
    const res = r.result;
    status('ok', `✓ ${res.added} added to the "${res.role}" tab · ${res.skipped} already there`);
    const s = await ask({ type: 'tt-state', query });
    if (s.ok) { lastState = s.state; const keep = els.status.textContent; render(); status('ok', keep); }
  }

  // ── Start ───────────────────────────────────────────────────────
  async function scan() {
    const st0 = await ask({ type: 'tt-state', query });
    if (!st0.ok) return;
    const settings = st0.state.settings;
    onPage = readResults(settings.profilesOnly);
    // Stay out of the way on everyday Google searches: only show up when this page
    // has profiles, the search came from Talent Trace, or there's already a list.
    if (!onPage.length && !st0.state.count && !st0.state.context.fromApp) {
      if (host) host.style.display = 'none';
      return;
    }
    if (!host) buildPanel();
    host.style.display = '';
    let st = st0.state;
    if (settings.autoCollect && onPage.length) {
      const r = await ask({ type: 'tt-collect', query, items: onPage, page });
      if (r.ok) st = r.state;
    }
    render(st);
    let min = false;
    try { min = sessionStorage.getItem('tt_panel_min') === '1'; } catch (e) {}
    setMin(min);
  }

  scan();
  // Google sometimes fills results in after the page loads.
  let t;
  const mo = new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(async () => {
      const st = await ask({ type: 'tt-state', query });
      if (!st.ok) return;
      const fresh = readResults(st.state.settings.profilesOnly);
      if (fresh.length > onPage.length) scan();
    }, 800);
  });
  const root = document.querySelector('#rso') || document.querySelector('#search');
  if (root) mo.observe(root, { childList: true, subtree: true });
  setTimeout(() => mo.disconnect(), 15000);
})();
