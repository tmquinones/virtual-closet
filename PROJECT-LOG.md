# Virtual Closet — Project Log

> A running record of decisions, builds, and changes for the Virtual Closet
> website. Most recent updates at the top of each phase. Updated after every
> meaningful change.

## Project goal

A virtual closet website (designed to convert into a mobile app later) that
lets the user catalog clothing pieces, browse/filter them, build outfits by
occasion, and analyze wardrobe spending. Sustainability- and capsule-wardrobe-
oriented; positioned to potential investors as a financial dashboard for a
person's wardrobe.

## Tech choices

- **Static HTML/CSS/vanilla JS** — no framework, no build step. Everything
  runs from `index.html` opened in a browser.
- **IndexedDB** for local-first storage. No server, no cloud — data lives on
  the user's device.
- **Photos** are auto-resized to max 1200px (with a 400px thumbnail) before
  saving, so a 500-piece closet stays well under typical browser quotas.
- **Hash-based router** (`#/closet`, `#/add`, `#/outfits`, `#/build`).
- **Export / Import** via a single JSON file (photos embedded as base64).
  Designed so a folder full of items can be batch-prepared elsewhere and
  loaded in one click.

## File map

```
Virtual Closet/
├── index.html                      Main shell (sidebar + main view container)
├── styles.css                      All visual styling (clean & minimal palette)
├── PROJECT-LOG.md                  This file
├── lululemon-import.json           42-item import file generated from the user's PDF
├── Virtual-Closet-Pitch-Deck.pptx  16-slide investor deck
├── Virtual-Closet-Pitch-Deck.pdf   PDF export of the deck
└── js/
    ├── data.js     Taxonomy: garment types, lifestyles, seasons, occasions, colors
    ├── utils.js    Image resize, blob<->URL, modal, toast, image fetch w/ CORS fallback
    ├── db.js       IndexedDB wrapper: items, outfits, export/import (with progress callback)
    ├── closet.js   Closet view + filters, item detail/edit modal,
    │               Add Item flow (upload, web-search, paste-image, paste-URL),
    │               sequential review walk-through after imports
    ├── outfits.js  Outfit list view + outfit builder with 8 occasion presets
    └── app.js      Router, sidebar count, export/import button wiring,
                    progress overlay shown during long imports
```

## Data model

**Item** (in IndexedDB store `items`)

| field                | type                  | notes                                    |
|----------------------|-----------------------|------------------------------------------|
| `id`                 | number (autoIncrement)|                                          |
| `name`               | string                | optional; falls back to subtype          |
| `garmentType`        | string                | tops, bottoms, dresses, outerwear, shoes, accessories |
| `subtype`            | string                | T-shirt, Jeans, Skirt, Sneakers, etc.    |
| `color`              | string                | one of the COLORS palette                |
| `brand`              | string                |                                          |
| `size`               | string                |                                          |
| `purchaseDate`       | string YYYY-MM-DD     |                                          |
| `purchasePrice`      | number \| null        |                                          |
| `lifestyleCategories`| string[]              | activewear, casual, business, formal, loungewear |
| `seasons`            | string[]              | spring, summer, fall, winter             |
| `tags`               | string[]              | freeform                                 |
| `notes`              | string                |                                          |
| `photo`              | Blob (image/jpeg)     | full-size up to 1200px                   |
| `thumb`              | Blob (image/jpeg)     | thumbnail up to 400px                    |
| `createdAt`          | timestamp             |                                          |
| `updatedAt`          | timestamp             |                                          |

**Outfit** (in IndexedDB store `outfits`)

| field      | type      | notes                                           |
|------------|-----------|-------------------------------------------------|
| `id`       | number    |                                                 |
| `name`     | string    |                                                 |
| `occasion` | string    | church, dinner_date, pickleball, run, casual, loungewear, bjj, business |
| `notes`    | string    |                                                 |
| `itemIds`  | number[]  |                                                 |
| `createdAt`/`updatedAt` | timestamp |                                       |

---

## Build log

### 2026-05-05 — v35: harden email dedupe + cart importer fixes (subsumes v34)

**Trigger:** user reported the email importer was *still* tripling items
in the closet on a fresh Alo Yoga email, AND the cart importer on
aloyoga.com produced duplicates + a "Sam's Club" garbage row + an unrelated
Vuori pant. Diagnostic via DevTools console showed her live bundle was
still `?v=1777946017709` (v33) — v34 had been built locally but never
pushed. So none of v34's fixes were actually running.

Decision: ship v35 as a single deploy that subsumes v34 + adds new
cart-importer hardening + a stronger email-importer dedupe. One PowerShell
push gets her caught up.

**v35 fixes:**

- `js/emailimport-r1.js` — strengthened dedupe.
  - Old logic: dedupe by imageUrl OR (when imageUrl empty) by name+price.
  - Failure mode: Outlook proxies images through different URLs in the
    iframe (`srcdoc`) vs the parent doc's `[role="document"]` re-render,
    so the same logical item gets a different imageUrl per scope and
    survives dedupe.
  - New logic: dedupe by imageUrl AND ALWAYS check a name+price+size+color
    tuple. Either match → drop. Catches the multi-scope URL-mismatch case.

- `js/cartimport-r1.js` — full hardening pass (the original module hadn't
  had any of these fixes yet).
  - **Dedupe** by imageUrl + name+price+size+color tuple, same as the
    email importer.
  - **Payment-widget filter** (`widgetRe`) — drops elements whose text
    contains "apple pay", "google pay", "paypal", "klarna", "afterpay",
    "affirm", "sezzle", "pay with", "sam's club", "powered by", "chat
    with", "customer service", "need help", "live chat", "gift card",
    "newsletter", etc. Kills the kind of false-positive cart row Tiffany
    saw ("SC☐Sam's Club☐☐☐☐" from a payment promo tile).
  - **Tiny-image filter** — skip elements where `img.naturalWidth < 60`
    or `naturalHeight < 60` (icons, payment glyphs, chat avatars).
    Guarded by `naturalWidth > 0` so unloaded images aren't penalized.
  - **Expanded "stop scanning" headings** — added "you may like", "you
    might like", "complete your", "complete your set", "pair (it )?with",
    "style (it )?with", "shop the look", "more from", "wear it with",
    "goes with", "pairs well". Catches Alo's "Pair it with" inline
    recommendation block that was leaking Vuori products into Alo cart
    imports.
  - **URL-encoded payload** — same `+` fix the email importer got in v34.

**Pre-existing issue fixed in passing:** `js/receipts-r1.js` had a
duplicated trailing block (lines 138-143 — same Edit-tool footgun pattern
seen earlier on `slideshow-r1.js`). Truncated to a clean tail at line 137.
This was blocking the bundle build until fixed.

**Build/deploy:**
- Bundle: `?v=1777986950586`, cache `virtual-closet-v35`, 479,563 bytes,
  40 sources.
- Bookmarklet body sizes after v35:
  - Email importer: 6,457 chars (was 6,400 in v34).
  - Cart importer: 3,978 chars (was ~2,200 in v33). Both well under
    bookmarklet length limits.
- Symbol verification in shipped bundle: `widgetRe`, `naturalWidth`,
  `seenKey`, `var dedup` (×2 — one in each importer), and all carried-
  forward v34 symbols (`MARKETPLACES`, `cleanName`, `hennes`,
  `_inferOrderCategory`, `data-purchased`) all present.

**On deck — Option C (next session):**
Per-item `totalPaid` field for tracking actual amount paid (item price +
shipping + tax + marketplace fee). User asked for this after noticing
that a $14 item from a Poshmark email actually cost $23.44 with fees.
Schema change + edit form addition + email importer to capture the
"Total: $X.XX" line + Receipts/Insights to use `totalPaid`. Held to v36
to keep this v35 deploy small and focused.

