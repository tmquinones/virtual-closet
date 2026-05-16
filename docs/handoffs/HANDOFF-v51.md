# HANDOFF — TMF Closet, end of 2026-05-07

> Read this top-to-bottom before doing anything tomorrow.
> Supersedes the "Last shipped" sections in CLAUDE.md and HANDOFF-v43.md.
> The PROJECT-LOG.md entries Phase 34 / 34A / 34B cover the long-form
> story for v44 / v46 / v48. v45, v47, v49, v50, v51 are minor follow-ups
> documented inline below — no separate log entries.

---

## TL;DR

**Today was the design-refresh launch day.** The site at
`https://tmfcloset.com` is now branded as **That's My Freaking Closet**,
running on the locked design system (cream + sage + wood + 8 schemes,
Cormorant Garamond + Inter, top nav + hamburger drawer, per-route
scheme heroes). Eight deploys (v44 → v51), all on production.

**Backend has not been started.** Task #4 ("Design SQLite schema
mirroring IndexedDB") has been "in progress" all day but I did not
actually read the IndexedDB code or write any schema. Tomorrow that
should be the first real work, OR Phase 2C (search modal) — Tiffany
to pick.

**Domain is fully wired.** tmfcloset.com points at GitHub Pages with
SSL. Cloudflare Tunnel on the NAS is HEALTHY and ready for
api.tmfcloset.com once the API exists. The NAS storage pool is
healthy with one drive — second drive arrives ~2 weeks from today
(~2026-05-21), at which point I'll send instructions to add it to
the SHR pool so it mirrors automatically.

---

## What shipped today

| ver | what | source-of-truth note |
|---|---|---|
| v44 | Brand rename → TMF Closet · style-guide-r1.css · Cormorant + Inter loaded · all-caps eyebrow utilities · 8 scheme classes · service worker cache renamed `virtual-closet-*` → `tmfcloset-*` | PROJECT-LOG Phase 34 |
| v45 | Hotfix: login screen brand-mark `VC` → `tmf` (got missed in v44) | inline |
| v46 | Login screen redesign on cream scheme · italic Cormorant title · em-emphasized "have"/"love" · thin underline tabs · charcoal all-caps submit · terracotta-tinted error state | PROJECT-LOG Phase 34A |
| v47 | Login overlay backdrop changed from cream → deep sage so the cream card pops | inline |
| v48 | **Phase 2B big ship.** Top nav + hamburger drawer · 7 grouped sections · account dropdown · drawer Sign Out / Export / Import buttons proxy to the (now hidden) sidebar buttons · `js/drawer-r1.js` added (drawer + dropdown wiring) · sidebar `display: none !important` (DOM stays for JS compatibility) | PROJECT-LOG Phase 34B |
| v49 | **Critical fix.** v48 ship truncated index.html via the Edit-tool footgun — file went from 286 → 164 lines, dropping the bundle script tag and login overlay. Reconstructed via `head -n 162` + heredoc append. **Lesson:** never use Edit for >50-line inserts on this repo; use bash + `python3 -c "p.replace(...)"` instead. | inline |
| v50 | **Phase 2B.1.** New `js/scheme-r1.js` listens to hashchange, applies `scheme-*` class to `<body>` per route, swaps the page-hero eyebrow + headline text. Page hero band added to index.html between top-header and drawer. Scheme map locked to ~25 routes. | inline |
| v51 | **Phase 2B.2.** Scheme color now spreads to body background, not just the hero band. Light schemes (cream, blush) full-intensity; dark schemes get a 10%-blend tint over cream so existing white content cards stay readable. Page hero padding bumped from 2rem → 3.5rem for more presence. | inline |

**Bundle:** `dist/app.bundle.js?v=1778290000000` — 42 sources, 513 KB.
Sources unchanged since v50 (v51 was CSS-only).

**Service worker cache:** `tmfcloset-v51`.

**Style-guide cache buster:** `style-guide-r1.css?v=1778300000000`.

