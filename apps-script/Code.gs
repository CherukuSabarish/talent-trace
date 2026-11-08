// ════════════════════════════════════════════════════════════════
//  TalentTrace 2.0 — Google Sheet script
//  One web-app URL that receives candidates from:
//    • the Talent Trace app (TalentData + GitHub Search "Export All")
//    • the TalentTrace 2.0 Chrome extension (Google X-ray results for
//      LinkedIn, Stack Overflow and GitHub)
//
//  What it does:
//    - one tab per Role (made automatically on first export)
//    - columns: Name, Job Title / Skills, Company / Score, Profile URL
//      (clickable), Source (coloured badge), Exp Range, Role, Scraped At,
//      Added At, Status (dropdown), Location, Email, Snippet / Bio,
//      Search String, Recruiter Notes — plus GitHub Login, Followers,
//      Public Repos, Found In Repo, Contributions, Must Haves, Good to
//      Haves, Target Companies, Search Notes when an export has them
//    - duplicates (same profile URL) are skipped, and the existing row
//      is highlighted orange so you can see it came up again
//    - Search Log tab (every export) and Dashboard tab (counts per role,
//      status and source)
//    - "Talent Trace" menu: refresh dashboard, protect sheets, test row
//    - open the /exec URL in a browser to check it's working
//
//  SETUP (fresh Google Sheet): Extensions → Apps Script → paste this over
//  everything → Save → Deploy → New deployment → ⚙️ Web app →
//  Execute as: Me, Who has access: Anyone → Deploy → copy the /exec URL.
//  Full guide: akamai-talent-trace.vercel.app/setup.html
// ════════════════════════════════════════════════════════════════

var SCRIPT_VERSION = '2.0';
var LOG_SHEET  = "Search Log";
var DASH_SHEET = "Dashboard";
var SKIP_SHEETS = [DASH_SHEET, LOG_SHEET];

var STATUS_OPTIONS = ["New", "Contacted", "Shortlisted", "Rejected"];
var STATUS_COLORS = {
  'New':         { bg: '#E8F5E9', fg: '#1B5E20' },
  'Contacted':   { bg: '#E3F2FD', fg: '#0D47A1' },
  'Shortlisted': { bg: '#FFF9C4', fg: '#F57F17' },
  'Rejected':    { bg: '#FFEBEE', fg: '#B71C1C' }
};

// Source badge colours. Matched by how the source starts, so
// "GitHub (repo contributor)" gets the GitHub colour.
var SOURCE_COLORS = {
  'LinkedIn':      { bg: '#E8F5E9', fg: '#1B5E20' },
  'StackOverflow': { bg: '#FFF3E0', fg: '#E65100' },
  'Stack Overflow':{ bg: '#FFF3E0', fg: '#E65100' },
  'GitHub':        { bg: '#EDE7F6', fg: '#4527A0' },
  'TalentData':    { bg: '#E0F2F1', fg: '#00695C' },
  'default':       { bg: '#F5F5F5', fg: '#424242' }
};

