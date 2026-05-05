# CLAUDE.md — Virtual Closet pickup brief

> Read this top-to-bottom before touching anything. It is the "what
> happened, what's next" handoff between Claude sessions for Tiffany's
> Virtual Closet project.
>
> Authoritative files in this repo:
> - `PROJECT-LOG.md` — long-form running build log (every meaningful change
>   gets appended here). Always update it after non-trivial work.
> - `HANDOFF.md` — earlier handoff, still useful for repo orientation.
> - `WORK-TODO.md` — running open-task list.
> - This file (`CLAUDE.md`) — short, current "where we left off" snapshot.

---

## TL;DR for the morning

**Project:** Virtual Closet — static HTML/CSS/vanilla JS PWA, IndexedDB
storage, deployed to GitHub Pages at
`https://tmquinones.github.io/virtual-closet/`. The repo that GitHub Pages
serves is `hugo-site/` inside this folder. Everything outside `hugo-site/`
is the *source* working copy; deploys are a sync + push.

**Last shipped (2026-05-01 night session):**
- Bundle: `dist/app.bundle.js?v=1777689986624`
- Service worker cache: `virtual-closet-v31`
- Auth-gate stash for cart-import (don't write to guest DB before signin)
- Defensive try/catch around `_handleCartImportParam` so a bad payload
  cannot blank the wishlist page
- **Critical fix:** restored `window.renderWishlistView = ...` export in
  `js/wishlist-r6.js` — it had been dropped by an Edit-tool truncation,
  which is why the wishlist was rendering as a blank screen even after the
  bundle was up-to-date.

**Last user signal of the night:** console screenshot showed only the
`apple-mobile-web-app-capable` deprecation warning and a `favicon.ico` 404 —
**no JS errors**. We did not yet confirm the cart import end-to-end on the
live site after the v31 push.

---

## Test fixture — the Varley cart Tiffany was trying to import

The cart she was using to test the bookmarklet contained exactly these two
items. If the cart-import flow is working end-to-end, both should land in
her wishlist after the bookmarklet → signin → import-confirm flow. If
either is missing or has garbled fields, the bookmarklet's `extractName` /
field parsing needs another pass.

| Field | Item 1 | Item 2 |
|---|---|---|
| Name | Davidson Sweat | The Extra Wide Leg Pant 29.5 |
| Brand | Varley | Varley |
| Color | Olive Marl | Olive Marl |
| Size | XS | XXS |
| Price | $138.00 | $138.00 |
| URL | https://www.varley.com/products/davidson-sweat?variant=43897930285229&Color=Olive%20Marl&Size=XS | https://www.varley.com/products/the-extra-wide-leg-pant-295?variant=44936657764525&Color=Olive%20Marl&Size=XXS |

Cart subtotal: **$276.00** (delivery + taxes calculated at checkout).

If she hasn't actually checked out by morning, these are also two pieces
she's interested in — keep them safe.

---

## First things to do in the morning

1. Ask Tiffany whether the wishlist now renders and whether the bookmarklet
   import successfully landed items in her `@tiffany` closet on the live
   site. The expected flow:
   - Click the `+ Add to Closet` bookmark on a Varley / Lululemon / etc. cart
   - New tab opens at `…#/wishlist?cartImport=…`
   - She is signed in (session preserved) → the wishlist page paints,
     prompts to import N items, she clicks OK, items land in her wishlist,
     `?cartImport=…` strips out of the URL.
2. If anything is still off, have her open DevTools (F12) → Console and
   look for `cartImport handler crashed:` — that's the safety-net log line.
3. **Two quick cosmetic console items** still pending:
   - Add `<meta name="mobile-web-app-capable" content="yes">` next to the
     existing `apple-mobile-web-app-capable` in `index.html` (silences the
     deprecation warning)
   - Add a tiny `favicon.ico` (or a `<link rel="icon" href="data:,">` to
     suppress the 404)

---

## How deploy works (don't get this wrong)

- **Live site = `hugo-site/` only.** The git remote is set up inside
  `hugo-site/`, not at the project root. `index.html` and `js/` at the
  project root are just where source code is edited; nothing there is
  served until copied into `hugo-site/`.
- **Source-of-truth files to sync after any code change:**
  - `index.html` → `hugo-site/index.html`
  - `sw.js` → `hugo-site/sw.js`
  - `dist/app.bundle.js` → `hugo-site/dist/app.bundle.js`
  - `editorial.css` → `hugo-site/editorial.css` (when CSS changes)
  - (and `PROJECT-LOG.md` if you updated it)
- **Build the bundle** with the inline Python concat (see template below) —
  the existing `build.py` cannot parse load order from the current
  `index.html` because it now references the bundle, not individual scripts.
  Source order is hard-coded in the inline script.
- **Bump the cache-buster** in two places when shipping JS changes:
  - `index.html`: `<script src="dist/app.bundle.js?v=NEW_TIMESTAMP">`
  - `sw.js`: `const CACHE_NAME = 'virtual-closet-vNN';`
- **Push to GitHub Pages** — the user runs `.\DEPLOY.ps1 "<commit msg>"`
  from PowerShell. That script does `git pull --rebase` then `git push
  origin main` from `hugo-site/`. Do NOT push from anywhere else.
- **After every push, the user must clear the service worker** in DevTools
  (Application → Service Workers → Unregister + Storage → Clear site data,
  IndexedDB checkbox **OFF** so her closet stays). Plain Ctrl+Shift+R is
  not enough because the SW intercepts the bundle request.

### Bundle build template (paste-ready)

```bash
cd "/sessions/<session>/mnt/Virtual Closet"
node --check js/wishlist-r6.js && node --check js/app-r10.js && echo OK
python3 << 'EOF'
import time
from pathlib import Path
ROOT = Path('.'); DIST = ROOT/'dist'; DIST.mkdir(exist_ok=True)
SOURCES = ['js/data-r9.js','js/utils-r1.js','js/colorpick-r1.js','js/auth-r1.js','js/db-r3.js',
'js/closet-r10.js','js/wear-r1.js','js/bgremove-r1.js','js/lookbook-r1.js','js/style-dna-r1.js',
'js/rotation-r1.js','js/resale-r1.js','js/outfits-r7.js','js/color-pairs-r1.js','js/browse-r3.js',
'js/app-r10.js','js/recover-r1.js','js/audit-r1.js','js/insights-r7.js','js/wishlist-r6.js',
'js/girlmath-r3.js','js/trip-r1.js','js/compare-r1.js','js/outfit-feedback-r1.js','js/flatlay-r1.js',
'js/ratings-r1.js','js/capsule-r1.js','js/returned-r1.js','js/daily-r1.js','js/slideshow-r1.js',
'js/notes-r1.js','js/receipts-r1.js','js/returns-due-r1.js','js/shop-r1.js','js/top10-r1.js',
'js/cartimport-r1.js','js/fit-r1.js','js/theme-r2.js','js/github-sync-r1.js']
out = [f'/* Virtual Closet bundle — built {time.strftime("%Y-%m-%d %H:%M:%S")} */',
       f'/* Sources (in order): {", ".join(SOURCES)} */', '']
for rel in SOURCES:
    out.append(f'\n/* ===== {rel} ===== */'); out.append((ROOT/rel).read_text())
(DIST/'app.bundle.js').write_text('\n'.join(out))
print('Wrote', (DIST/'app.bundle.js').stat().st_size, 'bytes')
EOF
node --check dist/app.bundle.js && echo BUNDLE OK
cp index.html sw.js hugo-site/
cp dist/app.bundle.js hugo-site/dist/app.bundle.js
```

---

## ⚠️ The Edit/Write tool truncation footgun

This bit Tiffany at least four times yesterday. The Edit and Write tools
have intermittently been writing files at the **same byte count as the
prior version**, dropping the tail. After every Edit on `js/*.js`,
**always** run `node --check <file>` before bundling. If it fails:

1. `wc -l <file>` to see how much survived.
2. `head -N <file> > /tmp/head.js` to keep the good prefix.
3. Append the missing tail via `cat > /tmp/tail.js << 'EOF' …` heredoc.
4. `cat /tmp/head.js /tmp/tail.js > <file>` and re-check.

The wishlist blank-screen bug was a classic case: an earlier rewrite
dropped the `window.renderWishlistView = function (main) { return
render(main); };` line at the bottom of `wishlist-r6.js`, so the router
quietly did nothing on `#/wishlist`. Always verify the public exports
survived a rewrite.

---

## Cart-import architecture (the new feature)

### The bookmarklet (`js/cartimport-r1.js`)

Setup page lives at `#/cart-import`. It generates a `javascript:` URL the
user drags onto their bookmarks bar. The bookmarklet:

1. Walks every DOM element on the current page (a generic shopping cart).
2. Picks elements that contain **both** an `<img>` and a `$XX.XX` price
   string in their text content.
3. Drops elements that contain a *nested* matching element (so the outer
   container doesn't double-count its kids).
4. Stops at headings like "you might also like" / "frequently bought
   together" so recommendation carousels aren't pulled in.
5. Auto-detects brand from `location.hostname` (Lululemon, Vuori, Alo,
   Patagonia, REI, Athleta, American Eagle, Varley).
6. Base64-encodes the array as `?cartImport=…` and opens
   `tmquinones.github.io/virtual-closet/#/wishlist?cartImport=…` in a new
   tab.

### The receiver (`js/wishlist-r6.js _handleCartImportParam`)

- Reads `?cartImport=…` from the URL **or** from
  `sessionStorage['vc:pendingCartImport']` (the auth-gate stash).
- If `getCurrentUser()` is null, stashes the payload to sessionStorage and
  returns — prevents items writing to the guest DB while the login overlay
  is showing.
- Otherwise: strips param from URL or stash, decodes base64, prompts the
  user, then loops `dbAddWishlistItem` for each item, fetching photos via
  `fetchImageBlob` + `resizeImage` when possible.
- Wrapped in try/catch by `render()` — a malformed payload cannot blank
  the page anymore.

### The signin handoff (`js/app-r10.js`)

After successful signin in `wireLoginScreen()`, if
`sessionStorage['vc:pendingCartImport']` exists, force-route to
`#/wishlist` so the deferred import runs against the user's own DB.

---

## Per-user IndexedDB (don't lose her data)

Each account gets its own IndexedDB keyed by user ID. There's also a
`guest` DB for unsigned-in usage. Migration: `migrateGuestToCurrentUser`
runs after signin/signup if the new account is empty. **Never** call
`indexedDB.deleteDatabase` or anything similar without explicit consent —
that's her actual closet data.

---

## File map (what each thing is)

```
Virtual Closet/                          ← project root (source-of-truth)
├── CLAUDE.md                            ← this file
├── HANDOFF.md                           ← earlier handoff, repo overview
├── PROJECT-LOG.md                       ← long-form build log
├── WORK-TODO.md / WORK-2026-04-30.md    ← daily task notes
├── DEPLOY.ps1                           ← user's deploy script (PowerShell)
├── index.html                           ← shell + login overlay + nav
├── styles.css, editorial.css            ← styles
├── manifest.json, sw.js, build.py       ← PWA + service worker
├── dist/app.bundle.js                   ← built bundle (39 sources)
├── js/                                  ← source modules
│   ├── app-r10.js                       ← router + auth gate + signin handoff
│   ├── wishlist-r6.js                   ← wishlist + cart-import receiver
│   ├── cartimport-r1.js                 ← bookmarklet generator page
│   ├── closet-r10.js, db-r3.js, …       ← the rest
│   └── (older revisions kept for reference, not bundled)
└── hugo-site/                           ← THE GIT REPO (GitHub Pages source)
    ├── index.html / sw.js / dist/        ← copies of root files; updated by sync
    └── .git/                             ← remote: tmquinones/virtual-closet
```

---

## Things on deck (after the cart-import is verified working)

- Cart-import name extraction is greedy — on Varley the captured `name`
  field incl