**Test plan after v35 deploys:**
1. Delete every bogus row from earlier failed imports (the H&M sports
   bras, the Sam's Club garbage, the duplicate Alo dresses/skirts).
2. Re-bookmarklet the same Poshmark email — expect ONE clean row.
3. Re-bookmarklet aloyoga.com cart — expect ONE row per real cart item,
   no Sam's Club, no Vuori (recommendations cut off correctly).
4. Verify with DevTools that bundle is now at `?v=1777986950586`.

### 2026-05-04 (cont. 2) — Email importer v34: dedupe + name + category + brand

User tested v32 against a Poshmark order email for what was actually a Vuori
sports bra. Four problems surfaced:

1. **Four duplicates** of the same item — bookmarklet's `gatherScopes`
   returned overlapping containers (iframe + `[role="document"]` + reading
   pane div) and walked each independently, finding the same row N times.
2. **Greedy item name** — captured "Item: black sports bra with removable
   pads #activewea... Size: S Item price: $14.00" instead of just the
   product name.
3. **Category showed "undefined"** — receiver wasn't inferring
   garmentType/subtype from the name.
4. **Wrong brand "H&M"** — `BRANDS` had `hm:'H&M'` as a substring key,
   matched anywhere "hm" appeared in 8000 chars of `document.body.textContent`
   (which includes Outlook's whole UI shell). The Poshmark email has zero
   brand info anyway — only the user knows it's a Vuori bra.

**v34 fixes:**

- `js/emailimport-r1.js`:
  - Removed `hm:'H&M'` from `BRANDS`. Added `'hennes':'H&M'` instead
    (precise, distinctive).
  - Added `MARKETPLACES = ['poshmark','mercari','depop','ebay','vinted',
    'thredup','grailed','tradesy','vestiaire','therealreal','farfetch
    second life','rebag','fashionphile']`. When detected, `detectBrand()`
    returns `''` so the user fills in the actual product brand via Edit
    rather than getting the marketplace name (or worse, a false-positive
    match).
  - Rewrote `detectBrand`: prioritize sender mailto/title attrs → subject
    heading → iframe email-body text (4000 char cap). Removed the
    document-wide body text scan that produced the H&M false positive.
  - New `cleanName(s)` post-processor: strips `Item:`/`Order:`/`Product:`/
    `SKU:` prefixes, splits on `Size:`/`Color:`/`$`/`Item price:` and
    `#xxx...` suffixes. Wired into the items.push step.
  - Added dedupe pass after collection: by `imageUrl` first (most reliable
    signal — same product photo means same item), falling back to a
    `name|price` tuple when an item has no image. Collapses the multi-scope
    duplication.
- `js/closet-r10.js`:
  - Added `_ORDER_IMPORT_KEYWORDS` table and `_inferOrderCategory(text)`
    helper at module scope (parallel to wishlist's `_inferGarmentType` /
    `_inferSubtype`, kept local to avoid load-order coupling).
  - In `_handleOrderImportParam`, computes
    `[inferredGT, inferredST] = _inferOrderCategory(name)` and stores them
    as `garmentType` / `subtype` on the new closet item. "sports bra" →
    Intimates → Sports bra, etc.

**Build/deploy:**
- Bundle: `?v=1777949305505`, cache `virtual-closet-v34`, 477,230 bytes,
  40 sources. Bookmarklet body is 6400 chars (well under limits).
- Symbol verification in shipped bundle: `MARKETPLACES`, `cleanName`,
  `var dedup`, `hennes`, `_inferOrderCategory`, `inferredGT`,
  `_ORDER_IMPORT_KEYWORDS` all present.

**Test plan after deploy:**
1. Delete the four bogus "H&M" sports bra rows from the closet.
2. Re-bookmarklet the same Poshmark/Vuori email. Expected:
   - Exactly **one** item (not four).
   - Brand field **blank** (Tiffany fills in "Vuori" via Edit).
   - Name = `"black sports bra with removable pads"` (no `Item:` /
     `Size:` / `$` cruft).
   - Category populated as Intimates → Sports bra.
3. Test against a real retailer email (Vuori, Lululemon) to confirm brand
   detection still works for proper order confirmations.

**Edit-tool footgun strikes (3 truncations this patch):**
The Edit tool truncated `js/emailimport-r1.js` twice and `js/closet-r10.js`
once during this session. Each time the tail was lost mid-line. Recovered
by appending heredoc content for the bookmarklet file, and by extracting
the original closet-r10.js content from the previously-bundled
`hugo-site/dist/app.bundle.js` and splicing the missing tail back in.
Verification: ran `node --check` after each edit, plus a final symbol-grep
against the shipped bundle.

### 2026-05-04 (cont.) — Surface Email Importer on Receipts page

User noticed the new Email Importer wasn't discoverable from the Receipts
page where she'd originally asked about email forwarding. Wired it up:

- `js/receipts-r1.js` — replaced the "Coming later: needs server
  infrastructure" muted note with two affordances:
  - A primary `📧 Import from email` button in the page header (right side).
  - A real link in the help card body, replacing the old note, that points
    to `#/email-import` and explains the bookmarklet flow in one sentence.
- Re-bundled (40 sources, 470,891 bytes), bumped cache-buster to
  `?v=1777946017709`, bumped `CACHE_NAME` to `virtual-closet-v33`. Synced
  to `hugo-site/`.

This is the same un-pushed change as the earlier 2026-05-04 entry — they
ship together in one `DEPLOY.ps1` push.

### 2026-05-04 — Email-order importer + Purchased button on wishlist

**Trigger:** user asked for two things:

1. A way to drop items from an Outlook order-confirmation email straight
   into the closet without typing anything.
2. A "Purchased" button on each wishlist row that promotes the wishlist
   item into the closet with a quick price + date prompt.

(A real email-forwarding address — `closet@…` — would need a server, which
the static GitHub Pages setup can't provide. The bookmarklet pattern is the
no-server approximation.)

**What shipped:**

- New module `js/emailimport-r1.js` — setup page at `#/email-import`
  generating a "📧 Order → Closet" bookmarklet. The bookmarklet:
  - Gathers candidate DOM scopes (same-origin iframes via `srcdoc`,
    `[role="document"]`, `[aria-label*="message body"]`, `div[id*="ReadingPane"]`,
    etc.) so it works against both the new Monarch Outlook UI and the
    classic iframe-based reading pane. Falls back to `document.body` if
    nothing else matches.
  - Detects brand from email subject + sender (`mailto:` links, `aria-label`
    sender chips, `[title*="@"]` spans), then falls back to a bounded scan
    of `body.textContent`. Brand dictionary covers ~40 retailers (Lululemon,
    Varley, Vuori, Alo, Patagonia, Athleta, Aerie, Nordstrom, Anthropologie,
    Madewell, Free People, Reformation, Levi's, Sephora, etc.).
  - Walks each scope for image+price pairs (same leaf-detection trick as
    `cartimport-r1.js`: drop containers that wrap another image+price,
    keep the leaf). Caps at 25 items.
  - Encodes the payload as base64 JSON and **URL-encodes** it before
    stuffing into `?orderImport=` (latent bug the old cart-import
    bookmarklet has — `+` in base64 gets corrupted by URLSearchParams; this
    one is hardened against that).
  - Opens `tmquinones.github.io/virtual-closet/#/closet?orderImport=…`.

- `js/closet-r10.js` gained `_handleOrderImportParam(params)`:
  - Reads `params.orderImport` from the router OR a sessionStorage stash
    (`vc:pendingOrderImport`) — same auth-gate pattern as the cart-import
    handler so items don't write to the guest DB while the login overlay
    is up.
  - Strips the param from URL/stash before mutating anything (so a refresh
    can't re-prompt).
  - Confirms with user, then loops `dbAddItem` for each item, fetching the
    photo via `fetchImageBlob` + `resizeImage`. Sets `purchaseDate` to
    today and copies `purchasePrice` from the email's price. Stashes new
    IDs in `vc:lastImportIds` so the existing review banner picks them up.
  - Wrapped in try/catch by `renderClosetView` — a malformed payload can't
    blank the closet (mirrors the wishlist hardening from 2026-05-01).

- `js/app-r10.js`:
  - Added `'email-import'` to `ROUTES` and a `case 'email-import'` to the
    router switch.
  - Signin handoff: after successful signin, if
    `sessionStorage['vc:pendingOrderImport']` is set and the user isn't
    already on `#/closet`, force-route to `#/closet` so the deferred
    import lands in the new user's DB.

- `js/wishlist-r6.js` — Purchased button on each row.
  - New `[data-purchased="…"]` button next to Edit/Delete on every wishlist
    row (`rowHtml`).
  - New `_purchaseFlow(wish)` helper: `openModal` with two inputs (price
    prefilled from `targetPrice`, date defaulting to today). On confirm:
    - Builds a closet payload: `name`, `brand`, `color`, `size`, `url`,
      `notes`, `garmentType`, `subtype`, `purchasePrice`, `purchaseDate`,
      and carries over `photo` / `photo2` / `thumb` from the wishlist
      record.
    - `dbAddItem(...)` → `dbDeleteWishlistItem(wish.id)` → toast + re-render.
    - Stashes the new closet ID in `vc:lastImportIds` so the closet's
      review banner highlights it.
  - Wired in `wireRowActions` via a `[data-purchased]` listener.

- `index.html` — added a sidebar nav entry "📧 Email Importer" pointing
  to `#/email-import` (right after the existing Cart Importer entry).

**Build & deploy:**

- Bundle build SOURCES list updated to include `js/emailimport-r1.js` (39
  → 40 modules). Bundle is 470,626 bytes.
- Cache-buster bumped: `app.bundle.js?v=1777927937835`,
  `CACHE_NAME = 'virtual-closet-v32'`.
- Synced `index.html`, `sw.js`, `dist/app.bundle.js` into `hugo-site/`.
- Verified all expected symbols are in the final bundle:
  `data-purchased`, `_purchaseFlow`, `_handleOrderImportParam`,
  `renderEmailImportView`, `pendingOrderImport`, `case 'email-import'`,
  the `Order → Closet` bookmarklet label.

**Pre-existing bug fixed in passing:** `js/slideshow-r1.js` had a
duplicated trailing block (the export + maybeRender + IIFE close were
present twice, lines 192–201) which would have made `node --check` of the
bundle fail. Truncated the file at line 191 to the single clean tail.
Probably an Edit-tool truncation footgun from a prior session that hadn't
been bundled yet.

**Known rough edges to flag for the user:**

- Marketing emails with carousels of items the user didn't actually buy
  will pull in extras. The bookmarklet doesn't try to distinguish
  "your order" from "you might also like" recommendation blocks within an
  email — that's a v2 polish.
- The Outlook desktop / mobile **app** is not supported — only the
  browser version (outlook.live.com / outlook.office.com / Gmail web).
- Gmail web also works with the same bookmarklet, no separate setup.

**To test:**

1. Push via `.\DEPLOY.ps1 "..."`.
2. After push, clear the service worker (Application → Service Workers →
   Unregister + Storage → Clear site data, IndexedDB checkbox **OFF**).
3. Visit the closet, see new "Email Importer" entry in sidebar.
4. Setup page → drag the bookmarklet to bookmarks bar.
5. Open an order confirmation email in Outlook (browser), click the
   bookmark, confirm import → items appear in closet.
6. On a wishlist row, click the new ✓ Purchased button → fill in price &
   date → item moves to closet.

---

### 2026-05-01 — Cart-importer auth-gate fix (defer until signin)

**Trigger:** user reported the cart bookmarklet successfully detected items
on Varley and showed the import-confirmation prompt, but after clicking OK
and signing in, no items appeared in the wishlist.

**Root cause:** race condition between the cart-import handler and the auth
gate. The bookmarklet opens `github.io/...#/wishlist?cartImport=…`. The
wishlist's `_handleCartImportParam` ran on `DOMContentLoaded`, which fires
*before* the login overlay appears. Items were saving to the **guest**
IndexedDB; the user then signed in to their own (empty) DB and saw nothing.

**Fix:**
- `js/wishlist-r6.js` — `_handleCartImportParam` now checks
  `getCurrentUser()`. If not signed in, it stashes the encoded payload to
  `sessionStorage['vc:pendingCartImport']` and returns. If signed in, it
  also looks for a stashed payload (covers the post-signin replay path).
  URL is only stripped when the param actually came from the URL, so
  re-loads after signin still pick up the stash.
- `js/app-r10.js` — after a successful signin, if
  `sessionStorage['vc:pendingCartImport']` exists and the user isn't
  already on `#/wishlist`, the login handler force-routes to
  `#/wishlist` so the deferred import gets processed.

**Bundle:** `dist/app.bundle.js?v=1777688944914`. Cache `virtual-closet-v28`.

**Verification path for next session:** click bookmarklet on any cart →
sign in → wishlist should auto-open and prompt for import → items appear.

### Phase 1 — Initial MVP

**Trigger:** project goal "create a website that can later be converted into
an app of my virtual closet."

**Decisions agreed up-front via clarifying questions:**

- Features: browse & filter by category, outfit builder, brand & purchase date tracking
- Per-item metadata: basics + brand & size + purchase info + notes & tags
- Visual style: clean & minimal
- Add items via the website (upload through a form)
- Built for ~500 pieces, including shoes
- Two-tier categories: garment type + lifestyle category
- Outfit-builder occasions: church, dinner date, pickleball, run, casual,
  loungewear, BJJ, business
- Desktop-first, mobile later

**What got built:**

- `index.html`, `styles.css`, and the six-file `js/` module set
- Closet view with search + 7 filter selects (category, type, lifestyle, season, color, brand, sort)
- Item detail modal with edit & delete
- Add Item view: drag/drop or click-to-upload, batch walk-through for many photos
- Outfit builder: name + occasion + selectable item picker + ordered outfit slots
- Outfits list view with 4-thumbnail preview cards
- Export & Import backup (JSON, photos embedded as base64)

**Verification:** headless Chromium test that uploaded a photo, saved an item, opened the detail modal, built and saved an outfit. Zero console errors. One CSS bug found and fixed (`.modal[hidden]` was being overridden by `display: grid`).

### Phase 2 — Lululemon PDF → 42-item import

**Trigger:** user uploaded `Lululemon Clothes.pdf` (108 pages, printed from
the lululemon.com closet/purchases page) and listed 47 specific pages
containing items.

**Approach:**

1. Rendered the listed pages with `pdftoppm` at 200 dpi
2. Extracted embedded JPEGs with `pdfimages` (used as the item photo)
3. OCR'd each page with `tesseract` for product name, color, size, date
4. Built a Python parser (`build_import.py` in scratch) that:
   - Recognized "Color X Size Y Qty Z" and "Added on [Date]" patterns
   - Merged multi-page items (item name on one page, details on the next)
   - Inferred `garmentType` from the product name
   - Mapped Lululemon color names to the COLORS palette
5. Visually verified ambiguous pages (27, 28, 41, 48, 60, 65, 67) where OCR
   couldn't confidently read the name
6. Resized photos to 1200px and base64-encoded into `lululemon-import.json`

**Outcome:** 42 items extracted. Skipped pages 14, 38, 43 as duplicate
secondary views. File size 1.64 MB.

**Caveats called out to user:**

- Page 28 → "Define Long-Sleeve Mini Dress" (visual guess)
- Page 33 → "Align™ Cropped Tank Top" (visual guess)
- Page 67 → "Restfeel Slide / Juicy Peach" (page metadata said "White, 8" but
  photo is clearly peach slides)

### Phase 3 — Web-search-and-paste flow for new items

**Trigger:** user wanted the Add Item flow to "browse the web... and give
photo options."

**Constraint named honestly:** a static site can't query Google Images via
JavaScript (CORS without an API key or backend), so the closest workable
flow is search-in-new-tab + paste-back.

**Built in `closet.js` and `utils.js`:**

- New "Search the web by name" panel on the Add Item view
- Engine selector: Google Images, Bing Images, Lululemon site
- Click "Search →" opens a new tab pre-populated with the query
- A "paste an image URL" field with `Load` button
- Document-level **paste handler** that catches images on the clipboard
  (`Ctrl+V` / `⌘+V` after copying an image from the search results) and
  feeds them into the existing item form
- `fetchImageBlob(url)` helper with a CORS fallback that draws the image to a
  canvas if direct fetch is blocked

**Verification:** headless test simulating both an image-paste event and the
Search button (which correctly opened `google.com/search?tbm=isch&q=...` in a
new tab). Saved item with the pasted image in the closet.

### Phase 4 — Import UX hardening + review walk-through

**Trigger:** user reported the lululemon-import.json wasn't visibly importing,
then later reported "Scuba Oversized zip failed" (the first item in the file).

**Diagnosis & fixes:**

1. **Silent progress** — replaced fire-and-forget toast with a full-screen
   progress overlay (`progress-overlay` in CSS) showing `5 of 42 · Wunder
   Train Tank Top` so the user can see imports actually happening.
2. **Silent failures** — `dbImportAll` now alerts with the specific item name
   that failed, plus a "check the console" hint. Hidden errors no longer slip
   past.
3. **Confirmation dialog** now states the count: "Import 42 clothing items?"
4. **Force-navigation** to `#/closet` after a successful import so a stale
   view can never hide the new items.
5. **Robust photo decoder** — replaced `await fetch(dataUrl).then(r=>r.blob())`
   with a manual `atob` + `Uint8Array` + `new Blob` path. The fetch-based
   version was the suspected cause of the "Scuba" failure (some browsers
   block `fetch()` against `data:` URLs when the page origin is `file://`).
6. **Review-imported walk-through** — after a successful import, the closet
   view shows a banner: `"42 items just imported · Walk through each piece..."`
   with **Review →** and **Dismiss** buttons.
   - Click Review opens the edit modal for each newly imported item in
     sequence with `Reviewing imported items · 41 more after this one`.
   - **Save & Next** advances, **Skip** moves on without changes, **Stop
     reviewing** ends the queue.
   - Newly-imported IDs are tracked in `sessionStorage` so the banner
     reappears if the user navigates away and comes back, and clears when
     they're done.

### Phase 5 — Investor pitch deck

**Trigger:** user requested a pitch deck for investment, optionally
referencing existing virtual closet apps.

**Decisions agreed via clarifying questions:**

- **Brand:** suggest 3 directions (chosen: HANGR, Folde, Worn)
- **Audience:** sustainability-minded shoppers / capsule wardrobe
- **Differentiator:** capsule-wardrobe + spending analysis (cost-per-wear)
- **Stage / ask:** placeholder ($750K used as illustrative)

**Built with `pptxgenjs`. 16 slides:**

1. Title (dark slate, "Wear what you have. Buy what you love.")
2. The Problem (3 stats: 68 garments / 80% unworn / $1,800 wasted)
3. Why Now (sustainability mainstream / cheap image AI / financial-tracking expectation)
4. Our Solution (3 pillars: catalog, surface true cost, build the capsule)
5. Product / Closet (real screenshot from the live app)
6. Product / Outfit Builder (real screenshot, 8 occasion presets called out)
7. Cost-per-wear (illustrative analytics: $0.42/wear top piece, $642 dead inventory, bar chart of category spend)
8. How It Works (Capture → Track → Decide)
9. Market (TAM $1.7T / SAM $420B / SOM $280M)
10. Business Model (subscription → resale fees → brand partnerships)
11. Competition (matrix vs Stylebook, Whering, Cladwell, Indyx)
12. Roadmap (web MVP → mobile beta → AI tagging → resale API)
13. Brand Directions (HANGR / Folde / Worn cards with taglines)
14. Team (founder placeholder + first-four-hires plan)
15. The Ask ($750K pre-seed placeholder + 45/25/20/10 use-of-funds split)
16. Closing ("Less, but better." + contact: cqtq2025@gmail.com)

Color palette: deep slate (`1F2937`) + sage (`5C7A5C`) + terracotta (`C77453`)
with cream cards on white. Header font Georgia, body Calibri.

**Visual QA via subagent:** caught and fixed three issues:
- Slide 7 "$642" overflowing the dead-inventory card (shrunk fonts)
- Slide 11 last table row colliding with the footer caption (tightened row height)
- Slide 15 leftover `$[X]M` placeholder (replaced with concrete $750K and an
  italic note "Figures are illustrative — replace before sending.")

**Exported to PDF** alongside the .pptx.

### Phase 6 — Photo replacement in Edit modal + bad-photo punch list

**Trigger:** user reviewing the imported items and noticed some photos were
wrong (example: Scuba Mid-Rise Wide-Leg Pant).

**Root cause:** 6 of the 47 PDF pages had no embedded JPEG (they were the
"text-only details" pages with no product image rendered above them). The
import script fell back to using the rendered page itself, which is mostly
white space with a few lines of text — useless as a clothing photo.

**The 6 affected items:**

| Page | Item                                                    | Color                              | Size    |
|------|---------------------------------------------------------|------------------------------------|---------|
|  6   | Scuba Mid-Rise Wide-Leg Pant                            | Heathered Core Medium Grey         | XS      |
| 11   | Ventilated Tennis Tank Top                              | White                              | M       |
| 16   | It's Rulu Cropped Half Zip                              | Black Plum                         | XS      |
| 24   | Wunder Train Racerback Tank Top                         | Mini Filigree Lace True Navy       | 8       |
| 29   | lululemon Align™ High-Rise Skirt                        | Polka Flock Black                  | 8       |
| 34   | Nulu High-Neck Mesh-Hem Tank Top                        | Mauve Grey                         | M       |

**Fix shipped:** added a "Replace photo" panel to the Edit modal (and the
review walk-through modal). For any item, the user can now:

- **Choose file…** to upload from disk
- **Drop or click** the photo preview itself — same drag/drop affordance as
  the Add Item flow
- **Search Google Images** — pre-populates the query with the item's name +
  brand + color and opens it in a new tab
- **Paste an image URL** — fetches it (with the same CORS fallback as Add)
- **Paste anywhere in the dialog** with `Ctrl/Cmd+V` — clipboard image goes
  straight to the preview

The new photo only replaces the existing one if the user clicks **Save
Changes**. Cancel / close leaves the item untouched. Resize + thumbnail
happen at save time using the same pipeline as Add Item.

**Verification:** headless test that opened Edit on an item, replaced the
photo via file input, saved, reopened the same item, and confirmed the new
photo persisted (background-image URL changed from before to after).

### Phase 7 — Photo re-extraction + taxonomy expansion

**Triggers (one user message, three asks):**

1. "The photos were on the page before the details" — confirmed: the 6 items
   I marked as "no photo" actually had their image on the *preceding* PDF
   page (the layout split each item across two pages: image on top, text
   continuing onto the next).
2. "Add Long sleeve to type section."
3. "Add a few more colors such as Burgundy, teal, lavender."

**What changed:**

- **`build_import.py`** — `find_image_for_page()` now falls back to page N-1
  when page N has no usable embedded image (or its only embed is < 5KB,
  which usually means a UI icon). The set `IMAGE_FROM_PRECEDING = {6, 11,
  16, 24, 29, 34}` documents the known cases.
- **Master `lululemon-import.json`** regenerated. Photo distribution now
  confirms the fix: page 15 → plum half-zip, page 23 → navy patterned tank,
  page 33 → mauve cropped tank, etc.
- **`photo-fixes/`** — six standalone JPEGs named after the matching items,
  for surgical drag-drop into the Edit modal if the user prefers not to
  re-import the whole file.
- **`js/data.js`** — added `Long sleeve` to the Tops subtypes (between
  T-shirt and Blouse). Expanded the COLORS palette from 18 to 30 entries:
  added Charcoal, Burgundy, Coral, Mauve, Mustard, Sage, Mint, Turquoise,
  Indigo, Lavender, Plum, Magenta. Reordered for visual grouping (warm,
  cool, neutral families together).
- **Color mapping** in `build_import.py` now uses the richer palette —
  "Black Plum" → Plum (was Purple), "Faint Lavender" → Lavender (was
  Purple), "Mauve Grey" → Mauve (was Pink), "Berry Rumble" → Burgundy
  (was Pink). Long-sleeve items now use the new subtype.
- **Verified distribution:** Long sleeve: 6 items. Lavender: 3, Mauve: 3,
  Plum: 3, Burgundy: 1, Coral: 2 — colors that previously all collapsed to
  Pink/Purple now distinguish properly.

**To pick up the corrections:**

If the user already imported the original file, the simplest path is:
1. Delete the closet items (or specifically the 6 affected ones), then
   re-import `lululemon-import.json`. OR
2. Use the Replace Photo button on each affected item and drop in the
   matching file from `photo-fixes/`.

Future fresh imports already use the correct photos.

### Phase 8 — Everyday lifestyle + free-form Color and Type inputs

**Triggers:** "Add lifestyle: Everyday option and option to input manually
the color or top type."

**Changes:**

- **`js/data.js`** — Added `{ id: 'everyday', label: 'Everyday' }` as the
  first entry in `LIFESTYLE_CATEGORIES`. It's the most common bucket so it
  leads the chip row in forms.
- **`js/closet.js` (form)** — Color and Type fields are no longer plain
  `<select>` dropdowns. They're now `<input list="…">` elements paired with a
  `<datalist>` of suggestions (the COLORS palette for color, the category's
  subtypes for type). The user can pick from the dropdown OR type any
  custom value — Crop top, Sapphire, whatever — and it's saved as-is.
- **`wireGarmentTypeChange()`** — now updates the Type field's datalist when
  the category changes, instead of replacing select options.
- **Closet filter dropdowns** — `getAvailableSubtypes()` and the new
  `getAvailableColors()` helpers union the built-in palette with whatever
  custom values exist in the user's items, so a custom color like
  "Sapphire" appears in the filter dropdown right after it's saved.

**Verification:** headless test — added an item with custom color
"Sapphire" and custom subtype "Crop top", checked Everyday lifestyle.
Confirmed:
- Form fields render as `<input>` (not `<select>`)
- Everyday option is present in the lifestyle chip row
- Custom values appear in the item detail view after save
- Custom color "Sapphire" shows up in the closet's color filter dropdown

**Note for future imports:** the `build_import.py` color mapper still maps
known Lululemon color names to the predefined palette (so "Black Plum" still
becomes "Plum"). If you want imported items to use the *exact* Lululemon
color names instead, drop the `map_color()` call and pass the original
string through. The free-form input means any value works.

### Phase 9 — Delete option in review walk-through

**Trigger:** "Add in the option to delete an item while reviewing, some of
the clothing items were duplicated."

**Change:** Added a red **Delete** button between Skip and Save & Next in
`openItemEditForReview()`. Clicking it:

1. Confirms with `Delete "<item name>"? This cannot be undone.`
2. Removes the item from IndexedDB via `dbDeleteItem(id)`
3. Closes the modal, refreshes the sidebar count, and advances to the next
   item in the review queue

The user can now triage duplicates inline while walking through a fresh
import — no need to remember which ones to delete after the review.

**Verified:** headless test imported 42 items, opened review, clicked
Delete on the first → confirmed the queue counter dropped from "41 more
after this one" to "40 more", and the closet count went from 42 to 41 after
stopping. Same Delete button as the standalone Edit modal already had —
this just adds it to the review flow.

### Phase 10 — Multi-source import (Vuori, Abercrombie, Alo Yoga, Depop)

**Trigger:** user dropped 46 PDFs from four sources for processing.

**Source formats — each handled differently:**

| Source       | Files | Layout                                       |
|--------------|-------|----------------------------------------------|
| Vuori        | 14    | Outlook screenshots, 2-3 items per email     |
| Abercrombie  | 5     | Outlook order/exchange emails, 1-3 items     |
| Alo Yoga     | 4     | aloyoga.com order pages (multi-page), 1-5 items |
| Depop        | 23    | Outlook "Here's what you bought" emails, 1 item per PDF |

**Approach:**

1. Rendered every page at 140 dpi.
2. Extracted all embedded JPEGs.
3. Identified product photos by hashing every image and excluding any that
   appeared in 5+ PDFs (those are Outlook UI chrome — sidebar icons, button
   sprites, etc.).
4. Visually inspected each render to compile the item list (name, color, size,
   price, brand) — Tesseract OCR was too noisy due to UI chrome.
5. Mapped each item to its largest unique embedded JPEG (1st item → biggest,
   2nd → 2nd biggest, etc.).
6. Built `multi-brand-import.json`.

**Result:** 74 items, 12 MB. Brand distribution at import:

- Vuori: 35
- Alo Yoga: 16
- Lululemon (via Depop resale): 11
- Abercrombie: 6
- Other resale brands (Buff Bunny, Alphalete, Maaji, Free People, SParms): 6

Verified end-to-end: imported in headless Chromium, sidebar count goes from 0
to 74, no console errors. Items render with photos and category metadata.

**Caveats noted to user:**

- Some Vuori/Alo product photos may be model-shots rather than flat-lay (the
  PDFs had thumbnails). User can swap any photo via the Edit modal.
- Depop entries 10/11 and 19/20 may be partial duplicates from the same item
  (the layout split content across the page).
- Color mapping covers most cases via the expanded palette (Phase 7); any
  uncommon Lululemon/Vuori color names fall through to title-case as a
  custom value (works fine since Color is now a free-form input).

### Phase 11 — Multi-photo gallery + lightbox

**Trigger:** "I want the option to have multiple photos you can click through
to see the photo enlarged or from different angles."

**Data model addition:**

- New `photos` field on items (array of Blobs). The original `photo` field
  is the cover (used in grid thumbnails); `photos[]` holds additional angles.
- Existing single-photo items keep working — the gallery treats `photo` as
  position 0 and any `photos[]` entries as positions 1..n.

**UI additions:**

- **Closet card:** small `▦ 2` badge in the top-right corner shows the photo
  count when an item has more than one. Clean and minimal — stays out of
  the way for single-photo items.
- **Item detail modal:** main image + a strip of clickable thumbnails below.
  Clicking a thumbnail swaps the main; clicking the main image opens the
  lightbox.
- **Lightbox:** full-screen overlay with the photo centered, ‹ › arrow
  buttons, an `n / N` counter, and X close. Keyboard: ←/→ to navigate,
  Esc to close, click outside the image to close.
- **Edit modal:** photo strip with hover controls — `×` to remove a photo,
  `★` to set a non-cover photo as the new cover. The "Add another angle"
  panel uses the existing upload/search/paste/URL flow but now **appends**
  to `photos[]` instead of replacing the cover (set-as-cover is its own
  explicit action).

**Storage round-trip:**

- `dbExportAll()` now serializes the photos array to base64.
- `dbImportAll()` now decodes them back to Blobs on import.
- Backwards-compatible: backups produced before this change still import
  cleanly (just no extra angles).

**Verified end-to-end** — saved an item, opened Edit, added a second photo,
re-opened the item:
- Detail view showed 2 thumbnails
- Card grid showed `▦ 2` badge
- Lightbox opened on click, ←/→ nav worked, counter showed `1 / 2` → `2 / 2`,
  Esc closed cleanly

**Note:** since photos add up, IndexedDB storage grows ~1MB per photo.
Modern browsers allow gigabytes per origin so 500 items × 5 photos each
should still fit comfortably.

### Phase 12 — Multi-user login + per-user closets

**Trigger:** "Please create a login page for the website."

**Decisions agreed via clarifying questions:**

- Multi-user (separate closets per username on this device)
- Login required on every page load (no persistent sessions)
- Visual: clean & minimal app style, login overlay on a dark gradient

**New file: `js/auth.js`**

- `createAccount(username, password)` — username 2–32 chars (letters/digits/.-_),
  password ≥ 4 chars. SHA-256 hash with per-user random salt, stored in
  `localStorage` under `vc:users`. Auto sign-in on success.
- `signIn(username, password)` — reads `vc:users`, hashes the input with the
  stored salt, compares.
- `signOut()` — clears `sessionStorage['vc:currentUser']` and resets the
  cached IndexedDB connection.
- `getCurrentUser()` — returns `{ id, username }` from sessionStorage or null.
- All hashing uses `crypto.subtle.digest('SHA-256')`.

**Per-user IndexedDB:** `db.js` no longer uses a fixed name. `currentDbName()`
returns `virtual-closet-<userId>`, so each user gets a fully isolated database.
`resetDb()` closes any cached connection — called on sign-in/sign-out so the
next query opens the new user's DB.

**Login overlay (`index.html` + new CSS in `styles.css`):**

- Full-screen overlay above the app, dark gradient background
- Centered card: VC mark + brand title + tagline ("Wear what you have. Buy
  what you love."), tab strip, username/password fields, error banner,
  primary action button, footnote
- Tab strip toggles between **Sign in** and **Create account**
- First-time visitors automatically land on the Create account tab
  (detected via `userCount() === 0`)

**Sidebar additions:**

- New `sidebar-user` block under the brand mark — shows `@username` next to
  a **Sign out** button
- Hidden when no session (i.e. while the overlay is up)

**App boot logic (`app.js`):**

- On `DOMContentLoaded`: wire login form → if no `getCurrentUser()`, call
  `showLoginOverlay()` and stop. Otherwise hide overlay and run the router.
- Sign Out reloads the page so the overlay reappears clean.

**Verification (headless):**

- First visit shows overlay with "Create account" defaulted
- Created `@tiffany`, added 1 item, signed out
- Created `@jordan` — closet showed **0 items** (proving DB isolation)
- Signed back in as `@tiffany` — item reappeared
- Wrong password produced the correct error: `Wrong password.`

**Security caveat noted clearly:** this is local-device-only auth. Anyone
with file-system access to the browser profile can read `localStorage` and
the IndexedDB. For real multi-user access (different devices, account
recovery), a server-backed auth service would be needed. The current
implementation is a clean foundation that can plug into a backend later
without UI changes.

### Phase 13 — Up to 5 photos in one Add Item save

**Trigger:** "the website is allowing for multiple photos. However, I can only
upload one at a time, save, and then click back in to add another one. Can
you fix this so I can add up to 5 photos at one time?"

**Old behavior:** dropping multiple photos into Add Item walked through them
one at a time as separate items. Adding angles to one item required save +
re-open + Edit + add another photo.

**New behavior:** dropping multiple photos puts them all on the *same* item.

- Cap of `MAX_PHOTOS_PER_ITEM = 5` (excess photos trigger a toast)
- The form shows a thumbnail strip below the cover preview, with `★` to
  set a different photo as cover and `×` to remove individual photos
- A `+` button at the end of the strip opens another file picker so the
  user can add more before saving (still up to the 5 limit)
- On save, photo[0] becomes `photo` + `thumb`; photos[1..n] become
  `photos[]` (matches the data model from Phase 11)

**Other tweaks:**

- Upload-zone hint changed from "drop many at once and we'll walk through
  them" to "drop up to 5 photos for the same item (front, back, detail,
  etc.)"
- After save, navigate to Closet so the new item is visible with its
  `▦ N` badge, instead of staying on the Add Item screen
- Replaced the `pendingQueue` (multi-item batch) with `pendingFiles`
  (multi-photo single item)

**Verification:** headless test —
- Dropped 3 PNGs, strip showed 3 thumbs + 1 add-more button
- Saved → card showed `▦ 3` badge → detail view rendered 3 gallery thumbs
- Dropped 6 PNGs → capped to 5 with a toast

### Phase 14b — Migration was looking at the wrong DB

User reported "I hard refreshed and nothing was added." Cause: the
pre-login closet was stored under `virtual-closet` (the original DB name
from before per-user DBs shipped), not `virtual-closet-guest`. The
Phase 14 migration only checked the latter.

**Fix:** `migrateGuestToCurrentUser()` now scans a list of legacy DB names
(`['virtual-closet', 'virtual-closet-guest']`) and uses whichever one
actually exists with items. Uses `indexedDB.databases()` where available,
plus a defensive `onupgradeneeded` check that aborts and deletes if the
DB doesn't already exist (so we don't accidentally create empty legacy
DBs). A console log states which legacy name was used: `[migrate] pulling
from <name>`.

Verified: seeded the legacy `virtual-closet` name with 3 items, simulated
the user's "account exists but empty" state, signed in — closet showed 3
items as expected.

### Phase 14a — Self-heal sign-in migration

User had already created their account *before* Phase 14 shipped, so the
sign-up-time migration didn't run. Their account was empty and the guest
DB still held all their data.

**Fix:** sign-in now also runs `migrateGuestToCurrentUser()` — but only if
the just-signed-in account has zero items. That makes it idempotent: empty
account + guest data → migrate; account with data already → skip.

Verified: simulated the user's exact state (account in localStorage but
empty closet, items in guest DB). First sign-in moved 2 items in. Sign out,
sign back in — count stayed at 2, no duplicates.

### Phase 14 — Auto-migrate pre-login closet on first sign-up

**Trigger:** "Link tiffany with the closet I had already created on the
website."

**Why:** Items added before the login system shipped landed in
`virtual-closet-guest` (the database openDB() falls back to when
`getCurrentUser()` is null). When the user creates a real account, that data
needs to come along instead of getting orphaned.

**What it does:**

- New `migrateGuestToCurrentUser()` in `db.js` opens the guest IndexedDB
  read-only, copies all items + outfits into the currently-signed-in user's
  database, remaps `outfit.itemIds` to the new auto-generated item IDs.
- Guest data is preserved (not deleted) so a slip-up is recoverable.
- The login-form submit handler in `app.js` now runs migration
  automatically right after `createAccount(...)` succeeds. On signin (not
  signup), migration is skipped — that account already has its own data.
- A toast confirms the move: "Welcome — moved 116 items and 4 outfits
  from your previous closet."

**Verified end-to-end:**

- Seeded a guest DB with 2 items + 1 outfit referencing both items
- Created account `@tiffany`
- Sidebar showed `2 pieces`, closet rendered both items, Outfits view
  showed the outfit with both items still wired up via the remapped IDs
- Detail modal showed the original item names → confirms data integrity

**What this means for you (Tiffany, in the actual session):** create the
`tiffany` account once and your existing closet (everything you've added
under the unlogged-in state) flows in automatically. Sign in works
normally on subsequent visits.

### Phase 15 — Multi-URL paste in the photo upload flow (2026-04-27)

**Trigger:** User said "The photo upload needs to be changed. I want to also
be able to copy and paste multiple url to add multiple photos."

**Why:** The Add Item URL field was a single-line `<input>` that accepted
exactly one URL. To add several angles for one item from a brand site, the
user had to load one URL, save the item, edit it, load another, save again —
once per angle. The new multi-photo data model (Phase 11) supports up to 5
photos per item, but the upload UI didn't let you stage them in one shot.

**What changed in `js/closet.js`:**

- New helper `_splitUrls(text)` — splits clipboard text on whitespace,
  commas, and semicolons, then keeps only `http(s)://...` tokens. Junk
  text around the URLs (e.g. "see this link: https://...") is discarded.
  Verified with 8 unit tests covering single URL, newline-separated,
  comma-separated, semicolons, mixed-junk, http+https, non-http rejection,
  and empty input.
- The Add Item URL field is now a `<textarea rows="3">` with placeholder
  "…or paste image URLs here (one per line — up to 5). Ctrl/⌘+Enter to
  load." The Edit modal's "Add another angle" panel got the same
  textarea treatment.
- `loadFromUrl()` rewritten to:
  - Run `_splitUrls` over the textarea's contents.
  - Cap the batch at `MAX_PHOTOS_PER_ITEM - pendingFiles.length` so the
    5-photo ceiling is honored even when some photos are already pending.
    If the user pasted more than fits, a toast says "Only loading X of N
    (5-photo limit)".
  - Loop the URLs sequentially (the existing `fetchImageBlob` retries with
    a CORS canvas fallback per URL — running them in parallel would be
    fragile), with the Load button text showing "Loading 1/N…" as it goes.
  - Aggregate failures into a single trailing `alert()` listing each bad
    URL with its error message — successful URLs are still loaded.
  - Branch on `pendingFiles.length === 0`: if it's the first photos for
    this item, call `startBatch(fetched)` (which moves into the form
    stage); otherwise call `appendPhotoToPending(f)` per photo to stack
    them onto an in-progress item.
- The Edit modal's `doLoad` follows the same multi-URL parse, but only
  stages the **last successfully fetched** photo as the new cover —
  the Edit modal's "Add another angle" panel saves one new photo per
  Save Changes, so multi-add isn't a clean fit there. A toast suggests
  "Edit accepts one new photo per save — using the last URL. To add
  several, use Add Item."
- The Enter-key handler on both textareas now requires Ctrl/Cmd+Enter to
  trigger Load, so plain Enter still adds a new line for multi-URL paste.

**Verified:**

- `node --check` clean across all seven JS files.
- `_splitUrls` unit tests: 8/8 PASS (single, newline, comma, semicolon,
  empty, mixed junk, http+https, non-http rejection).
- Simulated `loadFromUrl` flow with stubbed I/O: 6/6 PASS — empty state →
  startBatch with 3 photos; partial state → 2 appends; 7 URLs cap to 5
  with overflow toast; partial fetch failure aggregates into one alert
  without blocking successes; empty input alerts; only 1 slot remaining
  honors the cap.
- End-to-end browser verification still pending (the sandbox doesn't have
  Chrome installed). User will be prompted to confirm in their actual
  browser.

**What this means for you (Tiffany):** on the Add Item page, paste a
column of image URLs (right-click → Copy image address from a search
results page, repeat for each angle, then Ctrl+V into the textarea), hit
Load, and all of them stage into one item with the first as the cover.
Anything that fails to fetch is reported per-URL so you know which to
re-try.

---

### Phase 16 — Copy item action + Swimwear/Lingerie lifestyle (2026-04-27)

**Trigger:** User said "Add an option to copy an item and add bathing
suit/lingerie option to lifestyle."

**Why:** When the user owns the same garment in multiple colors (or two of
the same item), re-entering all the details from scratch is a chore. A
Copy action lets them clone the existing record and just tweak the color.
The wardrobe was also missing a lifestyle bucket for swimwear and
lingerie/intimates — relevant for occasions like beach trips or layering
under formal wear.

**What changed:**

- `js/data.js`: appended `{ id: 'swim_intimates', label: 'Swimwear/Lingerie' }`
  to `LIFESTYLE_CATEGORIES` (placed after Loungewear since both are
  intimate-adjacent). The id is namespaced so it can't collide with
  existing data; `labelForLifestyle('swim_intimates')` returns
  `'Swimwear/Lingerie'`. The Add Item form, Edit modal, and review
  walk-through all read from this constant, so the new chip appears
  everywhere lifestyle is editable, and existing items can be tagged in
  one click.
- `js/closet.js`: added a Copy button to the item detail modal,
  positioned between Edit and Delete. Clicking it calls a new
  `duplicateItem(item)` function which:
  - Strips `id`, `createdAt`, `updatedAt` from the source record so
    `dbAddItem` assigns fresh values via the IndexedDB autoIncrement
    keyPath
  - Appends ` (copy)` to the name (falling back to subtype or garment
    type when the original is unnamed)
  - Preserves the cover photo (`photo`), thumbnail (`thumb`), and the
    `photos[]` extra-angles array as-is — the new record points at the
    same Blob references
  - Returns the new item id
- After a successful copy, the closet view re-renders, the sidebar count
  refreshes, and the duplicate opens in the Edit modal so the user can
  immediately tweak details (e.g. change the color from Black to White).
  A toast confirms the action.

**Verified:**

- `node --check` clean across all seven JS files.
- `duplicateItem` unit tests: 15/15 PASS — new id assigned, name has
  "(copy)" suffix, all metadata fields preserved (brand, color, size,
  lifestyle categories, photos, thumbnails, extra angles, notes, price),
  createdAt/updatedAt are fresh on the clone, original record is
  untouched, name fallback to subtype works when name is empty, and
  copying-a-copy correctly stacks the suffix to "(copy) (copy)".
- Recovery note: the file-edit truncation bug bit again on this change
  (closet.js was chopped from 1188 lines to 1141 mid-statement). Restored
  by extracting the `openItemEditForReview` tail from the JSONL transcript
  and re-appending it. data.js was also truncated mid-`labelForOccasion`
  body and restored. See "Notes / gotchas for future me" below — preserved
  as the canonical workaround.

**What this means for you (Tiffany):** open any item card, click Copy,
and the duplicate slides into the closet immediately while opening in
Edit so you can adjust just the color or whatever varies. For new
swimwear or lingerie pieces, you'll see Swimwear/Lingerie listed in the
lifestyle chips on the Add Item / Edit forms.

---

### Phase 17 — All Seasons option (2026-04-27)

**Trigger:** User said "and all seasons to the seasons options."

**Why:** Many wardrobe staples are season-agnostic — basic black tees,
underwear, watches, bags. Forcing the user to tick all four season boxes
for each year-round piece is busywork and clutters the item detail with
"Spring, Summer, Fall, Winter" when a single tag would say it more
clearly.

**What changed:**

- `js/data.js`: appended `{ id: 'all_seasons', label: 'All Seasons' }` to
  `SEASONS`. It's the 5th entry so the visual order in the form chips is
  Spring → Summer → Fall → Winter → All Seasons.
- `js/closet.js`: the season filter dropdown's catch-all option was
  renamed from "All seasons" to "Any season" so it doesn't visually clash
  with the new "All Seasons" tag entry that the SEASONS map adds below
  it. Filter logic at the top of `applyFiltersAndSort` was updated:
  - When the filter is set to a specific season (e.g. Spring), items
    tagged `all_seasons` ALSO match — so the closet shows everything
    you'd actually wear in spring, including year-round basics.
  - When the filter is set to "All Seasons" itself, only items explicitly
    tagged `all_seasons` show, which is useful for quickly auditing your
    year-round capsule.

**Verified:**

- `node --check` clean across all seven JS files.
- Season filter unit tests: 5/5 PASS — empty filter shows everything;
  filter='spring' returns Spring + All-Seasons + Spring+Summer items;
  filter='winter' returns Winter Coat + All-Seasons; filter='all_seasons'
  returns only the year-round item; filter='fall' returns just the
  All-Seasons item when no fall-specific items exist.

**What this means for you (Tiffany):** mark a black tee, a leather belt,
or a watch as "All Seasons" and it'll show up no matter which season
you're filtering for. You no longer have to tick all four boxes.

### Phase 18 — Fix: photo change in Edit no longer wipes pending field edits (2026-04-27)

**Trigger:** User said "When editing an item, any edits made to the
sections are erased once you change the photo. Changing the photo should
not erase any changes made since opening the item and selecting edit."

**Why:** In the Edit modal, clicking the × on a thumbnail to remove a
photo, or the ★ to set a different photo as cover, called
`closeModal() + openItemEdit(id)` to refresh the strip. That path
re-rendered the form fields from a fresh `dbGetItem()` read — so any
text the user had typed into Name/Brand/Color/Notes (or any chip
toggles) since opening Edit was discarded.

**What changed in `js/closet.js`:**

- New helper `collectFormFieldsSilent()` — same shape as
  `collectFormFields()`, but doesn't `alert()` if the garment type is
  empty or fields are missing. Returns `null` when the form isn't
  rendered, otherwise an object of the current form state. Safe to call
  even when the user hasn't touched anything; it just returns the values
  already in the inputs.
- Both photo-strip handlers (`#editPhotoStrip [data-remove-index]` and
  `#editPhotoStrip .set-cover`) now do this before re-rendering:
  ```js
  const pendingFields = collectFormFieldsSilent() || {};
  ...
  const updates = { ...pendingFields, photo: ..., photos: ... };
  await dbUpdateItem(id, updates);
  ```
  So pending typed edits are committed alongside the photo change. When
  `openItemEdit(id)` then re-renders from fresh DB data, those edits are
  visible because they were just persisted.
- The Choose-File / URL-paste / page-paste paths already used
  `previewNewPhotoInEdit()` which only stages the new photo in
  `editPendingPhoto` and updates the preview's `background-image`. Those
  paths never re-rendered the form, so they were never affected by this
  bug.

**Verified:**

- `node --check` clean across all seven JS files.
- Photo-edit unit tests: 9/9 PASS — bug reproduced under the legacy
  behavior (name/brand reverted to "Original Name"/"Original Brand"
  after remove); after the fix, all pending edits (name, brand, color,
  notes, lifestyle, seasons) are preserved while the chosen photo is
  removed and the rest of the photo strip is intact.

**What this means for you (Tiffany):** type whatever changes you want
in the Edit form, then click × to drop a bad photo or ★ to promote a
different angle to cover — your typed edits are saved alongside the
photo change instead of being thrown away.

### Phase 19 — Intimates & Swim garment type + Socks/Tights subtypes (2026-04-27)

**Trigger:** User said "Add types like: Sports bra, bikini, bra,
bralette, underwear, socks, etc"

**Why:** The taxonomy was missing a home for intimate apparel and
swimwear. Adding all of these as subtypes scattered across "Tops"
(sports bra, bra), "Bottoms" (underwear), "Dresses & One-Pieces" (bikini)
would have muddled those categories — a Closet filter for "Tops" would
mix t-shirts with bras. A dedicated bucket keeps things discoverable and
filterable.

**What changed in `js/data.js`:**

- New garment-type category `intimates_swim` (label: "Intimates & Swim")
  inserted between Outerwear and Shoes in the dropdown order. Subtypes:
  Sports bra, Bra, Bralette, Camisole, Slip, Underwear, Boxers, Briefs,
  Thong, Bikini top, Bikini bottom, One-piece swimsuit, Robe, Pajamas,
  Other.
  - Bikini is split into top + bottom because the user typically owns
    them as separate pieces (and might mix brands/colors).
  - Pajamas added because the existing Loungewear/Sleepwear lifestyle
    didn't have a matching subtype. Sets and standalones both fit here.
- Accessories got two new subtypes — `Socks` and `Tights` — slotted
  after Belt and before Jewelry. Socks felt more at home as an accessory
  than as an intimate; tights live there too since they're often worn as
  a layer under skirts/dresses.
- All seven existing categories preserved exactly as they were —
  taxonomy is additive, no migration needed for existing items.

**How this composes with other recent changes:**

- The new `intimates_swim` garment type pairs naturally with the
  Phase 16 `swim_intimates` lifestyle ("Swimwear/Lingerie"). Tag a
  bikini with both for crisp filtering: garment type filters in the
  closet narrow to the form (top vs bottom), lifestyle filters narrow
  to the use case (swim vs everyday).
- The All Seasons tag (Phase 17) is especially useful here — basic
  underwear, socks, and bras are typically year-round.

**Verified:**

- `node --check` clean across all seven JS files.
- Manual taxonomy spot-check: all seven user-requested types resolve to
  valid subtypes (Sports bra, Bikini top, Bikini bottom, Bra, Bralette,
  Underwear, Socks). Total subtype count is now 61 across 7 categories
  (was 41 across 6).
- The Add Item form, Edit modal, closet filter dropdown, and review
  walk-through all read from `GARMENT_TYPES` directly, so the new
  category and subtypes appear everywhere without further wiring.
- Custom subtypes the user has typed in past sessions are still merged
  in via `getAvailableSubtypes()` — won't conflict with the new
  built-ins.

**What this means for you (Tiffany):** when adding an item, you can
pick "Intimates & Swim" from the category dropdown to get a list with
sports bras, bras, bralettes, underwear variants, and bikinis. Socks
and tights live under Accessories. If anything you actually own isn't
listed yet, you can still type a custom value into the subtype field —
it'll be remembered for future items.

### Phase 20 — "Shop By" view + responsive layout (2026-04-27)

**Trigger:** User shared a Poshmark "Shop by Brand" mobile screenshot
and a video as style references, then said "Add a select by brand
section and have my clothes listed under each type." They picked
photo-overlay tiles + tab toggle as the elements they wanted, and
asked for both desktop and mobile (responsive).

**Why:** The closet view is great when you know what you're looking for,
but for a "what do I have" overview it's a flat grid of every piece.
A Shop By view lets the user enter their wardrobe through brand or
category, see quick visual buckets (with item count), and drill in.
The same data, a different door.

**What got built:**

- New page at `#/browse` (and `#/browse?tab=brand|category[&q=…]`).
  Brand is the default tab. The serif "Shop by" title, underline tab
  toggle, and pill search field all match the Poshmark reference.
- `js/browse.js`: new file, ~150 lines. Pure rendering — no state of
  its own. Reads `dbGetAllItems()`, groups by `brand` or `garmentType`,
  picks the most-recent item with a photo as the tile background,
  outputs photo-overlay tiles in a CSS grid that adapts from 1 to 5+
  columns based on viewport.
- Tile click navigates to `#/closet?<filterKey>=<value>` (e.g.
  `#/closet?brand=Lululemon` or `#/closet?garmentType=intimates_swim`).
  The closet view picks up the URL param and pre-applies the filter,
  so the user lands directly on the filtered grid.
- A `__none__` sentinel value handles "no brand" / "uncategorized"
  buckets — items where the field is empty get their own tile, and
  the closet's filter logic understands the sentinel.
- Sidebar nav got a "Shop By" link (with a `▦` icon), placed before
  Closet — it's now the default landing page.
- `js/closet.js`'s `applyFiltersAndSort` was refactored to use a
  `matchesField(filterVal, itemVal)` helper that handles both regular
  values and the `__none__` sentinel uniformly across brand, color,
  garmentType, and subtype.

**Responsive overhaul:**

- `index.html` viewport switched from `width=1280` (which forced
  desktop scaling on phones) to `width=device-width, initial-scale=1`.
- Added Playfair Display from Google Fonts for serif titles
  ("Shop by", tile labels). Inter still does all the body text.
- `styles.css` got two media queries:
  - `@media (max-width: 768px)`: sidebar collapses to a sticky top
    bar with a hamburger toggle (`≡`) that drops down nav + footer.
    Toolbar filter chips wrap to 50% widths, page header stacks,
    item-detail modal goes single-column, and the modal goes
    full-screen at this width.
  - `@media (max-width: 480px)`: closet grid and tile grid both go
    single-column. Tiles flatten to 16:9 with bigger labels.
- Mobile sidebar toggle wired in `app.js` as a separate
  DOMContentLoaded listener (no awaits, keeps the existing async
  init path clean).

**Verified:**

- `node --check` clean across all eight JS files.
- Browse grouping unit tests: 15/15 PASS — brand grouping (4 buckets
  including "No brand", sorted alphabetically with No brand last,
  correct counts, `__none__` sentinel), category grouping (skips
  empty buckets, includes Uncategorized when relevant, picks newest
  item with a photo as representative), and the `matchesField`
  helper (regular match, mismatch, `__none__` matches missing,
  `__none__` rejects present values).
- Tile representative photo logic correctly skips items without
  photos and picks the next-newest one with one — confirmed via
  test where the absolute newest item had no photo.

**What this means for you (Tiffany):** when you load the site, you
land on a "Shop by" page with two tabs. Brand shows tiles for each
brand (Lululemon, Vuori, Alo Yoga, Abercrombie, Depop) with a
representative photo as the tile background and the count of pieces.
Tap one to drill into the closet pre-filtered to that brand.
Switch to Category to do the same by garment type (Tops, Intimates &
Swim, Shoes, etc.). On mobile, the sidebar collapses behind a
hamburger menu and the tiles stack into a single column. On a tablet
or narrow desktop window, you get a 2-column grid. On a wide
desktop, 4–5 columns. The site is now fully responsive.

### Phase 22 — Competitive market analysis (2026-04-28)

**Trigger:** Tiffany asked for a thorough competitive analysis of the
virtual-closet / wardrobe-management space — pricing, features, where
each rival is positioned, and where her app fits in.

**What was produced:** A markdown report covering 10 competitors
(Stylebook, Whering, Cladwell, Indyx, Save Your Wardrobe, Smart Closet,
Pureple, Acloset, Combyne, Style DNA), with: executive summary,
side-by-side feature/pricing table, per-app cards, Tiffany's
differentiators, pricing benchmarks, and a "where rivals are ahead"
section. Returned inline to the user, not saved as a project file.

**Headline findings:**

- Market is iOS-dominant. Whering and Acloset are the only true
  cross-platform leaders (each claiming 7-10M users). NO competitor
  ships a true web-first / browser-local product — every major rival
  is mobile-only and cloud-backed.
- Pricing clusters around two models: one-time fee (Stylebook $4.99,
  Smart Closet $3.99 + $0.99/mo backup, Style DNA $14.99-$19.99) or
  subscription ($3.99-$24.99/mo for Acloset, $4.99/mo or $39.99/yr for
  Cladwell, $89.99/yr for Pureple, ~£30-£120/yr for Whering Pro).
- Free tiers are increasingly gated: Acloset caps free at 100 items,
  Pureple paywalls multi-wardrobe and packing.
- "Girl Math" cost-per-wear / spending dashboards exist (Indyx, Acloset,
  Stylebook) but none use playful reframing — that angle is open.
- Privacy-first / local-only is a true white-space. Every competitor
  requires an account and stores wardrobe data in the cloud.

**Tiffany's defensible differentiators:** browser-local IndexedDB
(no cloud, no account required), up to 5 photos per item (rivals are
1-photo), aesthetic style profiles + Pinterest deep-linking, "Girl
Math" playful financial reframing, photo-quality audit, multi-user
local accounts on one device.

**Recommended price point if she monetizes:** $4.99 one-time or
$2.99/mo / $24.99/yr — undercut Cladwell/Acloset, premium-anchor
against Stylebook.

---

### Phase 21 — Modern gradient tiles (no item photos) (2026-04-27)

**Trigger:** User said "Instead of having a photo of my clothing piece
make it a modern look with the brand name or photo of nature."

**Why:** The Phase 20 tiles used the user's most-recent item photo as
the tile background. That looked busy on a Shop By overview — every
tile was a different cropped clothing close-up — and didn't tell the
user anything new (they could already see those photos in the closet
grid). Replacing the photos with modern gradient backgrounds and big
serif brand/category names makes the page feel like a curated brand
directory rather than a photo collage.

**What changed in `js/browse.js`:**

- Removed the `_representativePhoto()` helper and the entire photo
  lookup path. Browse view no longer reads `item.photo` at all.
- Added `TILE_GRADIENTS` — a curated pool of 18 nature-evocative
  gradients (coral sunset, ocean deep, forest mist, mountain dusk,
  sand dune, clear sky, lavender field, cherry blossom, tropic water,
  sage meadow, alpine dusk, peach horizon, midnight pine, morning
  rose, spring grass, evergreen, soft sunset, riverbed). Each entry
  is a 2- or 3-stop linear gradient at 135°.
- Added `_hashIndex(str, mod)` — a djb2-style string hash → stable
  index. Same brand always lands on the same gradient.
- Added `CATEGORY_GRADIENTS` — a hardcoded category-id → gradient
  mapping. Garment-type names are short and closed-set, so hashing
  produced collisions (Tops and Bottoms both hashed to "sage
  meadow"). Hand-assigning guarantees all 7 categories + Uncategorized
  get distinct gradients: tops=sky, bottoms=mountain dusk,
  dresses=lavender, outerwear=midnight pine, intimates=soft sunset,
  shoes=sand dune, accessories=evergreen, uncategorized=riverbed.
- `_gradientFor(key, categoryHint)` checks the curated mapping first,
  falls back to the hash pool.
- `_renderTile(group)` now passes `categoryHint` when the filter key
  is `garmentType`, and outputs a `.tile.tile-modern` element with the
  gradient as inline `background:` style. No more `<div class="tile-photo">`.

**What changed in `styles.css`:**

- New `.tile.tile-modern` rules:
  - `.tile-vignette` adds two subtle radial gradients (light from top-left,
    shadow from bottom-right) for depth without losing the flat modern
    feel.
  - `.tile-content` centers the label + count.
  - `.tile-label` is 26px Playfair Display serif, white with a soft
    text-shadow.
  - `.tile-count` is uppercase 11px sans with letter-spacing — feels
    like a curatorial caption rather than a label.
  - `:hover` lifts the tile 3px and casts a soft shadow.
- Mobile (≤480px) variant scales the label to 28px (it gets more
  visual real estate when there's only one column).

**Verified:**

- `node --check` clean across all eight JS files.
- Gradient mapping spot-check: 8 sample brands all produced different
  gradients (Lululemon=spring grass, Vuori=tropic water, Alo Yoga=sage
  meadow, Abercrombie=coral sunset, Depop=evergreen, Aerie=morning
  rose, Free People=soft sunset, "— No brand —"=ocean deep).
- All 8 category gradients are unique by construction.
- Hash stability confirmed: same brand on repeat call → same gradient
  index.

**Recovery note:** The file-edit truncation bug fired four more times
during this change (browse.js once, styles.css twice, plus a label
line drop after a re-truncation). Each one was restored via bash
`head -N` + heredoc append + Python text replacement for the most
fragile insertion. The pattern is now well understood: avoid Edit/Write
on files larger than ~1000 lines whenever possible — prefer
`head -N file > tmp; cat >> tmp << EOF ... EOF; cat tmp > file`, and
verify with `node --check` after every change.

**What this means for you (Tiffany):** open the Shop By page and
each brand tile is now a modern gradient block (sunset, sky, forest,
ocean, etc.) with the brand name in big serif type and the piece
count below. Same brand always gets the same gradient, so Lululemon
will always be your spring-grass green, Vuori always tropic water.
Categories have their own curated palette — Tops sky-blue, Outerwear
midnight pine, Intimates soft sunset, etc. The page now reads like
a high-end brand directory rather than a collage of clothing
close-ups.

### Phase 23 — Capsule synopsis + Athletics preset (2026-04-29)

**Trigger:** user pasted a research blurb on capsule wardrobes (categories,
core principles, starter list) and asked for two things on the Capsule page:
(1) put a brief synopsis explaining what a capsule wardrobe is, and (2) add
an Athletics preset so she can build sport-flavored capsules with different
default amounts per category.

**What changed:**

- **Synopsis card** at the top of `#/capsule` — describes what a capsule
  wardrobe is in two paragraphs of editorial prose, then a two-column
  callout listing common categories (Tops 8–12, Bottoms 5–7, Layers 3–5,
  Dresses 2–3, Shoes 4–7, Accessories & outerwear) and core principles
  (neutral palette, quality over quantity, lifestyle-driven). Card follows
  the existing surface/border tokens so it looks native.
- **Two presets ship out of the box** — Lifestyle (current defaults) and
  Athletics. Athletics targets: Tops 6, Bottoms 4, Outerwear 2, Shoes 2,
  Accessories 2, Dresses 0, Intimates/Swim 0. Tiffany can override any
  count in the editor regardless of preset.
- **Preset picker modal** — clicking "+ New capsule" now opens a modal
  showing the two preset cards side-by-side with their tagline and
  category-count pills. Click one, the editor opens with those targets
  pre-filled.
- **Preset toggle inside the editor** — a small two-button toggle
  (Lifestyle / Athletics) sits below the capsule name field. For new
  capsules, switching preset replaces the default targets (slots are
  preserved into matching categories). For edits, switching preset just
  updates the badge — your custom targets are kept.
- **Preset badge on saved capsule cards** — Lifestyle gets a quiet
  outlined pill, Athletics gets the inverted black pill so sport
  capsules pop out at a glance in the list.
- **Active-only picker** — capsule item picker now passes through
  `activeItems()` so returned pieces don't show up as candidates.

**Files touched:**

- `js/capsule-r1.js` — added `PRESETS` map, `openPresetPicker()`, preset
  toggle in editor, preset backfill on legacy capsules, `synopsisHtml()`
- `editorial.css` — `.capsule-intro*`, `.capsule-preset-badge`,
  `.capsule-preset-grid`, `.capsule-preset-card`, `.capsule-preset-toggle`
- `index.html` — bumped `editorial.css` and `dist/app.bundle.js` cache stamps
- `dist/app.bundle.js` — rebuilt (302,427 bytes)

**What this means for you (Tiffany):** open the Capsule page and you'll
see a new editorial intro card explaining what a capsule wardrobe is,
with the categories and principles laid out cleanly. Click "+ New
capsule" and a modal appears asking whether you want a Lifestyle or
Athletics capsule — picking Athletics opens the editor pre-loaded with
sport-friendly counts (6 tops, 4 bottoms, 2 outerwear, 2 shoes, 2
accessories, no dresses). You can still tweak any number, and when you
save, the capsule shows up in the list with a black "Athletics" badge so
your gym wardrobe stays visually distinct from your everyday capsules.

### Phase 24 — Big-batch feature drop (2026-04-29)

**Trigger:** user asked for seven features in one go: auto-color from photo,
daily outfit logger, monthly slideshow/wear log, personal notes tab,
status-dropdown overhaul (remove Consign, add Plan to sell + Selling),
receipts/invoices tab, and dark mode. She picked "all in one go," with the
daily logger as manual-tag (AI auto-detect deferred to server phase),
receipts as offline-first (email forwarding deferred), and the slideshow
layered (daily photos as covers + tap to see tagged items).

**What changed:**

- **Status dropdown (data-r9.js)** — removed Consign, added Plan to sell
  and Selling. New order: Keep, Donate, Needs repair, Plan to sell,
  Selling, Returned, Sold/gone.
- **Auto color picker (colorpick-r1.js + closet-r10.js)** — new "From
  photo" button next to the Color field in Add Item / Edit. Samples a
  64×64 canvas of the central 50% of the uploaded photo, buckets pixels
  into a 5-bit RGB cube ignoring near-white and near-black extremes,
  then snaps the dominant bucket's RGB to the closest named color in
  COLOR_HEX. Pre-fills the Color field; user can override.
- **Daily logger (daily-r1.js + db-r3.js)** — new `/daily` route. Upload
  a photo of the day, optional caption, then click closet pieces to
  tag them. Each tagged piece also gets a wearLog entry for that date,
  so Insights and other views naturally pick it up. Stored in a new
  `dailyOutfits` IndexedDB store.
- **Monthly slideshow (slideshow-r1.js)** — new `/slideshow` route.
  Layered: pulls both the new daily-outfit photos AND the historical
  wearLog dates from items, groups by month, shows Instagram-style
  cards with mini-thumbs of pieces. Tap a card → modal listing every
  piece worn that day.
- **Personal notes tab (notes-r1.js + db-r3.js)** — new `/notes` route.
  Three-column board: Ideas → In progress → Done. Add via input box,
  click status pill to advance, ✎ to edit, × to delete. Stored in new
  `userNotes` IndexedDB store.
- **Receipts (receipts-r1.js + closet-r10.js Edit form)** — new
  `/receipts` route. Each item now has a `receipt` Blob field
  (PDF or image) attached via the Edit modal's new "Receipt /
  Invoice" field. Receipts list shows brand · piece · price · file
  size with View and Download buttons. Email forwarding noted as
  server-phase work.
- **Dark mode (editorial.css + theme-r2.js + index.html)** — third
  theme `theme-dark` joining B&W and Warm. Inky background (#0e0e10),
  warm-light text, and a brightness/contrast filter applied to photo
  thumbs so white-background catalog shots don't overwhelm. New
  Dark button in the sidebar theme toggle.
- **DB migration to v4** — additive only (added `dailyOutfits` and
  `userNotes` stores). Existing data unaffected.
- **New nav links** — Daily Log, Wear Log, Receipts, My Notes added
  below Build Outfit.

**Files touched/created:**

- new: `js/colorpick-r1.js`, `js/daily-r1.js`, `js/slideshow-r1.js`,
  `js/notes-r1.js`, `js/receipts-r1.js`
- modified: `js/data-r9.js`, `js/db-r3.js`, `js/closet-r10.js`,
  `js/app-r10.js`, `js/theme-r2.js`, `editorial.css`, `index.html`
- bundle: 31 sources, 350KB

**Gotcha:** the Edit/Write tools truncated `closet-r10.js`,
`capsule-r1.js`, `db-r3.js`, `theme-r2.js`, and `editorial.css` at
various points during this phase — same intermittent issue noted in
"Notes / gotchas" below. Recovery: extract the truncated file's
content from the previous bundle, then rebuild the tail via bash
heredoc. Always `node --check` every source individually before
re-bundling.

**What this means for you (Tiffany):** seven new things waiting for
you to try after a hard refresh. Hit the "From photo" button next to
Color when you're adding a new piece. Snap a quick photo on the Daily
Log tab, tap the items you wore, and watch the Wear Log fill in over
time. Drop questions or "wouldn't it be cool if…" thoughts into My
Notes. Attach a receipt to any item from its Edit screen and find
them all again on the Receipts tab. And toggle to Dark in the bottom
sidebar when the bright catalog photos get to be too much in evening
hours.

### Phase 25 — Return-window alerts + Shop/Offer listings (2026-04-29)

**Trigger:** user asked for two more features: "Add a section that inputs
return window and alerts you when you are a week out based on purchase
date. Add Shop/Offer section where I can add some of my clothes to this
section and when in this tab new users they can see this section and
offer an amount or negotiate for an item." She picked Both for alert
placement (banner + dedicated tab), asked for a Google-cited default
return window, and chose "Listing builder + preview" for Shop scope —
the cross-user marketplace deferred until we move off pure browser
storage.

**What changed:**

- **Per-item `returnWindowDays` field** added to data model (Edit/Add
  form). Default if blank: 30 days (industry standard per
  [allreturnpolicies.com](https://allreturnpolicies.com/) survey of
  retailers — Old Navy 45, Lululemon 30, Lulus 21, Nike 60, Kohl's 90,
  REI 365). Returnable status is hidden once status is `returned` or
  `sold`.
- **`/returns-due` route + view** — lists items in their last 7 days
  and the first 7 days past deadline. Each row shows the deadline
  date, days remaining, and a "Mark returned" button that flips
  status with one click.
- **Closet banner** — when items are in the alert window, a red-bordered
  banner appears at the top of `/closet` showing up to 3 of the most
  urgent with a "See all →" link. Clicking a row opens the Returns Due
  page.
- **Sidebar badge** — Returns Due nav link gets a red count pill when
  items are in the alert window. Refreshed on every hashchange.
- **Item detail modal** — adds a "Return" row showing days left, due
  today, or "X days past" depending on status.
- **Shop / Offer listing builder (`/shop`)** — Edit form gets three
  new fields: List for sale (checkbox), Asking Price, Listing
  Description. Items with `forSale = true` show in the Shop tab.
- **Two Shop tabs:**
  - **Your listings** — manage view: edit, unlist, see draft offers
  - **Preview as buyer** — simulated storefront titled "Tiffany's
    Closet" showing what shoppers would see when the marketplace ships
- **Buyer detail modal** — tap any preview card → see full-size photos,
  description, price, "Make an offer" button
- **Offer modal** — buyer enters price + optional message; saved to
  `localStorage` under `vc:shopOffers` so the listing-builder side can
  show "📩 N draft offers" feedback while iterating
- **Two new sidebar nav links** — Returns Due (⏰) and Shop (🛍)

**Files touched/created:**

- new: `js/returns-due-r1.js`, `js/shop-r1.js`
- modified: `js/closet-r10.js`, `js/app-r10.js`, `editorial.css`,
  `index.html`
- bundle: 33 sources, 374KB

**Gotcha (recurring):** five files truncated by Edit/Write during this
phase (closet-r10, app-r10, db-r3, theme-r2, data-r9, editorial.css,
plus index.html itself). The fix workflow is now well-trodden:
extract truncated content from the previous bundle copy, append the
missing tail via bash heredoc, run `node --check` per file before
re-bundling. Added `'returns-due'` and `'shop'` (plus prior phase's
new routes) to the `ROUTES` array in app-r10.js — without that,
parseHash falls back to `'closet'` for unknown routes and the new
tabs silently won't render.

**What this means for you (Tiffany):** add a Return Window value (or
leave blank for the 30-day default) when entering a piece, and items
in their last week show up as a red banner on the Closet page plus a
red badge on the Returns Due tab. Hit "Mark returned" on any row to
move it into the Returned section instantly. For Shop, open any piece,
hit Edit, check "List for sale," set an asking price + a quick
condition note, and it appears in your Shop tab. Click "Preview as
buyer" to see what your storefront would look like — make a fake offer
on yourself to refine the flow. The real cross-user marketplace ships
when we move to a server.

### Phase 26 — Cloud architecture foundation (2026-04-29)

**Trigger:** user asked "I want this to be like depop, facebook, or
poshmark — where friends and family can make their own login and then
we can become friends and see each other's closets, shop section etc."
This is a real pivot from local-first to a social-network architecture
that needs a real backend.

**Decisions made via clarifying questions:**

- **Architecture:** cloud-first rewrite (vs. hybrid or separate app).
  Trial on Supabase free tier; portable to her own server later when
  she orders one.
- **Hosting:** free during trial — Vercel for static frontend +
  Supabase Auth/Postgres/Storage. ~$0/month for 50ish friends.
- **MVP scope:** Friends + Closets + Shop (full Depop-style flow but
  between friends only). Public marketplace deferred.

**Documents shipped (no code changes yet):**

- `ARCHITECTURE-CLOUD.md` — full design doc explaining the migration
  path. Stack table (free tier vs. self-hosted), data model, privacy
  model, API surface, phased rollout (Phase 27 → 32), and the
  mechanics of moving from Supabase to her own server later.
- `supabase/schema.sql` — 263 lines of Postgres DDL: profiles, items,
  friendships, friend_requests, messages, offers, outfits, capsules,
  daily_outfits, user_notes. Plus auto-create-profile-on-signup
  trigger, `are_friends()` helper, friend-request-accepted trigger
  that inserts the friendship, and `updated_at` auto-bumpers.
- `supabase/rls.sql` — 188 lines of Row Level Security policies that
  enforce the privacy model server-side. Items have three visibility
  levels (private / friends / public); friendships visible to both
  parties; messages allowed between friends OR about a public item;
  offers allowed only on for-sale items the buyer can see.
- `supabase/SETUP.md` — Tiffany's step-by-step. Create Supabase
  account → run two SQL files → make 4 storage buckets → grab project
  URL + anon key → send back. ~10 minutes start to finish, no
  developer tools needed.

**Why this approach:**

The data model is intentionally close to the existing IndexedDB shape
so the frontend code changes are mostly "swap the DB call." Three new
columns (`visibility`, `for_sale`, `asking_price` etc.) flow through
to the existing UI without restructuring views. Friendships are
stored as bidirectional rows with a sorted-pair UNIQUE so a query
either side can find them in one lookup.

RLS is doing the heavy lifting for privacy — the frontend can ask
for `select * from items where owner_id = friend_id` and Postgres
will silently filter to just what the requester is allowed to see.
Even if a buggy frontend asks for everything, the database enforces
the rules.

Supabase was chosen over Firebase because it's open-source: when
Tiffany self-hosts on her own server, the same Postgres + storage
stack works locally with no rewrite. Firebase would lock us into
Google.

**Migration path (future phases):**

- Phase 27: wire up Supabase Auth (replace local login)
- Phase 28: sync layer (write items to both IndexedDB and Supabase)
- Phase 29: Friends UI (search, request, accept, list)
- Phase 30: "Friends' Closets" view
- Phase 31: Cross-user Shop + offer messaging
- Phase 32: Notifications (bell icon for new offers/requests/messages)

Each phase is independently shippable. Friends can sign up after
Phase 27, see closets after Phase 30, and negotiate by Phase 31.

**What this means for you (Tiffany):**

The hardest part of this turn is on YOUR side, not in code. Open
`supabase/SETUP.md` and follow it — create a Supabase project, run
two SQL files, make four storage buckets, send me back your project
URL + anon key. That's all I need to start writing the cloud-aware
frontend in our next session. While you're doing that, the existing
local app keeps working exactly as it does today — nothing has been
ripped out or changed yet.

### Phase 27 — Hugo + GitHub Pages publishing track (2026-04-29)

**What:** Stood up a brand-new self-contained Hugo site at `hugo-site/`
that the user can push to GitHub and publish via GitHub Pages — completely
parallel to (and not touching) the existing local SPA. Wrote three
beginner-friendly companion docs and a handoff brief so Claude Code in
VS Code can continue the work.

**Why:** User said "build me a github website that will publish my virtual
closet using hugo" and asked for precise checkbox instructions a beginner
can follow. They also asked, mid-session, for a handoff doc to use in
Claude Code inside VS Code rather than continuing in Cowork.

**Files added (workspace root):**
- `INSTALL-CLAUDE-CODE.md` — Windows-specific install walkthrough for the
  Claude Code CLI, with checkboxes. Covers Node + Git prereqs, npm install,
  first-time login, opening it inside VS Code's terminal, and the optional
  VS Code extension.
- `SETUP-CHECKLIST.md` — eight phases of checkboxes that take the user
  from a fresh Hugo folder to a live site at
  `https://USERNAME.github.io/virtual-closet/`. Includes how to add new
  closet items going forward (drop a photo, write one markdown file, push).
- `HANDOFF.md` — brief for Claude Code; explains repo layout, conventions,
  what's done, what's likely next, and the "don't touch the prior app
  files" rule.

**Files added (`hugo-site/`):**
- `hugo.toml` — config with menu, taxonomies (categories/seasons/colors/
  brands), and a placeholder `baseURL` the user replaces in Phase 5 of the
  checklist.
- `archetypes/default.md` — frontmatter template for new items
  (brand/color/size/season/tags/image).
- `content/_index.md` + sections `categories/`, `seasons/`, `colors/`,
  `outfits/` — every section is populated so the site renders non-empty.
  Sample items mirror real lululemon pieces from `photo-fixes/`.
- `layouts/_default/{baseof,home,list,single}.html` and
  `layouts/partials/{head,header,footer,item-card}.html` — custom theme,
  no upstream Hugo theme used.
- `static/css/closet.css` — clean & minimal aesthetic, Inter + Playfair
  Display, 3:4 card grid, sticky header, responsive nav with pure-CSS
  hamburger.
- `.github/workflows/hugo.yml` — Hugo 0.128.0 build + deploy to Pages on
  every push to `main`. Permissions and concurrency configured per the
  official Hugo + Pages recipe.
- `.gitignore` — excludes `/public/`, `/resources/_gen/`, OS junk, editor
  folders.

**Decisions:**
- One markdown file per closet item; frontmatter is the data model. This
  keeps things human-editable AND scriptable (an importer can dump JSON
  into markdown later).
- Custom theme inline rather than pulling a Hugo theme via submodule —
  fewer moving parts for a beginner, and the user explicitly wanted "clean
  & minimal" which is fast to build directly.
- Keep `hugo-site/` separate from the prior app so the user can push only
  that subfolder to a fresh `virtual-closet` repo without dragging along
  Supabase code, brand JSON imports, or photo-fixes.
- `baseURL` left as a placeholder (`YOUR-USERNAME`) — the checklist tells
  the user to replace it. Avoids guessing their GitHub username.

**Open / next:**
- No local Hugo build verification — the sandbox doesn't have the Hugo
  binary. The workflow has been used widely in this exact form, so risk is
  low, but the user should run `hugo server` per Phase 2 of the checklist
  before pushing.
- Importer for `lululemon-import.json` / `multi-brand-import.json` →
  markdown files: noted in HANDOFF.md as the obvious next ask. Inspect the
  JSON shape first; don't assume.
- Mobile-app conversion path: still open. Hugo's static output + Capacitor
  is one option; exporting the items as JSON to a separate React Native
  app is another.

### Phase 28 — Real wardrobe imported from JSON exports (2026-04-29)

**What:** Built `hugo-site/tools/import-items.py` and ran it. It read both
`lululemon-import.json` (42 items) and `multi-brand-import.json` (74 items),
deduped by (brand, name), and produced **97 unique closet pages** in
`hugo-site/content/categories/` plus 97 photo files in
`hugo-site/static/images/` (7.4 MB total). The three sample placeholder
items (sample-tank-top, sample-skirt, sample-pants) need to be `git rm`'d
on the host because the sandbox couldn't remove files it didn't create.

**Frontmatter the importer emits per item:**
title, brand, color, size, subtype, garmentType, categories (= garmentType
+ subtype + lifestyleCategories), seasons, tags, purchaseDate,
purchasePrice, image. Notes from the prior app go into the body.

**Decisions:**
- Photos decoded from base64 data URIs in the JSON (most ~17KB JPEG;
  seven items only had thumbnail-quality photos and will look soft).
- Slug = `{brand}-{name}` lowercased; `slugify()` handles trademark
  symbols, punctuation, and Depop suffixes.
- `categories` field flattens garmentType + subtype + lifestyleCategories
  into one list — gives Hugo's taxonomy multiple useful term pages
  (`/categories/tops/`, `/categories/tank-top/`, `/categories/activewear/`).
- Importer is idempotent on photos (overwrites) but skips a markdown file
  if a slug collision exists, appending -2, -3, etc. — re-running the
  script safely doesn't duplicate.

**Next ask candidates:**
- A list page that actually browses by garment type (the home page's
  "Categories" tab still goes to a flat directory listing — a custom
  `layouts/categories/list.html` could group by garmentType).
- An "All items" page that paginates everything.
- Outfits importing — both JSON files have `outfits: []` but the source
  data was empty in this export.
- Photo upgrade: re-extract the 7 thumbnail-only items from the prior
  `photo-fixes/` folder if higher-res versions exist there.

### Phase 29 — Pivoted from Hugo gallery to publishing the SPA itself (2026-04-29)

**What:** After the Hugo gallery deployed successfully and the user saw it
side-by-side with her existing local app, she said "Site is not showing up
as the same created" — meaning the hosted site (a basic photo grid) bore no
resemblance to her actual SPA (full sidebar with Insights, Capsule, Outfits,
Girl Math, etc., signed in as @tiffany, 144 pieces). Confirmed via screenshot.

**Decision:** Replace the Hugo gallery on `tmquinones/virtual-closet` with
the existing local SPA. Two-question elicitation confirmed: publish her
existing app, app already runs as a static file. No login required for
the hosted site initially; cloud auth comes "in a week when we transfer
over to our drive".

**Important discovery — Supabase isn't actually used yet:** Audited the
bundle (`dist/app.bundle.js`) — zero references to Supabase or any cloud
service. Auth is local-only via `localStorage` (`vc:users`) and per-user
IndexedDB. The `supabase/` folder is planning material (SETUP.md,
schema.sql, rls.sql) for future cloud migration but nothing is wired in.
So deploying needed no Supabase config at all.

**Files added:**
- `MIGRATE-TO-APP.ps1` — one-shot PowerShell script that removes Hugo
  files, stages SPA files, swaps the workflow, commits, pushes, watches.

**hugo-site/ contents now (after migration push):**
- `index.html`, `styles.css`, `editorial.css`, `apple-touch-icon.png`,
  `manifest.json`, `sw.js`, `icon-192.svg`, `icon-512.svg`,
  `dist/app.bundle.js` — the full SPA, ~400KB total.
- `.github/workflows/hugo.yml` — replaced Hugo build with a plain
  static-deploy workflow (`upload-pages-artifact` from `.`,
  `deploy-pages`, no build step). Filename kept for git history continuity.
- `.gitignore` — excludes `*-import.json`, `photo-fixes/`, OS junk.
- All Hugo files removed: `hugo.toml`, `archetypes/`, `content/`,
  `layouts/`, `static/`, `tools/`.

**Live result:** https://tmquinones.github.io/virtual-closet/ now serves
the real SPA. Verified via web fetch — full sidebar, login overlay, theme
toggle, item modal all present.

**Important caveat for future me:** the hosted site has its own IndexedDB
(per origin = `tmquinones.github.io`) — entirely separate from the user's
local data at `file://...index.html`. Her 144 local items DO NOT
appear on the hosted version. To populate, she uses the app's existing
Export/Import: Export from local → Import on hosted. Or starts fresh
and imports `lululemon-import.json` / `multi-brand-import.json` via the
app's Import button.

**Open / next:**
- "In a week when we transfer over to our drive" — user mentioned this
  as the trigger for adding real cloud auth. Worth asking what "our
  drive" means (custom domain? Google Drive integration? own server?
  the planned Supabase setup from ARCHITECTURE-CLOUD.md?).
- Service worker may serve stale cached assets between deploys; the
  `sw.js` registers blindly. If user reports "the site looks old",
  unregister-and-reload via DevTools is the fix; longer-term, version
  the cache.

### Phase 30 — Wishlist backup + render fixes (2026-04-29)

**Two real bugs found while populating the hosted site.**

**Bug 1: `dbExportAll` never wrote wishlist data.** Even though the IndexedDB
schema has a `wishlist` object store and the wishlist UI works locally, the
backup function only exported `items` and `outfits`. So when the user did
Export-from-local → Import-on-hosted, her wishlist silently didn't transfer
("my wishlist tab is empty"). Patched `js/db-r3.js`:
- `dbExportAll` now reads `dbGetAllWishlistItems()`, base64-encodes any
  Blob photos/thumbs, and emits a `wishlist: [...]` array. Bumped backup
  format `version: 1` → `version: 2`.
- `dbImportAll` now restores `data.wishlist` after items + outfits, with
  the same Blob conversion. Progress total includes wishlist count.

**Bug 2: `blobToUrl` crashed on string photo records.** When the hosted
site tried to render the wishlist, `URL.createObjectURL(stringPhoto)`
threw "Overload resolution failed" because at least one wishlist item had
its photo stored as a base64 data URL string instead of a Blob (origin
unknown — likely an older record from before Phase 11's Blob migration).
Patched `js/utils-r1.js` `blobToUrl`:
- Returns the input as-is when it's a string (data: or blob: URLs work
  directly in CSS background-image and img src).
- Wrapped `createObjectURL` in try/catch with a `console.warn` and empty
  string fallback so any future bad record fails soft.

**Build process:**
- Build.py reads load order from `<script src="js/...">` tags in
  `index.html`, but `index.html` only has the bundle tag now. Re-bundled
  manually using the LOAD_ORDER from the bundle's own header comment.
- Bumped `dist/app.bundle.js?v=` cache-bust on each push so browsers fetch
  the new bundle.

**Open / next:**
- Service worker (`sw.js`) caches assets aggressively. After a deploy, a
  hard-refresh (`Ctrl+Shift+R`) is sometimes still not enough; user has to
  unregister the SW via DevTools. Long-term fix: version the SW cache name
  on each build so the old cache is purged on activation.
- The Export Backup → Import Backup flow assumes all photo records are
  Blobs, but at least one historical record was a string. Worth a one-time
  audit/normalize pass that walks every store and converts string photos
  to Blobs (or vice versa) so the data is internally consistent.

### Phase 31 — Auto-backup to GitHub + public lookbook (2026-04-29)

**What:** Built a daily auto-backup pipeline from the user's local-first
app to her GitHub repo, plus a public read-only lookbook page that her
friends can view from any device. All driven from her browser; no server
involved. Mentor-driven feature with three goals:
1. **Offsite backup (3-2-1 rule)** — durable copy outside her browser
2. **Hands-on GitHub learning** — fine-grained PATs, REST API, commits
3. **Show closet to friends from phone** — public lookbook URL

**New files:**
- `js/github-sync-r1.js` — GitHub Sync settings panel + uploader.
  Stores PAT in localStorage at `vc:githubSync`. Adds a "GitHub Sync"
  button to the sidebar footer that opens a modal with: token field,
  advanced (owner/repo/branch/path), auto-backup checkbox, "Save & back
  up now" / "Back up now" / "Forget token" actions. Auto-trigger fires
  4 seconds after DOMContentLoaded and writes `data/backup-latest.json`
  via PUT /repos/{owner}/{repo}/contents/{path} once per 24h.
- `lookbook/index.html` — standalone public lookbook page. Fetches
  `../data/backup-latest.json` (cache-busted), filters out returned/sold
  items, renders a sticky-header gallery with category tabs (All / Tops
  / Bottoms / etc.) and item cards (photo + name + brand + color + price).
  Click a card to open a detail modal with full meta + notes. Uses the
  existing `styles.css` + `editorial.css` plus a small lookbook-specific
  block to match the desktop app's visual feel.
- `GITHUB-SYNC-SETUP.md` — beginner walkthrough for creating the PAT:
  fine-grained, scoped to ONLY `tmquinones/virtual-closet`, ONLY
  `Contents: Read and write`, 1-year expiration. Plus instructions for
  pasting it into the app and revoking if leaked.

**URLs:**
- Main app (private, requires login): `https://tmquinones.github.io/virtual-closet/`
- Public lookbook (no login): `https://tmquinones.github.io/virtual-closet/lookbook/`
- Backup data file: `https://github.com/tmquinones/virtual-closet/blob/main/data/backup-latest.json`

**Decisions:**
- Single canonical backup file (`data/backup-latest.json`) overwritten
  each day, not a dated history. Simpler. Git history naturally gives
  versioning if she ever wants to roll back.
- Auto-backup throttled to 24h via `cfg.lastBackupAt` timestamp in
  localStorage. The user opening the app multiple times a day doesn't
  spam the repo with commits.
- Detail modal in lookbook is bespoke (not the main app's modal) since
  the main app modal pulls from IndexedDB which the lookbook doesn't
  have. Lookbook reads everything from the in-memory parsed JSON.
- Lookbook hides items with `status === 'returned'` or
  `status === 'sold'` from the public view automatically.
- Cards are click-anywhere; whole card is the click target. Mobile-
  friendly.

**Open / next:**
- The `data/backup-latest.json` file is currently NOT in the repo —
  it'll be created the first time the user clicks "Save & back up now"
  in the GitHub Sync panel. Until then, the lookbook URL shows the
  "Lookbook is empty" empty state with a link back to the main app.
- The lookbook does not (yet) show outfits, capsule, or the rich
  Insights graphs — only the closet grid. User said the visual should
  feel like the desktop app, which it does, but it's NOT a full mirror
  of every tab. If she wants Outfits or Insights publicly viewable
  later, those are additive scope.
- PAT expires after 1 year. The error "Bad credentials" in the app's
  backup attempts is the signal to renew. Worth a polish pass: show a
  banner in the GitHub Sync panel when `lastError` includes "Bad
  credentials" with a one-click "Open GitHub to renew" link.

### Phase 27 — Capsule refinements: Tops split, broader pickers, multi-select up to 30 (2026-04-29)

**Trigger:** user pointed out four real friction points after using the
Capsule feature: (1) Tops should subdivide by sleeve length so you can
target each independently, (2) Outerwear was empty for her because all
her layering pieces are tagged as Tops, (3) Intimates & Swim should
let her pull from the whole closet because bras/swim might be tagged
anywhere, (4) clicking one item at a time to fill a Capsule is tedious
when she has 30+ to add. She also asked me to start a forward-looking
work backlog file.

**What changed:**

- **`WORK-TODO.md`** created at the project root — companion to
  PROJECT-LOG.md. Backlog tracks capsule refinements (now done),
  cloud/social rollout phases, NAS deployment prep, and smaller
  polish ideas. PROJECT-LOG keeps the historical record; WORK-TODO
  is what's next.
- **Tops split into three categories** in the capsule data model:
  `tops_long`, `tops_short`, `tops_tank`. Each has its own target
  count and picker. Lifestyle preset defaults: 2/2/1. Athletics
  preset: 1/3/2 (more short sleeve + tank for sport).
- **Outerwear picker now pulls from outerwear category PLUS layering
  subtypes in tops** — Sweater, Cardigan, Hoodie, Blazer. So a
  cardigan tagged as Tops shows up in the Outerwear picker, fixing
  Tiffany's empty-section problem.
- **Intimates & Swim picker shows the entire active closet** — no
  category filter at all. Bras, swim, anything tagged anywhere.
- **Multi-select picker** — completely rewrote `openItemPicker`. Now
  shows checkboxes on each card with three states: unselected,
  selected (will be added), and selected-remove (red, when you toggle
  off an item already in the capsule). Toolbar shows "N selected /
  max 30" plus "Select all", "Clear", and "Add N →" buttons. Cap of
  30 per round to keep the UI snappy on big closets — toast warns
  when you hit the limit.
- **Backward-compat** — the `CATEGORY_DEFS` map includes a `tops`
  entry (legacy) so older saved capsules with the old single-tops
  key still render properly. New capsules use the split keys.
- **CSS** — added `.picker-checkbox`, `.picker-selected`,
  `.picker-selected-remove` rules with check/cross indicators.

**Files touched:**

- new: `WORK-TODO.md`
- rewrote: `js/capsule-r1.js` (full rewrite via bash heredoc to dodge
  the recurring Edit/Write truncation issue, 585 lines)
- modified: `editorial.css` (picker checkbox states)
- bundle: 33 sources, 384KB

**Gotcha (still recurring):** during this phase data-r9.js and
closet-r10.js got truncated AGAIN by the linter. Fixed both by:
(a) data-r9.js had an orphan `func` line + duplicate `function
activeItems` block — used Python to find from `function isActiveItem`
onward and rewrite cleanly; (b) closet-r10.js had a duplicate
`reviewNext` function appended after the original — truncated at line
1502 to drop the duplicate. The truncation pattern shows up most
reliably on files I edited multiple times in quick succession.

**What this means for you (Tiffany):** open Capsule → New, you'll see
the editor lays out **three Tops sections instead of one**. Click +Add
on Outerwear and you'll see your sweaters/cardigans/hoodies that were
hidden in Tops before — they all show up now. Intimates & Swim picker
shows everything — pick what you want. And anywhere you're adding
items, the picker is now multi-select: tick checkboxes, hit "Add N",
and they all drop into the slot at once. Cap of 30 per round so the
modal stays fast.

### Phase 32 — v42: Color chart counts trust the user's tag (2026-05-06)

Tiffany flagged that the Insights → Colors wheel and counts didn't match
her actual closet — Cream and White were inflated. Root cause was a
priority inversion introduced by v41: `renderColorsTab` checked
`item.paletteColor` (photo-derived, probabilistic) **before**
`normalizeColor(item.color)` (the user's explicit tag). When the v41 Sync
button ran across the closet, photo extraction picked up white-backdrop
pixels, JPEG noise, and skin tones, and tagged plenty of Black/Navy/Olive
items with `paletteColor: "Cream"` or `"White"`. The chart then counted
those items as Cream/White even though the user's `color` field said
otherwise.

Three changes in v42:

1. **insights-r7.js — invert priority.** Use
   `normalizeColor(item.color)` first if it resolves to a canonical
   palette name (in `COLOR_HEX`, directly or via `COLOR_ALIASES`).
   Fall back to `paletteColor` only for brand-specific names like
   "Anthracite" or "Bluestone" that aren't in the alias table. Last
   resort: keep the raw text so unknown colors still appear in the
   legend instead of vanishing.
2. **photo-suggest-r1.js — tighter, smarter extraction.** Lowered the
   near-white filter from sum > 720 to sum > 685 (catches more
   JPEG-blurred backdrops). Added a near-skin filter (warm hue, R > G > B
   with modest spread) so selfie skin doesn't drive paletteColor. And
   instead of mapping just `filtered[0]` to a palette name, the function
   now sums weights per palette name across the whole filtered pool and
   returns the highest-aggregate name — much more robust to noisy single
   clusters.
3. **closet-r10.js — Add Item is conservative.** When the user types a
   canonical color ("Black", "Navy", "Olive", etc.)