// Every column the script knows. `always` columns go on every role tab;
// the rest appear the first time an export has data for them.
// `aliases` are other header names that mean the same column.
// `open` columns stay editable when the sheet is protected.
var COLUMNS = [
  { key: 'name',          header: 'Name',               width: 160, always: true, aliases: ['full name', 'candidate', 'candidate name'] },
  { key: 'jobTitle',      header: 'Job Title / Skills', width: 200, always: true, aliases: ['job title', 'title', 'headline', 'title / headline', 'designation'] },
  { key: 'company',       header: 'Company / Score',    width: 130, always: true, aliases: ['company', 'current company', 'employer'] },
  { key: 'url',           header: 'Profile URL',        width: 160, always: true, aliases: ['url', 'link', 'profile', 'profile link', 'linkedin url'] },
  { key: 'source',        header: 'Source',             width: 110, always: true, aliases: ['platform'] },
  { key: 'expRange',      header: 'Exp Range',          width: 90,  always: true, aliases: ['experience', 'experience range', 'exp'] },
  { key: 'role',          header: 'Role',               width: 110, always: true, aliases: ['role tag'] },
  { key: 'scrapedAt',     header: 'Scraped At',         width: 95,  always: true, aliases: ['scraped'] },
  { key: 'addedAt',       header: 'Added At',           width: 95,  always: true, aliases: ['date added', 'added', 'date'] },
  { key: 'status',        header: 'Status',             width: 110, always: true, open: true, aliases: ['stage'] },
  { key: 'location',      header: 'Location',           width: 140, always: true, aliases: ['city'] },
  { key: 'email',         header: 'Email',              width: 180, always: true, aliases: ['emails', 'email id', 'e-mail'] },
  { key: 'snippet',       header: 'Snippet / Bio',      width: 260, always: true, aliases: ['snippet', 'bio', 'summary', 'description'] },
  { key: 'searchString',  header: 'Search String',      width: 220, always: true, aliases: ['query', 'search query', 'x-ray query', 'boolean'] },
  { key: 'recruiterNotes',header: 'Recruiter Notes',    width: 200, always: true, open: true, aliases: ['notes for candidate', 'comments', 'my notes'] },
  { key: 'githubLogin',   header: 'GitHub Login',       width: 120, aliases: ['github username', 'login'] },
  { key: 'followers',     header: 'Followers',          width: 90,  aliases: [] },
  { key: 'publicRepos',   header: 'Public Repos',       width: 90,  aliases: ['repos'] },
  { key: 'sourceRepo',    header: 'Found In Repo',      width: 160, aliases: ['source repo'] },
  { key: 'contributions', header: 'Contributions',      width: 100, aliases: ['commits'] },
  { key: 'mustHaves',     header: 'Must Haves',         width: 160, aliases: ['must have'] },
  { key: 'niceHaves',     header: 'Good to Haves',      width: 160, aliases: ['nice to haves', 'nice to have'] },
  { key: 'companies',     header: 'Target Companies',   width: 160, aliases: [] },
  { key: 'notes',         header: 'Search Notes',       width: 200, aliases: ['notes'] }
];

// ── Health check: open the /exec URL in a browser ────────────────
function doGet() {
  return json_({ status: 'ok', app: 'TalentTrace 2.0 Sheet', version: SCRIPT_VERSION,
                 sheet: SpreadsheetApp.getActiveSpreadsheet().getName() });
}

// ── Main entry point ─────────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ status: 'error', message: 'Nothing was sent.' });
    var data;
    try { data = JSON.parse(e.postData.contents); }
    catch (err) { return json_({ status: 'error', message: 'Could not read the data sent (not JSON).' }); }

    var profiles = Array.isArray(data.profiles) ? data.profiles : [];
    if (!profiles.length) return json_({ status: 'error', message: 'No candidates in this export.' });

    // The app and the extension could send at the same moment; without this
    // both would see a row as "new" and both would write it.
    lock.waitLock(30000);
    locked = true;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var roleName = (data.role || 'General').toString().trim() || 'General';
    var sheet = getOrCreateRoleSheet(ss, roleName);
    var result = addProfiles(sheet, profiles, data, sheet.getName());

    logSearch(ss, roleName, profiles.length, result.added, result.dupes, result.sources, str_(data.searchString));
    refreshDashboard(ss);
    try { if (protectionIsOn_(sheet)) applyRoleSheetProtection(sheet); } catch (pe) { /* protection is optional */ }

    return json_({ status: 'ok', added: result.added, skipped: result.dupes, role: sheet.getName() });
  } catch (err) {
    return json_({ status: 'error', message: String(err && err.message || err) });
  } finally {
    if (locked) { try { lock.releaseLock(); } catch (ignore) {} }
  }
}

