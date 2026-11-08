const $ = (id) => document.getElementById(id);

function ask(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, (r) => resolve(r || { ok: false, error: 'No reply' })));
}

function status(kind, msg) {
  $('status').className = 'status ' + kind;
  $('status').textContent = msg;
}

async function load() {
  const s = await chrome.storage.local.get(['webhook', 'defaultRole', 'defaultExp', 'profilesOnly', 'autoCollect']);
  $('webhook').value = s.webhook || '';
  $('role').value = s.defaultRole || '';
  $('exp').value = s.defaultExp || '';
  $('profilesOnly').checked = s.profilesOnly !== false;
  $('autoCollect').checked = s.autoCollect !== false;
  renderLists();
}

async function renderLists() {
  const r = await ask({ type: 'tt-list' });
  const wrap = $('lists');
  if (!r.ok || !r.lists.length) { wrap.innerHTML = '<div class="empty">Nothing waiting.</div>'; return; }
  wrap.innerHTML = '';
  r.lists.forEach((l) => {
    const div = document.createElement('div');
    div.className = 'item';
    const q = document.createElement('div');
    q.className = 'q'; q.textContent = l.query; q.title = l.query;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const info = document.createElement('span');
    info.textContent = `${l.count} profile${l.count === 1 ? '' : 's'} · ${l.role || 'no role'}`;
    const btns = document.createElement('span');
    const send = document.createElement('button');
    send.textContent = 'Send';
    send.onclick = async () => {
      send.disabled = true;
      const res = await ask({ type: 'tt-send', query: l.query });
      if (res.ok) status('ok', `✓ ${res.result.added} added to "${res.result.role}" · ${res.result.skipped} already there`);
      else status('err', res.error);
      renderLists();
    };
    const clear = document.createElement('button');
    clear.textContent = 'Clear';
    clear.style.marginLeft = '4px';
    clear.onclick = async () => { await ask({ type: 'tt-clear', query: l.query }); renderLists(); };
    btns.append(send, clear);
    meta.append(info, btns);
    div.append(q, meta);
    wrap.append(div);
  });
}

$('save').onclick = async () => {
  const url = $('webhook').value.trim();
  await chrome.storage.local.set({ webhook: url });
  if (!url) { status('info', 'Sheet URL removed.'); return; }
  status('info', 'Saved. Checking it…');
  const r = await ask({ type: 'tt-test', url });
  if (r.ok) status('ok', `✓ Saved and connected to "${r.info.sheet}".`);
  else status('err', 'Saved, but: ' + r.error);
};

$('test').onclick = async () => {
  status('info', 'Checking…');
  const r = await ask({ type: 'tt-test', url: $('webhook').value.trim() });
  if (r.ok) status('ok', `✓ Connected to "${r.info.sheet}" (TalentTrace ${r.info.version}).`);
  else status('err', r.error);
};

['role', 'exp'].forEach((id) => $(id).addEventListener('change', () =>
  chrome.storage.local.set({ defaultRole: $('role').value.trim(), defaultExp: $('exp').value.trim() })));
['profilesOnly', 'autoCollect'].forEach((id) => $(id).addEventListener('change', () =>
  chrome.storage.local.set({ [id]: $(id).checked })));

load();
