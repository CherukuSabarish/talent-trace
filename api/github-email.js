<!--
  ████████╗ █████╗ ██╗     ███████╗███╗   ██╗████████╗████████╗██████╗  █████╗  ██████╗███████╗
  ╚══██╔══╝██╔══██╗██║     ██╔════╝████╗  ██║╚══██╔══╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔════╝
     ██║   ███████║██║     █████╗  ██╔██╗ ██║   ██║      ██║   ██████╔╝███████║██║     █████╗
     ██║   ██╔══██║██║     ██╔══╝  ██║╚██╗██║   ██║      ██║   ██╔══██╗██╔══██║██║     ██╔══╝
     ██║   ██║  ██║███████╗███████╗██║ ╚████║   ██║      ██║   ██║  ██║██║  ██║╚██████╗███████╗
     ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝

  VERSION : v9
  DATE    : July 2026
  BUILT WITH : Claude (Anthropic)

  ── FEATURE CHECKLIST (DO NOT BREAK) ──────────────────────────────────────────
  ✅ Query Builder - Tech, Sales, Veterans, Freshers, Custom Roles
  ✅ 4-Platform output - LinkedIn, Google X-Ray, StackOverflow, GitHub
  ✅ Mandatory Keywords - AND / OR / Custom boolean logic
  ✅ Diversity Sourcing Resources - 300+ India / 400+ US female first names, pronoun
          signals, women-in-tech community signals, women's college signals (v9.2,
          replaces the old in-Builder "Female Candidates Only" toggle - see below)
  ✅ Freshers - Year × Tier × Stream × Custom College (dynamic, no hardcoded years)
  ✅ Company Clusters - FAANG, Unicorns, MNC, Fintech, Startups, EdTech, E-Comm
  ✅ Job Description Analyzer - Boolean, Target Companies, Interview Questions, Profile Checklist
  ✅ Job Description Role Detection - Scoring system (Full Stack ≠ DevOps)
  ✅ GitHub X-Ray - "block or report user" signal for profile pages
  ✅ India Location - locked in all searches
  ✅ Sheet Protection - setupProtections() in AppsScript
  ✅ Spell Corrections - vetran, fullstacker, tire1 etc.
  ✅ Anthropic API - x-api-key + dangerous-direct-browser-access headers
  ✅ v7 - Akamai brand palette (navy / blue / orange, live-sampled from akamai.com)
  ✅ v8 - TalentData search + enrich, now built directly into this app (🛰️ TalentData tab)
          instead of the Chrome extension. Runs through /api/crustdata-search and
          /api/crustdata-enrich Vercel serverless functions, which hold the data
          provider API key server-side (CRUSTDATA_API_KEY env var - unchanged, tied to
          existing Vercel config) - the browser never sees it, and same-origin calls
          sidestep the CORS problem that kept this out of v7.
          Deploy target: Vercel project "tech-boolean-pro". The Chrome extension's own
          data-search section (extension_v1.7) still works independently if you use that.
  ✅ v9 - Notion-style UI: left sidebar navigation replaces the top tab bar, light
          neutral palette, system font stack, subtler borders/radii throughout.
          "Crustdata" branding renamed to "TalentData" in all UI text and internal
          function/variable names. NOTE: the underlying data provider is still
          Crustdata - the API endpoints (/api/crustdata-search, /api/crustdata-enrich),
          the CRUSTDATA_API_KEY env var, and api.crustdata.com references are left
          untouched on purpose so the live Vercel deployment keeps working.
  ✅ v9.1 - Akamai rebrand: nav bar + accent palette recolored to Akamai navy/blue,
          Akamai wordmark added to top nav (no more "AI-Powered"/version pill).
          Contact enrichment removed entirely (per-candidate "Reveal Contact Info"
          and bulk "Deep-enrich all", plus their /api/crustdata-enrich calls) - the
          TalentData tab is search-only now. Result cards + candidate modal redone
          in a LinkedIn-style layout (avatar, headline, location, pill "View Profile"
          button). api/crustdata-enrich.js is now unused dead code on the server -
          left in place rather than deleted since nothing in this file calls it.
  ✅ v9.2 - Removed the Boolean Builder's "Female Candidates Only" checkbox/preview and
          the femaleChecked branch in generate() (dead-simple generate() now always
          builds the standard 4-platform output). Removed every "Open ↗" button next
          to a Copy button (Boolean Builder outputs + Job Description Analyzer result
          boxes) - Copy-only now; openFromEl() was deleted as dead code. Added a 5th
          nav tab, Diversity Sourcing Resources: India (300+, the old female filter's
          list, now standalone) and US (400+, the proven SSA-decade list) female first
          names, modern pronoun-tag signals + Glen Cathey's classic "(her OR she)"
          keyword search, women-in-tech community signals, US women's colleges (48)
          and sororities (91), and - for racial/ethnic diversity - HBCUs (105),
          African American Greek orgs (23), and Native American Tribal Colleges (36).
          Everything past the India names list is adapted from Glen Cathey's
          "Diversity Sourcing: Boolean Search Strings for LinkedIn" (booleanblackbelt.com).
  ✅ v9.3 - Orbiting-logos hero animation on the landing page (LinkedIn, Google,
          StackOverflow, GitHub, TalentData, AI-sparkle icons on 3 counter-rotating
          rings around the Trace Rings mark), replacing the old static SVG mockup.
          Added an Akamai logo + "Built for Akamai Internal Use Only" disclaimer
          footer to the landing page, and matched the sidebar's existing Akamai
          caption to the same wording. Removed all em dashes from user-facing text
          (prose only; the decorative box-drawing dividers in this comment block are
          untouched). Extended the landing page's polish into the workspace: soft
          ambient background glows behind the main content area, and a staggered
          fade-slide-up entrance for page headers and cards on every tab.

  ── UPGRADE RULES ──────────────────────────────────────────────────────────────
  NEVER edit this file directly for upgrades.
  ALWAYS copy this file → rename to index_v10.html → make changes there.
  Run health check before saving any new version.
  ───────────────────────────────────────────────────────────────────────────────