// ── Write new profiles into a role tab ───────────────────────────
function addProfiles(sheet, profiles, data, roleName) {
  var tz = Session.getScriptTimeZone();
  var today = Utilities.formatDate(new Date(), tz, 'dd/MM/yyyy');
  var batch = {
    expRange: str_(data.expRange), searchString: str_(data.searchString),
    mustHaves: str_(data.mustHaves), niceHaves: str_(data.niceHaves),
    companies: str_(data.companies), notes: str_(data.notes)
  };

  var records = profiles.map(function (p) {
    p = p || {};
    var scraped = today;
    try { if (p.scrapedAt) scraped = Utilities.formatDate(new Date(p.scrapedAt), tz, 'dd/MM/yyyy'); } catch (ex) {}
    return {
      name: str_(p.name),
      jobTitle: str_(p.jobTitle || p.title || p.headline),
      company: str_(p.company),
      url: str_(p.url),
      source: str_(p.source) || 'LinkedIn',
      expRange: batch.expRange,
      role: roleName,
      scrapedAt: scraped,
      addedAt: today,
      status: 'New',
      location: str_(p.location),
      email: str_(p.email),
      snippet: str_(p.snippet || p.bio).substring(0, 1000),
      searchString: str_(p.searchString) || batch.searchString,
      recruiterNotes: '',
      githubLogin: str_(p.githubLogin || p.login),
      followers: num_(p.followers),
      publicRepos: num_(p.publicRepos),
      sourceRepo: str_(p.sourceRepo),
      contributions: num_(p.contributions),
      mustHaves: batch.mustHaves,
      niceHaves: batch.niceHaves,
      companies: batch.companies,
      notes: batch.notes
    };
  });

  var map = ensureColumns(sheet, records);
  var width = sheet.getLastColumn();

  // What's already in the tab (URLs can be HYPERLINK formulas, as v4 wrote them).
  var existingMap = {};
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var n = lastRow - 1;
    var urlRange = sheet.getRange(2, map.url, n, 1);
    var urlValues = urlRange.getValues();
    var urlFormulas = urlRange.getFormulas();
    var names = sheet.getRange(2, map.name, n, 1).getValues();
    var comps = sheet.getRange(2, map.company, n, 1).getValues();
    for (var i = 0; i < n; i++) {
      var raw = urlFromCell_(urlValues[i][0], urlFormulas[i][0]);
      var key = dedupeKey(raw, names[i][0], comps[i][0]);
      if (key) existingMap[key] = i + 2;
    }
  }

  var rows = [], links = [], sources = {}, dupeRows = [];
  records.forEach(function (r) {
    var key = dedupeKey(r.url, r.name, r.company);
    if (!key) return;
    sources[sourceGroup_(r.source)] = true;
    if (existingMap[key] !== undefined) {
      if (existingMap[key] > 0) dupeRows.push(existingMap[key]);
      else dupeRows.push(0); // duplicate inside this same export
      return;
    }
    existingMap[key] = -1;
    var row = [];
    for (var c = 0; c < width; c++) row.push('');
    Object.keys(map).forEach(function (k) {
      if (r[k] !== undefined && r[k] !== null) row[map[k] - 1] = r[k];
    });
    rows.push(row);
    links.push(r.url ? '=HYPERLINK("' + r.url.replace(/"/g, '%22') + '","' + (r.name || 'Open').replace(/"/g, "'") + '")' : '');
  });

  // Duplicate — highlight the existing row orange (same as v4)
  dupeRows.forEach(function (rowNum) {
    if (rowNum > 0) sheet.getRange(rowNum, 1, 1, width).setBackground('#FF6B00').setFontColor('#FFFFFF');
  });

  if (rows.length) {
    var start = sheet.getLastRow() + 1;
    var count = rows.length;
    sheet.getRange(start, 1, count, width).setValues(rows);

    // Clickable profile links
    var linkCol = sheet.getRange(start, map.url, count, 1);
    var formulas = links.map(function (f, i) { return [f || rows[i][map.url - 1]]; });
    linkCol.setFormulas(formulas.map(function (f) { return [String(f[0]).charAt(0) === '=' ? f[0] : '']; }));
    formulas.forEach(function (f, i) { if (String(f[0]).charAt(0) !== '=') sheet.getRange(start + i, map.url).setValue(f[0]); });

    // Row styling (alternating rows, like v4)
    var bgs = [], fgs = [];
    for (var i2 = 0; i2 < count; i2++) {
      var b = (i2 % 2 === 0) ? '#FFFFFF' : '#F8FFFE', rb = [], rf = [];
      for (var c2 = 0; c2 < width; c2++) { rb.push(b); rf.push('#1E293B'); }
      bgs.push(rb); fgs.push(rf);
    }
    var all = sheet.getRange(start, 1, count, width);
    all.setBackgrounds(bgs).setFontColors(fgs).setFontSize(10).setVerticalAlignment('middle').setFontWeight('normal');
    sheet.setRowHeights(start, count, 28);

    // Source badges
    var srcBg = [], srcFg = [];
    rows.forEach(function (row) {
      var col = sourceColor_(row[map.source - 1]);
      srcBg.push([col.bg]); srcFg.push([col.fg]);
    });
    sheet.getRange(start, map.source, count, 1).setBackgrounds(srcBg).setFontColors(srcFg)
         .setFontWeight('bold').setHorizontalAlignment('center');

    // Status dropdown
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUS_OPTIONS, true).setAllowInvalid(false).build();
    sheet.getRange(start, map.status, count, 1).setDataValidation(rule)
         .setBackground(STATUS_COLORS.New.bg).setFontColor(STATUS_COLORS.New.fg)
         .setFontWeight('bold').setHorizontalAlignment('center');

    // Long text columns: keep rows short
    ['snippet', 'searchString'].forEach(function (k) {
      if (map[k]) sheet.getRange(start, map[k], count, 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    });
  }

  return { added: rows.length, dupes: dupeRows.length, sources: Object.keys(sources) };
}

