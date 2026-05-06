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

**Last shipped (2026-05-05 — v35 patch, subsumes uncommitted v34):**
- Bundle: `dist/app.bundle.js?v=1777986950586` (40 sources, 480 KB)
- Service worker cache: `virtual-closet-v35`
- **Email importer dedupe hardened** — now checks imageUrl AND a
  name+price+size+color tuple. Outlook serves the same logical item with
  different imageUrl across iframe vs parent-doc scopes; tuple check
  collapses those.
- **Cart importer hardened** (`js/cartimport-r1.js`):
  - Same imageUrl-or-tuple dedupe as the email importer.
  - `widgetRe` filter drops payment / chat / promo tiles (Apple Pay,
    Google Pay, Klarna, "Sam's Club", "Powered by", etc.).
  - Tiny-image filter (`img.naturalWidth < 60`) drops icons and payment
    glyphs.
  - Expanded "stop scanning" heading regex catches Alo's "Pair it with"
    and similar recommendation-block headings.
  - URL-encoded payload (same `+` fix the email importer got in v34).
- **Pre-existing receipts-r1.js duplicate trailing block fixed** — was
  blocking the bundle build. Same Edit-tool footgun pattern as the
  earlier slideshow-r1.js fix.
- v34's content (MARKETPLACES, cleanName, hennes, _inferOrderCategory,
  Purchased button, etc.) is rolled forward into v35 since v34 was never
  pushed to GitHub. One DEPLOY.ps1 push ships everything.

**Last actually deployed to live (2026-05-04 — v33):**
Just the Receipts-page link patch (📧 Import from email button). The big
import-quality fixes (dedupe, marketplace, cleanName, brand fix, category
inference) were built as v34 but never pushed — they're folded into v35
above and ship in the next DEPLOY.ps1 push.

**Older shipped before that (2026-05-04 — v32):**
- Initial Email Importer module (`js/emailimport-r1.js`), Purchased button
  on wishlist (`js/wishlist-r6.js`), and closet `_handleOrderImportParam`
  receiver. No dedupe, no marketplace detection, no cleanName — those
  came in v34/v35. See PROJECT-LOG.md for the full v32 entry.

**Last shipped (2026-05-05 night — v39):**
- Bundle: `dist/app.bundle.js?v=1778019525086`, cache `virtual-closet-v39`
- **`originalPrice` field on closet items** — optional "Original Price"
  input in Add/Edit form right under "Purchase Price". Captures pre-discount
  retail so Girl Math can compute savings.
- **Wishlist Purchased modal** also takes optional original price.
- **Item detail modal** shows a green "saved $22 (32% off)" badge next to
  Price when both are present, plus a struck-through Original Price row.
- **Girl Math: new "Savings" section** (renders only when at least one
  discounted item exists) showing total saved across all items, original
  total, average discount %, plus a top-10 list of "biggest scores"
  ranked by absolute savings.
- Note: `totalPaid` (Option C — shipping/tax/marketplace fees in the
  true-cost calculation) was NOT shipped in v39. Still on deck for v40.

**Last shipped (2026-05-05 evening — v38):**
- Bundle: `dist/app.bundle.js?v=1778016985207`, cache `virtual-closet-v38`
- **Wear Log Items view** — new `Photos | Items` toggle on `#/slideshow`.
  Items view always uses the 2×2 item-thumb collage cover (never the
  selfie), so days where she didn't upload a selfie look identical to days
  she did. Toggle preference persists in `localStorage['vc:wearlogView']`.
- **Photo-driven daily logging (Option A — color heuristic)** — new module
  `js/photo-suggest-r1.js` extracts dominant colors from the uploaded
  daily photo via canvas quantization (4-bits/channel, 4096 buckets), maps
  each to the nearest palette color in `COLOR_HEX`, then ranks closet
  items by `color` + `family` overlap. Daily editor (`js/daily-r1.js`)
  renders a "Suggested from photo" chip strip above the manual picker —
  one tap to add. No server, no ML model download, runs in <100 ms locally.
  Future iterations: option B (TF.js MobileNet visual similarity) or C
  (cloud vision API once a backend exists).