-->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TalentTrace</title>
<style>
:root {
  /* Akamai palette */
  --bg: #f0f4fa;
  --surface: #ffffff;
  --surface2: #e8f4fc;
  --surface3: #d6e8f5;
  --accent: #00A4EB;
  --accent2: #002F6C;
  --accent-bright: #33b8f0;
  --accent-glow: rgba(0,164,235,0.12);
  --ai: #FF8B00;
  --ai-glow: rgba(255,139,0,0.12);
  --warn: #FF8B00;
  --danger: #F02B1F;
  --green: #00CD63;
  --green-glow: rgba(0,205,99,0.12);
  --text: #201547;
  --muted: #6b7a99;
  --border: #d0dff0;
  --border2: #b8ccdf;
  --r: 8px;
  --nav-h: 64px;
  --nav-w: 270px;
  --nav-bg: #001527;
  --nav-muted: rgba(160,210,240,0.55);
  --shadow-card: 0 2px 8px rgba(0,47,108,0.05),0 8px 24px rgba(0,47,108,0.07);
  --shadow-card-hover: 0 4px 16px rgba(0,47,108,0.09),0 16px 40px rgba(0,47,108,0.12);
  --grad-ai: linear-gradient(135deg,#FAE6C3 0%,#ffd6a0 50%,#ffe4b5 100%);
  --font: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Helvetica Neue",Arial,sans-serif;
  --mono: ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{
  background: linear-gradient(160deg,#eef0ff 0%,#e8eaff 45%,#eceffe 100%);
  color:var(--text);
  font-family:var(--font);
  min-height:100vh;
  padding-top:0;
  padding-left:var(--nav-w);
  padding-bottom:60px;
  -webkit-font-smoothing:antialiased;
}

/* ── TOP NAV ── */
.topnav{
  position:fixed;top:0;left:0;bottom:0;width:var(--nav-w);
  background:#ffffff;backdrop-filter:none;-webkit-backdrop-filter:none;
  z-index:200;display:flex;align-items:stretch;
  border-right:1px solid rgba(0,47,108,0.08);
  box-shadow:4px 0 20px rgba(0,47,108,0.05);
}
.topnav-inner{
  width:100%;height:100%;padding:24px 18px;
  display:flex;flex-direction:column;align-items:stretch;gap:26px;
}
.brand{display:flex;align-items:center;gap:11px;flex-shrink:0;padding:6px 8px;}
.brand{cursor:pointer;}
.brand-icon{display:none;}
.brand-name{font-weight:800;font-size:15px;letter-spacing:0;color:#002F6C;}
.brand-name span{color:var(--ai);}
.topnav-sub{font-size:10px;color:var(--muted);margin-top:-1px;}

/* ── PRODUCT LOGOS / ICONS ── */
.tt-logo-mark,.tt-icon{
  --mark-a:var(--accent);
  --mark-b:var(--accent2);
  position:relative;display:inline-grid;place-items:center;flex-shrink:0;
  width:38px;height:38px;border-radius:11px;
  background:linear-gradient(145deg,var(--mark-a),var(--mark-b));
  box-shadow:0 12px 22px rgba(91,113,224,0.22);
  color:#fff;overflow:hidden;
}
.tt-logo-mark::before{
  content:"";position:absolute;inset:7px;border:2px solid rgba(255,255,255,0.88);
  border-radius:7px;transform:skewX(-9deg);
}
.tt-logo-mark::after{
  content:"";position:absolute;width:15px;height:2px;background:#fff;border-radius:2px;
  transform:rotate(-38deg) translate(1px,2px);box-shadow:0 6px 0 rgba(255,255,255,0.78);
}
.tt-logo-word{font-size:38px;font-weight:900;letter-spacing:0;color:var(--text);line-height:1;}
.tt-logo-word span{color:var(--accent2);}
.tt-logo-lockup{display:inline-flex;align-items:center;justify-content:center;gap:14px;margin:0 auto 16px;}
.tt-logo-lockup .tt-logo-mark{width:58px;height:58px;border-radius:16px;}
.tt-logo-lockup .tt-logo-mark::before{inset:10px;border-radius:10px;border-width:3px;}
.tt-logo-lockup .tt-logo-mark::after{width:23px;height:3px;box-shadow:0 9px 0 rgba(255,255,255,0.78);}
.landing-logo{display:none;}
/* Sidebar tab icons - the exact same inline SVG mark used in each tab's
   page-header and on the landing feature cards, just scaled down, so the
   icon is visually identical everywhere it appears. */
.tab-icon{display:inline-flex;flex-shrink:0;width:24px;height:24px;}
.tab-icon svg{width:100%;height:100%;display:block;}
.landing-feature-icon{margin:0 auto 14px;display:flex;align-items:center;justify-content:center;}

/* ── NAV LABEL ── */
.nav-label{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.3px;color:var(--muted);padding:4px 12px 2px;opacity:0.6;}

/* ── TABS (top nav items) ── */
.tabs{display:flex;flex-direction:column;align-items:stretch;gap:6px;overflow-x:visible;}
.tab{
  font-family:var(--font);font-size:13px;font-weight:500;
  padding:9px 12px;border-radius:8px;
  border:none;cursor:pointer;color:#5a7090;background:transparent;
  transition:background 0.15s,color 0.15s,transform 0.15s;display:flex;align-items:center;gap:8px;
  text-align:left;white-space:normal;position:relative;
}
.tab:hover{background:rgba(0,164,235,0.07);color:#002F6C;}
.tab.active{background:rgba(0,164,235,0.10);color:#002F6C;font-weight:700;border-radius:8px;border-left:3px solid #00A4EB;}
.tab.active svg{opacity:1 !important;}
.topnav-right{margin-top:auto;display:flex;flex-direction:column;align-items:flex-start;gap:8px;flex-shrink:0;padding:16px 8px 4px;border-top:1px solid var(--border);}
.akamai-logo{height:64px;width:auto;flex-shrink:0;}
.akamai-logo g{fill:#002f6c;}

/* ── SIDEBAR COLLAPSE TOGGLE ── */
.nav-toggle{
  position:absolute;top:30px;right:-13px;width:26px;height:26px;
  border-radius:50%;background:#fff;border:1px solid var(--border2);
  box-shadow:0 2px 6px rgba(0,47,108,0.15);
  display:flex;align-items:center;justify-content:center;cursor:pointer;
  z-index:250;transition:background 0.15s,transform 0.15s;
}
.nav-toggle:hover{background:var(--surface2);}
.nav-toggle svg{transition:transform 0.2s;}
body.nav-collapsed .nav-toggle svg{transform:rotate(180deg);}
body.nav-collapsed .brand-text,
body.nav-collapsed .tab-label,
body.nav-collapsed .topnav-right-text{display:none;}
.topnav-right-text{
  display:inline-flex;align-items:center;gap:4px;
  font-size:9.5px;font-weight:600;color:#5a7090;letter-spacing:0;
  padding:5px 9px;border-radius:14px;white-space:nowrap;
  background:rgba(0,47,108,0.05);border:1px solid rgba(0,47,108,0.10);
}
.topnav-right-text svg{flex-shrink:0;opacity:0.75;}
body.nav-collapsed .brand{justify-content:center;padding:6px 0;}
body.nav-collapsed .tabs{align-items:center;}
body.nav-collapsed .tab{justify-content:center;padding:10px 0;gap:0;}
body.nav-collapsed .topnav-inner{padding:24px 10px;}
body.nav-collapsed .topnav-right{align-items:center;}
body.nav-collapsed .akamai-logo{height:28px;}
@media(max-width:860px){
  .nav-toggle{display:none;}
}

/* ── MAIN / PANELS ── */
.main{min-height:100vh;position:relative;isolation:isolate;}
.main::before,.main::after{
  content:"";position:fixed;border-radius:50%;pointer-events:none;
  filter:blur(80px);z-index:-1;
}
.main::before{
  width:440px;height:440px;top:-120px;right:-100px;
  background:radial-gradient(circle,rgba(0,164,235,0.11) 0%,transparent 70%);
}
.main::after{
  width:380px;height:380px;bottom:-120px;left:calc(var(--nav-w) + 40px);
  background:radial-gradient(circle,rgba(0,80,255,0.08) 0%,transparent 70%);
}
@media(max-width:860px){
  .main::after{left:-60px;}
}
.panel{display:none;padding:34px 42px 60px;max-width:1240px;margin:0 auto;animation:fadeUp 0.2s ease;}
.panel.active{display:block;}
@keyframes fadeUp{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}

/* Staggered entrance for panel content - the same fadeSlideUp touch used on the landing page */
.panel.active .page-header{animation:fadeSlideUp 0.45s ease both;}
.panel.active .card{animation:fadeSlideUp 0.4s ease both;}
.panel.active .card:nth-of-type(1){animation-delay:0.04s;}
.panel.active .card:nth-of-type(2){animation-delay:0.08s;}
.panel.active .card:nth-of-type(3){animation-delay:0.12s;}
.panel.active .card:nth-of-type(4){animation-delay:0.16s;}
.panel.active .card:nth-of-type(n+5){animation-delay:0.2s;}

/* ── LAYOUT ── */
.grid-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-bottom:16px;}
@media(max-width:860px){
  body{padding-left:0;padding-top:var(--nav-h);}
  .topnav{left:0;right:0;bottom:auto;width:auto;height:var(--nav-h);border-right:none;border-bottom:1px solid var(--border);box-shadow:0 8px 28px rgba(58,72,101,0.08);}
  .topnav-inner{height:var(--nav-h);padding:0 16px;flex-direction:row;align-items:center;}
  .topnav-inner{padding:0 16px;gap:16px;}
  .brand-name,.topnav-sub{display:none;}
  .tabs{flex-direction:row;align-items:center;gap:4px;overflow-x:auto;}
  .tab{white-space:nowrap;padding:8px 10px;}
  .tab.active{box-shadow:none;}
  .topnav-right{display:none;}
  .grid-2{grid-template-columns:1fr;}
  .panel{padding-left:18px;padding-right:18px;}
}

/* ── CARDS ── */
.card{
  background:var(--surface);border:1px solid rgba(91,95,239,0.09);
  border-radius:14px;padding:22px 24px;
  box-shadow:var(--shadow-card);
  transition:box-shadow 0.2s,border-color 0.2s,transform 0.2s;
}
.card:hover{border-color:rgba(91,95,239,0.18);box-shadow:var(--shadow-card-hover);transform:translateY(-2px);}
.card-head{display:flex;align-items:center;gap:9px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid var(--border);}
.card-dot{width:3px;height:18px;background:var(--accent);border-radius:2px;flex-shrink:0;}
.card-title{font-size:13px;font-weight:700;color:var(--text);text-transform:none;letter-spacing:0;}

/* ── FORM ── */
label{display:block;font-size:11.5px;font-weight:600;color:var(--muted);margin-bottom:5px;}
select,input[type=text],input:not([type]),input[type=number]{
  width:100%;padding:9px 11px;margin-bottom:14px;
  border-radius:7px;border:1px solid var(--border);
  background:var(--surface2);color:var(--text);
  font-family:var(--font);font-size:13.5px;outline:none;
  transition:border-color 0.15s,box-shadow 0.15s;-webkit-appearance:none;
}
select:focus,input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow);background:var(--surface);}
textarea.form-area{
  width:100%;padding:9px 11px;margin-bottom:14px;
  border-radius:5px;border:1px solid var(--border);
  background:var(--surface2);color:var(--text);
  font-family:var(--font);font-size:13.5px;outline:none;
  resize:vertical;min-height:70px;
  transition:border-color 0.15s;
}
textarea.form-area:focus{border-color:var(--accent);background:var(--surface);}
.exp-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}

/* ── BUTTONS ── */
.btn-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.btn{
  display:inline-flex;align-items:center;gap:7px;
  padding:8px 14px;border-radius:7px;border:1px solid transparent;cursor:pointer;
  font-family:var(--font);font-size:13px;font-weight:600;
  transition:all 0.12s;white-space:nowrap;
}
.btn-primary{background:linear-gradient(135deg,#00A4EB,#002F6C);color:#fff;box-shadow:0 6px 20px rgba(91,95,239,0.28);}
.btn-primary:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 10px 28px rgba(91,95,239,0.36);}
.btn-linkedin{background:#0a66c2;color:white;}
.btn-linkedin:hover{background:#0958a8;}
.btn-ghost{background:var(--surface);color:var(--text);border:1px solid var(--border2);}
.btn-ghost:hover{background:var(--surface3);border-color:var(--muted);}
.btn-ai{background:linear-gradient(135deg,#00A4EB,#002F6C);color:#fff;box-shadow:0 6px 18px rgba(91,95,239,0.25);}
.btn-ai:hover{filter:brightness(1.08);transform:translateY(-1px);}
.btn-danger{background:transparent;color:var(--danger);border:1px solid rgba(216,93,105,0.3);}
.btn-danger:hover{background:rgba(216,93,105,0.08);border-color:var(--danger);}
.btn-sm{padding:5px 10px;font-size:12px;}
.btn:disabled{opacity:0.4;cursor:not-allowed;}

/* ── OUTPUT BOXES ── */
.out-wrap{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:14px;}
.out-head{display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:var(--surface2);border-bottom:1px solid var(--border);}
.out-label{font-family:var(--mono);font-size:10.5px;font-weight:600;color:var(--text);text-transform:uppercase;letter-spacing:0.8px;}
.out-area{width:100%;padding:13px 14px;background:transparent;border:none;color:var(--text);font-family:var(--mono);font-size:12px;line-height:1.7;resize:vertical;min-height:90px;outline:none;}
.copy-btn{background:transparent;border:1px solid var(--border2);color:var(--muted);padding:4px 9px;font-size:11px;font-weight:600;border-radius:4px;cursor:pointer;font-family:var(--font);transition:all 0.12s;}
.copy-btn:hover{border-color:var(--accent);color:var(--accent);}
.copy-btn.copied{border-color:var(--green);color:var(--green);}

/* ── STATUS ── */
.status{padding:8px 12px;border-radius:5px;font-size:12px;font-weight:500;margin-top:8px;display:none;align-items:center;gap:6px;line-height:1.5;}
.status.info{background:rgba(91,113,224,0.08);color:var(--accent2);border:1px solid rgba(91,113,224,0.2);display:flex;}
.status.success{background:rgba(71,124,101,0.08);color:var(--green);border:1px solid rgba(71,124,101,0.2);display:flex;}
.status.error{background:rgba(216,93,105,0.08);color:var(--danger);border:1px solid rgba(216,93,105,0.2);display:flex;}
.status.warn{background:rgba(223,171,1,0.1);color:#95720a;border:1px solid rgba(223,171,1,0.25);display:flex;}

/* ── SPINNER ── */
.spinner{width:14px;height:14px;border:2px solid rgba(0,0,0,0.12);border-top-color:currentColor;border-radius:50%;animation:spin 0.7s linear infinite;display:none;}
.spinner.on{display:inline-block;}
@keyframes spin{to{transform:rotate(360deg);}}

/* ── DIVIDER ── */
.divider{height:1px;background:var(--border);margin:20px 0;}

/* ── LOGIC TOGGLE ── */
.logic-btn{
  flex:1;padding:7px 6px;background:var(--surface2);border:none;
  color:var(--muted);font-family:var(--font);font-size:11px;font-weight:600;
  cursor:pointer;transition:all 0.12s;
}
.logic-btn:not(:last-child){border-right:1px solid var(--border);}
.logic-btn.active{background:var(--accent-glow);color:var(--accent);}
.logic-btn:hover:not(.active){background:var(--surface3);color:var(--text);}

/* ════════════════════════════
   CUSTOM ROLES MODAL
════════════════════════════ */
.modal-overlay{
  position:fixed;inset:0;background:rgba(43,51,68,0.46);
  z-index:500;
  display:none;place-items:center;padding:20px;
}
.modal-overlay.open{display:grid;}
.modal{
  background:var(--surface);border:1px solid var(--border);
  border-radius:8px;padding:26px;width:100%;max-width:520px;
  max-height:90vh;overflow-y:auto;
  box-shadow:0 24px 55px rgba(43,51,68,0.22);
  animation:fadeUp 0.2s ease;
}
.modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;}
.modal-title{font-size:15px;font-weight:700;color:var(--text);}
.modal-close{background:transparent;border:1px solid var(--border);color:var(--muted);width:26px;height:26px;border-radius:5px;cursor:pointer;font-size:13px;display:grid;place-items:center;transition:all 0.12s;}
.modal-close:hover{border-color:var(--danger);color:var(--danger);}

/* Saved roles list in modal */
.saved-roles-list{margin-bottom:18px;}
.saved-role-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:9px 11px;background:var(--surface2);border:1px solid var(--border);
  border-radius:5px;margin-bottom:8px;
}
.saved-role-name{font-size:12.5px;font-weight:600;color:var(--text);}
.saved-role-cat{font-size:10.5px;color:var(--muted);margin-top:2px;}
.no-saved{text-align:center;padding:16px;color:var(--muted);font-size:12px;}

/* ── JOB DESCRIPTION ANALYZER ── */
.jd-textarea{
  width:100%;min-height:140px;background:var(--surface2);
  border:1px solid var(--border);border-radius:var(--r);
  color:var(--text);font-family:var(--font);font-size:13.5px;
  padding:14px;resize:vertical;outline:none;transition:border 0.15s;
  line-height:1.6;
}
.jd-textarea:focus{border-color:var(--ai);background:var(--surface);}
.jd-textarea::placeholder{color:var(--muted);}
.ai-result-box{
  background:var(--surface);border:1px solid var(--border);
  border-radius:var(--r);padding:18px;margin-bottom:16px;
  border-left:3px solid var(--ai);
  box-shadow:0 10px 24px rgba(58,72,101,0.05);
}
.ai-result-box.green{border-left-color:var(--accent);}
.ai-result-box.blue{border-left-color:var(--accent2);}
.ai-result-box.warn{border-left-color:var(--warn);}
.ai-section-title{
  font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;
}
.ai-loading{
  display:flex;align-items:center;gap:10px;
  color:var(--muted);font-size:12px;padding:20px 0;
}
.ai-spinner{
  width:18px;height:18px;border:2px solid var(--border2);
  border-top-color:var(--ai);border-radius:50%;
  animation:spin 0.8s linear infinite;flex-shrink:0;
}
.company-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}
.company-chip{
  font-size:11.5px;padding:5px 10px;border-radius:7px;
  background:var(--surface);border:1px solid var(--border2);
  color:var(--accent2);cursor:pointer;transition:all 0.12s;
}
.company-chip:hover{background:var(--accent-glow);border-color:var(--accent2);}
.interview-q{
  padding:10px 0;border-bottom:1px solid var(--border);
  font-size:12.5px;color:var(--text);line-height:1.6;
}
.interview-q:last-child{border-bottom:none;}
.interview-q strong{color:var(--accent);font-size:10px;text-transform:uppercase;
  letter-spacing:1px;display:block;margin-bottom:3px;}
/* ── PROFILE CARDS (LinkedIn-style search result rows) ── */
.profile-cards{display:flex;flex-direction:column;gap:10px;}
.profile-card{
  display:flex;gap:14px;padding:16px;border:1px solid var(--border);
  border-radius:8px;align-items:flex-start;background:var(--surface);
  box-shadow:0 8px 20px rgba(58,72,101,0.05);
  cursor:pointer;
  transition:box-shadow 0.15s,border-color 0.15s,transform 0.15s;
}
.profile-card:hover{
  border-color:var(--accent);
  box-shadow:0 16px 30px rgba(58,72,101,0.11);
  transform:translateY(-1px);
}
.profile-card:active{box-shadow:0 1px 2px rgba(20,20,30,0.06);}
.profile-avatar{
  width:52px;height:52px;border-radius:12px;flex-shrink:0;
  background:linear-gradient(135deg,#00A4EB,#002F6C);color:#fff;
  font-weight:700;font-size:18px;display:grid;place-items:center;
  box-shadow:0 12px 22px rgba(91,113,224,0.22);
}
.profile-card-main{flex:1;min-width:0;}
.profile-card-top{display:flex;align-items:flex-start;gap:10px;}
.profile-name{font-weight:700;font-size:16px;color:var(--text);letter-spacing:-0.1px;}
.profile-headline{font-size:13px;color:var(--text);opacity:0.72;margin-top:3px;line-height:1.45;}
.profile-meta{font-size:12.5px;color:var(--muted);margin-top:4px;}
.profile-location{font-size:12px;color:var(--muted);margin-top:6px;display:flex;align-items:center;gap:4px;}
.profile-skills{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
.skill-tag{font-size:10px;padding:2px 7px;border-radius:4px;
  background:var(--accent-glow);border:1px solid rgba(91,113,224,0.22);color:var(--accent);}
.profile-linkedin-btn{
  flex-shrink:0;display:inline-flex;align-items:center;gap:5px;
  font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:7px;
  background:#fff;color:var(--accent2);border:1px solid var(--border2);text-decoration:none;white-space:nowrap;
  transition:background 0.12s,color 0.12s;
}
.profile-linkedin-btn:hover{background:var(--accent2);border-color:var(--accent2);color:#fff;}
.jd-tabs{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;}
.jd-tab{font-size:12px;padding:7px 13px;border-radius:7px;cursor:pointer;
  border:1px solid var(--border2);color:var(--muted);background:var(--surface);
  font-weight:600;transition:all 0.12s;}
.jd-tab.active{background:var(--accent-glow);border-color:rgba(91,113,224,0.35);color:var(--accent2);}

/* ── CANDIDATE DETAIL MODAL ── */
.cand-modal-head{display:flex;align-items:flex-start;gap:14px;margin-bottom:22px;}
.cand-avatar-lg{
  width:64px;height:64px;border-radius:14px;flex-shrink:0;
  background:linear-gradient(135deg,#00A4EB,#002F6C);color:#fff;
  font-weight:700;font-size:22px;display:grid;place-items:center;
  box-shadow:0 14px 26px rgba(91,113,224,0.24);
}
.cand-modal-name{font-size:18px;font-weight:700;color:var(--text);letter-spacing:-0.2px;}
.cand-modal-role{font-size:13px;color:var(--muted);margin-top:3px;}
.cand-modal-location{font-size:12px;color:var(--muted);margin-top:6px;}
.cand-section{margin-bottom:18px;}
.cand-section-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);margin-bottom:8px;}
.cand-field{font-size:13px;color:var(--text);margin-bottom:6px;line-height:1.5;}
.cand-field:last-child{margin-bottom:0;}
.cand-field span{color:var(--muted);}

/* ── PAGE HEADER (document-workspace identity block) ── */
.page-header{
  margin-bottom:28px;max-width:none;
  display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px 14px;
  align-items:center;background:transparent;
  border:none;padding:20px 0 22px;
  box-shadow:none;
  border-bottom:1.5px solid rgba(0,47,108,0.1);
}
.page-icon{width:42px;height:42px;margin-bottom:0;}
.page-title{font-size:26px;font-weight:800;color:var(--text);letter-spacing:-0.3px;margin-bottom:4px;line-height:1.2;}
.page-desc{font-size:13.5px;color:var(--muted);line-height:1.55;grid-column:2 / 4;}
.page-badge{
  display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:600;
  padding:5px 9px;border-radius:7px;margin-top:0;justify-self:end;
}
.page-badge.ai{background:var(--ai-glow);color:var(--text);border:1px solid rgba(121,136,141,0.25);}
.page-badge.live{background:var(--accent-glow);color:var(--accent2);border:1px solid rgba(91,113,224,0.3);}

/* ── SECTION HINT (short helper line under a card-head, before the fields) ── */
.section-hint{font-size:11.5px;color:var(--muted);line-height:1.5;margin:-10px 0 16px;}


/* ── LANDING PAGE ── */
.landing{
  position:fixed;inset:0;z-index:1000;
  background:linear-gradient(160deg,#f0f6ff 0%,#eaf2fb 50%,#f5f7fa 100%);
  display:flex;align-items:center;justify-content:center;
  padding:48px 24px;overflow-y:auto;
  animation:fadeUp 0.25s ease;
}
.landing.hidden{display:none;}
.landing-inner{max-width:780px;width:100%;text-align:center;margin:auto;}
.landing-tagline{font-size:17px;color:#4a6080;line-height:1.65;max-width:560px;margin:0 auto 20px;}
.landing-features{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:36px;}
.landing-feature{
  background:#ffffff;border:1px solid rgba(0,47,108,0.08);border-radius:16px;
  padding:24px 18px;box-shadow:0 2px 12px rgba(0,47,108,0.06);
  transition:transform 0.22s cubic-bezier(.34,1.4,.64,1),box-shadow 0.22s;
  cursor:default;
}
.landing-feature:hover{transform:translateY(-4px);box-shadow:0 10px 32px rgba(0,164,235,0.16);}
.landing-footer{
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;
  margin-top:36px;padding-top:22px;
  border-top:1px solid rgba(0,47,108,0.09);
}
.landing-footer-logo{height:52px;width:auto;flex-shrink:0;opacity:0.92;}
.landing-footer-text{
  display:inline-flex;align-items:center;gap:6px;
  font-size:12px;color:#5a7090;letter-spacing:0.2px;font-weight:600;
  padding:6px 14px;border-radius:20px;
  background:rgba(0,47,108,0.05);border:1px solid rgba(0,47,108,0.10);
}
.landing-footer-text svg{flex-shrink:0;opacity:0.75;}
.landing-feature-title{font-size:15px;font-weight:700;color:#002F6C;margin-bottom:6px;}
.landing-feature-desc{font-size:13px;color:#5a7090;line-height:1.5;}
.landing-cta{
  padding:14px 36px;font-size:16px;border-radius:12px;
  background:linear-gradient(135deg,#00A4EB,#0050FF) !important;
  box-shadow:0 8px 28px rgba(0,164,235,0.45);
  transition:transform 0.18s,box-shadow 0.18s;
}
.landing-cta:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(0,164,235,0.36);}
@media(max-width:700px){
  .landing-features{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:460px){
  .landing-features{grid-template-columns:1fr;}
}

/* ══ LANDING PAGE ANIMATIONS (scoped, no global breakage) ══ */

/* Canvas grid effect - a fine grid with a few cells that softly light up
   and short traveling light-trace lines (with a glowing dot at the head)
   that grow across the grid and fade out. Movement lives in the
   background layer itself, nothing floats on top of it. */
.landing-fx{
  position:absolute;inset:0;width:100%;height:100%;
  pointer-events:none;
  mask-image:radial-gradient(ellipse 85% 80% at 50% 30%,#000 0%,transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse 85% 80% at 50% 30%,#000 0%,transparent 80%);
}

/* Ambient glows - static depth behind the hero (no bouncing/translating) */
.l-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(60px);}
.l-orb-1{
  width:380px;height:380px;
  background:radial-gradient(circle,rgba(0,164,235,0.32) 0%,transparent 70%);
  top:-80px;left:-60px;
}
.l-orb-2{
  width:300px;height:300px;
  background:radial-gradient(circle,rgba(0,80,255,0.24) 0%,transparent 70%);
  bottom:-60px;right:-40px;
}

/* Hero - orbiting logos around the TalentTrace mark */
.landing-hero-wrap{
  width:100%;max-width:760px;margin:0 auto 20px;
  position:relative;height:190px;overflow:hidden;
  display:flex;justify-content:center;
}
@media(min-width:640px){
  .landing-hero-wrap{height:230px;}
}
.orbit-center{
  position:absolute;bottom:0;left:50%;transform:translate(-50%,50%);
  width:110px;height:110px;border-radius:50%;z-index:5;
  background:radial-gradient(circle,rgba(0,164,235,0.18) 0%,transparent 72%);
  display:flex;align-items:center;justify-content:center;
}
.orbit-center-mark{
  width:78px;height:78px;border-radius:50%;background:#fff;
  box-shadow:0 12px 32px rgba(0,47,108,0.20);
  display:flex;align-items:center;justify-content:center;
}
.orbit-ring{
  position:absolute;bottom:0;left:50%;transform:translate(-50%,50%);
  border-radius:50%;border:1px solid rgba(0,47,108,0.12);
}
.orbit-ring-1{width:180px;height:180px;}
.orbit-ring-2{width:260px;height:260px;}
.orbit-ring-3{width:340px;height:340px;}
@media(min-width:640px){
  .orbit-ring-1{width:230px;height:230px;}
  .orbit-ring-2{width:330px;height:330px;}
  .orbit-ring-3{width:430px;height:430px;}
}
.orbit-icon-wrap{
  position:absolute;bottom:0;left:50%;width:38px;margin-left:-19px;
  transform-origin:bottom center;
  display:flex;flex-direction:column;align-items:center;justify-content:flex-start;
}
.orbit-icon-wrap-1{height:90px;}
.orbit-icon-wrap-2{height:130px;}
.orbit-icon-wrap-3{height:170px;}
@media(min-width:640px){
  .orbit-icon-wrap-1{height:115px;}
  .orbit-icon-wrap-2{height:165px;}
  .orbit-icon-wrap-3{height:215px;}
}
.orbit-icon{
  width:38px;height:38px;border-radius:50%;background:#fff;margin-top:-19px;
  border:1px solid rgba(0,47,108,0.10);box-shadow:0 6px 16px rgba(0,47,108,0.14);
  display:flex;align-items:center;justify-content:center;position:relative;z-index:2;
}
.orbit-icon svg{width:20px;height:20px;display:block;}
.orbit-icon span{font-size:18px;color:#FF8B00;line-height:1;}

@keyframes orbit-cw{from{transform:rotate(var(--start-angle))}to{transform:rotate(calc(var(--start-angle) + 360deg))}}
@keyframes orbit-ccw{from{transform:rotate(var(--start-angle))}to{transform:rotate(calc(var(--start-angle) - 360deg))}}
@keyframes counter-cw{from{transform:rotate(var(--counter-offset,0deg))}to{transform:rotate(calc(var(--counter-offset,0deg) - 360deg))}}
@keyframes counter-ccw{from{transform:rotate(var(--counter-offset,0deg))}to{transform:rotate(calc(var(--counter-offset,0deg) + 360deg))}}

/* Logo mark */
.landing-logo-wrap{display:flex;justify-content:center;margin-bottom:20px;animation:fadeSlideUp 0.6s ease both;}
.tt-logo-mark{
  width:52px;height:52px;border-radius:14px;
  background:linear-gradient(135deg,#00A4EB,#002F6C);
  box-shadow:0 8px 24px rgba(91,95,239,0.30);
  position:relative;
}
.tt-logo-mark::before{
  content:'T';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  color:white;font-size:26px;font-weight:900;font-family:-apple-system,sans-serif;
  display:grid;place-items:center;
}

/* Headline gradient accent */
.landing-hl-accent{
  background:linear-gradient(135deg,#00A4EB 0%,#0050FF 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

/* Entrance animations - landing only */
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}

.landing-inner > .landing-logo-wrap{animation:fadeSlideUp 0.5s ease both 0s;}
.landing-headline{animation:fadeSlideUp 0.5s ease both 0.1s;opacity:0;animation-fill-mode:both;}
.landing-tagline{animation:fadeSlideUp 0.5s ease both 0.2s;opacity:0;animation-fill-mode:both;}
.landing-hero-wrap{animation:fadeSlideUp 0.55s ease both 0.3s;opacity:0;animation-fill-mode:both;}
.landing-features{animation:fadeSlideUp 0.5s ease both 0.45s;opacity:0;animation-fill-mode:both;}
.landing-cta{animation:fadeSlideUp 0.5s ease both 0.6s;opacity:0;animation-fill-mode:both;}

/* Card icon wrapper */
.landing-feature-icon svg{display:block;}


/* ── Brand icon square ── */
.brand-icon-sq{
  width:32px;height:32px;flex-shrink:0;border-radius:9px;
  background:linear-gradient(135deg,#00A4EB,#002F6C);
  position:relative;display:grid;place-items:center;
}
.brand-icon-sq::after{
  content:'T';color:white;font-size:17px;font-weight:900;
  font-family:-apple-system,BlinkMacSystemFont,sans-serif;line-height:1;
}


/* ══ AKAMAI-STYLE LANDING ENHANCEMENTS ══ */

/* Deep glow pulse behind hero */
.landing-glow{
  position:absolute;
  width:600px;height:300px;
  left:50%;top:30%;
  transform:translate(-50%,-50%);
  background:radial-gradient(ellipse,rgba(0,164,235,0.24) 0%,rgba(0,80,255,0.12) 40%,transparent 70%);
  pointer-events:none;
  filter:blur(20px);
  animation:glowPulse 5s ease-in-out infinite;
}
@keyframes glowPulse{0%,100%{opacity:0.7;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.15);}}

/* Wave mesh overlay */
.landing-wave{
  position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0.4;
}
.landing-wave svg{width:100%;height:100%;position:absolute;top:0;left:0;}

/* Narrow "badge" above headline - Akamai does this */
.landing-badge{
  display:inline-flex;align-items:center;gap:7px;
  padding:7px 16px;border-radius:20px;
  background:rgba(0,164,235,0.08);
  border:1px solid rgba(0,164,235,0.20);
  font-size:13.5px;font-weight:600;color:#00A4EB;
  letter-spacing:0.02em;margin-bottom:18px;
  animation:fadeSlideUp 0.4s ease both 0s;
}
.landing-badge-dot{
  width:7px;height:7px;border-radius:50%;
  background:#00A4EB;
  box-shadow:0 0 6px #00A4EB;
  animation:dotBlink 2s ease-in-out infinite;
}
@keyframes dotBlink{0%,100%{opacity:1;}50%{opacity:0.35;}}

/* Subtle horizontal line divider under hero */
.landing-divider{
  width:100%;max-width:600px;margin:0 auto 28px;
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,164,235,0.3),transparent);
}


.landing-headline{color:#002F6C !important;font-size:clamp(34px,5vw,50px);font-weight:800;line-height:1.15;letter-spacing:-0.5px;}
.landing-hl-accent{background:linear-gradient(135deg,#00A4EB 0%,#0050FF 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
</style>
</head>
<body>

<!-- ── LANDING PAGE ── -->
<div id="landing-page" class="landing">

  <!-- Grid + traveling light-trace canvas (Atlan-style moving background) -->
  <canvas id="landing-fx" class="landing-fx" aria-hidden="true"></canvas>

  <!-- Ambient glows (static) -->
  <div class="l-orb l-orb-1" aria-hidden="true"></div>
  <div class="l-orb l-orb-2" aria-hidden="true"></div>

  <div class="landing-inner">

    <!-- Logo mark -->
    <div class="landing-logo-wrap">
      <svg width="250" height="56" viewBox="0 0 250 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#4dc8f5"/>
            <stop offset="100%" stop-color="#0090d6"/>
          </linearGradient>
        </defs>
        <!-- Trace Rings - aligned arc gaps, even stroke weight -->
        <path d="M28,4 A24,24 0 1,0 52,28" stroke="#7dd8f8" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M28,10 A18,18 0 1,0 46,28" stroke="#2ab4f0" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M28,16 A12,12 0 1,0 40,28" stroke="#0090d6" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M28,22 A6,6 0 1,0 34,28" stroke="#005fa3" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Center point - the signal homing in on talent -->
        <circle cx="24" cy="33" r="7" stroke="#7dd8f8" stroke-width="1.6" fill="none" opacity="0.55"/>
        <circle cx="24" cy="33" r="3.3" fill="#FF8B00"/>

        <!-- "TalentTrace" wordmark -->
        <text x="64" y="37" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif" font-size="30" font-weight="900" fill="#002F6C" letter-spacing="-1">Talent</text>
        <text x="143" y="37" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif" font-size="30" font-weight="900" fill="#FF8B00" letter-spacing="-1">Trace</text>
      </svg>
    </div>

    <!-- Akamai-style badge -->
    <div class="landing-badge">
      <span class="landing-badge-dot"></span>
      AI-Powered Sourcing Workspace
    </div>

    <!-- Deep glow -->
    <div class="landing-glow" aria-hidden="true"></div>

    <!-- Wave mesh -->
    <div class="landing-wave" aria-hidden="true">
      <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,300 C180,200 360,400 540,300 C720,200 900,400 1080,300 C1260,200 1350,350 1440,300 L1440,600 L0,600 Z" fill="rgba(0,164,235,0.04)"/>
        <path d="M0,350 C200,250 400,450 600,350 C800,250 1000,450 1200,350 C1320,290 1380,370 1440,350 L1440,600 L0,600 Z" fill="rgba(0,80,255,0.04)"/>
        <path d="M0,400 C240,320 480,480 720,400 C960,320 1200,480 1440,400 L1440,600 L0,600 Z" fill="rgba(0,164,235,0.03)"/>
      </svg>
    </div>

    <!-- Headline -->
    <h1 class="landing-headline">
      Find great talent,<br><span class="landing-hl-accent">faster than ever</span>
    </h1>

    <p class="landing-tagline">Your AI-powered recruiting workspace - boolean sourcing, job description analysis, and live candidate search across TalentData &amp; GitHub, all in one place.</p>

    <!-- Hero illustration -->
    <div class="landing-hero-wrap">

      <!-- Center mark -->
      <div class="orbit-center" aria-hidden="true">
        <div class="orbit-center-mark">
          <svg width="46" height="46" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18,3 A15,15 0 1,0 33,18" stroke="#7dd8f8" stroke-width="2.4" fill="none" stroke-linecap="round"/>
            <path d="M18,7 A11,11 0 1,0 29,18" stroke="#2ab4f0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
            <path d="M18,11 A7,7 0 1,0 25,18" stroke="#0090d6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
            <path d="M18,15 A3,3 0 1,0 21,18" stroke="#005fa3" stroke-width="2.4" fill="none" stroke-linecap="round"/>
            <circle cx="15.5" cy="21" r="4.4" stroke="#7dd8f8" stroke-width="1.1" fill="none" opacity="0.55"/>
            <circle cx="15.5" cy="21" r="2.1" fill="#FF8B00"/>
          </svg>
        </div>
      </div>

      <!-- Orbit rings -->
      <div class="orbit-ring orbit-ring-1" aria-hidden="true"></div>
      <div class="orbit-ring orbit-ring-2" aria-hidden="true"></div>
      <div class="orbit-ring orbit-ring-3" aria-hidden="true"></div>

      <!-- Ring 1 - LinkedIn / Google X-Ray -->
      <div class="orbit-icon-wrap orbit-icon-wrap-1" style="--start-angle:-90deg;animation:orbit-cw 16s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:90deg;animation:counter-cw 16s linear infinite;">
          <svg viewBox="0 0 24 24"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-1" style="--start-angle:0deg;animation:orbit-cw 16s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:0deg;animation:counter-cw 16s linear infinite;">
          <svg viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-1" style="--start-angle:90deg;animation:orbit-cw 16s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:-90deg;animation:counter-cw 16s linear infinite;">
          <svg viewBox="0 0 24 24"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-1" style="--start-angle:180deg;animation:orbit-cw 16s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:-180deg;animation:counter-cw 16s linear infinite;">
          <svg viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>
        </div>
      </div>

      <!-- Ring 2 - StackOverflow / GitHub -->
      <div class="orbit-icon-wrap orbit-icon-wrap-2" style="--start-angle:-45deg;animation:orbit-ccw 22s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:45deg;animation:counter-ccw 22s linear infinite;">
          <svg viewBox="0 0 24 24"><path fill="#F48024" d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H17.78v-2.137H6.111v2.137zm.259-4.852 11.383 2.381.45-2.077-11.382-2.382-.451 2.078zm1.359-5.056 10.57 4.93.894-1.95-10.57-4.929-.894 1.95zm2.748-4.691 8.946 7.404 1.362-1.681-8.945-7.403-1.363 1.68zm5.101-5.049-1.742 1.294 6.921 9.42 1.742-1.294-6.921-9.42z"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-2" style="--start-angle:45deg;animation:orbit-ccw 22s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:-45deg;animation:counter-ccw 22s linear infinite;">
          <svg viewBox="0 0 24 24"><path fill="#181717" fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-2" style="--start-angle:135deg;animation:orbit-ccw 22s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:-135deg;animation:counter-ccw 22s linear infinite;">
          <svg viewBox="0 0 24 24"><path fill="#F48024" d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H17.78v-2.137H6.111v2.137zm.259-4.852 11.383 2.381.45-2.077-11.382-2.382-.451 2.078zm1.359-5.056 10.57 4.93.894-1.95-10.57-4.929-.894 1.95zm2.748-4.691 8.946 7.404 1.362-1.681-8.945-7.403-1.363 1.68zm5.101-5.049-1.742 1.294 6.921 9.42 1.742-1.294-6.921-9.42z"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-2" style="--start-angle:-135deg;animation:orbit-ccw 22s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:135deg;animation:counter-ccw 22s linear infinite;">
          <svg viewBox="0 0 24 24"><path fill="#181717" fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        </div>
      </div>

      <!-- Ring 3 - TalentData / AI-powered -->
      <div class="orbit-icon-wrap orbit-icon-wrap-3" style="--start-angle:-20deg;animation:orbit-cw 28s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:20deg;animation:counter-cw 28s linear infinite;">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4" fill="#00A4EB"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#00A4EB" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="17.5" cy="14" r="3" stroke="#002F6C" stroke-width="1.6" fill="none"/><line x1="19.6" y1="16.1" x2="22" y2="18.5" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-3" style="--start-angle:70deg;animation:orbit-cw 28s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:-70deg;animation:counter-cw 28s linear infinite;">
          <span>✦</span>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-3" style="--start-angle:160deg;animation:orbit-cw 28s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:-160deg;animation:counter-cw 28s linear infinite;">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4" fill="#00A4EB"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#00A4EB" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="17.5" cy="14" r="3" stroke="#002F6C" stroke-width="1.6" fill="none"/><line x1="19.6" y1="16.1" x2="22" y2="18.5" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div class="orbit-icon-wrap orbit-icon-wrap-3" style="--start-angle:-110deg;animation:orbit-cw 28s linear infinite;">
        <div class="orbit-icon" style="--counter-offset:110deg;animation:counter-cw 28s linear infinite;">
          <span>✦</span>
        </div>
      </div>
    </div>

    <div class="landing-divider"></div>
    <!-- Feature cards: 4 columns -->
    <div class="landing-features">
      <div class="landing-feature">
        <div class="landing-feature-icon"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#lbb)"/><defs><linearGradient id="lbb" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#00A4EB"/><stop offset="1" stop-color="#002F6C"/></linearGradient></defs><rect x="7" y="7" width="10" height="10" rx="3" fill="white" opacity="0.95"/><rect x="23" y="7" width="10" height="10" rx="5" fill="white" opacity="0.6"/><rect x="15" y="23" width="10" height="10" rx="3" fill="white" opacity="0.9"/><line x1="12" y1="17" x2="20" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/><line x1="28" y1="17" x2="20" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/></svg></div>
        <div class="landing-feature-title">Boolean Builder</div>
        <div class="landing-feature-desc">Sourcing strings for LinkedIn, Google X-Ray, StackOverflow &amp; GitHub</div>
      </div>
      <div class="landing-feature">
        <div class="landing-feature-icon"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#ljd)"/><defs><linearGradient id="ljd" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#3ab8f5"/><stop offset="1" stop-color="#002F6C"/></linearGradient></defs><rect x="9" y="7" width="18" height="22" rx="3" fill="white" opacity="0.95"/><line x1="13" y1="13" x2="23" y2="13" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><line x1="13" y1="17" x2="23" y2="17" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><line x1="13" y1="21" x2="19" y2="21" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><path d="M28 22 L29.4 26 L33 27 L29.4 28 L28 32 L26.6 28 L23 27 L26.6 26 Z" fill="white" opacity="0.95"/></svg></div>
        <div class="landing-feature-title">Job Description Analyzer</div>
        <div class="landing-feature-desc">Target companies, interview questions &amp; profile checklists</div>
      </div>
      <div class="landing-feature">
        <div class="landing-feature-icon"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#ltd)"/><defs><linearGradient id="ltd" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#00A4EB"/><stop offset="1" stop-color="#477c65"/></linearGradient></defs><circle cx="15" cy="14" r="5" fill="white" opacity="0.95"/><path d="M6 30c0-5 4-9 9-9s9 4 9 9" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.95"/><circle cx="28" cy="22" r="4.5" stroke="white" stroke-width="1.8" fill="none" opacity="0.7"/><circle cx="28" cy="22" r="7.5" stroke="white" stroke-width="1" fill="none" opacity="0.3"/><line x1="31.2" y1="25.2" x2="34.5" y2="28.5" stroke="white" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/></svg></div>
        <div class="landing-feature-title">TalentData Search</div>
        <div class="landing-feature-desc">Live candidate search across 800M+ profiles</div>
      </div>
      <div class="landing-feature">
        <div class="landing-feature-icon"><svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#lgh)"/><defs><linearGradient id="lgh" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#30363d"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><g transform="translate(8,8) scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="white" opacity="0.9"/></g></svg></div>
        <div class="landing-feature-title">GitHub Search</div>
        <div class="landing-feature-desc">Find engineers by language, location &amp; activity</div>
      </div>
    </div>

    <button class="btn btn-primary landing-cta" onclick="enterWorkspace()">Enter Workspace →</button>

    <div class="landing-footer">
      <svg class="landing-footer-logo" viewBox="296 265 1298 530" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path fill="#00a4eb" d="M592.85,764.11c-100.8-30.77-174.12-123.92-174.12-234.05s74.88-205.29,177.4-235.02c10.48-3.06,7.73-9.86-4.91-9.86-136.28,0-246.8,109.69-246.8,244.89s110.51,244.86,246.8,244.86c12.63,0,13.14-7.3,1.63-10.81Z"/>
          <path fill="#00a4eb" d="M465.48,587.42c-.68-6.58-1.01-13.23-1.01-19.94,0-107.36,87.05-194.39,194.43-194.39,101.52,0,132,45.31,135.78,42.35,4.12-3.26-36.84-93.07-156.05-93.07-107.39,0-194.44,87.03-194.44,194.39,0,24.84,4.65,48.52,13.13,70.31,3.58,9.14,9.08,9.22,8.17.35Z"/>
          <path fill="#00a4eb" d="M546.92,447.31c50.53-22.03,114.01-22.7,176.42-.89,41.91,14.62,66.2,35.5,68.19,34.64,3.31-1.43-24.38-45.28-74.36-64.24-60.51-22.93-125.69-10.93-173.18,26.32-5.22,4.11-3.25,6.87,2.93,4.17Z"/>
          <path fill="#00a4eb" d="M1546.23,538.76c0,14.11-11.44,25.52-25.51,25.52s-25.52-11.41-25.52-25.52,11.42-25.49,25.52-25.49,25.51,11.42,25.51,25.49Z"/>
          <path fill="#002f6c" d="M710.44,643.53h-49.24l42.38-85.89h.49l6.37,85.89h0ZM712.82,682.16l3.01,34.07h53.95l-18.16-198.26h-80.34l-101.57,198.26h54.96l17.05-34.07h71.11Z"/>
          <polygon fill="#002f6c" points="845 629.54 852.9 629.54 891.51 577.43 941.5 577.43 888.16 644.07 920.88 716.23 867.8 716.23 846.48 659.89 838.53 659.89 826.53 716.23 781.12 716.23 823.22 517.97 868.71 517.97 845 629.54 845 629.54"/>
          <path fill="#002f6c" d="M999.69,658.87c14.82,0,24.6,1.02,22.14,12.67-3.12,14.53-9.4,16.95-28.43,16.95-6.93,0-19.8,0-16.63-15.07,2.71-12.75,11.76-14.54,22.91-14.54h0ZM1012.36,716.23h45.45l18.42-86.69c10.1-47.88-8.21-53.69-54.69-53.69-32.46,0-63.87-.28-73.07,42.83h45.5c2.58-12.46,10.28-15.04,21.68-15.04,19.78,0,18.91,8.21,16.11,21.09l-4.62,21.99h-2.11c-1.72-15.87-21.61-15.64-34.52-15.64-32.82,0-52.37,10.32-59.51,43.67-7.49,35.37,9.36,43.06,41.06,43.06,15.9,0,37.15-3.14,44.66-22.26h1.56l-5.92,20.68h0Z"/>
          <path fill="#002f6c" d="M1149.57,577.43l-4.16,19.56h1.86c9.02-16.39,26.97-21.14,42.55-21.14,19.58,0,38.9,3.41,36.21,27.24h2.12c6.66-19.79,26.94-27.24,44.39-27.24,32.03,0,45.59,13.23,38.75,45.53l-20.23,94.86h-45.42l17.1-80.38c2.23-14.48,4.82-25.1-12.92-25.1s-23.62,11.8-26.77,26.67l-16.78,78.81h-45.45l17.87-84.06c2.19-12.71,3.23-21.42-12.63-21.42-18.77,0-24.34,10.05-27.8,26.67l-16.82,78.81h-45.47l29.57-138.8h44.06Z"/>
          <path fill="#002f6c" d="M1382.84,658.87c14.72,0,24.57,1.02,22.13,12.67-3.06,14.53-9.38,16.95-28.47,16.95-6.88,0-19.82,0-16.62-15.07,2.72-12.75,11.8-14.54,22.95-14.54h0ZM1395.43,716.23h45.45l18.44-86.69c10.15-47.88-8.11-53.69-54.6-53.69-32.59,0-64.04-.28-73.11,42.83h45.49c2.58-12.46,10.36-15.04,21.6-15.04,19.88,0,18.89,8.21,16.28,21.09l-4.74,21.99h-2.12c-1.7-15.87-21.56-15.64-34.47-15.64-32.79,0-52.43,10.32-59.5,43.67-7.5,35.37,9.34,43.06,41.06,43.06,15.88,0,37.14-3.14,44.68-22.26h1.56l-5.99,20.68h0Z"/>
          <path fill="#002f6c" d="M1506.4,716.23h-45.39l29.41-138.8h45.5l-29.53,138.8h0Z"/>
        </g>
      </svg>
      <span class="landing-footer-text">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="#5a7090" stroke-width="2" stroke-linecap="round"/><rect x="4" y="10" width="16" height="11" rx="2.5" stroke="#5a7090" stroke-width="2"/></svg>
        Built for Akamai &middot; Internal Use Only
      </span>
    </div>

  </div>
</div>

<div class="topnav">
  <div class="topnav-inner">
    <div class="brand" onclick="showLanding()" title="Back to home">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Trace Rings - aligned arc gaps, even stroke weight -->
          <path d="M18,3 A15,15 0 1,0 33,18" stroke="#7dd8f8" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M18,7 A11,11 0 1,0 29,18" stroke="#2ab4f0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M18,11 A7,7 0 1,0 25,18" stroke="#0090d6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <path d="M18,15 A3,3 0 1,0 21,18" stroke="#005fa3" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          <!-- Center point - the signal homing in on talent -->
          <circle cx="15.5" cy="21" r="4.4" stroke="#7dd8f8" stroke-width="1.1" fill="none" opacity="0.55"/>
          <circle cx="15.5" cy="21" r="2.1" fill="#FF8B00"/>
        </svg>
      <div class="brand-text">
        <div class="brand-name">Talent<span>Trace</span></div>
        <div class="topnav-sub">Sourcing Workspace</div>
      </div>
    </div>

    <button class="nav-toggle" onclick="toggleNavCollapse()" title="Collapse sidebar" id="nav-toggle-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#5a7090" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('builder',this)" title="Boolean Builder">
        <span class="tab-icon"><svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#tbb)"/><defs><linearGradient id="tbb" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#00A4EB"/><stop offset="1" stop-color="#002F6C"/></linearGradient></defs><rect x="7" y="7" width="10" height="10" rx="3" fill="white" opacity="0.95"/><rect x="23" y="7" width="10" height="10" rx="5" fill="white" opacity="0.6"/><rect x="15" y="23" width="10" height="10" rx="3" fill="white" opacity="0.9"/><line x1="12" y1="17" x2="20" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/><line x1="28" y1="17" x2="20" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/></svg></span>
        <span class="tab-label">Boolean Builder</span>
      </button>
      <button class="tab" onclick="switchTab('jd',this)" title="Job Description Analyzer">
        <span class="tab-icon"><svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#tjd)"/><defs><linearGradient id="tjd" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#3ab8f5"/><stop offset="1" stop-color="#002F6C"/></linearGradient></defs><rect x="9" y="7" width="18" height="22" rx="3" fill="white" opacity="0.95"/><line x1="13" y1="13" x2="23" y2="13" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><line x1="13" y1="17" x2="23" y2="17" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><line x1="13" y1="21" x2="19" y2="21" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><path d="M28 22 L29.4 26 L33 27 L29.4 28 L28 32 L26.6 28 L23 27 L26.6 26 Z" fill="white" opacity="0.95"/></svg></span>
        <span class="tab-label">Job Description Analyzer</span>
      </button>
      <button class="tab" onclick="switchTab('crustdata',this)" title="TalentData Search">
        <span class="tab-icon"><svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#ttd)"/><defs><linearGradient id="ttd" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#00A4EB"/><stop offset="1" stop-color="#477c65"/></linearGradient></defs><circle cx="15" cy="14" r="5" fill="white" opacity="0.95"/><path d="M6 30c0-5 4-9 9-9s9 4 9 9" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.95"/><circle cx="28" cy="22" r="4.5" stroke="white" stroke-width="1.8" fill="none" opacity="0.7"/><line x1="31.2" y1="25.2" x2="34.5" y2="28.5" stroke="white" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/></svg></span>
        <span class="tab-label">TalentData Search</span>
      </button>
      <button class="tab" onclick="switchTab('github',this)" title="GitHub Search">
        <span class="tab-icon"><svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#tgh)"/><defs><linearGradient id="tgh" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#30363d"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><g transform="translate(8,8) scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="white" opacity="0.9"/></g></svg></span>
        <span class="tab-label">GitHub Search</span>
      </button>
      <button class="tab" onclick="switchTab('diversity',this)" title="Diversity Sourcing Resources">
        <span class="tab-icon"><svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#tdv)"/><defs><linearGradient id="tdv" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#ff8b3d"/><stop offset="1" stop-color="#ff5da2"/></linearGradient></defs><rect x="7" y="7" width="14" height="14" rx="3" fill="white" opacity="0.95"/><rect x="19" y="19" width="14" height="14" rx="3" fill="white" opacity="0.6"/><rect x="17" y="17" width="6" height="6" rx="1.3" fill="white" opacity="0.95" transform="rotate(45 20 20)"/></svg></span>
        <span class="tab-label">Diversity Sourcing Resources</span>
      </button>
    </div>

    <div class="topnav-right">
      <svg class="akamai-logo" viewBox="296 265 1298 530" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path fill="#00a4eb" d="M592.85,764.11c-100.8-30.77-174.12-123.92-174.12-234.05s74.88-205.29,177.4-235.02c10.48-3.06,7.73-9.86-4.91-9.86-136.28,0-246.8,109.69-246.8,244.89s110.51,244.86,246.8,244.86c12.63,0,13.14-7.3,1.63-10.81Z"/>
          <path fill="#00a4eb" d="M465.48,587.42c-.68-6.58-1.01-13.23-1.01-19.94,0-107.36,87.05-194.39,194.43-194.39,101.52,0,132,45.31,135.78,42.35,4.12-3.26-36.84-93.07-156.05-93.07-107.39,0-194.44,87.03-194.44,194.39,0,24.84,4.65,48.52,13.13,70.31,3.58,9.14,9.08,9.22,8.17.35Z"/>
          <path fill="#00a4eb" d="M546.92,447.31c50.53-22.03,114.01-22.7,176.42-.89,41.91,14.62,66.2,35.5,68.19,34.64,3.31-1.43-24.38-45.28-74.36-64.24-60.51-22.93-125.69-10.93-173.18,26.32-5.22,4.11-3.25,6.87,2.93,4.17Z"/>
          <path fill="#00a4eb" d="M1546.23,538.76c0,14.11-11.44,25.52-25.51,25.52s-25.52-11.41-25.52-25.52,11.42-25.49,25.52-25.49,25.51,11.42,25.51,25.49Z"/>
          <path fill="#002f6c" d="M710.44,643.53h-49.24l42.38-85.89h.49l6.37,85.89h0ZM712.82,682.16l3.01,34.07h53.95l-18.16-198.26h-80.34l-101.57,198.26h54.96l17.05-34.07h71.11Z"/>
          <polygon fill="#002f6c" points="845 629.54 852.9 629.54 891.51 577.43 941.5 577.43 888.16 644.07 920.88 716.23 867.8 716.23 846.48 659.89 838.53 659.89 826.53 716.23 781.12 716.23 823.22 517.97 868.71 517.97 845 629.54 845 629.54"/>
          <path fill="#002f6c" d="M999.69,658.87c14.82,0,24.6,1.02,22.14,12.67-3.12,14.53-9.4,16.95-28.43,16.95-6.93,0-19.8,0-16.63-15.07,2.71-12.75,11.76-14.54,22.91-14.54h0ZM1012.36,716.23h45.45l18.42-86.69c10.1-47.88-8.21-53.69-54.69-53.69-32.46,0-63.87-.28-73.07,42.83h45.5c2.58-12.46,10.28-15.04,21.68-15.04,19.78,0,18.91,8.21,16.11,21.09l-4.62,21.99h-2.11c-1.72-15.87-21.61-15.64-34.52-15.64-32.82,0-52.37,10.32-59.51,43.67-7.49,35.37,9.36,43.06,41.06,43.06,15.9,0,37.15-3.14,44.66-22.26h1.56l-5.92,20.68h0Z"/>
          <path fill="#002f6c" d="M1149.57,577.43l-4.16,19.56h1.86c9.02-16.39,26.97-21.14,42.55-21.14,19.58,0,38.9,3.41,36.21,27.24h2.12c6.66-19.79,26.94-27.24,44.39-27.24,32.03,0,45.59,13.23,38.75,45.53l-20.23,94.86h-45.42l17.1-80.38c2.23-14.48,4.82-25.1-12.92-25.1s-23.62,11.8-26.77,26.67l-16.78,78.81h-45.45l17.87-84.06c2.19-12.71,3.23-21.42-12.63-21.42-18.77,0-24.34,10.05-27.8,26.67l-16.82,78.81h-45.47l29.57-138.8h44.06Z"/>
          <path fill="#002f6c" d="M1382.84,658.87c14.72,0,24.57,1.02,22.13,12.67-3.06,14.53-9.38,16.95-28.47,16.95-6.88,0-19.82,0-16.62-15.07,2.72-12.75,11.8-14.54,22.95-14.54h0ZM1395.43,716.23h45.45l18.44-86.69c10.15-47.88-8.11-53.69-54.6-53.69-32.59,0-64.04-.28-73.11,42.83h45.49c2.58-12.46,10.36-15.04,21.6-15.04,19.88,0,18.89,8.21,16.28,21.09l-4.74,21.99h-2.12c-1.7-15.87-21.56-15.64-34.47-15.64-32.79,0-52.43,10.32-59.5,43.67-7.5,35.37,9.34,43.06,41.06,43.06,15.88,0,37.14-3.14,44.68-22.26h1.56l-5.99,20.68h0Z"/>
          <path fill="#002f6c" d="M1506.4,716.23h-45.39l29.41-138.8h45.5l-29.53,138.8h0Z"/>
        </g>
      </svg>
      <span class="topnav-right-text">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 10V8a6 6 0 1 1 12 0v2" stroke="#5a7090" stroke-width="2" stroke-linecap="round"/><rect x="4" y="10" width="16" height="11" rx="2.5" stroke="#5a7090" stroke-width="2"/></svg>
        Built for Akamai &middot; Internal Use Only
      </span>
    </div>
  </div>
</div>

<div class="main">

<!-- ══════════════════════════════
     TAB 1 - QUERY BUILDER
══════════════════════════════ -->
<div class="panel active" id="panel-builder" style="display:block;">

  <div class="page-header">
    <div class="page-icon"><svg width="44" height="44" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#phbb)"/><defs><linearGradient id="phbb" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#00A4EB"/><stop offset="1" stop-color="#002F6C"/></linearGradient></defs><rect x="7" y="7" width="10" height="10" rx="3" fill="white" opacity="0.95"/><rect x="23" y="7" width="10" height="10" rx="5" fill="white" opacity="0.6"/><rect x="15" y="23" width="10" height="10" rx="3" fill="white" opacity="0.9"/><line x1="12" y1="17" x2="20" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/><line x1="28" y1="17" x2="20" y2="23" stroke="white" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/></svg></div>
    <div class="page-title">Boolean Builder</div>
    <div class="page-desc">Build a sourcing query once and get search strings for LinkedIn, Google X-Ray, StackOverflow and GitHub at the same time - tuned for tech, sales, veteran and campus hiring in India.</div>
  </div>

  <div class="grid-2">
    <!-- Role Config -->
    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">Role</div></div>
      <div class="section-hint">Pick a category to load ready-made role templates, then narrow by location and experience.</div>

      <label>Role Category</label>
      <select id="category" onchange="populateRoles()">
        <option value="">- Select Category -</option>
        <option value="tech">Technology</option>
        <option value="sales">Sales</option>
        <option value="veterans">🎖 Veterans (Indian Defence)</option>
        <option value="freshers">🎓 Freshers (College Hiring)</option>
        <option value="custom">⭐ My Custom Roles</option>
      </select>

      <label>Role</label>
      <select id="role"><option value="">- Select Role -</option></select>
      <div id="lgbtq-tip" style="display:none;margin-top:10px;padding:10px 14px;background:rgba(168,139,250,0.08);border:1px solid rgba(168,139,250,0.25);border-radius:8px;font-size:10.5px;color:#a78bfa;line-height:1.6;">
        🏳️‍🌈 <strong>LGBTQ+ Sourcing Note:</strong> Results depend on candidates who have self-disclosed on their profiles (ERG membership, Pride@ groups, advocacy work). The Boolean targets professional signals like <em>Pride@Company</em>, <em>Out in Tech</em>, <em>Humsafar</em>, <em>ERG Lead</em> - not identity directly. Always combine with location and mandatory keywords for tighter results.
      </div>

      <label>Location</label>
      <input id="location" placeholder="India / Bangalore / Hyderabad">

      <label>Experience Range</label>
      <div class="exp-row">
        <input id="minExp" placeholder="Minimum  e.g. 3">
        <input id="maxExp" placeholder="Maximum  e.g. 8">
      </div>
    </div>

    <!-- Talent Filters -->
    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">Talent Filters</div></div>
      <div class="section-hint">Layer in company background and education signals to sharpen who shows up in results.</div>

      <label>Company Cluster</label>
      <select id="cluster">
        <option value="">- None -</option>
        <option value="faang">FAANG</option>
        <option value="unicorn">Indian Unicorns</option>
        <option value="fintech">Fintech</option>
      </select>

      <label>Talent Cluster</label>
      <select id="talentCluster">
        <option value="">- None -</option>
        <option value="blrProduct">Bangalore Product Tech</option>
        <option value="puneProduct">Pune Product Tech</option>
        <option value="startup">Startup Growth</option>
        <option value="enterpriseTech">Enterprise Tech</option>
      </select>

      <label>Education Filter</label>
      <select id="education">
        <option value="">- None -</option>
        <option value="tier1">Tier 1 - IIT / IIM / BITS / NIT</option>
        <option value="tier2">Tier 2 - VIT / SRM / Manipal</option>
        <option value="tier3">Tier 3</option>
      </select>

      <label>Custom Companies (comma separated)</label>
      <input id="companies" placeholder="Microsoft, Amazon">

      <label>Exclude Keywords</label>
      <input id="exclude" placeholder="Intern, Contract">
    </div>
  </div>

  <!-- Mandatory Keywords card -->
  <div class="card" style="margin-bottom:16px;">
    <div class="card-head">
      <div class="card-dot" style="background:var(--warn);box-shadow:0 0 6px var(--warn);"></div>
      <div class="card-title" style="color:var(--warn);">🔒 Mandatory Keywords</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">Profile MUST contain these</span>
    </div>
    <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;">
        <label>Required Skills / Keywords</label>
        <input id="mandatory" placeholder='e.g.  Python, Cloud   or   "SRE" AND "Python" AND "Cloud"' oninput="updateMandatoryPreview()">
        <div style="font-size:10px;color:var(--muted);margin-top:-10px;margin-bottom:0;">
          Comma-separated uses the Logic Mode below &nbsp;·&nbsp; Switch to <strong style="color:var(--accent2);">Custom</strong> to write full boolean (AND/OR/parentheses)
        </div>
      </div>
      <div style="min-width:150px;">
        <label>Logic Mode</label>
        <div style="display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
          <button id="logic-or"  onclick="setLogic('OR')"  class="logic-btn active">OR</button>
          <button id="logic-and" onclick="setLogic('AND')" class="logic-btn">AND</button>
          <button id="logic-raw" onclick="setLogic('RAW')" class="logic-btn">Custom</button>
        </div>
        <div id="logic-hint" style="font-size:10px;color:var(--muted);margin-top:5px;">Any one skill is enough</div>
      </div>
    </div>
    <div id="mandatory-preview" style="margin-top:10px;font-size:11px;color:var(--accent2);font-family:var(--mono);background:var(--surface2);border:1px solid rgba(11,110,153,0.2);border-radius:7px;padding:8px 12px;display:none;"></div>
  </div>

  <!-- ── FRESHER FILTER (shown only for Freshers category) ── -->
  <div id="fresher-panel" class="card" style="display:none;margin-bottom:16px;">
    <div class="card-head">
      <div class="card-dot" style="background:var(--accent2);box-shadow:0 0 6px var(--accent2);"></div>
      <div class="card-title" style="color:var(--accent2);">🎓 Fresher Filters</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">Year · Tier · Stream · College</span>
    </div>

    <div class="grid-2" style="gap:12px;margin-bottom:14px;">
      <!-- Passout Year -->
      <div>
        <label>Passout Year</label>
        <select id="fresher-year" onchange="buildFresherQuery()">
          <option value="">- Select Year -</option>
          <option value="2027">2027</option>
          <option value="2026" selected>2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      <!-- College Tier -->
      <div>
        <label>College Tier</label>
        <select id="fresher-tier" onchange="onFresherTierChange()">
          <option value="">- Select Tier -</option>
          <option value="tier1">Tier 1 - IIT / BITS / NIT / IIIT / IISc</option>
          <option value="tier2">Tier 2 - VIT / SRM / Manipal / PES / RV</option>
          <option value="tier3">Tier 3 - State / Affiliated Universities</option>
          <option value="custom">✏️ Add College / University manually</option>
        </select>
      </div>
    </div>

    <!-- Custom College Input (shown when custom tier selected) -->
    <div id="fresher-custom-college-wrap" style="display:none;margin-bottom:14px;">
      <label>College / University Name</label>
      <input id="fresher-custom-college" type="text"
        placeholder='e.g. Manipal, VIT, Anna University, JNTU...'
        oninput="buildFresherQuery()"
      />
      <div style="font-size:10px;color:var(--muted);margin-top:-10px;">
        Type one or multiple colleges separated by commas
      </div>
    </div>

    <div class="grid-2" style="gap:12px;margin-bottom:14px;">
      <!-- Stream / Degree -->
      <div>
        <label>Stream / Degree</label>
        <select id="fresher-stream" onchange="buildFresherQuery()">
          <option value="any">Any Degree</option>
          <option value="btech_cs">B.Tech - Computer Science / IT</option>
          <option value="btech_ece">B.Tech - Electronics / ECE / EEE</option>
          <option value="btech_mech">B.Tech - Mechanical</option>
          <option value="btech_civil">B.Tech - Civil</option>
          <option value="mtech">M.Tech / ME</option>
          <option value="mba">MBA</option>
          <option value="mca">MCA / M.Sc CS</option>
          <option value="bsc">B.Sc - CS / IT / Maths</option>
        </select>
      </div>

      <!-- Location -->
      <div>
        <label>Preferred Location</label>
        <select id="fresher-location" onchange="buildFresherQuery()">
          <option value="india">Anywhere in India</option>
          <option value="bangalore">Bangalore</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi / NCR</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="pune">Pune</option>
          <option value="chennai">Chennai</option>
        </select>
      </div>
    </div>

    <!-- Live Preview -->
    <div id="fresher-preview" style="font-size:10.5px;color:var(--accent2);font-family:var(--mono);background:var(--surface2);border:1px solid rgba(11,110,153,0.2);border-radius:7px;padding:8px 12px;display:none;word-break:break-all;line-height:1.6;"></div>
  </div>

  <!-- Action Buttons -->
  <div class="btn-row">
    <button class="btn btn-primary" onclick="generate()">⚡ Generate Query</button>
    <button class="btn btn-ghost" onclick="openGoogle()" title="Google X-Ray search">🔍 Google X-Ray</button>
    <button class="btn btn-linkedin" onclick="openLinkedIn()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      LinkedIn
    </button>
    <button class="btn btn-ghost" onclick="openStackOverflow()" title="StackOverflow Jobs" style="border-color:rgba(223,171,1,0.3);color:var(--warn);">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H17.78v-2.137H6.111v2.137zm.259-4.852 11.383 2.381.45-2.077-11.382-2.382-.451 2.078zm1.359-5.056 10.57 4.93.894-1.95-10.57-4.929-.894 1.95zm2.748-4.691 8.946 7.404 1.362-1.681-8.945-7.403-1.363 1.68zm5.101-5.049-1.742 1.294 6.921 9.42 1.742-1.294-6.921-9.42z"/></svg>
      StackOverflow
    </button>
    <button class="btn btn-ghost" onclick="openGitHub()" title="GitHub search" style="border-color:rgba(217,115,13,0.3);color:var(--ai);">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
      GitHub
    </button>
    <button class="btn btn-ghost" style="border-color:rgba(217,115,13,0.3);color:var(--ai);" onclick="openModal()">＋ Add Custom Role</button>
  </div>
  <div class="status" id="builder-status"></div>

  <!-- Outputs -->
  <div class="out-wrap">
    <div class="out-head">
      <span class="out-label">⚡ Boolean Query</span>
      <button class="copy-btn" onclick="copyText('output',this)">Copy</button>
    </div>
    <textarea class="out-area" id="output" placeholder="Boolean string appears here after generating..."></textarea>
  </div>
  <div class="grid-2">
    <div class="out-wrap" style="margin-bottom:0;">
      <div class="out-head">
        <span class="out-label" style="color:var(--accent2);">🔍 Google X-Ray</span>
        <button class="copy-btn" onclick="copyText('xray',this)">Copy</button>
      </div>
      <textarea class="out-area" id="xray" placeholder="Google X-Ray string appears here..." style="min-height:70px;"></textarea>
    </div>
    <div class="out-wrap" style="margin-bottom:0;">
      <div class="out-head">
        <span class="out-label" style="color:var(--warn);">📦 StackOverflow</span>
        <button class="copy-btn" onclick="copyText('so-query',this)">Copy</button>
      </div>
      <textarea class="out-area" id="so-query" placeholder="StackOverflow X-Ray string appears here..." style="min-height:70px;"></textarea>
    </div>
  </div>
  <div class="out-wrap" style="margin-top:14px;">
    <div class="out-head">
      <span class="out-label" style="color:var(--ai);">🐙 GitHub</span>
      <button class="copy-btn" onclick="copyText('gh-query',this)">Copy</button>
    </div>
    <textarea class="out-area" id="gh-query" placeholder="GitHub search string appears here..." style="min-height:60px;"></textarea>
  </div>


</div>


<!-- ══════════════════════════════
     TAB 2 - JOB DESCRIPTION ANALYZER
══════════════════════════════ -->
<div class="panel" id="panel-jd" style="display:none;">

  <div class="page-header">
    <div class="page-icon"><svg width="44" height="44" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#phjd)"/><defs><linearGradient id="phjd" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#3ab8f5"/><stop offset="1" stop-color="#002F6C"/></linearGradient></defs><rect x="9" y="7" width="18" height="22" rx="3" fill="white" opacity="0.95"/><line x1="13" y1="13" x2="23" y2="13" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><line x1="13" y1="17" x2="23" y2="17" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><line x1="13" y1="21" x2="19" y2="21" stroke="#002F6C" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/><path d="M28 22 L29.4 26 L33 27 L29.4 28 L28 32 L26.6 28 L23 27 L26.6 26 Z" fill="white" opacity="0.95"/></svg></div>
    <div class="page-title">Job Description Analyzer</div>
    <div class="page-desc">Paste a job description and Claude turns it into a full sourcing kit - boolean strings, companies likely to have this talent, screening questions, and what to look for on a profile.</div>
    <div class="page-badge ai">✦ AI-powered</div>
  </div>

  <div class="card" style="margin-bottom:16px;">
    <div class="card-head">
      <div class="card-dot" style="background:var(--ai);box-shadow:0 0 6px var(--ai);"></div>
      <div class="card-title" style="color:var(--ai);">Job Description</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">Paste any job description · AI does the rest</span>
    </div>
    <textarea class="jd-textarea" id="jd-input"
      placeholder="Paste your Job Description here...

Example: We are looking for a Senior DevOps Engineer with 5+ years experience in Kubernetes, Terraform, AWS or GCP. The candidate should have strong scripting skills in Python or Bash, experience with CI/CD pipelines, and exposure to observability tools like Datadog or Prometheus. Prior experience in a fast-paced product startup is preferred..."></textarea>

    <div style="margin-top:12px;margin-bottom:10px;">
      <!-- API KEY FIELD - STEP 1 -->
      <div style="background:rgba(217,115,13,0.08);border:1.5px solid rgba(217,115,13,0.4);border-radius:10px;padding:14px 16px;margin-bottom:4px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:18px;">🔑</span>
          <div>
            <div style="font-size:11.5px;font-weight:700;color:var(--ai);">STEP 1 - Enter your Anthropic API Key</div>
            <div style="font-size:10px;color:var(--muted);">Get a free key at <strong style="color:var(--ai);">console.anthropic.com</strong> → API Keys → Create Key</div>
          </div>
        </div>
        <input id="api-key-input" type="password"
          placeholder="Paste your key here → sk-ant-api03-xxxxxxxxxxxx"
          style="width:100%;background:var(--surface2);border:1px solid rgba(217,115,13,0.5);border-radius:8px;color:var(--text);font-family:var(--mono);font-size:12px;padding:10px 14px;outline:none;box-sizing:border-box;"
          oninput="localStorage.setItem('tt_api_key', this.value); this.style.borderColor = this.value.startsWith('sk-ant') ? 'var(--accent)' : 'rgba(217,115,13,0.5)';"
        />
        <div style="font-size:10px;color:var(--muted);margin-top:6px;">🔒 Saved in your browser only - never shared anywhere else</div>
      </div>
      <!-- JOB DESCRIPTION FIELD - STEP 2 -->
      <div style="font-size:11px;font-weight:700;color:var(--accent);margin:14px 0 6px;">📋 STEP 2 - Paste your Job Description below</div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
      <button class="btn btn-primary" onclick="analyzeJD()">🧠 Analyze Job Description</button>
      <button class="btn btn-ghost" onclick="clearJD()">✕ Clear</button>
    </div>
    <div id="jd-error" style="display:none;margin-top:10px;font-size:11px;color:var(--danger);padding:8px 12px;background:rgba(224,62,62,0.08);border-radius:8px;border:1px solid rgba(224,62,62,0.2);"></div>
  </div>

  <!-- Results area -->
  <div id="jd-results" style="display:none;">

    <!-- Sub-tabs for results -->
    <div class="jd-tabs">
      <button class="jd-tab active" onclick="switchJdTab('boolean')">🔡 Boolean & Search Strings</button>
      <button class="jd-tab" onclick="switchJdTab('companies')">🏢 Target Companies</button>
      <button class="jd-tab" onclick="switchJdTab('interview')">❓ Interview Questions</button>
      <button class="jd-tab" onclick="switchJdTab('profile')">✅ Profile Checklist</button>
    </div>

    <!-- Boolean Strings -->
    <div id="jdtab-boolean">
      <div class="ai-result-box green" id="res-boolean-wrap">
        <div class="ai-section-title" style="color:var(--accent);">⚡ Boolean String</div>
        <div id="res-boolean" style="font-family:var(--mono);font-size:11px;color:var(--accent);line-height:1.7;word-break:break-all;"></div>
        <button class="copy-btn" style="margin-top:10px;" onclick="copyEl('res-boolean',this)">Copy</button>
      </div>
      <div class="ai-result-box blue" id="res-xray-wrap">
        <div class="ai-section-title" style="color:var(--accent2);">🔍 Google X-Ray - LinkedIn</div>
        <div id="res-xray" style="font-family:var(--mono);font-size:11px;color:var(--accent2);line-height:1.7;word-break:break-all;"></div>
        <button class="copy-btn" style="margin-top:10px;" onclick="copyEl('res-xray',this)">Copy</button>
      </div>
      <div class="grid-2">
        <div class="ai-result-box" id="res-so-wrap">
          <div class="ai-section-title" style="color:var(--warn);">📦 StackOverflow X-Ray</div>
          <div id="res-so" style="font-family:var(--mono);font-size:10.5px;color:var(--warn);line-height:1.7;word-break:break-all;"></div>
          <button class="copy-btn" style="margin-top:10px;" onclick="copyEl('res-so',this)">Copy</button>
        </div>
        <div class="ai-result-box" id="res-gh-wrap">
          <div class="ai-section-title" style="color:var(--ai);">🐙 GitHub X-Ray (via Google)</div><div style="font-size:10px;color:var(--muted);margin-bottom:8px;">Opens Google search → Chrome Extension scrapes GitHub profiles → Export to Sheets</div>
          <div id="res-gh" style="font-family:var(--mono);font-size:10.5px;color:var(--ai);line-height:1.7;word-break:break-all;"></div>
          <button class="copy-btn" style="margin-top:10px;" onclick="copyEl('res-gh',this)">Copy</button>
        </div>
      </div>
    </div>

    <!-- Target Companies -->
    <div id="jdtab-companies" style="display:none;">
      <div class="ai-result-box blue">
        <div class="ai-section-title" style="color:var(--accent2);">🏢 Companies Likely Hiring for This Role</div>
        <p style="font-size:11px;color:var(--muted);margin-bottom:14px;">Based on the skills and role in your job description - companies known to hire this profile. Click any to add to your Boolean search.</p>
        <div class="company-grid" id="res-companies"></div>
      </div>
      <div class="ai-result-box" style="border-left-color:var(--accent);">
        <div class="ai-section-title" style="color:var(--accent);">💡 X-Ray These Companies</div>
        <p style="font-size:11px;color:var(--muted);margin-bottom:12px;">Auto-generated X-Ray targeting these specific companies on LinkedIn.</p>
        <div id="res-company-xray" style="font-family:var(--mono);font-size:11px;color:var(--accent);line-height:1.7;word-break:break-all;margin-bottom:10px;"></div>
        <button class="copy-btn" onclick="copyEl('res-company-xray',this)">Copy</button>
      </div>
    </div>

    <!-- Interview Questions -->
    <div id="jdtab-interview" style="display:none;">
      <div class="ai-result-box" style="border-left-color:var(--warn);">
        <div class="ai-section-title" style="color:var(--warn);">❓ Interview Questions for Recruiter Screening</div>
        <p style="font-size:11px;color:var(--muted);margin-bottom:14px;">Based on the job description - questions to ask candidates during your initial screening call.</p>
        <div id="res-interview"></div>
      </div>
    </div>

    <!-- Profile Review Checklist -->
    <div id="jdtab-profile" style="display:none;">
      <div class="ai-result-box" style="border-left-color:var(--accent);">
        <div class="ai-section-title" style="color:var(--accent);">✅ What to Look For - Profile Review Checklist</div>
        <p style="font-size:11px;color:var(--muted);margin-bottom:14px;">Based on your job description - use this when reviewing real LinkedIn profiles from your search results.</p>
        <div id="res-profiles"></div>
      </div>
      <div class="grid-2" style="margin-top:14px;">
        <div class="ai-result-box" style="border-left-color:var(--green);margin-bottom:0;">
          <div class="ai-section-title" style="color:var(--green);">✅ Green Flags - Strong Match</div>
          <div id="res-green-flags"></div>
        </div>
        <div class="ai-result-box" style="border-left-color:var(--danger);margin-bottom:0;">
          <div class="ai-section-title" style="color:var(--danger);">⚠️ Red Flags - Review Carefully</div>
          <div id="res-red-flags"></div>
        </div>
      </div>
    </div>

  </div><!-- /jd-results -->

  <!-- Loading state -->
  <div id="jd-loading" style="display:none;">
    <div class="ai-loading">
      <div class="ai-spinner"></div>
      <span id="jd-loading-msg">Analyzing Job Description with Claude AI...</span>
    </div>
  </div>

</div><!-- /panel-jd -->

<!-- ══════════════════════════════
     TAB 3 - TALENTDATA (direct search + enrich)
     Calls same-origin /api/crustdata-search and /api/crustdata-enrich - the Vercel
     serverless functions hold CRUSTDATA_API_KEY server-side, so the browser never
     sees it and there's no CORS problem (unlike calling api.crustdata.com directly).
     [Endpoint names, env var, and the api.crustdata.com domain are the real backing
     data provider and are left as-is; only the UI-facing name is "TalentData".]
══════════════════════════════ -->
<div class="panel" id="panel-crustdata" style="display:none;">

  <div class="page-header">
    <div class="page-icon"><svg width="44" height="44" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#phtd)"/><defs><linearGradient id="phtd" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#00A4EB"/><stop offset="1" stop-color="#477c65"/></linearGradient></defs><circle cx="15" cy="14" r="5" fill="white" opacity="0.95"/><path d="M6 30c0-5 4-9 9-9s9 4 9 9" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.95"/><circle cx="28" cy="22" r="4.5" stroke="white" stroke-width="1.8" fill="none" opacity="0.7"/><line x1="31.2" y1="25.2" x2="34.5" y2="28.5" stroke="white" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/></svg></div>
    <div class="page-title">TalentData Search</div>
    <div class="page-desc">Search live candidate data directly, without leaving this workspace or opening a browser extension.</div>
    <div class="page-badge live">● Live data</div>
  </div>

  <div class="card" style="margin-bottom:16px;">
    <div class="card-head">
      <div class="card-dot" style="background:var(--accent2);box-shadow:0 0 6px var(--accent2);"></div>
      <div class="card-title" style="color:var(--accent2);">Search</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">Live employment data</span>
    </div>
    <div class="grid-2" style="gap:12px;">
      <div>
        <label>Job Title</label>
        <input id="cd-title" placeholder="e.g. SRE, Site Reliability Engineer">
      </div>
      <div>
        <label>Location <span style="color:var(--muted);text-transform:none;font-weight:400;">(optional)</span></label>
        <input id="cd-location" placeholder="e.g. Bangalore">
      </div>
    </div>
    <label>Result Limit <span style="color:var(--muted);text-transform:none;font-weight:400;">(max 100 - controls API credit spend)</span></label>
    <input id="cd-limit" type="number" min="1" max="100" value="20" style="max-width:140px;">
  </div>

  <!-- Criteria card - must haves / good to haves / companies / other notes -->
  <div class="card" style="margin-bottom:16px;">
    <div class="card-head">
      <div class="card-dot" style="background:var(--warn);box-shadow:0 0 6px var(--warn);"></div>
      <div class="card-title" style="color:var(--warn);">Refine Candidates</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">Refines the search &amp; highlights matches in results</span>
    </div>
    <div class="grid-2" style="gap:12px;">
      <div>
        <label>🔒 Must Haves <span style="color:var(--muted);text-transform:none;font-weight:400;">(comma separated)</span></label>
        <input id="cd-must" placeholder='e.g. Python, Kubernetes, AWS'>
        <div style="font-size:10px;color:var(--muted);margin-top:-10px;">Applied as a real filter - candidate must have at least one</div>
      </div>
      <div>
        <label>✨ Good to Haves <span style="color:var(--muted);text-transform:none;font-weight:400;">(comma separated)</span></label>
        <input id="cd-nice" placeholder='e.g. Terraform, Datadog, Go'>
        <div style="font-size:10px;color:var(--muted);margin-top:-10px;">Not filtered out - just highlighted on matching profiles</div>
      </div>
    </div>
    <label>🏢 Companies <span style="color:var(--muted);text-transform:none;font-weight:400;">(comma separated - current employer)</span></label>
    <input id="cd-target-companies" placeholder='e.g. Google, Flipkart, Razorpay'>
    <label>📝 Other Things That Are Important</label>
    <textarea class="form-area" id="cd-notes" placeholder="Anything else worth remembering for this search - team context, must-avoid companies, visa constraints, notice period, etc."></textarea>
    <div style="font-size:10px;color:var(--muted);margin-top:-10px;">Saved in this browser for next time · sent along on export, but your Sheet needs a "Notes" column (Apps Script v5 doesn't have one yet) for it to actually land anywhere</div>
  </div>

  <div class="btn-row">
    <button class="btn btn-primary" onclick="searchTalentData()" id="cd-search-btn">
      <span id="cd-search-text">🛰️ Search TalentData</span>
      <div class="spinner" id="cd-search-spinner"></div>
    </button>
    <button class="btn btn-danger" onclick="clearTalentDataResults()">🗑 Clear</button>
  </div>
  <div class="status" id="cd-search-status" style="margin-bottom:16px;"></div>

  <div class="card" style="margin-bottom:16px;">
    <div class="card-head">
      <div class="card-dot"></div>
      <div class="card-title">Candidates</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);" id="cd-count">0 candidates</span>
    </div>
    <div id="cd-results">
      <div style="text-align:center;padding:24px 0;color:var(--muted);font-size:12px;">Search above to see candidates here.</div>
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <div class="card-dot" style="background:var(--warn);box-shadow:0 0 6px var(--warn);"></div>
      <div class="card-title" style="color:var(--warn);">Send to Google Sheet</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">Same Apps Script webhook as the extension</span>
    </div>
    <div class="section-hint">Export everything currently in Candidates to a tab in your tracking sheet, tagged with a role and experience range.</div>
    <label>Google Sheet Apps Script URL</label>
    <div style="display:flex;gap:8px;margin-bottom:14px;">
      <input id="cd-webhook" placeholder="Paste Apps Script Web App URL..." style="margin-bottom:0;">
      <button class="btn btn-ghost btn-sm" onclick="saveTalentDataWebhook()" style="white-space:nowrap;">Save</button>
    </div>
    <div class="exp-row" style="margin-bottom:6px;">
      <div>
        <label>Role tag</label>
        <input id="cd-role" placeholder="e.g. SRE">
      </div>
      <div>
        <label>Experience range</label>
        <input id="cd-exp" placeholder="e.g. 3-8 years">
      </div>
    </div>
    <button class="btn btn-primary" onclick="exportTalentDataToSheet()" id="cd-export-btn" disabled style="width:100%;justify-content:center;margin-top:8px;">
      <span id="cd-export-text">📊 Export All to Google Sheet</span>
      <div class="spinner" id="cd-export-spinner"></div>
    </button>
    <div class="status" id="cd-export-status"></div>
  </div>

</div><!-- /panel-crustdata -->

<div class="panel" id="panel-github" style="display:none;">

  <div class="page-header">
    <div class="page-icon"><svg width="44" height="44" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#phgh)"/><defs><linearGradient id="phgh" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#30363d"/><stop offset="1" stop-color="#111827"/></linearGradient></defs><g transform="translate(8,8) scale(1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="white" opacity="0.9"/></g></svg></div>
    <div class="page-title">GitHub Search</div>
    <div class="page-desc">Find engineers directly on GitHub by language, location and activity - sorted by followers, with bio, company and public email when available.</div>
    <div class="page-badge live">● Live data</div>
  </div>

  <div class="card" style="margin-bottom:16px;">
    <div class="card-head">
      <div class="card-dot" style="background:var(--accent2);box-shadow:0 0 6px var(--accent2);"></div>
      <div class="card-title" style="color:var(--accent2);">Search</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">GitHub Users API · sorted by followers</span>
    </div>
    <div class="grid-2" style="gap:12px;">
      <div>
        <label>Keywords <span style="color:var(--muted);text-transform:none;font-weight:400;">(boolean - matches name &amp; bio)</span></label>
        <input id="gh-keywords" placeholder='e.g. (SRE OR "site reliability") AND python NOT recruiter'>
        <div style="font-size:10px;color:var(--muted);margin-top:-10px;line-height:1.5;">
          Supports <b>AND</b> · <b>OR</b> · <b>NOT</b> · <b>( )</b> · <b>"exact phrases"</b>. A space means AND, a comma means OR, and <b>-word</b> is short for NOT.
        </div>
      </div>
      <div>
        <label>Languages <span style="color:var(--muted);text-transform:none;font-weight:400;">(comma separated - must have all · programming languages only, put tools like AWS in Keywords)</span></label>
        <input id="gh-language" placeholder="e.g. Go, Python">
      </div>
    </div>
    <div class="grid-2" style="gap:12px;">
      <div>
        <label>Location <span style="color:var(--muted);text-transform:none;font-weight:400;">(optional)</span></label>
        <input id="gh-location" placeholder="e.g. Bangalore">
      </div>
      <div>
        <label>Result Limit <span style="color:var(--muted);text-transform:none;font-weight:400;">(max 30 per search)</span></label>
        <input id="gh-limit" type="number" min="1" max="30" value="20" style="max-width:140px;">
      </div>
    </div>
    <div class="grid-2" style="gap:12px;">
      <div>
        <label>Minimum Followers <span style="color:var(--muted);text-transform:none;font-weight:400;">(optional - signal of visibility)</span></label>
        <input id="gh-min-followers" type="number" min="0" placeholder="e.g. 50">
      </div>
      <div>
        <label>Minimum Public Repos <span style="color:var(--muted);text-transform:none;font-weight:400;">(optional - signal of activity)</span></label>
        <input id="gh-min-repos" type="number" min="0" placeholder="e.g. 10">
      </div>
    </div>
  </div>

  <div class="btn-row">
    <button class="btn btn-primary" onclick="searchGitHub()" id="gh-search-btn">
      <span id="gh-search-text">🐙 Search GitHub</span>
      <div class="spinner" id="gh-search-spinner"></div>
    </button>
    <button class="btn btn-danger" onclick="clearGitHubResults()">🗑 Clear</button>
  </div>
  <div class="status" id="gh-search-status" style="margin-bottom:16px;"></div>

  <div class="card">
    <div class="card-head">
      <div class="card-dot"></div>
      <div class="card-title">Candidates</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);" id="gh-count">0 candidates</span>
    </div>
    <div id="gh-results">
      <div style="text-align:center;padding:24px 0;color:var(--muted);font-size:12px;">Search above to see candidates here.</div>
    </div>
    <div id="gh-more-wrap" style="display:none;justify-content:center;margin-top:14px;">
      <button class="btn btn-ghost" id="gh-more-btn" onclick="loadMoreGitHub()">⬇ Load More</button>
    </div>
  </div>

  <div class="card" style="margin-top:16px;">
    <div class="card-head">
      <div class="card-dot" style="background:var(--warn);box-shadow:0 0 6px var(--warn);"></div>
      <div class="card-title" style="color:var(--warn);">Send to Google Sheet</div>
      <span style="margin-left:auto;font-size:10px;color:var(--muted);">Same Apps Script webhook as the extension</span>
    </div>
    <div class="section-hint">Export everything currently in Candidates to a tab in your tracking sheet, tagged with a role and experience range.</div>
    <label>Google Sheet Apps Script URL</label>
    <div style="display:flex;gap:8px;margin-bottom:14px;">
      <input id="gh-webhook" placeholder="Paste Apps Script Web App URL..." style="margin-bottom:0;">
      <button class="btn btn-ghost btn-sm" onclick="saveGitHubWebhook()" style="white-space:nowrap;">Save</button>
    </div>
    <div class="exp-row" style="margin-bottom:6px;">
      <div>
        <label>Role tag</label>
        <input id="gh-role" placeholder="e.g. SRE">
      </div>
      <div>
        <label>Experience range</label>
        <input id="gh-exp" placeholder="e.g. 3-8 years">
      </div>
    </div>
    <button class="btn btn-primary" onclick="exportGitHubToSheet()" id="gh-export-btn" disabled style="width:100%;justify-content:center;margin-top:8px;">
      <span id="gh-export-text">📊 Export All to Google Sheet</span>
      <div class="spinner" id="gh-export-spinner"></div>
    </button>
    <div class="status" id="gh-export-status"></div>
  </div>

</div><!-- /panel-github -->

<!-- ══════════════════════════════
     TAB 5 - DIVERSITY SOURCING RESOURCES
══════════════════════════════ -->
<div class="panel" id="panel-diversity" style="display:none;">

  <div class="page-header">
    <div class="page-icon"><svg width="44" height="44" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="url(#phdv)"/><defs><linearGradient id="phdv" x1="0" y1="0" x2="40" y2="40"><stop stop-color="#ff8b3d"/><stop offset="1" stop-color="#ff5da2"/></linearGradient></defs><rect x="7" y="7" width="14" height="14" rx="3" fill="white" opacity="0.95"/><rect x="19" y="19" width="14" height="14" rx="3" fill="white" opacity="0.6"/><rect x="17" y="17" width="6" height="6" rx="1.3" fill="white" opacity="0.95" transform="rotate(45 20 20)"/></svg></div>
    <div class="page-title">Diversity Sourcing Resources</div>
    <div class="page-desc">Ready-to-copy boolean strings for diversity sourcing - first-name lists for India and the US, pronoun signals, women-in-tech communities, women's colleges and sororities, and HBCU / Native American college lists for racial and ethnic diversity. The US name list, colleges, sororities, HBCUs, and tribal colleges are adapted from Glen Cathey's "Diversity Sourcing: Boolean Search Strings for LinkedIn" (booleanblackbelt.com). Drop any of these into the Boolean Query, Google X-Ray, or GitHub search boxes on the other tabs.</div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">India - Female First Names (300+)</div></div>
      <div class="section-hint">Curated Indian female first names, grouped alphabetically. More reliable than "She/Her" alone for India sourcing.</div>
      <div class="out-wrap">
        <div class="out-head">
          <span class="out-label">🇮🇳 Names Boolean</span>
          <button class="copy-btn" onclick="copyText('div-india-names',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-india-names" style="min-height:120px;"></textarea>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">United States - Female First Names (400+)</div></div>
      <div class="section-hint">Common US female first names spanning classic-to-modern generations, grouped alphabetically.</div>
      <div class="out-wrap">
        <div class="out-head">
          <span class="out-label">🇺🇸 Names Boolean</span>
          <button class="copy-btn" onclick="copyText('div-us-names',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-us-names" style="min-height:120px;"></textarea>
      </div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">Pronoun Signals</div></div>
      <div class="section-hint">Bios that self-identify with she/her pronoun tags - a direct, low-noise signal wherever it appears.</div>
      <div class="out-wrap">
        <div class="out-head">
          <span class="out-label">💬 Pronoun Boolean</span>
          <button class="copy-btn" onclick="copyText('div-pronoun',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-pronoun" style="min-height:60px;"></textarea>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">Classic "(her OR she)" Search</div></div>
      <div class="section-hint">Glen Cathey's original technique - run as a plain keyword search (not a name field). "Her"/"she" turn up disproportionately in the summary and recommendation text on women's profiles, making this the single most inclusive gender-diversity search there is.</div>
      <div class="out-wrap" style="margin-bottom:0;">
        <div class="out-head">
          <span class="out-label">👥 Keyword Boolean</span>
          <button class="copy-btn" onclick="copyText('div-she-her',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-she-her" style="min-height:60px;"></textarea>
      </div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">Women-in-Tech Community Signals</div></div>
      <div class="section-hint">Community / program affiliations that show up in an "About" section, group membership, or resume.</div>
      <div class="out-wrap">
        <div class="out-head">
          <span class="out-label">🤝 Community Boolean</span>
          <button class="copy-btn" onclick="copyText('div-women-tech',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-women-tech" style="min-height:60px;"></textarea>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">US Women's Colleges (48)</div></div>
      <div class="section-hint">Same idea as the Boolean Builder's Education Filter, but for diversity sourcing - a women's-college alma mater is a strong signal.</div>
      <div class="out-wrap" style="margin-bottom:0;">
        <div class="out-head">
          <span class="out-label">🎓 Colleges Boolean</span>
          <button class="copy-btn" onclick="copyText('div-womens-colleges',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-womens-colleges" style="min-height:80px;"></textarea>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-head"><div class="card-dot"></div><div class="card-title">US Sororities (91)</div></div>
    <div class="section-hint">Sorority names ORed together - returns almost 2x the results of searching the single word "sorority."</div>
    <div class="out-wrap" style="margin-bottom:0;">
      <div class="out-head">
        <span class="out-label">💜 Sororities Boolean</span>
        <button class="copy-btn" onclick="copyText('div-sororities',this)">Copy</button>
      </div>
      <textarea class="out-area" id="div-sororities" style="min-height:80px;"></textarea>
    </div>
  </div>

  <div class="nav-label" style="margin:20px 0 4px;padding-left:0;">Racial &amp; Ethnic Diversity</div>
  <div class="section-hint" style="margin-bottom:14px;">The same first-name / affiliation logic works for racial and ethnic diversity sourcing - a few starter lists below.</div>

  <div class="card">
    <div class="card-head"><div class="card-dot"></div><div class="card-title">Historically Black Colleges &amp; Universities (105)</div></div>
    <div class="section-hint">All current HBCUs, ORed together - LinkedIn is one of the few places that can handle a Boolean string this long in one search.</div>
    <div class="out-wrap" style="margin-bottom:0;">
      <div class="out-head">
        <span class="out-label">🎓 HBCU Boolean</span>
        <button class="copy-btn" onclick="copyText('div-hbcu',this)">Copy</button>
      </div>
      <textarea class="out-area" id="div-hbcu" style="min-height:100px;"></textarea>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">African American Fraternities &amp; Sororities (23)</div></div>
      <div class="section-hint">The historically Black Greek-letter organizations ("Divine Nine" and related).</div>
      <div class="out-wrap" style="margin-bottom:0;">
        <div class="out-head">
          <span class="out-label">✊🏾 Greek Life Boolean</span>
          <button class="copy-btn" onclick="copyText('div-aa-greek',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-aa-greek" style="min-height:70px;"></textarea>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-dot"></div><div class="card-title">Native American / Tribal Colleges (36)</div></div>
      <div class="section-hint">Tribal Colleges and Universities across the US - a strong signal for Native American diversity sourcing.</div>
      <div class="out-wrap" style="margin-bottom:0;">
        <div class="out-head">
          <span class="out-label">🪶 Tribal Colleges Boolean</span>
          <button class="copy-btn" onclick="copyText('div-native-colleges',this)">Copy</button>
        </div>
        <textarea class="out-area" id="div-native-colleges" style="min-height:70px;"></textarea>
      </div>
    </div>
  </div>

</div><!-- /panel-diversity -->

</div><!-- /main -->

<!-- ══════════════════════════════
     CUSTOM ROLE MODAL
══════════════════════════════ -->
<div class="modal-overlay" id="modal-overlay" onclick="closeModalOutside(event)">
  <div class="modal">
    <div class="modal-head">
      <div class="modal-title">⭐ Manage Custom Roles</div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>

    <!-- Saved roles -->
    <div style="font-family:var(--font);font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;">Saved Roles</div>
    <div class="saved-roles-list" id="saved-roles-list">
      <div class="no-saved">No custom roles yet - add one below.</div>
    </div>

    <div class="divider"></div>

    <!-- Add new role form -->
    <div style="font-family:var(--font);font-size:10px;font-weight:700;color:var(--accent2);text-transform:uppercase;letter-spacing:2px;margin-bottom:14px;">Add New Role</div>

    <label>Category</label>
    <select id="new-role-cat">
      <option value="tech">Technology</option>
      <option value="sales">Sales</option>
      <option value="custom">Other</option>
    </select>

    <label>Role Name (display label)</label>
    <input type="text" id="new-role-label" placeholder="e.g. Data Engineer">

    <label>Job Titles (for Boolean - use quotes & OR)</label>
    <textarea class="form-area" id="new-role-titles" placeholder='"Data Engineer" OR "Big Data Engineer" OR "ETL Developer"'></textarea>

    <label>Key Skills (for Boolean - use quotes & OR)</label>
    <textarea class="form-area" id="new-role-skills" placeholder='"Spark" OR "Kafka" OR "Airflow" OR "dbt" OR "Snowflake"'></textarea>

    <div class="status" id="modal-status"></div>

    <div style="display:flex;gap:10px;margin-top:4px;">
      <button class="btn btn-primary" style="flex:1;" onclick="saveCustomRole()">Save Role</button>
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════
     CANDIDATE DETAIL MODAL - opens on candidate-card click, holds the per-
     candidate "reveal contact info" enrich action (was the bulk "Enrich
     LinkedIn results" button, now scoped to one candidate at a time)
══════════════════════════════ -->
<div class="modal-overlay" id="candidate-modal-overlay" onclick="closeCandidateModalOutside(event)">
  <div class="modal" id="candidate-modal" style="max-width:560px;"></div>
</div>

<script>

function enterWorkspace() {
  document.getElementById('landing-page').classList.add('hidden');
}

function showLanding() {
  document.getElementById('landing-page').classList.remove('hidden');
  if (window.__startLandingFx) window.__startLandingFx();
}

// ── SIDEBAR COLLAPSE ──
function toggleNavCollapse() {
  var collapsed = document.body.classList.toggle('nav-collapsed');
  document.documentElement.style.setProperty('--nav-w', collapsed ? '76px' : '270px');
  localStorage.setItem('tt_nav_collapsed', collapsed ? '1' : '0');
  var btn = document.getElementById('nav-toggle-btn');
  if (btn) btn.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
}
(function () {
  if (localStorage.getItem('tt_nav_collapsed') === '1') {
    document.body.classList.add('nav-collapsed');
    document.documentElement.style.setProperty('--nav-w', '76px');
  }
})();

// ══════════════════════════════════════════════
// LANDING BACKGROUND FX - grid + traveling light traces
// (grid lines, softly-lit cells, and short lines that grow across the
// grid with a glowing dot at the head, then fade - the movement lives
// in the background layer, nothing floats on top of it)
// ══════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('landing-fx');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const landingPage = document.getElementById('landing-page');

  const CELL = 48, FPS = 30, DENSITY = 0.10, MAX_ALPHA = 0.18;
  const MAX_TRACES = 10, TRACE_SPAWN = 0.045;
  const GRID_COLOR = 'rgba(0,47,108,0.07)';
  const SHIMMER_COLOR = '0,164,235';
  const TRACE_COLOR = '0,164,235';

  let shimmerCells = [], traces = [], lastTs = 0, animId = null;
  let dpr = 1, cssW = 0, cssH = 0, cols = 0, rows = 0, resizeTimer = null;

  const rand = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b));

  function buildCells() {
    shimmerCells = [];
    const count = Math.floor(cols * rows * DENSITY);
    for (let i = 0; i < count; i++) {
      shimmerCells.push({
        col: randInt(0, cols), row: randInt(0, rows),
        alpha: 0, targetAlpha: rand(MAX_ALPHA * 0.4, MAX_ALPHA),
        speed: rand(0.004, 0.014),
        phase: Math.random() < 0.5 ? 'in' : 'idle',
        holdFrames: randInt(20, 90), holdCounter: 0
      });
    }
  }

  function spawnTrace() {
    if (traces.length >= MAX_TRACES) return;
    const isH = Math.random() < 0.55;
    const cells = randInt(4, 12);
    const maxC = isH ? cols - cells : cols;
    const maxR = isH ? rows : rows - cells;
    if (maxC <= 0 || maxR <= 0) return;
    traces.push({
      x: randInt(0, maxC) * CELL, y: randInt(0, maxR) * CELL,
      isH, cells, progress: 0,
      speed: rand(0.010, 0.022),
      alpha: rand(0.55, 1.0),
      fadeAlpha: 1, fadeSpeed: rand(0.018, 0.040)
    });
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    cssW = canvas.offsetWidth; cssH = canvas.offsetHeight;
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(cssW / CELL) + 1; rows = Math.ceil(cssH / CELL) + 1;
    buildCells();
  }

  function frame() {
    const W = cssW, H = cssH;
    ctx.clearRect(0, 0, W, H);

    for (const c of shimmerCells) {
      switch (c.phase) {
        case 'idle':
          if (Math.random() < 0.004) { c.phase = 'in'; c.targetAlpha = rand(MAX_ALPHA * 0.4, MAX_ALPHA); c.holdCounter = 0; }
          break;
        case 'in':
          c.alpha += (c.targetAlpha - c.alpha) * (c.speed * 1.8);
          if (c.alpha >= c.targetAlpha * 0.92) { c.phase = 'hold'; c.holdCounter = 0; c.holdFrames = randInt(15, 60); }
          break;
        case 'hold':
          if (++c.holdCounter >= c.holdFrames) c.phase = 'out';
          break;
        case 'out':
          c.alpha += (0 - c.alpha) * (c.speed * 1.4);
          if (c.alpha < 0.004) { c.alpha = 0; c.phase = 'idle'; c.col = randInt(0, cols); c.row = randInt(0, rows); }
          break;
      }
      if (c.alpha < 0.004) continue;
      ctx.fillStyle = `rgba(${SHIMMER_COLOR},${c.alpha})`;
      ctx.fillRect(c.col * CELL + 1, c.row * CELL + 1, CELL - 2, CELL - 2);
    }

    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) { const x = c * CELL + 0.5; ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let r = 0; r <= rows; r++) { const y = r * CELL + 0.5; ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();

    if (Math.random() < TRACE_SPAWN) spawnTrace();

    for (let i = traces.length - 1; i >= 0; i--) {
      const t = traces[i];
      const totalLen = t.cells * CELL;
      if (t.progress < 1) {
        t.progress = Math.min(1, t.progress + t.speed);
      } else {
        t.fadeAlpha = Math.max(0, t.fadeAlpha - t.fadeSpeed);
        if (t.fadeAlpha <= 0) { traces.splice(i, 1); continue; }
      }
      const drawnLen = t.progress * totalLen;
      const x2 = t.isH ? t.x + drawnLen : t.x;
      const y2 = t.isH ? t.y : t.y + drawnLen;
      const opacity = t.alpha * t.fadeAlpha;
      const g = t.isH
        ? ctx.createLinearGradient(t.x, t.y, t.x + totalLen, t.y)
        : ctx.createLinearGradient(t.x, t.y, t.x, t.y + totalLen);
      g.addColorStop(0, `rgba(${TRACE_COLOR},0)`);
      g.addColorStop(0.12, `rgba(${TRACE_COLOR},${opacity * 0.55})`);
      g.addColorStop(0.88, `rgba(${TRACE_COLOR},${opacity})`);
      g.addColorStop(1, `rgba(${TRACE_COLOR},0)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      if (t.progress < 1) {
        const headA = opacity * (0.7 + t.progress * 0.3);
        const glow = ctx.createRadialGradient(x2, y2, 0, x2, y2, 8);
        glow.addColorStop(0, `rgba(${TRACE_COLOR},${headA * 0.7})`);
        glow.addColorStop(1, `rgba(${TRACE_COLOR},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x2, y2, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${TRACE_COLOR},${headA})`;
        ctx.beginPath(); ctx.arc(x2, y2, 2, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  function draw(ts) {
    animId = requestAnimationFrame(draw);
    if (ts - lastTs < 1000 / FPS) return;
    lastTs = ts;
    if (landingPage.classList.contains('hidden')) return;
    frame();
  }

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  window.__startLandingFx = function () {
    if (animId) return;
    resize();
    animId = requestAnimationFrame(draw);
  };

  window.__startLandingFx();
})();
// ══════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════
const techRoles = {
  sre:     { label:"SRE",                   titles:'"SRE" OR "Site Reliability Engineer"',                           skills:'"Kubernetes" OR "AWS" OR "Terraform" OR "Docker"' },
  devops:  { label:"DevOps",                titles:'"DevOps Engineer" OR "Platform Engineer"',                       skills:'"CI/CD" OR "AWS" OR "Azure" OR "Terraform"' },
  se:      { label:"Software Engineer",     titles:'"Software Engineer" OR "SWE"',                                   skills:'"Java" OR "Python" OR "Go" OR "Microservices"' },
  sdet:    { label:"SDET",                  titles:'"SDET" OR "Automation Engineer"',                                skills:'"Selenium" OR "Cypress" OR "API Testing"' }
};
const salesRoles = {
  enterprise:{ label:"Enterprise AE",       titles:'"Enterprise Account Executive" OR "Major Account Manager"',      skills:'"Enterprise Sales" OR "SaaS" OR "ARR" OR "Quota"' },
  security:  { label:"Cloud/Security Sales",titles:'"Cloud Sales" OR "Cyber Security Sales"',                        skills:'"Cyber Security" OR "Cloud" OR "SaaS"' },
  channel:   { label:"Channel Sales",       titles:'"Channel Sales Manager" OR "Partner Account Manager"',           skills:'"Channel Sales" OR "Partner Management"' },
  presales:  { label:"Pre-Sales / Solutions",titles:'"Solutions Engineer" OR "Pre Sales Consultant"',               skills:'"Technical Pre Sales" OR "Solution Architect" OR "Demo"' }
};
// ── VETERANS (India - Army, Navy, Air Force, Coast Guard) ──────────
const veteranRoles = {
  vet_any: {
    label: "Veterans - Any Role",
    titles: '"Ex-Indian Army" OR "Ex-Army" OR "Indian Army" OR "Ex-Navy" OR "Indian Navy" OR "Ex-Air Force" OR "Indian Air Force" OR "Ex-IAF" OR "Ex-Coast Guard" OR "Indian Coast Guard" OR "Ex-NDA" OR "Ex-Defence" OR "Retired Army" OR "Retired Navy" OR "Retired Air Force" OR "Fauji" OR "Armed Forces Veteran"',
    skills: '"Leadership" OR "Operations" OR "Strategy" OR "Project Management" OR "Logistics" OR "Supply Chain" OR "Security" OR "Crisis Management" OR "Team Management" OR "Discipline"'
  },
  vet_tech: {
    label: "Veterans - Tech / IT",
    titles: '"Ex-Indian Army" OR "Ex-Navy" OR "Ex-Air Force" OR "Ex-IAF" OR "Ex-Defence" OR "Retired Army" OR "Retired Air Force" OR "Armed Forces Veteran"',
    skills: '"IT" OR "Cybersecurity" OR "Network" OR "Systems" OR "Technology" OR "Software" OR "Cloud" OR "Infrastructure" OR "Signals" OR "EME" OR "AFNET"'
  },
  vet_ops: {
    label: "Veterans - Operations / Logistics",
    titles: '"Ex-Indian Army" OR "Ex-Navy" OR "Ex-Air Force" OR "Ex-Coast Guard" OR "Ex-Defence" OR "Retired Army" OR "Retired Navy" OR "Fauji"',
    skills: '"Operations" OR "Logistics" OR "Supply Chain" OR "Fleet Management" OR "Procurement" OR "Administration" OR "Facility Management" OR "Security Management"'
  },
  vet_sales: {
    label: "Veterans - Sales / BD",
    titles: '"Ex-Indian Army" OR "Ex-Navy" OR "Ex-Air Force" OR "Ex-Defence" OR "Retired Army" OR "Armed Forces Veteran"',
    skills: '"Sales" OR "Business Development" OR "Account Management" OR "Client Relations" OR "Territory Management" OR "Channel Sales"'
  },
  vet_leadership: {
    label: "Veterans - Leadership / Consulting",
    titles: '"Ex-Indian Army" OR "Ex-Navy" OR "Ex-Air Force" OR "Ex-IAF" OR "Ex-Defence" OR "Retired Colonel" OR "Retired Brigadier" OR "Retired Major General" OR "Retired Vice Admiral" OR "Retired Air Marshal" OR "Ex-NDA"',
    skills: '"Leadership" OR "Strategy" OR "Consulting" OR "General Management" OR "P&L" OR "Business Transformation" OR "Change Management" OR "Corporate Training"'
  }
};

// ── LGBTQ+ TALENT ──────────────────────────────────────────────
// Strategy: target ERG membership signals, LGBTQ+ orgs, and Pride@ patterns
// These are specific enough to cut noise vs generic "Diversity/Inclusion" terms
const lgbtqRoles = {
  lgbtq_any: {
    label: "LGBTQ+ - Any Role",
    titles: '"DEI" OR "Diversity and Inclusion" OR "Pride Network" OR "LGBTQ" OR "ERG Lead" OR "Inclusion Lead" OR "Queer Affinity"',
    skills: '"Pride@" OR "LGBTQ ERG" OR "Queer" OR "Trans Inclusion" OR "Humsafar" OR "Umang" OR "Out in Tech" OR "Gender Identity"'
  },
  lgbtq_dei: {
    label: "LGBTQ+ - DEI / HR",
    titles: '"Diversity" OR "Inclusion" OR "DEI" OR "DEIB" OR "Belonging" OR "Equity" OR "People and Culture" OR "Culture and Belonging"',
    skills: '"LGBTQ+" OR "Queer Inclusion" OR "Trans Inclusion" OR "Pride Network" OR "ERG" OR "Gender Identity" OR "Humsafar" OR "Umang"'
  },
  lgbtq_tech: {
    label: "LGBTQ+ - Technology",
    titles: '"Software Engineer" OR "Product Manager" OR "Data Scientist" OR "Designer" OR "Engineering Manager" OR "Developer"',
    skills: '"Pride@" OR "LGBTQ ERG" OR "Out in Tech" OR "Lesbians Who Tech" OR "Trans*H4CK" OR "Queer" OR "LGBTQ inclusion"'
  },
  lgbtq_community: {
    label: "LGBTQ+ - Community / Advocacy",
    titles: '"Community Manager" OR "Program Manager" OR "Policy" OR "Advocacy" OR "NGO" OR "Social Impact" OR "Outreach"',
    skills: '"LGBTQ" OR "Queer" OR "Trans" OR "Humsafar Trust" OR "Umang" OR "Yaariyan" OR "Pride India" OR "The Queer Muslim Project"'
  },
  lgbtq_marketing: {
    label: "LGBTQ+ - Marketing / Comms",
    titles: '"Marketing" OR "Brand Manager" OR "Communications" OR "PR" OR "Content Creator" OR "Social Media Manager"',
    skills: '"Inclusive Marketing" OR "Pride Campaign" OR "LGBTQ Marketing" OR "Queer Representation" OR "Diversity Marketing" OR "Allyship"'
  }
};


// ── FRESHERS - Dynamic (Year + Tier + Stream + Custom College) ──
// Single placeholder role - actual query built dynamically by buildFresherQuery()
const fresherRoles = {
  fresher: {
    label: "🎓 Configure below ↓",
    titles: '',
    skills: ''
  }
};

// College tier definitions
const collegeTiers = {
  tier1: { label: 'Tier 1 - IIT / BITS / NIT / IIIT / IISc', colleges: '"IIT" OR "IIT Bombay" OR "IIT Delhi" OR "IIT Madras" OR "IIT Kharagpur" OR "IIT Hyderabad" OR "IIT Kanpur" OR "IIT Roorkee" OR "IIT Guwahati" OR "BITS Pilani" OR "BITS Goa" OR "BITS Hyderabad" OR "NIT Trichy" OR "NIT Surathkal" OR "NIT Warangal" OR "NIT Calicut" OR "IIIT Hyderabad" OR "IIIT Bangalore" OR "IISc"' },
  tier2: { label: 'Tier 2 - VIT / SRM / Manipal / PES / RV', colleges: '"VIT" OR "SRM" OR "Manipal" OR "PES University" OR "RV College" OR "BMS College" OR "PESIT" OR "Dayananda Sagar" OR "MS Ramaiah" OR "NMIMS" OR "Christ University" OR "Amrita" OR "Thapar" OR "SASTRA" OR "Symbiosis" OR "Sathyabama"' },
  tier3: { label: 'Tier 3 - State / Affiliated Universities', colleges: '"Anna University" OR "JNTU" OR "Mumbai University" OR "Pune University" OR "VTU" OR "RTU" OR "GTU" OR "MDU" OR "AKTU" OR "RGPV" OR "GGSIPU" OR "Osmania University" OR "Bangalore University" OR "Andhra University"' },
  custom: { label: '✏️ Add College / University manually', colleges: '' }
};

// Stream/Degree definitions
const fresherStreams = {
  btech_cs:  '"B.Tech" AND ("Computer Science" OR "CSE" OR "IT" OR "Information Technology")',
  btech_ece: '"B.Tech" AND ("Electronics" OR "ECE" OR "EEE" OR "Electrical")',
  btech_mech:'"B.Tech" AND ("Mechanical" OR "Mechatronics" OR "Production")',
  btech_civil:'"B.Tech" AND ("Civil" OR "Structural" OR "Construction")',
  mtech:     '"M.Tech" OR "ME" AND ("Computer Science" OR "ECE" OR "VLSI" OR "Embedded")',
  mba:       '"MBA" AND ("Marketing" OR "Finance" OR "HR" OR "Operations" OR "Strategy")',
  mca:       '"MCA" OR "M.Sc Computer Science" OR "M.Sc IT"',
  bsc:       '"B.Sc" AND ("Computer Science" OR "IT" OR "Mathematics" OR "Statistics")',
  any:       '"B.Tech" OR "B.E" OR "M.Tech" OR "MCA" OR "MBA" OR "B.Sc"'
};

const clusters = {
  faang:       '"Google" OR "Meta" OR "Amazon" OR "Apple" OR "Microsoft" OR "Netflix" OR "Adobe" OR "Salesforce" OR "Oracle" OR "IBM"',
  unicorns:    '"Flipkart" OR "Swiggy" OR "Zomato" OR "CRED" OR "Razorpay" OR "PhonePe" OR "Meesho" OR "Groww" OR "Zepto" OR "Dream11" OR "OLA" OR "Nykaa" OR "ShareChat" OR "Byju" OR "Unacademy" OR "Paytm" OR "PolicyBazaar" OR "Delhivery" OR "Ola Electric" OR "Slice"',
  bangalore:   '"Infosys" OR "Wipro" OR "TCS" OR "HCL" OR "Cognizant" OR "Mindtree" OR "Mphasis" OR "LTIMindtree" OR "Hexaware" OR "Zensar" OR "Coforge" OR "Nagarro" OR "Thoughtworks" OR "Publicis Sapient"',
  mnc_tech:    '"Qualcomm" OR "Nvidia" OR "Intel" OR "Cisco" OR "Juniper" OR "VMware" OR "Symantec" OR "Veritas" OR "NetApp" OR "EMC" OR "Dell" OR "HP" OR "Siemens" OR "Bosch" OR "SAP Labs" OR "Amadeus" OR "Synopsys" OR "Mentor Graphics"',
  fintech:     '"Razorpay" OR "PhonePe" OR "Paytm" OR "CRED" OR "Groww" OR "Zerodha" OR "Slice" OR "Jupiter" OR "Fi Money" OR "Juspay" OR "BankBazaar" OR "Freecharge" OR "Mobikwik" OR "Lendingkart" OR "Capital Float"',
  startups:    '"Practo" OR "MoEngage" OR "Druva" OR "Freshworks" OR "Zoho" OR "Postman" OR "BrowserStack" OR "Chargebee" OR "Whatfix" OR "Clevertap" OR "Wingify" OR "WebEngage" OR "Sprinklr" OR "Pubmatic" OR "Akamai" OR "Netcore" OR "Exotel"',
  ecomm:       '"Flipkart" OR "Myntra" OR "Nykaa" OR "Meesho" OR "Snapdeal" OR "ShopClues" OR "Bigbasket" OR "Grofers" OR "Blinkit" OR "Zepto" OR "Urban Ladder" OR "Pepperfry" OR "Licious" OR "HealthKart" OR "Mamaearth"',
  edtech:      '"Byju" OR "Unacademy" OR "Vedantu" OR "UpGrad" OR "Simplilearn" OR "Great Learning" OR "Coursera" OR "WhiteHat Jr" OR "Toppr" OR "Doubtnut" OR "Scaler" OR "Newton School"',
};

// ── DIVERSITY SOURCING RESOURCES - name lists + signal booleans ──────
// India: 300+ curated first names (unchanged from the old in-Builder female filter).
const indiaFemaleNamesBoolean = `(Aabha OR Aadarshini OR Aaddhya OR Aadhaya OR Aadhya OR Aadya OR Aahana OR Aairah OR Aakaanksha OR Aalia OR Aanchal OR Aaniya OR Aanya OR Aaradhya OR Aarati OR Aarna OR Aarohi OR Aarti OR Aarushi OR Aasha OR Aashna OR Aashvi OR Aastha OR Aayushi OR Abha OR Abhilasha OR Aditi OR Advika OR Aesha OR Afreen OR Aisha OR Aiswarya OR Akanksha OR Akhila OR Akshara OR Alisha OR Alka OR Alpana OR Amaira OR Amaya OR Ambika OR Amisha OR Amrita OR Ananya OR Anaya OR Anchal OR Anika OR Anisha OR Anita OR Anjali OR Anjana OR Ankita OR Anshula OR Antara OR Anu OR Anupama OR Anuradha OR Anusha OR Anushka OR Anvi OR Anvitha OR Aparna OR Arpita OR Arti OR Aruna OR Arundhati OR Arushi OR Arya OR Asha OR Asmita OR Aswini OR Athira OR Avani OR Avantika OR Avni OR Ayesha OR Ayushi) OR (Babita OR Barkha OR Beena OR Bela OR Bhagyashri OR Bhairavi OR Bhanu OR Bharati OR Bharti OR Bhavana OR Bhavika OR Bhavna OR Bhoomika OR Bhumika OR Bijoya OR Bimala OR Bina OR Bindu OR Binita OR Bipasha OR Brinda) OR (Chaaya OR Chameli OR Champa OR Chanchal OR Chandani OR Chandni OR Chandralekha OR Charu OR Chetana OR Chetna OR Chhavi OR Chhaya OR Chitra) OR (Damini OR Darshita OR Deepa OR Deepali OR Deepika OR Deepti OR Devangi OR Devanshi OR Devi OR Devika OR Devyani OR Dhanvi OR Dhara OR Diksha OR Dimple OR Dipali OR Dipika OR Disha OR Divya OR Diya OR Drashti OR Drishti OR Durga) OR (Esha OR Ekta) OR (Falak OR Falguni OR Farah OR Farida OR Fatima) OR (Ganga OR Garima OR Gauri OR Gayatri OR Geet OR Geeta OR Geetanjali OR Girija) OR (Heema OR Heena OR Heer OR Hema OR Himani OR Hina) OR (Indira OR Ira OR Isha OR Ishani OR Ishika OR Ishita) OR (Jahnavi OR Janaki OR Jasmin OR Jasmine OR Jaspreet OR Jayalaxmi OR Jayanti OR Jhanvi OR Jiya OR Juhi OR Jyoti OR Jyotika) OR (Kajal OR Kalpana OR Kalyani OR Kamala OR Kamini OR Kanchan OR Kanika OR Karishma OR Karuna OR Kashish OR Kashmira OR Kavita OR Kavya OR Khushi OR Komal OR Kritika OR Kusum) OR (Lakshmi OR Lavanya OR Laxmi OR Leena OR Lily) OR (Madhuri OR Mahima OR Manisha OR Manjeet OR Manju OR Mansi OR Manya OR Maya OR Mayuri OR Meena OR Meenakshi OR Megha OR Meghana OR Mehak OR Mili OR Mira OR Mishka OR Mishti OR Mitali OR Mohini OR Mona OR Monika OR Mridula OR Muskan OR Myra) OR (Naina OR Nalini OR Namita OR Nandini OR Navya OR Neela OR Neelam OR Neha OR Nidhi OR Niharika OR Nikita OR Nirmala OR Nisha OR Nishita OR Nita OR Nitya OR Nivedita OR Noor) OR (Padma OR Pallavi OR Pari OR Parul OR Parvati OR Payal OR Pihu OR Pooja OR Poonam OR Prachi OR Pragati OR Pratibha OR Pratima OR Preeti OR Priya OR Priyanka OR Priyanshi OR Puja OR Purnima OR Purva OR Pushpa) OR (Rachana OR Radhika OR Ragini OR Rajani OR Rajni OR Rakhi OR Ramya OR Rashmi OR Raveena OR Rekha OR Renu OR Renuka OR Reshma OR Rhea OR Ria OR Richa OR Riddhi OR Ritika OR Ritu OR Riya OR Rohini OR Ruchi OR Rutuja) OR (Saanvi OR Sakshi OR Saloni OR Sameera OR Sandhya OR Sangeeta OR Sanjana OR Sanvi OR Sapna OR Sara OR Saraswati OR Sarita OR Saumya OR Savita OR Seema OR Shalini OR Shanaya OR Sharda OR Sharmila OR Sheetal OR Shefali OR Shikha OR Shilpa OR Shivangi OR Shivani OR Shreya OR Shruti OR Shweta OR Simran OR Sita OR Siya OR Smita OR Smriti OR Sneha OR Sona OR Sonali OR Sonam OR Sonia OR Suha OR Suhani OR Suhasini OR Sunaina OR Sunita OR Supriya OR Surabhi OR Swapna OR Swara OR Swati) OR (Tanishka OR Tanvi OR Tanya OR Tara OR Tejal OR Tejaswini OR Tina OR Trisha OR Tulsi) OR (Vaishnavi OR Vani OR Vanya OR Varsha OR Vijaya) OR (Zara OR Zoya)`;

// US: 400+ names - the proven SSA-decade list (top 200 female first names of the
// 1950s-90s, de-duped) from Glen Cathey's "Diversity Sourcing: Boolean Search
// Strings for LinkedIn" (booleanblackbelt.com) - field-tested to cover ~68% of
// US women on LinkedIn in a single search.
const usFemaleNamesBoolean = `(Abigail OR Adriana OR Adrienne OR Aimee OR Alejandra OR Alexa OR Alexandra OR Alexandria OR Alexis OR Alice OR Alicia OR Alisha OR Alison OR Allison OR Alyssa OR Amanda OR Amber OR Amy OR Ana OR Andrea OR Angel OR Angela OR Angelica OR Angie OR Anita OR Ann OR Anna OR Anne OR Annette OR Annie OR April OR Ariana OR Ariel OR Arlene OR Ashlee OR Ashley OR Audrey OR Autumn) OR (Bailey OR Barbara OR Becky OR Belinda OR Beth OR Bethany OR Betty OR Beverly OR Bianca OR Bonnie OR Brandi OR Brandy OR Breanna OR Brenda OR Briana OR Brianna OR Bridget OR Brittany OR Brittney OR Brooke) OR (Caitlin OR Caitlyn OR Candace OR Candice OR Carla OR Carly OR Carmen OR Carol OR Carole OR Caroline OR Carolyn OR Carrie OR Casey OR Cassandra OR Cassidy OR Cassie OR Catherine OR Cathy OR Charlene OR Charlotte OR Chelsea OR Chelsey OR Cheryl OR Cheyenne OR Chloe OR Christie OR Christina OR Christine OR Christy OR Cindy OR Claire OR Claudia OR Colleen OR Connie OR Constance OR Courtney OR Cristina OR Crystal OR Cynthia) OR (Daisy OR Dana OR Danielle OR Darlene OR Dawn OR Deanna OR Debbie OR Deborah OR Debra OR Delores OR Denise OR Desiree OR Destiny OR Diamond OR Diana OR Diane OR Dianne OR Dolores OR Dominique OR Donna OR Doreen OR Doris OR Dorothy) OR (Ebony OR Eileen OR Elaine OR Elizabeth OR Ellen OR Emily OR Emma OR Erica OR Erika OR Erin OR Eva OR Evelyn) OR (Faith OR Felicia OR Frances) OR (Gabriela OR Gabriella OR Gabrielle OR Gail OR Gayle OR Geraldine OR Gina OR Glenda OR Gloria OR Grace OR Gwendolyn) OR (Hailey OR Haley OR Hannah OR Hayley OR Heather OR Heidi OR Helen OR Holly) OR (Irene OR Isabel OR Isabella) OR (Jackie OR Jaclyn OR Jacqueline OR Jade OR Jaime OR Jamie OR Jan OR Jane OR Janet OR Janice OR Janis OR Jasmin OR Jasmine OR Jean OR Jeanette OR Jeanne OR Jenna OR Jennifer OR Jenny OR Jessica OR Jill OR Jillian OR Jo OR Joan OR Joann OR Joanna OR Joanne OR Jocelyn OR Jodi OR Jody OR Jordan OR Josephine OR Joy OR Joyce OR Juanita OR Judith OR Judy OR Julia OR Julie OR June) OR (Kaitlin OR Kaitlyn OR Kara OR Karen OR Kari OR Karina OR Karla OR Katelyn OR Katherine OR Kathleen OR Kathryn OR Kathy OR Katie OR Katrina OR Kay OR Kayla OR Kaylee OR Kelli OR Kellie OR Kelly OR Kelsey OR Kendra OR Kerri OR Kerry OR Kiara OR Kim OR Kimberly OR Kirsten OR Krista OR Kristen OR Kristi OR Kristie OR Kristin OR Kristina OR Kristine OR Kristy OR Krystal OR Kylie) OR (Lacey OR Latasha OR Latoya OR Laura OR Lauren OR Laurie OR Leah OR Leslie OR Lillian OR Linda OR Lindsay OR Lindsey OR Lisa OR Lois OR Loretta OR Lori OR Lorraine OR Louise OR Lydia OR Lynda OR Lynn OR Lynne) OR (Mackenzie OR Madeline OR Madison OR Makayla OR Mallory OR Mandy OR Marcia OR Margaret OR Maria OR Mariah OR Marianne OR Marie OR Marilyn OR Marisa OR Marissa OR Marjorie OR Marlene OR Marsha OR Martha OR Mary OR Maureen OR Mckenzie OR Meagan OR Megan OR Meghan OR Melanie OR Melinda OR Melissa OR Melody OR Mercedes OR Meredith OR Mia OR Michaela OR Michele OR Michelle OR Mikayla OR Mildred OR Mindy OR Miranda OR Misty OR Molly OR Monica OR Monique OR Morgan) OR (Nancy OR Natalie OR Natasha OR Nichole OR Nicole OR Nina OR Norma) OR (Olivia) OR (Paige OR Pam OR Pamela OR Patricia OR Patsy OR Patti OR Patty OR Paula OR Peggy OR Penny OR Phyllis OR Priscilla) OR (Rachael OR Rachel OR Raven OR Rebecca OR Rebekah OR Regina OR Renee OR Rhonda OR Rita OR Roberta OR Robin OR Robyn OR Rosa OR Rose OR Rosemary OR Roxanne OR Ruby OR Ruth) OR (Sabrina OR Sally OR Samantha OR Sandra OR Sandy OR Sara OR Sarah OR Savannah OR Selena OR Shannon OR Shari OR Sharon OR Shawna OR Sheena OR Sheila OR Shelby OR Shelia OR Shelley OR Shelly OR Sheri OR Sherri OR Sherry OR Sheryl OR Shirley OR Sierra OR Sonia OR Sonya OR Sophia OR Stacey OR Stacie OR Stacy OR Stefanie OR Stephanie OR Sue OR Summer OR Susan OR Suzanne OR Sydney OR Sylvia) OR (Tabitha OR Tamara OR Tami OR Tammie OR Tammy OR Tanya OR Tara OR Tasha OR Taylor OR Teresa OR Terri OR Terry OR Theresa OR Tiffany OR Tina OR Toni OR Tonya OR Tracey OR Traci OR Tracie OR Tracy OR Tricia) OR (Valerie OR Vanessa OR Veronica OR Vicki OR Vickie OR Vicky OR Victoria OR Virginia OR Vivian) OR (Wanda OR Wendy OR Whitney) OR (Yesenia OR Yolanda OR Yvette OR Yvonne) OR (Zoe)`;

// Pronoun signal (modern) - bios that self-identify with she/her pronoun tags.
const pronounSignalsBoolean = `"she/her" OR "she/hers" OR "her/hers" OR "(she/her)" OR "she - her"`;

// Classic "(her OR she)" keyword search - Glen Cathey's original technique: run this as
// a general keyword search (not a first/last-name field). It works because "her" and
// "she" turn up disproportionately in the summary/recommendation text on women's
// profiles - ~900K US LinkedIn profiles by his count, the single most inclusive
// gender-diversity search there is, precisely because it isn't tied to any name list.
const classicSheHerBoolean = `(her OR she)`;

// Women-in-tech community / program affiliations - strong diversity-sourcing signal
// when they show up in a LinkedIn "About" section, group memberships, or a resume.
const womenInTechBoolean = `"Women Who Code" OR "Girls Who Code" OR "AnitaB.org" OR "Grace Hopper Celebration" OR "Women Techmakers" OR "SheCodes" OR "Women in Engineering" OR "WomenTech Network" OR "Lean In" OR "Girls in Tech" OR "SheThePeople" OR "Women in Data Science" OR "Systers"`;

// US women's colleges (48) - source: booleanblackbelt.com. Same idea as the Boolean
// Builder's Education Filter, but for diversity sourcing: a women's-college alma
// mater is a strong, low-noise signal.
const womensCollegesUSBoolean = `("Agnes Scott College" OR "Alverno College" OR "Barnard College" OR "Bay Path College" OR "Bennett College" OR "Brenau University" OR "Brescia University College" OR "Bryn Mawr College" OR "Carlow College" OR "Cedar Crest College" OR "Chatham University" OR "College of New Rochelle, The" OR "College of Saint Benedict" OR "College of Saint Elizabeth" OR "College of Saint Mary" OR "Columbia College" OR "Converse College" OR "Cottey College" OR "Douglass Residential College of Rutgers University" OR "Hollins University" OR "Judson College" OR "Mary Baldwin College" OR "Meredith College" OR "Midway College" OR "Mills College" OR "Moore College of Art & Design" OR "Mount Holyoke College" OR "Mount Mary College" OR "Mount St. Mary's College" OR "Notre Dame of Maryland University" OR "Pine Manor College" OR "Russell Sage College" OR "St. Catherine University" OR "Saint Joseph College" OR "Saint Mary-of-the-Woods College" OR "Saint Mary's College" OR "Salem College" OR "Scripps College" OR "Simmons College" OR "Smith College" OR "Spelman College" OR "Stephens College" OR "Sweet Briar College" OR "Trinity Washington University" OR "Wellesley College" OR "Wesleyan College" OR "Wilson College" OR "Women's College")`;

// Women's sororities (91) - source: booleanblackbelt.com.
const sororitiesUSBoolean = `("Alpha Chi Omega" OR "Alpha Delta Chi" OR "Alpha Delta Pi" OR "Alpha Epsilon Omega" OR "Alpha Epsilon Phi" OR "Alpha Gamma Delta" OR "Alpha Kappa Alpha" OR "alpha Kappa Delta Phi" OR "Alpha Phi Gamma" OR "Alpha Phi" OR "Alpha Pi Omega" OR "Alpha Pi Sigma" OR "Alpha Rho Lambda" OR "Alpha Sigma Alpha" OR "Alpha Sigma Kappa" OR "Alpha Sigma Omega" OR "Alpha Sigma Rho" OR "Alpha Sigma Tau" OR "Alpha Xi Delta" OR "Ceres" OR "Chi Omega" OR "Chi Upsilon Sigma" OR "Delta Chi Lambda" OR "Delta Delta Delta" OR "Delta Gamma" OR "Delta Gamma Pi" OR "Delta Kappa Delta" OR "Delta Phi Epsilon" OR "Delta Phi Lambda" OR "Delta Phi Mu" OR "Delta Phi Omega" OR "Delta Psi Delta" OR "Delta Sigma Chi" OR "Delta Sigma Theta" OR "Delta Tau Lambda" OR "Delta Xi Nu" OR "Delta Xi Phi" OR "Delta Zeta" OR "Gamma Alpha Omega" OR "Gamma Eta" OR "Gamma Phi Beta" OR "Gamma Phi Omega" OR "Gamma Rho Lambda" OR "Gamma Sigma Sigma" OR "Kappa Alpha Theta" OR "Kappa Beta Gamma" OR "Kappa Delta Chi" OR "Kappa Delta Phi" OR "Kappa Delta" OR "Kappa Kappa Gamma" OR "Kappa Phi Gamma" OR "Kappa Phi Lambda" OR "Kappa Phi Zeta" OR "Lambda Pi Chi" OR "Lambda Pi Upsilon" OR "Lambda Psi Delta" OR "Lambda Tau Omega" OR "Lambda Theta Alpha" OR "Lambda Theta Nu" OR "Mu Sigma Upsilon" OR "Omega Phi Beta" OR "Omega Phi Chi" OR "Phi Beta Chi" OR "Phi Mu" OR "Phi Sigma Rho" OR "Phi Sigma Sigma" OR "Pi Beta Phi" OR "Pi Lambda Chi" OR "Sigma Alpha Epsilon Pi" OR "Sigma Alpha Iota" OR "Sigma Delta Tau" OR "Sigma Gamma Rho" OR "Sigma Iota Alpha" OR "Sigma Kappa" OR "Sigma Lambda Alpha" OR "Sigma Lambda Gamma" OR "Sigma Lambda Upsilon" OR "Sigma Omega Nu" OR "Sigma Omega Phi" OR "Sigma Omicron Pi" OR "Sigma Phi Kappa" OR "Sigma Phi Omega" OR "Sigma Pi Alpha" OR "Sigma Psi Zeta" OR "Sigma Sigma Rho" OR "Sigma Sigma Sigma" OR "Tau Theta Pi" OR "Theta Nu Xi" OR "Theta Phi Alpha" OR "Zeta Phi Beta" OR "Zeta Tau Alpha")`;

// Historically Black Colleges & Universities (105) - source: booleanblackbelt.com.
// Racial/ethnic diversity signal, not gender-specific.
const hbcuBoolean = `("Alabama A&M University" OR "Alabama State University" OR "Albany State University" OR "Alcorn State University" OR "Allen University" OR "University of Arkansas at Pine Bluff" OR "Arkansas Baptist College" OR "Barber-Scotia College" OR "Benedict College" OR "Bennett College" OR "Bethune-Cookman University" OR "Bishop State Community College" OR "Bluefield State College" OR "Bowie State University" OR "Central State University" OR "Cheyney University of Pennsylvania" OR "Claflin University" OR "Clark Atlanta University" OR "Clinton Junior College" OR "Coahoma Community College" OR "Concordia College, Selma" OR "Coppin State University" OR "Delaware State University" OR "Denmark Technical College" OR "Dillard University" OR "University of the District of Columbia" OR "Edward Waters College" OR "Elizabeth City State University" OR "Fayetteville State University" OR "Fisk University" OR "Florida A&M University" OR "Florida Memorial University" OR "Fort Valley State University" OR "Gadsden State Community College" OR "Grambling State University" OR "Hampton University" OR "Harris-Stowe State University" OR "Hinds Community College at Utica" OR "Howard University" OR "Huston-Tillotson University" OR "Interdenominational Theological Center" OR "J. F. Drake State Technical College" OR "Jackson State University" OR "Jarvis Christian College" OR "Johnson C. Smith University" OR "Kentucky State University" OR "Knoxville College" OR "Lane College" OR "Langston University" OR "Lawson State Community College" OR "LeMoyne-Owen College" OR "Lewis College of Business" OR "Lincoln University" OR "Lincoln University of Missouri" OR "Livingstone College" OR "University of Maryland Eastern Shore" OR "Meharry Medical College" OR "Miles College" OR "Mississippi Valley State University" OR "Morehouse College" OR "Morehouse School of Medicine" OR "Morgan State University" OR "Morris Brown College" OR "Morris College" OR "Norfolk State University" OR "North Carolina A&T State University" OR "North Carolina Central University" OR "Oakwood University" OR "Paine College" OR "Paul Quinn College" OR "Philander Smith College" OR "Prairie View A&M University" OR "Rust College" OR "Saint Paul's College" OR "Savannah State University" OR "Selma University" OR "Shaw University" OR "Shorter College" OR "Shelton State Community College" OR "South Carolina State University" OR "Southern University at New Orleans" OR "Southern University at Shreveport" OR "Southern University and A&M College" OR "Southwestern Christian College" OR "Spelman College" OR "St. Augustine's College" OR "St. Philip's College" OR "Stillman College" OR "Talladega College" OR "Tennessee State University" OR "Texas College" OR "Texas Southern University" OR "Tougaloo College" OR "Trenholm State Technical College" OR "Tuskegee University" OR "University of the Virgin Islands" OR "Virginia State University" OR "Virginia Union University" OR "Virginia University of Lynchburg" OR "Voorhees College" OR "West Virginia State University" OR "Wilberforce University" OR "Wiley College" OR "Winston-Salem State University" OR "Xavier University of Louisiana")`;

// African American fraternities & sororities (23) - source: booleanblackbelt.com.
const aaGreekBoolean = `("Sigma Pi Phi" OR "Alpha Phi Alpha" OR "Kappa Alpha Psi" OR "Omega Psi Phi" OR "Phi Beta Sigma" OR "Sigma Rhomeo" OR "Wine Psi Phi" OR "Iota Phi Theta" OR "Phi Delta Psi" OR "Delta Psi Chi" OR "Beta Phi Pi" OR "MALIK Fraternity" OR "Sigma Phi Rho" OR "Phi Rho Eta" OR "Gamma Psi Beta" OR "Alpha Kappa Alpha" OR "Delta Sigma Theta" OR "Zeta Phi Beta" OR "Sigma Gamma Rho" OR "Phi Delta Kappa" OR "Iota Phi Lambda" OR "Eta Phi Beta" OR "Gamma Phi Delta")`;

// Native American / Tribal Colleges & Universities (36) - source: booleanblackbelt.com.
const nativeCollegesBoolean = `("Bay Mills Community College" OR "Blackfeet Community College" OR "Cankdeska Cikana (Little Hoop) Community College" OR "Chief Dull Knife College" OR "College of Menominee Nation" OR "College of the Muscogee Nation" OR "Comanche Nation College" OR "Diné College" OR "Fond du Lac Tribal and Community College" OR "Fort Belknap College" OR "Fort Berthold Community College" OR "Fort Peck Community College" OR "Haskell Indian Nations University" OR "Ilisagvik College" OR "Institute of American Indian Arts" OR "Keweenaw Bay Ojibwa Community College" OR "Lac Courte Oreilles Ojibwa Community College" OR "Leech Lake Tribal College" OR "Little Big Horn College" OR "Little Priest Tribal College" OR "Navajo Technical College" OR "Nebraska Indian Community College" OR "Northwest Indian College" OR "Oglala Lakota College" OR "Saginaw Chippewa Tribal College" OR "Salish Kootenai College" OR "Sinte Gleska University" OR "Sisseton Wahpeton College" OR "Sitting Bull College" OR "Southwestern Indian Polytechnic Institute" OR "Stone Child College" OR "Tohono O'odham Community College" OR "Turtle Mountain Community College" OR "United Tribes Technical College" OR "White Earth Tribal and Community College" OR "Wind River Tribal College")`;

function renderDiversityResources() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('div-india-names', indiaFemaleNamesBoolean);
  set('div-us-names', usFemaleNamesBoolean);
  set('div-pronoun', pronounSignalsBoolean);
  set('div-she-her', classicSheHerBoolean);
  set('div-women-tech', womenInTechBoolean);
  set('div-womens-colleges', womensCollegesUSBoolean);
  set('div-sororities', sororitiesUSBoolean);
  set('div-hbcu', hbcuBoolean);
  set('div-aa-greek', aaGreekBoolean);
  set('div-native-colleges', nativeCollegesBoolean);
}
renderDiversityResources();

const talentClusters = {
  blrProduct:    '"Symantec" OR "Vmware" OR "Intuit" OR "Veritas" OR "Netapp" OR "Visa" OR "Paypal" OR "Amazon" OR "Flipkart" OR "Myntra" OR "Nvidia" OR "Qualcomm" OR "Adobe" OR "Cisco" OR "Oracle" OR "Intel" OR "Citrix" OR "Walmart"',
  puneProduct:   '"Nvidia" OR "VMware" OR "Pubmatic" OR "Veritas" OR "Druva" OR "Fiserv" OR "Marvell" OR "SAP Labs" OR "Zscaler" OR "FireEye" OR "Qualys" OR "Barclays" OR "Couchbase" OR "Persistent Systems" OR "TIBCO" OR "Red Hat" OR "Nutanix" OR "Cohesity"',
  startup:       '"Swiggy" OR "Zomato" OR "Razorpay" OR "Meesho" OR "PhonePe" OR "Dream11" OR "CRED" OR "Groww" OR "Zepto" OR "Chargebee" OR "Freshworks"',
  enterpriseTech:'"Microsoft" OR "Google" OR "Amazon" OR "Meta" OR "IBM" OR "Oracle" OR "Cisco" OR "SAP" OR "Dell" OR "Intel" OR "VMware"'
};
const educationMap = {
  tier1:'"IIT" OR "IIM" OR "BITS Pilani" OR "NIT" OR "IIIT"',
  tier2:'"VIT" OR "SRM" OR "Manipal" OR "PES University"',
  tier3:'"Anna University" OR "JNTU" OR "Mumbai University"'
};

// ══════════════════════════════════════════════
// TABS
// ══════════════════════════════════════════════
function switchTab(name, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  el.classList.add('active');
  const panel = document.getElementById('panel-' + name);
  panel.classList.add('active');
  panel.style.display = 'block';
}

// ══════════════════════════════════════════════
// TALENTDATA - direct search + enrichment (backed by the Crustdata API)
// Calls this app's own /api/crustdata-search and /api/crustdata-enrich (Vercel
// serverless functions) instead of api.crustdata.com directly. Same-origin, so no
// CORS problem, and the API key lives server-side only (CRUSTDATA_API_KEY env var) -
// this page never sees it.
// ══════════════════════════════════════════════
let cdResults = [];

// API error payloads are sometimes a string, sometimes a structured object (Crustdata
// itself is inconsistent here) - never assume it's a string, or status messages end up
// literally showing "[object Object]".
function errText(err) {
  if (!err) return '';
  if (typeof err === 'string') return err;
  if (err.message) return String(err.message);
  try { return JSON.stringify(err); } catch (e) { return String(err); }
}

function loadTalentDataSettings() {
  const webhook   = localStorage.getItem('tt_cd_webhook');
  const role      = localStorage.getItem('tt_cd_role');
  const exp       = localStorage.getItem('tt_cd_exp');
  const must      = localStorage.getItem('tt_cd_must');
  const nice      = localStorage.getItem('tt_cd_nice');
  const companies = localStorage.getItem('tt_cd_companies');
  const notes     = localStorage.getItem('tt_cd_notes');
  if (webhook)   document.getElementById('cd-webhook').value           = webhook;
  if (role)      document.getElementById('cd-role').value              = role;
  if (exp)       document.getElementById('cd-exp').value               = exp;
  if (must)      document.getElementById('cd-must').value              = must;
  if (nice)      document.getElementById('cd-nice').value              = nice;
  if (companies) document.getElementById('cd-target-companies').value  = companies;
  if (notes)     document.getElementById('cd-notes').value             = notes;

  try {
    const saved = JSON.parse(localStorage.getItem('tt_cd_results') || '[]');
    if (saved.length) { cdResults = saved; renderTalentDataResults(); }
  } catch(e) { /* ignore corrupt storage */ }
}

function saveTalentDataWebhook() {
  const url = document.getElementById('cd-webhook').value.trim();
  if (!url) { showStatus('cd-export-status', 'error', '⚠ Please enter your Apps Script Web App URL.'); return; }
  localStorage.setItem('tt_cd_webhook', url);
  showStatus('cd-export-status', 'success', '✓ Webhook URL saved.');
}

async function searchTalentData() {
  const title      = document.getElementById('cd-title').value.trim();
  const location   = document.getElementById('cd-location').value.trim();
  const mustHaves  = document.getElementById('cd-must').value.trim();
  const niceHaves  = document.getElementById('cd-nice').value.trim();
  const companies  = document.getElementById('cd-target-companies').value.trim();
  const notes      = document.getElementById('cd-notes').value.trim();
  let limit = parseInt(document.getElementById('cd-limit').value, 10);
  if (!limit || limit < 1) limit = 20;
  limit = Math.min(limit, 100);
  document.getElementById('cd-limit').value = limit;

  if (!title) { showStatus('cd-search-status', 'error', '⚠ Enter a job title to search on.'); return; }

  // Criteria persist per-browser so they survive a reload, same as role/exp/webhook below.
  localStorage.setItem('tt_cd_must', mustHaves);
  localStorage.setItem('tt_cd_nice', niceHaves);
  localStorage.setItem('tt_cd_companies', companies);
  localStorage.setItem('tt_cd_notes', notes);

  const btn = document.getElementById('cd-search-btn');
  const sp  = document.getElementById('cd-search-spinner');
  btn.disabled = true; sp.classList.add('on');
  showStatus('cd-search-status', 'info', '⏳ Searching TalentData...');

  try {
    const res = await fetch('/api/crustdata-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, location, limit,
        mustSkills: mustHaves,        // real filter - server ORs across the list
        currentCompany: companies     // real filter - server ORs across the list
        // "Good to haves" and "other notes" are intentionally NOT sent as filters -
        // they're preferences/context, not pass/fail criteria. Good-to-haves are
        // highlighted on results client-side in renderTalentDataResults() instead.
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(errText(data.error) || ('HTTP ' + res.status));

    if (data.profiles && data.profiles[0]) console.log('TalentData raw profile sample:', data.profiles[0]);
    const found = (data.profiles || []).map(talentDataPersonToProfile);
    const existingUrls = new Set(cdResults.map(p => p.url));
    const newOnes = found.filter(p => p.url && !existingUrls.has(p.url));
    cdResults = [...cdResults, ...newOnes];
    persistCdResults();
    renderTalentDataResults();

    showStatus('cd-search-status', 'success',
      `✓ ${found.length} found · ${newOnes.length} new · ${cdResults.length} total`);
  } catch(err) {
    console.error('TalentData search error:', err);
    showStatus('cd-search-status', 'error', '⚠ ' + (err.message || 'TalentData search failed.'));
  } finally {
    btn.disabled = false; sp.classList.remove('on');
  }
}

// Maps the TalentData (Crustdata API) /person/search result shape into this app's flat profile shape.
function talentDataPersonToProfile(person) {
  const bp = person.basic_profile || {};
  const currentRole = (person.experience && person.experience.employment_details &&
    person.experience.employment_details.current && person.experience.employment_details.current[0]) || {};
  const pn = person.professional_network || {};
  const sh = person.social_handles || {};
  const pnIdentifier = sh.professional_network_identifier || {};
  // Crustdata's v2 (2025-11-01) response nests the LinkedIn URL here - verified
  // against the API's own schema docs. Older fallbacks kept in case a differently
  // shaped response ever comes back from a legacy endpoint.
  const url = pnIdentifier.profile_url || pn.linkedin_profile_url || pn.profile_url || bp.linkedin_url ||
    person.professional_network_profile_url ||
    (person.crustdata_person_id ? `https://api.crustdata.com/person/${person.crustdata_person_id}` : '');

  return {
    source: 'TalentData',
    name: bp.name || 'Unknown',
    jobTitle: currentRole.title || '',
    company: currentRole.company || currentRole.company_name || '',
    location: (bp.location && (bp.location.raw || bp.location)) || '',
    url,
    snippet: bp.headline || '',
    scrapedAt: new Date().toISOString()
  };
}

// ── CANDIDATE DETAIL MODAL ──
// Opens on a candidate-card click (see renderTalentDataResults).
let cdModalIndex = -1;

function openCandidateModal(i) {
  cdModalIndex = i;
  renderCandidateModal();
  document.getElementById('candidate-modal-overlay').classList.add('open');
}

function closeCandidateModal() {
  document.getElementById('candidate-modal-overlay').classList.remove('open');
  cdModalIndex = -1;
}

function closeCandidateModalOutside(event) {
  if (event.target.id === 'candidate-modal-overlay') closeCandidateModal();
}

function renderCandidateModal() {
  const p = cdResults[cdModalIndex];
  const modal = document.getElementById('candidate-modal');
  if (!p || !modal) return;

  const initials = (p.name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const isLinkedIn = p.url && p.url.toLowerCase().includes('linkedin.com/in/');

  modal.innerHTML = `
    <div class="modal-head">
      <div class="modal-title">Candidate</div>
      <button class="modal-close" onclick="closeCandidateModal()">✕</button>
    </div>
    <div class="cand-modal-head">
      <div class="cand-avatar-lg">${esc(initials || '?')}</div>
      <div style="flex:1;min-width:0;">
        <div class="cand-modal-name">${esc(p.name || 'Unknown')}</div>
        <div class="cand-modal-role">${esc([p.jobTitle, p.company].filter(Boolean).join(' at ')) || 'Role unknown'}</div>
        ${p.location ? `<div class="cand-modal-location">📍 ${esc(p.location)}</div>` : ''}
      </div>
      ${p.url ? `<a class="profile-linkedin-btn" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${isLinkedIn ? 'View Profile' : '↗ Profile'}</a>` : ''}
    </div>

    <div class="cand-section" style="margin-bottom:0;">
      <div class="cand-section-label">About</div>
      <div class="cand-field">${p.snippet ? esc(p.snippet) : '<span style="color:var(--muted);">No headline captured for this candidate yet.</span>'}</div>
    </div>
  `;
}

function clearTalentDataResults() {
  if (!cdResults.length) return;
  if (!confirm('Clear all ' + cdResults.length + ' TalentData results?')) return;
  cdResults = [];
  persistCdResults();
  renderTalentDataResults();
  hideStatus('cd-search-status');
}

function persistCdResults() {
  localStorage.setItem('tt_cd_results', JSON.stringify(cdResults));
}

function renderTalentDataResults() {
  const wrap  = document.getElementById('cd-results');
  const count = document.getElementById('cd-count');
  const expBtn = document.getElementById('cd-export-btn');
  const n = cdResults.length;

  count.textContent = n + ' candidate' + (n !== 1 ? 's' : '');
  expBtn.disabled = n === 0;

  if (!n) {
    wrap.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--muted);font-size:12px;">Search above to see candidates here.</div>';
    return;
  }

  // Good-to-haves aren't filtered server-side (see searchTalentData) - instead we
  // highlight them here, live, against whatever's currently in the field, so
  // enrichment updates (new snippet/title) get re-checked on every render too.
  const niceEl = document.getElementById('cd-nice');
  const niceList = (niceEl && niceEl.value.trim())
    ? niceEl.value.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Map first (so index i is a stable position in cdResults), THEN reverse the
  // rendered cards for display - reversing cdResults itself would make i point
  // at the wrong candidate when a card's onclick opens the detail modal.
  const cards = cdResults.map((p, i) => {
    const haystack = ((p.jobTitle || '') + ' ' + (p.snippet || '') + ' ' + (p.company || '')).toLowerCase();
    const niceMatches = niceList.filter(k => k && haystack.includes(k.toLowerCase()));
    const isLinkedIn = p.url && p.url.toLowerCase().includes('linkedin.com/in/');
    const initials = (p.name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
    const roleLine = [p.jobTitle, p.company].filter(Boolean).join(' at ');
    return `
    <div class="profile-card" onclick="openCandidateModal(${i})">
      <div class="profile-avatar">${esc(initials || '?')}</div>
      <div class="profile-card-main">
        <div class="profile-card-top">
          <div style="flex:1;min-width:0;">
            <div class="profile-name">${esc(p.name || 'Unknown')}</div>
            <div class="profile-headline">${esc(p.snippet) || esc(roleLine) || 'Role unknown'}</div>
            ${p.snippet && roleLine ? `<div class="profile-meta">${esc(roleLine)}</div>` : ''}
            ${p.location ? `<div class="profile-location">📍 ${esc(p.location)}</div>` : ''}
          </div>
          ${p.url ? `<a class="profile-linkedin-btn" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">${isLinkedIn ? 'View Profile' : '↗ Profile'}</a>` : ''}
        </div>
        ${niceMatches.length ? `<div class="profile-skills">
          ${niceMatches.map(m => `<span class="skill-tag" style="background:var(--ai-glow);border-color:rgba(217,115,13,0.3);color:var(--ai);">✨ ${esc(m)}</span>`).join('')}
        </div>` : ''}
      </div>
    </div>
  `;
  });

  wrap.innerHTML = '<div class="profile-cards">' + cards.slice().reverse().join('') + '</div>';
}

async function exportTalentDataToSheet() {
  const webhookUrl = document.getElementById('cd-webhook').value.trim() || localStorage.getItem('tt_cd_webhook');
  const roleName   = document.getElementById('cd-role').value.trim() || 'General';
  const expRange   = document.getElementById('cd-exp').value.trim();
  const mustHaves  = document.getElementById('cd-must').value.trim();
  const niceHaves  = document.getElementById('cd-nice').value.trim();
  const companies  = document.getElementById('cd-target-companies').value.trim();
  const notes      = document.getElementById('cd-notes').value.trim();
  localStorage.setItem('tt_cd_role', roleName);
  localStorage.setItem('tt_cd_exp', expRange);

  if (!webhookUrl) { showStatus('cd-export-status', 'error', '⚠ Please save your Apps Script Web App URL first.'); return; }
  if (!cdResults.length) { showStatus('cd-export-status', 'error', '⚠ No results yet - search TalentData first.'); return; }

  const btn = document.getElementById('cd-export-btn');
  const txt = document.getElementById('cd-export-text');
  const sp  = document.getElementById('cd-export-spinner');
  btn.disabled = true; txt.textContent = 'Exporting...'; sp.classList.add('on');
  showStatus('cd-export-status', 'info', `⏳ Sending ${cdResults.length} profiles to "${roleName}" tab...`);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // mustHaves/niceHaves/companies/notes are extra context for a future Apps
      // Script version - today's v5 sheet only has columns for the fields it always
      // had, so it'll just ignore these until the sheet script is updated to use them.
      body: JSON.stringify({ profiles: cdResults, role: roleName, expRange, mustHaves, niceHaves, companies, notes })
    });
    const result = await res.json();
    if (result.status === 'ok') {
      showStatus('cd-export-status', 'success',
        `✓ ${result.added} added to "${result.role}" · ${result.skipped} duplicates skipped`);
    } else {
      showStatus('cd-export-status', 'error', '⚠ ' + (result.message || 'Unknown error'));
    }
  } catch(err) {
    showStatus('cd-export-status', 'error', '⚠ Could not reach Apps Script. Check the URL is deployed as "Anyone can access".');
  } finally {
    btn.disabled = false; txt.textContent = '📊 Export All to Google Sheet'; sp.classList.remove('on');
  }
}

loadTalentDataSettings();

// ══════════════════════════════════════════════
// GITHUB SEARCH - direct candidate search on GitHub
// Calls this app's own /api/github-search (Vercel serverless function) - same
// server-side-key model as TalentData above: the token is GITHUB_TOKEN in Vercel
// env vars and never reaches the browser.
// ══════════════════════════════════════════════
let ghResults = [];

function loadGitHubSettings() {
  ['gh-keywords','gh-language','gh-location','gh-min-followers','gh-min-repos','gh-role','gh-exp'].forEach(id => {
    const v = localStorage.getItem('tt_' + id);
    if (v) document.getElementById(id).value = v;
  });
  // Falls back to the TalentData tab's saved webhook - it's the same sheet, so there's
  // no reason to make the user paste the URL twice.
  const hook = localStorage.getItem('tt_gh_webhook') || localStorage.getItem('tt_cd_webhook');
  if (hook) document.getElementById('gh-webhook').value = hook;
  try {
    const saved = JSON.parse(localStorage.getItem('tt_gh_results') || '[]');
    if (saved.length) { ghResults = saved; renderGitHubResults(); }
  } catch(e) { /* ignore corrupt storage */ }
}

// Pagination state for the "Load More" button - the query that produced the current
// page, and which page of it we're on. Reset on every fresh search.
let ghPage = 1;
let ghHasMore = false;

function loadMoreGitHub() { searchGitHub(ghPage + 1); }

async function searchGitHub(page) {
  const isMore = !!page && page > 1;
  const keywords     = document.getElementById('gh-keywords').value.trim();
  const language     = document.getElementById('gh-language').value.trim();
  const location     = document.getElementById('gh-location').value.trim();
  const minFollowers = document.getElementById('gh-min-followers').value.trim();
  const minRepos     = document.getElementById('gh-min-repos').value.trim();
  let limit = parseInt(document.getElementById('gh-limit').value, 10);
  if (!limit || limit < 1) limit = 20;
  limit = Math.min(limit, 30);
  document.getElementById('gh-limit').value = limit;

  if (!keywords && !language && !location) {
    showStatus('gh-search-status', 'error', '⚠ Enter at least keywords, a language, or a location.');
    return;
  }

  // Persist inputs per-browser, same pattern as the TalentData tab.
  ['gh-keywords','gh-language','gh-location','gh-min-followers','gh-min-repos'].forEach(id => {
    localStorage.setItem('tt_' + id, document.getElementById(id).value.trim());
  });

  const btn = document.getElementById('gh-search-btn');
  const sp  = document.getElementById('gh-search-spinner');
  const moreBtn = document.getElementById('gh-more-btn');
  btn.disabled = true; sp.classList.add('on');
  if (moreBtn) { moreBtn.disabled = true; moreBtn.textContent = isMore ? '⏳ Loading...' : moreBtn.textContent; }
  showStatus('gh-search-status', 'info', isMore ? '⏳ Loading more results...' : '⏳ Searching GitHub...');

  try {
    const res = await fetch('/api/github-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords, language, location, minFollowers, minRepos, limit, page: isMore ? page : 1 })
    });
    // A 404 here returns Vercel's HTML "page not found", not JSON - parse defensively
    // so the user sees a real message instead of "Unexpected token ... not valid JSON".
    let data = {};
    try { data = await res.json(); } catch (e) {
      if (res.status === 404) throw new Error('/api/github-search not found - the app needs to be redeployed to Vercel so the new function exists.');
      throw new Error('Server returned a non-JSON response (HTTP ' + res.status + ').');
    }
    if (!res.ok) throw new Error(errText(data.error) || ('HTTP ' + res.status));

    const found = data.profiles || [];
    const existing = new Set(ghResults.map(p => p.url));
    const newOnes = found.filter(p => p.url && !existing.has(p.url));
    ghResults = [...ghResults, ...newOnes];
    ghPage = data.page || (isMore ? page : 1);
    ghHasMore = !!data.hasMore;
    localStorage.setItem('tt_gh_results', JSON.stringify(ghResults));
    renderGitHubResults();

    // Echo how the boolean expression was parsed - otherwise a typo'd query silently
    // returns "wrong" results and there's no way for the user to tell why.
    const bits = [`page ${ghPage}`, `${found.length} shown of ${data.totalCount ?? '?'} matching`];
    if (data.excludedByNot) bits.push(`${data.excludedByNot} excluded by NOT`);
    bits.push(`${newOnes.length} new`, `${ghResults.length} total`);
    showStatus('gh-search-status', 'success',
      '✓ ' + bits.join(' · ') + (data.interpreted ? `  -  read as: ${data.interpreted}` : ''));
  } catch(err) {
    console.error('GitHub search error:', err);
    showStatus('gh-search-status', 'error', '⚠ ' + (err.message || 'GitHub search failed.'));
  } finally {
    btn.disabled = false; sp.classList.remove('on');
    renderGitHubMoreBtn();
  }
}

function saveGitHubWebhook() {
  const url = document.getElementById('gh-webhook').value.trim();
  if (!url) { showStatus('gh-export-status', 'error', '⚠ Please enter your Apps Script Web App URL.'); return; }
  localStorage.setItem('tt_gh_webhook', url);
  showStatus('gh-export-status', 'success', '✓ Webhook URL saved.');
}

// Maps a GitHub result into the flat profile shape the Apps Script sheet already
// expects (same keys the TalentData tab exports), so no sheet changes are needed.
function githubProfileForSheet(p) {
  const emails = [];
  if (p.email) emails.push(p.email);
  (p.commitEmails || []).forEach(e => {
    if (!emails.some(x => x.toLowerCase() === e.email.toLowerCase())) emails.push(e.email);
  });
  return {
    source: 'GitHub',
    name: p.name || p.login,
    jobTitle: '',                                   // GitHub has no job-title field
    company: (p.company || '').replace(/^@/, ''),
    location: p.location || '',
    url: p.url,
    snippet: p.bio || '',
    email: emails.join(', '),
    githubLogin: p.login,
    followers: p.followers,
    publicRepos: p.publicRepos,
    scrapedAt: new Date().toISOString()
  };
}

async function exportGitHubToSheet() {
  const webhookUrl = document.getElementById('gh-webhook').value.trim()
    || localStorage.getItem('tt_gh_webhook') || localStorage.getItem('tt_cd_webhook');
  const roleName = document.getElementById('gh-role').value.trim() || 'General';
  const expRange = document.getElementById('gh-exp').value.trim();
  localStorage.setItem('tt_gh-role', roleName);
  localStorage.setItem('tt_gh-exp', expRange);

  if (!webhookUrl) { showStatus('gh-export-status', 'error', '⚠ Please save your Apps Script Web App URL first.'); return; }
  if (!ghResults.length) { showStatus('gh-export-status', 'error', '⚠ No results yet - search GitHub first.'); return; }

  const btn = document.getElementById('gh-export-btn');
  const txt = document.getElementById('gh-export-text');
  const sp  = document.getElementById('gh-export-spinner');
  btn.disabled = true; txt.textContent = 'Exporting...'; sp.classList.add('on');
  showStatus('gh-export-status', 'info', `⏳ Sending ${ghResults.length} profiles to "${roleName}" tab...`);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profiles: ghResults.map(githubProfileForSheet), role: roleName, expRange })
    });
    const result = await res.json();
    if (result.status === 'ok') {
      showStatus('gh-export-status', 'success',
        `✓ ${result.added} added to "${result.role}" · ${result.skipped} duplicates skipped`);
    } else {
      showStatus('gh-export-status', 'error', '⚠ ' + (result.message || 'Unknown error'));
    }
  } catch(err) {
    showStatus('gh-export-status', 'error', '⚠ Could not reach Apps Script. Check the URL is deployed as "Anyone can access".');
  } finally {
    btn.disabled = false; txt.textContent = '📊 Export All to Google Sheet'; sp.classList.remove('on');
  }
}

// The "Load More" button only makes sense while GitHub says there are further pages.
function renderGitHubMoreBtn() {
  const wrap = document.getElementById('gh-more-wrap');
  const b    = document.getElementById('gh-more-btn');
  if (!wrap || !b) return;
  wrap.style.display = ghHasMore ? 'flex' : 'none';
  b.disabled = false;
  b.textContent = '⬇ Load More (page ' + (ghPage + 1) + ')';
}

// Digs a candidate's email out of their public commit history (see api/github-email.js).
// Results are cached onto the candidate object so a repeat click costs nothing.
async function findGitHubEmail(i) {
  const p = ghResults[i];
  if (!p) return;

  const btn = document.getElementById('gh-email-btn-' + i);
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Searching...'; }

  try {
    const res = await fetch('/api/github-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: p.login })
    });
    let data = {};
    try { data = await res.json(); } catch (e) {
      if (res.status === 404) throw new Error('/api/github-email not found - redeploy the app so the new function exists.');
      throw new Error('Server returned a non-JSON response (HTTP ' + res.status + ').');
    }
    if (!res.ok) throw new Error(errText(data.error) || ('HTTP ' + res.status));

    p.commitEmails = data.emails || [];
    p.emailSearched = true;
    p.emailMasked = !!data.masked;
    p.emailIncomplete = !!data.incomplete;
    p.reposChecked = data.reposChecked || 0;
    p.reposTotal = data.reposTotal || 0;
    localStorage.setItem('tt_gh_results', JSON.stringify(ghResults));
    renderGitHubResults();

    if (p.commitEmails.length) {
      showStatus('gh-search-status', 'success', `✓ Found ${p.commitEmails.length} email${p.commitEmails.length > 1 ? 's' : ''} for @${p.login}`);
    } else if (data.masked) {
      showStatus('gh-search-status', 'info', `@${p.login} has GitHub's email privacy on - their commits store a noreply placeholder, so there's no real address to recover.`);
    } else if (data.incomplete) {
      const coverage = p.reposTotal ? ` (checked ${p.reposChecked} of ${p.reposTotal} public repos)` : '';
      showStatus('gh-search-status', 'warn', `No email found yet for @${p.login}${coverage} - GitHub's search rate limit may have cut the check short. Try "Retry email" again in a minute for a deeper pass.`);
    } else {
      showStatus('gh-search-status', 'info', `No public commits found for @${p.login} to pull an email from.`);
    }
  } catch (err) {
    console.error('GitHub email lookup error:', err);
    showStatus('gh-search-status', 'error', '⚠ ' + (err.message || 'Email lookup failed.'));
    if (btn) { btn.disabled = false; btn.textContent = '✉️ Find Email'; }
  }
}

function clearGitHubResults() {
  if (!ghResults.length) return;
  if (!confirm('Clear all ' + ghResults.length + ' GitHub results?')) return;
  ghResults = [];
  ghPage = 1; ghHasMore = false;
  localStorage.setItem('tt_gh_results', '[]');
  renderGitHubResults();
  renderGitHubMoreBtn();
  hideStatus('gh-search-status');
}

function renderGitHubResults() {
  const wrap  = document.getElementById('gh-results');
  const count = document.getElementById('gh-count');
  const n = ghResults.length;
  count.textContent = n + ' candidate' + (n !== 1 ? 's' : '');
  const expBtn = document.getElementById('gh-export-btn');
  if (expBtn) expBtn.disabled = n === 0;

  if (!n) {
    wrap.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--muted);font-size:12px;">Search above to see candidates here.</div>';
    return;
  }

  const cards = ghResults.map((p, i) => {
    const displayName = p.name || p.login;
    const roleLine = [p.company ? p.company.replace(/^@/, '') : '', p.location].filter(Boolean).join(' · ');
    // Public profile email plus anything dug out of commit history, deduped.
    const allEmails = [];
    if (p.email) allEmails.push(p.email);
    (p.commitEmails || []).forEach(e => {
      if (!allEmails.some(x => x.toLowerCase() === e.email.toLowerCase())) allEmails.push(e.email);
    });
    const stats = [
      p.followers != null ? `👥 ${p.followers} followers` : '',
      p.publicRepos != null ? `📦 ${p.publicRepos} repos` : '',
      p.hireable ? '✅ Hireable' : ''
    ].filter(Boolean);
    allEmails.forEach(e => stats.push(`✉️ ${esc(e)}`));
    if (p.emailSearched && !allEmails.length) {
      if (p.emailMasked) {
        stats.push('🔒 Email private on GitHub');
      } else if (p.emailIncomplete) {
        const coverage = p.reposTotal ? ` (${p.reposChecked}/${p.reposTotal} repos)` : '';
        stats.push(`✉️ Not found yet${coverage} - retry for a deeper check`);
      } else {
        stats.push('✉️ No public email found');
      }
    }
    return `
    <div class="profile-card">
      ${p.avatar
        ? `<img class="profile-avatar" src="${esc(p.avatar)}" alt="" style="object-fit:cover;">`
        : `<div class="profile-avatar">${esc((displayName || '?')[0].toUpperCase())}</div>`}
      <div class="profile-card-main">
        <div class="profile-card-top">
          <div style="flex:1;min-width:0;">
            <div class="profile-name">${esc(displayName)} <span style="color:var(--muted);font-weight:400;">@${esc(p.login)}</span></div>
            <div class="profile-headline">${esc(p.bio) || 'No bio'}</div>
            ${roleLine ? `<div class="profile-meta">${esc(roleLine)}</div>` : ''}
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
            <a class="profile-linkedin-btn" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">↗ GitHub</a>
            ${allEmails.length ? '' : `<button class="btn btn-ghost btn-sm" id="gh-email-btn-${i}" onclick="findGitHubEmail(${i})" style="white-space:nowrap;">${p.emailSearched ? '↻ Retry email' : '✉️ Find Email'}</button>`}
          </div>
        </div>
        ${stats.length ? `<div class="profile-skills">
          ${stats.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>` : ''}
      </div>
    </div>
  `;
  });

  // Newest search's results first - same as the TalentData tab, so fresh hits
  // aren't buried under previously accumulated ones.
  wrap.innerHTML = '<div class="profile-cards">' + cards.slice().reverse().join('') + '</div>';
}

loadGitHubSettings();

// ══════════════════════════════════════════════
// CUSTOM ROLES - localStorage
// ══════════════════════════════════════════════
function getCustomRoles() {
  try { return JSON.parse(localStorage.getItem('customRoles') || '[]'); } catch(e) { return []; }
}
function saveCustomRoles(arr) {
  localStorage.setItem('customRoles', JSON.stringify(arr));
}

function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  renderSavedRoles();
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  clearModalForm();
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}
function clearModalForm() {
  document.getElementById('new-role-label').value = '';
  document.getElementById('new-role-titles').value = '';
  document.getElementById('new-role-skills').value = '';
  hideStatus('modal-status');
}

function renderSavedRoles() {
  const roles = getCustomRoles();
  const el = document.getElementById('saved-roles-list');
  if (!roles.length) {
    el.innerHTML = '<div class="no-saved">No custom roles yet - add one below.</div>';
    return;
  }
  el.innerHTML = roles.map((r, i) => `
    <div class="saved-role-item">
      <div>
        <div class="saved-role-name">${esc(r.label)}</div>
        <div class="saved-role-cat">${esc(r.category)} · ${esc(r.titles.substring(0,50))}...</div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteCustomRole(${i})">Delete</button>
    </div>
  `).join('');
}

function saveCustomRole() {
  const label  = document.getElementById('new-role-label').value.trim();
  const titles = document.getElementById('new-role-titles').value.trim();
  const skills = document.getElementById('new-role-skills').value.trim();
  const cat    = document.getElementById('new-role-cat').value;

  if (!label || !titles || !skills) {
    showStatus('modal-status','error','Please fill in all three fields.');
    return;
  }
  const roles = getCustomRoles();
  roles.push({ label, titles, skills, category: cat, key: 'custom_' + Date.now() });
  saveCustomRoles(roles);
  renderSavedRoles();
  clearModalForm();
  showStatus('modal-status','success','✓ Role saved! Select "My Custom Roles" in the Builder.');
}

function deleteCustomRole(idx) {
  const roles = getCustomRoles();
  roles.splice(idx, 1);
  saveCustomRoles(roles);
  renderSavedRoles();
  populateRoles();
}

// ══════════════════════════════════════════════
// BUILDER
// ══════════════════════════════════════════════
function populateRoles() {
  const category = document.getElementById('category').value;
  const roleSelect = document.getElementById('role');
  roleSelect.innerHTML = '<option value="">- Select Role -</option>';
  if (!category) return;

  let roles = {};
  if (category === 'tech') roles = techRoles;
  else if (category === 'sales') roles = salesRoles;
  else if (category === 'veterans') roles = veteranRoles;
  else if (category === 'lgbtq') roles = lgbtqRoles;
  else if (category === 'freshers') roles = fresherRoles;

  else if (category === 'custom') {
    getCustomRoles().forEach(r => { roles[r.key] = r; });
  }

  for (let key in roles) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.text = roles[key].label;
    roleSelect.appendChild(opt);
  }
}

function getRoleData(category, key) {
  if (category === 'tech') return techRoles[key];
  if (category === 'sales') return salesRoles[key];
  if (category === 'veterans') return veteranRoles[key];
  if (category === 'lgbtq') return lgbtqRoles[key];
  if (category === 'freshers') return fresherRoles[key];
  if (category === 'custom') return getCustomRoles().find(r => r.key === key);
  return null;
}

function fmtComma(v) {
  if (!v || !v.trim()) return '';
  return '(' + v.split(',').map(x => `"${x.trim()}"`).join(' OR ') + ')';
}

function expandLoc(loc) {
  if (!loc) return '';
  const l = loc.toLowerCase();
  if (l.includes('india')) return '("India" OR "Bangalore" OR "Bengaluru" OR "Hyderabad" OR "Pune" OR "Chennai" OR "Mumbai" OR "Gurgaon" OR "Noida")';
  if (l.includes('bangalore') || l.includes('bengaluru')) return '("Bangalore" OR "Bengaluru")';
  return fmtComma(loc);
}

function expLogic(min, max) {
  if (isNaN(min) || isNaN(max)) return '';
  const arr = [];
  for (let i = min; i <= max; i++) arr.push(`"${i} years"`);
  return '(' + arr.join(' OR ') + ')';
}

// ══════════════════════════════════════════════
// MANDATORY KEYWORDS LOGIC
// ══════════════════════════════════════════════
let mandatoryLogicMode = 'OR';

function setLogic(mode) {
  mandatoryLogicMode = mode;
  document.querySelectorAll('.logic-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('logic-' + mode.toLowerCase()).classList.add('active');
  const hints = { OR: 'Any one skill is enough', AND: 'ALL skills must appear', RAW: 'Use your own AND/OR/()' };
  document.getElementById('logic-hint').textContent = hints[mode];
  updateMandatoryPreview();
}

function buildMandatory() {
  const val = document.getElementById('mandatory').value.trim();
  if (!val) return '';
  if (mandatoryLogicMode === 'RAW') return '(' + val + ')';
  // Split by comma
  const terms = val.split(',').map(t => t.trim()).filter(Boolean);
  if (!terms.length) return '';
  const quoted = terms.map(t => t.startsWith('"') ? t : `"${t}"`);
  return '(' + quoted.join(` ${mandatoryLogicMode} `) + ')';
}

function updateMandatoryPreview() {
  const preview = document.getElementById('mandatory-preview');
  const built = buildMandatory();
  if (built) {
    preview.textContent = '→ ' + built;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

function generate() {
  const category = document.getElementById('category').value;
  const roleKey  = document.getElementById('role').value;
  if (!category || !roleKey) { showStatus('builder-status','error','⚠ Please select both a category and role.'); return; }
  hideStatus('builder-status');

  const rd = getRoleData(category, roleKey);
  if (!rd) { showStatus('builder-status','error','⚠ Role data not found.'); return; }

  let q = `(${rd.titles}) AND (${rd.skills})`;
  const loc      = expandLoc(document.getElementById('location').value);
  const exp      = expLogic(parseInt(document.getElementById('minExp').value), parseInt(document.getElementById('maxExp').value));
  const cluster  = clusters[document.getElementById('cluster').value];
  const tc       = talentClusters[document.getElementById('talentCluster').value];
  const edu      = educationMap[document.getElementById('education').value];
  const cos      = fmtComma(document.getElementById('companies').value);
  const excl     = fmtComma(document.getElementById('exclude').value);
  const mandatory = buildMandatory();

  if (mandatory) q += ` AND ${mandatory}`;
  if (loc)       q += ` AND ${loc}`;
  if (exp)       q += ` AND ${exp}`;
  if (cluster)   q += ` AND (${cluster})`;
  if (tc)        q += ` AND (${tc})`;
  if (edu)       q += ` AND (${edu})`;
  if (cos)       q += ` AND ${cos}`;
  if (excl)      q += ` NOT ${excl}`;

  document.getElementById('output').value = q;
  document.getElementById('xray').value = `site:linkedin.com/in ${q}`;
  document.getElementById('so-query').value = `site:stackoverflow.com/users ${buildSOQuery(rd, mandatory)}`;
  document.getElementById('gh-query').value = buildGHQuery(rd, mandatory, document.getElementById('location').value);

  showStatus('builder-status','success','✓ Query generated - copy it above or open a source directly.');
}

function buildSOQuery(rd, mandatory) {
  // Extract first 2-3 skill terms from role skills for SO (keep it tight)
  const skillMatch = rd.skills.match(/"([^"]+)"/g) || [];
  const topSkills = skillMatch.slice(0, 3).join(' OR ');
  const mandatoryMatch = mandatory ? mandatory.match(/"([^"]+)"/g) || [] : [];
  const mandTerms = mandatoryMatch.slice(0, 2).join(' ');
  return [topSkills, mandTerms].filter(Boolean).join(' ');
}

function buildGHQuery(rd, mandatory, loc) {
  // Target individual GitHub profile pages
  // -inurl excludes org pages, repo pages, gist pages, follower list pages
  const skillMatch = rd.skills.match(/"([^"]+)"/g) || [];
  const topSkills = skillMatch.slice(0, 3).map(s => s).join(' OR ');
  const mandatoryMatch = mandatory ? mandatory.match(/"([^"]+)"/g) || [] : [];
  const mandTerms = mandatoryMatch.slice(0, 2).join(' OR ');
  const combined = [topSkills, mandTerms].filter(Boolean).join(' OR ');
  const indiaLoc = '"India" OR "Bangalore" OR "Mumbai" OR "Delhi" OR "Hyderabad" OR "Pune" OR "Chennai"';
  // "block or report user" = unique text on every GitHub individual profile page only
  return `site:github.com "block or report user" (${combined || topSkills}) (${indiaLoc})`;
}

function openLinkedIn() {
  const category = document.getElementById('category').value;
  const roleKey  = document.getElementById('role').value;
  if (!category || !roleKey) { showStatus('builder-status','warn','⚠ Generate a query first.'); return; }
  const rd = getRoleData(category, roleKey);
  const loc = document.getElementById('location').value.trim();
  const kw = rd.titles + (loc ? ` "${loc}"` : '');
  window.open('https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(kw), '_blank');
}

function openGoogle() {
  const xray = document.getElementById('xray').value;
  if (!xray) { showStatus('builder-status','warn','⚠ Generate a query first.'); return; }
  window.open('https://www.google.com/search?q=' + encodeURIComponent(xray), '_blank');
}

function openStackOverflow() {
  const q = document.getElementById('so-query').value;
  if (!q) { showStatus('builder-status','warn','⚠ Generate a query first.'); return; }
  window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank');
}

function openGitHub() {
  const q = document.getElementById('gh-query').value;
  if (!q) { showStatus('builder-status','warn','⚠ Generate a query first.'); return; }
  // Open via Google so Chrome Extension can scrape profiles and export to Sheets
  window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank');
}


// ══════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════
function copyText(id, btn) {
  const val = document.getElementById(id).value;
  if (!val) return;
  navigator.clipboard.writeText(val).then(() => {
    btn.textContent = 'Copied!'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

function showStatus(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'status ' + type;
  el.textContent = msg;
}
function hideStatus(id) {
  const el = document.getElementById(id);
  if (el) { el.className = 'status'; el.textContent = ''; }
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ══════════════════════════════════════════════════════════════
// JD ANALYZER - AI POWERED
// ══════════════════════════════════════════════════════════════

// Company intelligence database - curated by role type
const companyDB = {
  devops:    ["Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Dunzo","Ola","Nykaa","Sharechat","Freshworks","Zoho","Chargebee","Postman","Druva","Whatfix","Infosys","Wipro","TCS","Thoughtworks","Publicis Sapient","Nagarro"],
  sre:       ["Google","Microsoft","Amazon","Meta","Flipkart","Swiggy","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Ola","Nykaa","Sharechat","Freshworks","Zoho","Chargebee","Postman","Druva","Infosys","Wipro","TCS"],
  data:      ["Walmart Labs","Amazon","Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","MakeMyTrip","PolicyBazaar","PayTM","Juspay","Slice","Jupiter","Fi Money","Licious","HealthKart","Nykaa","Sharechat"],
  frontend:  ["Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","Nykaa","Sharechat","Freshworks","Zoho","Chargebee","Postman","Druva","Whatfix","BrowserStack","Wingify","CleverTap","MoEngage","WebEngage"],
  backend:   ["Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","Nykaa","Sharechat","Freshworks","Zoho","Chargebee","Postman","Druva","Whatfix","BrowserStack","Wingify","CleverTap","MoEngage"],
  fullstack: ["Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","Nykaa","Sharechat","Freshworks","Zoho","Chargebee","Postman","Druva","Whatfix","BrowserStack","Wingify"],
  mobile:    ["Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","Nykaa","Sharechat","Freshworks","Zoho","MakeMyTrip","PolicyBazaar","PayTM","Juspay","Slice","Jupiter","Fi Money"],
  ml:        ["Google","Microsoft","Amazon","Meta","Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","MakeMyTrip","PolicyBazaar","PayTM","Juspay","Slice","Jupiter","Fi Money","Licious","HealthKart"],
  product:   ["Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","Nykaa","Sharechat","Freshworks","Zoho","Chargebee","Postman","Druva","Whatfix","BrowserStack","Wingify","CleverTap","MoEngage","WebEngage","MakeMyTrip","PolicyBazaar","PayTM"],
  security:  ["Wipro","Infosys","TCS","HCL","Tech Mahindra","Palo Alto Networks","Crowdstrike","McAfee","Securonix","Druva","Rubrik","Zscaler","Qualys","Rapid7","Darktrace","Sophos","Cybereason"],
  cloud:     ["AWS","Google Cloud","Microsoft Azure","Wipro","Infosys","TCS","HCL","Tech Mahindra","Thoughtworks","Publicis Sapient","Nagarro","Zensar","Mphasis","Hexaware","LTIMindtree","Coforge"],
  sales:     ["Salesforce","SAP","Oracle","IBM","Zoho","Freshworks","HubSpot","Leadsquared","Kapture CRM","CleverTap","MoEngage","WebEngage","Netcore","Exotel","Ozonetel","Sprinklr"],
  default:   ["Flipkart","Swiggy","Zomato","CRED","Razorpay","PhonePe","Meesho","Groww","Zepto","Dream11","Ola","Nykaa","Sharechat","Freshworks","Zoho","Infosys","Wipro","TCS","Thoughtworks","Publicis Sapient"]
};

function detectRoleType(jdText) {
  const t = jdText.toLowerCase();

  // ── Count keyword signals per role type ──
  // This prevents a Full Stack JD from matching DevOps just because
  // it mentions CI/CD once
  const score = {
    fullstack: 0, frontend: 0, backend: 0, devops: 0, sre: 0,
    ml: 0, data: 0, mobile: 0, security: 0, cloud: 0, product: 0, sales: 0
  };

  // Full Stack signals
  if (t.includes('full stack') || t.includes('fullstack') || t.includes('full-stack')) score.fullstack += 5;
  if (t.includes('react') && (t.includes('node') || t.includes('java') || t.includes('python'))) score.fullstack += 3;
  if (t.includes('frontend') && t.includes('backend')) score.fullstack += 4;

  // Frontend signals
  if (t.includes('frontend') || t.includes('front-end') || t.includes('ui developer')) score.frontend += 3;
  if (t.includes('react') || t.includes('vue') || t.includes('angular')) score.frontend += 2;
  if (t.includes('css') || t.includes('html') || t.includes('javascript')) score.frontend += 1;

  // Backend signals
  if (t.includes('backend') || t.includes('back-end') || t.includes('server side')) score.backend += 3;
  if (t.includes('api') || t.includes('microservices') || t.includes('rest')) score.backend += 2;
  if ((t.includes('java') || t.includes('python') || t.includes('golang') || t.includes('node')) && !t.includes('full stack')) score.backend += 1;

  // DevOps signals
  if (t.includes('devops')) score.devops += 5;
  if (t.includes('terraform') || t.includes('ansible')) score.devops += 4;
  if (t.includes('ci/cd') || t.includes('jenkins') || t.includes('pipeline')) score.devops += 3;
  if (t.includes('docker') || t.includes('kubernetes')) score.devops += 2;

  // SRE signals
  if (t.includes('site reliability') || t.includes('sre')) score.sre += 5;
  if (t.includes('on-call') || t.includes('observability') || t.includes('incident')) score.sre += 3;
  if (t.includes('prometheus') || t.includes('grafana') || t.includes('datadog')) score.sre += 2;

  // ML/AI signals
  if (t.includes('machine learning') || t.includes('deep learning') || t.includes('llm')) score.ml += 5;
  if (t.includes('nlp') || t.includes('ai/ml') || t.includes('data scientist')) score.ml += 3;
  if (t.includes('tensorflow') || t.includes('pytorch') || t.includes('model training')) score.ml += 3;

  // Data signals
  if (t.includes('data engineer') || t.includes('data analyst')) score.data += 5;
  if (t.includes('spark') || t.includes('hadoop') || t.includes('airflow') || t.includes('dbt')) score.data += 4;
  if (t.includes('etl') || t.includes('data pipeline') || t.includes('data warehouse')) score.data += 3;

  // Mobile signals
  if (t.includes('android') || t.includes('ios') || t.includes('flutter') || t.includes('react native')) score.mobile += 5;
  if (t.includes('swift') || t.includes('kotlin')) score.mobile += 4;

  // Security signals
  if (t.includes('security') || t.includes('cybersecurity') || t.includes('penetration')) score.security += 5;
  if (t.includes('siem') || t.includes('soc') || t.includes('vapt')) score.security += 4;

  // Cloud signals
  if ((t.includes('cloud architect') || t.includes('cloud engineer')) && !t.includes('devops')) score.cloud += 5;
  if (t.includes('aws') || t.includes('azure') || t.includes('gcp')) score.cloud += 2;

  // Product signals
  if (t.includes('product manager') || t.includes('product owner')) score.product += 5;
  if (t.includes('roadmap') || t.includes('user story') || t.includes('sprint planning')) score.product += 3;

  // Sales signals
  if (t.includes('sales') || t.includes('account executive') || t.includes('business development')) score.sales += 5;

  // Return highest scoring role
  const winner = Object.entries(score).sort((a,b) => b[1]-a[1])[0];
  if (winner[1] === 0) return 'default';

  // Map role keys
  const roleMap = { fullstack:'fullstack', frontend:'frontend', backend:'backend',
    devops:'devops', sre:'sre', ml:'ml', data:'data', mobile:'mobile',
    security:'security', cloud:'cloud', product:'product', sales:'sales' };

  return roleMap[winner[0]] || 'default';

  // Legacy fallback (not reached but kept for safety)
  if (t.includes('devops') || t.includes('ci/cd') || t.includes('terraform') || t.includes('ansible')) return 'devops';
  if (t.includes('site reliability') || t.includes('sre') || t.includes('on-call') || t.includes('observability')) return 'sre';
  if (t.includes('machine learning') || t.includes('deep learning') || t.includes('nlp') || t.includes('llm') || t.includes('ai/ml') || t.includes('data scientist')) return 'ml';
  if (t.includes('data engineer') || t.includes('data analyst') || t.includes('spark') || t.includes('hadoop') || t.includes('dbt') || t.includes('airflow')) return 'data';
  if (t.includes('frontend') || t.includes('front-end') || t.includes('react') || t.includes('vue') || t.includes('angular') || t.includes('ui developer')) return 'frontend';
  if (t.includes('mobile') || t.includes('android') || t.includes('ios') || t.includes('flutter') || t.includes('react native') || t.includes('swift') || t.includes('kotlin')) return 'mobile';
  if (t.includes('full stack') || t.includes('fullstack') || t.includes('full-stack')) return 'fullstack';
  if (t.includes('backend') || t.includes('back-end') || t.includes('api') || t.includes('microservices') || t.includes('node.js') || t.includes('java') || t.includes('python') || t.includes('golang') || t.includes('go lang')) return 'backend';
  if (t.includes('security') || t.includes('cybersecurity') || t.includes('penetration') || t.includes('siem') || t.includes('soc analyst') || t.includes('vapt')) return 'security';
  if (t.includes('cloud') || t.includes('aws') || t.includes('azure') || t.includes('gcp') || t.includes('google cloud')) return 'cloud';
  if (t.includes('product manager') || t.includes('product management') || t.includes('product owner') || t.includes('roadmap')) return 'product';
  if (t.includes('sales') || t.includes('business development') || t.includes('account executive') || t.includes('revenue')) return 'sales';
  return 'default';
}

function getCompanies(jdText) {
  const roleType = detectRoleType(jdText);
  return companyDB[roleType] || companyDB['default'];
}

let selectedCompanies = [];

function renderCompanyChips(companies) {
  selectedCompanies = companies.slice(0, 12);
  const el = document.getElementById('res-companies');
  el.innerHTML = '';
  companies.slice(0, 20).forEach(c => {
    const chip = document.createElement('span');
    chip.className = 'company-chip' + (selectedCompanies.includes(c) ? ' active' : '');
    chip.style.cssText = selectedCompanies.includes(c)
      ? 'background:rgba(11,110,153,0.15);border-color:rgba(11,110,153,0.5);'
      : '';
    chip.textContent = c;
    chip.onclick = () => toggleCompany(c, chip);
    el.appendChild(chip);
  });
  updateCompanyXray();
}

function toggleCompany(name, el) {
  if (selectedCompanies.includes(name)) {
    selectedCompanies = selectedCompanies.filter(c => c !== name);
    el.style.cssText = '';
  } else {
    selectedCompanies.push(name);
    el.style.cssText = 'background:rgba(11,110,153,0.15);border-color:rgba(11,110,153,0.5);';
  }
  updateCompanyXray();
}

function updateCompanyXray() {
  if (!selectedCompanies.length) {
    document.getElementById('res-company-xray').textContent = 'Select companies above to generate X-Ray string.';
    return;
  }
  const companiesQ = selectedCompanies.map(c => `"${c}"`).join(' OR ');
  const roleType = detectRoleType(document.getElementById('jd-input').value);
  const roleTitles = {
    devops: '"DevOps" OR "Platform Engineer" OR "Infrastructure"',
    sre: '"Site Reliability" OR "SRE" OR "Platform Engineer"',
    data: '"Data Engineer" OR "Data Scientist" OR "Analytics"',
    frontend: '"Frontend" OR "UI Developer" OR "React Developer"',
    backend: '"Backend Engineer" OR "Software Engineer" OR "API Developer"',
    fullstack: '"Full Stack" OR "Software Engineer" OR "Developer"',
    mobile: '"Mobile Developer" OR "Android" OR "iOS" OR "Flutter"',
    ml: '"Machine Learning" OR "Data Scientist" OR "AI Engineer" OR "ML Engineer"',
    product: '"Product Manager" OR "Product Owner" OR "PM"',
    security: '"Security Engineer" OR "Cybersecurity" OR "SOC Analyst"',
    cloud: '"Cloud Engineer" OR "Cloud Architect" OR "DevOps"',
    sales: '"Sales" OR "Business Development" OR "Account Executive"',
    default: '"Engineer" OR "Developer" OR "Manager"'
  };
  const titles = roleTitles[roleType] || roleTitles.default;
  const xray = `site:linkedin.com/in (${titles}) AND (${companiesQ})`;
  document.getElementById('res-company-xray').textContent = xray;
}

// ── Main JD Analysis function ──────────────────────────────────
async function analyzeJD() {
  const jd = document.getElementById('jd-input').value.trim();
  if (!jd || jd.length < 50) {
    showJdError('Please paste a complete Job Description (at least 50 characters).');
    return;
  }

  const apiKey = (document.getElementById('api-key-input')?.value || localStorage.getItem('tt_api_key') || '').trim();
  if (!apiKey || !apiKey.startsWith('sk-ant')) {
    showJdError('Please enter your Anthropic API key above. Get a free key at console.anthropic.com');
    return;
  }
  clearJdError();

  // Show loading
  document.getElementById('jd-loading').style.display = 'block';
  document.getElementById('jd-results').style.display = 'none';
  document.getElementById('jd-loading-msg').textContent = 'Analyzing Job Description with Claude AI...';

  try {
    // Step 1: Extract skills/titles and generate boolean strings
    document.getElementById('jd-loading-msg').textContent = 'Extracting skills and generating search strings...';

    const booleanPrompt = `You are an expert technical recruiter and Boolean search specialist.

Analyze this Job Description and return ONLY a JSON object (no markdown, no explanation):

{
  "jobTitle": "extracted job title",
  "titles": ["list", "of", "3-6", "relevant", "job", "titles"],
  "mustSkills": ["top", "4-6", "must-have", "skills"],
  "niceSkills": ["top", "3-4", "good-to-have", "skills"],
  "expRange": "e.g. 3-7 years",
  "booleanString": "full LinkedIn boolean search string using titles AND skills",
  "xrayLinkedIn": "site:linkedin.com/in boolean string",
  "xraySO": "site:stackoverflow.com/users boolean string with top tech skills only",
  "xrayGitHub": "GitHub people search URL string - use this exact format: site:github.com/in OR just use GitHub people search: the string should target user profile pages NOT repos. Use format: site:github.com (\"followers\" OR \"repositories\") AND (skill1 OR skill2) - keep it short, max 3 skills"
}

JD:
${jd.substring(0, 2000)}`;

    const r1 = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-dangerous-direct-browser-access': 'true',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: booleanPrompt }]
      })
    });
    const d1 = await r1.json();
    console.log('API Response 1:', JSON.stringify(d1).substring(0, 300));

    // Check for API errors
    if (d1.error) {
      throw new Error('API Error: ' + (d1.error.message || JSON.stringify(d1.error)));
    }
    if (!d1.content || !d1.content[0]) {
      throw new Error('Empty response from API. Check your API key is valid and has credits.');
    }

    const raw1 = d1.content[0].text || '{}';
    const clean1 = raw1.replace(/```json|```/g, '').trim();
    // Extract JSON object even if response has extra text around it
    const jsonMatch1 = clean1.match(/\{[\s\S]*\}/);
    if (!jsonMatch1) throw new Error('Could not parse AI response. Raw: ' + clean1.substring(0, 100));
    const parsed = JSON.parse(jsonMatch1[0]);

    // Populate boolean results
    document.getElementById('res-boolean').textContent = parsed.booleanString || '-';
    document.getElementById('res-xray').textContent    = parsed.xrayLinkedIn  || '-';
    document.getElementById('res-so').textContent      = parsed.xraySO        || '-';

    // GitHub X-Ray - target INDIVIDUAL profile pages only
    // Key insight: individual profile URLs = github.com/username (no sub-path)
    // Exclude: /orgs/ /repos/ /followers /gists /blob /tree /commit
    const ghSkillsArr = (parsed.mustSkills || []).slice(0, 3).filter(s => s && s.trim());
    const ghSkillsStr = ghSkillsArr.length > 0
      ? ghSkillsArr.map(s => '"' + s.trim() + '"').join(' OR ')
      : (parsed.titles || []).slice(0,2).map(s => '"' + s.trim() + '"').join(' OR ');
    // "block or report user" text appears ONLY on individual GitHub profile pages
    const ghTitlesStr = (parsed.titles || []).slice(0,2).map(s => '"' + s.trim() + '"').join(' OR ');
    const ghRoleStr = ghTitlesStr || ghSkillsStr;
    const ghQuery = 'site:github.com "block or report user" (' + ghRoleStr + ') (' + ghSkillsStr + ') ("India" OR "Bangalore" OR "Mumbai" OR "Hyderabad" OR "Pune" OR "Chennai" OR "Delhi")';
    console.log('GitHub query:', ghQuery);
    document.getElementById('res-gh').textContent = ghQuery;

    // Step 2: Interview Questions
    document.getElementById('jd-loading-msg').textContent = 'Generating interview questions...';

    const iqPrompt = `You are a senior technical recruiter. Based on this Job Description, generate exactly 8 screening questions a recruiter should ask a candidate on a first call.

Mix these types: 2 experience/background, 2 technical depth, 2 behavioural, 1 motivation, 1 culture/work-style.

Return ONLY a JSON array (no markdown):
[
  {"type": "Experience", "question": "..."},
  {"type": "Technical", "question": "..."}
]

JD: ${jd.substring(0, 1500)}`;

    const r2 = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-dangerous-direct-browser-access': 'true',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: iqPrompt }]
      })
    });
    const d2 = await r2.json();
    console.log('API Response 2:', JSON.stringify(d2).substring(0, 200));
    if (d2.error) throw new Error('API Error (Q): ' + d2.error.message);
    const raw2 = d2.content?.[0]?.text || '[]';
    const clean2 = raw2.replace(/```json|```/g, '').trim();
    const jsonMatch2 = clean2.match(/\[[\s\S]*\]/);
    const questions = JSON.parse(jsonMatch2 ? jsonMatch2[0] : clean2);

    const iqEl = document.getElementById('res-interview');
    iqEl.innerHTML = questions.map(q => `
      <div class="interview-q">
        <strong>${q.type}</strong>
        ${q.question}
      </div>`).join('');

    // Step 3: Profile Review Checklist
    document.getElementById('jd-loading-msg').textContent = 'Building profile review checklist...';

    const profilePrompt = `You are a senior technical recruiter in India. Based on this JD, create a practical profile review checklist for recruiters to use when reviewing real LinkedIn profiles.

Return ONLY a JSON object (no markdown):
{
  "checklistSections": [
    {
      "section": "Headline & Current Role",
      "whatToCheck": "What the recruiter should look at in this section",
      "lookFor": "Specific things that indicate a strong match"
    },
    {
      "section": "Experience",
      "whatToCheck": "...",
      "lookFor": "..."
    },
    {
      "section": "Skills Section",
      "whatToCheck": "...",
      "lookFor": "..."
    },
    {
      "section": "Education",
      "whatToCheck": "...",
      "lookFor": "..."
    },
    {
      "section": "Activity & Posts",
      "whatToCheck": "...",
      "lookFor": "..."
    }
  ],
  "greenFlags": [
    "Specific positive signal 1",
    "Specific positive signal 2",
    "Specific positive signal 3",
    "Specific positive signal 4",
    "Specific positive signal 5"
  ],
  "redFlags": [
    "Specific concern 1",
    "Specific concern 2",
    "Specific concern 3",
    "Specific concern 4",
    "Specific concern 5"
  ]
}

JD: ${jd.substring(0, 1200)}`;

    const r3 = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-dangerous-direct-browser-access': 'true',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: profilePrompt }]
      })
    });
    const d3 = await r3.json();
    console.log('API Response 3:', JSON.stringify(d3).substring(0, 200));
    if (d3.error) throw new Error('API Error (Profile): ' + d3.error.message);
    const raw3 = d3.content?.[0]?.text || '{}';
    const clean3 = raw3.replace(/```json|```/g, '').trim();
    const jsonMatch3 = clean3.match(/\{[\s\S]*\}/);
    const checklist = JSON.parse(jsonMatch3 ? jsonMatch3[0] : clean3);

    // Render checklist sections
    const profEl = document.getElementById('res-profiles');
    profEl.innerHTML = (checklist.checklistSections || []).map(sec => `
      <div style="padding:10px 0;border-bottom:1px solid var(--border);">
        <div style="font-size:10px;font-weight:700;color:var(--accent2);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">
          📋 ${sec.section}
        </div>
        <div style="font-size:11.5px;color:var(--muted);margin-bottom:3px;">${sec.whatToCheck}</div>
        <div style="font-size:11.5px;color:var(--text);">👉 ${sec.lookFor}</div>
      </div>`).join('');

    // Render green flags
    const greenEl = document.getElementById('res-green-flags');
    greenEl.innerHTML = (checklist.greenFlags || []).map(f =>
      `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:11px;color:var(--text);">✅ ${f}</div>`
    ).join('');

    // Render red flags
    const redEl = document.getElementById('res-red-flags');
    redEl.innerHTML = (checklist.redFlags || []).map(f =>
      `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:11px;color:var(--text);">⚠️ ${f}</div>`
    ).join('');

    // Step 4: Companies (no API needed - use our DB)
    const companies = getCompanies(jd);
    renderCompanyChips(companies);

    // Show results
    document.getElementById('jd-loading').style.display = 'none';
    document.getElementById('jd-results').style.display = 'block';
    switchJdTab('boolean');

  } catch(err) {
    document.getElementById('jd-loading').style.display = 'none';
    let errMsg = err.message || 'Unknown error';
    if (errMsg.includes('invalid x-api-key') || errMsg.includes('authentication')) {
      errMsg = '❌ Invalid API Key - please check your key at console.anthropic.com';
    } else if (errMsg.includes('credit') || errMsg.includes('billing')) {
      errMsg = '❌ No credits - add credits at console.anthropic.com/settings/billing';
    } else if (errMsg.includes('JSON') || errMsg.includes('Unterminated') || errMsg.includes('parse')) {
      errMsg = '⚠️ Response parse error - try pasting a shorter job description (just the key requirements)';
    } else if (errMsg.includes('fetch') || errMsg.includes('network') || errMsg.includes('Failed to fetch')) {
      errMsg = '🌐 Network error - check internet connection and try again';
    } else if (errMsg.includes('Empty response')) {
      errMsg = '❌ No response from API - your API key may be invalid or have no credits';
    }
    showJdError('Analysis failed: ' + errMsg);
    console.error('Full error:', err);
    console.error(err);
  }
}

function switchJdTab(tab) {
  document.querySelectorAll('.jd-tab').forEach((b,i) => {
    const tabs = ['boolean','companies','interview','profile'];
    b.classList.toggle('active', tabs[i] === tab);
  });
  ['boolean','companies','interview','profile'].forEach(t => {
    const el = document.getElementById('jdtab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
}

function clearJD() {
  document.getElementById('jd-input').value = '';
  document.getElementById('jd-results').style.display = 'none';
  document.getElementById('jd-loading').style.display = 'none';
  clearJdError();
  selectedCompanies = [];
}

// Load saved API key from localStorage
(function loadSavedKey() {
  const saved = localStorage.getItem('tt_api_key');
  if (saved) {
    const el = document.getElementById('api-key-input');
    if (el) el.value = saved;
  }
})();

function showJdError(msg) {
  const el = document.getElementById('jd-error');
  el.textContent = msg;
  el.style.display = 'block';
}
function clearJdError() {
  document.getElementById('jd-error').style.display = 'none';
}

function copyEl(id, btn) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = orig, 1800);
  });
}


// ══════════════════════════════════════════════════════════════
// ROLE SEARCH WITH SPELL CORRECTION
// ══════════════════════════════════════════════════════════════

// Spell correction map - common typos → correct search terms
const spellCorrections = {
  'vetran': 'veteran', 'veteren': 'veteran', 'veterean': 'veteran',
  'vetern': 'veteran', 'veterin': 'veteran', 'vetaran': 'veteran',
  'fullstacker': 'full stack', 'fullstack': 'full stack', 'full-stack': 'full stack',
  'fronend': 'frontend', 'forntend': 'frontend', 'frontent': 'frontend',
  'backand': 'backend', 'beckend': 'backend', 'bakend': 'backend',
  'devop': 'devops', 'devpos': 'devops', 'devops engineer': 'devops',
  'sreq': 'sre', 'site relaibility': 'site reliability',
  'databse': 'database', 'datascience': 'data science',
  'machin learning': 'machine learning', 'machinelearning': 'machine learning',
  'tire1': 'tier 1', 'tire2': 'tier 2', 'teir1': 'tier 1', 'teir2': 'tier 2',
  'tier1': 'tier 1', 'tier2': 'tier 2',
  'freser': 'fresher', 'fresher': 'fresher', 'frseher': 'fresher',
  'andriod': 'android', 'androud': 'android',
  'securty': 'security', 'securtiy': 'security',
  'prodcut': 'product', 'prouct': 'product',
  'entereprise': 'enterprise', 'enterprice': 'enterprise',
};

// Build a flat list of all roles for search
function getAllRoles() {
  const allRoles = [];
  const roleSets = [
    { key: 'tech', obj: typeof techRoles !== 'undefined' ? techRoles : {} },
    { key: 'sales', obj: typeof salesRoles !== 'undefined' ? salesRoles : {} },
    { key: 'veterans', obj: typeof veteranRoles !== 'undefined' ? veteranRoles : {} },
    { key: 'freshers', obj: typeof fresherRoles !== 'undefined' ? fresherRoles : {} },
  ];
  roleSets.forEach(set => {
    Object.entries(set.obj).forEach(([roleKey, roleData]) => {
      allRoles.push({
        category: set.key,
        key: roleKey,
        label: roleData.label || roleKey,
      });
    });
  });
  return allRoles;
}

function correctSpelling(input) {
  const lower = input.toLowerCase().trim();
  return spellCorrections[lower] || lower;
}

function filterRoles(input) {
  const corrected = correctSpelling(input);
  const suggestions = document.getElementById('role-suggestions');
  if (!input.trim()) { suggestions.style.display = 'none'; return; }

  const allRoles = getAllRoles();
  const matches = allRoles.filter(r =>
    r.label.toLowerCase().includes(corrected) ||
    r.key.toLowerCase().includes(corrected) ||
    r.category.toLowerCase().includes(corrected)
  );

  if (!matches.length) {
    suggestions.innerHTML = '<div style="padding:10px 14px;font-size:11px;color:var(--muted);">No roles found - try a different spelling</div>';
    suggestions.style.display = 'block';
    return;
  }

  suggestions.innerHTML = matches.slice(0, 10).map(m => `
    <div onclick="selectRoleFromSearch('${m.category}', '${m.key}', '${m.label.replace(/'/g, "\'")}')"
      style="padding:9px 14px;cursor:pointer;font-size:12px;color:var(--text);
      border-bottom:1px solid var(--border);transition:background 0.15s;"
      onmouseover="this.style.background='var(--surface2)'"
      onmouseout="this.style.background='transparent'">
      <span style="color:var(--accent);font-size:10px;text-transform:uppercase;
        letter-spacing:1px;margin-right:8px;">${m.category}</span>
      ${m.label}
    </div>
  `).join('');
  suggestions.style.display = 'block';

  // Show spell correction hint if input was corrected
  if (corrected !== input.toLowerCase().trim()) {
    const hint = document.createElement('div');
    hint.style.cssText = 'padding:6px 14px;font-size:10px;color:var(--warn);border-top:1px solid var(--border);';
    hint.innerHTML = `✏️ Showing results for "<strong>${corrected}</strong>"`;
    suggestions.appendChild(hint);
  }
}

function selectRoleFromSearch(category, roleKey, label) {
  // Set category
  document.getElementById('category').value = category;
  populateRoles();

  // Set role
  document.getElementById('role').value = roleKey;

  // Update search box
  document.getElementById('role-search').value = label;

  // Hide suggestions
  document.getElementById('role-suggestions').style.display = 'none';

  // Update tag preview if exists
  if (typeof updateTagPreview === 'function') updateTagPreview();
}

function showRoleDropdown() {
  const val = document.getElementById('role-search').value;
  if (val.trim()) filterRoles(val);
}

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
  const suggestions = document.getElementById('role-suggestions');
  const searchBox   = document.getElementById('role-search');
  if (suggestions && !suggestions.contains(e.target) && e.target !== searchBox) {
    suggestions.style.display = 'none';
  }
});


// ══════════════════════════════════════════════════════════════
// FRESHER DYNAMIC QUERY BUILDER
// ══════════════════════════════════════════════════════════════

function onFresherTierChange() {
  const tier = document.getElementById('fresher-tier').value;
  const customWrap = document.getElementById('fresher-custom-college-wrap');
  customWrap.style.display = tier === 'custom' ? 'block' : 'none';
  buildFresherQuery();
}

function showFresherPanel(show) {
  const panel = document.getElementById('fresher-panel');
  if (panel) panel.style.display = show ? 'block' : 'none';
  if (show) buildFresherQuery();
}

function buildFresherQuery() {
  const year     = document.getElementById('fresher-year')?.value || '';
  const tier     = document.getElementById('fresher-tier')?.value || '';
  const stream   = document.getElementById('fresher-stream')?.value || 'any';
  const location = document.getElementById('fresher-location')?.value || 'india';
  const custom   = document.getElementById('fresher-custom-college')?.value?.trim() || '';

  if (!year && !tier) {
    document.getElementById('fresher-preview').style.display = 'none';
    return;
  }

  // Build college string
  let collegeStr = '';
  if (tier === 'custom' && custom) {
    const colleges = custom.split(',').map(c => c.trim()).filter(Boolean);
    collegeStr = colleges.map(c => `"${c}"`).join(' OR ');
  } else if (tier && collegeTiers[tier]) {
    collegeStr = collegeTiers[tier].colleges;
  }

  // Build stream string
  const streamStr = fresherStreams[stream] || fresherStreams['any'];

  // Build year string
  const yearStr = year ? `"${year}"` : '';

  // Build location string
  const locMap = {
    india: '"India" OR "Bangalore" OR "Mumbai" OR "Delhi" OR "Hyderabad" OR "Pune" OR "Chennai"',
    bangalore: '"Bangalore" OR "Bengaluru"',
    mumbai: '"Mumbai" OR "Navi Mumbai" OR "Thane"',
    delhi: '"Delhi" OR "Gurgaon" OR "Noida" OR "Gurugram"',
    hyderabad: '"Hyderabad" OR "Secunderabad"',
    pune: '"Pune"',
    chennai: '"Chennai"'
  };
  const locStr = locMap[location] || locMap['india'];

  // Build final query
  let parts = [];
  if (collegeStr) parts.push(`(${collegeStr})`);
  if (yearStr)    parts.push(yearStr);
  if (streamStr)  parts.push(`(${streamStr})`);

  const query = parts.join(' AND ');
  const xray  = `site:linkedin.com/in ${query} AND (${locStr})`;

  // Show preview
  const preview = document.getElementById('fresher-preview');
  preview.textContent = xray;
  preview.style.display = 'block';

  // Push to output fields
  document.getElementById('output').value = query + ` AND (${locStr})`;
  document.getElementById('xray').value   = xray;
  document.getElementById('so-query').value = '';
  document.getElementById('gh-query').value = '';
}

// Show/hide fresher panel based on category selection
const _origPopulateRoles = populateRoles;
populateRoles = function() {
  _origPopulateRoles();
  const cat = document.getElementById('category').value;
  showFresherPanel(cat === 'freshers');
};

</script>
</body>
</html>