// ── Columns: find them by header, add the missing ones ───────────
function ensureColumns(sheet, records) {
  var lastCol = sheet.getLastColumn();
  var headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var map = {};
  headers.forEach(function (h, i) {
    var col = columnForHeader_(h);
    if (col && !map[col.key]) map[col.key] = i + 1;
  });
  // Trailing empty header cells don't count as columns.
  var used = headers.length;
  while (used > 0 && !String(headers[used - 1] || '').trim()) used--;

  var toAdd = COLUMNS.filter(function (c) {
    if (map[c.key]) return false;
    return c.always || records.some(function (r) { return r[c.key] !== '' && r[c.key] !== null && r[c.key] !== undefined; });
  });
  if (toAdd.length) {
    var startCol = used + 1;
    sheet.getRange(1, startCol, 1, toAdd.length).setValues([toAdd.map(function (c) { return c.header; })]);
    toAdd.forEach(function (c, i) {
      map[c.key] = startCol + i;
      sheet.setColumnWidth(startCol + i, c.width || 120);
    });
    styleHeader_(sheet);
  }
  return map;
}

function columnForHeader_(header) {
  var h = String(header || '').trim().toLowerCase();
  if (!h) return null;
  for (var i = 0; i < COLUMNS.length; i++) {
    if (COLUMNS[i].header.toLowerCase() === h || COLUMNS[i].aliases.indexOf(h) !== -1) return COLUMNS[i];
  }
  return null;
}

function headerMap_(sheet) {
  var lastCol = sheet.getLastColumn();
  var map = {};
  if (!lastCol) return map;
  sheet.getRange(1, 1, 1, lastCol).getValues()[0].forEach(function (h, i) {
    var col = columnForHeader_(h);
    if (col && !map[col.key]) map[col.key] = i + 1;
  });
  return map;
}

function styleHeader_(sheet) {
  var w = sheet.getLastColumn();
  if (!w) return;
  sheet.getRange(1, 1, 1, w).setFontWeight('bold').setBackground('#0D1424').setFontColor('#4FFFB0').setFontSize(11);
  sheet.setFrozenRows(1);
}

// ── Get or create a role-specific sheet ──────────────────────────
function getOrCreateRoleSheet(ss, roleName) {
  var safeName = roleName.replace(/[\/\\\*\[\]:?]/g, '').substring(0, 50).trim() || 'General';
  if (SKIP_SHEETS.indexOf(safeName) !== -1) safeName = safeName + ' (role)';
  var sheet = ss.getSheetByName(safeName);
  if (sheet) return sheet;
  // "sre" and "SRE" go to the same tab
  var lower = safeName.toLowerCase();
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) if (all[i].getName().toLowerCase() === lower) return all[i];
  return ss.insertSheet(safeName);   // headers are added by ensureColumns
}

// ── Same person? (LinkedIn, Stack Overflow, GitHub, anything else) ─
function normalizeUrl(url) {
  if (!url) return '';
  var n = url.toString().split('?')[0].split('#')[0].trim().toLowerCase()
             .replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
  if (!n) return '';

  // LinkedIn profile (in.linkedin.com / uk.linkedin.com → linkedin.com)
  var li = n.match(/^(?:[a-z]{2,3}\.)?linkedin\.com\/in\/([^\/]+)/);
  if (li) return 'linkedin.com/in/' + decodeSafe_(li[1]);

  // Stack Overflow user: stackoverflow.com/users/12345/name → by id
  var so = n.match(/stackoverflow\.com\/users\/(\d+)/);
  if (so) return 'stackoverflow.com/users/' + so[1];

  // GitHub — any github.com/<user>/... is that user
  var gh = n.match(/^github\.com\/([a-z0-9_\-]+)/);
  if (gh) {
    var systemPages = ['features','topics','explore','marketplace','pricing','about','login','signup','orgs',
                       'apps','contact','blog','collections','trending','settings','notifications','issues',
                       'pulls','search','sponsors','enterprise'];
    if (systemPages.indexOf(gh[1]) === -1) return 'github.com/' + gh[1];
  }
  return n;
}