**Last shipped (2026-05-06 morning — v41):**
- Bundle: `dist/app.bundle.js?v=1778080253435`, cache `virtual-closet-v41`
- **Photo-derived `paletteColor` for the Insights → Colors chart.** Brand
  names like "Anthracite / XS", "Bluestone", "Light Provence Blue", "Deep
  Porcelain Skin Suede" no longer fall into the long "Other" tail. The
  item's photo is run through `nearestPaletteColorFromImage` (new helper
  in `photo-suggest-r1.js`) which extracts dominant colors, drops near-
  white background and near-black extremes, and returns the closest
  canonical palette name (Navy, Olive, Charcoal, etc.). Stored in a NEW
  field `item.paletteColor` — the user's original `item.color` purchase
  name stays untouched.
- **Insights → Colors uses paletteColor first**, falling back to
  `normalizeColor(item.color)` for items without it.
- **"Sync colors from photos" button** appears on the Insights → Colors
  tab below the chart whenever there are items with photos but no
  `paletteColor`. Click runs the backfill in chunks (yields every 5
  items so the UI stays responsive), shows live progress, then
  re-renders the chart.
- **Add Item** automatically derives paletteColor from the new photo, so
  going forward every newly added item is tagged at save time.
- Edit-flow doesn't yet auto-derive — if she wants to refresh paletteColor
  on edited items, the Sync button on Insights handles it. Could be
  added in v42 if useful.

**Last shipped (2026-05-06 morning — v40):**
- Bundle: `dist/app.bundle.js?v=1778076064966`, cache `virtual-closet-v40`
- **Sold items move to Returned & Sold page** — `isActiveItem` in
  `js/data-r9.js` now excludes both `status === 'returned'` AND
  `status === 'sold'`, so sold items vanish from the sidebar piece total,
  closet grid, browse tiles, color pie, outfit pool, and every analytic.
- **Returned page renamed** to "Returned & Sold" (`js/returned-r1.js` +
  sidebar nav entry in `index.html`) and now renders two sections:
  Sold (green corner badge) and Returned (red corner badge). Both fade
  via the existing `.returned-card` opacity 0.65 + grayscale rule and
  un-fade on hover. Tapping any tile still opens the Edit modal so a
  status flip back to "Keep" sends the item back to the closet.

**Still on deck — Option C (now v41) — `totalPaid`:**
Per-item `totalPaid` field for tracking actual amount paid (item price +
shipping + tax + marketplace fee). User asked for this after a Poshmark
$14 item actually cost $23.44 with fees. Schema + edit form + email
importer to capture "Total: $X.XX" + Receipts/Insights to use `totalPaid`.

---

## Outdated content from earlier v32 description (kept for reference)

The list below was the original v32 ship notes; many items are still
accurate but the bookmarklet behavior has been substantially updated
in v34/v35 and is described above. Skim this only if you need historical
context on the initial wiring.

- **Receipts page surfaces the Email Importer** — `js/receipts-r1.js`
  has a `📧 Import from email` button + link.
- **Email Order Importer** — new module `js/emailimport-r1.js`, setup page
  at `#/email-import`. Bookmarklet "📧 Order → Closet" scans an open Outlook
  or Gmail order-confirmation email and fires items into the **closet**
  (not the wishlist) via `#/closet?orderImport=…`.
- **Purchased button on wishlist rows** — `js/wishlist-r6.js` now has a
  `[data-purchased]` button next to Edit/Delete. Click → `_purchaseFlow`
  modal asks for price + date → `dbAddItem` to closet, `dbDeleteWishlistItem`
  removes the wishlist row.
- **`_handleOrderImportParam` receiver** in `js/closet-r10.js` — same
  auth-gate stash pattern as the cart-import handler, wrapped in try/catch
  so a malformed payload can't blank the closet.
- **Signin handoff for orderImport** in `js/app-r10.js` — same as the
  pre-existing cart-import handoff but routes to `#/closet`.
- **`'email-import'` route** added to `ROUTES` in `js/app-r10.js` and a
  matching sidebar nav entry in `index.html` (📧 Email Importer).
- **Pre-existing bug fixed in passing:** `js/slideshow-r1.js` had a
  duplicated trailing block (lines 192–201) that would have failed
  `node --check` on the bundle. Truncated to single clean tail at line 191.

**Last shipped before that (2026-05-01):**
- Bundle: `dist/app.bundle.js?v=1777689986624`, cache `virtual-closet-v31`
- Auth-gate stash for cart-import + defensive try/catch + restored
  `window.renderWishlistView` export after Edit-tool truncation.

