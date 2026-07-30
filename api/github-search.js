// api/github-search.js — TalentTrace
// Proxies candidate search to GitHub's Search Users API. Same server-side-key model
// as crustdata-search.js — the token lives only in this serverless function's
// environment (GITHUB_TOKEN, set in Vercel Project Settings → Environment Variables)
// and never reaches the browser.
//
// Flow: 1) GET /search/users with qualifiers built from the form fields.
//       2) The search result only has login/avatar/html_url, so we enrich each hit
//          with GET /users/{login} (name, company, location, bio, public email,
//          followers, repos) — fetched in parallel, capped at 30 per request.
//
// Docs: https://docs.github.com/en/rest/search/search#search-users
//       https://docs.github.com/en/search-github/searching-on-github/searching-users

const GITHUB_API = 'https://api.github.com';
const MAX_RESULTS = 30; // per-request cap — each result costs one extra enrich call
const MAX_OR_GROUPS = 5; // each OR branch is its own GitHub search (30 searches/min limit)

// ══════════════════════════════════════════════════════════════════════════
// BOOLEAN KEYWORD PARSER
//
// GitHub's user-search API has no boolean operators: every free-text term in a
// single query is implicitly ANDed, and there is no OR at all. So we parse the
// recruiter's expression ourselves and compile it to disjunctive normal form —
// an OR of AND-groups — then run one GitHub search per group and merge the hits.
//
// Supported: AND  OR  NOT  parentheses  "quoted phrases"  - (alias for NOT)
//            , (alias for OR, kept for backwards compatibility)
//            Adjacent terms with no operator mean AND, as people expect.
//
// Negative terms are NOT sent to GitHub. GitHub's exclusion syntax is only
// reliable on qualifiers, not on free text in user search, so a `-term` there
// silently misbehaves. Instead we apply negatives ourselves as a post-filter over
// the enriched profile (login, name, bio, company, location) — deterministic, at
// the cost of shrinking a page below the requested limit.
// ══════════════════════════════════════════════════════════════════════════