---

## What's currently working

- **Login screen** at tmfcloset.com — deep sage backdrop, cream card,
  italic Cormorant title, all-caps tabs + button, terracotta error state.
- **Top nav** on every page — `≡` hamburger left · `tmf` wordmark
  centered · `⌕` search + `○` account right.
- **Hamburger drawer** — slides in from left, 7 grouped sections (My
  Closet / Daily / Plan / Insights / Records / Imports / Shop), 21
  links total, drawer footer has Export Backup / Import Backup that
  proxy to the hidden sidebar's buttons.
- **Account dropdown** — click `○` → small dropdown shows `@username`
  + Sign Out (which proxies to the hidden sidebar's signOutBtn).
- **Page hero** — every page has a cream-or-scheme-colored hero band
  with all-caps eyebrow + italic Cormorant headline. Updates per
  route via scheme-r1.js.
- **Body background tint** — every page picks up its scheme's mood,
  not just the hero. Wishlist is the most dramatic (full blush).

## What's NOT working / temporarily inaccessible

- **Search button** (`⌕`) — placeholder. Click does nothing. This is
  intentional — Phase 2C builds the actual modal.
- **Theme toggle** (B&W / Warm / Dark) — was in the sidebar footer.
  Sidebar is hidden via CSS, so the toggle is invisible. **Phase 2C**
  or **polish ship** moves it into the account dropdown or a
  settings page.
- **Insights tabs** (Photos / Declutter / Gaps / Colors) — Tiffany
  flagged these don't differentiate. Most likely empty-state
  confusion since her test account on tmfcloset.com has 0 items.
  **First test tomorrow:** add 1-2 items via Add Item, return to
  Insights, check whether the tabs show different content with data
  present. If still identical → real regression.

## Other small known issues (cosmetic, low priority)

- Console warning: `<meta name="apple-mobile-web-app-capable">` is
  deprecated. Add `<meta name="mobile-web-app-capable" content="yes">`
  alongside.
- Console 404: `/favicon.ico`. Add either `apple-touch-icon.png` →
  `favicon.ico` OR `<link rel="icon" href="data:,">` to silence.
- The legacy `/lookbook/` page got the rename in v45 but its layout
  hasn't been touched. It still has its own duplicate-CSS aesthetic.
  Not on Tiffany's hot list.

---

## Decision point for tomorrow morning

Tiffany picked **"Pause for today"** when asked what to tackle next.
The same three options are queued for tomorrow's first decision:

### Option A — Backend (recommended)

The biggest impact long-term and the actual reason for buying the
NAS. Multi-session work. Day 1 of backend looks like:

1. Read `js/data-r9.js` and `js/db-r3.js` to extract the IndexedDB
   schema (item shape, wishlist shape, outfits, wear log, ratings,
   notes, photos as blobs).
2. Translate to SQLite — every store becomes a table with a
   `user_id` foreign key. Photo blobs become `photo_url` columns
   pointing at `/volume1/docker/tmfcloset/photos/<user_id>/<uuid>`.
3. Document in `server/SCHEMA.md` (new file).
4. **No production change in day 1** — it's design + docs only.

Days 2-3: scaffold `server/` directory with Express + better-sqlite3
+ JWT auth + bcrypt + multer. Containerize. Deploy to NAS. Cloudflare
Tunnel routes api.tmfcloset.com → container.

Days 4-5: implement endpoints. Build migration tool. Test end-to-end.

### Option B — Phase 2C (search modal)

One ship, ~150 lines new module + CSS + a few HTML hooks. Wires the
placeholder `⌕` button to a modal that:
- Opens on click (or `/` keyboard shortcut)
- Has a single text input that live-filters
- Searches across closet items (name, brand, color, category, size,
  notes) + wishlist + outfits + saved notes
- Shows results grouped by type with click-through to the item's
  detail modal or page

Implementation: new `js/search-r1.js` + new `<div id="searchModal">`
in index.html + CSS in style-guide-r1.css. Bundle rebuild needed.

### Option C — Quality polish (~30 min)

- Move theme toggle into account dropdown
- Add `<meta name="mobile-web-app-capable" content="yes">`
- Add a tiny `favicon.ico` (or stub it via `<link rel="icon" href="data:,">`)
- Optionally retire the dead theme `theme-bw` / `theme-warm` /
  `theme-dark` if Tiffany doesn't use them anymore

---

## Critical gotchas (read before editing)

### The Edit-tool truncation footgun

This bit me HARD today on the v48 → v49 cycle. The Edit/Write tools
intermittently write a file at the same byte count as the prior
version, dropping the tail. CLAUDE.md warns about this for `.js`
files; I learned today it also happens for `index.html` after a
large insertion + a follow-up edit on the same file.

**Recovery pattern that works:**
1. `head -n <last-clean-line>` to keep the surviving prefix.
2. `cat > /tmp/tail.html << 'EOF' …` heredoc with the missing tail.
3. `cat head tail > index.html`.

**Prevention pattern for tomorrow:** for any HTML insertion >20 lines
on this repo, use `python3 -c` via bash with `text.replace()` instead
of the Edit tool. The Python str.replace is reliable; the Edit tool
isn't. Pattern:

```bash
python3 << 'PYEOF'
from pathlib import Path
p = Path('index.html')
text = p.read_text()
old = 'unique anchor text in the file'
new = 'replacement text'
assert old in text and text.count(old) == 1
p.write_text(text.replace(old, new))
PYEOF
```

For `.js` source files, always run `node --check js/<file>.js` after
any non-trivial edit. The bundle build fails fast on syntax errors,
but truncated tails parse as "Unexpected end of input."

### Deploy flow (unchanged from v43 era)

```
cd "C:\Users\admin\Documents\Claude\Projects\Virtual Closet"
.\DEPLOY.ps1 "<commit message>"
```

Pushes from `hugo-site/`. Source files at the project root are NOT
served — they're the working copy that gets synced into `hugo-site/`
before push. **Always sync after every change:**

```bash
cp index.html style-guide-r1.css sw.js manifest.json hugo-site/
cp dist/app.bundle.js hugo-site/dist/app.bundle.js
```

After push, Tiffany has to clear the service worker:
DevTools → Application → **Storage → Clear site data** (with
**IndexedDB OFF**) → reload.

### Bundle build template (paste-ready)

```bash
cd "/sessions/<session>/mnt/Virtual Closet"
node --check js/<any-modified-files>.js && echo OK
python3 << 'EOF'
import time
from pathlib import Path
ROOT = Path('.'); DIST = ROOT/'dist'; DIST.mkdir(exist_ok=True)
SOURCES = [
  'js/data-r9.js','js/utils-r1.js','js/colorpick-r1.js','js/auth-r1.js','js/db-r3.js',
  'js/closet-r10.js','js/wear-r1.js','js/bgremove-r1.js','js/lookbook-r1.js','js/style-dna-r1.js',
  'js/rotation-r1.js','js/resale-r1.js','js/outfits-r7.js','js/color-pairs-r1.js','js/browse-r3.js',
  'js/app-r10.js','js/recover-r1.js','js/audit-r1.js','js/insights-r7.js','js/wishlist-r6.js',
  'js/girlmath-r3.js','js/trip-r1.js','js/compare-r1.js','js/outfit-feedback-r1.js','js/flatlay-r1.js',
  'js/ratings-r1.js','js/capsule-r1.js','js/returned-r1.js','js/daily-r1.js','js/slideshow-r1.js',
  'js/notes-r1.js','js/receipts-r1.js','js/returns-due-r1.js','js/shop-r1.js','js/top10-r1.js',
  'js/cartimport-r1.js','js/emailimport-r1.js','js/fit-r1.js','js/theme-r2.js','js/github-sync-r1.js',
  'js/drawer-r1.js','js/scheme-r1.js',
]
out = [f'/* TMF Closet bundle — built {time.strftime("%Y-%m-%d %H:%M:%S")} */',
       f'/* Sources (in order, {len(SOURCES)}): {", ".join(SOURCES)} */', '']
for rel in SOURCES:
    out.append(f'\n/* ===== {rel} ===== */'); out.append((ROOT/rel).read_text())
(DIST/'app.bundle.js').write_text('\n'.join(out))
print(f'Wrote {(DIST/"app.bundle.js").stat().st_size} bytes, {len(SOURCES)} sources')
EOF
node --check dist/app.bundle.js && echo BUNDLE OK
```

The two new sources at the end (`drawer-r1.js`, `scheme-r1.js`) are
already in this list — don't drop them on the next build.

### Cache-buster bump pattern

Every ship that touches CSS or JS needs three bumps:

1. `index.html`: `style-guide-r1.css?v=NEW_MS_TIMESTAMP`
2. `index.html`: `dist/app.bundle.js?v=NEW_MS_TIMESTAMP` (only if bundle changed)
3. `sw.js`: `const CACHE_NAME = 'tmfcloset-vNN';` (increment NN)

Today's pattern was sequential 1778250000000 → 1778260000000 → ...
→ 1778300000000 (~10M ms apart, fine for human-readable). Tomorrow
you can use `int(time.time() * 1000)` for an actual current
timestamp.

---

## File map of today's changes

```
Virtual Closet/                              ← project root (working copy)
├── HANDOFF-v51.md                           ← this file
├── HANDOFF-v43.md                           ← yesterday's, still useful
├── CLAUDE.md                                ← long-term pickup brief (v43 era — TL;DR is stale, body context still valid)
├── PROJECT-LOG.md                           ← long log (Phase 34 / 34A / 34B = today's big entries)
├── DEPLOY.ps1                               ← deploy script (unchanged)
├── index.html                               ← MAJOR CHANGES — top header + drawer + page hero + login redesign + brand renames
├── manifest.json                            ← name + short_name renamed
├── sw.js                                    ← cache prefix renamed, style-guide-r1.css added to SHELL
├── style-guide-r1.css                       ← NEW FILE — palette + typography + 8 schemes + login + nav + drawer + page hero (745 lines)
├── lookbook/index.html                      ← brand renames only (no layout changes)
├── dist/app.bundle.js                       ← rebuilt with 42 sources (added drawer-r1.js + scheme-r1.js)
├── js/
│   ├── drawer-r1.js                         ← NEW — drawer toggle, account dropdown, click-proxies for Sign Out / Export / Import
│   ├── scheme-r1.js                         ← NEW — per-route scheme + page-hero text via hashchange
│   └── (everything else unchanged)
└── hugo-site/                               ← all of the above mirrored, pushed to GitHub Pages
```

**Pre-Phase-2 versions of the above are recoverable from git history
in `hugo-site/`** if anything needs to be rolled back. The legacy
`.sidebar` element is still in the DOM (just `display: none`), so a
panic rollback is "remove the `.sidebar { display: none }` rule and
the schemes; sidebar comes back."

---

## Tiffany context (unchanged)

- **Tiffany Foster** (`tmquinones` on GitHub, `cqtq2025@gmail.com`).
- Not a developer. Keep guidance terse and concrete: exact PowerShell
  commands, exact button labels, exact paths.
- She runs commands from PowerShell. JS goes in DevTools console (F12).
- DevTools may show "Don't paste code into the DevTools Console..." —
  she can type `allow pasting` once to unlock it.
- She picked the v1 palette (sage + wood) over v2 (deeper sage + brass).
  All caps eyebrows preferred. Editorial / warm-organic aesthetic
  (Coastal & Co + Waldor & Co + the architecture moodboard).
- Prefers visual variety per page (multi-scheme is locked, all 8
  schemes assigned to specific routes).

---

_Written 2026-05-07 evening, end of v51 ship._
