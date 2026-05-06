# v41 — Photo-derived `paletteColor` for Insights → Colors

**Shipped:** 2026-05-06 morning
**Bundle:** `dist/app.bundle.js?v=1778080253435`
**Service worker cache:** `virtual-closet-v41`

---

## The problem this solves

Tiffany's Insights → Colors chart had a long "Other" tail full of
brand-specific color names that the canonical palette doesn't recognize:

- `Bluestone / XS`
- `Gravel / XS`
- `Anthracite / XS`
- `White/Twilight Blue`
- `Light Provence Blue`
- `Deep Porcelain Skin Suede`

Each ended up as its own slice instead of rolling up into the right
palette family (Blues, Neutrals, etc.). Manually re-tagging 142 items
would be tedious, and overwriting the original purchase color name
would lose information she might want later (Spanx-specific
"Anthracite" tells her something a generic "Charcoal" doesn't).

---

## The solution

A new optional `item.paletteColor` field stores a canonical palette
name (e.g. `Navy`, `Olive`, `Charcoal`) **derived from the item's
photo**, not from the text tag. The Insights chart prefers
`paletteColor` when present and falls back to the existing
`normalizeColor(item.color)` alias lookup when it isn't.

The user's original `item.color` purchase name stays exactly as
entered. The chart just gets smarter about grouping.

### How `paletteColor` is derived

`window.nearestPaletteColorFromImage(blob)` in
`js/photo-suggest-r1.js`:

1. Run `extractDominantColors(blob, 10)` — canvas quantization at
   80×80 with 4 bits per channel (4096 buckets) returns up to 10
   dominant RGB colors weighted by pixel coverage.
2. Filter out near-white buckets (RGB sum > 720) — these are almost
   always product-shot background.
3. Filter out near-pure-black extremes (RGB sum < 60) — usually
   image artifacts, rare in real garments.
4. Take the dominant remaining bucket and find its nearest match in
   `COLOR_HEX` by squared RGB distance.
5. Return the palette name (`'Navy'`, `'Olive'`, etc.) or `null` if
   nothing usable.

Fully local, no network, no model download. Runs in ~30–50 ms per
image on resized closet photos.

---

## How the user runs the backfill

After deploy, open **Insights → Colors**. Below the pie chart there's
a new card whenever items have photos but no `paletteColor`:

> *X pieces could be re-categorized using their photo.*
>
> *Brand-specific color names ("Anthracite", "Bluestone", "Light
> Provence Blue") get bucketed into canonical palette colors based on
> what the photo actually looks like. Doesn't change the item's color
> name — only the chart grouping.*
>
> **[ Sync colors from photos ]**

Click the button. The handler walks every item with a photo and no
`paletteColor`, calls `nearestPaletteColorFromImage(item.photo)`,
saves via `dbUpdateItem(it.id, { paletteColor })`, yields to the UI
every 5 items so the page stays responsive, then re-renders the
chart with the new groupings. ~5–10 seconds for ~140 items.

The "Sync" card disappears once every photo'd item has a
`paletteColor`.

---

## Auto-tagging on Add Item

`closet-r10.js` Add-Item handler now derives `paletteColor` from the
new photo at save time, so going forward every item added through
the form is canonically grouped automatically — no Sync click needed.

The Edit form does **not** auto-derive (the user might be editing for
reasons unrelated to the photo). If she swaps an item's photo and
wants the chart updated, the Sync button on Insights handles it.

---

## Files touched

| File | Change |
|---|---|
| `js/photo-suggest-r1.js` | New `nearestPaletteColorFromImage(blob)` helper exposed on `window` |
| `js/insights-r7.js` | `renderColorsTab` prefers `paletteColor`; new "Sync colors from photos" card + handler |
| `js/closet-r10.js` | Add-Item handler derives `paletteColor` from new photo before save |
| `dist/app.bundle.js` | Rebuilt with new `?v=1778080253435` |
| `index.html` | Bundle cache-buster bumped |
| `sw.js` | `CACHE_NAME = 'virtual-closet-v41'` |
| `hugo-site/*` | Synced |

No schema migration — IndexedDB items are flat objects, the new
`paletteColor` key is just absent on older items.

---

## Known limitations / what could miss

- **Multi-color garments.** A black-and-white striped shirt's dominant
  color is whichever stripe covers more pixels in the photo — could
  end up tagged as either Black or White. The chart still puts it in
  Neutrals either way, so this rarely matters.
- **Very small photos.** The canvas extraction uses an 80×80 sample.
  Photos already saved at thumbnail-only size with no full photo will
  still work, just with slightly less precision.
- **Lighting-driven mismatches.** A piece photographed in warm
  evening light might come back warmer than its true color (e.g.
  Olive → Brown). Rare in product shots, more common in selfies.
  Acceptable for chart grouping, would matter more for outfit-match
  suggestions (Option B from the photo-suggest plan).
- **Items without a photo.** Skipped entirely — no `paletteColor`
  set, falls back to `normalizeColor(item.color)`.
- **Edit-flow doesn't refresh.** If she changes an item's photo via
  Edit, `paletteColor` stays at its old value. Re-running Sync from
  Insights doesn't help either (it only runs on items with no
  paletteColor at all). v42 candidate: add a "Recompute palette
  color" button on the item detail modal, or auto-refresh on photo
  swap.

---

## Test plan

After `.\DEPLOY.ps1` and unregister-SW + clear-site-data:

1. Open the live site → Insights → Colors. Confirm the "X pieces could
   be re-categorized" card appears at the bottom.
2. Click **Sync colors from photos**. Watch the live progress counter.
   Card and chart should re-render when done.
3. Verify previously-stuck items moved out of "Other": the
   Anthracite XS pieces should land in Neutrals (Charcoal or Black),
   the Bluestone/Twilight Blue pieces should land in Blues
   (Sky Blue / Light Blue / Navy), the Provence Blue pieces in Blues.
4. Open one of those items in the Edit modal. The text "Color" field
   should still show the original brand-specific name unchanged.
5. Add a brand-new item with a clearly-colored photo (e.g. a navy
   sweatshirt). Confirm it shows up in Navy in the chart immediately
   on save, no Sync click needed.

---

## On deck (separate from v41)

- **v42 candidate** — Edit-flow auto-refresh of `paletteColor` when
  photo changes; small "Recompute" button on item detail modal.
- **v42+ candidate (still pending from v40)** — Option C `totalPaid`
  per-item field for true-cost (item + shipping + tax + marketplace
  fee). Tiffany's Poshmark $14 → $23.44 fixture is the trigger.
- **v43 candidate** — Paste paper-receipt importer (Naturalizer
  Brea Mall fixture is captured in CLAUDE.md).