function dedupeKey(url, name, company) {
  var u = normalizeUrl(url);
  if (u) return 'u:' + u;
  var nm = String(name || '').trim().toLowerCase();
  if (!nm) return '';
  return 'n:' + nm + '|' + String(company || '').trim().toLowerCase();
}

function urlFromCell_(value, formula) {
  if (formula && /HYPERLINK/i.test(formula)) {
    var m = formula.match(/HYPERLINK\(\s*"([^"]+)"/i);
    if (m) return m[1];
  }
  return value ? value.toString() : '';
}

function decodeSafe_(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }

// ── Log each export ──────────────────────────────────────────────
function logSearch(ss, roleName, sent, added, dupes, sources, searchString) {
  var log = ss.getSheetByName(LOG_SHEET);
  var headers = ['Timestamp', 'Role', 'Profiles Sent', 'New Added', 'Duplicates', 'Sources', 'Search String'];
  if (!log) {
    log = ss.insertSheet(LOG_SHEET);
    log.setFrozenRows(1);
  }
  // v4 logs had 5 columns; add the two new headers if they're missing.
  log.getRange(1, 1, 1, headers.length).setValues([headers])
     .setFontWeight('bold').setBackground('#0D1424').setFontColor('#00CFFF');
  log.appendRow([new Date().toLocaleString(), roleName, sent, added, dupes, (sources || []).join(', '), searchString || '']);
}

// ── Refresh Dashboard ────────────────────────────────────────────
function refreshDashboard(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName(DASH_SHEET);
  if (!dash) dash = ss.insertSheet(DASH_SHEET);
  dash.clearContents();
  dash.clearFormats();

  dash.getRange('A1').setValue('TalentTrace 2.0 — Dashboard').setFontSize(16).setFontWeight('bold').setFontColor('#0D1424');
  dash.getRange('A2').setValue('Last updated: ' + new Date().toLocaleString()).setFontColor('#64748B').setFontSize(10);

  var headerRow = ['Role / Tab', 'Total', 'New', 'Contacted', 'Shortlisted', 'Rejected', 'LinkedIn', 'Stack Overflow', 'GitHub', 'Other'];
  dash.getRange(4, 1, 1, headerRow.length).setValues([headerRow])
      .setFontWeight('bold').setBackground('#0D1424').setFontColor('#4FFFB0').setFontSize(11).setHorizontalAlignment('center');

  var rowNum = 5;
  var grand = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  ss.getSheets().forEach(function (sh) {
    var name = sh.getName();
    if (SKIP_SHEETS.indexOf(name) !== -1) return;
    var map = headerMap_(sh);
    if (!map.url || !map.status) return;     // not a Talent Trace role tab
    var total = Math.max(0, sh.getLastRow() - 1);
    var counts = { New: 0, Contacted: 0, Shortlisted: 0, Rejected: 0 };
    var src = { LinkedIn: 0, 'Stack Overflow': 0, GitHub: 0, Other: 0 };
    if (total > 0) {
      sh.getRange(2, map.status, total, 1).getValues().forEach(function (r) {
        var s = String(r[0] || '').trim();
        if (counts.hasOwnProperty(s)) counts[s]++;
      });
      if (map.source) sh.getRange(2, map.source, total, 1).getValues().forEach(function (r) {
        src[sourceGroup_(r[0])]++;
      });
    }
    var vals = [total, counts.New, counts.Contacted, counts.Shortlisted, counts.Rejected,
                src.LinkedIn, src['Stack Overflow'], src.GitHub, src.Other];
    vals.forEach(function (v, i) { grand[i] += v; });
    dash.getRange(rowNum, 1, 1, headerRow.length).setValues([[name].concat(vals)])
        .setBackground(rowNum % 2 === 0 ? '#F8FFFE' : '#FFFFFF').setFontColor('#1E293B').setFontSize(10);
    dash.getRange(rowNum, 3).setBackground('#E8F5E9').setFontColor('#1B5E20').setFontWeight('bold').setHorizontalAlignment('center');
    dash.getRange(rowNum, 4).setBackground('#E3F2FD').setFontColor('#0D47A1').setFontWeight('bold').setHorizontalAlignment('center');
    dash.getRange(rowNum, 5).setBackground('#FFF9C4').setFontColor('#F57F17').setFontWeight('bold').setHorizontalAlignment('center');
    dash.getRange(rowNum, 6).setBackground('#FFEBEE').setFontColor('#B71C1C').setFontWeight('bold').setHorizontalAlignment('center');
    dash.setRowHeight(rowNum, 28);
    rowNum++;
  });

  rowNum++;
  dash.getRange(rowNum, 1, 1, headerRow.length).setValues([['TOTAL'].concat(grand)])
      .setFontWeight('bold').setBackground('#0D1424').setFontColor('#4FFFB0').setFontSize(11).setHorizontalAlignment('center');
  dash.setRowHeight(rowNum, 32);
  dash.setColumnWidth(1, 180);
  for (var c = 2; c <= headerRow.length; c++) dash.setColumnWidth(c, c === 8 ? 115 : 95);
}