function tokenizeBoolean(input) {
  const tokens = [];
  const s = String(input || '');
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '(' || ch === ')') { tokens.push({ type: ch }); i++; continue; }
    if (ch === ',') { tokens.push({ type: 'OR' }); i++; continue; }
    if (ch === '"' || ch === "'") {
      const close = s.indexOf(ch, i + 1);
      const value = close === -1 ? s.slice(i + 1) : s.slice(i + 1, close);
      if (value.trim()) tokens.push({ type: 'TERM', value: value.trim() });
      i = close === -1 ? s.length : close + 1;
      continue;
    }
    // A leading '-' is NOT, but only when it starts a term (so "e-commerce" survives).
    if (ch === '-' && (i === 0 || /[\s(,]/.test(s[i - 1]))) { tokens.push({ type: 'NOT' }); i++; continue; }
    let j = i;
    while (j < s.length && !/[\s(),"']/.test(s[j])) j++;
    const word = s.slice(i, j);
    i = j;
    const upper = word.toUpperCase();
    if (upper === 'AND' || upper === 'OR' || upper === 'NOT') tokens.push({ type: upper });
    else if (word) tokens.push({ type: 'TERM', value: word });
  }
  return tokens;
}

// Recursive descent → AST of {type:'term'|'and'|'or'|'not'}
function parseBoolean(tokens) {
  let pos = 0;
  const peek = () => tokens[pos];
  const eat = (type) => (peek() && peek().type === type ? tokens[pos++] : null);

  function parsePrimary() {
    if (eat('(')) {
      const node = parseOr();
      eat(')'); // tolerate a missing close paren rather than erroring on the user
      return node;
    }
    const t = eat('TERM');
    return t ? { type: 'term', value: t.value } : null;
  }

  function parseNot() {
    if (eat('NOT')) {
      const child = parseNot();
      return child ? { type: 'not', child } : null;
    }
    return parsePrimary();
  }

  function parseAnd() {
    let left = parseNot();
    while (peek()) {
      const t = peek().type;
      if (t === 'OR' || t === ')') break;
      if (t === 'AND') pos++;              // explicit AND
      const right = parseNot();            // …or implicit AND between adjacent terms
      if (!right) break;
      left = left ? { type: 'and', left, right } : right;
    }
    return left;
  }

  function parseOr() {
    let left = parseAnd();
    while (peek() && peek().type === 'OR') {
      pos++;
      const right = parseAnd();
      if (!right) break;
      left = left ? { type: 'or', left, right } : right;
    }
    return left;
  }

  return parseOr();
}

// De Morgan: push NOT down to the leaves so DNF conversion stays simple.
function negateNode(node) {
  if (!node) return null;
  if (node.type === 'term') return { type: 'not', child: node };
  if (node.type === 'not') return node.child;
  if (node.type === 'and') return { type: 'or', left: negateNode(node.left), right: negateNode(node.right) };
  if (node.type === 'or') return { type: 'and', left: negateNode(node.left), right: negateNode(node.right) };
  return null;
}

// → [{ pos:[terms], neg:[terms] }, ...]  (an OR of AND-groups)
function toDNF(node) {
  if (!node) return [];
  if (node.type === 'term') return [{ pos: [node.value], neg: [] }];
  if (node.type === 'not') {
    const inner = node.child;
    if (inner.type === 'term') return [{ pos: [], neg: [inner.value] }];
    return toDNF(negateNode(inner));
  }
  if (node.type === 'or') return [...toDNF(node.left), ...toDNF(node.right)];
  if (node.type === 'and') {
    const L = toDNF(node.left), R = toDNF(node.right);
    const out = [];
    L.forEach(a => R.forEach(b => out.push({
      pos: [...new Set([...a.pos, ...b.pos])],
      neg: [...new Set([...a.neg, ...b.neg])]
    })));
    return out;
  }
  return [];
}

function compileKeywords(raw) {
  const groups = toDNF(parseBoolean(tokenizeBoolean(raw)));
  // Drop groups that contradict themselves ("python NOT python") and cap the fan-out.
  return groups
    .filter(g => !g.pos.some(p => g.neg.some(n => n.toLowerCase() === p.toLowerCase())))
    .slice(0, MAX_OR_GROUPS);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed — use POST.' });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(500).json({
      error: 'GITHUB_TOKEN is not configured. Add it in Vercel → Project Settings → Environment Variables, then redeploy.'
    });
    return;
  }

  const { keywords, language, location, minFollowers, minRepos, limit, page, sortBy, sortOrder } = req.body || {};

  // Build the qualifier string shared by every keyword variant (language, location, etc.).
  //
  // NOTE on keywords: GitHub's user-search API has no OR operator — multiple free-text
  // terms in one query are ANDed, so "SRE, Kubernetes" would demand both words appear in
  // the same short bio and return almost nothing. Recruiters mean "any of these", so we
  // instead fire one search per keyword and merge the results below. Commas separate
  // alternatives; spaces within one comma-chunk still AND, as a phrase would.
  const parts = [];
  if (language && String(language).trim()) {
    // GitHub's language qualifier takes one language at a time; multiple are ANDed,
    // which is usually what a recruiter means ("knows Go AND Python").
    String(language).split(',').map(s => s.trim()).filter(Boolean)
      .forEach(l => parts.push('language:"' + l.replace(/"/g, '') + '"'));
  }
  if (location && String(location).trim()) {
    String(location).split(',').map(s => s.trim()).filter(Boolean)
      .forEach(l => parts.push('location:"' + l.replace(/"/g, '') + '"'));
  }
  const minF = parseInt(minFollowers, 10);
  if (!isNaN(minF) && minF > 0) parts.push('followers:>=' + minF);
  const minR = parseInt(minRepos, 10);
  if (!isNaN(minR) && minR > 0) parts.push('repos:>=' + minR);
  parts.push('type:user'); // people, not orgs

  // Boolean keyword expression → OR of AND-groups, one GitHub search each.
  const keywordGroups = compileKeywords(keywords);
  // Negatives are applied after enrichment (see note on the parser above).
  const allNegatives = [...new Set(keywordGroups.flatMap(g => g.neg))];
  const hasPositives = keywordGroups.some(g => g.pos.length);

  // Require at least one real search term besides type:user
  if (parts.length <= 1 && !hasPositives) {
    res.status(400).json({ error: 'Provide at least one of: keywords, language, or location.' });
    return;
  }

  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), MAX_RESULTS);
  // GitHub's Search API refuses to paginate past the first 1000 results, so cap the
  // page number at whatever stays inside that window for this page size.
  const maxPage = Math.max(1, Math.floor(1000 / safeLimit));
  const safePage = Math.min(Math.max(parseInt(page, 10) || 1, 1), maxPage);
  const base = parts.join(' ');
  const quote = (t) => (t.includes(' ') ? '"' + t + '"' : t);
  // One query per AND-group; GitHub ANDs the terms within a query for us.
  const positiveGroups = keywordGroups.filter(g => g.pos.length);
  const queries = positiveGroups.length
    ? positiveGroups.map(g => g.pos.map(quote).join(' ') + ' ' + base)
    : [base];

  // ────────────────────────────────────────────────────────────────────────
  // BIO-AWARE FALLBACK
  //
  // GitHub's /search/users index only covers **login and public email** for
  // bare keywords - bio, name, and company are never matched unless you use
  // `in:name`, and there's no qualifier for bio at all. So a recruiter typing
  // "kubernetes" or "site reliability" into Keywords will mostly get nothing
  // from the queries above, even though plenty of matching users say exactly
  // that in their bio.
  //
  // To fix this we run one extra, qualifier-only search (language/location/
  // followers/repos, no keyword) whenever there's a real qualifier to scope it
  // by - without one, "give me everyone on GitHub" is too broad to be useful.
  // We then keyword-filter the enriched profiles ourselves further down
  // (`hay`/`positiveGroups`), checking bio + name + company + login + email,
  // which is the honest superset of what "keywords" should mean for a
  // recruiting tool. Profiles that only satisfied GitHub's own login/email
  // match pass this filter trivially, so nothing already-correct is lost.
  const hasQualifiers = parts.length > 1; // more than the bare `type:user`
  const bioFallbackQuery = (positiveGroups.length && hasQualifiers) ? base : null;
  const allQueries = bioFallbackQuery ? [...queries, bioFallbackQuery] : queries;

  // Sort control - GitHub's API only accepts these three, plus omitting `sort`
  // entirely for its default best-match relevance ranking ('best' below).
  const ALLOWED_SORT = ['followers', 'repositories', 'joined', 'best'];
  const sortField = ALLOWED_SORT.includes(String(sortBy)) ? String(sortBy) : 'followers';
  const sortDir = sortOrder === 'asc' ? 'asc' : 'desc';
  const sortQuery = sortField === 'best' ? '' : ('&sort=' + sortField + '&order=' + sortDir);

  const ghHeaders = {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'TalentTrace'
  };

  try {
    // Run every keyword variant (plus the bio-aware fallback, if any), then merge.
    // A single failing variant shouldn't sink the whole search, but if ALL of them
    // fail we surface the first real error.
    const runs = await Promise.all(allQueries.map(async (q) => {
      const searchUrl = GITHUB_API + '/search/users?q=' + encodeURIComponent(q) +
        sortQuery + '&per_page=' + safeLimit + '&page=' + safePage;
      const r = await fetch(searchUrl, { headers: ghHeaders });
      const d = await r.json().catch(() => ({}));
      return { ok: r.ok, status: r.status, data: d };
    }));

    const good = runs.filter(r => r.ok);
    if (!good.length) {
      const first = runs[0] || { status: 500, data: {} };
      // GitHub 422s on bad qualifiers with a message + errors[]; 403 on rate limit.
      const detail = Array.isArray(first.data.errors) && first.data.errors.length
        ? ' — ' + first.data.errors.map(e => e.message || e.code).filter(Boolean).join('; ')
        : '';
      res.status(first.status).json({
        error: (first.data.message || ('GitHub search failed (HTTP ' + first.status + ')')) + detail
      });
      return;
    }

    // Merge + dedupe by login, keeping search-rank order across the variants, then trim
    // back to the requested limit so enrichment cost stays bounded.
    const seen = new Set();
    const merged = [];
    good.forEach(r => {
      (Array.isArray(r.data.items) ? r.data.items : []).forEach(it => {
        if (it && it.login && !seen.has(it.login)) { seen.add(it.login); merged.push(it); }
      });
    });
    const items = merged.slice(0, safeLimit);
    // Across multiple variants "total" is a ceiling, not an exact count (people can
    // match more than one keyword) — good enough for the "of N matching" hint.
    const totalCount = good.reduce((sum, r) => sum + (r.data.total_count || 0), 0);
    const anyFullPage = good.some(r => (r.data.items || []).length === safeLimit);

    // Enrich each hit with the full user profile (parallel; individual failures
    // degrade to the bare search result instead of failing the whole request).
    const profiles = await Promise.all(items.map(async (item) => {
      let u = {};
      try {
        const uRes = await fetch(GITHUB_API + '/users/' + encodeURIComponent(item.login), { headers: ghHeaders });
        if (uRes.ok) u = await uRes.json();
      } catch (e) { /* keep bare result */ }
      return {
        login: item.login,
        name: u.name || '',
        url: item.html_url,
        avatar: item.avatar_url,
        company: u.company || '',
        location: u.location || '',
        bio: u.bio || '',
        email: u.email || '',           // only if the user made it public
        blog: u.blog || '',
        followers: u.followers ?? null,
        publicRepos: u.public_repos ?? null,
        hireable: u.hireable === true
      };
    }));

    // Apply the boolean expression against the full enriched profile text — GitHub
    // can't do this reliably on free text (bio/name/company aren't even indexed for
    // bare keywords, see the bio-aware fallback comment above), so we do it ourselves:
    //   - positive groups: keep only if at least one OR-branch has ALL of its terms
    //     present (this is a no-op for profiles GitHub already matched via login/email,
    //     since those are part of the same haystack — it only actually filters out
    //     profiles pulled in by the qualifier-only bio fallback that don't really match).
    //   - negatives: drop if any NOT term is present.
    let excludedNoMatch = 0, excludedByNot = 0;
    const kept = (positiveGroups.length || allNegatives.length)
      ? profiles.filter(p => {
          const hay = [p.login, p.name, p.bio, p.company, p.location, p.email].filter(Boolean).join(' ').toLowerCase();
          if (positiveGroups.length && !positiveGroups.some(g => g.pos.every(t => hay.includes(t.toLowerCase())))) {
            excludedNoMatch++;
            return false;
          }
          if (allNegatives.length && allNegatives.some(n => hay.includes(n.toLowerCase()))) {
            excludedByNot++;
            return false;
          }
          return true;
        })
      : profiles;

    res.status(200).json({
      totalCount,
      page: safePage,
      excludedByNot,
      excludedNoMatch,
      // True when the qualifier-only bio/name/company fallback ran - lets the UI
      // tell the recruiter their keywords were checked against more than just
      // GitHub's own (login/email-only) index.
      bioAware: !!bioFallbackQuery,
      sortBy: sortField,
      sortOrder: sortDir,
      // Echo back how the boolean expression was understood, so the UI can show the
      // user what actually ran instead of leaving them guessing.
      interpreted: positiveGroups.length
        ? positiveGroups.map(g => g.pos.join(' AND ')).join(') OR (').replace(/^/, '(').replace(/$/, ')') +
          (allNegatives.length ? ' NOT ' + allNegatives.join(', ') : '')
        : (allNegatives.length ? 'NOT ' + allNegatives.join(', ') : ''),
      // False once we've served the last page of matches, or hit GitHub's 1000-result
      // pagination ceiling — the client uses this to hide its "Load More" button.
      hasMore: anyFullPage && safePage < maxPage && safePage * safeLimit < totalCount,
      profiles: kept
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach GitHub: ' + err.message });
  }
}