**Untested on live:** the email-import flow and the Purchased button were
shipped to source + bundle on 2026-05-04 but **not yet pushed**. After
the user runs `.\DEPLOY.ps1 "..."` and clears the service worker, both
should be exercised end-to-end against:
- A real Outlook (or Gmail) order confirmation email — varley, lululemon,
  vuori, etc.
- An existing wishlist row → ✓ Purchased → confirm modal.

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

## Test results from the v35 deploy (live)

| Scenario | Result |
|---|---|
| Poshmark Vuori sports-bra email → email importer | 1 item (was 4) ✓ Brand blank ✓ Name `black sports bra with removable pads` clean ✓ Category Intimates → Sports bra ✓ Price $14 ✓ Date today ✓ Photo present ✓ |
| Alo Yoga order email → email importer | 3 real items ($148 dress, $128 dress, $78 skirt) ✓ + 1 Outlook in-app ad ($31.38) — Outlook ads not yet in widget filter |
| Wishlist Purchased button | Working — quick price + date modal, item moves to closet, wishlist row removed |
| Receipts page | New `📧 Import from email` button visible in header |

---

## First things to do in the morning

### 1. Cleanup: remove bogus rows from failed v32–v33 imports

Tiffany has these stray rows from before the v34/v35 hardening landed:
- Four "H&M" sports-bra rows (actually one Vuori bra — pre-marketplace-detect)
- Duplicate Alosoft Encore dresses + Airbrush skirts on the wishlist
- "SC☐Sam's Club☐☐☐☐" garbage row (Alo's payment promo tile)
- Vuori Halo Essential Wideleg Pant — scraped from Alo's recommendations,
  she never bought it
- Microsoft Outlook ad row from the latest Alo email import (if she clicked
  OK on the v35 popup before the v36 ad filter ships)

These are best deleted manually from the closet/wishlist UI, not via code.

### 2. Test more retailer emails on the v35 importer

Run a Lululemon, Vuori-direct, and Varley order confirmation through the
email importer. Note any wrong fields — they become the v36 test cases.

### 3. Build v36 (next deploy — see "v36 plan" below)

### 4. Stretch — two cosmetic console items

- Add `<meta name="mobile-web-app-capable" content="yes">` next to the
  existing `apple-mobile-web-app-capable` in `index.html` (silences the
  deprecation warning).
- Add a tiny `favicon.ico` (or a `<link rel="icon" href="data:,">` to
  suppress the 404).

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
- **Bookmarklet refresh after any change to `cartimport-r1.js` or
  `emailimport-r1.js`:** the `javascript:…` URL is frozen at the moment it's
  dragged onto the bookmarks bar. A deploy alone doesn't update existing
  bookmarks. After patches that touch either bookmarklet body, instruct
  Tiffany to right-click the old bookmark → Delete, then re-drag the
  button from `#/cart-import` or `#/email-import`.
- **Version-check truth source** — paste this into the browser DevTools
  Console after any deploy to confirm the new bundle is live:
  ```js
  document.querySelector('script[src*="app.bundle"]').src
  ```
  The `?v=` timestamp must match the one set in `index.html` for the patch
  you just shipped. If it doesn't, either the push didn't go through or the
  service worker is still serving the old version.

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
'js/cartimport-r1.js','js/emailimport-r1.js','js/fit-r1.js','js/theme-r2.js','js/github-sync-r1.js']
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

## v36 plan (next deploy — bundle as one push)

### A. Outlook ad filter (small)

Add to the email importer's `widgetRe` filter:
`microsoft outlook`, `upgrade your account`, `premium outlook`,
`outlook premium`. This catches the Microsoft Outlook in-app promotional
banner that leaked into Tiffany's Alo email import as a `$31.38` row.

### B. Per-item `totalPaid` — Option C (the meaty change)

Tiffany flagged that her Poshmark `$14.00` sports bra actually cost
`$23.44` total ($14 item + $5.99 shipping + $2.05 tax + $1.40 marketplace
fee). The closet currently has only one price field, which is ambiguous
("did she pay $14 or $23?").

- New optional `totalPaid` field on closet items. Existing `purchasePrice`
  keeps the item-listed price untouched.
- **Email importer** — parse the `Total: $X.XX` line from the email body
  and capture it into `totalPaid`. Falls back to `null` when no clear
  total is found.
- **Item edit form** — new "Total paid (with shipping/tax/fees)" field
  directly under "Purchase Price".
- **Wishlist Purchased modal** — same field, prefilled to match the price
  the user just typed.