function sourceGroup_(source) {
  var s = String(source || '').toLowerCase();
  if (s.indexOf('linkedin') === 0) return 'LinkedIn';
  if (s.indexOf('stack') === 0) return 'Stack Overflow';
  if (s.indexOf('github') === 0) return 'GitHub';
  return 'Other';
}

function sourceColor_(source) {
  var s = String(source || '');
  var keys = Object.keys(SOURCE_COLORS);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] !== 'default' && s.toLowerCase().indexOf(keys[i].toLowerCase()) === 0) return SOURCE_COLORS[keys[i]];
  }
  return SOURCE_COLORS['default'];
}

// ── Status colour on manual edit ─────────────────────────────────
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (SKIP_SHEETS.indexOf(sheet.getName()) !== -1 || e.range.getRow() < 2) return;
  var map = headerMap_(sheet);
  if (!map.status || e.range.getColumn() !== map.status) return;
  var col = STATUS_COLORS[e.range.getValue()] || { bg: '#FFFFFF', fg: '#1E293B' };
  e.range.setBackground(col.bg).setFontColor(col.fg).setFontWeight('bold');
}

// ── Sheet menu ───────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi().createMenu('TalentTrace 2.0')
    .addItem('Refresh Dashboard', 'refreshDashboard')
    .addSeparator()
    .addItem('Protect sheets (keep Status editable)', 'setupProtections')
    .addItem('Check protections', 'checkProtections')
    .addItem('Remove all protections', 'removeAllProtections')
    .addSeparator()
    .addItem('Add a test row (LinkedIn)', 'testLinkedIn')
    .addToUi();
}

// ════════════════════════════════════════════════════════════════
//  SHEET PROTECTION
//  Run setupProtections() once (or Talent Trace menu → Protect sheets).
//  People you share the Sheet with can then:
//     ✅ read everything, ✅ change Status and Recruiter Notes,
//     ✅ create their own new tabs
//     ❌ edit profile data or headers, ❌ edit Dashboard / Search Log
//  New rows from later exports are covered automatically.
// ════════════════════════════════════════════════════════════════
function setupProtections() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var removed = 0, added = 0;
  ss.getSheets().forEach(function (sheet) {
    sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) { p.remove(); removed++; });
    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) { p.remove(); removed++; });
  });

  SKIP_SHEETS.forEach(function (n) {
    var sh = ss.getSheetByName(n);
    if (!sh) return;
    lockOut_(sh.protect().setDescription('TalentTrace ' + n + ' — read-only'));
    added++;
  });

  ss.getSheets().forEach(function (sheet) {
    if (SKIP_SHEETS.indexOf(sheet.getName()) !== -1) return;
    var map = headerMap_(sheet);
    if (!map.url) return;                 // leave non-Talent-Trace tabs alone
    applyRoleSheetProtection(sheet);
    added++;
  });

  PropertiesService.getDocumentProperties().setProperty('TT_PROTECT', 'on');
  Logger.log('Removed ' + removed + ', added ' + added + ' protections.');
  try {
    SpreadsheetApp.getUi().alert('✅ TalentTrace Protections Applied\n\n' +
      '• Dashboard and Search Log — read-only\n' +
      '• Role tabs — headers and profile data locked\n' +
      '• Status and Recruiter Notes — open for editors\n\n' +
      'New rows from future exports are protected automatically.');
  } catch (e) {}
}

// Protects the whole role tab except its Status and Recruiter Notes columns.
// A sheet-level protection also covers rows added later.
function applyRoleSheetProtection(sheet) {
  var name = sheet.getName();
  // Remove v4-style range protections (they only covered the rows that existed then)
  sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) {
    var d = p.getDescription() || '';
    if (d.indexOf(name + ' — Profile data') !== -1 || d.indexOf(name + ' — Header row') !== -1) p.remove();
  });
  var map = headerMap_(sheet);
  var open = [];
  COLUMNS.forEach(function (c) {
    if (c.open && map[c.key]) open.push(sheet.getRange(2, map[c.key], sheet.getMaxRows() - 1, 1));
  });
  var existing = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  var p = existing.length ? existing[0] : lockOut_(sheet.protect().setDescription(name + ' — Talent Trace role tab'));
  p.setUnprotectedRanges(open);
}

function protectionIsOn_(sheet) {
  if (PropertiesService.getDocumentProperties().getProperty('TT_PROTECT') === 'on') return true;
  // Sheets protected by v4's setupProtections()
  return sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).some(function (p) {
    return (p.getDescription() || '').indexOf('— Profile data') !== -1;
  });
}

function lockOut_(p) {
  p.removeEditors(p.getEditors());     // the owner always keeps access
  if (p.canDomainEdit()) p.setDomainEdit(false);
  return p;
}

function removeAllProtections() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var count = 0;
  ss.getSheets().forEach(function (sheet) {
    sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) { p.remove(); count++; });
    sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) { p.remove(); count++; });
  });
  PropertiesService.getDocumentProperties().deleteProperty('TT_PROTECT');
  try { SpreadsheetApp.getUi().alert('Removed ' + count + ' protections. Sheet is now fully open.'); } catch (e) {}
}

function checkProtections() {
  var out = [];
  SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(function (sheet) {
    var n = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).length +
            sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET).length;
    if (n) out.push(sheet.getName() + ': ' + n + ' protection(s)');
  });
  SpreadsheetApp.getUi().alert('Protection Status:\n\n' + (out.length ? out.join('\n') : 'No protections found.'));
}

// ── Helpers ──────────────────────────────────────────────────────
function str_(v) {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.join(', ');
  return String(v).trim();
}

function num_(v) {
  if (v === null || v === undefined || v === '') return '';
  var n = Number(v);
  return isNaN(n) ? '' : n;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ── Test functions (run from the Apps Script editor) ─────────────
function testLinkedIn() {
  var mock = { postData: { contents: JSON.stringify({
    role: 'Test', expRange: '3-8 yrs', searchString: 'site:linkedin.com/in "SRE" Bangalore',
    profiles: [{ source: 'LinkedIn', name: 'Ravi Kumar', jobTitle: 'SRE', company: 'Flipkart', location: 'Bengaluru',
                 url: 'https://linkedin.com/in/ravi-kumar-test', scrapedAt: new Date().toISOString() }]
  })}};
  Logger.log(doPost(mock).getContent());
}

function testStackOverflow() {
  var mock = { postData: { contents: JSON.stringify({
    role: 'Test', expRange: '3-6 yrs',
    profiles: [{ source: 'StackOverflow', name: 'Jon Skeet', jobTitle: 'C# Python Java', company: '1.2M rep',
                 location: 'London', url: 'https://stackoverflow.com/users/22656/jon-skeet', scrapedAt: new Date().toISOString() }]
  })}};
  Logger.log(doPost(mock).getContent());
}

function testGitHub() {
  var mock = { postData: { contents: JSON.stringify({
    role: 'Test', expRange: '',
    profiles: [{ source: 'GitHub', name: 'Linus Torvalds', githubLogin: 'torvalds', followers: 230000,
                 location: 'Portland, OR', url: 'https://github.com/torvalds', scrapedAt: new Date().toISOString() }]
  })}};
  Logger.log(doPost(mock).getContent());
}