- **Receipts page header total** — switch to summing `totalPaid` (falling
  back to `purchasePrice` for items that don't have one yet).
- **Insights / Girl Math / cost-per-wear** — switch to `totalPaid` for
  true-cost calculations.
- **One-time backfill** — for items where `totalPaid` is blank, set
  `totalPaid = purchasePrice`. Without this the Receipts running total
  drops to near-zero on first load after the patch.

### Other smaller items

- Cart-import name extraction is greedy — on Varley the captured `name`
  field once included color + size + price + UI text concatenated (e.g.
  `"Davidson Sweat Color: Olive Marl Size: XS $138.00 Move to wishlist"`).
  v34's `cleanName` post-processor handles most of this, but Varley should
  still be re-tested after v35 to confirm.
- See `WORK-TODO.md` for the longer backlog (mobile app conversion, more
  brand support for cart-import, etc.).

---

## User context

- **Tiffany Foster** (`tmquinones` on GitHub, `cqtq2025@gmail.com`).
- Pre-fill her username in URLs / `gh` commands.
- She's not a developer. Keep guidance terse and concrete: exact PowerShell
  commands, exact button labels, exact paths. Avoid jargon.
- She runs commands from PowerShell. JS goes in DevTools console (F12),
  **not** PowerShell.
- Her DevTools may show "Don't paste code into the DevTools Console..." —
  she can type `allow pasting` once to unlock it.

---

_Last updated: 2026-05-05 — end of v35 ship + v36 planning session
(email importer, cart importer hardening, Purchased button, Receipts wiring)._
the item-listed price untouched.
- **Email importer** — parse the `Total: $X.XX` line from the email body
  and capture it into `totalPaid`. Falls back to `null` when no clear
  total is found.
- **Item edit form** — new "Total paid (with shipping/tax/fees)" field
  directly under "Purchase Price" (and under the Original Price field
  added in v39).
- **Wishlist Purchased modal** — same field, prefilled to match the price
  the user just typed.
- **Receipts page header total** — switch to summing `totalPaid` (falling
  back to `purchasePrice` for items that don't have one yet).
- **Insights / Girl Math / cost-per-wear** — switch to `totalPaid` for
  true-cost calculations. Update the v39 savings math too: savings
  should be `originalPrice - totalPaid` once available, since fees eat
  into the actual savings.
- **One-time backfill** — for items where `totalPaid` is blank, set
  `totalPaid = purchasePrice`. Without this the Receipts running total
  drops to near-zero on first load after the patch.

### C. Paste paper-receipt importer (v41 candidate, not v40)

Tiffany pasted a Naturalizer Brea Mall receipt (Kinsley, 7.5 W, $49.99,
2020-02-01). She wants in-store paper receipts to flow through the same
"one paste, one click" pattern as the email importer. Plan:

- New view at `#/paste-receipt` (or a Receipts-page textarea — pick
  whichever is less navigation).
- Heuristic parser that pulls brand (first all-caps line at top), store
  + address, date (regex match), item name (Title Case line near price),
  size pattern (`7.5 W`, `M`, `XS-XXXL`), price (`Item Price $X.XX` or
  `$XX.XX`).
- Output: a pre-filled Add Item form. User reviews + saves. No automatic
  DB write — the parser may misread.
- v41 is the right scope unless v40's `totalPaid` work finishes early.

### Other smaller items

- Cart-import name extraction is greedy on Varley — once `totalPaid` ships,
  retest the Davidson Sweat / Wide Leg Pant 29.5 fixture above.
- See `WORK-TODO.md` for the longer backlog (mobile app conversion, more
  brand support for cart-import, etc.).

---

## User context

- **Tiffany Foster** (`tmquinones` on GitHub, `cqtq2025@gmail.com`).
- Pre-fill her username in URLs / `gh` commands.
- She's not a developer. Keep guidance terse and concrete: exact PowerShell
  commands, exact button labels, exact paths. Avoid jargon.
- She runs commands from PowerShell. JS goes in DevTools console (F12),
  **not** PowerShell.
- Her DevTools may show "Don't paste code into the DevTools Console..." —
  she can type `allow pasting` once to unlock it.

---

_Last updated: 2026-05-05 night — end of v35 → v37 → v38 → v39 day:
email + cart importer hardening, Wear Log Items toggle, photo-driven
daily logging (color heuristic), originalPrice field + Girl Math savings
section. Paste paper-receipt importer drafted (Naturalizer fixture
captured), not yet built. v40 = Option C totalPaid is up next._
