/* Virtual Closet bundle — built 2026-05-06 14:01:04 */
/* Sources (in order): js/data-r9.js, js/utils-r1.js, js/colorpick-r1.js, js/auth-r1.js, js/db-r3.js, js/closet-r10.js, js/wear-r1.js, js/bgremove-r1.js, js/lookbook-r1.js, js/style-dna-r1.js, js/rotation-r1.js, js/resale-r1.js, js/outfits-r7.js, js/color-pairs-r1.js, js/browse-r3.js, js/app-r10.js, js/recover-r1.js, js/audit-r1.js, js/insights-r7.js, js/wishlist-r6.js, js/girlmath-r3.js, js/trip-r1.js, js/compare-r1.js, js/outfit-feedback-r1.js, js/flatlay-r1.js, js/ratings-r1.js, js/capsule-r1.js, js/returned-r1.js, js/daily-r1.js, js/slideshow-r1.js, js/notes-r1.js, js/receipts-r1.js, js/returns-due-r1.js, js/shop-r1.js, js/top10-r1.js, js/cartimport-r1.js, js/emailimport-r1.js, js/photo-suggest-r1.js, js/fit-r1.js, js/theme-r2.js, js/github-sync-r1.js */


/* ===== js/data-r9.js ===== */
// data.js — taxonomy and constants for the Virtual Closet

const GARMENT_TYPES = {
  tops: {
    label: 'Tops',
    subtypes: ['T-shirt', 'Long sleeve', 'Blouse', 'Shirt', 'Tank top', 'Sports bra', 'Sweater', 'Cardigan', 'Hoodie', 'Polo', 'Other']
  },
  bottoms: {
    label: 'Bottoms',
    subtypes: ['Pants', 'Jeans', 'Sweatpants', 'Shorts', 'Leggings', 'Skirt', 'Underwear', 'Cargo pants', 'Other']
  },
  dresses: {
    label: 'Dresses',
    subtypes: ['Dress', 'Jumpsuit', 'Romper', 'Other']
  },
  outerwear: {
    label: 'Outerwear',
    subtypes: ['Jacket', 'Coat', 'Vest', 'Parka', 'Blazer', 'Other']
  },
  intimates_swim: {
    label: 'Intimates & Swim',
    subtypes: ['Sports bra', 'Bra', 'Bralette', 'Camisole', 'Slip', 'Underwear', 'Boxers', 'Briefs', 'Thong', 'Bikini top', 'Bikini bottom', 'One-piece swimsuit', 'Robe', 'Pajamas', 'Other']
  },
  shoes: {
    label: 'Shoes',
    subtypes: ['Sneakers', 'Boots', 'Heels', 'Flats', 'Sandals', 'Athletic', 'Dress shoes', 'Other']
  },
  accessories: {
    label: 'Accessories',
    subtypes: ['Hat', 'Scarf', 'Belt', 'Socks', 'Tights', 'Jewelry', 'Bag', 'Tie', 'Sunglasses', 'Watch', 'Other']
  }
};

const LIFESTYLE_CATEGORIES = [
  { id: 'everyday',   label: 'Everyday' },
  { id: 'activewear', label: 'Activewear/Sportswear' },
  { id: 'casual',     label: 'Casual' },
  { id: 'business',   label: 'Business/Professional' },
  { id: 'formal',     label: 'Formal/Evening' },
  { id: 'loungewear', label: 'Loungewear/Sleepwear' },
  { id: 'swim_intimates', label: 'Swimwear/Lingerie' }
];

const SEASONS = [
  { id: 'spring',      label: 'Spring' },
  { id: 'summer',      label: 'Summer' },
  { id: 'fall',        label: 'Fall' },
  { id: 'winter',      label: 'Winter' },
  { id: 'all_seasons', label: 'All Seasons' }
];

const OCCASIONS = [
  { id: 'church',      label: 'Church' },
  { id: 'dinner_date', label: 'Dinner Date' },
  { id: 'pickleball',  label: 'Pickleball' },
  { id: 'run',         label: 'Run' },
  { id: 'casual',      label: 'Casual' },
  { id: 'loungewear',  label: 'Loungewear' },
  { id: 'bjj',         label: 'BJJ' },
  { id: 'business',    label: 'Business' }
];

// Color palette — organized by family. Inspired by fabric-swatch references
// (warm neutrals, yellows, oranges, pinks, reds, purples, blues, greens).
// All older color names (Black, White, Cream, Pink, etc.) are preserved so
// existing item tags keep working.
const COLOR_FAMILIES = {
  Neutrals: [
    'White', 'Ivory', 'Light Ivory', 'Cream', 'Champagne',
    'Silver', 'Gray', 'Charcoal', 'Black',
    'Chocolate', 'Brown', 'Tan', 'Beige', 'Antique Gold'
  ],
  Yellows: ['Pale Yellow', 'Butter', 'Lemon', 'Yellow', 'Mustard', 'Gold'],
  Oranges: ['Peach', 'Melon', 'Coral', 'Orange', 'Burnt Orange'],
  Pinks: ['Blush', 'Light Pink', 'Pink', 'Bubblegum', 'Hot Pink', 'Dusty Rose', 'Fuchsia', 'Magenta', 'Mauve'],
  Reds: ['Red', 'Burgundy', 'Wine', 'Eggplant'],
  Purples: ['Lavender', 'Lilac', 'Plum', 'Grape', 'Purple', 'Royal Purple', 'Amethyst', 'Indigo'],
  Blues: ['Sky Blue', 'Light Blue', 'Aqua', 'Turquoise', 'Periwinkle', 'Gray Blue', 'Blue', 'Neon Blue', 'Royal Blue', 'Cobalt Blue', 'Navy'],
  Greens: ['Mint', 'Sage', 'Neon Green', 'Kelly Green', 'Jade', 'Emerald', 'Green', 'Olive', 'Teal'],
};

// Flat list (kept as COLORS for backwards compatibility with existing UI).
const COLORS = Object.values(COLOR_FAMILIES).flat().concat(['Multi']);

// Hex values for each color — used by the pie chart and any swatch UI.
const COLOR_HEX = {
  // Neutrals
  White: '#f6f6f4', Ivory: '#fffff0', 'Light Ivory': '#fafaf0', Cream: '#f0ebdc', Champagne: '#f7e7ce',
  Silver: '#c0c0c0', Gray: '#9b9b9b', Charcoal: '#3c3c3c', Black: '#1c1c1c',
  Chocolate: '#3a1f0d', Brown: '#7a4f2e', Tan: '#c8af8c', Beige: '#dcc8af', 'Antique Gold': '#a08652',
  // Yellows
  'Pale Yellow': '#f5f1c4', Butter: '#fbe79f', Lemon: '#f5e856', Yellow: '#f0dc50', Mustard: '#c8a53c', Gold: '#d4af37',
  // Oranges
  Peach: '#ffcba4', Melon: '#fdbc94', Coral: '#f0826e', Orange: '#e68c3c', 'Burnt Orange': '#a03c0a',
  // Pinks
  Blush: '#dec3b8', 'Light Pink': '#ffd0de', Pink: '#f0b4c8', Bubblegum: '#ffaecf', 'Hot Pink': '#ff3399',
  'Dusty Rose': '#c08484', Fuchsia: '#ff1493', Magenta: '#dc46a0', Mauve: '#b9919b',
  // Reds
  Red: '#b42828', Burgundy: '#7a1e32', Wine: '#5e1a2c', Eggplant: '#3a1c2c',
  // Purples
  Lavender: '#c8b4e6', Lilac: '#c8a2c8', Plum: '#783c6e', Grape: '#6b3fa0',
  Purple: '#8250b4', 'Royal Purple': '#6f2da8', Amethyst: '#9966cc', Indigo: '#465096',
  // Blues
  'Sky Blue': '#87ceeb', 'Light Blue': '#add8e6', Aqua: '#7fdbe6', Turquoise: '#50c8c8',
  Periwinkle: '#7c8de1', 'Gray Blue': '#7b9bb6', Blue: '#4682c8',
  'Neon Blue': '#1f51ff', 'Royal Blue': '#1f3da3', 'Cobalt Blue': '#0047ab', Navy: '#1e3264',
  // Greens
  Mint: '#b4e6c8', Sage: '#aabea0', 'Neon Green': '#39ff14', 'Kelly Green': '#4cbb17',
  Jade: '#00a36c', Emerald: '#228b22', Green: '#508c50', Olive: '#788250', Teal: '#3c8282',
  // Special
  Multi: 'url(#multi-grad)',
};

// Brand-specific color tags → canonical palette colors. Lets the user save
// items with their actual purchased color name (e.g. "Blue Coast Heather")
// while charts/swatches roll them up to a canonical color (Navy).
const COLOR_ALIASES = {
  // Blues
  'Blue Coast Heather': 'Navy',
  'Riviera Blue': 'Blue',
  'Wild Indigo': 'Indigo',
  'Eggshell Blue': 'Sky Blue',
  'Sea Spray': 'Sky Blue',
  'Blue Coast': 'Blue',
  'Crystal Clear Blue': 'Sky Blue',
  'Blue Gingham': 'Blue',
  'Mini Filigree Lace True Navy': 'Navy',
  // Pinks
  'Sunset Pink': 'Light Pink',
  'Berry Rumble': 'Pink',
  'Neon Bubblegum': 'Hot Pink',
  'Sonic Pink': 'Hot Pink',
  'Pink Lemonade': 'Pink',
  'Ballet Pink': 'Light Pink',
  'Pink Summer Crush': 'Pink',
  'Pink Red Floral': 'Pink',
  'Rose Water': 'Pink',
  'Fuchsia Marigold Tie-Dye': 'Fuchsia',
  // Purples
  'Smoky Quartz': 'Mauve',
  'Faint Lavender': 'Lavender',
  'Hyacinth': 'Lavender',
  'Atmospheric Purple': 'Purple',
  'Dusty Purple Lilac': 'Lilac',
  'Plum Kiss': 'Plum',
  'Goodnight Plum': 'Plum',
  'Sour Grape/White/Green': 'Grape',
  // Reds / Burgundies
  'Black Plum': 'Burgundy',
  'Bright Red': 'Red',
  'Sangria': 'Burgundy',
  // Greens / Teals
  'Dark Jade': 'Emerald',
  'Lime': 'Mint',
  'Martini Print': 'Mint',
  'Teal/Deep Marina': 'Teal',
  'Teal Pattern': 'Teal',
  // Yellows
  'Yellow Ditsy Floral': 'Yellow',
  // Neutrals
  'Bone': 'Cream',
  'Chia/Brown': 'Brown',
  'Jade Grey': 'Gray',
  'Mauve Grey': 'Mauve',
  'White Heather': 'White',
  'Pearl': 'White',
  'Gravel': 'Gray',
  'Furry Taupe': 'Tan',
  'Sierra Taupe': 'Tan',
  'Chino Beige': 'Beige',
  'New off White': 'Cream',
  'Light Heather Grey': 'Gray',
  'Fresh White': 'White',
  'Silver/White': 'Silver',
  'Oxygen White': 'White',
  'Vapor Blue/White/Coral Blush': 'Multi',
  'Ink': 'Black',
  'Jet': 'Black',
  'Black Marble': 'Black',
  'Onyx Black Marble': 'Black',
  'Black Neon Floral': 'Black',
};

// Resolve a possibly-brand color name to its canonical palette color.
// If the name is already canonical (in COLOR_HEX), return as-is.
// Otherwise look up in COLOR_ALIASES; if not found, return the original
// (so unknown colors still appear in the legend rather than being lost).
function normalizeColor(name) {
  if (!name) return name;
  if (COLOR_HEX[name]) return name;
  if (COLOR_ALIASES[name]) return COLOR_ALIASES[name];
  return name;
}

function familyForColor(name) {
  for (const [family, list] of Object.entries(COLOR_FAMILIES)) {
    if (list.includes(name)) return family;
  }
  return name === 'Multi' ? 'Special' : 'Other';
}

const ITEM_STATUSES = [
  { id: '',             label: 'Keep' },
  { id: 'donate',       label: 'Donate' },
  { id: 'repair',       label: 'Needs repair' },
  { id: 'plan_to_sell', label: 'Plan to sell' },
  { id: 'selling',      label: 'Selling' },
  { id: 'returned',     label: 'Returned' },
  { id: 'sold',         label: 'Sold / gone' }
];

function labelForStatus(id) { return (ITEM_STATUSES.find(s => s.id === id) || ITEM_STATUSES[0]).label; }

function labelForGarmentType(id) { return GARMENT_TYPES[id]?.label || id; }
function labelForLifestyle(id) { return LIFESTYLE_CATEGORIES.find(c => c.id === id)?.label || id; }
function labelForSeason(id) { return SEASONS.find(s => s.id === id)?.label || id; }
function labelForOccasion(id) { return OCCASIONS.find(o => o.id === id)?.label || id; }


// ============================================================
// "Active" item filter — items the user still has in their closet.
// Items tagged with status === 'returned' are no longer owned and should
// be excluded from counts (sidebar, closet, browse tiles, color pie, etc.)
// and from the outfit suggester pool. They remain visible in Insights →
// Declutter and are still editable from the closet detail modal.
// ============================================================

function isActiveItem(item) {
  if (!item) return false;
  // Items tagged 'returned' or 'sold' are no longer owned — exclude from
  // every count (sidebar, closet, browse, charts) and from the outfit pool.
  if (item.status === 'returned' || item.status === 'sold') return false;
  return true;
}
function activeItems(items) {
  return (items || []).filter(isActiveItem);
}


/* ===== js/utils-r1.js ===== */
// utils.js — helpers

async function resizeImage(file, maxDim = 1200, quality = 0.88) {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, w, h);
  return await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
}

async function makeThumbnail(file, maxDim = 800, quality = 0.88) {
  return resizeImage(file, maxDim, quality);
}

const _urlCache = new WeakMap();
function blobToUrl(blob) {
  if (!blob) return '';
  // Accept already-resolved URLs (data: or blob: strings) directly
  if (typeof blob === 'string') return blob;
  let url = _urlCache.get(blob);
  if (!url) {
    try {
      url = URL.createObjectURL(blob);
    } catch (err) {
      // Defensive: if input wasn't a Blob (corrupted record), fail soft
      console.warn('blobToUrl: createObjectURL failed', err, blob);
      return '';
    }
    _urlCache.set(blob, url);
  }
  return url;
}

function showToast(message, duration = 2400) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toast.hidden = true; }, duration);
}

function openModal(html) {
  const modal = document.getElementById('modal');
  document.getElementById('modalContent').innerHTML = html;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.matches('[data-close]')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function fmtCurrency(n) {
  if (n == null || n === '') return '';
  const num = Number(n);
  if (isNaN(num)) return '';
  return '$' + num.toFixed(2);
}

function fmtDate(s) {
  if (!s) return '';
  const parts = s.split('-');
  if (parts.length === 3) {
    const d = new Date(s + 'T00:00');
    if (!isNaN(d)) return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  if (parts.length === 2) {
    const d = new Date(s + '-01T00:00');
    if (!isNaN(d)) return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  }
  return s;
}

function debounce(fn, ms = 200) {
  let t;
  return function() {
    const args = arguments;
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), ms);
  };
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
}

async function fetchImageBlob(url) {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const blob = await res.blob();
    if (blob.type.startsWith('image/')) return blob;
    throw new Error('Not an image: ' + blob.type);
  } catch (err) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        try {
          c.getContext('2d').drawImage(img, 0, 0);
          c.toBlob(b => b ? resolve(b) : reject(new Error('Could not encode image')), 'image/jpeg', 0.9);
        } catch (e) {
          reject(new Error('Image is from a site that blocks cross-origin downloads. Try right-clicking and saving the image, then drop the file in the upload zone.'));
        }
      };
      img.onerror = () => reject(new Error('Could not load image from URL'));
      img.src = url;
    });
  }
}

function looksLikeImageUrl(text) {
  if (!text) return false;
  text = text.trim();
  if (!/^https?:\/\//i.test(text)) return false;
  return /\.(jpe?g|png|webp|gif|avif|bmp)(\?|$)/i.test(text) || /image|photo|cdn|product/i.test(text);
}

let _lightboxKeyHandler = null;
function openLightbox(urls, startIndex) {
  if (!urls || urls.length === 0) return;
  startIndex = startIndex || 0;
  let idx = Math.max(0, Math.min(startIndex, urls.length - 1));
  const existing = document.getElementById('lightbox');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'lightbox';
  el.className = 'lightbox';

  const closeChar = String.fromCharCode(215); // x
  const prevChar = String.fromCharCode(8249); // <
  const nextChar = String.fromCharCode(8250); // >

  let html = '<img class="lightbox-image" src="' + urls[idx] + '" alt="" />';
  html += '<button class="lightbox-close" aria-label="Close">' + closeChar + '</button>';
  if (urls.length > 1) {
    html += '<button class="lightbox-prev" aria-label="Previous">' + prevChar + '</button>';
    html += '<button class="lightbox-next" aria-label="Next">' + nextChar + '</button>';
    html += '<div class="lightbox-counter">' + (idx + 1) + ' / ' + urls.length + '</div>';
  }
  el.innerHTML = html;
  document.body.appendChild(el);

  const img = el.querySelector('.lightbox-image');
  const counter = el.querySelector('.lightbox-counter');
  function update() {
    img.src = urls[idx];
    if (counter) counter.textContent = (idx + 1) + ' / ' + urls.length;
  }
  function next() { idx = (idx + 1) % urls.length; update(); }
  function prev() { idx = (idx - 1 + urls.length) % urls.length; update(); }
  function close() {
    el.remove();
    if (_lightboxKeyHandler) document.removeEventListener('keydown', _lightboxKeyHandler);
    _lightboxKeyHandler = null;
  }
  el.querySelector('.lightbox-close').addEventListener('click', close);
  const prevBtn = el.querySelector('.lightbox-prev');
  if (prevBtn) prevBtn.addEventListener('click', prev);
  const nextBtn = el.querySelector('.lightbox-next');
  if (nextBtn) nextBtn.addEventListener('click', next);
  el.addEventListener('click', e => { if (e.target === el) close(); });
  _lightboxKeyHandler = function(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight' && urls.length > 1) next();
    else if (e.key === 'ArrowLeft' && urls.length > 1) prev();
  };
  document.addEventListener('keydown', _lightboxKeyHandler);
}

function itemPhotos(item) {
  const all = [];
  if (item.photo) all.push(item.photo);
  if (Array.isArray(item.photos)) all.push.apply(all, item.photos);
  return all;
}


/* ===== js/colorpick-r1.js ===== */
// colorpick-r1.js — sample dominant color from an image and snap to palette.
//
// Algorithm:
//   1. Draw image to a small canvas (max 64px on its longest edge — fast).
//   2. Sample only the central region (50%) so a white background doesn't
//      dominate the result.
//   3. Bucket each pixel into a 32-step coarse RGB cube; pick the most
//      populated bucket whose pixels we keep (skip too-light and too-dark).
//   4. Snap that average RGB to the closest named color in COLOR_HEX.

(function() {
  // Convert hex (#aabbcc) -> [r, g, b]
  function hexToRgb(hex) {
    const h = String(hex).replace('#', '');
    if (h.length !== 6) return null;
    const n = parseInt(h, 16);
    if (isNaN(n)) return null;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // Squared distance in RGB space — close enough for clothing colors.
  function dist2(a, b) {
    const dr = a[0] - b[0];
    const dg = a[1] - b[1];
    const db = a[2] - b[2];
    return dr * dr + dg * dg + db * db;
  }

  function snapToPalette(rgb) {
    // Use COLOR_HEX from data.js — bail gracefully if it isn't loaded yet.
    const palette = (typeof COLOR_HEX === 'object' && COLOR_HEX) ? COLOR_HEX : null;
    if (!palette) return null;
    let best = null;
    let bestDist = Infinity;
    for (const [name, hex] of Object.entries(palette)) {
      const ref = hexToRgb(hex);
      if (!ref) continue;
      const d = dist2(rgb, ref);
      if (d < bestDist) {
        bestDist = d;
        best = name;
      }
    }
    return best;
  }

  function blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { resolve(img); URL.revokeObjectURL(url); };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  // Sample the image and return [r, g, b] of the dominant garment-ish color.
  async function extractDominantRgb(blob) {
    const img = await blobToImage(blob);
    const maxEdge = 64;
    const scale = Math.min(maxEdge / img.naturalWidth, maxEdge / img.naturalHeight, 1);
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    // Sample only the central 50% box of pixels.
    const x0 = Math.floor(w * 0.25);
    const x1 = Math.ceil(w * 0.75);
    const y0 = Math.floor(h * 0.25);
    const y1 = Math.ceil(h * 0.75);

    // Bucket pixels into a 5-bit RGB cube to find the most common color
    // family while ignoring true white / true black (background, shadow).
    const buckets = new Map(); // key -> { count, r, g, b }
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * w + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 200) continue; // skip transparent
        // Skip near-white (background) and near-black (shadow) extremes.
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max > 245 && min > 235) continue; // very white
        if (max < 18) continue;                // very black
        const key = ((r >> 5) << 10) | ((g >> 5) << 5) | (b >> 5);
        const cur = buckets.get(key);
        if (cur) {
          cur.count++; cur.r += r; cur.g += g; cur.b += b;
        } else {
          buckets.set(key, { count: 1, r, g, b });
        }
      }
    }
    if (buckets.size === 0) {
      // Whole region was white/black — fall back to plain average of
      // the whole image so we still return something useful.
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
      return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
    }
    let best = null;
    for (const v of buckets.values()) {
      if (!best || v.count > best.count) best = v;
    }
    return [
      Math.round(best.r / best.count),
      Math.round(best.g / best.count),
      Math.round(best.b / best.count),
    ];
  }

  async function pickColorFromBlob(blob) {
    try {
      const rgb = await extractDominantRgb(blob);
      const name = snapToPalette(rgb);
      return { rgb, name };
    } catch (e) {
      console.warn('Color pick failed:', e);
      return null;
    }
  }

  // Expose globally
  window.pickColorFromBlob = pickColorFromBlob;
  window.extractDominantRgb = extractDominantRgb;
})();


/* ===== js/auth-r1.js ===== */
// auth.js — local multi-user accounts (per-user IndexedDB)
//
// Stores accounts in localStorage as 'vc:users' (JSON array).
// Each user has: { id, username, salt, hash, createdAt }
// Active session in sessionStorage as 'vc:currentUser' (cleared on tab close).

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':' + salt);
  const buf = await crypto.subtle.digest('SHA-256', data);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

function _getUsers() {
  try { return JSON.parse(localStorage.getItem('vc:users') || '[]'); }
  catch (_) { return []; }
}

function _saveUsers(users) {
  localStorage.setItem('vc:users', JSON.stringify(users));
}

function getCurrentUser() {
  try { return JSON.parse(sessionStorage.getItem('vc:currentUser') || 'null'); }
  catch (_) { return null; }
}

function _setCurrentUser(user) {
  if (user) sessionStorage.setItem('vc:currentUser', JSON.stringify(user));
  else sessionStorage.removeItem('vc:currentUser');
  // Reset the cached IndexedDB connection so the new user's DB is used
  if (typeof resetDb === 'function') resetDb();
}

async function createAccount(username, password) {
  username = (username || '').trim().toLowerCase();
  if (!username) throw new Error('Please choose a username.');
  if (!/^[a-z0-9._-]{2,32}$/.test(username)) {
    throw new Error('Username must be 2-32 characters: letters, numbers, dot, dash, underscore.');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters.');
  }
  const users = _getUsers();
  if (users.find(u => u.username === username)) {
    throw new Error('That username is already taken on this device.');
  }
  const id = 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  const salt = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const hash = await hashPassword(password, salt);
  users.push({ id, username, salt, hash, createdAt: Date.now() });
  _saveUsers(users);
  _setCurrentUser({ id, username });
  return { id, username };
}

async function signIn(username, password) {
  username = (username || '').trim().toLowerCase();
  const users = _getUsers();
  const user = users.find(u => u.username === username);
  if (!user) throw new Error('No account with that username on this device.');
  const hash = await hashPassword(password, user.salt);
  if (hash !== user.hash) throw new Error('Wrong password.');
  _setCurrentUser({ id: user.id, username: user.username });
  return { id: user.id, username: user.username };
}

function signOut() {
  _setCurrentUser(null);
}

function userCount() {
  return _getUsers().length;
}


/* ===== js/db-r3.js ===== */
// db.js — IndexedDB wrapper for the Virtual Closet

const DB_VERSION = 4;
const STORE_ITEMS = 'items';
const STORE_OUTFITS = 'outfits';
const STORE_WISHLIST = 'wishlist';
const STORE_CAPSULES = 'capsules';
const STORE_DAILY = 'dailyOutfits';
const STORE_NOTES = 'userNotes';

let _dbPromise = null;
let _dbName = null;

function currentDbName() {
  const u = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  return 'virtual-closet-' + (u ? u.id : 'guest');
}

// Drop the cached connection so a future openDB() opens the new user's DB
function resetDb() {
  if (_dbPromise) {
    _dbPromise.then(db => { try { db.close(); } catch (_) {} });
  }
  _dbPromise = null;
  _dbName = null;
}

function openDB() {
  const targetName = currentDbName();
  if (_dbPromise && _dbName === targetName) return _dbPromise;
  if (_dbPromise) {
    _dbPromise.then(db => { try { db.close(); } catch (_) {} });
  }
  _dbName = targetName;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(targetName, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        const items = db.createObjectStore(STORE_ITEMS, { keyPath: 'id', autoIncrement: true });
        items.createIndex('garmentType', 'garmentType', { unique: false });
        items.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_OUTFITS)) {
        const outfits = db.createObjectStore(STORE_OUTFITS, { keyPath: 'id', autoIncrement: true });
        outfits.createIndex('occasion', 'occasion', { unique: false });
        outfits.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_WISHLIST)) {
        const wishlist = db.createObjectStore(STORE_WISHLIST, { keyPath: 'id', autoIncrement: true });
        wishlist.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_CAPSULES)) {
        const capsules = db.createObjectStore(STORE_CAPSULES, { keyPath: 'id', autoIncrement: true });
        capsules.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_DAILY)) {
        const daily = db.createObjectStore(STORE_DAILY, { keyPath: 'id', autoIncrement: true });
        daily.createIndex('date', 'date', { unique: false });
        daily.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        const notes = db.createObjectStore(STORE_NOTES, { keyPath: 'id', autoIncrement: true });
        notes.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
  return _dbPromise;
}

function tx(storeName, mode = 'readonly') {
  return openDB().then(db => db.transaction(storeName, mode).objectStore(storeName));
}

// === Items ===
async function dbAddItem(item) {
  const store = await tx(STORE_ITEMS, 'readwrite');
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const record = { ...item, createdAt: item.createdAt || now, updatedAt: now };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbUpdateItem(id, updates) {
  const store = await tx(STORE_ITEMS, 'readwrite');
  return new Promise((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('Item not found'));
      const merged = { ...existing, ...updates, id, updatedAt: Date.now() };
      const putReq = store.put(merged);
      putReq.onsuccess = () => resolve(merged);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

async function dbGetItem(id) {
  const store = await tx(STORE_ITEMS);
  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAllItems() {
  const store = await tx(STORE_ITEMS);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function dbDeleteItem(id) {
  const store = await tx(STORE_ITEMS, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// === Outfits ===
async function dbAddOutfit(outfit) {
  const store = await tx(STORE_OUTFITS, 'readwrite');
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const record = { ...outfit, createdAt: outfit.createdAt || now, updatedAt: now };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbUpdateOutfit(id, updates) {
  const store = await tx(STORE_OUTFITS, 'readwrite');
  return new Promise((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('Outfit not found'));
      const merged = { ...existing, ...updates, id, updatedAt: Date.now() };
      const putReq = store.put(merged);
      putReq.onsuccess = () => resolve(merged);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

async function dbGetAllOutfits() {
  const store = await tx(STORE_OUTFITS);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetOutfit(id) {
  const store = await tx(STORE_OUTFITS);
  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbDeleteOutfit(id) {
  const store = await tx(STORE_OUTFITS, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// === Backup / Restore ===
async function dbExportAll() {
  const items = await dbGetAllItems();
  const outfits = await dbGetAllOutfits();
  const wishlist = await dbGetAllWishlistItems();
  const itemsExport = await Promise.all(items.map(async i => {
    const out = { ...i };
    if (out.photo) out.photo = await blobToBase64(out.photo);
    if (out.thumb) out.thumb = await blobToBase64(out.thumb);
    if (Array.isArray(out.photos)) {
      out.photos = await Promise.all(out.photos.map(p => p ? blobToBase64(p) : null));
    }
    return out;
  }));
  const wishlistExport = await Promise.all(wishlist.map(async w => {
    const out = { ...w };
    if (out.photo && typeof out.photo !== 'string') out.photo = await blobToBase64(out.photo);
    if (out.thumb && typeof out.thumb !== 'string') out.thumb = await blobToBase64(out.thumb);
    if (Array.isArray(out.photos)) {
      out.photos = await Promise.all(out.photos.map(p => (p && typeof p !== 'string') ? blobToBase64(p) : p));
    }
    return out;
  }));
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    items: itemsExport,
    outfits,
    wishlist: wishlistExport
  };
}

async function dbImportAll(data, onProgress) {
  if (!data || !Array.isArray(data.items)) throw new Error('Invalid backup: missing "items" array');
  const total = data.items.length + (Array.isArray(data.outfits) ? data.outfits.length : 0) + (Array.isArray(data.wishlist) ? data.wishlist.length : 0);
  const newItemIds = [];
  let done = 0;
  for (const it of data.items) {
    const { id, ...rest } = it;
    try {
      if (rest.photo && typeof rest.photo === 'string') rest.photo = await base64ToBlob(rest.photo);
      if (rest.thumb && typeof rest.thumb === 'string') rest.thumb = await base64ToBlob(rest.thumb);
      if (Array.isArray(rest.photos)) {
        rest.photos = await Promise.all(rest.photos.map(p =>
          (p && typeof p === 'string') ? base64ToBlob(p) : null
        ));
        rest.photos = rest.photos.filter(Boolean);
      }
      const newId = await dbAddItem(rest);
      newItemIds.push(newId);
    } catch (err) {
      console.error('Failed to import item', rest.name || '(unnamed)', err);
      throw new Error('Failed at item "' + (rest.name || '(unnamed)') + '": ' + (err && err.message ? err.message : String(err)));
    }
    done++;
    if (onProgress) onProgress(done, total, rest.name);
  }
  if (Array.isArray(data.outfits)) {
    for (const o of data.outfits) {
      const { id, ...rest } = o;
      await dbAddOutfit(rest);
      done++;
      if (onProgress) onProgress(done, total, rest.name);
    }
  }
  if (Array.isArray(data.wishlist)) {
    for (const w of data.wishlist) {
      const { id, ...rest } = w;
      try {
        if (rest.photo && typeof rest.photo === 'string') rest.photo = await base64ToBlob(rest.photo);
        if (rest.thumb && typeof rest.thumb === 'string') rest.thumb = await base64ToBlob(rest.thumb);
        if (Array.isArray(rest.photos)) {
          rest.photos = await Promise.all(rest.photos.map(p =>
            (p && typeof p === 'string') ? base64ToBlob(p) : null
          ));
          rest.photos = rest.photos.filter(Boolean);
        }
        await dbAddWishlistItem(rest);
      } catch (err) {
        console.error('Failed to import wishlist item', rest.name || '(unnamed)', err);
      }
      done++;
      if (onProgress) onProgress(done, (total || done), 'Wishlist: ' + (rest.name || ''));
    }
  }
  return newItemIds;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Robust base64-data-URL → Blob converter that does not depend on fetch()
async function base64ToBlob(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('Photo data is missing or not a string');
  }
  if (!dataUrl.startsWith('data:')) {
    throw new Error('Photo is not a data URL (must start with "data:")');
  }
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) {
    throw new Error('Photo data URL is malformed (no comma separator)');
  }
  const meta = dataUrl.slice(5, commaIdx);
  const payload = dataUrl.slice(commaIdx + 1);
  const mime = (meta.split(';')[0] || 'application/octet-stream').trim();
  const isBase64 = meta.toLowerCase().includes('base64');
  let bytes;
  try {
    if (isBase64) {
      const bin = atob(payload);
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    } else {
      const decoded = decodeURIComponent(payload);
      bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
    }
  } catch (e) {
    throw new Error('Photo could not be decoded: ' + (e && e.message ? e.message : String(e)));
  }
  return new Blob([bytes], { type: mime });
}

// Migrate items + outfits from the pre-login "guest" database into the
// currently-signed-in user's database. Returns the counts moved.
// Try a list of legacy database names that may hold the user's pre-login
// data. The first to actually exist with items wins.
const LEGACY_DB_NAMES = ['virtual-closet', 'virtual-closet-guest'];

async function _openExistingDb(name) {
  // Use indexedDB.databases() if available to check existence first
  if (indexedDB.databases) {
    try {
      const all = await indexedDB.databases();
      const found = all.find(d => d.name === name);
      if (!found) return null;
    } catch (_) { /* fall through */ }
  }
  return new Promise((resolve, reject) => {
    let createdNew = false;
    const req = indexedDB.open(name, DB_VERSION);
    req.onupgradeneeded = (e) => {
      // If the DB doesn't already exist, mark it for deletion afterward
      if (e.oldVersion === 0) createdNew = true;
    };
    req.onsuccess = (e) => {
      const db = e.target.result;
      if (createdNew) {
        try { db.close(); } catch (_) {}
        try { indexedDB.deleteDatabase(name); } catch (_) {}
        resolve(null);
      } else {
        resolve(db);
      }
    };
    req.onerror = (e) => reject(e.target.error);
    req.onblocked = () => reject(new Error('Legacy DB ' + name + ' is in use elsewhere'));
  }).catch(() => null);
}

async function migrateGuestToCurrentUser() {
  const targetName = currentDbName();
  if (LEGACY_DB_NAMES.includes(targetName)) {
    return { items: 0, outfits: 0, skipped: 'no user signed in' };
  }
  // Try each legacy DB name in turn; first one with items wins
  let guestDb = null;
  let usedName = null;
  for (const name of LEGACY_DB_NAMES) {
    const db = await _openExistingDb(name);
    if (!db) continue;
    if (!db.objectStoreNames.contains(STORE_ITEMS)) {
      try { db.close(); } catch (_) {}
      continue;
    }
    // Quick count to see if it has anything
    const count = await new Promise(r => {
      const req = db.transaction(STORE_ITEMS).objectStore(STORE_ITEMS).count();
      req.onsuccess = e => r(e.target.result || 0);
      req.onerror = () => r(0);
    });
    if (count > 0) {
      guestDb = db;
      usedName = name;
      break;
    } else {
      try { db.close(); } catch (_) {}
    }
  }
  if (!guestDb) return { items: 0, outfits: 0 };
  console.log('[migrate] pulling from', usedName);
  // Read items + outfits
  let items = [], outfits = [];
  try {
    if (guestDb.objectStoreNames.contains(STORE_ITEMS)) {
      items = await new Promise((res, rej) => {
        const r = guestDb.transaction(STORE_ITEMS).objectStore(STORE_ITEMS).getAll();
        r.onsuccess = e => res(e.target.result || []);
        r.onerror = e => rej(e.target.error);
      });
    }
    if (guestDb.objectStoreNames.contains(STORE_OUTFITS)) {
      outfits = await new Promise((res, rej) => {
        const r = guestDb.transaction(STORE_OUTFITS).objectStore(STORE_OUTFITS).getAll();
        r.onsuccess = e => res(e.target.result || []);
        r.onerror = e => rej(e.target.error);
      });
    }
  } finally {
    try { guestDb.close(); } catch (_) {}
  }
  if (items.length === 0 && outfits.length === 0) {
    return { items: 0, outfits: 0 };
  }
  // Map old item IDs to new ones so we can remap outfit.itemIds
  const idMap = new Map();
  for (const it of items) {
    const { id: oldId, ...rest } = it;
    const newId = await dbAddItem(rest);
    idMap.set(oldId, newId);
  }
  for (const o of outfits) {
    const { id: oldId, ...rest } = o;
    if (Array.isArray(rest.itemIds)) {
      rest.itemIds = rest.itemIds.map(id => idMap.get(id)).filter(x => x != null);
    }
    await dbAddOutfit(rest);
  }
  return { items: items.length, outfits: outfits.length };
}

// === Wishlist ===
async function dbAddWishlistItem(item) {
  const store = await tx(STORE_WISHLIST, 'readwrite');
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const record = { ...item, createdAt: item.createdAt || now, updatedAt: now };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbUpdateWishlistItem(id, updates) {
  const store = await tx(STORE_WISHLIST, 'readwrite');
  return new Promise((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('Wishlist item not found'));
      const merged = { ...existing, ...updates, id, updatedAt: Date.now() };
      const putReq = store.put(merged);
      putReq.onsuccess = () => resolve(merged);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
async function dbGetAllWishlistItems() {
  const store = await tx(STORE_WISHLIST, 'readonly');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function dbDeleteWishlistItem(id) {
  const store = await tx(STORE_WISHLIST, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// === Capsule wardrobes ===
async function dbAddCapsule(capsule) {
  const store = await tx(STORE_CAPSULES, 'readwrite');
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const record = { ...capsule, createdAt: capsule.createdAt || now, updatedAt: now };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbUpdateCapsule(id, updates) {
  const store = await tx(STORE_CAPSULES, 'readwrite');
  return new Promise((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('Capsule not found'));
      const merged = { ...existing, ...updates, id, updatedAt: Date.now() };
      const putReq = store.put(merged);
      putReq.onsuccess = () => resolve(merged);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
async function dbGetAllCapsules() {
  const store = await tx(STORE_CAPSULES, 'readonly');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function dbDeleteCapsule(id) {
  const store = await tx(STORE_CAPSULES, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// === Daily outfit log ===
async function dbAddDaily(rec) {
  const store = await tx(STORE_DAILY, 'readwrite');
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const record = { ...rec, createdAt: rec.createdAt || now, updatedAt: now };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbUpdateDaily(id, updates) {
  const store = await tx(STORE_DAILY, 'readwrite');
  return new Promise((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('Daily record not found'));
      const merged = { ...existing, ...updates, id, updatedAt: Date.now() };
      const putReq = store.put(merged);
      putReq.onsuccess = () => resolve(merged);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
async function dbGetAllDaily() {
  const store = await tx(STORE_DAILY, 'readonly');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function dbDeleteDaily(id) {
  const store = await tx(STORE_DAILY, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// === User notes (personal updates / features-to-add list) ===
async function dbAddNote(rec) {
  const store = await tx(STORE_NOTES, 'readwrite');
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const record = { ...rec, createdAt: rec.createdAt || now, updatedAt: now };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbUpdateNote(id, updates) {
  const store = await tx(STORE_NOTES, 'readwrite');
  return new Promise((resolve, reject) => {
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const existing = getReq.result;
      if (!existing) return reject(new Error('Note not found'));
      const merged = { ...existing, ...updates, id, updatedAt: Date.now() };
      const putReq = store.put(merged);
      putReq.onsuccess = () => resolve(merged);
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
async function dbGetAllNotes() {
  const store = await tx(STORE_NOTES, 'readonly');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
async function dbDeleteNote(id) {
  const store = await tx(STORE_NOTES, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}


/* ===== js/closet-r10.js ===== */
// closet.js — closet view, upload, item detail/edit

const closetState = {
  items: [],
  filters: {
    search: '',
    garmentType: '',
    subtype: '',
    lifestyle: '',
    season: '',
    color: '',
    brand: ''
  },
  sort: 'purchase-newest'
};

// Lightweight subtype keyword table for inferring garmentType + subtype on
// items coming in via the email order importer. Mirrors the larger table in
// js/wishlist-r6.js but is local-scope so closet-r10.js doesn't depend on
// wishlist load order. The `_inferOrderCategory(text)` helper returns
// [garmentType, subtype] or ['', ''] when nothing matches.
const _ORDER_IMPORT_KEYWORDS = [
  [/\bsports[- ]?bra\b|\bbralette\b/i, 'intimates_swim', 'Sports bra'],
  [/\bbra\b/i,                          'intimates_swim', 'Bra'],
  [/\bbikini[- ]?top\b/i,               'intimates_swim', 'Bikini top'],
  [/\bbikini[- ]?bottom\b/i,            'intimates_swim', 'Bikini bottom'],
  [/\bswim(suit)?\b|\bone[- ]?piece\b/i,'intimates_swim', 'One-piece swimsuit'],
  [/\bunderwear\b|\bbrief\b|\bthong\b/i,'intimates_swim', 'Underwear'],
  [/\bhalf[- ]?zip\b/i,                 'tops',           'Sweater'],
  [/\bhoodie\b/i,                       'tops',           'Hoodie'],
  [/\bcardigan\b/i,                     'tops',           'Cardigan'],
  [/\bsweater\b|\bjumper\b/i,           'tops',           'Sweater'],
  [/\bblouse\b/i,                       'tops',           'Blouse'],
  [/\bbutton[- ]?up\b|\bshirt\b/i,      'tops',           'Shirt'],
  [/\btank\b/i,                         'tops',           'Tank top'],
  [/\blong[- ]?sleeve\b/i,              'tops',           'Long sleeve'],
  [/\bt[- ]?shirt\b|\btee\b/i,          'tops',           'T-shirt'],
  [/\bpolo\b/i,                         'tops',           'Polo'],
  [/\bjeans\b/i,                        'bottoms',        'Jeans'],
  [/\bleggings?\b/i,                    'bottoms',        'Leggings'],
  [/\bshorts?\b/i,                      'bottoms',        'Shorts'],
  [/\bpants?\b|\bjogger\b|\btrouser/i,  'bottoms',        'Pants'],
  [/\bskirt\b/i,                        'bottoms',        'Skirt'],
  [/\bdress\b/i,                        'dresses',        'Dress'],
  [/\bjumpsuit\b/i,                     'dresses',        'Jumpsuit'],
  [/\bromper\b/i,                       'dresses',        'Romper'],
  [/\bblazer\b/i,                       'outerwear',      'Blazer'],
  [/\bjacket\b/i,                       'outerwear',      'Jacket'],
  [/\bcoat\b|\bparka\b/i,               'outerwear',      'Coat'],
  [/\bvest\b/i,                         'outerwear',      'Vest'],
  [/\bsneaker(s)?\b|\btrainer/i,        'shoes',          'Sneakers'],
  [/\bheels?\b/i,                       'shoes',          'Heels'],
  [/\bflats?\b|\bloafers?\b/i,          'shoes',          'Flats'],
  [/\bboots?\b/i,                       'shoes',          'Boots'],
  [/\bsandals?\b/i,                     'shoes',          'Sandals'],
  [/\bhat\b|\bcap\b/i,                  'accessories',    'Hat'],
  [/\bbelt\b/i,                         'accessories',    'Belt'],
  [/\bbag\b|\bpurse\b|\btote\b/i,       'accessories',    'Bag'],
  [/\bsunglasses\b/i,                   'accessories',    'Sunglasses'],
  [/\bwatch\b/i,                        'accessories',    'Watch'],
  [/\bscarf\b/i,                        'accessories',    'Scarf'],
  [/\bsocks?\b/i,                       'accessories',    'Socks'],
];
function _inferOrderCategory(text) {
  if (!text) return ['', ''];
  for (const [pat, gt, st] of _ORDER_IMPORT_KEYWORDS) {
    if (pat.test(text)) return [gt, st];
  }
  return ['', ''];
}

// Handles ?orderImport=BASE64 from the email-import bookmarklet. Reads the
// param (or a sessionStorage stash from before signin), confirms with the
// user, then fans out into dbAddItem for each item with the photo fetched
// from imageUrl. Mirrors _handleCartImportParam in wishlist-r6.js.
async function _handleOrderImportParam(params) {
  let enc = (params && params.orderImport) ? params.orderImport : null;
  let fromUrl = !!enc;

  // Fall back to a stash from before signin
  if (!enc) {
    try { enc = sessionStorage.getItem('vc:pendingOrderImport'); } catch (_) {}
  }
  if (!enc) return [];

  // Not signed in yet? Stash and bail — the signin handler will route us
  // back here once the user has a real DB to write to.
  if (typeof getCurrentUser === 'function' && !getCurrentUser()) {
    try { sessionStorage.setItem('vc:pendingOrderImport', enc); } catch (_) {}
    return [];
  }

  // Strip from URL (or stash) so a refresh doesn't re-prompt
  if (fromUrl) {
    try {
      const hash = location.hash || '';
      const qIdx = hash.indexOf('?');
      if (qIdx >= 0) {
        const ps = new URLSearchParams(hash.slice(qIdx + 1));
        ps.delete('orderImport');
        const newHash = ps.toString() ? '#/closet?' + ps.toString() : '#/closet';
        history.replaceState(null, '', location.pathname + location.search + newHash);
      }
    } catch (_) {}
  }
  try { sessionStorage.removeItem('vc:pendingOrderImport'); } catch (_) {}

  let items;
  try {
    const json = decodeURIComponent(escape(atob(enc)));
    items = JSON.parse(json);
  } catch (e) {
    console.warn('orderImport decode failed:', e);
    return [];
  }
  if (!Array.isArray(items) || items.length === 0) return [];

  const ok = confirm(
    `Import ${items.length} item${items.length === 1 ? '' : 's'} from this order email into your closet?\n\n` +
    items.slice(0, 5).map(i => `• ${i.brand ? i.brand + ' — ' : ''}${i.name}${i.price ? ' ($' + i.price.toFixed(2) + ')' : ''}`).join('\n') +
    (items.length > 5 ? `\n...and ${items.length - 5} more` : '') +
    `\n\nYou can edit price, date, color, size, etc. on each item afterwards.`
  );
  if (!ok) return [];

  const today = new Date().toISOString().slice(0, 10);
  const newIds = [];
  for (const it of items) {
    if (!it || !it.name) continue;
    try {
      // Infer garment category + subtype from the item name so the closet
      // doesn't show "Category: undefined" on every imported piece.
      const [inferredGT, inferredST] = _inferOrderCategory(String(it.name || ''));
      const closetItem = {
        name: String(it.name).slice(0, 200),
        brand: String(it.brand || '').slice(0, 100),
        color: String(it.color || '').slice(0, 100),
        size: String(it.size || '').slice(0, 50),
        purchasePrice: (it.price && Number.isFinite(Number(it.price))) ? Number(it.price) : null,
        purchaseDate: today,
        url: String(it.url || '').slice(0, 500),
        notes: '',
        garmentType: inferredGT || '',
        subtype: inferredST || '',
      };
      if (it.imageUrl && typeof fetchImageBlob === 'function') {
        try {
          const blob = await fetchImageBlob(it.imageUrl);
          if (typeof resizeImage === 'function') {
            closetItem.photo = await resizeImage(blob, 1200, 0.88);
          } else {
            closetItem.photo = blob;
          }
        } catch (imgErr) {
          console.warn('orderImport image fetch failed:', it.imageUrl, imgErr);
        }
      }
      const newId = await dbAddItem(closetItem);
      if (newId) newIds.push(newId);
    } catch (e) {
      console.warn('orderImport item save failed:', it && it.name, e);
    }
  }

  if (newIds.length > 0) {
    try {
      sessionStorage.setItem('vc:lastImportIds', JSON.stringify(newIds));
      sessionStorage.setItem('vc:lastImportAt', String(Date.now()));
    } catch (_) {}
    try { showToast('Imported ' + newIds.length + ' item' + (newIds.length === 1 ? '' : 's') + ' to closet'); } catch (_) {}
  } else {
    try { showToast('No items imported'); } catch (_) {}
  }
  return newIds;
}

async function renderClosetView(main, params, fromRouter = false) {
  // Handle ?orderImport=base64 from the email-import bookmarklet BEFORE we
  // read the items list, so newly imported pieces show up in this render.
  // Wrapped — a malformed payload must never blank the closet page.
  try {
    await _handleOrderImportParam(params);
  } catch (e) {
    console.error('orderImport handler crashed:', e);
    try {
      const h = location.hash || '';
      const qi = h.indexOf('?');
      if (qi >= 0) {
        const ps = new URLSearchParams(h.slice(qi + 1));
        if (ps.has('orderImport')) {
          ps.delete('orderImport');
          const newHash = ps.toString() ? '#/closet?' + ps.toString() : '#/closet';
          history.replaceState(null, '', location.pathname + location.search + newHash);
        }
      }
      sessionStorage.removeItem('vc:pendingOrderImport');
    } catch (_) {}
  }
  const allItems = await dbGetAllItems();
  // Returned items are no longer owned — keep them out of counts and the grid.
  closetState.items = (typeof activeItems === 'function') ? activeItems(allItems) : allItems;
  updateItemCount(closetState.items.length);

  // When the router invokes us, the URL is the source of truth for filters.
  // Reset all filters to empty, then apply whatever's in the URL params.
  // In-page callers (filter dropdown change, "clear" button, dismiss banner)
  // pass no second/third arg, leaving the in-memory filter state intact.
  const FILTERABLE_PARAMS = ['brand', 'garmentType', 'subtype', 'lifestyle', 'season', 'color'];
  if (fromRouter) {
    closetState.filters = { search: '', garmentType: '', subtype: '', lifestyle: '', season: '', color: '', brand: '' };
    if (params && typeof params === 'object') {
      for (const key of FILTERABLE_PARAMS) {
        if (params[key] !== undefined) closetState.filters[key] = params[key];
      }
      if (params.search !== undefined) closetState.filters.search = params.search;
    }
  }

  // Closet shows a flat sorted list (Shop By tab handles category browsing).
  const brands = [...new Set(closetState.items.map(i => i.brand).filter(Boolean))].sort();

  // Pull pending review IDs (from a recent import) and keep only ones still present
  let reviewIds = [];
  try {
    const raw = sessionStorage.getItem('vc:lastImportIds');
    if (raw) {
      const parsed = JSON.parse(raw);
      const present = new Set(closetState.items.map(i => i.id));
      reviewIds = parsed.filter(id => present.has(id));
    }
  } catch (_) {}

  const banner = reviewIds.length > 0 ? `
    <div class="review-banner" id="reviewBanner">
      <div class="review-banner-text">
        <div class="review-banner-title">${reviewIds.length} item${reviewIds.length === 1 ? '' : 's'} just imported</div>
        <div class="review-banner-sub">Walk through each piece to verify and edit details — or click any card directly.</div>
      </div>
      <button class="btn" id="dismissReviewBtn">Dismiss</button>
      <button class="btn btn-primary" id="startReviewBtn">Review →</button>
    </div>
  ` : '';

  main.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Closet</h1>
        <div class="page-subtitle">${closetState.items.length} ${closetState.items.length === 1 ? 'piece' : 'pieces'} in your wardrobe</div>
      </div>
      <a href="#/add" class="btn btn-primary">+ Add Item</a>
    </div>
    ${banner}
    ${typeof renderClosetReturnBanner === 'function' ? renderClosetReturnBanner(closetState.items) : ''}
    ${renderSubtypeChips()}
    ${closetState.items.length === 0 ? renderEmptyCloset() : `
      <div class="toolbar">
        <input type="search" class="input search" id="filterSearch" placeholder="Search by name, brand, notes, tags…" value="${escapeHtml(closetState.filters.search)}" />
        <select class="select" id="filterType">
          <option value="">All categories</option>
          ${Object.entries(GARMENT_TYPES).map(([id, t]) =>
            `<option value="${id}" ${closetState.filters.garmentType === id ? 'selected' : ''}>${t.label}</option>`
          ).join('')}
        </select>
        <select class="select" id="filterSubtype">
          <option value="">All types</option>
          ${getAvailableSubtypes().map(s =>
            `<option value="${escapeHtml(s)}" ${closetState.filters.subtype === s ? 'selected' : ''}>${escapeHtml(s)}</option>`
          ).join('')}
        </select>
        <select class="select" id="filterLifestyle">
          <option value="">All lifestyles</option>
          ${LIFESTYLE_CATEGORIES.map(c =>
            `<option value="${c.id}" ${closetState.filters.lifestyle === c.id ? 'selected' : ''}>${c.label}</option>`
          ).join('')}
        </select>
        <select class="select" id="filterSeason">
          <option value="">Any season</option>
          ${SEASONS.map(s =>
            `<option value="${s.id}" ${closetState.filters.season === s.id ? 'selected' : ''}>${s.label}</option>`
          ).join('')}
        </select>
        <select class="select" id="filterColor">
          <option value="">All colors</option>
          ${getAvailableColors().map(c =>
            `<option value="${escapeHtml(c)}" ${closetState.filters.color === c ? 'selected' : ''}>${escapeHtml(c)}</option>`
          ).join('')}
        </select>
        <select class="select" id="filterBrand">
          <option value="">All brands</option>
          ${brands.map(b =>
            `<option value="${escapeHtml(b)}" ${closetState.filters.brand === b ? 'selected' : ''}>${escapeHtml(b)}</option>`
          ).join('')}
        </select>
        <select class="select" id="sortBy">
          <option value="purchase-newest" ${closetState.sort === 'purchase-newest' ? 'selected' : ''}>Newest purchase</option>
          <option value="purchase-oldest" ${closetState.sort === 'purchase-oldest' ? 'selected' : ''}>Oldest purchase</option>
          <option value="newest" ${closetState.sort === 'newest' ? 'selected' : ''}>Newest added</option>
          <option value="oldest" ${closetState.sort === 'oldest' ? 'selected' : ''}>Oldest added</option>
          <option value="name" ${closetState.sort === 'name' ? 'selected' : ''}>Name A–Z</option>
          <option value="brand" ${closetState.sort === 'brand' ? 'selected' : ''}>Brand A–Z</option>
          <option value="price-high" ${closetState.sort === 'price-high' ? 'selected' : ''}>Price (high)</option>
          <option value="price-low" ${closetState.sort === 'price-low' ? 'selected' : ''}>Price (low)</option>
        </select>
        <button class="btn btn-ghost btn-sm" id="clearFilters">Clear</button>
      </div>

      <div id="closetGrid" class="grid"></div>
    `}
  `;

  if (closetState.items.length === 0) return;

  // Wire up filters
  const debouncedRender = debounce(() => renderGrid(), 150);
  document.getElementById('filterSearch').addEventListener('input', e => {
    closetState.filters.search = e.target.value;
    debouncedRender();
  });
  document.getElementById('filterType').addEventListener('change', e => {
    closetState.filters.garmentType = e.target.value;
    closetState.filters.subtype = ''; // reset subtype when type changes
    renderClosetView(main);
  });
  ['filterSubtype', 'filterLifestyle', 'filterSeason', 'filterColor', 'filterBrand', 'sortBy'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', e => {
      const map = {
        filterSubtype: 'subtype', filterLifestyle: 'lifestyle',
        filterSeason: 'season', filterColor: 'color', filterBrand: 'brand'
      };
      if (id === 'sortBy') closetState.sort = e.target.value;
      else closetState.filters[map[id]] = e.target.value;
      renderGrid();
    });
  });
  document.getElementById('clearFilters').addEventListener('click', () => {
    closetState.filters = { search: '', garmentType: '', subtype: '', lifestyle: '', season: '', color: '', brand: '' };
    closetState.sort = 'purchase-newest';
    renderClosetView(main);
  });

  const startBtn = document.getElementById('startReviewBtn');
  const dismissBtn = document.getElementById('dismissReviewBtn');
  if (startBtn) startBtn.addEventListener('click', () => startReviewWalkthrough(reviewIds));
  if (dismissBtn) dismissBtn.addEventListener('click', () => {
    sessionStorage.removeItem('vc:lastImportIds');
    renderClosetView(main);
  });

  renderGrid();
}

function getAvailableSubtypes() {
  const t = closetState.filters.garmentType;
  const built = (t && GARMENT_TYPES[t]) ? [...GARMENT_TYPES[t].subtypes] : [];
  // Also include any custom subtypes the user has entered for items in this category
  const custom = closetState.items
    .filter(i => !t || i.garmentType === t)
    .map(i => i.subtype)
    .filter(Boolean);
  const seen = new Set(built);
  custom.forEach(c => { if (!seen.has(c)) { built.push(c); seen.add(c); } });
  return built;
}

function getAvailableColors() {
  const built = [...COLORS];
  const seen = new Set(built);
  closetState.items.map(i => i.color).filter(Boolean).forEach(c => {
    if (!seen.has(c)) { built.push(c); seen.add(c); }
  });
  return built;
}

function renderEmptyCloset() {
  return `
    <div class="empty">
      <div class="empty-title">Your closet is empty</div>
      <p>Start by adding photos of your clothing pieces. You can add metadata like brand, color, and purchase date as you go.</p>
      <a href="#/add" class="btn btn-primary">+ Add your first piece</a>
    </div>
  `;
}

// Closet category tile view — shown when no filter is active.
// Reuses _gradientFor from browse.js (loaded later but available at runtime).
function renderClosetCategoryTiles(main) {
  const groups = [];
  for (const [id, def] of Object.entries(GARMENT_TYPES)) {
    const list = closetState.items.filter(i => i.garmentType === id);
    if (list.length === 0) continue;
    groups.push({ id, label: def.label, count: list.length });
  }
  const uncat = closetState.items.filter(i => !i.garmentType);
  if (uncat.length > 0) {
    groups.push({ id: '__none__', label: 'Uncategorized', count: uncat.length });
  }

  const tileHtml = groups.map(g => {
    const grad = (typeof _gradientFor === 'function')
      ? _gradientFor(g.id, g.id)
      : 'linear-gradient(135deg, #4b6cb7, #182848)';
    return `
      <a class="tile tile-modern" href="#/closet?garmentType=${encodeURIComponent(g.id)}">
        <div class="tile-vignette"></div>
        <div class="tile-content">
          <div class="tile-label">${escapeHtml(g.label)}</div>
          <div class="tile-count">${g.count} ${g.count === 1 ? 'piece' : 'pieces'}</div>
        </div>
      </a>
    `;
  }).join('');

  main.innerHTML = `
    <div class="page-header" style="justify-content: center; flex-direction: column; text-align: center; gap: 6px;">
      <h1 class="browse-title">Closet</h1>
      <div class="page-subtitle">${closetState.items.length} ${closetState.items.length === 1 ? 'piece' : 'pieces'} in your wardrobe</div>
    </div>
    <div class="row" style="justify-content: center; gap: 12px; margin-bottom: 24px;">
      <a href="#/add" class="btn btn-primary">+ Add Item</a>
    </div>
    ${groups.length === 0 ? renderEmptyCloset() : `
      <div class="tile-grid">${tileHtml}</div>
    `}
  `;
}

// Subtype chip row — shown above the item grid when a category is active.
// Lets the user further narrow by subtype with one click.
function renderSubtypeChips() {
  const f = closetState.filters;
  if (!f.garmentType) return '';
  const itemsInCategory = closetState.items.filter(i => i.garmentType === f.garmentType);
  const counts = new Map();
  for (const i of itemsInCategory) {
    const s = i.subtype || '— No subtype —';
    counts.set(s, (counts.get(s) || 0) + 1);
  }
  const subtypes = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  if (subtypes.length === 0) return '';
  const allActive = !f.subtype ? 'active' : '';
  const baseHash = `#/closet?garmentType=${encodeURIComponent(f.garmentType)}`;
  const chips = [`<a class="subtype-chip ${allActive}" href="${baseHash}">All <span class="chip-count">${itemsInCategory.length}</span></a>`];
  for (const [name, n] of subtypes) {
    const active = f.subtype === name ? 'active' : '';
    const val = name === '— No subtype —' ? '__none__' : name;
    chips.push(`<a class="subtype-chip ${active}" href="${baseHash}&subtype=${encodeURIComponent(val)}">${escapeHtml(name)} <span class="chip-count">${n}</span></a>`);
  }
  return `<div class="subtype-chip-row">${chips.join('')}</div>`;
}

function renderGrid() {
  const grid = document.getElementById('closetGrid');
  if (!grid) return;
  const items = filterAndSortItems(closetState.items);
  if (items.length === 0) {
    grid.innerHTML = `<div class="empty" style="grid-column: 1/-1;">
      <div class="empty-title">No matches</div>
      <p>Try clearing some filters.</p>
    </div>`;
    return;
  }
  grid.innerHTML = items.map(itemCardHtml).join('');
  grid.querySelectorAll('[data-item-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      // Don't open detail when clicking the heart
      if (e.target.closest('.card-fav')) return;
      openItemDetail(Number(el.dataset.itemId));
    });
  });
  grid.querySelectorAll('[data-fav-id]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.favId);
      const fresh = await dbGetItem(id);
      const next = !fresh.favorite;
      await dbUpdateItem(id, { favorite: next });
      // Update the button visually without re-rendering everything
      btn.classList.toggle('is-fav', next);
      btn.textContent = next ? '♥' : '♡';
      btn.setAttribute('title', next ? 'Unfavorite' : 'Favorite');
      // Update the local cache so closetState reflects the change
      const localItem = closetState.items.find(i => i.id === id);
      if (localItem) localItem.favorite = next;
    });
  });
}

function filterAndSortItems(items) {
  const f = closetState.filters;
  const q = f.search.trim().toLowerCase();
  // The Browse view sends '__none__' as the filter value to mean
  // "items where this field is empty/missing" (e.g. items with no brand
  // or no garment type).
  const matchesField = (filterVal, itemVal) => {
    if (!filterVal) return true;
    if (filterVal === '__none__') return !itemVal;
    return itemVal === filterVal;
  };
  let result = items.filter(i => {
    if (!matchesField(f.garmentType, i.garmentType)) return false;
    if (!matchesField(f.subtype, i.subtype)) return false;
    if (f.lifestyle && f.lifestyle !== '__none__' && !(i.lifestyleCategories || []).includes(f.lifestyle)) return false;
    if (f.lifestyle === '__none__' && (i.lifestyleCategories || []).length > 0) return false;
    if (f.season) {
      const itemSeasons = i.seasons || [];
      // Items tagged "All Seasons" match any specific season filter,
      // and an explicit All-Seasons filter only matches items tagged that way.
      const matches = f.season === 'all_seasons'
        ? itemSeasons.includes('all_seasons')
        : itemSeasons.includes(f.season) || itemSeasons.includes('all_seasons');
      if (!matches) return false;
    }
    // Color filter: normalize both sides so a "Navy" filter also catches
    // items tagged with brand-specific aliases like "Blue Coast Heather".
    if (f.color) {
      if (f.color === '__none__') {
        if (i.color) return false;
      } else {
        const target = (typeof normalizeColor === 'function') ? normalizeColor(f.color) : f.color;
        const candidate = (typeof normalizeColor === 'function') ? normalizeColor(i.color || '') : (i.color || '');
        if (target !== candidate) return false;
      }
    }
    if (!matchesField(f.brand, i.brand)) return false;
    if (q) {
      const hay = [i.name, i.brand, i.color, i.notes, ...(i.tags || []), labelForGarmentType(i.garmentType), i.subtype]
        .filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Purchase-date sorting: items WITH a purchase date are sorted by it,
  // items WITHOUT a purchase date are appended to the bottom regardless of
  // sort direction. (createdAt is no longer used as a fallback for purchase
  // sorts — that conflated "added to closet today" with "bought today".)
  const sortByPurchaseDate = (asc) => {
    const dated = result.filter(it => it.purchaseDate)
      .sort((a, b) => {
        const ta = Date.parse(a.purchaseDate) || 0;
        const tb = Date.parse(b.purchaseDate) || 0;
        return asc ? ta - tb : tb - ta;
      });
    const undated = result.filter(it => !it.purchaseDate);
    return [...dated, ...undated];
  };
  switch (closetState.sort) {
    case 'purchase-newest': result = sortByPurchaseDate(false); break;
    case 'purchase-oldest': result = sortByPurchaseDate(true); break;
    case 'newest': result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
    case 'oldest': result.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); break;
    case 'name': result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break;
    case 'brand': result.sort((a, b) => (a.brand || '').localeCompare(b.brand || '')); break;
    case 'price-high': result.sort((a, b) => (b.purchasePrice || 0) - (a.purchasePrice || 0)); break;
    case 'price-low': result.sort((a, b) => (a.purchasePrice || 0) - (b.purchasePrice || 0)); break;
    default: result = sortByPurchaseDate(false);
  }
  return result;
}

function itemCardHtml(item) {
  const url = item.photo ? blobToUrl(item.photo) : (item.thumb ? blobToUrl(item.thumb) : '');
  const name = item.name || item.subtype || labelForGarmentType(item.garmentType) || 'Untitled';
  const meta = [item.brand, item.color].filter(Boolean).join(' · ');
  const total = 1 + (Array.isArray(item.photos) ? item.photos.length : 0);
  const badge = total > 1 ? `<div class="card-photo-count">▦ ${total}</div>` : '';
  const statusBadge = item.status ? `<div class="card-status-badge status-${item.status}">${escapeHtml(labelForStatus(item.status))}</div>` : '';
  const favHtml = (window.ratingHelpers && window.ratingHelpers.favoriteHtml)
    ? window.ratingHelpers.favoriteHtml(item)
    : '';
  const overall = (window.ratingHelpers && window.ratingHelpers.computeOverall)
    ? window.ratingHelpers.computeOverall(item) : 0;
  const ratingBadge = overall >= 4
    ? `<div class="card-rating-badge">${overall.toFixed(1)} ★</div>`
    : '';
  return `
    <div class="card" data-item-id="${item.id}">
      <div class="card-image" style="background-image:url('${url}')">${badge}${statusBadge}${ratingBadge}${favHtml}</div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(name)}</div>
        <div class="card-meta">${escapeHtml(meta) || '&nbsp;'}</div>
      </div>
    </div>
  `;
}

function updateItemCount(n) {
  const el = document.getElementById('itemCount');
  if (el) el.textContent = `${n} ${n === 1 ? 'piece' : 'pieces'}`;
}

// ===== Item detail modal =====
async function openItemDetail(id) {
  const item = await dbGetItem(id);
  if (!item) return;
  const url = item.photo ? blobToUrl(item.photo) : '';
  const name = item.name || item.subtype || labelForGarmentType(item.garmentType);
  const lifestyle = (item.lifestyleCategories || []).map(labelForLifestyle).join(', ') || '—';
  const seasons = (item.seasons || []).map(labelForSeason).join(', ') || '—';
  const tags = (item.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') || '<span class="muted">—</span>';

  const photos = itemPhotos(item);
  const urls = photos.map(blobToUrl);
  const galleryHtml = photos.length > 1 ? `
    <div class="gallery">
      <div class="gallery-main item-detail-image" id="galleryMain" style="background-image:url('${urls[0]}'); cursor: zoom-in;" data-current-index="0"></div>
      <div class="gallery-thumbs">
        ${urls.map((u, i) => `<div class="gallery-thumb${i === 0 ? ' active' : ''}" data-thumb-index="${i}" style="background-image:url('${u}')"></div>`).join('')}
      </div>
    </div>
  ` : `<div class="item-detail-image" id="galleryMain" style="background-image:url('${urls[0] || ''}'); cursor: zoom-in;" data-current-index="0"></div>`;
  openModal(`
    <div class="item-detail">
      ${galleryHtml}
      <div class="item-detail-info">
        <h2>${escapeHtml(name)}</h2>
        <div class="item-detail-brand">${escapeHtml(item.brand || '')}${item.size ? ' · Size ' + escapeHtml(item.size) : ''}</div>

        <dl style="margin:0;">
          <div class="detail-row"><dt>Category</dt><dd>${labelForGarmentType(item.garmentType)}${item.subtype ? ' · ' + escapeHtml(item.subtype) : ''}</dd></div>
          <div class="detail-row"><dt>Color</dt><dd>${escapeHtml(item.color || '—')}</dd></div>
          <div class="detail-row"><dt>Lifestyle</dt><dd>${escapeHtml(lifestyle)}</dd></div>
          <div class="detail-row"><dt>Season</dt><dd>${escapeHtml(seasons)}</dd></div>
          <div class="detail-row"><dt>Purchased</dt><dd>${fmtDate(item.purchaseDate)}</dd></div>
          <div class="detail-row"><dt>Price</dt><dd>${fmtCurrency(item.purchasePrice)}${(item.originalPrice && item.purchasePrice && item.originalPrice > item.purchasePrice) ? ` <span class="savings-badge">saved ${fmtCurrency(item.originalPrice - item.purchasePrice)} (${Math.round((1 - item.purchasePrice / item.originalPrice) * 100)}% off)</span>` : ''}</dd></div>${(item.originalPrice && item.purchasePrice && item.originalPrice > item.purchasePrice) ? `<div class="detail-row"><dt>Original</dt><dd class="muted"><s>${fmtCurrency(item.originalPrice)}</s></dd></div>` : ''}
          ${item.receipt ? `<div class="detail-row"><dt>Receipt</dt><dd>${item.receipt.type === 'application/pdf' ? 'PDF' : 'Image'} attached · <a href="#/receipts">view in Receipts tab</a></dd></div>` : ''}
          ${(() => {
            if (!window.ratingHelpers) return '';
            const overall = window.ratingHelpers.computeOverall(item);
            if (!overall && !item.favorite) return '';
            const heart = item.favorite ? '<span style="color: #c44;">♥ Favorite</span>' : '';
            const stars = overall ? window.ratingHelpers.starsHtml(overall, { showNumber: true }) : '';
            return `<div class="detail-row"><dt>Rating</dt><dd>${heart} ${stars}</dd></div>`;
          })()}
          ${(() => {
            if (!item.purchaseDate) return '';
            if (typeof daysUntilReturnDeadline !== 'function') return '';
            const d = daysUntilReturnDeadline(item);
            if (d === null) return '';
            const win = item.returnWindowDays || 30;
            let txt;
            if (d > 7) txt = `Returnable for ${d} more days (${win}-day window)`;
            else if (d > 0) txt = `<strong style="color: var(--danger);">${d} day${d === 1 ? '' : 's'} left to return</strong>`;
            else if (d === 0) txt = `<strong style="color: var(--danger);">Returns due TODAY</strong>`;
            else txt = `<span class="muted">${Math.abs(d)} day${Math.abs(d) === 1 ? '' : 's'} past return deadline</span>`;
            return `<div class="detail-row"><dt>Return</dt><dd>${txt}</dd></div>`;
          })()}
        </dl>

        ${item.notes ? `<div style="margin-top:18px;"><div class="section-title">Notes</div><div>${escapeHtml(item.notes)}</div></div>` : ''}
        <div style="margin-top:14px;"><div class="section-title">Tags</div><div class="card-tags">${tags}</div></div>

        <div class="item-detail-actions">
          <button class="btn" id="editItemBtn">Edit</button>
          <button class="btn" id="copyItemBtn" title="Make a duplicate of this item">Copy</button>
          <button class="btn btn-danger" id="deleteItemBtn">Delete</button>
        </div>
      </div>
    </div>
  `);

  // Gallery: clicking a thumb swaps the main, clicking main opens lightbox
  const galleryMain = document.getElementById('galleryMain');
  if (galleryMain) {
    galleryMain.addEventListener('click', () => {
      const i = Number(galleryMain.dataset.currentIndex || 0);
      openLightbox(urls, i);
    });
  }
  document.querySelectorAll('.gallery-thumb').forEach(t => {
    t.addEventListener('click', () => {
      const i = Number(t.dataset.thumbIndex);
      galleryMain.style.backgroundImage = `url('${urls[i]}')`;
      galleryMain.dataset.currentIndex = String(i);
      document.querySelectorAll('.gallery-thumb').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });

  document.getElementById('editItemBtn').addEventListener('click', () => openItemEdit(item.id));
  document.getElementById('copyItemBtn').addEventListener('click', async () => {
    try {
      const newId = await duplicateItem(item);
      closeModal();
      showToast('Item copied — opening the duplicate to edit');
      if (location.hash.startsWith('#/closet')) await renderClosetView(document.getElementById('main'));
      await refreshSidebarCount();
      // Open the duplicate in Edit so the user can tweak name/details
      openItemEdit(newId);
    } catch (err) {
      console.error(err);
      alert('Copy failed: ' + (err.message || err));
    }
  });
  document.getElementById('deleteItemBtn').addEventListener('click', async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await dbDeleteItem(item.id);
    closeModal();
    showToast('Item deleted');
    if (location.hash.startsWith('#/closet')) renderClosetView(document.getElementById('main'));
  });
}

// Duplicate an item record. Strips id/createdAt/updatedAt so the new
// record gets a fresh auto-incremented id, and appends " (copy)" to
// the name so it's distinguishable in the closet grid. All photos
// (cover + thumb + photos[]) are preserved as-is.
async function duplicateItem(item) {
  const { id, createdAt, updatedAt, ...rest } = item;
  const baseName = item.name && item.name.trim()
    ? item.name.trim()
    : (item.subtype || labelForGarmentType(item.garmentType) || 'Untitled');
  const clone = { ...rest, name: `${baseName} (copy)` };
  return await dbAddItem(clone);
}

// Holds a freshly chosen photo File while the Edit modal is open.
let editPendingPhoto = null;
let editPasteHandler = null;

function teardownEditPaste() {
  if (editPasteHandler) document.removeEventListener('paste', editPasteHandler);
  editPasteHandler = null;
  editPendingPhoto = null;
}

function previewNewPhotoInEdit(file) {
  editPendingPhoto = file;
  const url = URL.createObjectURL(file);
  document.querySelectorAll('.edit-photo-preview').forEach(el => {
    el.style.backgroundImage = `url('${url}')`;
  });
  showToast('New photo ready — click Save to apply');
}

function wireEditPhotoControls(item) {
  const fileInput = document.getElementById('editPhotoInput');
  if (fileInput) {
    fileInput.addEventListener('change', e => {
      const f = e.target.files[0];
      if (f && f.type.startsWith('image/')) previewNewPhotoInEdit(f);
    });
  }
  const dropZone = document.querySelector('.edit-photo-preview');
  if (dropZone) {
    ['dragenter', 'dragover'].forEach(ev =>
      dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.add('dragover'); })
    );
    ['dragleave', 'drop'].forEach(ev =>
      dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.remove('dragover'); })
    );
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      const f = [...e.dataTransfer.files].find(x => x.type.startsWith('image/'));
      if (f) previewNewPhotoInEdit(f);
    });
  }
  // Search button
  const searchBtn = document.getElementById('editSearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = (item.name || '') + ' ' + (item.brand || '') + ' ' + (item.color || '');
      window.open('https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q.trim()), '_blank', 'noopener');
      showToast('Opened Google Images — copy a photo, then paste it here (Ctrl/Cmd+V)');
    });
  }
  // URL load
  const loadBtn = document.getElementById('editUrlLoadBtn');
  const urlInput = document.getElementById('editPhotoUrl');
  if (loadBtn && urlInput) {
    const doLoad = async () => {
      const urls = _splitUrls(urlInput.value);
      if (urls.length === 0) return;
      loadBtn.disabled = true; loadBtn.textContent = 'Loading…';
      const failed = [];
      let lastFile = null;
      for (let i = 0; i < urls.length; i++) {
        loadBtn.textContent = `Loading ${i + 1}/${urls.length}…`;
        try {
          const blob = await fetchImageBlob(urls[i]);
          lastFile = new File([blob], `web-image-${i + 1}.jpg`, { type: blob.type || 'image/jpeg' });
          // The Edit modal's "Add another angle" panel adds one cover preview at a time;
          // when multiple are pasted, we set the LAST one as the staged photo and
          // surface the rest as a hint. Saving once will append the staged one;
          // for multi-add, the cleaner path is the Add Item view.
        } catch (err) {
          failed.push({ url: urls[i], message: err.message });
        }
      }
      if (lastFile) {
        previewNewPhotoInEdit(lastFile);
        urlInput.value = '';
      }
      loadBtn.disabled = false; loadBtn.textContent = 'Load';
      if (urls.length > 1) {
        showToast(`Edit accepts one new photo per save — using the last URL. To add several, use Add Item.`);
      }
      if (failed.length > 0) {
        const lines = failed.map(f => `  ${f.url}\n    → ${f.message}`).join('\n');
        alert('Some URLs failed to load:\n' + lines);
      }
    };
    loadBtn.addEventListener('click', doLoad);
    urlInput.addEventListener('keydown', e => {
      // Ctrl/Cmd+Enter loads; plain Enter keeps adding new lines
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); doLoad(); }
    });
  }
  // Document-level paste while edit modal open
  editPasteHandler = (e) => {
    const items = (e.clipboardData && e.clipboardData.items) || [];
    for (const it of items) {
      if (it.kind === 'file' && it.type.startsWith('image/')) {
        const f = it.getAsFile();
        if (f) { e.preventDefault(); previewNewPhotoInEdit(f); return; }
      }
    }
    const text = e.clipboardData && e.clipboardData.getData('text/plain');
    const t = e.target;
    const isTypingField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA');
    if (text && /^https?:\/\//i.test(text.trim()) && !isTypingField) {
      const ui = document.getElementById('editPhotoUrl');
      if (ui) { ui.value = text.trim(); document.getElementById('editUrlLoadBtn').click(); e.preventDefault(); }
    }
  };
  document.addEventListener('paste', editPasteHandler);
}

async function openItemEdit(id) {
  const item = await dbGetItem(id);
  if (!item) return;
  const url = item.photo ? blobToUrl(item.photo) : '';
  teardownEditPaste();

  const allPhotos = itemPhotos(item);
  const photoUrls = allPhotos.map(blobToUrl);
  openModal(`
    <h2 style="margin-bottom:18px;">Edit Item</h2>
    <div class="upload-preview" style="margin-bottom:18px;">
      <div>
        <div class="upload-preview-image edit-photo-preview" style="background-image:url('${photoUrls[0] || ''}'); position: relative; cursor: pointer;" title="Drop or click to add a photo"></div>
        ${allPhotos.length > 0 ? `
          <div class="gallery-thumbs" id="editPhotoStrip" style="margin-top: 10px;">
            ${photoUrls.map((u, i) => `
              <div class="gallery-thumb${i === 0 ? ' active' : ''}" data-photo-index="${i}" style="background-image:url('${u}')">
                ${i === 0 ? '<div class="gallery-thumb-cover-badge">★</div>' : ''}
                <div class="gallery-thumb-actions">
                  ${i > 0 ? `<button class="gallery-thumb-action set-cover" title="Set as cover" data-photo-index="${i}">★</button>` : ''}
                  <button class="gallery-thumb-action remove" title="Remove" data-remove-index="${i}">×</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div>${itemFormFieldsHtml(item)}</div>
    </div>
    <div class="upload-search" style="margin-bottom: 18px;">
      <div class="upload-search-title" style="margin-bottom: 10px;">${allPhotos.length === 0 ? 'Add photo' : 'Add another angle'}</div>
      <div class="row" style="gap: 8px;">
        <label class="btn" for="editPhotoInput" style="flex: 0 0 auto;">Choose file…</label>
        <input type="file" id="editPhotoInput" accept="image/*" hidden />
        <button class="btn" id="editSearchBtn" type="button">Search Google Images for this item</button>
        <div class="spacer"></div>
      </div>
      <div class="row" style="gap: 8px; margin-top: 10px; align-items: flex-start;">
        <textarea class="input" id="editPhotoUrl" rows="3" placeholder="…or paste image URLs (one per line)" style="flex: 1; resize: vertical;"></textarea>
        <button class="btn" id="editUrlLoadBtn" type="button" style="align-self: stretch;">Load</button>
      </div>
      <div class="upload-search-tip" style="margin-top: 8px;">Tip: paste an image (Ctrl/Cmd+V) anywhere in this dialog after copying it from your search results.</div>
    </div>
    <div class="row" style="justify-content:flex-end; gap:8px;">
      <button class="btn" data-close id="cancelEditBtn">Cancel</button>
      <button class="btn btn-primary" id="saveEditBtn">Save Changes</button>
    </div>
  `);
  wireFormCheckboxes();
  wireGarmentTypeChange();
  wireColorPickButton();
  if (window.ratingHelpers) window.ratingHelpers.wireRatingInputs();
  wireReceiptControls(item);
  wireEditPhotoControls(item);

  document.getElementById('cancelEditBtn').addEventListener('click', teardownEditPaste);

  // Wire up gallery thumb controls (remove and set-cover).
  // We merge any pending form-field edits into the dbUpdateItem call so
  // the user's typed changes (name/brand/color/etc.) survive the modal
  // re-render that follows a photo change.
  document.querySelectorAll('#editPhotoStrip [data-remove-index]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const i = Number(btn.dataset.removeIndex);
      const pendingFields = collectFormFieldsSilent() || {};
      const fresh = await dbGetItem(id);
      const photos = itemPhotos(fresh);
      photos.splice(i, 1);
      const updates = { ...pendingFields, photo: photos[0] || null, photos: photos.slice(1) };
      // Regenerate thumb if cover changed
      if (i === 0 && photos[0]) {
        try { updates.thumb = await makeThumbnail(photos[0], 800, 0.88); } catch (_) {}
      } else if (!photos[0]) {
        updates.thumb = null;
      }
      await dbUpdateItem(id, updates);
      teardownEditPaste();
      closeModal();
      showToast('Photo removed');
      openItemEdit(id);
    });
  });
  document.querySelectorAll('#editPhotoStrip .set-cover').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const i = Number(btn.dataset.photoIndex);
      const pendingFields = collectFormFieldsSilent() || {};
      const fresh = await dbGetItem(id);
      const photos = itemPhotos(fresh);
      const [chosen] = photos.splice(i, 1);
      photos.unshift(chosen);
      const updates = { ...pendingFields, photo: photos[0], photos: photos.slice(1) };
      try { updates.thumb = await makeThumbnail(photos[0], 800, 0.88); } catch (_) {}
      await dbUpdateItem(id, updates);
      teardownEditPaste();
      closeModal();
      showToast('Cover updated');
      openItemEdit(id);
    });
  });

  document.getElementById('saveEditBtn').addEventListener('click', async () => {
    const updates = collectFormFields();
    if (!updates) return;
    if (editPendingPhoto) {
      try {
        const newPhoto = await resizeImage(editPendingPhoto, 1200, 0.88);
        const fresh = await dbGetItem(id);
        const existingPhotos = itemPhotos(fresh);
        if (existingPhotos.length === 0) {
          // No existing photo — set as cover
          updates.photo = newPhoto;
          updates.thumb = await makeThumbnail(editPendingPhoto, 800, 0.88);
        } else {
          // Append to gallery
          updates.photo = fresh.photo;
          updates.thumb = fresh.thumb;
          updates.photos = [...(fresh.photos || []), newPhoto];
        }
      } catch (err) {
        alert('Failed to process new photo: ' + err.message);
        return;
      }
    }
    // Merge any receipt change recorded by wireReceiptControls.
    // undefined = no change, null = remove, Blob = replace.
    if (typeof pendingReceipt !== 'undefined') {
      updates.receipt = pendingReceipt;
    }
    await dbUpdateItem(id, updates);
    teardownEditPaste();
    closeModal();
    showToast('Changes saved');
    if (location.hash.startsWith('#/closet')) renderClosetView(document.getElementById('main'));
  });
}

// ===== Add item view =====
let pendingFile = null; // current photo File pending save
let pendingQueue = [];  // remaining files in batch
let addPasteHandler = null;

async function renderAddView(main) {
  pendingFile = null;
  pendingQueue = [];
  // Remove any previous paste handler (left over from prior visits to /add)
  if (addPasteHandler) {
    document.removeEventListener('paste', addPasteHandler);
    addPasteHandler = null;
  }

  main.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Add Item</h1>
        <div class="page-subtitle">Upload a photo and fill in the details. You can edit anything later.</div>
      </div>
    </div>

    <div id="uploadStage">
      <div class="upload-zone" id="uploadZone">
        <div style="font-size:32px; color: var(--text-faint); margin-bottom: 8px;">⬆</div>
        <div class="upload-zone-text"><strong>Click to choose photo(s)</strong> or drag and drop here</div>
        <div class="upload-zone-hint">JPG or PNG · Drop up to 5 photos for the same item (front, back, detail, etc.)</div>
        <input type="file" id="uploadInput" accept="image/*" multiple hidden />
      </div>

      <div class="upload-or">— or —</div>

      <div class="upload-search">
        <div class="upload-search-title">Don't have a photo yet? Search the web by name.</div>
        <div class="row" style="gap: 8px; align-items: stretch;">
          <input type="text" class="input" id="webSearchName" placeholder="e.g. Lululemon Wunder Train Tank Top" />
          <select class="select" id="webSearchEngine" style="width: auto; min-width: 150px;">
            <option value="google">Google Images</option>
            <option value="lululemon">Lululemon site</option>
            <option value="bing">Bing Images</option>
          </select>
          <button class="btn btn-primary" id="webSearchBtn" type="button">Search →</button>
        </div>
        <div class="upload-search-tip">
          <strong>Then:</strong> right-click the photo you like → <em>Copy image</em> → come back and press
          <kbd>Ctrl</kbd>+<kbd>V</kbd> (or <kbd>⌘</kbd>+<kbd>V</kbd> on Mac) anywhere on this page.
          You can also paste an image URL into the field below.
        </div>
        <div class="row" style="gap: 8px; margin-top: 10px; align-items: flex-start;">
          <textarea class="input" id="imageUrlInput" rows="3" placeholder="…or paste image URLs here (one per line — up to 5). Ctrl/⌘+Enter to load." style="flex: 1; resize: vertical;"></textarea>
          <button class="btn" id="loadUrlBtn" type="button" style="align-self: stretch;">Load</button>
        </div>
      </div>
    </div>

    <div id="formStage" hidden></div>
  `;

  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('uploadInput');
  zone.addEventListener('click', () => input.click());
  ['dragenter', 'dragover'].forEach(ev =>
    zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('dragover'); })
  );
  ['dragleave', 'drop'].forEach(ev =>
    zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('dragover'); })
  );
  zone.addEventListener('drop', e => {
    e.preventDefault();
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if (files.length) startBatch(files);
  });

  // Web search button
  document.getElementById('webSearchBtn').addEventListener('click', () => {
    const name = document.getElementById('webSearchName').value.trim();
    const engine = document.getElementById('webSearchEngine').value;
    if (!name) {
      document.getElementById('webSearchName').focus();
      return;
    }
    const q = encodeURIComponent(name);
    const url = engine === 'google'    ? `https://www.google.com/search?tbm=isch&q=${q}`
              : engine === 'bing'      ? `https://www.bing.com/images/search?q=${q}`
              : engine === 'lululemon' ? `https://shop.lululemon.com/search?Ntt=${q}`
              : `https://www.google.com/search?tbm=isch&q=${q}`;
    window.open(url, '_blank', 'noopener');
    showToast('Opened in new tab — copy an image and paste it here');
  });
  // Allow Enter in name field to trigger search
  document.getElementById('webSearchName').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('webSearchBtn').click(); }
  });

  // URL load button
  document.getElementById('loadUrlBtn').addEventListener('click', () => loadFromUrl());
  document.getElementById('imageUrlInput').addEventListener('keydown', e => {
    // Ctrl/Cmd+Enter loads; plain Enter keeps adding new lines for multi-URL paste
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); loadFromUrl(); }
  });

  // Paste anywhere on the Add page → use as photo
  addPasteHandler = async (e) => {
    if (!location.hash.startsWith('#/add')) return;
    // If user is pasting into a text field other than the URL field, leave it alone
    const t = e.target;
    const isTypingField = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') && t.id !== 'imageUrlInput';
    const items = (e.clipboardData && e.clipboardData.items) || [];
    for (const it of items) {
      if (it.kind === 'file' && it.type.startsWith('image/')) {
        const file = it.getAsFile();
        if (file) {
          e.preventDefault();
          showToast('Image pasted');
          startBatch([file]);
          return;
        }
      }
    }
    // No image — check for an image URL in clipboard text
    const text = e.clipboardData && e.clipboardData.getData('text/plain');
    if (text && /^https?:\/\//i.test(text.trim()) && !isTypingField) {
      e.preventDefault();
      const urlInput = document.getElementById('imageUrlInput');
      if (urlInput) urlInput.value = text.trim();
      loadFromUrl();
    }
  };
  document.addEventListener('paste', addPasteHandler);
  input.addEventListener('change', e => {
    const files = [...e.target.files].filter(f => f.type.startsWith('image/'));
    if (files.length) startBatch(files);
  });
}

const MAX_PHOTOS_PER_ITEM = 5;
let pendingFiles = []; // multiple photos for ONE item

function startBatch(files) {
  // Cap at 5 photos per item
  if (files.length > MAX_PHOTOS_PER_ITEM) {
    showToast(`Only the first ${MAX_PHOTOS_PER_ITEM} photos will be used`);
    files = files.slice(0, MAX_PHOTOS_PER_ITEM);
  }
  pendingFiles = files.slice();
  pendingFile = files[0]; // for backwards compat
  pendingQueue = []; // not used in this flow anymore
  showFileForm(files[0]);
}

function appendPhotoToPending(file) {
  if (pendingFiles.length >= MAX_PHOTOS_PER_ITEM) {
    showToast(`Already at the ${MAX_PHOTOS_PER_ITEM}-photo limit`);
    return false;
  }
  pendingFiles.push(file);
  pendingFile = pendingFiles[0];
  refreshAddPhotoStrip();
  return true;
}

function refreshAddPhotoStrip() {
  const strip = document.getElementById('addPhotoStrip');
  if (!strip) return;
  strip.innerHTML = pendingFiles.map((f, i) => {
    const u = URL.createObjectURL(f);
    return `<div class="gallery-thumb${i === 0 ? ' active' : ''}" data-pf-index="${i}" style="background-image:url('${u}')">
      ${i === 0 ? '<div class="gallery-thumb-cover-badge">★</div>' : ''}
      <div class="gallery-thumb-actions">
        ${i > 0 ? `<button class="gallery-thumb-action set-cover-pf" data-pf-cover="${i}">★</button>` : ''}
        <button class="gallery-thumb-action remove" data-pf-remove="${i}">×</button>
      </div>
    </div>`;
  }).join('') + (pendingFiles.length < MAX_PHOTOS_PER_ITEM ? `
    <button class="gallery-add-btn" id="addPhotoMoreBtn" title="Add another photo">+</button>
  ` : '');
  // Cover preview reflects the first file
  const preview = document.querySelector('.upload-preview-image');
  if (preview && pendingFiles[0]) {
    preview.style.backgroundImage = `url('${URL.createObjectURL(pendingFiles[0])}')`;
  }
  // Wire controls
  strip.querySelectorAll('[data-pf-remove]').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const i = Number(b.dataset.pfRemove);
      pendingFiles.splice(i, 1);
      if (pendingFiles.length === 0) {
        // No photos left — restart upload stage
        renderAddView(document.getElementById('main'));
        return;
      }
      pendingFile = pendingFiles[0];
      refreshAddPhotoStrip();
    });
  });
  strip.querySelectorAll('[data-pf-cover]').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const i = Number(b.dataset.pfCover);
      const [chosen] = pendingFiles.splice(i, 1);
      pendingFiles.unshift(chosen);
      pendingFile = pendingFiles[0];
      refreshAddPhotoStrip();
    });
  });
  const addMoreBtn = document.getElementById('addPhotoMoreBtn');
  if (addMoreBtn) {
    addMoreBtn.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.multiple = true;
      inp.addEventListener('change', e => {
        const files = [...e.target.files].filter(f => f.type.startsWith('image/'));
        for (const f of files) {
          if (!appendPhotoToPending(f)) break;
        }
      });
      inp.click();
    });
  }
}

function _splitUrls(text) {
  return (text || '')
    .split(/[\s,;]+/)
    .map(u => u.trim())
    .filter(u => /^https?:\/\//i.test(u));
}

async function loadFromUrl() {
  const urlInput = document.getElementById('imageUrlInput');
  if (!urlInput) return;
  const urls = _splitUrls(urlInput.value);
  if (urls.length === 0) {
    alert('Please paste at least one https:// image URL.');
    return;
  }
  const btn = document.getElementById('loadUrlBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }

  // Honor the 5-photo cap based on what's already pending
  const remaining = MAX_PHOTOS_PER_ITEM - pendingFiles.length;
  const toFetch = urls.slice(0, Math.max(0, remaining));
  if (toFetch.length < urls.length) {
    showToast(`Only loading ${toFetch.length} of ${urls.length} (5-photo limit)`);
  }

  const fetched = [];
  const failed = [];
  for (let i = 0; i < toFetch.length; i++) {
    if (btn) btn.textContent = `Loading ${i + 1}/${toFetch.length}…`;
    try {
      const blob = await fetchImageBlob(toFetch[i]);
      fetched.push(new File([blob], `web-image-${i + 1}.jpg`, { type: blob.type || 'image/jpeg' }));
    } catch (err) {
      failed.push({ url: toFetch[i], message: err.message });
    }
  }

  if (fetched.length > 0) {
    if (pendingFiles.length === 0) {
      // First photos for this item — start the batch
      startBatch(fetched);
    } else {
      // Append to existing pending photos
      for (const f of fetched) appendPhotoToPending(f);
    }
    urlInput.value = '';
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Load'; }

  if (failed.length > 0) {
    const lines = failed.map(f => `  ${f.url}\n    → ${f.message}`).join('\n');
    alert(`Loaded ${fetched.length} of ${toFetch.length} images.\n\nFailed:\n${lines}\n\nTip: right-click those images in your browser, "Save image as…", then drop the file(s) in the upload zone.`);
  }
}

async function showFileForm(file) {
  pendingFile = file;
  const previewUrl = URL.createObjectURL(file);

  document.getElementById('uploadStage').hidden = true;
  const stage = document.getElementById('formStage');
  stage.hidden = false;

  stage.innerHTML = `
    <div class="upload-preview">
      <div>
        <div class="upload-preview-image" style="background-image:url('${previewUrl}')"></div>
        <div class="gallery-thumbs" id="addPhotoStrip" style="margin-top: 10px;"></div>
        <div class="muted" style="font-size: 11.5px; margin-top: 6px;">Up to ${MAX_PHOTOS_PER_ITEM} photos. Click + to add more, ★ to set cover, × to remove.</div>
      </div>
      <div>${itemFormFieldsHtml({})}</div>
    </div>
    <div class="divider"></div>
    <div class="row">
      <button class="btn" id="cancelAddBtn">Cancel</button>
      <div class="spacer"></div>
      <button class="btn btn-primary" id="saveAddBtn">Save Item</button>
    </div>
  `;

  wireFormCheckboxes();
  wireGarmentTypeChange();
  wireColorPickButton();
  if (window.ratingHelpers) window.ratingHelpers.wireRatingInputs();
  wireReceiptControls({});
  refreshAddPhotoStrip();

  document.getElementById('cancelAddBtn').addEventListener('click', () => {
    pendingFiles = [];
    pendingFile = null;
    renderAddView(document.getElementById('main'));
  });
  document.getElementById('saveAddBtn').addEventListener('click', async () => {
    const data = collectFormFields();
    if (!data) return;
    try {
      const cover = pendingFiles[0] || pendingFile;
      const photo = await resizeImage(cover, 1200, 0.88);
      const thumb = await makeThumbnail(cover, 800, 0.88);
      const extras = [];
      for (let i = 1; i < pendingFiles.length; i++) {
        extras.push(await resizeImage(pendingFiles[i], 1200, 0.88));
      }
      const receiptField = (typeof pendingReceipt !== 'undefined' && pendingReceipt) ? { receipt: pendingReceipt } : {};
      await dbAddItem({ ...data, photo, thumb, photos: extras, ...receiptField });
      const photoCount = pendingFiles.length;
      pendingFiles = [];
      pendingFile = null;
      showToast(`Item saved with ${photoCount} photo${photoCount === 1 ? '' : 's'}`);
      // Navigate to closet so the user can see the saved item
      location.hash = '#/closet';
    } catch (err) {
      console.error(err);
      alert('Failed to save: ' + err.message);
    }
  });
}

function advanceQueue() {
  if (pendingQueue.length > 0) {
    const next = pendingQueue.shift();
    showFileForm(next);
  } else {
    location.hash = '#/closet';
  }
}

function itemFormFieldsHtml(item) {
  return `
    <div class="form-grid">
      <div class="field full">
        <label class="field-label" for="f_name">Name <span class="muted">(optional)</span></label>
        <input class="input" id="f_name" type="text" placeholder="e.g. Black Levi's 501" value="${escapeHtml(item.name || '')}" />
        <div class="field-hint">If left blank, we'll display the category and subtype.</div>
      </div>

      <div class="field">
        <label class="field-label" for="f_garmentType">Category *</label>
        <select class="select" id="f_garmentType" required>
          <option value="">Choose…</option>
          ${Object.entries(GARMENT_TYPES).map(([id, t]) =>
            `<option value="${id}" ${item.garmentType === id ? 'selected' : ''}>${t.label}</option>`
          ).join('')}
        </select>
      </div>

      <div class="field">
        <label class="field-label" for="f_subtype">Type <span class="muted">(pick or type your own)</span></label>
        <input class="input" id="f_subtype" list="f_subtype_list" placeholder="Choose category first or type a custom type" autocomplete="off" value="${escapeHtml(item.subtype || '')}" />
        <datalist id="f_subtype_list">
          ${item.garmentType && GARMENT_TYPES[item.garmentType] ?
            GARMENT_TYPES[item.garmentType].subtypes.map(s =>
              `<option value="${escapeHtml(s)}"></option>`
            ).join('') : ''}
        </datalist>
      </div>

      <div class="field">
        <label class="field-label" for="f_color">Color <span class="muted">(pick or type your own)</span></label>
        <div class="row" style="gap: 8px; align-items: stretch;">
          <input class="input" id="f_color" list="f_color_list" placeholder="Choose or type a color" autocomplete="off" value="${escapeHtml(item.color || '')}" style="flex: 1;" />
          <button type="button" class="btn" id="f_color_pick" title="Auto-detect from the uploaded photo">From photo</button>
        </div>
        <datalist id="f_color_list">
          ${COLORS.map(c => `<option value="${c}"></option>`).join('')}
        </datalist>
        <div class="muted" id="f_color_pick_hint" style="font-size: 11px; margin-top: 4px;">Tip: upload a photo first, then click "From photo" to auto-fill.</div>
      </div>

      <div class="field">
        <label class="field-label" for="f_brand">Brand</label>
        <input class="input" id="f_brand" type="text" placeholder="e.g. Nike, Levi's, J.Crew" value="${escapeHtml(item.brand || '')}" />
      </div>

      <div class="field">
        <label class="field-label" for="f_size">Size</label>
        <input class="input" id="f_size" type="text" placeholder="e.g. M, 32x30, 9.5" value="${escapeHtml(item.size || '')}" />
      </div>

      <div class="field">
        <label class="field-label" for="f_purchaseDate">Purchase Date</label>
        <input class="input" id="f_purchaseDate" type="date" value="${escapeHtml(item.purchaseDate || '')}" />
      </div>

      <div class="field">
        <label class="field-label" for="f_purchasePrice">Purchase Price</label>
        <input class="input" id="f_purchasePrice" type="number" step="0.01" min="0" placeholder="0.00" value="${item.purchasePrice ?? ''}" />
      </div>

      <div class="field">
        <label class="field-label" for="f_originalPrice">Original Price <span class="muted">(optional — what it cost before discount)</span></label>
        <input class="input" id="f_originalPrice" type="number" step="0.01" min="0" placeholder="0.00" value="${item.originalPrice ?? ''}" />
      </div>

      <div class="field">
        <label class="field-label" for="f_returnWindow">Return Window <span class="muted">(days from purchase)</span></label>
        <input class="input" id="f_returnWindow" type="number" min="0" max="365" placeholder="30" value="${item.returnWindowDays ?? ''}" />
      </div>

      <div class="field full">
        <label class="field-label">Lifestyle</label>
        <div class="checks" id="f_lifestyle">
          ${LIFESTYLE_CATEGORIES.map(c => `
            <label class="check ${(item.lifestyleCategories || []).includes(c.id) ? 'checked' : ''}">
              <input type="checkbox" value="${c.id}" ${(item.lifestyleCategories || []).includes(c.id) ? 'checked' : ''} />
              ${c.label}
            </label>
          `).join('')}
        </div>
      </div>

      <div class="field full">
        <label class="field-label">Seasons</label>
        <div class="checks" id="f_seasons">
          ${SEASONS.map(s => `
            <label class="check ${(item.seasons || []).includes(s.id) ? 'checked' : ''}">
              <input type="checkbox" value="${s.id}" ${(item.seasons || []).includes(s.id) ? 'checked' : ''} />
              ${s.label}
            </label>
          `).join('')}
        </div>
      </div>

      <div class="field">
        <label class="field-label" for="f_status">Status</label>
        <select class="select" id="f_status">
          ${ITEM_STATUSES.map(s => `<option value="${s.id}" ${(item.status || '') === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}
        </select>
      </div>

      <div class="field full">
        <label class="field-label" for="f_tags">Tags <span class="muted">(comma separated)</span></label>
        <input class="input" id="f_tags" type="text" placeholder="e.g. wedding, work-friendly, needs hemming" value="${escapeHtml((item.tags || []).join(', '))}" />
      </div>

      <div class="field full">
        <label class="field-label">My rating</label>
        <div class="rating-group">
          <label class="check ${item.favorite ? 'checked' : ''}" style="display: inline-flex; gap: 6px; align-items: center; margin-bottom: 8px;">
            <input type="checkbox" id="f_favorite" ${item.favorite ? 'checked' : ''} />
            ❤ Favorite (heart on the closet card)
          </label>
          ${(window.ratingHelpers ? window.ratingHelpers.ratingInputHtml('rating', 'Overall', item.rating) : '')}
          <div class="rating-axes">
            ${(window.ratingHelpers ? window.ratingHelpers.ratingInputHtml('ratingFit', 'Fit', item.ratingFit) : '')}
            ${(window.ratingHelpers ? window.ratingHelpers.ratingInputHtml('ratingComfort', 'Comfort', item.ratingComfort) : '')}
            ${(window.ratingHelpers ? window.ratingHelpers.ratingInputHtml('ratingStyle', 'Style', item.ratingStyle) : '')}
            ${(window.ratingHelpers ? window.ratingHelpers.ratingInputHtml('ratingVersatility', 'Versatility', item.ratingVersatility) : '')}
          </div>
          <div class="muted" style="font-size: 11px; margin-top: 6px;">Set Overall directly, or leave it blank and we'll average the four axes.</div>
        </div>
      </div>

      <div class="field full">
        <label class="field-label" for="f_notes">Notes</label>
        <textarea class="textarea" id="f_notes" placeholder="Anything to remember about this piece…">${escapeHtml(item.notes || '')}</textarea>
      </div>

      <div class="field full">
        <label class="field-label">List for sale</label>
        <label class="check ${item.forSale ? 'checked' : ''}" style="display: inline-flex; gap: 6px; align-items: center;">
          <input type="checkbox" id="f_forSale" ${item.forSale ? 'checked' : ''} />
          Show in my Shop tab — buyers can offer or negotiate
        </label>
      </div>

      <div class="field">
        <label class="field-label" for="f_askingPrice">Asking Price <span class="muted">(if listed for sale)</span></label>
        <input class="input" id="f_askingPrice" type="number" step="0.01" min="0" placeholder="0.00" value="${item.askingPrice ?? ''}" />
      </div>

      <div class="field full">
        <label class="field-label" for="f_listingDescription">Listing Description <span class="muted">(condition, fit, why selling)</span></label>
        <textarea class="textarea" id="f_listingDescription" placeholder="e.g. Worn twice, like new. True to size. Selling because color isn't for me.">${escapeHtml(item.listingDescription || '')}</textarea>
      </div>

      <div class="field full">
        <label class="field-label" for="f_receipt">Receipt / Invoice <span class="muted">(PDF or image, kept on this device)</span></label>
        <div class="row" style="gap: 8px; align-items: center; flex-wrap: wrap;">
          <input class="input" id="f_receipt" type="file" accept="application/pdf,image/*" style="flex: 1;" />
          ${item.receipt ? `<span class="muted" id="f_receipt_status" style="font-size: 12px;">Already attached (${item.receipt.type === 'application/pdf' ? 'PDF' : 'Image'})</span>
          <button type="button" class="btn btn-ghost btn-sm" id="f_receipt_clear">Remove</button>` : '<span class="muted" id="f_receipt_status" style="font-size: 12px;">No receipt yet</span>'}
        </div>
      </div>
    </div>
  `;
}

function wireFormCheckboxes() {
  document.querySelectorAll('.checks .check input').forEach(input => {
    input.addEventListener('change', () => {
      input.parentElement.classList.toggle('checked', input.checked);
    });
  });
}

function wireGarmentTypeChange() {
  const typeSel = document.getElementById('f_garmentType');
  const subtypeList = document.getElementById('f_subtype_list');
  if (!typeSel || !subtypeList) return;
  typeSel.addEventListener('change', () => {
    const t = typeSel.value;
    if (t && GARMENT_TYPES[t]) {
      subtypeList.innerHTML = GARMENT_TYPES[t].subtypes.map(s => `<option value="${escapeHtml(s)}"></option>`).join('');
    } else {
      subtypeList.innerHTML = '';
    }
  });
}

// Pending receipt change for the currently-open form. undefined = no change,
// null = remove, Blob = replace.
let pendingReceipt;

function wireReceiptControls(item) {
  pendingReceipt = undefined;
  const input = document.getElementById('f_receipt');
  const status = document.getElementById('f_receipt_status');
  const clear = document.getElementById('f_receipt_clear');
  if (!input) return;
  input.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) {
      pendingReceipt = undefined;
      return;
    }
    pendingReceipt = f;
    if (status) {
      const kind = f.type === 'application/pdf' ? 'PDF' : 'Image';
      status.textContent = `New ${kind} ready to save (${(f.size / 1024).toFixed(0)} KB)`;
    }
  });
  if (clear) {
    clear.addEventListener('click', () => {
      pendingReceipt = null;
      input.value = '';
      if (status) status.textContent = 'Receipt will be removed on save';
      clear.disabled = true;
    });
  }
}

// "From photo" auto-color button: extract dominant color from the current
// pending photo (Add view) or the cover photo (Edit modal) and pre-fill
// the f_color input. Doesn't override anything the user has already typed
// — but does refresh confidently when they explicitly click the button.
function wireColorPickButton() {
  const btn = document.getElementById('f_color_pick');
  const colorInput = document.getElementById('f_color');
  const hint = document.getElementById('f_color_pick_hint');
  if (!btn || !colorInput) return;
  btn.addEventListener('click', async () => {
    if (typeof pickColorFromBlob !== 'function') return;
    // Find a photo source: prefer Add view's pendingFile, else first
    // pendingFiles entry, else the Edit modal's cover preview blob URL.
    let blob = null;
    if (typeof pendingFile !== 'undefined' && pendingFile) blob = pendingFile;
    else if (typeof pendingFiles !== 'undefined' && pendingFiles && pendingFiles[0]) blob = pendingFiles[0];
    else {
      // Try the Edit modal's cover image (fetched as a blob).
      const preview = document.querySelector('.edit-photo-preview, .upload-preview-image');
      const bg = preview && preview.style.backgroundImage;
      const m = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (m && m[1]) {
        try {
          const resp = await fetch(m[1]);
          blob = await resp.blob();
        } catch (_) { blob = null; }
      }
    }
    if (!blob) {
      if (hint) hint.textContent = 'No photo loaded yet — upload one first, then try again.';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Reading…';
    try {
      const result = await pickColorFromBlob(blob);
      if (result && result.name) {
        colorInput.value = result.name;
        colorInput.dispatchEvent(new Event('input', { bubbles: true }));
        if (hint) {
          const [r, g, b] = result.rgb;
          hint.innerHTML = `Detected <strong>${escapeHtml(result.name)}</strong> (RGB ${r},${g},${b}). Edit if it's off.`;
        }
      } else if (hint) {
        hint.textContent = 'Could not detect a clear color from this photo.';
      }
    } finally {
      btn.disabled = false;
      btn.textContent = 'From photo';
    }
  });
}

// Silently capture whatever's in the edit form right now — used when a
// side-effect action (photo remove, set-cover) needs to persist alongside
// pending form edits so the user's typed changes aren't blown away when
// the modal re-renders. Returns null if the form isn't present.
function collectFormFieldsSilent() {
  const gt = document.getElementById('f_garmentType');
  if (!gt) return null;
  const lifestyleCategories = [...document.querySelectorAll('#f_lifestyle input:checked')].map(i => i.value);
  const seasons = [...document.querySelectorAll('#f_seasons input:checked')].map(i => i.value);
  const tagsRaw = (document.getElementById('f_tags') || {}).value || '';
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const priceRaw = (document.getElementById('f_purchasePrice') || {}).value || '';
  const origRaw = (document.getElementById('f_originalPrice') || {}).value || '';
  const returnRaw = (document.getElementById('f_returnWindow') || {}).value || '';
  const askingRaw = (document.getElementById('f_askingPrice') || {}).value || '';
  const get = id => (document.getElementById(id) || {}).value || '';
  return {
    name: get('f_name').trim(),
    garmentType: gt.value,
    subtype: get('f_subtype'),
    color: get('f_color'),
    brand: get('f_brand').trim(),
    size: get('f_size').trim(),
    purchaseDate: get('f_purchaseDate'),
    purchasePrice: priceRaw ? Number(priceRaw) : null,
    originalPrice: origRaw ? Number(origRaw) : null,
    returnWindowDays: returnRaw ? Number(returnRaw) : null,
    forSale: !!(document.getElementById('f_forSale') || {}).checked,
    askingPrice: askingRaw ? Number(askingRaw) : null,
    listingDescription: get('f_listingDescription').trim(),
    lifestyleCategories,
    seasons,
    tags,
    notes: get('f_notes').trim(),
    status: get('f_status') || '',
    favorite: !!(document.getElementById('f_favorite') || {}).checked,
    ...(window.ratingHelpers ? window.ratingHelpers.collectRatings() : {}),
  };
}

function collectFormFields() {
  const garmentType = document.getElementById('f_garmentType').value;
  if (!garmentType) {
    alert('Please choose a category.');
    return null;
  }
  const lifestyleCategories = [...document.querySelectorAll('#f_lifestyle input:checked')].map(i => i.value);
  const seasons = [...document.querySelectorAll('#f_seasons input:checked')].map(i => i.value);
  const tagsRaw = document.getElementById('f_tags').value || '';
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const priceRaw = document.getElementById('f_purchasePrice').value;
  const origRaw = (document.getElementById('f_originalPrice') || {}).value || '';
  const returnRaw = (document.getElementById('f_returnWindow') || {}).value || '';
  const askingRaw = (document.getElementById('f_askingPrice') || {}).value || '';
  return {
    name: document.getElementById('f_name').value.trim(),
    garmentType,
    subtype: document.getElementById('f_subtype').value,
    color: document.getElementById('f_color').value,
    brand: document.getElementById('f_brand').value.trim(),
    size: document.getElementById('f_size').value.trim(),
    purchaseDate: document.getElementById('f_purchaseDate').value,
    purchasePrice: priceRaw ? Number(priceRaw) : null,
    originalPrice: origRaw ? Number(origRaw) : null,
    returnWindowDays: returnRaw ? Number(returnRaw) : null,
    forSale: !!(document.getElementById('f_forSale') || {}).checked,
    askingPrice: askingRaw ? Number(askingRaw) : null,
    listingDescription: (document.getElementById('f_listingDescription') || {}).value?.trim() || '',
    lifestyleCategories,
    seasons,
    tags,
    notes: document.getElementById('f_notes').value.trim(),
    status: (document.getElementById('f_status') || {}).value || '',
    favorite: !!(document.getElementById('f_favorite') || {}).checked,
    ...(window.ratingHelpers ? window.ratingHelpers.collectRatings() : {}),
  };
}

// ===== Review walk-through =====
let reviewQueue = [];

function startReviewWalkthrough(ids) {
  reviewQueue = [...ids];
  reviewNext();
}

async function reviewNext() {
  if (reviewQueue.length === 0) {
    sessionStorage.removeItem('vc:lastImportIds');
    closeModal();
    showToast('Review complete');
    if (location.hash.startsWith('#/closet')) renderClosetView(document.getElementById('main'));
    return;
  }
  const id = reviewQueue.shift();
  const remaining = reviewQueue.length;
  const item = await dbGetItem(id);
  if (!item) { reviewNext(); return; }
  const url = item.photo ? blobToUrl(item.photo) : '';
  teardownEditPaste();

  openModal(`
    <div class="batch-bar"><strong>Reviewing imported items</strong> · ${remaining} more after this one</div>
    <h2 style="margin-bottom:6px;">${escapeHtml(item.name || 'Untitled')}</h2>
    <div class="muted" style="margin-bottom:18px;">Verify the details below, then save to continue.</div>
    <div class="upload-preview" style="margin-bottom:18px;">
      <div class="upload-preview-image edit-photo-preview" style="background-image:url('${url}'); cursor: pointer;" title="Drop or click to replace photo"></div>
      <div>${itemFormFieldsHtml(item)}</div>
    </div>
    <div class="row" style="justify-content:space-between; gap:8px;">
      <button class="btn" id="stopReviewBtn">Stop reviewing</button>
      <div class="row" style="gap:8px;">
        <button class="btn btn-danger" id="deleteReviewBtn">Delete</button>
        <button class="btn" id="skipReviewBtn">Skip</button>
        <button class="btn btn-primary" id="saveReviewBtn">Save & Next →</button>
      </div>
    </div>
  `);
  wireFormCheckboxes();
  wireGarmentTypeChange();
  wireColorPickButton();
  if (window.ratingHelpers) window.ratingHelpers.wireRatingInputs();
  wireReceiptControls(item);
  wireEditPhotoControls(item);

  document.getElementById('stopReviewBtn').addEventListener('click', () => {
    reviewQueue = [];
    sessionStorage.removeItem('vc:lastImportIds');
    teardownEditPaste();
    closeModal();
    if (location.hash.startsWith('#/closet')) renderClosetView(document.getElementById('main'));
  });
  document.getElementById('skipReviewBtn').addEventListener('click', () => {
    teardownEditPaste();
    closeModal();
    setTimeout(reviewNext, 80);
  });
  document.getElementById('saveReviewBtn').addEventListener('click', async () => {
    const updates = collectFormFields();
    if (!updates) return;
    if (editPendingPhoto) {
      try {
        updates.photo = await resizeImage(editPendingPhoto, 1200, 0.88);
        updates.thumb = await makeThumbnail(editPendingPhoto, 800, 0.88);
      } catch (err) {
        alert('Failed to process new photo: ' + err.message);
        return;
      }
    }
    if (typeof pendingReceipt !== 'undefined') {
      updates.receipt = pendingReceipt;
    }
    await dbUpdateItem(id, updates);
    teardownEditPaste();
    showToast('Saved');
    setTimeout(reviewNext, 80);
  });
  document.getElementById('deleteReviewBtn').addEventListener('click', async () => {
    const itemName = item.name || item.subtype || labelForGarmentType(item.garmentType) || 'this item';
    if (!confirm(`Delete "${itemName}"?\n\nThis cannot be undone.`)) return;
    await dbDeleteItem(id);
    teardownEditPaste();
    showToast('Deleted');
    closeModal();
    setTimeout(reviewNext, 80);
  });
}


/* ===== js/wear-r1.js ===== */
// wear-r1.js — Wear tracking helpers + UI integration
// Adds a wearLog: number[] array of millisecond timestamps to each item.
// Hooks into the item detail modal to add a "I wore this today" button
// and a wear stats block, and decorates closet cards with a wear badge.

(function() {
  // ============== Helpers (exposed as globals) ==============
  window.wearCount = function(item) { return (item && item.wearLog || []).length; };
  window.lastWornAt = function(item) {
    const log = (item && item.wearLog) || [];
    return log.length ? Math.max(...log) : null;
  };
  window.daysSinceLastWear = function(item) {
    const last = window.lastWornAt(item);
    if (!last) return null;
    return Math.floor((Date.now() - last) / 86400000);
  };
  window.recordWear = async function(itemId, timestamp) {
    if (typeof dbGetItem !== 'function' || typeof dbUpdateItem !== 'function') return;
    const item = await dbGetItem(itemId);
    if (!item) return;
    const log = ((item.wearLog) || []).slice();
    log.push(timestamp || Date.now());
    await dbUpdateItem(itemId, { wearLog: log });
    if (typeof showToast === 'function') showToast('Logged a wear · total ' + log.length);
  };
  window.removeLastWear = async function(itemId) {
    const item = await dbGetItem(itemId);
    if (!item || !(item.wearLog || []).length) return;
    const log = item.wearLog.slice();
    log.pop();
    await dbUpdateItem(itemId, { wearLog: log });
    if (typeof showToast === 'function') showToast('Removed last wear');
  };

  function fmtRelativeDays(d) {
    if (d === 0) return 'today';
    if (d === 1) return 'yesterday';
    if (d < 7) return d + ' days ago';
    if (d < 30) return Math.floor(d / 7) + 'w ago';
    if (d < 365) return Math.floor(d / 30) + 'mo ago';
    return Math.floor(d / 365) + 'y ago';
  }
  window.fmtRelativeDays = fmtRelativeDays;

  // ============== Inject "Wore today" UI into item detail modal ==============
  // Watches the modal for changes; when an item detail renders, append a wear card.
  function enhanceItemDetail() {
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    const detail = modalContent.querySelector('.item-detail');
    if (!detail) return;
    if (modalContent.querySelector('.wear-card')) return; // already added
    const editBtn = modalContent.querySelector('#editItemBtn');
    if (!editBtn) return;
    // Pull the item id from the wired delete button (or fallback)
    const deleteBtn = modalContent.querySelector('#deleteItemBtn');
    if (!deleteBtn) return;

    // Find the item id by hitting the data-item-id of the most recently clicked card
    // OR by re-reading the DOM. We'll pull it from the actions container's parent context:
    // The simplest path is to attach the id at button click time; we'll do that via delegation.
    // Here we assume the modal is open for whichever item is in window._wearCurrentItemId
    const id = window._wearCurrentItemId;
    if (!id) return;

    dbGetItem(id).then(item => {
      if (!item) return;
      const count = wearCount(item);
      const last = lastWornAt(item);
      const sinceTxt = last ? fmtRelativeDays(daysSinceLastWear(item)) : 'never logged';
      const wearCard = document.createElement('div');
      wearCard.className = 'wear-card';
      wearCard.innerHTML = `
        <div class="wear-card-stats">
          <div class="wear-stat">
            <div class="wear-stat-label">Times worn</div>
            <div class="wear-stat-value">${count}</div>
          </div>
          <div class="wear-stat">
            <div class="wear-stat-label">Last worn</div>
            <div class="wear-stat-value">${sinceTxt}</div>
          </div>
        </div>
        <div class="wear-card-actions">
          <button class="btn btn-primary" id="wearTodayBtn">+ I wore this today</button>
          ${count > 0 ? '<button class="btn btn-ghost btn-sm" id="wearUndoBtn">Undo last</button>' : ''}
        </div>
      `;
      // Insert into the info column (after the action buttons)
      const actions = modalContent.querySelector('.item-detail-actions');
      if (actions) actions.parentElement.insertBefore(wearCard, actions.nextSibling);
      else modalContent.querySelector('.item-detail-info')?.appendChild(wearCard);

      document.getElementById('wearTodayBtn')?.addEventListener('click', async () => {
        await recordWear(id);
        // Re-fetch and refresh just the wear card
        const fresh = await dbGetItem(id);
        const c = wearCount(fresh);
        const l = lastWornAt(fresh);
        wearCard.querySelector('.wear-stat-value').textContent = c;
        const stats = wearCard.querySelectorAll('.wear-stat-value');
        if (stats[1]) stats[1].textContent = l ? fmtRelativeDays(daysSinceLastWear(fresh)) : 'never logged';
        // If first wear, add the undo button
        if (c === 1 && !document.getElementById('wearUndoBtn')) {
          const actionsRow = wearCard.querySelector('.wear-card-actions');
          actionsRow.insertAdjacentHTML('beforeend', '<button class="btn btn-ghost btn-sm" id="wearUndoBtn">Undo last</button>');
          document.getElementById('wearUndoBtn').addEventListener('click', wearUndoHandler);
        }
      });
      document.getElementById('wearUndoBtn')?.addEventListener('click', wearUndoHandler);

      async function wearUndoHandler() {
        await removeLastWear(id);
        const fresh = await dbGetItem(id);
        const c = wearCount(fresh);
        const l = lastWornAt(fresh);
        wearCard.querySelector('.wear-stat-value').textContent = c;
        const stats = wearCard.querySelectorAll('.wear-stat-value');
        if (stats[1]) stats[1].textContent = l ? fmtRelativeDays(daysSinceLastWear(fresh)) : 'never logged';
        if (c === 0) document.getElementById('wearUndoBtn')?.remove();
      }
    });
  }

  // Hook into card clicks to remember which item is currently being viewed
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-item-id]');
    if (card) {
      window._wearCurrentItemId = Number(card.dataset.itemId);
    }
  }, true);

  // Watch the modal for content changes (when openItemDetail renders)
  const modalContent = document.getElementById('modalContent');
  if (modalContent) {
    new MutationObserver(() => {
      // Defer slightly so DOM is fully rendered
      setTimeout(enhanceItemDetail, 30);
    }).observe(modalContent, { childList: true });
  }

  // Decorate closet cards with a wear badge after they render
  function decorateCards() {
    const cards = document.querySelectorAll('.card[data-item-id]:not([data-wear-decorated])');
    if (cards.length === 0) return;
    Promise.all([...cards].map(async card => {
      card.setAttribute('data-wear-decorated', '1');
      const id = Number(card.dataset.itemId);
      try {
        const item = await dbGetItem(id);
        if (!item) return;
        const count = wearCount(item);
        if (count === 0) return;
        const cardImage = card.querySelector('.card-image');
        if (!cardImage || cardImage.querySelector('.wear-badge')) return;
        const badge = document.createElement('div');
        badge.className = 'wear-badge';
        badge.textContent = count + 'x';
        badge.title = 'Worn ' + count + ' time' + (count === 1 ? '' : 's');
        cardImage.appendChild(badge);
      } catch (_) {}
    }));
  }
  // Run periodically (cheap) so cards from any view get decorated
  setInterval(decorateCards, 600);
})();


/* ===== js/bgremove-r1.js ===== */
// bgremove-r1.js — Canvas-based background removal for plain/light backgrounds.
// Samples the four corners to detect bg color, then flood-fills outward from
// each corner with a tolerance threshold. Pixels matching the bg become
// transparent. Works well for product photos against white/light backgrounds;
// degrades gracefully on busy backgrounds (user can revert).

(function() {
  const TOLERANCE = 32;            // 0-255 per-channel diff
  const FEATHER_PASSES = 1;        // soften the cutout edge
  const MIN_BG_AGREEMENT = 3;      // require N of 4 corners to agree it's a uniform bg

  function colorDist(a, b) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
  }

  function sampleCorner(data, w, h, cx, cy, size = 8) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = Math.max(0, cy); y < Math.min(h, cy + size); y++) {
      for (let x = Math.max(0, cx); x < Math.min(w, cx + size); x++) {
        const i = (y * w + x) * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    }
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  }

  function detectBackground(imageData) {
    const { data, width: w, height: h } = imageData;
    const corners = [
      sampleCorner(data, w, h, 0, 0),
      sampleCorner(data, w, h, w - 8, 0),
      sampleCorner(data, w, h, 0, h - 8),
      sampleCorner(data, w, h, w - 8, h - 8),
    ];
    // Average corner color as candidate bg
    const avg = corners.reduce((s, c) => [s[0] + c[0], s[1] + c[1], s[2] + c[2]], [0, 0, 0])
      .map(v => Math.round(v / corners.length));
    // Count corners within tolerance of the average
    const agree = corners.filter(c => colorDist(c, avg) <= TOLERANCE).length;
    return { color: avg, confidence: agree, corners };
  }

  function floodFillBackground(imageData, bgColor) {
    const { data, width: w, height: h } = imageData;
    const visited = new Uint8Array(w * h);
    const stack = [];
    // Seed from each corner
    [
      [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    ].forEach(([x, y]) => stack.push(y * w + x));

    while (stack.length) {
      const idx = stack.pop();
      if (visited[idx]) continue;
      const x = idx % w;
      const y = Math.floor(idx / w);
      const di = idx * 4;
      const px = [data[di], data[di + 1], data[di + 2]];
      if (colorDist(px, bgColor) > TOLERANCE) continue;
      visited[idx] = 1;
      data[di + 3] = 0; // transparent
      // Push 4-neighbors
      if (x > 0) stack.push(idx - 1);
      if (x < w - 1) stack.push(idx + 1);
      if (y > 0) stack.push(idx - w);
      if (y < h - 1) stack.push(idx + w);
    }
    return imageData;
  }

  function featherEdges(imageData, passes = 1) {
    const { data, width: w, height: h } = imageData;
    for (let p = 0; p < passes; p++) {
      const next = new Uint8ClampedArray(data);
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = (y * w + x) * 4 + 3;
          // If pixel is opaque but has any transparent neighbor, halve alpha
          if (data[i] > 0) {
            const neighbors = [
              data[i - 4], data[i + 4],
              data[i - w * 4], data[i + w * 4],
            ];
            if (neighbors.some(a => a < 128)) {
              next[i] = Math.floor(data[i] * 0.6);
            }
          }
        }
      }
      data.set(next);
    }
    return imageData;
  }

  // Public API: takes a Blob/File, returns a Promise<Blob> (PNG with transparency)
  // and a confidence score.
  window.removeBackgroundFromImage = async function(blob, options = {}) {
    const tol = options.tolerance || TOLERANCE;
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise((res, rej) => {
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = rej;
        im.src = url;
      });
      // Cap canvas size to keep processing fast
      const maxSide = options.maxSide || 1200;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const bg = detectBackground(imgData);
      if (bg.confidence < MIN_BG_AGREEMENT) {
        return { blob: null, confidence: bg.confidence / 4, reason: 'Background looks busy — corners disagree.' };
      }
      floodFillBackground(imgData, bg.color);
      featherEdges(imgData, FEATHER_PASSES);
      ctx.putImageData(imgData, 0, 0);
      const outBlob = await new Promise(r => canvas.toBlob(r, 'image/png'));
      return { blob: outBlob, confidence: bg.confidence / 4 };
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  // Hook a "Remove background" button into the upload preview area.
  // The button appears next to any .upload-preview-image with data-can-bg="1"
  // OR we add the button via a global "Remove background" link on every photo upload.
  function addBgRemoveButton() {
    document.querySelectorAll('.upload-preview-image:not([data-bg-button])').forEach(el => {
      el.setAttribute('data-bg-button', '1');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm bg-remove-btn';
      btn.textContent = 'Remove background';
      btn.style.cssText = 'position: absolute; bottom: 8px; left: 8px; font-size: 10.5px; letter-spacing: 0.12em; padding: 5px 10px; background: rgba(255,255,255,0.94); border: 1px solid rgba(0,0,0,0.1);';
      el.style.position = 'relative';
      el.appendChild(btn);
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        // Pull the current preview blob URL (background-image)
        const bg = el.style.backgroundImage;
        const m = bg.match(/url\("?([^"]+)"?\)/);
        if (!m) return;
        const previewUrl = m[1];
        btn.disabled = true;
        btn.textContent = 'Working…';
        try {
          // Fetch the URL (works for blob: and data: URIs)
          const resp = await fetch(previewUrl);
          const inputBlob = await resp.blob();
          const result = await removeBackgroundFromImage(inputBlob);
          if (!result.blob) {
            alert(result.reason || 'Could not remove background — try a different photo.');
            btn.disabled = false;
            btn.textContent = 'Remove background';
            return;
          }
          // Replace the preview AND stage the new blob for save
          const newUrl = URL.createObjectURL(result.blob);
          el.style.backgroundImage = `url('${newUrl}')`;
          // Stash the cleaned blob globally so the existing save handler can pick it up
          window._bgCleanedBlob = result.blob;
          window._bgCleanedFile = new File([result.blob], 'cleaned.png', { type: 'image/png' });
          // Replace the staged file in known places
          if (typeof pendingFile !== 'undefined') {
            try { pendingFile = window._bgCleanedFile; } catch (_) {}
          }
          if (typeof editPendingPhoto !== 'undefined' && typeof previewNewPhotoInEdit === 'function') {
            previewNewPhotoInEdit(window._bgCleanedFile);
          }
          if (typeof showToast === 'function') showToast('Background removed · ' + Math.round(result.confidence * 100) + '% confidence');
          btn.textContent = 'Removed ✓';
          btn.disabled = false;
        } catch (err) {
          console.error(err);
          alert('Background removal failed: ' + (err && err.message || err));
          btn.disabled = false;
          btn.textContent = 'Remove background';
        }
      });
    });
  }

  setInterval(addBgRemoveButton, 600);
  if (document.readyState !== 'loading') addBgRemoveButton();
  else document.addEventListener('DOMContentLoaded', addBgRemoveButton);
})();


/* ===== js/lookbook-r1.js ===== */
// lookbook-r1.js — Outfit lookbook photos
// Extends the outfit builder with a "Lookbook photo" upload (an outfit-level
// full-look photo). Saved as outfit.lookbookPhoto Blob.
// Decorates the Outfits list and outfit detail with the lookbook photo when set.

(function() {
  let stagedLookbookFile = null;

  function ensureUploadUI() {
    // Only run on Build Outfit page
    if (location.hash.indexOf('#/build') !== 0) return;
    if (document.getElementById('lookbookUploadField')) return;
    const canvas = document.querySelector('.builder-canvas');
    if (!canvas) return;
    const notesField = canvas.querySelector('#outfit_notes')?.closest('.field');
    if (!notesField) return;

    // Pull current outfit if editing
    const currentId = (typeof builderState !== 'undefined' && builderState.editingId) ? builderState.editingId : null;
    const block = document.createElement('div');
    block.className = 'field';
    block.id = 'lookbookUploadField';
    block.style.marginTop = '14px';
    block.innerHTML = `
      <label class="field-label">Lookbook photo</label>
      <div class="row" style="gap: 10px; align-items: center; flex-wrap: wrap;">
        <label class="btn" for="lookbookFile">Choose file…</label>
        <input id="lookbookFile" type="file" accept="image/*" hidden />
        <span class="muted" style="font-size: 12px;" id="lookbookHint">A full-look photo to remember this outfit by.</span>
      </div>
      <div id="lookbookPreview" style="margin-top: 10px;"></div>
    `;
    notesField.parentNode.insertBefore(block, notesField.nextSibling);

    const preview = document.getElementById('lookbookPreview');
    const hint = document.getElementById('lookbookHint');

    function showPreview(blobOrUrl) {
      const url = blobOrUrl instanceof Blob ? URL.createObjectURL(blobOrUrl) : blobOrUrl;
      preview.innerHTML = `<div style="position: relative; max-width: 200px;">
        <img src="${url}" style="max-width: 200px; max-height: 240px; border: 1px solid var(--border); border-radius: 4px; display: block;" />
        <button class="btn btn-ghost btn-sm" id="lookbookClear" style="margin-top: 6px;">Remove photo</button>
      </div>`;
      document.getElementById('lookbookClear').addEventListener('click', () => {
        stagedLookbookFile = null;
        preview.innerHTML = '';
        if (currentId) {
          // Mark for deletion on save
          window._lookbookClear = true;
        }
      });
    }

    document.getElementById('lookbookFile').addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      stagedLookbookFile = f;
      window._lookbookClear = false;
      showPreview(f);
    });

    // Show existing lookbook photo if editing an outfit
    if (currentId) {
      dbGetOutfit(currentId).then(o => {
        if (o && o.lookbookPhoto) showPreview(o.lookbookPhoto);
      });
    }
  }

  // Wrap the existing save flow: find saveOutfitBtn and intercept its click
  // to attach the staged lookbook photo to the payload.
  function wrapSave() {
    const saveBtn = document.getElementById('saveOutfitBtn');
    if (!saveBtn || saveBtn.dataset.lookbookWrapped) return;
    saveBtn.dataset.lookbookWrapped = '1';
    saveBtn.addEventListener('click', async () => {
      // Wait one tick so the original handler runs first; if it succeeded the page
      // navigates to #/outfits. If it failed, we leave staged file alone for retry.
      // To insert the lookbook photo, we patch dbAddOutfit/dbUpdateOutfit before they run.
    }, { capture: true });
    // Better approach: monkey-patch dbAddOutfit / dbUpdateOutfit
  }

  // Monkey-patch dbAddOutfit/dbUpdateOutfit to attach lookbook photo
  function patchDb() {
    if (window._lookbookDbPatched) return;
    if (typeof dbAddOutfit !== 'function' || typeof dbUpdateOutfit !== 'function') return;
    const origAdd = window.dbAddOutfit;
    const origUpdate = window.dbUpdateOutfit;
    window.dbAddOutfit = async function(payload) {
      if (stagedLookbookFile) {
        try {
          payload.lookbookPhoto = await resizeImage(stagedLookbookFile, 1400, 0.9);
        } catch (_) {
          payload.lookbookPhoto = stagedLookbookFile;
        }
      }
      const id = await origAdd(payload);
      stagedLookbookFile = null;
      return id;
    };
    window.dbUpdateOutfit = async function(id, updates) {
      if (stagedLookbookFile) {
        try {
          updates.lookbookPhoto = await resizeImage(stagedLookbookFile, 1400, 0.9);
        } catch (_) {
          updates.lookbookPhoto = stagedLookbookFile;
        }
      } else if (window._lookbookClear) {
        updates.lookbookPhoto = null;
        window._lookbookClear = false;
      }
      const result = await origUpdate(id, updates);
      stagedLookbookFile = null;
      return result;
    };
    window._lookbookDbPatched = true;
  }

  // Decorate the Outfits LIST cards: replace the 4-thumb mosaic with the
  // lookbook photo when one exists.
  function decorateOutfitsList() {
    document.querySelectorAll('.outfit-card[data-outfit-id]:not([data-lookbook])').forEach(async (card) => {
      card.setAttribute('data-lookbook', '1');
      const id = Number(card.dataset.outfitId);
      try {
        const o = await dbGetOutfit(id);
        if (!o || !o.lookbookPhoto) return;
        const thumbs = card.querySelector('.outfit-card-thumbs');
        if (!thumbs) return;
        const url = blobToUrl(o.lookbookPhoto);
        thumbs.innerHTML = `<div style="grid-column: 1 / -1; height: 100%; min-height: 200px; background: url('${url}') center/cover no-repeat; border-radius: var(--radius);"></div>`;
      } catch (_) {}
    });
  }

  // Decorate the Outfit detail modal — show the lookbook photo as a hero image.
  function decorateOutfitDetail() {
    const detail = document.querySelector('#modalContent .outfit-detail');
    if (!detail || detail.dataset.lookbook) return;
    detail.setAttribute('data-lookbook', '1');
    const id = window._wearCurrentOutfitId; // optional: if we tracked this
    // No reliable id source — skip detail decoration for now
  }

  // Main loop: run periodically (cheap)
  setInterval(() => {
    if (location.hash.startsWith('#/build')) ensureUploadUI();
    patchDb();
    if (location.hash.startsWith('#/outfits')) decorateOutfitsList();
  }, 600);
})();


/* ===== js/style-dna-r1.js ===== */
// style-dna-r1.js — AI color & aesthetic detection
// Samples each item photo via canvas, finds dominant color, rolls up the
// closet's distribution, and matches against AESTHETIC_PROFILES to suggest
// the user's "style DNA". Surfaces in Insights as a new "Your Style DNA" tab.

(function() {
  const COLOR_NAMES = {
    Black: [25, 25, 25], Charcoal: [60, 60, 60], Gray: [128, 128, 128],
    White: [245, 245, 245], Cream: [240, 235, 220], Beige: [220, 200, 175],
    Tan: [200, 175, 140], Brown: [120, 80, 50],
    Red: [180, 40, 40], Burgundy: [120, 30, 50], Pink: [240, 180, 200],
    Coral: [240, 130, 110], Mauve: [185, 145, 155], Orange: [230, 140, 60],
    Mustard: [200, 165, 60], Yellow: [240, 220, 80],
    Sage: [170, 190, 160], Mint: [180, 230, 200], Green: [80, 140, 80],
    Olive: [120, 130, 80], Teal: [60, 130, 130], Turquoise: [80, 200, 200],
    Blue: [70, 130, 200], Navy: [30, 50, 100], Indigo: [70, 80, 150],
    Lavender: [200, 180, 230], Purple: [130, 80, 180], Plum: [120, 60, 110],
    Magenta: [220, 70, 160],
  };

  function nearestColorName(rgb) {
    let best = null, bestDist = Infinity;
    for (const [name, ref] of Object.entries(COLOR_NAMES)) {
      const d = (rgb[0] - ref[0]) ** 2 + (rgb[1] - ref[1]) ** 2 + (rgb[2] - ref[2]) ** 2;
      if (d < bestDist) { bestDist = d; best = name; }
    }
    return best;
  }

  // Sample dominant color via canvas — drop transparent + near-white
  // background pixels, return the average of the rest.
  async function dominantColor(blob) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const max = 80; // small for speed
        const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue; // transparent
          const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (lum > 235) continue; // near-white background
          if (lum < 20) continue;  // pure black often noise
          r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
        }
        URL.revokeObjectURL(url);
        if (n === 0) return resolve(null);
        resolve([Math.round(r / n), Math.round(g / n), Math.round(b / n)]);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  async function analyzeCloset(items) {
    const colorCounts = new Map();
    let analyzed = 0;
    for (const it of items) {
      if (!it.photo) continue;
      // Use stored color if present; otherwise compute
      let name = it.color;
      if (!name) {
        const rgb = await dominantColor(it.photo);
        if (rgb) name = nearestColorName(rgb);
      }
      if (!name) continue;
      colorCounts.set(name, (colorCounts.get(name) || 0) + 1);
      analyzed++;
    }
    const sorted = [...colorCounts.entries()].sort((a, b) => b[1] - a[1]);

    // Score each aesthetic by how well its preferred colors match the closet
    const aestheticScores = [];
    for (const [id, profile] of Object.entries(AESTHETIC_PROFILES)) {
      if (id === 'any') continue;
      let matchCount = 0;
      for (const [color, count] of sorted) {
        if (profile.preferredColors.includes(color)) matchCount += count;
      }
      const pct = analyzed > 0 ? matchCount / analyzed : 0;
      aestheticScores.push({ id, label: profile.label, score: pct, matchCount });
    }
    aestheticScores.sort((a, b) => b.score - a.score);

    return { sortedColors: sorted, aestheticScores, analyzedCount: analyzed };
  }

  window.analyzeStyleDNA = analyzeCloset;
})();


/* ===== js/rotation-r1.js ===== */
// rotation-r1.js — Wear-rotation enforcement
// Down-ranks items worn in the last 7 days when generating outfit suggestions,
// so the suggester naturally rotates pieces. Patches generateOutfitSuggestions
// to read item.wearLog and bias the random pick.

(function() {
  if (typeof window.generateOutfitSuggestions !== 'function') return;

  const original = window.generateOutfitSuggestions;
  const RECENT_WINDOW_MS = 7 * 86400000; // 7 days

  function wearsInWindow(item, ms) {
    const now = Date.now();
    return (item.wearLog || []).filter(t => now - t < ms).length;
  }

  // Wrap the original to inject a rotation-aware wrapper around items.
  // Strategy: tag items with a "freshness boost" — inversely proportional to
  // recent wear count — and pass them to the original generator. We can't
  // easily change the random pick from outside, so we re-rank candidates by
  // duplicating less-worn items into the pool to bias the random choice.
  window.generateOutfitSuggestions = function(occasionId, allItems, options = {}) {
    const opts = Object.assign({}, options);
    const respectRotation = opts.rotation !== false;
    if (!respectRotation) return original(occasionId, allItems, opts);

    // Build a weighted pool: each item appears 1+N times where N decreases
    // with recent wears. So an item not worn this week appears 4x; an item
    // worn 3x this week appears 1x.
    const weightedPool = [];
    for (const it of allItems) {
      const recent = wearsInWindow(it, RECENT_WINDOW_MS);
      const weight = Math.max(1, 4 - recent);
      for (let i = 0; i < weight; i++) weightedPool.push(it);
    }
    return original(occasionId, weightedPool, opts);
  };

  // For the manual builder: warn when a piece has been worn 3+ times this week.
  function warnIfOverworn() {
    document.querySelectorAll('.outfit-slot[data-slot-id]:not([data-rotation-checked])').forEach(async (slot) => {
      slot.setAttribute('data-rotation-checked', '1');
      const id = Number(slot.dataset.slotId);
      try {
        const item = await dbGetItem(id);
        if (!item) return;
        const recent = wearsInWindow(item, RECENT_WINDOW_MS);
        if (recent >= 3) {
          const warn = document.createElement('div');
          warn.style.cssText = 'font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #a06b20; margin-top: 4px; font-weight: 500;';
          warn.textContent = `Worn ${recent}× this week — try something dormant?`;
          slot.querySelector('.outfit-slot-info')?.appendChild(warn);
        }
      } catch (_) {}
    });
  }

  setInterval(warnIfOverworn, 800);
})();


/* ===== js/resale-r1.js ===== */
// resale-r1.js — Resale listing draft generator
// On any item with status === 'consign' OR 'sold', show a "Listing draft"
// button in the item detail modal. Generates copy-paste text for Poshmark/
// Depop, suggests resale price (50% of original by default), and links to
// the brand's listing flows.

(function() {
  function suggestPrice(item) {
    if (!item.purchasePrice) return null;
    return Math.max(5, Math.round(item.purchasePrice * 0.5));
  }

  function descriptionFor(item) {
    const lines = [];
    lines.push(`${item.brand || ''} ${item.name || item.subtype || ''}`.trim());
    if (item.color) lines.push(`Color: ${item.color}`);
    if (item.size) lines.push(`Size: ${item.size}`);
    if (item.subtype) lines.push(`Type: ${item.subtype}`);
    if (item.notes) lines.push('', item.notes);
    lines.push('', `Smoke-free, pet-free home. From a curated personal closet.`);
    if (item.purchaseDate) lines.push(`Originally purchased ${item.purchaseDate.slice(0, 7)}.`);
    return lines.filter(Boolean).join('\n');
  }

  function showListingModal(item) {
    if (typeof openModal !== 'function') return;
    const price = suggestPrice(item);
    const desc = descriptionFor(item);
    const title = `${item.brand || ''} ${item.name || item.subtype || ''}`.trim() || 'Untitled item';
    openModal(`
      <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; margin: 0 0 14px;">Resale listing draft</h2>
      <p class="muted" style="font-size: 12px; margin-bottom: 16px;">Copy these fields into Poshmark, Depop, Mercari, or your platform of choice.</p>
      <div class="field" style="margin-bottom: 12px;">
        <label class="field-label">Title</label>
        <input class="input" id="resale_title" value="${escapeHtml(title)}" />
      </div>
      <div class="field" style="margin-bottom: 12px;">
        <label class="field-label">Suggested price (USD)</label>
        <input class="input" id="resale_price" type="number" value="${price || ''}" />
        <div class="muted" style="font-size: 11px; margin-top: 4px;">${item.purchasePrice ? `Original: $${item.purchasePrice} · Suggested: 50% of original` : 'No original price recorded'}</div>
      </div>
      <div class="field" style="margin-bottom: 16px;">
        <label class="field-label">Description</label>
        <textarea class="textarea" id="resale_desc" rows="8">${escapeHtml(desc)}</textarea>
      </div>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button class="btn btn-primary" id="resale_copy">Copy listing text</button>
        <a class="btn" href="https://poshmark.com/create-listing" target="_blank" rel="noopener">Open Poshmark</a>
        <a class="btn" href="https://www.depop.com/sell/" target="_blank" rel="noopener">Open Depop</a>
        <a class="btn" href="https://www.mercari.com/sell/" target="_blank" rel="noopener">Open Mercari</a>
      </div>
    `);
    document.getElementById('resale_copy').addEventListener('click', async () => {
      const t = document.getElementById('resale_title').value;
      const p = document.getElementById('resale_price').value;
      const d = document.getElementById('resale_desc').value;
      const text = `${t}\n\n$${p}\n\n${d}`;
      try {
        await navigator.clipboard.writeText(text);
        showToast('Listing copied to clipboard');
      } catch (_) {
        alert('Copy this manually:\n\n' + text);
      }
    });
  }

  // Decorate item detail modal: add "Generate listing" button when status is consign/sold
  function decorateDetail() {
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    const detail = modalContent.querySelector('.item-detail');
    if (!detail) return;
    const actions = modalContent.querySelector('.item-detail-actions');
    if (!actions || actions.querySelector('[data-resale-btn]')) return;
    const id = window._wearCurrentItemId;
    if (!id) return;
    dbGetItem(id).then(item => {
      if (!item) return;
      // Always show the button — useful for any item being considered for resale
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.setAttribute('data-resale-btn', '1');
      btn.textContent = 'Listing draft';
      btn.title = 'Generate Poshmark / Depop listing text';
      btn.addEventListener('click', () => showListingModal(item));
      actions.appendChild(btn);
    });
  }

  const observe = () => {
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    new MutationObserver(() => setTimeout(decorateDetail, 50)).observe(modalContent, { childList: true });
  };
  if (document.readyState !== 'loading') observe();
  else document.addEventListener('DOMContentLoaded', observe);
})();


/* ===== js/outfits-r7.js ===== */
// outfits.js — outfit list + builder

const builderState = {
  editingId: null,
  name: '',
  occasion: '',
  notes: '',
  selectedIds: new Set(),
  pickerFilters: { search: '', garmentType: '' }
};

// ===== Outfits list view =====
async function renderOutfitsView(main) {
  const outfits = await dbGetAllOutfits();
  const items = await dbGetAllItems();
  const itemMap = new Map(items.map(i => [i.id, i]));

  outfits.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  main.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Outfits</h1>
        <div class="page-subtitle">${outfits.length} saved ${outfits.length === 1 ? 'outfit' : 'outfits'}</div>
      </div>
      <a href="#/build" class="btn btn-primary">+ Build Outfit</a>
    </div>

    ${outfits.length === 0 ? `
      <div class="empty">
        <div class="empty-title">No outfits yet</div>
        <p>Mix and match pieces from your closet to save complete looks for any occasion.</p>
        <a href="#/build" class="btn btn-primary">Build your first outfit</a>
      </div>
    ` : `
      <div class="toolbar">
        <select class="select" id="occasionFilter">
          <option value="">All occasions</option>
          ${OCCASIONS.map(o => `<option value="${o.id}">${o.label}</option>`).join('')}
        </select>
        <div class="toolbar-spacer"></div>
      </div>
      <div class="outfits-list" id="outfitsList"></div>
    `}
  `;

  if (outfits.length === 0) return;

  const renderList = () => {
    const filter = document.getElementById('occasionFilter').value;
    const filtered = filter ? outfits.filter(o => o.occasion === filter) : outfits;
    const list = document.getElementById('outfitsList');
    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty" style="grid-column:1/-1;"><p>No outfits for this occasion yet.</p></div>`;
      return;
    }
    list.innerHTML = filtered.map(o => outfitCardHtml(o, itemMap)).join('');
    list.querySelectorAll('[data-outfit-id]').forEach(el => {
      el.addEventListener('click', () => openOutfitDetail(Number(el.dataset.outfitId), itemMap));
    });
  };
  document.getElementById('occasionFilter').addEventListener('change', renderList);
  renderList();
}

function outfitCardHtml(outfit, itemMap) {
  const items = (outfit.itemIds || []).map(id => itemMap.get(id)).filter(Boolean);
  const thumbs = items.slice(0, 4);
  while (thumbs.length < 4) thumbs.push(null);
  return `
    <div class="outfit-card" data-outfit-id="${outfit.id}">
      <div class="outfit-card-thumbs">
        ${thumbs.map(it => `
          <div class="outfit-card-thumb" style="${it ? `background-image:url('${blobToUrl(it.photo || it.thumb)}')` : ''}"></div>
        `).join('')}
      </div>
      <div class="outfit-card-title">${escapeHtml(outfit.name || 'Untitled outfit')}</div>
      <div class="outfit-card-meta">
        <span class="occasion-badge">${labelForOccasion(outfit.occasion)}</span>
        <span class="muted">${items.length} ${items.length === 1 ? 'piece' : 'pieces'}</span>
      </div>
    </div>
  `;
}

async function openOutfitDetail(id, itemMap) {
  const outfit = await dbGetOutfit(id);
  if (!outfit) return;
  const items = (outfit.itemIds || []).map(id => itemMap.get(id)).filter(Boolean);

  openModal(`
    <h2>${escapeHtml(outfit.name || 'Untitled outfit')}</h2>
    <div class="row" style="margin: 8px 0 18px; gap: 10px;">
      <span class="occasion-badge">${labelForOccasion(outfit.occasion)}</span>
      <span class="muted">${items.length} ${items.length === 1 ? 'piece' : 'pieces'}</span>
    </div>

    ${outfit.notes ? `<div style="margin-bottom:18px;"><div class="section-title">Notes</div><div>${escapeHtml(outfit.notes)}</div></div>` : ''}

    <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));">
      ${items.map(it => `
        <div class="card">
          <div class="card-image" style="background-image:url('${blobToUrl(it.photo || it.thumb)}')"></div>
          <div class="card-body">
            <div class="card-title">${escapeHtml(it.name || it.subtype || labelForGarmentType(it.garmentType))}</div>
            <div class="card-meta">${escapeHtml([it.brand, it.color].filter(Boolean).join(' · '))}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="divider"></div>
    <div class="row" style="justify-content:flex-end; gap:8px;">
      <button class="btn btn-danger" id="deleteOutfitBtn">Delete</button>
      <button class="btn" id="editOutfitBtn">Edit</button>
    </div>
  `);

  document.getElementById('editOutfitBtn').addEventListener('click', () => {
    closeModal();
    location.hash = `#/build?id=${outfit.id}`;
  });
  document.getElementById('deleteOutfitBtn').addEventListener('click', async () => {
    if (!confirm(`Delete "${outfit.name || 'this outfit'}"?`)) return;
    await dbDeleteOutfit(outfit.id);
    closeModal();
    showToast('Outfit deleted');
    renderOutfitsView(document.getElementById('main'));
  });
}

// ===== Outfit builder =====
async function renderBuilderView(main, params = {}) {
  // Reset state
  builderState.editingId = null;
  builderState.name = '';
  builderState.occasion = '';
  builderState.notes = '';
  builderState.selectedIds = new Set();
  builderState.pickerFilters = { search: '', garmentType: '' };

  // If editing existing
  if (params.id) {
    const existing = await dbGetOutfit(Number(params.id));
    if (existing) {
      builderState.editingId = existing.id;
      builderState.name = existing.name || '';
      builderState.occasion = existing.occasion || '';
      builderState.notes = existing.notes || '';
      builderState.selectedIds = new Set(existing.itemIds || []);
    }
  }

  const items = await dbGetAllItems();

  if (items.length === 0) {
    main.innerHTML = `
      <div class="page-header"><h1>Build Outfit</h1></div>
      <div class="empty">
        <div class="empty-title">Add some clothes first</div>
        <p>You need at least a few pieces in your closet before you can build outfits.</p>
        <a href="#/add" class="btn btn-primary">+ Add Item</a>
      </div>
    `;
    return;
  }

  main.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>${builderState.editingId ? 'Edit Outfit' : 'Build Outfit'}</h1>
        <div class="page-subtitle">Pick pieces from your closet to assemble a complete look.</div>
      </div>
      <div class="row">
        <button class="btn" id="cancelBuildBtn">Cancel</button>
        <button class="btn btn-primary" id="saveOutfitBtn">${builderState.editingId ? 'Save Changes' : 'Save Outfit'}</button>
      </div>
    </div>

    <div class="builder">
      <div class="builder-canvas">
        <div class="field">
          <label class="field-label" for="outfit_name">Outfit name</label>
          <input class="input" id="outfit_name" type="text" placeholder="e.g. Friday work fit" value="${escapeHtml(builderState.name)}" />
        </div>

        <div class="field" style="margin-top: 14px;">
          <label class="field-label">Occasion</label>
          <div class="checks" id="outfit_occasion_checks">
            ${OCCASIONS.map(o => `
              <label class="check ${builderState.occasion === o.id ? 'checked' : ''}">
                <input type="radio" name="occasion" value="${o.id}" ${builderState.occasion === o.id ? 'checked' : ''} />
                ${o.label}
              </label>
            `).join('')}
          </div>
        </div>

        <div class="field" style="margin-top: 14px;">
          <label class="field-label">Outfit suggestions</label>
          <div class="checks" id="aestheticChips" style="margin-bottom: 10px;">
            ${Object.entries(AESTHETIC_PROFILES).map(([id, p]) => `
              <label class="check ${id === 'any' ? 'checked' : ''}">
                <input type="radio" name="aesthetic" value="${id}" ${id === 'any' ? 'checked' : ''} />
                ${p.label}
              </label>
            `).join('')}
          </div>
          <div class="row" style="gap: 10px; align-items: center; flex-wrap: wrap;">
            <button class="btn" id="suggestOutfitsBtn" type="button">✦ Suggest 3 outfits</button>
            <label class="check" id="seasonToggle" style="cursor: pointer;">
              <input type="checkbox" id="seasonAware" />
              Match current season
            </label>
            <a id="pinterestLink" class="muted" href="https://www.pinterest.com/" target="_blank" rel="noopener" style="font-size: 12px; text-decoration: underline;">✦ See Pinterest looks</a>
            <span class="muted" style="font-size: 12px;" id="suggestHint">Pick an occasion first</span>
          </div>
          <div id="suggestionsOut" style="margin-top: 12px;"></div>
        </div>

        <div class="field" style="margin-top: 14px;">
          <label class="field-label" for="outfit_notes">Notes</label>
          <textarea class="textarea" id="outfit_notes" placeholder="Anything to remember about this outfit…">${escapeHtml(builderState.notes)}</textarea>
        </div>

        <div class="divider"></div>
        <div class="section-title">Selected (<span id="selCount">${builderState.selectedIds.size}</span>)</div>
        <div class="outfit-slots" id="outfitSlots"></div>
      </div>

      <div class="builder-picker">
        <div class="toolbar">
          <input type="search" class="input search" id="builderSearch" placeholder="Search your closet…" />
          <select class="select" id="builderType">
            <option value="">All categories</option>
            ${Object.entries(GARMENT_TYPES).map(([id, t]) =>
              `<option value="${id}">${t.label}</option>`
            ).join('')}
          </select>
          <div class="toolbar-spacer"></div>
          <span class="muted" id="pickerCount"></span>
        </div>
        <div class="grid builder-grid" id="builderGrid"></div>
      </div>
    </div>
  `;

  // Wire up controls
  document.getElementById('outfit_name').addEventListener('input', e => {
    builderState.name = e.target.value;
  });
  document.getElementById('outfit_notes').addEventListener('input', e => {
    builderState.notes = e.target.value;
  });
  document.querySelectorAll('#outfit_occasion_checks input').forEach(input => {
    input.addEventListener('change', () => {
      builderState.occasion = input.value;
      document.querySelectorAll('#outfit_occasion_checks .check').forEach(c => c.classList.remove('checked'));
      input.parentElement.classList.add('checked');
      updatePinterestLink();
      if (suggestionsArmed) renderSuggestions();
    });
  });


  // === Outfit suggestions wiring ===
  let pickedAesthetic = 'any';
  const updatePinterestLink = () => {
    const link = document.getElementById('pinterestLink');
    if (!link) return;
    const occ = builderState.occasion;
    const ap = AESTHETIC_PROFILES[pickedAesthetic];
    let q;
    if (ap && ap.pinterestQuery) {
      q = occ ? `${ap.pinterestQuery} ${labelForOccasion(occ).toLowerCase()}` : ap.pinterestQuery;
    } else if (occ) {
      q = `${labelForOccasion(occ).toLowerCase()} outfit women`;
    } else {
      q = 'womens fashion outfit';
    }
    link.href = 'https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(q);
    link.textContent = '✦ Pinterest looks' + (occ ? ` for ${labelForOccasion(occ)}` : '');
  };
  document.querySelectorAll('#aestheticChips input').forEach(input => {
    input.addEventListener('change', () => {
      pickedAesthetic = input.value;
      document.querySelectorAll('#aestheticChips .check').forEach(c => c.classList.remove('checked'));
      input.parentElement.classList.add('checked');
      updatePinterestLink();
      if (suggestionsArmed) renderSuggestions();
    });
  });
  updatePinterestLink();

  const renderSuggestions = () => {
    const out = document.getElementById('suggestionsOut');
    const hint = document.getElementById('suggestHint');
    if (!builderState.occasion) {
      out.innerHTML = '';
      hint.textContent = 'Pick an occasion first';
      return;
    }
    const seasonAware = document.getElementById('seasonAware').checked;
    const season = seasonAware ? _currentSeason() : null;
    const suggestions = generateOutfitSuggestions(builderState.occasion, items, { season, count: 3, aesthetic: pickedAesthetic });
    if (suggestions.length === 0) {
      hint.textContent = 'No matching outfits — try unchecking season or adding more pieces.';
      out.innerHTML = '';
      return;
    }
    hint.textContent = `${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'}${season ? ' (' + season + ')' : ''}`;
    out.innerHTML = `<div class="suggest-grid">${suggestions.map((s, i) => {
      const thumbs = s.slots.map(slot => {
        if (slot.missing) {
          const q = encodeURIComponent(slot.shopQuery || slot.slotName);
          return `<div class="suggest-piece suggest-piece-missing">
            <div class="suggest-piece-thumb missing">+</div>
            <div style="flex: 1; min-width: 0;">
              <div class="suggest-piece-name muted">${escapeHtml(slot.slotName)} (need)</div>
              <a class="suggest-shop-link" href="https://www.google.com/search?tbm=shop&q=${q}" target="_blank" rel="noopener">Shop →</a>
            </div>
          </div>`;
        }
        const it = slot.item;
        const u = it.photo ? blobToUrl(it.photo) : (it.thumb ? blobToUrl(it.thumb) : '');
        return `<div class="suggest-piece"><div class="suggest-piece-thumb" style="background-image:url('${u}')"></div><div class="suggest-piece-name">${escapeHtml(it.name || it.subtype || labelForGarmentType(it.garmentType))}</div></div>`;
      }).join('');
      const ids = s.slots.filter(x => x.item).map(x => x.item.id).join(',');
      return `<div class="suggest-card">
        <div class="suggest-card-title">Option ${i + 1}</div>
        <div class="suggest-pieces">${thumbs}</div>
        <button class="btn btn-primary btn-block" data-use-outfit="${ids}" type="button">Use this outfit</button>
      </div>`;
    }).join('')}</div>`;
    out.querySelectorAll('[data-use-outfit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ids = btn.dataset.useOutfit.split(',').map(Number);
        builderState.selectedIds = new Set(ids);
        renderPicker();
        renderSlots();
        showToast('Outfit loaded — tweak and save');
      });
    });
  };
  document.getElementById('suggestOutfitsBtn').addEventListener('click', renderSuggestions);
  document.getElementById('seasonAware').addEventListener('change', renderSuggestions);
  // Auto-refresh suggestions when occasion changes (if user has clicked Suggest at least once)
  let suggestionsArmed = false;
  document.getElementById('suggestOutfitsBtn').addEventListener('click', () => { suggestionsArmed = true; });

  const renderPicker = () => {
    const grid = document.getElementById('builderGrid');
    const f = builderState.pickerFilters;
    const q = f.search.trim().toLowerCase();
    const filtered = items.filter(i => {
      if (f.garmentType && i.garmentType !== f.garmentType) return false;
      if (q) {
        const hay = [i.name, i.brand, i.color, i.subtype, ...(i.tags || [])].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    document.getElementById('pickerCount').textContent = `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`;
    grid.innerHTML = filtered.map(it => {
      const url = it.photo ? blobToUrl(it.photo) : (it.thumb ? blobToUrl(it.thumb) : '');
      const name = it.name || it.subtype || labelForGarmentType(it.garmentType);
      const meta = [it.brand, it.color].filter(Boolean).join(' · ');
      const selected = builderState.selectedIds.has(it.id);
      return `
        <div class="card ${selected ? 'selected' : ''}" data-pick-id="${it.id}">
          <div class="card-image" style="background-image:url('${url}')"></div>
          <div class="card-body">
            <div class="card-title">${escapeHtml(name)}</div>
            <div class="card-meta">${escapeHtml(meta) || '&nbsp;'}</div>
          </div>
        </div>
      `;
    }).join('');
    grid.querySelectorAll('[data-pick-id]').forEach(el => {
      el.addEventListener('click', () => {
        const id = Number(el.dataset.pickId);
        if (builderState.selectedIds.has(id)) builderState.selectedIds.delete(id);
        else builderState.selectedIds.add(id);
        el.classList.toggle('selected', builderState.selectedIds.has(id));
        renderSlots();
      });
    });
  };

  const renderSlots = () => {
    const slots = document.getElementById('outfitSlots');
    document.getElementById('selCount').textContent = builderState.selectedIds.size;
    if (builderState.selectedIds.size === 0) {
      slots.innerHTML = `<div class="muted" style="text-align:center; padding: 20px 8px; font-size: 12.5px;">Click pieces from your closet on the right to add them here</div>`;
      return;
    }
    const sorted = [...builderState.selectedIds]
      .map(id => items.find(i => i.id === id))
      .filter(Boolean)
      .sort((a, b) => garmentOrder(a.garmentType) - garmentOrder(b.garmentType));
    slots.innerHTML = sorted.map(it => {
      const url = it.photo ? blobToUrl(it.photo) : (it.thumb ? blobToUrl(it.thumb) : '');
      const name = it.name || it.subtype || labelForGarmentType(it.garmentType);
      return `
        <div class="outfit-slot" data-slot-id="${it.id}">
          <div class="outfit-slot-thumb" style="background-image:url('${url}')"></div>
          <div class="outfit-slot-info">
            <div class="outfit-slot-name">${escapeHtml(name)}</div>
            <div class="outfit-slot-meta">${escapeHtml([it.brand, labelForGarmentType(it.garmentType)].filter(Boolean).join(' · '))}</div>
          </div>
          <button class="outfit-slot-remove" data-remove="${it.id}" title="Remove">×</button>
        </div>
      `;
    }).join('');
    slots.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = Number(btn.dataset.remove);
        builderState.selectedIds.delete(id);
        const card = document.querySelector(`[data-pick-id="${id}"]`);
        if (card) card.classList.remove('selected');
        renderSlots();
      });
    });
  };

  document.getElementById('builderSearch').addEventListener('input', debounce(e => {
    builderState.pickerFilters.search = e.target.value;
    renderPicker();
  }, 150));
  document.getElementById('builderType').addEventListener('change', e => {
    builderState.pickerFilters.garmentType = e.target.value;
    renderPicker();
  });

  document.getElementById('cancelBuildBtn').addEventListener('click', () => {
    location.hash = '#/outfits';
  });
  document.getElementById('saveOutfitBtn').addEventListener('click', async () => {
    if (!builderState.occasion) {
      alert('Please pick an occasion for this outfit.');
      return;
    }
    if (builderState.selectedIds.size === 0) {
      alert('Add at least one piece to the outfit.');
      return;
    }
    const payload = {
      name: builderState.name.trim() || 'Untitled outfit',
      occasion: builderState.occasion,
      notes: builderState.notes.trim(),
      itemIds: [...builderState.selectedIds]
    };
    if (builderState.editingId) {
      await dbUpdateOutfit(builderState.editingId, payload);
      showToast('Outfit updated');
    } else {
      await dbAddOutfit(payload);
      showToast('Outfit saved');
    }
    location.hash = '#/outfits';
  });

  renderPicker();
  renderSlots();
}

// Sort order for outfit slots: tops on top, then dresses, bottoms, outerwear, shoes, accessories
function garmentOrder(t) {
  return ['outerwear', 'tops', 'dresses', 'bottoms', 'shoes', 'accessories'].indexOf(t);
}

// ============================================================
// Outfit suggester
// ============================================================

// Recipes describe how to assemble an outfit per occasion. Each recipe has
// either a flat `slots` list, or `variants` (alternative recipes — generator
// picks one per suggestion to keep results diverse). A slot's `match` defines
// which items qualify; `optional: true` lets the slot be skipped if nothing fits.
const OUTFIT_RECIPES = {
  run: {
    lifestyle: 'activewear',
    slots: [
      { name: 'Top',    match: { types: ['tops', 'intimates_swim'], subtypeIn: ['Tank top', 'T-shirt', 'Sports bra', 'Long sleeve'] } },
      { name: 'Bottom', match: { types: ['bottoms'],                subtypeIn: ['Shorts', 'Leggings'] } },
      { name: 'Shoes',  match: { types: ['shoes'],                  subtypeIn: ['Athletic', 'Sneakers'] } },
    ],
  },
  pickleball: {
    lifestyle: 'activewear',
    slots: [
      { name: 'Top',    match: { types: ['tops', 'intimates_swim'], subtypeIn: ['Tank top', 'T-shirt', 'Sports bra', 'Polo'] } },
      { name: 'Bottom', match: { types: ['bottoms'],                subtypeIn: ['Shorts', 'Skirt', 'Leggings'] } },
      { name: 'Shoes',  match: { types: ['shoes'],                  subtypeIn: ['Athletic', 'Sneakers'] } },
    ],
  },
  bjj: {
    lifestyle: 'activewear',
    slots: [
      { name: 'Top',    match: { types: ['tops', 'intimates_swim'], subtypeIn: ['T-shirt', 'Tank top', 'Sports bra', 'Long sleeve'] } },
      { name: 'Bottom', match: { types: ['bottoms'],                subtypeIn: ['Shorts', 'Leggings'] } },
    ],
  },
  business: {
    lifestyle: 'business',
    variants: [
      { slots: [
        { name: 'Dress', match: { types: ['dresses'] } },
        { name: 'Shoes', match: { types: ['shoes'], subtypeIn: ['Heels', 'Flats', 'Dress shoes', 'Boots'] } },
        { name: 'Layer', match: { types: ['outerwear'], subtypeIn: ['Blazer', 'Coat', 'Cardigan'] }, optional: true },
      ]},
      { slots: [
        { name: 'Top',    match: { types: ['tops'], subtypeIn: ['Blouse', 'Shirt', 'Sweater', 'Cardigan'] } },
        { name: 'Bottom', match: { types: ['bottoms'], subtypeIn: ['Pants', 'Skirt'] } },
        { name: 'Shoes',  match: { types: ['shoes'], subtypeIn: ['Heels', 'Flats', 'Dress shoes', 'Boots'] } },
        { name: 'Blazer', match: { types: ['outerwear'], subtypeIn: ['Blazer'] }, optional: true },
      ]},
    ],
  },
  church: {
    lifestyle: 'formal',
    variants: [
      { slots: [
        { name: 'Dress', match: { types: ['dresses'] } },
        { name: 'Shoes', match: { types: ['shoes'], subtypeIn: ['Heels', 'Flats', 'Dress shoes', 'Boots'] } },
      ]},
      { slots: [
        { name: 'Top',    match: { types: ['tops'] } },
        { name: 'Bottom', match: { types: ['bottoms'], subtypeIn: ['Pants', 'Skirt'] } },
        { name: 'Shoes',  match: { types: ['shoes'], subtypeIn: ['Heels', 'Flats', 'Dress shoes', 'Boots'] } },
      ]},
    ],
  },
  dinner_date: {
    lifestyle: 'formal',
    variants: [
      { slots: [
        { name: 'Dress', match: { types: ['dresses'] } },
        { name: 'Shoes', match: { types: ['shoes'], subtypeIn: ['Heels', 'Sandals', 'Boots', 'Flats'] } },
      ]},
      { slots: [
        { name: 'Top',    match: { types: ['tops'] } },
        { name: 'Bottom', match: { types: ['bottoms'], subtypeIn: ['Pants', 'Jeans', 'Skirt'] } },
        { name: 'Shoes',  match: { types: ['shoes'], subtypeIn: ['Heels', 'Sandals', 'Boots', 'Flats'] } },
      ]},
    ],
  },
  casual: {
    lifestyle: 'casual',
    slots: [
      { name: 'Top',    match: { types: ['tops'] } },
      { name: 'Bottom', match: { types: ['bottoms'] } },
      { name: 'Shoes',  match: { types: ['shoes'], subtypeIn: ['Sneakers', 'Sandals', 'Flats', 'Boots'] } },
    ],
  },
  loungewear: {
    lifestyle: 'loungewear',
    variants: [
      { slots: [
        { name: 'Set', match: { types: ['intimates_swim'], subtypeIn: ['Pajamas', 'Robe'] } },
      ]},
      { slots: [
        { name: 'Top',    match: { types: ['tops'], subtypeIn: ['Hoodie', 'Sweater', 'T-shirt', 'Tank top', 'Long sleeve'] } },
        { name: 'Bottom', match: { types: ['bottoms'], subtypeIn: ['Leggings', 'Shorts', 'Pants'] } },
      ]},
    ],
  },
};

// Aesthetic style profiles — bias the suggester toward certain colors/subtypes.
// Inspired by popular Pinterest fashion aesthetics. Each profile carries a
// `pinterestQuery` so we can deep-link the user to relevant inspiration.
const AESTHETIC_PROFILES = {
  any: {
    label: 'Any vibe',
    preferredColors: [],
    preferredSubtypes: [],
    pinterestQuery: '',
  },
  old_money: {
    label: 'Old Money',
    preferredColors: ['Black', 'White', 'Cream', 'Beige', 'Tan', 'Navy', 'Burgundy', 'Brown'],
    preferredSubtypes: ['Blazer', 'Cardigan', 'Pants', 'Skirt', 'Blouse', 'Shirt', 'Sweater', 'Dress', 'Flats', 'Loafers'],
    pinterestQuery: 'old money aesthetic outfit women',
  },
  clean_girl: {
    label: 'Clean Girl',
    preferredColors: ['Black', 'White', 'Cream', 'Beige', 'Gray', 'Tan', 'Charcoal'],
    preferredSubtypes: ['Tank top', 'T-shirt', 'Pants', 'Jeans', 'Leggings', 'Sneakers', 'Flats'],
    pinterestQuery: 'clean girl aesthetic outfit',
  },
  coastal: {
    label: 'Coastal Grandma',
    preferredColors: ['White', 'Cream', 'Beige', 'Tan', 'Blue', 'Navy', 'Sage'],
    preferredSubtypes: ['Blouse', 'Shirt', 'Sweater', 'Cardigan', 'Pants', 'Dress', 'Sandals', 'Flats'],
    pinterestQuery: 'coastal grandmother outfit',
  },
  athleisure: {
    label: 'Athleisure',
    preferredColors: ['Black', 'White', 'Gray', 'Navy', 'Olive', 'Charcoal', 'Sage'],
    preferredSubtypes: ['Tank top', 'T-shirt', 'Sports bra', 'Leggings', 'Shorts', 'Hoodie', 'Sneakers', 'Athletic'],
    pinterestQuery: 'athleisure outfit women',
  },
  streetwear: {
    label: 'Streetwear',
    preferredColors: ['Black', 'White', 'Gray', 'Charcoal', 'Olive'],
    preferredSubtypes: ['Hoodie', 'T-shirt', 'Cargo pants', 'Jeans', 'Sneakers', 'Boots'],
    pinterestQuery: 'streetwear outfit women',
  },
  cottagecore: {
    label: 'Cottagecore',
    preferredColors: ['Cream', 'Pink', 'Sage', 'Mauve', 'Lavender', 'Mint', 'White', 'Beige'],
    preferredSubtypes: ['Dress', 'Blouse', 'Cardigan', 'Skirt', 'Flats'],
    pinterestQuery: 'cottagecore outfit',
  },
};

// Higher score = better aesthetic fit. Used to sort candidate items so the
// suggester picks aesthetic-matching pieces first when an aesthetic is active.
function _aestheticScore(item, aesthetic) {
  if (!aesthetic) return 0;
  let score = 0;
  if (aesthetic.preferredColors.length && aesthetic.preferredColors.includes(item.color)) score += 2;
  if (aesthetic.preferredSubtypes.length && aesthetic.preferredSubtypes.includes(item.subtype)) score += 3;
  return score;
}

function _itemMatchesSlot(item, slotMatch) {
  if (slotMatch.types && !slotMatch.types.includes(item.garmentType)) return false;
  if (slotMatch.subtypeIn && !slotMatch.subtypeIn.includes(item.subtype)) return false;
  return true;
}

function _itemMatchesSeason(item, season) {
  if (!season) return true;
  const seasons = item.seasons || [];
  if (seasons.length === 0) return true; // untagged items are always eligible
  return seasons.includes(season) || seasons.includes('all_seasons');
}

function _currentSeason() {
  const m = new Date().getMonth(); // 0-11
  if (m <= 1 || m === 11) return 'winter'; // Dec/Jan/Feb
  if (m <= 4) return 'spring';              // Mar/Apr/May
  if (m <= 7) return 'summer';              // Jun/Jul/Aug
  return 'fall';                             // Sep/Oct/Nov
}

// Pull a random subset (size n) of an array, deterministic when seed-like is unused.
function _shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Per-slot candidate finder with progressive fallback.
// 1. Try strict: lifestyle + slot.match (types/subtypeIn) + season
// 2. Fall back: drop lifestyle (so e.g. a 'casual'-tagged sneaker still counts for Run)
// 3. Fall back further: drop season too
// Subtype restrictions are preserved at every step — we won't suggest heels for a run.
function _candidatesForSlot(slot, allItems, lifestyle, season) {
  // Exclude returned items from the candidate pool — they're no longer owned.
  if (typeof activeItems === 'function') allItems = activeItems(allItems);
  const matchesType = (i) => _itemMatchesSlot(i, slot.match);
  // Strict
  let pool = allItems.filter(i =>
    matchesType(i) &&
    (!lifestyle || (i.lifestyleCategories || []).includes(lifestyle)) &&
    _itemMatchesSeason(i, season)
  );
  if (pool.length > 0) return pool;
  // Drop lifestyle, keep season
  pool = allItems.filter(i => matchesType(i) && _itemMatchesSeason(i, season));
  if (pool.length > 0) return pool;
  // Drop season too
  return allItems.filter(matchesType);
}

// Build a Google Shopping search query for a missing slot. Pick the most
// distinctive subtype and combine with the occasion label so results are
// relevant (e.g. "Athletic shoes for Run" → running shoes).
function _shopQueryFor(slot, occasionId) {
  const occLabel = (typeof labelForOccasion === 'function') ? labelForOccasion(occasionId) : occasionId;
  const subtypes = (slot.match && slot.match.subtypeIn) || [];
  const primary = subtypes[0] || (slot.match && slot.match.types && slot.match.types[0]) || slot.name;
  return `${primary} for ${occLabel}`.trim();
}

// Generate up to `count` outfit suggestions for an occasion.
// Options: { season: 'spring' | null, count: 3 }
// Required slots that have no matching items become "missing" placeholders
// instead of failing the whole outfit. Each placeholder gets a shopQuery
// the UI uses to render a Google Shopping link.
function generateOutfitSuggestions(occasionId, allItems, options = {}) {
  const recipe = OUTFIT_RECIPES[occasionId];
  if (!recipe) return [];

  const season = options.season || null;
  const count = options.count || 3;
  const lifestyle = recipe.lifestyle;
  const variants = recipe.variants || [{ slots: recipe.slots }];

  const suggestions = [];
  const seen = new Set();
  const maxTries = count * 12;

  for (let attempt = 0; attempt < maxTries && suggestions.length < count; attempt++) {
    const variant = variants[attempt % variants.length];
    const outfit = { variantIndex: attempt % variants.length, slots: [] };
    const usedIds = new Set();

    for (const slot of variant.slots) {
      const candidates = _candidatesForSlot(slot, allItems, lifestyle, season).filter(i => !usedIds.has(i.id));
      if (candidates.length === 0) {
        if (slot.optional) continue;
        // Required slot with no candidates → add a "shop this" placeholder
        outfit.slots.push({
          slotName: slot.name,
          missing: true,
          shopQuery: _shopQueryFor(slot, occasionId),
        });
        continue;
      }
      let pick;
      const aesthetic = options.aesthetic && AESTHETIC_PROFILES[options.aesthetic] && options.aesthetic !== 'any'
        ? AESTHETIC_PROFILES[options.aesthetic] : null;
      if (aesthetic) {
        // Sort candidates by aesthetic score (desc) then pick from top tier with randomness
        const scored = candidates.map(c => ({ item: c, score: _aestheticScore(c, aesthetic) }))
          .sort((a, b) => b.score - a.score);
        const topScore = scored[0].score;
        // If anything matched the aesthetic at all, pick from those; otherwise from full set
        const top = topScore > 0 ? scored.filter(s => s.score === topScore) : scored;
        pick = top[Math.floor(Math.random() * top.length)].item;
      } else {
        pick = candidates[Math.floor(Math.random() * candidates.length)];
      }
      usedIds.add(pick.id);
      outfit.slots.push({ slotName: slot.name, item: pick });
    }
    if (outfit.slots.length === 0) continue;

    // Dedupe combined "what items + which slots are placeholders"
    const itemKey = outfit.slots.filter(s => s.item).map(s => s.item.id).sort((a, b) => a - b).join(',');
    const missKey = outfit.slots.map(s => s.missing ? '_' + s.slotName : '').join('|');
    const key = itemKey + '#' + missKey;
    if (seen.has(key)) continue;
    seen.add(key);
    suggestions.push(outfit);
  }
  return suggestions;
}


/* ===== js/color-pairs-r1.js ===== */
// color-pairs-r1.js — codified color-combination rules for the outfit suggester
// Distilled from style/wardrobe color charts (effortless gent · clothing color
// combo · foolproof wardrobe guide · neutral palette · seasonal palettes).
// Two responsibilities:
//   1) Bias the outfit suggester to prefer color-compatible pieces
//   2) Show a "Goes with" swatch row inside the item detail modal

(function() {
  // Pairings are *suggestive*, not strict. Neutrals pair widely; saturated
  // colors pair narrowly. Cap each entry at ~10 colors so the score is signal,
  // not noise.
  const COLOR_PAIRINGS = {
    // ----- Neutrals (pair widely) -----
    Black:        ['White', 'Cream', 'Gray', 'Red', 'Burgundy', 'Pink', 'Mustard', 'Sage', 'Olive', 'Navy'],
    White:        ['Black', 'Navy', 'Red', 'Burgundy', 'Olive', 'Sage', 'Gray', 'Tan', 'Pink', 'Mauve'],
    Gray:         ['Black', 'White', 'Pink', 'Red', 'Burgundy', 'Navy', 'Sage', 'Lavender', 'Mustard', 'Coral'],
    Charcoal:     ['White', 'Cream', 'Pink', 'Red', 'Burgundy', 'Mint', 'Lavender', 'Navy'],
    Silver:       ['Black', 'White', 'Charcoal', 'Navy', 'Burgundy', 'Lavender'],
    Cream:        ['Navy', 'Tan', 'Olive', 'Burgundy', 'Black', 'Sage', 'Brown'],
    Ivory:        ['Navy', 'Tan', 'Olive', 'Burgundy', 'Black', 'Sage'],
    'Light Ivory':['Navy', 'Tan', 'Olive', 'Burgundy', 'Black'],
    Champagne:    ['Black', 'Navy', 'Burgundy', 'Wine', 'Charcoal'],
    Beige:        ['Black', 'Navy', 'White', 'Burgundy', 'Olive', 'Sage', 'Brown'],
    Tan:          ['Cream', 'Navy', 'Burgundy', 'White', 'Olive', 'Black', 'Wine'],
    Brown:        ['Cream', 'White', 'Navy', 'Sage', 'Mustard', 'Tan', 'Burgundy'],
    Chocolate:    ['Cream', 'White', 'Tan', 'Burgundy', 'Mustard', 'Sage'],
    'Antique Gold':['Black', 'Navy', 'Burgundy', 'Cream', 'Wine'],

    // ----- Yellows -----
    'Pale Yellow':['White', 'Gray', 'Navy', 'Sage'],
    Butter:       ['White', 'Gray', 'Navy', 'Sage', 'Tan'],
    Lemon:        ['White', 'Navy', 'Black', 'Gray'],
    Yellow:       ['Gray', 'White', 'Navy', 'Black', 'Burgundy'],
    Mustard:      ['Gray', 'White', 'Navy', 'Burgundy', 'Olive', 'Black', 'Cream'],
    Gold:         ['Black', 'Navy', 'Cream', 'Burgundy', 'Charcoal'],

    // ----- Oranges -----
    Peach:        ['Cream', 'White', 'Gray', 'Navy', 'Tan'],
    Melon:        ['White', 'Navy', 'Cream', 'Tan', 'Sage'],
    Coral:        ['Cream', 'White', 'Navy', 'Gray', 'Sage', 'Tan'],
    Orange:       ['Cream', 'White', 'Navy', 'Charcoal', 'Black'],
    'Burnt Orange':['Cream', 'Navy', 'Olive', 'Charcoal', 'Brown', 'Tan'],

    // ----- Pinks -----
    Blush:        ['Gray', 'White', 'Cream', 'Navy', 'Tan', 'Olive'],
    'Light Pink': ['Gray', 'White', 'Navy', 'Tan'],
    Pink:         ['Gray', 'White', 'Navy', 'Black', 'Olive', 'Tan'],
    Bubblegum:    ['White', 'Gray', 'Navy', 'Black'],
    'Hot Pink':   ['Black', 'White', 'Gray', 'Navy'],
    'Dusty Rose': ['Cream', 'Gray', 'Olive', 'Sage', 'Tan', 'Navy'],
    Fuchsia:      ['Black', 'White', 'Gray', 'Navy'],
    Magenta:      ['Black', 'Gray', 'White', 'Navy'],
    Mauve:        ['Cream', 'Gray', 'White', 'Navy', 'Sage', 'Tan'],

    // ----- Reds -----
    Red:          ['Black', 'White', 'Gray', 'Navy', 'Cream', 'Tan'],
    Burgundy:     ['Cream', 'White', 'Gray', 'Navy', 'Black', 'Mustard', 'Olive', 'Tan'],
    Wine:         ['Cream', 'White', 'Gray', 'Navy', 'Tan', 'Black'],
    Eggplant:     ['Cream', 'Gray', 'White', 'Mustard', 'Sage'],

    // ----- Purples -----
    Lavender:     ['Gray', 'White', 'Cream', 'Navy', 'Charcoal'],
    Lilac:        ['Gray', 'White', 'Cream', 'Navy'],
    Plum:         ['Cream', 'White', 'Gray', 'Tan', 'Navy', 'Mustard'],
    Grape:        ['Cream', 'White', 'Gray', 'Black'],
    Purple:       ['Gray', 'White', 'Cream', 'Black', 'Mustard'],
    'Royal Purple':['Cream', 'White', 'Black', 'Gray'],
    Amethyst:     ['White', 'Gray', 'Cream', 'Navy'],
    Indigo:       ['Cream', 'White', 'Gray', 'Mustard', 'Tan'],

    // ----- Blues -----
    'Sky Blue':   ['White', 'Cream', 'Tan', 'Coral', 'Navy'],
    'Light Blue': ['White', 'Cream', 'Navy', 'Tan'],
    Aqua:         ['White', 'Coral', 'Cream', 'Navy', 'Tan'],
    Turquoise:    ['White', 'Cream', 'Coral', 'Mustard'],
    Periwinkle:   ['White', 'Cream', 'Gray', 'Navy'],
    'Gray Blue':  ['White', 'Cream', 'Tan', 'Burgundy'],
    Blue:         ['White', 'Cream', 'Tan', 'Burgundy', 'Coral', 'Sage'],
    'Neon Blue':  ['White', 'Black', 'Gray'],
    'Royal Blue': ['White', 'Cream', 'Black', 'Gold', 'Coral'],
    'Cobalt Blue':['White', 'Cream', 'Black', 'Tan', 'Coral'],
    Navy:         ['White', 'Cream', 'Tan', 'Burgundy', 'Pink', 'Mustard', 'Olive', 'Sage', 'Coral'],

    // ----- Greens -----
    Mint:         ['Gray', 'White', 'Navy', 'Cream', 'Tan'],
    Sage:         ['Cream', 'White', 'Black', 'Navy', 'Tan', 'Burgundy', 'Mauve'],
    'Neon Green': ['White', 'Black', 'Gray'],
    'Kelly Green':['White', 'Cream', 'Navy', 'Black'],
    Jade:         ['Cream', 'White', 'Tan', 'Coral', 'Mustard'],
    Emerald:      ['Cream', 'White', 'Black', 'Gold', 'Tan'],
    Green:        ['Cream', 'White', 'Black', 'Navy', 'Tan'],
    Olive:        ['Cream', 'White', 'Burgundy', 'Mustard', 'Black', 'Navy', 'Tan'],
    Teal:         ['Cream', 'White', 'Coral', 'Mustard', 'Tan'],

    Multi:        [], // can't pair against multi
  };

  function _norm(c) { return (c || '').trim(); }

  function goesWith(color) {
    return COLOR_PAIRINGS[_norm(color)] || [];
  }

  // Symmetric compatibility: A goes with B if A's list includes B OR B's list includes A.
  // Same color always counts as compatible (monochrome looks).
  function colorsCompatible(a, b) {
    a = _norm(a); b = _norm(b);
    if (!a || !b) return true; // can't penalize untagged
    if (a === b) return true;
    return goesWith(a).includes(b) || goesWith(b).includes(a);
  }

  window.COLOR_PAIRINGS = COLOR_PAIRINGS;
  window.goesWith = goesWith;
  window.colorsCompatible = colorsCompatible;

  // ============== Suggester bias ==============
  // Wraps generateOutfitSuggestions: when a slot has been filled, the next
  // slot's candidates get a +1 bonus per "compatible color" match. Implemented
  // by duplicating compatible items in the candidate pool (same trick as the
  // wear-rotation wrapper).
  if (typeof window.generateOutfitSuggestions === 'function') {
    const original = window.generateOutfitSuggestions;
    window.generateOutfitSuggestions = function(occasionId, allItems, options = {}) {
      // Pre-compute: cluster items by color so the generator's random pick
      // is biased toward colors that go with the items already in this attempt.
      // We do this by re-ranking allItems on every call with a small "anchor color"
      // — picked from the first item with a color tag in the result. Since the
      // original generator picks randomly inside its own loop, we wrap allItems
      // with weighted duplicates per-slot at random; this creates a soft bias
      // without breaking the existing logic.
      const anchorIdx = allItems.findIndex(i => i.color);
      if (anchorIdx < 0) return original(occasionId, allItems, options);
      const anchor = allItems[anchorIdx].color;

      const weighted = [];
      for (const it of allItems) {
        const compat = it.color && colorsCompatible(anchor, it.color) ? 2 : 1;
        for (let i = 0; i < compat; i++) weighted.push(it);
      }
      return original(occasionId, weighted, options);
    };
  }

  // ============== "Goes with" swatch row in item detail modal ==============
  function paintGoesWithRow() {
    const modalContent = document.getElementById('modalContent');
    if (!modalContent) return;
    const detail = modalContent.querySelector('.item-detail-info');
    if (!detail || detail.querySelector('.goes-with-row')) return;

    const id = window._wearCurrentItemId;
    if (!id) return;
    if (typeof dbGetItem !== 'function') return;
    dbGetItem(id).then(item => {
      if (!item || !item.color) return;
      const partners = goesWith(item.color).slice(0, 8);
      if (partners.length === 0) return;
      const swatches = partners.map(p => {
        const hex = (typeof COLOR_HEX === 'object' && COLOR_HEX[p]) || '#bbb';
        const isLight = ['White', 'Ivory', 'Light Ivory', 'Cream', 'Champagne', 'Pale Yellow', 'Butter', 'Mint'].includes(p);
        return `<span class="goes-swatch" style="background:${hex};${isLight ? ' border: 1px solid var(--border-strong);' : ''}" title="${p}"></span><span class="goes-name">${p}</span>`;
      }).join('');
      const row = document.createElement('div');
      row.className = 'goes-with-row';
      row.innerHTML = `
        <div class="goes-with-label">Goes with</div>
        <div class="goes-with-list">${swatches}</div>
      `;
      // Insert above the action buttons
      const actions = detail.querySelector('.item-detail-actions');
      if (actions) detail.insertBefore(row, actions);
      else detail.appendChild(row);
    });
  }

  const modalContent = document.getElementById('modalContent');
  if (modalContent) {
    new MutationObserver(() => setTimeout(paintGoesWithRow, 50)).observe(modalContent, { childList: true });
  }
})();


/* ===== js/browse-r3.js ===== */
// browse.js — "Shop By" view with Brand and Category tabs.
// Tiles use modern nature-inspired gradient backgrounds (no item photos).
// Each brand/category gets a deterministic gradient via a string hash so the
// same brand always looks the same.

// ---- Curated gradient palette ---------------------------------------------
// Evocative of natural scenes — sky, ocean, forest, sunset, mountain, etc.
// Each entry is [from, via?, to]. `via` is optional for 3-stop gradients.
const TILE_GRADIENTS = [
  ['#ff9a8b', '#ff6a88', '#ff99ac'],   // coral sunset
  ['#2c3e50', '#4ca1af'],               // ocean deep
  ['#134e5e', '#71b280'],               // forest mist
  ['#4b6cb7', '#182848'],               // mountain dusk
  ['#f6d365', '#fda085'],               // sand dune
  ['#89f7fe', '#66a6ff'],               // clear sky
  ['#a18cd1', '#fbc2eb'],               // lavender field
  ['#ffafbd', '#ffc3a0'],               // cherry blossom
  ['#43cea2', '#185a9d'],               // tropic water
  ['#d4fc79', '#96e6a1'],               // sage meadow
  ['#355c7d', '#6c5b7b', '#c06c84'],    // alpine dusk
  ['#ffecd2', '#fcb69f'],               // peach horizon
  ['#3a6073', '#16222a'],               // midnight pine
  ['#fdcbf1', '#e6dee9'],               // morning rose
  ['#56ab2f', '#a8e063'],               // spring grass
  ['#1f4037', '#99f2c8'],               // evergreen
  ['#ee9ca7', '#ffdde1'],               // soft sunset
  ['#3e5151', '#decba4'],               // riverbed
];

// djb2-ish string hash → stable index into the gradient pool.
function _hashIndex(str, mod) {
  let h = 5381;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) + s.charCodeAt(i);
    h = h & 0xffffffff;
  }
  return Math.abs(h) % mod;
}

// Curated category gradients — short closed-set names hash collide, so
// assign by hand for guaranteed distinctness across the 7 garment types.
const CATEGORY_GRADIENTS = {
  tops:           ['#89f7fe', '#66a6ff'],
  bottoms:        ['#4b6cb7', '#182848'],
  dresses:        ['#a18cd1', '#fbc2eb'],
  outerwear:      ['#3a6073', '#16222a'],
  intimates_swim: ['#ee9ca7', '#ffdde1'],
  shoes:          ['#f6d365', '#fda085'],
  accessories:    ['#1f4037', '#99f2c8'],
  __none__:       ['#3e5151', '#decba4'],
};

function _gradientFor(key, categoryHint) {
  if (categoryHint && CATEGORY_GRADIENTS[categoryHint]) {
    return `linear-gradient(135deg, ${CATEGORY_GRADIENTS[categoryHint].join(', ')})`;
  }
  const stops = TILE_GRADIENTS[_hashIndex(key, TILE_GRADIENTS.length)];
  return `linear-gradient(135deg, ${stops.join(', ')})`;
}

// ---- Grouping --------------------------------------------------------------

function _groupByBrand(items) {
  const map = new Map();
  for (const item of items) {
    const brand = (item.brand || '').trim() || '— No brand —';
    if (!map.has(brand)) map.set(brand, []);
    map.get(brand).push(item);
  }
  const groups = [];
  for (const [brand, list] of map.entries()) {
    groups.push({
      key: brand,
      label: brand,
      count: list.length,
      filterKey: 'brand',
      filterValue: brand === '— No brand —' ? '__none__' : brand,
    });
  }
  // Sort: real brands first (alphabetically), no-brand bucket last
  groups.sort((a, b) => {
    if (a.label === '— No brand —') return 1;
    if (b.label === '— No brand —') return -1;
    return a.label.localeCompare(b.label);
  });
  return groups;
}

function _groupByCategory(items) {
  const groups = [];
  for (const [id, def] of Object.entries(GARMENT_TYPES)) {
    const list = items.filter(i => i.garmentType === id);
    if (list.length === 0) continue;
    groups.push({
      key: id,
      label: def.label,
      count: list.length,
      filterKey: 'garmentType',
      filterValue: id,
    });
  }
  const uncat = items.filter(i => !i.garmentType);
  if (uncat.length > 0) {
    groups.push({
      key: '__none__',
      label: 'Uncategorized',
      count: uncat.length,
      filterKey: 'garmentType',
      filterValue: '__none__',
    });
  }
  return groups;
}

function _filterGroupsBySearch(groups, query) {
  if (!query) return groups;
  const q = query.toLowerCase();
  return groups.filter(g => g.label.toLowerCase().includes(q));
}

// ---- Rendering -------------------------------------------------------------

async function renderBrowseView(main, params = {}) {
  const allItems = await dbGetAllItems();
  const items = (typeof activeItems === 'function') ? activeItems(allItems) : allItems;
  const tab = params.tab === 'category' ? 'category' : 'brand';
  const search = (params.q || '').trim();

  const groups = tab === 'brand' ? _groupByBrand(items) : _groupByCategory(items);
  const visible = _filterGroupsBySearch(groups, search);

  const baseHash = '#/browse';
  const placeholder = tab === 'brand' ? 'Browse all brands' : 'Browse all categories';

  main.innerHTML = `
    <div class="page-header" style="justify-content: center; flex-direction: column; text-align: center; gap: 0;">
      <h1 class="browse-title">Shop by</h1>
    </div>

    <div class="tab-bar">
      <a class="tab ${tab === 'brand' ? 'active' : ''}" href="${baseHash}?tab=brand" data-tab="brand">Brand</a>
      <a class="tab ${tab === 'category' ? 'active' : ''}" href="${baseHash}?tab=category" data-tab="category">Category</a>
    </div>

    <div class="browse-search">
      <input class="input" type="search" id="browseSearch" placeholder="${placeholder}" value="${escapeHtml(search)}" />
    </div>

    ${items.length === 0 ? `
      <div class="empty">
        <div class="empty-title">No items yet</div>
        <p>Add some clothing pieces to see them grouped by ${tab === 'brand' ? 'brand' : 'category'}.</p>
        <a href="#/add" class="btn btn-primary">+ Add your first piece</a>
      </div>
    ` : visible.length === 0 ? `
      <div class="empty">
        <div class="empty-title">No matches</div>
        <p>Nothing here matches "${escapeHtml(search)}". Try a different search.</p>
      </div>
    ` : `
      <div class="tile-grid">
        ${visible.map(g => _renderTile(g)).join('')}
      </div>
    `}
  `;

  const searchInput = document.getElementById('browseSearch');
  if (searchInput) {
    const debounced = debounce(() => {
      const q = searchInput.value.trim();
      const qs = `tab=${tab}` + (q ? `&q=${encodeURIComponent(q)}` : '');
      location.hash = `/browse?${qs}`;
    }, 200);
    searchInput.addEventListener('input', debounced);
  }
}

function _renderTile(group) {
  const targetHash = `#/closet?${group.filterKey}=${encodeURIComponent(group.filterValue)}`;
  // Use the curated category mapping when this is a garmentType tile
  const categoryHint = group.filterKey === 'garmentType' ? group.key : null;
  const gradient = _gradientFor(group.key, categoryHint);
  return `
    <a class="tile tile-modern" href="${targetHash}" data-group-key="${escapeHtml(group.key)}">
      <div class="tile-vignette"></div>
      <div class="tile-content">
        <div class="tile-label">${escapeHtml(group.label)}</div>
        <div class="tile-count">${group.count} ${group.count === 1 ? 'piece' : 'pieces'}</div>
      </div>
    </a>
  `;
}


/* ===== js/app-r10.js ===== */
// app.js — main router and app glue

const ROUTES = ['browse', 'closet', 'add', 'outfits', 'build', 'recover', 'audit', 'insights', 'wishlist', 'girlmath', 'trip', 'compare', 'capsule', 'returned', 'daily', 'slideshow', 'notes', 'receipts', 'returns-due', 'shop', 'top10', 'cart-import', 'email-import'];

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query = ''] = raw.split('?');
  const params = {};
  query.split('&').filter(Boolean).forEach(p => {
    const [k, v = ''] = p.split('=');
    params[decodeURIComponent(k)] = decodeURIComponent(v);
  });
  const route = ROUTES.includes(path) ? path : 'closet';
  return { route, params };
}

async function router() {
  const main = document.getElementById('main');
  const { route, params } = parseHash();
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.route === route);
  });
  switch (route) {
    case 'browse':  await renderBrowseView(main, params); break;
    case 'closet':  await renderClosetView(main, params, true); break;
    case 'add':     await renderAddView(main); break;
    case 'outfits': await renderOutfitsView(main); break;
    case 'build':   await renderBuilderView(main, params); break;
    case 'recover': if (typeof window.renderRecoverView === 'function') await window.renderRecoverView(main); break;
    case 'audit':   if (typeof window.renderAuditView === 'function') await window.renderAuditView(main); break;
    case 'insights': if (typeof window.renderInsightsView === 'function') await window.renderInsightsView(main); break;
    case 'wishlist': if (typeof window.renderWishlistView === 'function') await window.renderWishlistView(main); break;
    case 'girlmath': if (typeof window.renderGirlMathView === 'function') await window.renderGirlMathView(main); break;
    case 'trip':     if (typeof window.renderTripView === 'function') await window.renderTripView(main); break;
    case 'compare':  if (typeof window.renderCompareView === 'function') await window.renderCompareView(main); break;
    case 'capsule':  if (typeof window.renderCapsuleView === 'function') await window.renderCapsuleView(main); break;
    case 'returned': if (typeof window.renderReturnedView === 'function') await window.renderReturnedView(main); break;
    case 'daily':    if (typeof window.renderDailyView === 'function') await window.renderDailyView(main); break;
    case 'slideshow': if (typeof window.renderSlideshowView === 'function') await window.renderSlideshowView(main); break;
    case 'notes':    if (typeof window.renderNotesView === 'function') await window.renderNotesView(main); break;
    case 'receipts': if (typeof window.renderReceiptsView === 'function') await window.renderReceiptsView(main); break;
    case 'returns-due': if (typeof window.renderReturnsDueView === 'function') await window.renderReturnsDueView(main); break;
    case 'shop':     if (typeof window.renderShopView === 'function') await window.renderShopView(main); break;
    case 'top10':    if (typeof window.renderTop10View === 'function') await window.renderTop10View(main); break;
    case 'cart-import': if (typeof window.renderCartImportView === 'function') await window.renderCartImportView(main); break;
    case 'email-import': if (typeof window.renderEmailImportView === 'function') await window.renderEmailImportView(main); break;
    default:        await renderClosetView(main, params, true);
  }
}

async function refreshSidebarCount() {
  try {
    const items = await dbGetAllItems();
    const active = (typeof activeItems === 'function') ? activeItems(items) : items;
    updateItemCount(active.length);
  } catch (e) {
    console.error(e);
  }
}

// ===== Progress overlay =====
function showProgress(title) {
  let el = document.getElementById('progressOverlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'progressOverlay';
    el.className = 'progress-overlay';
    el.innerHTML = `
      <div class="progress-card">
        <div class="progress-title" id="progressTitle"></div>
        <div class="progress-bar-track"><div class="progress-bar-fill" id="progressBar"></div></div>
        <div class="progress-detail" id="progressDetail">Starting…</div>
      </div>
    `;
    document.body.appendChild(el);
  }
  document.getElementById('progressTitle').textContent = title;
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('progressDetail').textContent = 'Starting…';
  el.style.display = 'flex';
}

function updateProgress(done, total, label) {
  const bar = document.getElementById('progressBar');
  const detail = document.getElementById('progressDetail');
  if (!bar || !detail) return;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  bar.style.width = pct + '%';
  detail.textContent = `${done} of ${total}${label ? ' · ' + label : ''}`;
}

function hideProgress() {
  const el = document.getElementById('progressOverlay');
  if (el) el.style.display = 'none';
}

window.addEventListener('hashchange', router);

function showLoginOverlay() {
  document.getElementById('loginOverlay').hidden = false;
  document.querySelector('.app').style.display = 'none';
  document.getElementById('sidebarUser').hidden = true;
  setTimeout(() => document.getElementById('loginUsername').focus(), 50);
}

function hideLoginOverlay() {
  document.getElementById('loginOverlay').hidden = true;
  document.querySelector('.app').style.display = '';
  const user = getCurrentUser();
  const userBlock = document.getElementById('sidebarUser');
  if (user && userBlock) {
    userBlock.hidden = false;
    document.getElementById('sidebarUserName').textContent = '@' + user.username;
  }
}

function setLoginError(msg) {
  const el = document.getElementById('loginError');
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.hidden = false;
  } else {
    el.textContent = '';
    el.hidden = true;
  }
}

function wireLoginScreen() {
  const tabs = document.querySelectorAll('.login-tab');
  const submitBtn = document.getElementById('loginSubmit');
  const footnote = document.getElementById('loginFootnote');
  let mode = 'signin';
  // If no users exist yet, default to "Create account"
  if (typeof userCount === 'function' && userCount() === 0) {
    mode = 'signup';
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === 'signup'));
    submitBtn.textContent = 'Create account';
    if (footnote) footnote.textContent = 'No accounts on this device yet — create the first one.';
  }
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      mode = t.dataset.tab;
      tabs.forEach(x => x.classList.toggle('active', x === t));
      submitBtn.textContent = mode === 'signin' ? 'Sign in' : 'Create account';
      if (footnote) footnote.textContent = mode === 'signin'
        ? 'Accounts are stored on this device only. Each account has its own private closet.'
        : 'Pick a username and password. Both are stored only on this device.';
      setLoginError('');
    });
  });
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoginError('');
    submitBtn.disabled = true;
    submitBtn.textContent = (mode === 'signin' ? 'Signing in…' : 'Creating account…');
    try {
      const u = document.getElementById('loginUsername').value;
      const p = document.getElementById('loginPassword').value;
      let migrated = null;
      const tryMigrate = async () => {
        try {
          const result = await migrateGuestToCurrentUser();
          if (result && (result.items > 0 || result.outfits > 0)) migrated = result;
        } catch (mig) {
          console.warn('Guest data migration skipped:', mig);
        }
      };
      if (mode === 'signin') {
        await signIn(u, p);
        // Self-heal: if this account has nothing yet and the guest DB has
        // items (e.g. account was created before migration shipped),
        // pull the guest data in.
        const existing = await dbGetAllItems();
        if (existing.length === 0) await tryMigrate();
      } else {
        await createAccount(u, p);
        await tryMigrate();
      }
      document.getElementById('loginPassword').value = '';
      hideLoginOverlay();
      // If a cart import was stashed before signin, route to wishlist so it processes
      try {
        if (sessionStorage.getItem('vc:pendingCartImport') && !location.hash.startsWith('#/wishlist')) {
          location.hash = '#/wishlist';
        }
      } catch (_) {}
      // Same handoff for an email order-import: route to closet so the
      // deferred import lands in the user's own DB instead of the guest one.
      try {
        if (sessionStorage.getItem('vc:pendingOrderImport') && !location.hash.startsWith('#/closet')) {
          location.hash = '#/closet';
        }
      } catch (_) {}
      await router();
      await refreshSidebarCount();
      if (migrated) {
        showToast(`Welcome — moved ${migrated.items} item${migrated.items === 1 ? '' : 's'}` +
          (migrated.outfits ? ` and ${migrated.outfits} outfit${migrated.outfits === 1 ? '' : 's'}` : '') +
          ' from your previous closet');
      }
    } catch (err) {
      setLoginError(err.message || String(err));
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = mode === 'signin' ? 'Sign in' : 'Create account';
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  wireLoginScreen();
  document.getElementById('signOutBtn').addEventListener('click', () => {
    signOut();
    location.reload();
  });
  document.getElementById('exportBtn').addEventListener('click', async () => {
    try {
      showProgress('Preparing backup');
      updateProgress(0, 1, 'Reading database…');
      const data = await dbExportAll();
      updateProgress(1, 1, 'Done');
      const stamp = new Date().toISOString().slice(0, 10);
      downloadJson(data, 'virtual-closet-backup-' + stamp + '.json');
      hideProgress();
      showToast('Backup downloaded');
    } catch (err) {
      hideProgress();
      console.error(err);
      alert('Backup failed: ' + err.message);
    }
  });

  document.getElementById('importInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || !Array.isArray(data.items)) {
        throw new Error('That file does not look like a Virtual Closet backup. Expected an "items" array.');
      }
      const itemCount = data.items.length;
      const outfitCount = Array.isArray(data.outfits) ? data.outfits.length : 0;
      const ok = confirm(
        `Import ${itemCount} clothing item${itemCount === 1 ? '' : 's'}` +
        (outfitCount ? ` and ${outfitCount} outfit${outfitCount === 1 ? '' : 's'}` : '') +
        '?\n\nThese will be added to your existing closet.'
      );
      if (!ok) { e.target.value = ''; return; }

      showProgress('Importing your closet');
      const newIds = await dbImportAll(data, (done, total, name) => {
        updateProgress(done, total, name);
      });
      hideProgress();

      // Remember the newly imported IDs so the closet view can offer a review
      try {
        sessionStorage.setItem('vc:lastImportIds', JSON.stringify(newIds));
        sessionStorage.setItem('vc:lastImportAt', String(Date.now()));
      } catch (_) { /* sessionStorage may be unavailable in some contexts */ }

      showToast(`Imported ${newIds.length} item${newIds.length === 1 ? '' : 's'}`);

      // Force navigation to closet (or refresh if already there)
      if (location.hash !== '#/closet') {
        location.hash = '#/browse';
      } else {
        await router();
      }
      refreshSidebarCount();
    } catch (err) {
      hideProgress();
      console.error(err);
      alert('Import failed: ' + err.message + '\n\nNothing was changed if this happened on the first item. Check the browser console (F12) for details.');
    }
    e.target.value = '';
  });

  // Auth gate: every load shows the login screen unless an active session exists
  if (!getCurrentUser()) {
    showLoginOverlay();
    return;
  }
  hideLoginOverlay();

  if (!location.hash) {
    location.hash = '#/browse';
  }
  await router();
  await refreshSidebarCount();
});


// Mobile sidebar toggle (separate listener — no awaits needed here)
window.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('sidebarToggle');
  var sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    var links = sidebar.querySelectorAll('.nav-link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () { sidebar.classList.remove('open'); });
    }
  }
});


/* ===== js/recover-r1.js ===== */
// recover-r1.js — Recovery view at #/recover
// Lists every IndexedDB database on this origin, shows item counts,
// and offers one-click copy from any source DB into the current account.

(function() {
  function open(name, mode) {
    return new Promise((res, rej) => {
      const r = indexedDB.open(name, mode || undefined);
      r.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('items')) {
          const items = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
          items.createIndex('garmentType', 'garmentType', { unique: false });
          items.createIndex('createdAt', 'createdAt', { unique: false });
        }
        if (!db.objectStoreNames.contains('outfits')) {
          db.createObjectStore('outfits', { keyPath: 'id', autoIncrement: true });
        }
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }

  async function countItems(db) {
    if (!db.objectStoreNames.contains('items')) return 0;
    return await new Promise((res) => {
      const tx = db.transaction('items', 'readonly');
      const r = tx.objectStore('items').count();
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(0);
    });
  }

  async function listDBs() {
    if (indexedDB.databases) return await indexedDB.databases();
    // Fallback: probe known names
    return [
      { name: 'virtual-closet' }, { name: 'virtual-closet-guest' },
    ];
  }

  async function copyItems(sourceName, targetName, log) {
    const src = await open(sourceName);
    const tgt = await open(targetName, 1);
    let items = [];
    if (src.objectStoreNames.contains('items')) {
      items = await new Promise((res) => {
        const tx = src.transaction('items', 'readonly');
        const r = tx.objectStore('items').getAll();
        r.onsuccess = () => res(r.result || []);
        r.onerror = () => res([]);
      });
    }
    let copied = 0;
    for (const it of items) {
      const { id, ...rest } = it;
      try {
        await new Promise((res, rej) => {
          const tx = tgt.transaction('items', 'readwrite');
          const r = tx.objectStore('items').add({ ...rest, createdAt: rest.createdAt || Date.now() });
          r.onsuccess = () => { copied++; res(); };
          r.onerror = () => rej(r.error);
        });
      } catch (e) {
        log('  · failed item: ' + (rest.name || rest.subtype || '?') + ' (' + (e?.message || e) + ')');
      }
    }
    src.close();
    tgt.close();
    return copied;
  }

  async function render() {
    const main = document.getElementById('main');
    if (!main) return;

    const session = JSON.parse(sessionStorage.getItem('vc:currentUser') || 'null');
    const userKey = session ? 'virtual-closet-' + session.id : null;

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Recover items</h1>
          <div class="page-subtitle">Find and copy clothing items from another database</div>
        </div>
        <a href="#/closet" class="btn">Back</a>
      </div>
      <div id="recoverBody" style="margin-top: 18px;">
        <p class="muted">Scanning databases…</p>
      </div>
    `;

    const body = document.getElementById('recoverBody');

    if (!session) {
      body.innerHTML = '<p class="muted">You are not signed in. <a href="#/closet">Go to closet</a> and sign in first.</p>';
      return;
    }

    const dbs = await listDBs();
    const rows = [];
    for (const meta of dbs) {
      if (!meta.name) continue;
      try {
        const db = await open(meta.name);
        const c = await countItems(db);
        rows.push({ name: meta.name, count: c, isCurrent: meta.name === userKey });
        db.close();
      } catch (e) { /* skip */ }
    }
    rows.sort((a, b) => b.count - a.count);

    body.innerHTML = `
      <div style="margin-bottom: 14px; padding: 12px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius);">
        <div class="muted" style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;">Signed in as</div>
        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; margin-top: 2px;">@${session.username}</div>
        <div class="muted" style="font-size: 11px; margin-top: 2px;">Active database: <code>${userKey}</code></div>
      </div>

      <div class="muted" style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px;">All databases on this device</div>
      <div style="display: flex; flex-direction: column; gap: 8px;" id="dbList">
        ${rows.map(r => `
          <div class="card" style="padding: 14px; flex-direction: row; align-items: center; gap: 16px;">
            <div style="flex: 1; min-width: 0;">
              <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px;">${r.name}${r.isCurrent ? ' <span class="muted" style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; margin-left: 6px;">current</span>' : ''}</div>
              <div class="muted" style="font-size: 13px; margin-top: 2px;">${r.count} item${r.count === 1 ? '' : 's'}</div>
            </div>
            ${!r.isCurrent && r.count > 0 ? `<button class="btn btn-primary" data-source="${r.name}">Copy ${r.count} item${r.count === 1 ? '' : 's'} into my closet</button>` : ''}
          </div>
        `).join('')}
      </div>
      <div id="recoverLog" style="margin-top: 18px; padding: 12px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius); font-family: monospace; font-size: 11.5px; white-space: pre-wrap; max-height: 280px; overflow-y: auto;"></div>
    `;

    const logEl = document.getElementById('recoverLog');
    const log = (msg) => { logEl.textContent += msg + '\n'; logEl.scrollTop = logEl.scrollHeight; };
    log('Ready. Click a "Copy" button above to migrate items from that database into @' + session.username + "'s closet.");

    document.querySelectorAll('#dbList button[data-source]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const src = btn.dataset.source;
        if (!confirm(`Copy items from "${src}" into your @${session.username} closet?\n\nThe source database stays unchanged.`)) return;
        btn.disabled = true; btn.textContent = 'Copying…';
        log('\nCopying from ' + src + ' → ' + userKey + ' …');
        try {
          const copied = await copyItems(src, userKey, log);
          log('Done. Copied ' + copied + ' item' + (copied === 1 ? '' : 's') + '.');
          btn.textContent = 'Copied ' + copied;
          // Reload after a short delay so user sees their items
          setTimeout(() => location.hash = '#/closet', 1500);
        } catch (e) {
          log('Error: ' + (e?.message || e));
          btn.disabled = false;
          btn.textContent = 'Try again';
        }
      });
    });
  }

  window.renderRecoverView = render;
  function maybeRender() {
    if (location.hash === '#/recover') render();
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeRender);
  } else {
    maybeRender();
  }
})();


/* ===== js/audit-r1.js ===== */
// audit-r1.js — Photo Quality Audit at #/audit
// Scans every item, measures the photo's natural pixel dimensions, and
// lists items whose photos are below a configurable quality threshold so
// the user can replace them with sharper sources.

(function() {
  const QUALITY_THRESHOLD = 800;  // max dimension (px) — anything under is "low res"
  const VERY_LOW = 500;           // anything under this is "very low"

  function naturalDimensions(blob) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        resolve({ w: img.naturalWidth, h: img.naturalHeight });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        resolve({ w: 0, h: 0 });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  }

  function qualityLabel(maxSide) {
    if (maxSide < VERY_LOW) return { label: 'Very low', color: '#a02020' };
    if (maxSide < QUALITY_THRESHOLD) return { label: 'Low', color: '#a06b20' };
    if (maxSide < 1100) return { label: 'OK', color: '#5a6b30' };
    return { label: 'Sharp', color: '#0a7d2e' };
  }

  async function render(main) {
    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Photo audit</h1>
          <div class="page-subtitle">Find pieces with low-resolution photos to replace</div>
        </div>
        <a href="#/closet" class="btn">Back to closet</a>
      </div>
      <div id="auditBody" style="margin-top: 18px;">
        <p class="muted">Scanning your closet…</p>
        <div class="progress-bar-track" style="margin-top: 10px;"><div class="progress-bar-fill" id="auditBar"></div></div>
      </div>
    `;

    const items = await dbGetAllItems();
    const body = document.getElementById('auditBody');
    const bar = document.getElementById('auditBar');

    if (items.length === 0) {
      body.innerHTML = '<p class="muted">No items yet. <a href="#/add">Add some</a> first.</p>';
      return;
    }

    // Measure each item's cover photo
    const measured = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let dims = { w: 0, h: 0 };
      if (item.photo) dims = await naturalDimensions(item.photo);
      measured.push({ item, dims });
      bar.style.width = Math.round(((i + 1) / items.length) * 100) + '%';
    }

    // Sort: lowest max-side first
    measured.sort((a, b) => Math.max(a.dims.w, a.dims.h) - Math.max(b.dims.w, b.dims.h));

    // Buckets
    const veryLow = measured.filter(m => Math.max(m.dims.w, m.dims.h) < VERY_LOW && m.dims.w > 0);
    const low = measured.filter(m => {
      const max = Math.max(m.dims.w, m.dims.h);
      return max >= VERY_LOW && max < QUALITY_THRESHOLD;
    });
    const ok = measured.filter(m => Math.max(m.dims.w, m.dims.h) >= QUALITY_THRESHOLD);
    const noPhoto = measured.filter(m => m.dims.w === 0);

    function rowHtml(m) {
      const it = m.item;
      const dims = m.dims;
      const max = Math.max(dims.w, dims.h);
      const q = qualityLabel(max);
      const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
      const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
      const meta = [it.brand, it.color, labelForGarmentType(it.garmentType)].filter(Boolean).join(' · ');
      return `
        <div class="audit-row" data-item-id="${it.id}">
          <div class="audit-thumb" style="background-image:url('${url}')"></div>
          <div class="audit-info">
            <div class="audit-name">${escapeHtml(name)}</div>
            <div class="audit-meta">${escapeHtml(meta)}</div>
          </div>
          <div class="audit-dims">
            <span class="audit-q-pill" style="background:${q.color}">${q.label}</span>
            <span class="audit-dim-text">${dims.w} × ${dims.h}</span>
          </div>
          <button class="btn" data-edit="${it.id}">Replace photo</button>
        </div>
      `;
    }

    body.innerHTML = `
      <div class="audit-summary">
        <div><strong>${measured.length}</strong> total · <strong style="color:#a02020">${veryLow.length}</strong> very low · <strong style="color:#a06b20">${low.length}</strong> low · <strong style="color:#0a7d2e">${ok.length}</strong> sharp${noPhoto.length ? ` · <strong>${noPhoto.length}</strong> no photo` : ''}</div>
        <div class="muted" style="font-size: 11.5px; margin-top: 4px;">Threshold: max dimension < ${QUALITY_THRESHOLD}px = needs replacement</div>
      </div>

      ${veryLow.length > 0 ? `
        <h2 style="margin-top: 24px; font-size: 18px;">Very low (${veryLow.length})</h2>
        <div class="audit-list">${veryLow.map(rowHtml).join('')}</div>
      ` : ''}

      ${low.length > 0 ? `
        <h2 style="margin-top: 24px; font-size: 18px;">Low (${low.length})</h2>
        <div class="audit-list">${low.map(rowHtml).join('')}</div>
      ` : ''}

      ${noPhoto.length > 0 ? `
        <h2 style="margin-top: 24px; font-size: 18px;">No photo (${noPhoto.length})</h2>
        <div class="audit-list">${noPhoto.map(rowHtml).join('')}</div>
      ` : ''}

      ${veryLow.length === 0 && low.length === 0 ? `
        <div class="empty" style="margin-top: 24px;">
          <div class="empty-title">All photos look sharp ✓</div>
          <p>Every piece has a photo at ${QUALITY_THRESHOLD}px or higher on its longest side.</p>
        </div>
      ` : ''}
    `;

    // Wire Edit buttons
    body.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.edit);
        if (typeof openItemEdit === 'function') openItemEdit(id);
      });
    });
  }

  window.renderAuditView = function(main) {
    return render(main || document.getElementById('main'));
  };

  // Hashchange fallback in case app router doesn't have the route
  function maybeRender() {
    if (location.hash === '#/audit') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeRender);
  } else {
    maybeRender();
  }
})();


/* ===== js/insights-r7.js ===== */
// insights-r1.js — Closet Insights at #/insights
// Three tabs: Photo quality / Declutter / Gaps
// - Photo quality reuses the audit logic
// - Declutter groups items by status (donate, consign, repair, sold)
// - Gaps runs the suggester across every occasion and aggregates which
//   slots couldn't be filled, with shop links

(function() {
  const QUALITY_THRESHOLD = 800;
  const VERY_LOW = 500;

  function naturalDimensions(blob) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { resolve({ w: img.naturalWidth, h: img.naturalHeight }); URL.revokeObjectURL(url); };
      img.onerror = () => { resolve({ w: 0, h: 0 }); URL.revokeObjectURL(url); };
      img.src = url;
    });
  }
  function qualityLabel(maxSide) {
    if (maxSide < VERY_LOW) return { label: 'Very low', color: '#a02020' };
    if (maxSide < QUALITY_THRESHOLD) return { label: 'Low', color: '#a06b20' };
    if (maxSide < 1100) return { label: 'OK', color: '#5a6b30' };
    return { label: 'Sharp', color: '#0a7d2e' };
  }

  function rowHtml(item, extraRight) {
    const url = item.thumb ? blobToUrl(item.thumb) : (item.photo ? blobToUrl(item.photo) : '');
    const name = item.name || item.subtype || labelForGarmentType(item.garmentType) || 'Untitled';
    const meta = [item.brand, item.color, labelForGarmentType(item.garmentType)].filter(Boolean).join(' · ');
    return `
      <div class="audit-row" data-item-id="${item.id}">
        <div class="audit-thumb" style="background-image:url('${url}')"></div>
        <div class="audit-info">
          <div class="audit-name">${escapeHtml(name)}</div>
          <div class="audit-meta">${escapeHtml(meta)}</div>
        </div>
        ${extraRight || ''}
        <button class="btn" data-edit="${item.id}">Edit</button>
      </div>
    `;
  }

  // ===== Colors tab =====
  // Uses the global COLOR_HEX + COLOR_FAMILIES from data-r6.js so the palette
  // stays a single source of truth.
  function pieSlicePath(cx, cy, r, startA, endA) {
    const x1 = cx + r * Math.cos(startA);
    const y1 = cy + r * Math.sin(startA);
    const x2 = cx + r * Math.cos(endA);
    const y2 = cy + r * Math.sin(endA);
    const large = endA - startA > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  }

  function renderColorsTab(container, items) {
    // Returned items are no longer owned — exclude from the palette.
    if (typeof activeItems === 'function') items = activeItems(items);
    // Group items by color, after passing each through normalizeColor() so
    // brand-specific names (e.g. "Blue Coast Heather") roll up to canonical
    // palette entries (Navy) for the pie + family grouping.
    const counts = new Map();
    let untagged = 0;
    for (const i of items) {
      let c = (i.color || '').trim();
      if (!c) { untagged++; continue; }
      if (typeof normalizeColor === 'function') c = normalizeColor(c);
      counts.set(c, (counts.get(c) || 0) + 1);
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, v]) => s + v, 0);

    if (total === 0) {
      container.innerHTML = `
        <div class="empty" style="margin-top: 20px;">
          <div class="empty-title">No colors logged yet</div>
          <p>Add a color when you create or edit a piece, and the pie will fill in.</p>
        </div>
      `;
      return;
    }

    // Build pie slices
    const cx = 110, cy = 110, r = 100;
    let angle = -Math.PI / 2; // start at top
    const slices = sorted.map(([name, count]) => {
      const sweep = (count / total) * Math.PI * 2;
      const path = pieSlicePath(cx, cy, r, angle, angle + sweep);
      const fill = COLOR_HEX[name] || '#bbb';
      const stroke = name === 'White' || name === 'Cream' || name === 'Mint' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.6)';
      const pct = ((count / total) * 100).toFixed(1);
      const slice = { name, count, pct, fill, path, stroke };
      angle += sweep;
      return slice;
    });

    // Group slices by color family for the legend
    const byFamily = new Map();
    for (const s of slices) {
      const fam = (typeof familyForColor === 'function') ? familyForColor(s.name) : 'Other';
      if (!byFamily.has(fam)) byFamily.set(fam, []);
      byFamily.get(fam).push(s);
    }
    // Order families consistently with COLOR_FAMILIES (when defined), append Other/Special
    const familyOrder = (typeof COLOR_FAMILIES === 'object')
      ? [...Object.keys(COLOR_FAMILIES), 'Special', 'Other']
      : [...byFamily.keys()];
    const legendHtml = familyOrder
      .filter(fam => byFamily.has(fam))
      .map(fam => {
        const familySlices = byFamily.get(fam);
        const familyTotal = familySlices.reduce((s, x) => s + x.count, 0);
        const familyPct = ((familyTotal / total) * 100).toFixed(1);
        const rows = familySlices.map(s => {
          const isLight = ['White', 'Ivory', 'Light Ivory', 'Cream', 'Champagne', 'Pale Yellow', 'Butter', 'Mint'].includes(s.name);
          return `
            <a class="color-legend-row" href="#/closet?color=${encodeURIComponent(s.name)}" title="Show all ${escapeHtml(s.name)} pieces">
              <span class="color-swatch" style="background:${s.fill};${isLight ? ' border: 1px solid var(--border-strong);' : ''}"></span>
              <span class="color-legend-name">${escapeHtml(s.name)}</span>
              <span class="color-legend-count">${s.count}</span>
              <span class="color-legend-pct">${s.pct}%</span>
            </a>
          `;
        }).join('');
        return `
          <div class="color-family-block">
            <div class="color-family-header">
              <span class="color-family-name">${escapeHtml(fam)}</span>
              <span class="color-family-count">${familyTotal} · ${familyPct}%</span>
            </div>
            ${rows}
          </div>
        `;
      }).join('');

    // (See bottom of this function for click handlers.)
    container.innerHTML = `
      <div class="audit-summary">
        <div><strong>${total}</strong> piece${total === 1 ? '' : 's'} across <strong>${sorted.length}</strong> color${sorted.length === 1 ? '' : 's'}${untagged > 0 ? ` · <strong>${untagged}</strong> without a color tag` : ''}.</div>
        <div class="muted" style="font-size: 11.5px; margin-top: 4px;">Top: ${sorted.slice(0, 3).map(([n, c]) => n + ' (' + c + ')').join(' · ')}</div>
      </div>

      <div class="color-grid">
        <div class="color-pie-wrap">
          <svg viewBox="0 0 220 220" class="color-pie" aria-label="Color distribution pie chart">
            <defs>
              <linearGradient id="multi-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f0826e"/>
                <stop offset="33%" stop-color="#f0dc50"/>
                <stop offset="66%" stop-color="#50c8c8"/>
                <stop offset="100%" stop-color="#8250b4"/>
              </linearGradient>
            </defs>
            ${slices.map(s => `<path d="${s.path}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="1" data-color="${escapeHtml(s.name)}"><title>${escapeHtml(s.name)} — ${s.count} (${s.pct}%)</title></path>`).join('')}
          </svg>
        </div>
        <div class="color-legend">${legendHtml}</div>
      </div>

      ${untagged > 0 ? `
        <div class="muted" style="margin-top: 16px; font-size: 12.5px;">
          ${untagged} piece${untagged === 1 ? '' : 's'} ${untagged === 1 ? 'is' : 'are'} missing a color tag. Add one in the Edit modal to include in the chart.
        </div>
      ` : ''}
    `;

    // Make pie slices clickable — navigate to closet filtered by that color
    container.querySelectorAll('.color-pie path[data-color]').forEach(p => {
      p.style.cursor = 'pointer';
      p.addEventListener('click', () => {
        const c = p.getAttribute('data-color');
        if (c) location.hash = '/closet?color=' + encodeURIComponent(c);
      });
    });
  }

  // ===== Photos tab =====
  async function renderPhotosTab(container, items) {
    container.innerHTML = `
      <p class="muted">Scanning photos…</p>
      <div class="progress-bar-track" style="margin-top: 10px;"><div class="progress-bar-fill" id="photoBar"></div></div>
    `;
    const bar = container.querySelector('#photoBar');
    const measured = [];
    for (let i = 0; i < items.length; i++) {
      let dims = { w: 0, h: 0 };
      if (items[i].photo) dims = await naturalDimensions(items[i].photo);
      measured.push({ item: items[i], dims });
      bar.style.width = Math.round(((i + 1) / items.length) * 100) + '%';
    }
    measured.sort((a, b) => Math.max(a.dims.w, a.dims.h) - Math.max(b.dims.w, b.dims.h));
    const veryLow = measured.filter(m => Math.max(m.dims.w, m.dims.h) < VERY_LOW && m.dims.w > 0);
    const low = measured.filter(m => { const max = Math.max(m.dims.w, m.dims.h); return max >= VERY_LOW && max < QUALITY_THRESHOLD; });
    const ok = measured.filter(m => Math.max(m.dims.w, m.dims.h) >= QUALITY_THRESHOLD);
    const noPhoto = measured.filter(m => m.dims.w === 0);

    function section(title, list) {
      if (!list.length) return '';
      return `<h2 style="margin-top: 20px; font-size: 16px;">${title} (${list.length})</h2>
        <div class="audit-list">${list.map(m => {
          const q = qualityLabel(Math.max(m.dims.w, m.dims.h));
          const right = `<div class="audit-dims"><span class="audit-q-pill" style="background:${q.color}">${q.label}</span><span class="audit-dim-text">${m.dims.w} × ${m.dims.h}</span></div>`;
          return rowHtml(m.item, right);
        }).join('')}</div>`;
    }

    container.innerHTML = `
      <div class="audit-summary">
        <div><strong>${measured.length}</strong> total · <strong style="color:#a02020">${veryLow.length}</strong> very low · <strong style="color:#a06b20">${low.length}</strong> low · <strong style="color:#0a7d2e">${ok.length}</strong> sharp${noPhoto.length ? ` · <strong>${noPhoto.length}</strong> no photo` : ''}</div>
        <div class="muted" style="font-size: 11.5px; margin-top: 4px;">Threshold: max dimension < ${QUALITY_THRESHOLD}px = needs replacement</div>
      </div>
      ${section('Very low', veryLow)}
      ${section('Low', low)}
      ${section('No photo', noPhoto)}
      ${veryLow.length === 0 && low.length === 0 && noPhoto.length === 0 ? `<div class="empty" style="margin-top: 20px;"><div class="empty-title">All photos look sharp ✓</div><p>Every piece has a photo at ${QUALITY_THRESHOLD}px or higher on its longest side.</p></div>` : ''}
    `;
    wireEdits(container);
  }

  // ===== Declutter tab =====
  function renderDeclutterTab(container, items) {
    const buckets = {
      donate:   items.filter(i => i.status === 'donate'),
      consign:  items.filter(i => i.status === 'consign'),
      repair:   items.filter(i => i.status === 'repair'),
      returned: items.filter(i => i.status === 'returned'),
      sold:     items.filter(i => i.status === 'sold'),
    };
    const total = buckets.donate.length + buckets.consign.length + buckets.repair.length + buckets.returned.length + buckets.sold.length;

    // "Don't love, don't wear" candidates: low rating + low wear, status empty
    const ninetyDaysAgo = new Date(); ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyIso = ninetyDaysAgo.toISOString().slice(0, 10);
    const fb = window.ratingHelpers;
    const dontLove = items.filter(i => {
      if (i.status) return false;  // already flagged with some other status
      if (i.favorite) return false;
      const overall = fb ? fb.computeOverall(i) : 0;
      const lowRating = (overall > 0 && overall < 3);
      // Items that have an explicit low rating count regardless of wear
      if (lowRating) return true;
      // Or unrated AND not worn in 90 days (or ever)
      const wears = (i.wearLog || []).filter(d => d >= ninetyIso);
      const noRating = overall === 0;
      const lowWear = wears.length === 0;
      return noRating && lowWear;
    }).slice(0, 30);  // cap so the page isn't a wall

    function section(title, list, color) {
      if (!list.length) return '';
      return `<h2 style="margin-top: 20px; font-size: 16px;"><span style="display:inline-block; width:8px; height:8px; background:${color}; border-radius:50%; margin-right:6px;"></span>${title} (${list.length})</h2>
        <div class="audit-list">${list.map(i => {
          const right = `<div class="audit-dims"><span class="audit-q-pill" style="background:${color}">${title}</span></div>`;
          return rowHtml(i, right);
        }).join('')}</div>`;
    }

    container.innerHTML = `
      <div class="audit-summary">
        <div><strong>${total}</strong> item${total === 1 ? '' : 's'} flagged for action across your closet.</div>
        <div class="muted" style="font-size: 11.5px; margin-top: 4px;">To flag a piece, edit it and set its <strong>Status</strong> (Donate, Needs repair, Plan to sell, Selling, Returned, or Sold).</div>
      </div>
      ${dontLove.length > 0 ? `
        <h2 style="margin-top: 20px; font-size: 16px;">
          <span style="display:inline-block; width:8px; height:8px; background:#a02020; border-radius:50%; margin-right:6px;"></span>
          Don't love, don't wear (${dontLove.length})
          <span class="muted" style="font-size: 11px; font-weight: 400; margin-left: 8px;">low rating or unrated + not worn in 90 days · consider donating or selling</span>
        </h2>
        <div class="audit-list">${dontLove.map(i => {
          const overall = fb ? fb.computeOverall(i) : 0;
          const right = `<div class="audit-dims"><span class="audit-q-pill" style="background:#a02020">${overall > 0 ? overall.toFixed(1) + '★' : 'unrated'}</span></div>`;
          return rowHtml(i, right);
        }).join('')}</div>
      ` : ''}
      ${section('Donate', buckets.donate, '#a06b20')}
      ${section('Consign', buckets.consign, '#5a6b30')}
      ${section('Needs repair', buckets.repair, '#a02020')}
      ${section('Returned', buckets.returned, '#3c8282')}
      ${section('Sold / gone', buckets.sold, '#6b6b6b')}
      ${total === 0 && dontLove.length === 0 ? `<div class="empty" style="margin-top: 20px;"><div class="empty-title">Nothing flagged for action</div><p>Rate your pieces (heart on the card, or stars in Edit) to surface decluttering candidates here. Or set <strong>Status</strong> on individual items to flag them directly.</p></div>` : ''}
    `;
    wireEdits(container);
  }

  // ===== Gaps tab =====
  function renderGapsTab(container, items) {
    if (typeof generateOutfitSuggestions !== 'function' || typeof OUTFIT_RECIPES !== 'object') {
      container.innerHTML = '<p class="muted">Outfit suggester unavailable.</p>';
      return;
    }
    // Run suggester for each occasion, aggregate missing slots
    const gapMap = new Map(); // key: query, value: { slotName, query, occasions:Set, count }
    for (const occId of Object.keys(OUTFIT_RECIPES)) {
      const suggestions = generateOutfitSuggestions(occId, items, { count: 5 });
      for (const s of suggestions) {
        for (const slot of s.slots) {
          if (slot.missing) {
            const key = slot.shopQuery || slot.slotName;
            if (!gapMap.has(key)) gapMap.set(key, { slotName: slot.slotName, query: key, occasions: new Set(), count: 0 });
            const g = gapMap.get(key);
            g.occasions.add(occId);
            g.count++;
          }
        }
      }
    }
    const gaps = [...gapMap.values()]
      .map(g => ({ ...g, occasions: [...g.occasions] }))
      .sort((a, b) => b.occasions.length - a.occasions.length);

    container.innerHTML = `
      <div class="audit-summary">
        <div><strong>${gaps.length}</strong> piece type${gaps.length === 1 ? ' is' : 's are'} missing across your wardrobe.</div>
        <div class="muted" style="font-size: 11.5px; margin-top: 4px;">Each gap blocks at least one outfit suggestion. Filling gaps that affect multiple occasions gives the best ROI.</div>
      </div>
      ${gaps.length === 0 ? `
        <div class="empty" style="margin-top: 20px;">
          <div class="empty-title">No gaps detected ✓</div>
          <p>Your closet has at least one option for every slot in every occasion's outfit recipe. Lucky you.</p>
        </div>
      ` : `
        <div class="audit-list" style="margin-top: 12px;">
          ${gaps.map(g => {
            const occLabels = g.occasions.map(o => labelForOccasion(o)).join(' · ');
            const shopUrl = 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(g.query);
            const pinUrl = 'https://www.pinterest.com/search/pins/?q=' + encodeURIComponent(g.query.toLowerCase() + ' women');
            return `
              <div class="audit-row gap-row">
                <div class="audit-thumb gap-thumb">+</div>
                <div class="audit-info">
                  <div class="audit-name">${escapeHtml(g.query)}</div>
                  <div class="audit-meta">Needed for: ${escapeHtml(occLabels)}</div>
                </div>
                <div class="audit-dims" style="flex-direction: row; gap: 6px;">
                  <a class="btn btn-ghost btn-sm" href="${pinUrl}" target="_blank" rel="noopener">Pinterest</a>
                  <a class="btn btn-primary btn-sm" href="${shopUrl}" target="_blank" rel="noopener">Shop →</a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  }

  function wireEdits(container) {
    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.edit);
        if (typeof openItemEdit === 'function') openItemEdit(id);
      });
    });
  }

  // ===== Top-level render =====
  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;

    main.innerHTML = `
      <div class="page-header" style="justify-content: center; flex-direction: column; text-align: center; gap: 0;">
        <h1 class="browse-title">Closet Insights</h1>
      </div>
      <div class="tab-bar">
        <a class="tab active" data-itab="photos" href="#/insights">Photos</a>
        <a class="tab" data-itab="declutter" href="#/insights">Declutter</a>
        <a class="tab" data-itab="gaps" href="#/insights">Gaps</a>
        <a class="tab" data-itab="colors" href="#/insights">Colors</a>
      </div>
      <div id="insightsBody" style="margin-top: 12px;">
        <p class="muted">Loading…</p>
      </div>
    `;

    const body = document.getElementById('insightsBody');
    const items = await dbGetAllItems();

    if (items.length === 0) {
      body.innerHTML = '<p class="muted">No items yet. <a href="#/add">Add some</a> to see insights.</p>';
      return;
    }

    let active = 'photos';
    async function showTab(name) {
      active = name;
      main.querySelectorAll('.tab-bar .tab').forEach(t => t.classList.toggle('active', t.dataset.itab === name));
      body.innerHTML = '<p class="muted">Loading…</p>';
      if (name === 'photos') await renderPhotosTab(body, items);
      else if (name === 'declutter') renderDeclutterTab(body, items);
      else if (name === 'gaps') renderGapsTab(body, items);
      else if (name === 'colors') renderColorsTab(body, items);
    }
    main.querySelectorAll('.tab-bar .tab').forEach(t => {
      t.addEventListener('click', e => { e.preventDefault(); showTab(t.dataset.itab); });
    });
    showTab('photos');
  }

  window.renderInsightsView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/insights') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeRender);
  } else {
    maybeRender();
  }
})();


/* ===== js/wishlist-r6.js ===== */
// wishlist-r1.js — Wishlist tab at #/wishlist
// Stores items in IndexedDB store 'wishlist' (defined in db-r2.js).
// Each entry: name, brand, url, size, targetPrice, notes, photo (optional Blob).

(function() {
  let editingId = null;
  let pendingPhoto = null;   // staged photo 1 file for current form
  let pendingPhoto2 = null;  // staged photo 2 file for current form

  // ============== Inference helpers ==============
  // Map common subtype keywords (case-insensitive substrings) to garmentType + subtype
  const SUBTYPE_KEYWORDS = [
    [/\bhalf[- ]?zip\b/i,        'tops',           'Sweater'],
    [/\bhoodie\b/i,              'tops',           'Hoodie'],
    [/\bcardigan\b/i,            'tops',           'Cardigan'],
    [/\bsweater\b|\bjumper\b/i, 'tops',           'Sweater'],
    [/\bblouse\b/i,              'tops',           'Blouse'],
    [/\bbutton[- ]?up\b|\bshirt\b/i, 'tops',     'Shirt'],
    [/\btank\b/i,                'tops',           'Tank top'],
    [/\blong[- ]?sleeve\b/i,     'tops',           'Long sleeve'],
    [/\bt[- ]?shirt\b|\btee\b/i,'tops',          'T-shirt'],
    [/\bpolo\b/i,                'tops',           'Polo'],
    [/\bsports[- ]?bra\b|\bbralette\b/i, 'intimates_swim', 'Sports bra'],
    [/\bbra\b/i,                 'intimates_swim', 'Bra'],
    [/\bbikini[- ]?top\b/i,      'intimates_swim', 'Bikini top'],
    [/\bbikini[- ]?bottom\b/i,   'intimates_swim', 'Bikini bottom'],
    [/\bswim(suit)?\b|\bone[- ]?piece\b/i, 'intimates_swim', 'One-piece swimsuit'],
    [/\bunderwear\b|\bbrief\b|\bthong\b/i, 'intimates_swim', 'Underwear'],
    [/\bjeans\b/i,               'bottoms',        'Jeans'],
    [/\bleggings?\b/i,           'bottoms',        'Leggings'],
    [/\bshorts?\b/i,             'bottoms',        'Shorts'],
    [/\bpants?\b|\bjogger\b/i, 'bottoms',        'Pants'],
    [/\bskirt\b/i,               'bottoms',        'Skirt'],
    [/\bdress\b/i,               'dresses',        'Dress'],
    [/\bjumpsuit\b/i,            'dresses',        'Jumpsuit'],
    [/\bromper\b/i,              'dresses',        'Romper'],
    [/\bblazer\b/i,              'outerwear',      'Blazer'],
    [/\bjacket\b/i,              'outerwear',      'Jacket'],
    [/\bcoat\b|\bparka\b/i,    'outerwear',      'Coat'],
    [/\bvest\b/i,                'outerwear',      'Vest'],
    [/\bsneaker(s)?\b|\btrainer/i, 'shoes',       'Sneakers'],
    [/\bheels?\b/i,              'shoes',          'Heels'],
    [/\bflats?\b|\bloafers?\b|\bballet flat/i, 'shoes', 'Flats'],
    [/\bboots?\b/i,              'shoes',          'Boots'],
    [/\bsandals?\b/i,            'shoes',          'Sandals'],
    [/\bathletic\b|\brunning shoe/i, 'shoes',     'Athletic'],
    [/\bhat\b|\bcap\b/i,       'accessories',    'Hat'],
    [/\bbelt\b/i,                'accessories',    'Belt'],
    [/\bbag\b|\bpurse\b|\btote\b/i, 'accessories','Bag'],
    [/\bsunglasses\b/i,          'accessories',    'Sunglasses'],
    [/\bwatch\b/i,               'accessories',    'Watch'],
    [/\bscarf\b/i,               'accessories',    'Scarf'],
    [/\bsocks?\b/i,              'accessories',    'Socks'],
  ];

  function _inferGarmentType(text) {
    if (!text) return '';
    for (const [pat, gt] of SUBTYPE_KEYWORDS) if (pat.test(text)) return gt;
    return '';
  }
  function _inferSubtype(text) {
    if (!text) return '';
    for (const [pat, , st] of SUBTYPE_KEYWORDS) if (pat.test(text)) return st;
    return '';
  }

  // ============== Similarity scoring ==============
  // Coarse "shade family" mapping — captures the everyday observation that
  // navy + black + ink are all "dark", regardless of family. Lets us cluster
  // the four-pairs-of-dark-pants case the user flagged.
  const COLOR_SHADES = {
    dark: ['Black', 'Charcoal', 'Chocolate', 'Brown', 'Navy', 'Indigo', 'Royal Blue', 'Cobalt Blue', 'Royal Purple', 'Eggplant', 'Plum', 'Wine', 'Burgundy', 'Olive', 'Forest Green'],
    light: ['White', 'Ivory', 'Light Ivory', 'Cream', 'Champagne', 'Beige', 'Tan', 'Mint', 'Light Pink', 'Blush', 'Light Blue', 'Sky Blue', 'Aqua', 'Pale Yellow', 'Butter', 'Lavender', 'Lilac', 'Sage', 'Silver', 'Pearl'],
    warm: ['Red', 'Pink', 'Bubblegum', 'Hot Pink', 'Fuchsia', 'Magenta', 'Coral', 'Orange', 'Burnt Orange', 'Peach', 'Melon', 'Yellow', 'Lemon', 'Mustard', 'Gold', 'Antique Gold', 'Dusty Rose', 'Mauve'],
    cool: ['Blue', 'Periwinkle', 'Gray Blue', 'Teal', 'Turquoise', 'Green', 'Kelly Green', 'Jade', 'Emerald', 'Neon Green', 'Neon Blue', 'Purple', 'Amethyst', 'Grape'],
    neutral: ['Gray'],
  };
  function _colorShade(name) {
    if (!name) return null;
    const c = (typeof normalizeColor === 'function') ? normalizeColor(name) : name;
    for (const [shade, list] of Object.entries(COLOR_SHADES)) {
      if (list.includes(c)) return shade;
    }
    return null;
  }

  function _similarityScore(wish, candidate) {
    let s = 0;
    if (wish.garmentType && candidate.garmentType === wish.garmentType) s += 5;
    if (wish.subtype && candidate.subtype === wish.subtype) s += 4;
    if (wish.brand && candidate.brand && candidate.brand.toLowerCase() === wish.brand.toLowerCase()) s += 2;
    if (wish.size && candidate.size && candidate.size === wish.size) s += 1;

    // Color matching — three tiers:
    //   exact (after alias): +3
    //   same family (Pinks, Blues, Neutrals etc.): +2
    //   same shade (dark/light/warm/cool/neutral): +1
    const wRaw = (wish.color || '').trim();
    const cRaw = (candidate.color || '').trim();
    if (wRaw && cRaw) {
      const wNorm = (typeof normalizeColor === 'function') ? normalizeColor(wRaw) : wRaw;
      const cNorm = (typeof normalizeColor === 'function') ? normalizeColor(cRaw) : cRaw;
      if (wNorm.toLowerCase() === cNorm.toLowerCase()) {
        s += 3;
      } else if (typeof familyForColor === 'function' && familyForColor(wNorm) && familyForColor(wNorm) === familyForColor(cNorm)) {
        s += 2;
      } else {
        const ws = _colorShade(wNorm);
        const cs = _colorShade(cNorm);
        if (ws && cs && ws === cs) s += 1;
      }
    }
    // Loose name-text overlap (when wishlist color is missing but the name says "navy" etc.)
    const wishText = `${wish.name || ''} ${wish.notes || ''}`.toLowerCase();
    if (!wRaw && cRaw && wishText.includes(cRaw.toLowerCase())) s += 1;
    return s;
  }

  async function _findSimilar(wishItem) {
    const closetAll = await dbGetAllItems();
    // Returned items aren't owned anymore — exclude them from similarity matches.
    const closetItems = (typeof activeItems === 'function') ? activeItems(closetAll) : closetAll;
    const wishItems = await dbGetAllWishlistItems();
    // When the wishlist item has a subtype, require the candidate to share
    // it. Prevents 'accessories' alone from clumping sunglasses with
    // wristlets, sleeves, etc.
    const wishSub = (wishItem.subtype || '').trim().toLowerCase();
    const passesSubtype = (cand) => {
      if (!wishSub) return true;
      return (cand.subtype || '').trim().toLowerCase() === wishSub;
    };
    const closet = closetItems
      .map(i => ({ item: i, score: _similarityScore(wishItem, i) }))
      .filter(x => x.score >= 5 && passesSubtype(x.item))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    const otherWish = wishItems
      .filter(w => w.id !== wishItem.id)
      .map(w => ({ item: w, score: _similarityScore(wishItem, w) }))
      .filter(x => x.score >= 5 && passesSubtype(x.item))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return { closet, wishlist: otherWish };
  }

  // Save-time warning: when user is about to add a wishlist item with 2+
  // similar pieces already in the closet, show a confirmation modal listing
  // the matches. Returns Promise<boolean> — true to save, false to cancel.
  function _showSaveWarningGate(payload, closetMatches) {
    return new Promise((resolve) => {
      if (typeof openModal !== 'function') return resolve(true);
      const matchesHtml = closetMatches.slice(0, 8).map(({ item }) => {
        const u = item.thumb ? blobToUrl(item.thumb) : (item.photo ? blobToUrl(item.photo) : '');
        const name = item.name || item.subtype || labelForGarmentType(item.garmentType) || 'Untitled';
        const meta = [item.brand, item.color, labelForGarmentType(item.garmentType)].filter(Boolean).join(' · ');
        return `<div class="wsp-tile" style="cursor: default;">
          <div class="wsp-thumb" style="background-image:url('${u}')"></div>
          <div class="wsp-name">${escapeHtml(name)}</div>
          <div class="wsp-meta muted">${escapeHtml(meta)}</div>
        </div>`;
      }).join('');
      openModal(`
        <div style="max-width: 720px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="font-size: 22px;">⚠</span>
            <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; margin: 0;">Do you really need this?</h2>
          </div>
          <p class="muted" style="font-size: 13px; margin-bottom: 18px;">
            You already own <strong>${closetMatches.length}</strong> similar piece${closetMatches.length === 1 ? '' : 's'} in your closet — same category${payload.subtype ? ` and subtype (${escapeHtml(payload.subtype)})` : ''}${payload.color ? `, similar color shade` : ''}. Take a look before adding to wishlist.
          </p>
          <div style="background: var(--surface-2); padding: 12px; border-radius: var(--radius); margin-bottom: 18px;">
            <div class="muted" style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px;">Similar pieces you own</div>
            <div class="wsp-grid">${matchesHtml}</div>
          </div>
          <div class="row" style="justify-content: flex-end; gap: 8px;">
            <button class="btn" id="gate_cancel">Review my closet first</button>
            <button class="btn btn-primary" id="gate_proceed">Add to wishlist anyway</button>
          </div>
        </div>
      `);
      document.getElementById('gate_cancel').addEventListener('click', () => {
        if (typeof closeModal === 'function') closeModal();
        resolve(false);
      });
      document.getElementById('gate_proceed').addEventListener('click', () => {
        if (typeof closeModal === 'function') closeModal();
        resolve(true);
      });
    });
  }

  function _shopSimilarUrl(wishItem) {
    const subtype = wishItem.subtype || _inferSubtype(wishItem.name || '');
    const cat = wishItem.garmentType ? labelForGarmentType(wishItem.garmentType) : '';
    const q = [subtype, cat, 'women'].filter(Boolean).join(' ');
    return 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(q || (wishItem.name || ''));
  }


  function urlHostname(u) {
    try { return new URL(u).hostname.replace(/^www\./, ''); } catch (_) { return ''; }
  }

  function rowHtml(item) {
    const url = item.photo ? blobToUrl(item.photo) : '';
    const url2 = item.photo2 ? blobToUrl(item.photo2) : '';
    const host = urlHostname(item.url || '');
    const meta = [item.brand, host].filter(Boolean).join(' · ');
    const sizePrice = [item.size && `Size ${item.size}`, item.targetPrice && `$${Number(item.targetPrice).toFixed(2)}`].filter(Boolean).join(' · ');
    const cat = item.garmentType ? labelForGarmentType(item.garmentType) : '';
    const catLine = [cat, item.subtype].filter(Boolean).join(' · ');
    return `
      <div class="wishlist-row" data-wid="${item.id}">
        <div class="wishlist-thumbs-wrap">${url ? `<div class="wishlist-thumb" style="background-image:url('${url}')"></div>` : '<div class="wishlist-thumb">◇</div>'}${url2 ? `<div class="wishlist-thumb wishlist-thumb-2" style="background-image:url('${url2}')"></div>` : ''}</div>
        <div class="wishlist-info">
          <div class="wishlist-name">${escapeHtml(item.name || '(untitled)')}</div>
          <div class="wishlist-meta">${escapeHtml(meta)}</div>
          ${sizePrice ? `<div class="wishlist-meta">${escapeHtml(sizePrice)}</div>` : ''}
          ${item.notes ? `<div class="wishlist-notes">${escapeHtml(item.notes)}</div>` : ''}
        </div>
        <div class="wishlist-actions">
          ${item.url ? `<a class="btn btn-primary btn-sm" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Visit →</a>` : ''}
          <button class="btn btn-sm" data-purchased="${item.id}" title="Move to closet as a purchased item">✓ Purchased</button>
          <button class="btn btn-sm" data-edit="${item.id}">Edit</button>
          <button class="btn btn-ghost btn-sm" data-delete="${item.id}">Delete</button>
        </div>
        ${catLine ? `<div class="wishlist-similar-row" data-wid="${item.id}"><div class="muted" style="grid-column: 1 / -1; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;">${escapeHtml(catLine)}<span class="wishlist-similar-count" data-sim-count="${item.id}" style="margin-left: 8px;"></span><button class="btn btn-ghost btn-sm" data-show-similar="${item.id}" style="margin-left: 8px;">Show similar</button></div></div>` : ''}
      </div>
    `;
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    editingId = null;
    pendingPhoto = null;
    pendingPhoto2 = null;

    // Handle ?cartImport=base64 from the cart-import bookmarklet.
    // Wrapped — a malformed payload must never blank the wishlist page.
    try {
      await _handleCartImportParam();
    } catch (e) {
      console.error('cartImport handler crashed:', e);
      try {
        // Strip the bad param so a refresh isn't stuck on the same crash
        const h = location.hash || '';
        const qi = h.indexOf('?');
        if (qi >= 0) {
          const ps = new URLSearchParams(h.slice(qi + 1));
          if (ps.has('cartImport')) {
            ps.delete('cartImport');
            const newHash = ps.toString() ? '#/wishlist?' + ps.toString() : '#/wishlist';
            history.replaceState(null, '', location.pathname + location.search + newHash);
          }
        }
        sessionStorage.removeItem('vc:pendingCartImport');
      } catch (_) {}
    }

    const items = (await dbGetAllWishlistItems()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Wishlist</h1>
          <div class="page-subtitle">${items.length} ${items.length === 1 ? 'piece' : 'pieces'} you're tracking</div>
        </div>
        <button class="btn btn-primary" id="addWishBtn">+ Add to wishlist</button>
      </div>

      <div id="wishlistForm" hidden></div>

      <div id="wishlistList" style="margin-top: 18px;">
        ${items.length === 0
          ? `<div class="empty"><div class="empty-title">Wishlist is empty</div><p>Save pieces from any site you're considering. Track size, target price, and visit the page in one click.</p></div>`
          : items.map(rowHtml).join('')}
      </div>
    `;

    document.getElementById('addWishBtn').addEventListener('click', () => showForm(null));
    wireRowActions();
    // Populate "X similar in closet" counts asynchronously per row
    items.forEach(async (it) => {
      const sims = await _findSimilar(it);
      const closetCount = sims.closet.length;
      const el = document.querySelector(`[data-sim-count="${it.id}"]`);
      if (el && closetCount > 0) {
        el.innerHTML = `<span style="color: #a02020; font-weight: 600;">⚠ ${closetCount} similar in closet</span>`;
      }
    });
  }

  function showForm(item) {
    editingId = item ? item.id : null;
    pendingPhoto = null;
    pendingPhoto2 = null;
    const f = item || {};
    const formEl = document.getElementById('wishlistForm');
    formEl.hidden = false;
    formEl.innerHTML = `
      <div class="card" style="padding: 18px; flex-direction: column; gap: 14px;">
        <h2 style="font-size: 18px; margin: 0;">${editingId ? 'Edit wishlist item' : 'Add wishlist item'}</h2>
        <div class="form-grid" style="grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="field">
            <label class="field-label" for="w_name">Item name</label>
            <input class="input" id="w_name" type="text" placeholder="e.g. Scuba Oversized Half-Zip" value="${escapeHtml(f.name || '')}" />
          </div>
          <div class="field">
            <label class="field-label" for="w_brand">Brand</label>
            <input class="input" id="w_brand" type="text" placeholder="e.g. Lululemon" value="${escapeHtml(f.brand || '')}" />
          </div>
          <div class="field" style="grid-column: 1 / -1;">
            <label class="field-label" for="w_url">Site URL</label>
            <input class="input" id="w_url" type="url" placeholder="https://shop.lululemon.com/..." value="${escapeHtml(f.url || '')}" />
          </div>
          <div class="field">
            <label class="field-label" for="w_size">Target size</label>
            <input class="input" id="w_size" type="text" placeholder="e.g. M / 6 / 27" value="${escapeHtml(f.size || '')}" />
          </div>
          <div class="field">
            <label class="field-label" for="w_garment">Category</label>
            <select class="select" id="w_garment">
              <option value="">— infer from name —</option>
              ${Object.entries(GARMENT_TYPES).map(([id, def]) => `<option value="${id}" ${(f.garmentType || '') === id ? 'selected' : ''}>${def.label}</option>`).join('')}
            </select>
          </div>
          <div class="field" id="w_subtype_field">
            <label class="field-label" for="w_subtype">Type</label>
            <input class="input" list="w_subtype_list" id="w_subtype" placeholder="e.g. Hoodie, Heels, Half-zip" value="${escapeHtml(f.subtype || '')}" />
            <datalist id="w_subtype_list">
              ${Object.values(GARMENT_TYPES).flatMap(g => g.subtypes).map(s => `<option value="${escapeHtml(s)}"></option>`).join('')}
            </datalist>
          </div>
          <div class="field">
            <label class="field-label" for="w_price">Target price (USD)</label>
            <input class="input" id="w_price" type="number" step="0.01" placeholder="e.g. 79.00" value="${f.targetPrice || ''}" />
          </div>
          <div class="field" style="grid-column: 1 / -1;">
            <label class="field-label" for="w_notes">Notes</label>
            <textarea class="textarea" id="w_notes" placeholder="Why you're considering it, color preference, gift idea, etc.">${escapeHtml(f.notes || '')}</textarea>
          </div>
          <div class="field" style="grid-column: 1 / -1;">
            <label class="field-label">Photos (up to 2)</label>
            <div class="wishlist-photo-slots">
              <div class="wishlist-photo-slot">
                <div class="wishlist-photo-slot-label">Photo 1</div>
                <div class="row" style="gap: 6px; align-items: center; flex-wrap: wrap;">
                  <label class="btn btn-sm" for="w_file">Choose file…</label>
                  <input id="w_file" type="file" accept="image/*" hidden />
                  <input class="input" id="w_photo_url" type="url" placeholder="…or paste image URL" style="flex: 1; min-width: 140px;" />
                  <button class="btn btn-sm" id="w_load_url" type="button">Load</button>
                </div>
                <div id="w_preview" class="wishlist-photo-preview"></div>
              </div>
              <div class="wishlist-photo-slot">
                <div class="wishlist-photo-slot-label">Photo 2 (optional)</div>
                <div class="row" style="gap: 6px; align-items: center; flex-wrap: wrap;">
                  <label class="btn btn-sm" for="w_file2">Choose file…</label>
                  <input id="w_file2" type="file" accept="image/*" hidden />
                  <input class="input" id="w_photo_url2" type="url" placeholder="…or paste image URL" style="flex: 1; min-width: 140px;" />
                  <button class="btn btn-sm" id="w_load_url2" type="button">Load</button>
                </div>
                <div id="w_preview2" class="wishlist-photo-preview"></div>
              </div>
            </div>
            ${(f.photo || f.photo2) ? `<div class="muted" style="font-size: 12px; margin-top: 8px;">Existing photo${(f.photo && f.photo2) ? 's' : ''} will be kept unless you change ${(f.photo && f.photo2) ? 'them' : 'it'}.</div>` : ''}
          </div>
        </div>
        <div class="row" style="justify-content: flex-end; gap: 8px;">
          <button class="btn" id="w_cancel">Cancel</button>
          <button class="btn btn-primary" id="w_save">${editingId ? 'Save changes' : 'Add to wishlist'}</button>
        </div>
      </div>
    `;

    document.getElementById('w_cancel').addEventListener('click', () => {
      formEl.hidden = true; formEl.innerHTML = '';
    });
    document.getElementById('w_save').addEventListener('click', save);
    // Slot 1
    document.getElementById('w_file').addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) stagePhoto(file, 1);
    });
    document.getElementById('w_load_url').addEventListener('click', async () => {
      const u = document.getElementById('w_photo_url').value.trim();
      if (!u) return;
      try {
        const blob = await fetchImageBlob(u);
        stagePhoto(new File([blob], 'wishlist.jpg', { type: blob.type || 'image/jpeg' }), 1);
      } catch (e) {
        alert('Could not fetch that URL: ' + (e?.message || e));
      }
    });
    // Slot 2
    document.getElementById('w_file2').addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) stagePhoto(file, 2);
    });
    document.getElementById('w_load_url2').addEventListener('click', async () => {
      const u = document.getElementById('w_photo_url2').value.trim();
      if (!u) return;
      try {
        const blob = await fetchImageBlob(u);
        stagePhoto(new File([blob], 'wishlist2.jpg', { type: blob.type || 'image/jpeg' }), 2);
      } catch (e) {
        alert('Could not fetch that URL: ' + (e?.message || e));
      }
    });
    // Show existing photos when editing
    if (editingId) {
      if (f.photo) document.getElementById('w_preview').innerHTML = `<img src="${blobToUrl(f.photo)}" style="max-width:100%; max-height:140px; border-radius: 4px; display: block;" />`;
      if (f.photo2) document.getElementById('w_preview2').innerHTML = `<img src="${blobToUrl(f.photo2)}" style="max-width:100%; max-height:140px; border-radius: 4px; display: block;" />`;
    }
  }

  function stagePhoto(file, slot) {
    const url = URL.createObjectURL(file);
    if (slot === 2) {
      pendingPhoto2 = file;
      document.getElementById('w_preview2').innerHTML = `<img src="${url}" style="max-width:100%; max-height:140px; border-radius: 4px; display: block;" />`;
    } else {
      pendingPhoto = file;
      document.getElementById('w_preview').innerHTML = `<img src="${url}" style="max-width:100%; max-height:140px; border-radius: 4px; display: block;" />`;
    }
  }

  async function save() {
    const get = id => (document.getElementById(id) || {}).value || '';
    const name = get('w_name').trim();
    if (!name) { alert('Please give the wishlist item a name.'); return; }
    const url = get('w_url').trim();
    const priceRaw = get('w_price');
    const payload = {
      name,
      brand: get('w_brand').trim(),
      url,
      size: get('w_size').trim(),
      targetPrice: priceRaw ? Number(priceRaw) : null,
      notes: get('w_notes').trim(),
      garmentType: get('w_garment') || _inferGarmentType(name + ' ' + get('w_brand') + ' ' + get('w_notes')),
      subtype: get('w_subtype').trim() || _inferSubtype(name + ' ' + get('w_notes')),
    };

    // Run a similarity check against the closet BEFORE persisting (only on
    // create, not edit — editing is fine since the user already committed).
    if (!editingId && payload.garmentType) {
      const sims = await _findSimilar({ ...payload, id: -1 });
      if (sims.closet.length >= 2) {
        const proceed = await _showSaveWarningGate(payload, sims.closet);
        if (!proceed) return;
      }
    }
    if (pendingPhoto) {
      try { payload.photo = await resizeImage(pendingPhoto, 1200, 0.88); } catch (_) {}
    }
    if (pendingPhoto2) {
      try { payload.photo2 = await resizeImage(pendingPhoto2, 1200, 0.88); } catch (_) {}
    }
    try {
      if (editingId) await dbUpdateWishlistItem(editingId, payload);
      else await dbAddWishlistItem(payload);
      showToast(editingId ? 'Wishlist item updated' : 'Added to wishlist');
      render();
    } catch (e) {
      alert('Save failed: ' + (e?.message || e));
    }
  }

  function wireRowActions() {
    document.querySelectorAll('[data-show-similar]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.showSimilar);
        const wishItems = await dbGetAllWishlistItems();
        const wish = wishItems.find(x => x.id === id);
        if (!wish) return;
        const row = b.closest('.wishlist-row');
        if (!row) return;
        // The panel was inserted as a SIBLING of the row, not a child — walk
        // forward and remove ALL adjacent similar-panel siblings (in case
        // earlier clicks left orphaned panels stacked).
        let removed = false;
        let next = row.nextElementSibling;
        while (next && next.classList && next.classList.contains('wishlist-similar-panel')) {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
          removed = true;
        }
        if (removed) { b.textContent = 'Show similar'; return; }
        b.textContent = 'Hide';
        const sims = await _findSimilar(wish);
        const panel = document.createElement('div');
        panel.className = 'wishlist-similar-panel';
        panel.innerHTML = `
          <div class="wsp-section">
            <div class="wsp-title">Already in your closet${sims.closet.length === 0 ? ' — none match' : ''}</div>
            ${sims.closet.length > 0 ? `<div class="wsp-grid">${sims.closet.map(({ item }) => {
              const u = item.thumb ? blobToUrl(item.thumb) : (item.photo ? blobToUrl(item.photo) : '');
              return `<a class="wsp-tile" href="#/closet" data-open-item="${item.id}"><div class="wsp-thumb" style="background-image:url('${u}')"></div><div class="wsp-name">${escapeHtml(item.name || item.subtype || '')}</div><div class="wsp-meta muted">${escapeHtml([item.brand, item.color].filter(Boolean).join(' · '))}</div></a>`;
            }).join('')}</div>` : '<div class="muted" style="font-size: 12px;">Buying this would add a new piece type to your closet.</div>'}
          </div>
          ${sims.wishlist.length > 0 ? `<div class="wsp-section"><div class="wsp-title">Similar on your wishlist</div><div class="wsp-grid">${sims.wishlist.map(({ item }) => {
            const u = item.photo ? blobToUrl(item.photo) : '';
            return `<div class="wsp-tile"><div class="wsp-thumb" style="background-image:url('${u}')"></div><div class="wsp-name">${escapeHtml(item.name || '')}</div><div class="wsp-meta muted">${escapeHtml([item.brand, item.targetPrice && '$' + item.targetPrice].filter(Boolean).join(' · '))}</div></div>`;
          }).join('')}</div></div>` : ''}
          <div class="wsp-section">
            <a class="btn btn-primary btn-sm" href="${_shopSimilarUrl(wish)}" target="_blank" rel="noopener">Shop similar on Google →</a>
          </div>
        `;
        row.parentNode.insertBefore(panel, row.nextSibling);
        panel.querySelectorAll('[data-open-item]').forEach(el => {
          el.addEventListener('click', (ev) => {
            ev.preventDefault();
            const iid = Number(el.dataset.openItem);
            if (typeof openItemDetail === 'function') openItemDetail(iid);
          });
        });
      });
    });
    document.querySelectorAll('[data-edit]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.edit);
        const items = await dbGetAllWishlistItems();
        const item = items.find(x => x.id === id);
        if (item) showForm(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
    document.querySelectorAll('[data-purchased]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.purchased);
        const items = await dbGetAllWishlistItems();
        const item = items.find(x => x.id === id);
        if (item) await _purchaseFlow(item);
      });
    });
    document.querySelectorAll('[data-delete]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.delete);
        if (!confirm('Remove this item from your wishlist?')) return;
        await dbDeleteWishlistItem(id);
        showToast('Removed');
        render();
      });
    });
  }

  // ===== Purchased flow: wishlist -> closet =====
  // Quick prompt asking for price + date, then create a closet item and
  // delete the wishlist row. Photos, brand, size, color, url, garmentType
  // and subtype carry over so the user lands on a fully-populated closet
  // item instead of an empty stub.
  function _purchaseFlow(wish) {
    return new Promise((resolve) => {
      if (typeof openModal !== 'function') return resolve(false);
      const today = new Date().toISOString().slice(0, 10);
      const prefillPrice = (wish.targetPrice != null && Number.isFinite(Number(wish.targetPrice)))
        ? Number(wish.targetPrice).toFixed(2) : '';
      openModal(`
        <div style="max-width: 460px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; margin: 0 0 6px;">Mark as purchased</h2>
          <p class="muted" style="font-size: 13px; margin: 0 0 16px;">
            Move <strong>${escapeHtml(wish.name || 'this item')}</strong> from wishlist to closet.
          </p>
          <div class="form-grid" style="grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="field">
              <label class="field-label" for="pf_price">Price paid (USD)</label>
              <input class="input" id="pf_price" type="number" step="0.01" placeholder="e.g. 46.00" value="${prefillPrice}" />
            </div>
            <div class="field">
              <label class="field-label" for="pf_date">Purchase date</label>
              <input class="input" id="pf_date" type="date" value="${today}" />
            </div>
            <div class="field" style="grid-column: 1 / -1;">
              <label class="field-label" for="pf_original">Original price <span class="muted">(optional - shows in Girl Math savings)</span></label>
              <input class="input" id="pf_original" type="number" step="0.01" placeholder="e.g. 68.00" />
            </div>
          </div>
          <div class="row" style="justify-content: flex-end; gap: 8px; margin-top: 18px;">
            <button class="btn" id="pf_cancel">Cancel</button>
            <button class="btn btn-primary" id="pf_save">Save to closet</button>
          </div>
        </div>
      `);
      const cancel = () => {
        if (typeof closeModal === 'function') closeModal();
        resolve(false);
      };
      document.getElementById('pf_cancel').addEventListener('click', cancel);
      document.getElementById('pf_save').addEventListener('click', async () => {
        const priceRaw = document.getElementById('pf_price').value;
        const dateRaw = document.getElementById('pf_date').value || today;
        const origRaw = (document.getElementById('pf_original') || {}).value || '';
        const purchasePrice = priceRaw ? Number(priceRaw) : null;
        const originalPrice = origRaw ? Number(origRaw) : null;
        const inferredGT = wish.garmentType || _inferGarmentType((wish.name || '') + ' ' + (wish.notes || ''));
        const inferredST = wish.subtype || _inferSubtype((wish.name || '') + ' ' + (wish.notes || ''));
        const closetPayload = {
          name: wish.name || '',
          brand: wish.brand || '',
          color: wish.color || '',
          size: wish.size || '',
          url: wish.url || '',
          notes: wish.notes || '',
          garmentType: inferredGT || '',
          subtype: inferredST || '',
          purchasePrice: (purchasePrice != null && Number.isFinite(purchasePrice)) ? purchasePrice : null,
          originalPrice: (originalPrice != null && Number.isFinite(originalPrice)) ? originalPrice : null,
          purchaseDate: dateRaw || '',
        };
        if (wish.photo) closetPayload.photo = wish.photo;
        if (wish.photo2) closetPayload.photo2 = wish.photo2;
        if (wish.thumb) closetPayload.thumb = wish.thumb;
        try {
          const newId = await dbAddItem(closetPayload);
          await dbDeleteWishlistItem(wish.id);
          if (typeof closeModal === 'function') closeModal();
          try { showToast('Moved to closet'); } catch (_) {}
          // Optional: stash the new id so the user can find it on the closet
          // page. We reuse the existing review banner mechanism.
          try {
            sessionStorage.setItem('vc:lastImportIds', JSON.stringify([newId]));
            sessionStorage.setItem('vc:lastImportAt', String(Date.now()));
          } catch (_) {}
          await render();
          resolve(true);
        } catch (e) {
          alert('Could not move to closet: ' + (e?.message || e));
          resolve(false);
        }
      });
    });
  }

  // ===== Cart-import handler =====
  async function _handleCartImportParam() {
    const hash = location.hash || '';
    const qIdx = hash.indexOf('?');
    let enc = null;
    let fromUrl = false;
    if (qIdx >= 0) {
      const params = new URLSearchParams(hash.slice(qIdx + 1));
      enc = params.get('cartImport');
      if (enc) fromUrl = true;
    }
    // Fall back to a stash from before signin
    if (!enc) {
      try { enc = sessionStorage.getItem('vc:pendingCartImport'); } catch (_) {}
    }
    if (!enc) return;

    // Not signed in yet? Stash and bail — we'll process after the user signs
    // in. Prevents items from saving to the guest DB while the login
    // overlay is still showing.
    if (typeof getCurrentUser === 'function' && !getCurrentUser()) {
      try { sessionStorage.setItem('vc:pendingCartImport', enc); } catch (_) {}
      return;
    }

    // Strip from URL (or stash) so a refresh doesn't re-prompt
    if (fromUrl) {
      const params = new URLSearchParams(hash.slice(qIdx + 1));
      params.delete('cartImport');
      const newHash = params.toString() ? '#/wishlist?' + params.toString() : '#/wishlist';
      history.replaceState(null, '', location.pathname + location.search + newHash);
    }
    try { sessionStorage.removeItem('vc:pendingCartImport'); } catch (_) {}

    let items;
    try {
      const json = decodeURIComponent(escape(atob(enc)));
      items = JSON.parse(json);
    } catch (e) {
      console.warn('cartImport decode failed:', e);
      return;
    }
    if (!Array.isArray(items) || items.length === 0) return;

    const ok = confirm(
      `Import ${items.length} item${items.length === 1 ? '' : 's'} from cart?\n\n` +
      items.slice(0, 5).map(i => `• ${i.brand ? i.brand + ' — ' : ''}${i.name}`).join('\n') +
      (items.length > 5 ? `\n...and ${items.length - 5} more` : '')
    );
    if (!ok) return;

    let added = 0;
    for (const it of items) {
      if (!it || !it.name) continue;
      try {
        const wishItem = {
          name: String(it.name).slice(0, 200),
          brand: String(it.brand || '').slice(0, 100),
          color: String(it.color || '').slice(0, 100),
          size: String(it.size || '').slice(0, 50),
          targetPrice: (it.price && Number.isFinite(Number(it.price))) ? Number(it.price) : null,
          url: String(it.url || '').slice(0, 500),
          notes: '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        if (it.imageUrl && typeof fetchImageBlob === 'function') {
          try {
            const blob = await fetchImageBlob(it.imageUrl);
            if (typeof resizeImage === 'function') {
              wishItem.photo = await resizeImage(blob, 1200, 0.88);
            } else {
              wishItem.photo = blob;
            }
          } catch (imgErr) {
            console.warn('cartImport image fetch failed:', it.imageUrl, imgErr);
          }
        }
        await dbAddWishlistItem(wishItem);
        added++;
      } catch (e) {
        console.warn('cartImport item save failed:', it && it.name, e);
      }
    }

    if (added > 0) {
      try { showToast('Imported ' + added + ' item' + (added === 1 ? '' : 's') + ' to wishlist'); } catch (_) {}
      try { await render(); } catch (_) {}
    } else {
      try { showToast('No items imported'); } catch (_) {}
    }
  }


  // Expose the render function so the router (in app-r10.js) can call it.
  window.renderWishlistView = function (main) { return render(main); };

  // Auto-render on hashchange and on initial load if we're on #/wishlist
  function maybeRender() {
    var h = location.hash || '';
    if (h.indexOf('#/wishlist') === 0) {
      try { render(document.getElementById('main')); } catch (_) {}
    }
  }
  window.addEventListener('hashchange', maybeRender);

})();


/* ===== js/girlmath-r3.js ===== */
// girlmath-r1.js — "Girl Math" financial tracker at #/girlmath
// Aggregates wardrobe spending: total, by year, by brand, by category,
// most expensive pieces, plus playful reframings.

(function() {

  function $money(n) {
    if (n == null || isNaN(n)) return '—';
    return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  function $moneyExact(n) {
    if (n == null || isNaN(n)) return '—';
    return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function getYear(it) {
    if (it.purchaseDate) {
      const m = it.purchaseDate.match(/^(\d{4})/);
      if (m) return m[1];
    }
    return null;
  }

  function bar(label, value, max, total, currency = true) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    const share = total > 0 ? (value / total) * 100 : 0;
    return `
      <div class="gm-bar-row">
        <div class="gm-bar-label">${escapeHtml(label)}</div>
        <div class="gm-bar-track"><div class="gm-bar-fill" style="width: ${pct.toFixed(1)}%"></div></div>
        <div class="gm-bar-value">${currency ? $money(value) : value}${total > 0 ? ` <span class="gm-share">${share.toFixed(0)}%</span>` : ''}</div>
      </div>
    `;
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;

    const allItems = await dbGetAllItems();
    // Returned items are no longer owned — exclude from spending math.
    const items = (typeof activeItems === 'function') ? activeItems(allItems) : allItems;
    const priced = items.filter(i => Number(i.purchasePrice) > 0);
    const total = priced.reduce((s, i) => s + Number(i.purchasePrice), 0);
    const avg = priced.length ? total / priced.length : 0;

    // Year buckets
    const byYear = new Map();
    for (const i of priced) {
      const y = getYear(i);
      if (!y) continue;
      byYear.set(y, (byYear.get(y) || 0) + Number(i.purchasePrice));
    }
    const years = [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    const yearMax = Math.max(0, ...years.map(([, v]) => v));

    // Brand buckets
    const byBrand = new Map();
    for (const i of priced) {
      const b = (i.brand || '— No brand —').trim() || '— No brand —';
      byBrand.set(b, (byBrand.get(b) || 0) + Number(i.purchasePrice));
    }
    const brands = [...byBrand.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const brandMax = Math.max(0, ...brands.map(([, v]) => v));

    // Category buckets
    const byCategory = new Map();
    for (const i of priced) {
      const c = i.garmentType || '__none__';
      byCategory.set(c, (byCategory.get(c) || 0) + Number(i.purchasePrice));
    }
    const categories = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
    const catMax = Math.max(0, ...categories.map(([, v]) => v));

    // Top 10 most expensive
    const topExpensive = priced.slice().sort((a, b) => Number(b.purchasePrice) - Number(a.purchasePrice)).slice(0, 10);

    // Girl Math reframings
    const yearSpan = years.length;
    const monthlyAvg = yearSpan > 0 ? total / (yearSpan * 12) : 0;
    const perPiece = priced.length ? total / priced.length : 0;
    const costPerWear50 = perPiece / 50;
    const costPerWear100 = perPiece / 100;

    // Real cost-per-wear from wearLog entries (only items that have BOTH a price AND wears)
    const wornWithPrice = priced.filter(i => (i.wearLog || []).length > 0);
    const totalWears = wornWithPrice.reduce((s, i) => s + (i.wearLog || []).length, 0);
    const totalSpentOnWorn = wornWithPrice.reduce((s, i) => s + Number(i.purchasePrice), 0);
    const realCPW = totalWears > 0 ? totalSpentOnWorn / totalWears : null;

    // Top worn / dormant lists (across all items, not just priced — wears matter regardless)
    const withWears = items.filter(i => (i.wearLog || []).length > 0);
    const topWorn = withWears.slice().sort((a, b) => (b.wearLog || []).length - (a.wearLog || []).length).slice(0, 10);
    // Dormant: have items but no recent wear (>= 90 days OR never logged but in closet > 90 days)
    const dormant = items.filter(i => {
      const ago = (typeof daysSinceLastWear === 'function') ? daysSinceLastWear(i) : null;
      if (ago === null) {
        // never logged — treat as dormant if added more than 90 days ago
        const added = i.createdAt ? Math.floor((Date.now() - i.createdAt) / 86400000) : 0;
        return added >= 90;
      }
      return ago >= 90;
    }).sort((a, b) => {
      const ad = (typeof daysSinceLastWear === 'function') ? (daysSinceLastWear(a) ?? 9999) : 9999;
      const bd = (typeof daysSinceLastWear === 'function') ? (daysSinceLastWear(b) ?? 9999) : 9999;
      return bd - ad;
    }).slice(0, 10);

    // Items missing data
    const missingPrice = items.filter(i => !i.purchasePrice);
    const missingDate = items.filter(i => i.purchasePrice && !i.purchaseDate);

    // Discount / savings — items with both originalPrice and a lower
    // purchasePrice. Savings = originalPrice - purchasePrice.
    const discounted = items.filter(i =>
      Number(i.originalPrice) > 0 &&
      Number(i.purchasePrice) >= 0 &&
      Number(i.originalPrice) > Number(i.purchasePrice)
    );
    const totalSaved = discounted.reduce((s, i) => s + (Number(i.originalPrice) - Number(i.purchasePrice)), 0);
    const totalOriginal = discounted.reduce((s, i) => s + Number(i.originalPrice), 0);
    const overallSavedPct = totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0;
    const topSaved = discounted.slice()
      .sort((a, b) => (Number(b.originalPrice) - Number(b.purchasePrice)) - (Number(a.originalPrice) - Number(a.purchasePrice)))
      .slice(0, 10);

    main.innerHTML = `
      <div class="page-header" style="justify-content: center; flex-direction: column; text-align: center; gap: 0;">
        <h1 class="browse-title">Girl Math</h1>
        <div class="page-subtitle" style="margin-top: 4px;">Your wardrobe in numbers</div>
      </div>

      ${priced.length === 0 ? `
        <div class="empty" style="margin-top: 24px;">
          <div class="empty-title">No price data yet</div>
          <p>Add purchase prices to your pieces (Edit any item → Price field) and the math will populate. Some quick wins below in case you want to backfill.</p>
        </div>
      ` : `
        <div class="gm-stats">
          <div class="gm-stat">
            <div class="gm-stat-label">Total spent</div>
            <div class="gm-stat-value">${$money(total)}</div>
            ${yearSpan > 0 ? `<div class="gm-stat-foot">across ${yearSpan} year${yearSpan === 1 ? '' : 's'}</div>` : ''}
          </div>
          <div class="gm-stat">
            <div class="gm-stat-label">Pieces</div>
            <div class="gm-stat-value">${priced.length}</div>
            <div class="gm-stat-foot">${items.length - priced.length > 0 ? `+${items.length - priced.length} without price` : 'all priced'}</div>
          </div>
          <div class="gm-stat">
            <div class="gm-stat-label">Average price</div>
            <div class="gm-stat-value">${$money(avg)}</div>
            <div class="gm-stat-foot">per piece</div>
          </div>
          <div class="gm-stat">
            <div class="gm-stat-label">Brands tracked</div>
            <div class="gm-stat-value">${byBrand.size}</div>
            <div class="gm-stat-foot">${brands[0] ? brands[0][0] + ' on top' : ''}</div>
          </div>
        </div>

        <div class="gm-quotes">
          ${perPiece > 0 ? `<div class="gm-quote">$${avg.toFixed(0)} <strong>per piece</strong> — basically free if you wear it weekly.</div>` : ''}
          ${monthlyAvg > 0 ? `<div class="gm-quote">Spread out, that's <strong>${$money(monthlyAvg)}/mo</strong> — less than most streaming bundles.</div>` : ''}
          ${realCPW != null ? `<div class="gm-quote">Real cost-per-wear (logged): <strong>${$moneyExact(realCPW)}</strong> across ${totalWears} wears.</div>` : (costPerWear100 > 0 ? `<div class="gm-quote">If you wore each piece <strong>100 times</strong>, CPW would be just ${$moneyExact(costPerWear100)}. Log wears to see your real number.</div>` : '')}
        </div>

        ${discounted.length > 0 ? `
          <h2 class="gm-h2">Savings — what you didn't pay full price for</h2>
          <div class="gm-stats" style="margin-bottom: 8px;">
            <div class="gm-stat">
              <div class="gm-stat-label">Total saved</div>
              <div class="gm-stat-value">${$money(totalSaved)}</div>
              <div class="gm-stat-foot">across ${discounted.length} discounted piece${discounted.length === 1 ? '' : 's'}</div>
            </div>
            <div class="gm-stat">
              <div class="gm-stat-label">Original total</div>
              <div class="gm-stat-value">${$money(totalOriginal)}</div>
              <div class="gm-stat-foot">if you'd paid full price</div>
            </div>
            <div class="gm-stat">
              <div class="gm-stat-label">Average discount</div>
              <div class="gm-stat-value">${overallSavedPct}%</div>
              <div class="gm-stat-foot">off original price</div>
            </div>
          </div>
          <div class="gm-quotes" style="margin-bottom: 14px;">
            <div class="gm-quote">You saved <strong>${$money(totalSaved)}</strong> — that's basically a free designer bag.</div>
          </div>
          <div class="gm-list">
            ${topSaved.map((it, idx) => {
              const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
              const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
              const saved = Number(it.originalPrice) - Number(it.purchasePrice);
              const pct = Math.round((saved / Number(it.originalPrice)) * 100);
              return `
                <div class="gm-row" data-item-id="${it.id}">
                  <div class="gm-rank">${idx + 1}</div>
                  <div class="gm-thumb" style="background-image:url('${url}')"></div>
                  <div class="gm-info">
                    <div class="gm-name">${escapeHtml(name)}</div>
                    <div class="gm-meta"><s>${$money(it.originalPrice)}</s> &rarr; <strong>${$money(it.purchasePrice)}</strong> &middot; ${pct}% off</div>
                  </div>
                  <div class="gm-price savings-badge">-${$money(saved)}</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${years.length > 0 ? `
          <h2 class="gm-h2">Spending by year</h2>
          <div class="gm-chart">
            ${years.map(([y, v]) => bar(y, v, yearMax, total)).join('')}
          </div>
        ` : ''}

        ${brands.length > 0 ? `
          <h2 class="gm-h2">Top brands by spend</h2>
          <div class="gm-chart">
            ${brands.map(([b, v]) => bar(b, v, brandMax, total)).join('')}
          </div>
        ` : ''}

        ${categories.length > 0 ? `
          <h2 class="gm-h2">Spending by category</h2>
          <div class="gm-chart">
            ${categories.map(([c, v]) => bar(labelForGarmentType(c) || c, v, catMax, total)).join('')}
          </div>
        ` : ''}

        ${topExpensive.length > 0 ? `
          <h2 class="gm-h2">Most expensive pieces</h2>
          <div class="gm-list">
            ${topExpensive.map((it, idx) => {
              const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
              const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
              const meta = [it.brand, it.purchaseDate].filter(Boolean).join(' · ');
              return `
                <div class="gm-row" data-item-id="${it.id}">
                  <div class="gm-rank">${idx + 1}</div>
                  <div class="gm-thumb" style="background-image:url('${url}')"></div>
                  <div class="gm-info">
                    <div class="gm-name">${escapeHtml(name)}</div>
                    <div class="gm-meta">${escapeHtml(meta)}</div>
                  </div>
                  <div class="gm-price">${$money(it.purchasePrice)}</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${topWorn.length > 0 ? `
          <h2 class="gm-h2">Most worn pieces</h2>
          <p class="muted" style="font-size: 12.5px; margin-bottom: 8px;">Real cost-per-wear, calculated from your logged wears.</p>
          <div class="gm-list">
            ${topWorn.map((it, idx) => {
              const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
              const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
              const w = (it.wearLog || []).length;
              const cpw = it.purchasePrice && w > 0 ? Number(it.purchasePrice) / w : null;
              return `
                <div class="gm-row" data-item-id="${it.id}">
                  <div class="gm-rank">${idx + 1}</div>
                  <div class="gm-thumb" style="background-image:url('${url}')"></div>
                  <div class="gm-info">
                    <div class="gm-name">${escapeHtml(name)}</div>
                    <div class="gm-meta">${w} wear${w === 1 ? '' : 's'}${cpw != null ? ` · CPW ${$moneyExact(cpw)}` : ''}</div>
                  </div>
                  <div class="gm-price">${w}x</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${dormant.length > 0 ? `
          <h2 class="gm-h2">Dormant pieces</h2>
          <p class="muted" style="font-size: 12.5px; margin-bottom: 8px;">Haven't been worn in 90+ days. Wear them, restyle them, or move them to Donate / Consign.</p>
          <div class="gm-list">
            ${dormant.map((it) => {
              const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
              const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
              const ago = (typeof daysSinceLastWear === 'function') ? daysSinceLastWear(it) : null;
              const sinceTxt = ago === null ? 'never logged' : (typeof fmtRelativeDays === 'function' ? fmtRelativeDays(ago) : ago + 'd');
              return `
                <div class="gm-row" data-item-id="${it.id}">
                  <div class="gm-thumb" style="background-image:url('${url}')"></div>
                  <div class="gm-info">
                    <div class="gm-name">${escapeHtml(name)}</div>
                    <div class="gm-meta">last worn ${sinceTxt}${it.purchasePrice ? ' · ' + $money(it.purchasePrice) : ''}</div>
                  </div>
                  <div class="gm-price muted" style="font-size: 12px;">${sinceTxt}</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${(missingPrice.length + missingDate.length) > 0 ? `
          <h2 class="gm-h2">Sharpen the math</h2>
          <p class="muted" style="font-size: 12.5px; margin-bottom: 8px;">Backfilling these makes every chart above more accurate.</p>
          <div class="gm-missing">
            ${missingPrice.length > 0 ? `<div><strong>${missingPrice.length}</strong> piece${missingPrice.length === 1 ? '' : 's'} missing a purchase price.</div>` : ''}
            ${missingDate.length > 0 ? `<div><strong>${missingDate.length}</strong> piece${missingDate.length === 1 ? '' : 's'} missing a purchase date.</div>` : ''}
            <button class="btn" id="gmShowMissing" style="margin-top: 8px;">Show missing</button>
          </div>
          <div id="gmMissingList" hidden style="margin-top: 12px;"></div>
        ` : ''}
      `}
    `;

    if (priced.length === 0) return;

    // Wire most-expensive rows to open detail modal
    main.querySelectorAll('.gm-row').forEach(r => {
      r.addEventListener('click', () => {
        if (typeof openItemDetail === 'function') openItemDetail(Number(r.dataset.itemId));
      });
    });

    // Show-missing button
    const showBtn = document.getElementById('gmShowMissing');
    if (showBtn) {
      showBtn.addEventListener('click', () => {
        const list = document.getElementById('gmMissingList');
        list.hidden = !list.hidden;
        if (!list.hidden && !list.dataset.rendered) {
          const rows = [...missingPrice, ...missingDate];
          list.innerHTML = rows.slice(0, 50).map(it => {
            const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
            const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
            return `
              <div class="gm-row" data-item-id="${it.id}">
                <div class="gm-thumb" style="background-image:url('${url}')"></div>
                <div class="gm-info">
                  <div class="gm-name">${escapeHtml(name)}</div>
                  <div class="gm-meta">${escapeHtml([it.brand, it.color].filter(Boolean).join(' · '))}</div>
                </div>
                <div class="gm-price muted">${!it.purchasePrice ? 'no price' : 'no date'}</div>
              </div>
            `;
          }).join('');
          list.querySelectorAll('.gm-row').forEach(r => {
            r.addEventListener('click', () => {
              if (typeof openItemDetail === 'function') openItemDetail(Number(r.dataset.itemId));
            });
          });
          list.dataset.rendered = '1';
        }
        showBtn.textContent = list.hidden ? 'Show missing' : 'Hide';
      });
    }
  }

  window.renderGirlMathView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/girlmath') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeRender);
  } else {
    maybeRender();
  }
})();

/* ===== js/trip-r1.js ===== */
// trip-r1.js — Trip packing planner at #/trip
// Form: trip name, destination (free text), # days, occasions to pack for.
// For each selected occasion, runs the outfit suggester to build N outfits.
// Output: a unique packing list (all required pieces, deduplicated) + the
// outfits themselves so user knows what to wear which day.

(function() {
  let tripState = {
    name: '',
    destination: '',
    days: 5,
    occasions: new Set(),
    aesthetic: 'any',
    season: null,
  };

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;

    main.innerHTML = `
      <div class="page-header" style="justify-content: center; flex-direction: column; text-align: center; gap: 0;">
        <h1 class="browse-title">Trip Packing Planner</h1>
        <div class="page-subtitle">Build a complete packing list from your closet</div>
      </div>

      <div class="card" style="padding: 18px; flex-direction: column; gap: 14px; max-width: 720px; margin: 0 auto;">
        <div class="form-grid" style="grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="field">
            <label class="field-label" for="trip_name">Trip name</label>
            <input class="input" id="trip_name" type="text" placeholder="e.g. Italy in May" />
          </div>
          <div class="field">
            <label class="field-label" for="trip_dest">Destination</label>
            <input class="input" id="trip_dest" type="text" placeholder="e.g. Rome / Beach / Mountains" />
          </div>
          <div class="field">
            <label class="field-label" for="trip_days">Number of days</label>
            <input class="input" id="trip_days" type="number" min="1" max="30" value="5" />
          </div>
          <div class="field">
            <label class="field-label" for="trip_season">Season at destination</label>
            <select class="select" id="trip_season">
              <option value="">Any</option>
              ${SEASONS.map(s => `<option value="${s.id}">${s.label}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="grid-column: 1 / -1;">
            <label class="field-label">Activities / occasions on this trip</label>
            <div class="checks" id="trip_occasions">
              ${OCCASIONS.map(o => `
                <label class="check">
                  <input type="checkbox" value="${o.id}" />
                  ${o.label}
                </label>
              `).join('')}
            </div>
          </div>
          <div class="field" style="grid-column: 1 / -1;">
            <label class="field-label">Style</label>
            <div class="checks" id="trip_aesthetic">
              ${Object.entries(AESTHETIC_PROFILES).map(([id, p]) => `
                <label class="check ${id === 'any' ? 'checked' : ''}">
                  <input type="radio" name="trip_aesthetic" value="${id}" ${id === 'any' ? 'checked' : ''} />
                  ${p.label}
                </label>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="row" style="justify-content: flex-end; gap: 8px;">
          <button class="btn btn-primary" id="trip_generate">Build packing list</button>
        </div>
      </div>

      <div id="trip_output" style="margin-top: 24px;"></div>
    `;

    // Wire occasion checkboxes
    document.querySelectorAll('#trip_occasions input').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.parentElement.classList.toggle('checked', cb.checked);
      });
    });
    document.querySelectorAll('#trip_aesthetic input').forEach(r => {
      r.addEventListener('change', () => {
        document.querySelectorAll('#trip_aesthetic .check').forEach(c => c.classList.remove('checked'));
        r.parentElement.classList.add('checked');
      });
    });

    document.getElementById('trip_generate').addEventListener('click', generate);
  }

  async function generate() {
    const name = document.getElementById('trip_name').value.trim();
    const dest = document.getElementById('trip_dest').value.trim();
    const days = Math.max(1, Math.min(30, Number(document.getElementById('trip_days').value) || 5));
    const season = document.getElementById('trip_season').value || null;
    const aesthetic = document.querySelector('#trip_aesthetic input:checked')?.value || 'any';
    const occasions = [...document.querySelectorAll('#trip_occasions input:checked')].map(c => c.value);

    if (occasions.length === 0) {
      alert('Pick at least one activity for the trip.');
      return;
    }

    const items = await dbGetAllItems();

    // Distribute days across occasions roughly proportionally (at least 1 outfit per chosen occasion)
    const perOccasion = Math.max(1, Math.floor(days / occasions.length));
    const out = document.getElementById('trip_output');
    out.innerHTML = '<p class="muted">Building outfits…</p>';

    const allOutfits = [];
    const usedItemIds = new Set();
    for (const occ of occasions) {
      const count = perOccasion;
      const suggestions = generateOutfitSuggestions(occ, items, { season, count: count * 2, aesthetic });
      // Keep the first `count` suggestions that introduce some new items (to maximize variety)
      const picked = [];
      for (const s of suggestions) {
        const itemIds = s.slots.filter(x => x.item).map(x => x.item.id);
        const newOnes = itemIds.filter(id => !usedItemIds.has(id)).length;
        if (newOnes > 0 || picked.length === 0) {
          picked.push(s);
          itemIds.forEach(id => usedItemIds.add(id));
        }
        if (picked.length >= count) break;
      }
      // If we didn't get enough, allow repeats
      while (picked.length < count && suggestions.length > 0) {
        picked.push(suggestions[picked.length % suggestions.length]);
      }
      allOutfits.push({ occasion: occ, outfits: picked });
    }

    // Build the unique packing list
    const itemMap = new Map();
    const missingNeeds = new Map(); // shopQuery -> [occasions]
    for (const group of allOutfits) {
      for (const outfit of group.outfits) {
        for (const slot of outfit.slots) {
          if (slot.item) {
            if (!itemMap.has(slot.item.id)) itemMap.set(slot.item.id, slot.item);
          } else if (slot.missing) {
            const key = slot.shopQuery || slot.slotName;
            if (!missingNeeds.has(key)) missingNeeds.set(key, new Set());
            missingNeeds.get(key).add(group.occasion);
          }
        }
      }
    }

    const packingList = [...itemMap.values()];

    // Render output
    out.innerHTML = `
      <h2 class="gm-h2" style="text-align: center;">${escapeHtml(name || 'Your trip')}${dest ? ' · ' + escapeHtml(dest) : ''}</h2>
      <div class="muted" style="text-align: center; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 24px;">${days} day${days === 1 ? '' : 's'} · ${occasions.length} ${occasions.length === 1 ? 'activity' : 'activities'} · ${packingList.length} pieces${missingNeeds.size > 0 ? ' · ' + missingNeeds.size + ' gap' + (missingNeeds.size === 1 ? '' : 's') : ''}</div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">
        <div>
          <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; margin-bottom: 12px;">Packing list</h3>
          <p class="muted" style="font-size: 11.5px; margin-bottom: 12px;">${packingList.length} unique piece${packingList.length === 1 ? '' : 's'} cover all your outfits.</p>
          <div class="trip-pack-list">
            ${packingList.map(it => {
              const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
              const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
              const meta = [it.brand, it.color].filter(Boolean).join(' · ');
              return `
                <label class="trip-pack-row">
                  <input type="checkbox" />
                  <div class="gm-thumb" style="background-image:url('${url}'); width: 44px; height: 44px;"></div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 500; font-size: 13px;">${escapeHtml(name)}</div>
                    <div class="muted" style="font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase;">${escapeHtml(meta)}</div>
                  </div>
                </label>
              `;
            }).join('')}
          </div>
          ${missingNeeds.size > 0 ? `
            <h4 style="margin-top: 18px; font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted);">Need to acquire</h4>
            <div class="trip-pack-list" style="margin-top: 8px;">
              ${[...missingNeeds.entries()].map(([key, occs]) => {
                const shopUrl = 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(key);
                return `
                  <div class="trip-pack-row" style="border-style: dashed;">
                    <div class="gm-thumb" style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--text-faint); background: linear-gradient(135deg, var(--surface-2), var(--border)); border: 1px dashed var(--border-strong);">+</div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-weight: 500; font-size: 13px;">${escapeHtml(key)}</div>
                      <div class="muted" style="font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase;">For: ${[...occs].map(o => escapeHtml(labelForOccasion(o))).join(', ')}</div>
                    </div>
                    <a class="btn btn-sm" href="${shopUrl}" target="_blank" rel="noopener">Shop</a>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
        <div>
          <h3 style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; margin-bottom: 12px;">Daily outfits</h3>
          ${allOutfits.map(group => `
            <div style="margin-bottom: 20px;">
              <div class="muted" style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px;">${escapeHtml(labelForOccasion(group.occasion))}</div>
              ${group.outfits.map((outfit, i) => `
                <div class="trip-outfit-card">
                  <div class="trip-outfit-title">Outfit ${i + 1}</div>
                  <div class="trip-outfit-pieces">
                    ${outfit.slots.map(slot => {
                      if (slot.missing) {
                        return `<div class="muted" style="font-size: 11px;">${escapeHtml(slot.slotName)}: <em>${escapeHtml(slot.shopQuery || 'need')}</em></div>`;
                      }
                      const url = slot.item.thumb ? blobToUrl(slot.item.thumb) : (slot.item.photo ? blobToUrl(slot.item.photo) : '');
                      return `<div class="trip-outfit-piece"><div style="width: 28px; height: 28px; background-size: cover; background-position: center; background-image: url('${url}'); border-radius: 2px;"></div><span>${escapeHtml(slot.item.name || slot.item.subtype || '')}</span></div>`;
                    }).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>

      <div class="row" style="justify-content: center; gap: 8px; margin-top: 24px;">
        <button class="btn" id="trip_print">Print packing list</button>
        <button class="btn btn-ghost" id="trip_reset">Build another</button>
      </div>
    `;

    document.getElementById('trip_print').addEventListener('click', () => window.print());
    document.getElementById('trip_reset').addEventListener('click', () => render(document.getElementById('main')));
    window.scrollTo({ top: out.offsetTop - 16, behavior: 'smooth' });
  }

  window.renderTripView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/trip') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/compare-r1.js ===== */
// compare-r1.js — Side-by-side item comparison at #/compare
// Pulls items from BOTH closet and wishlist via a unified picker.
// Up to 8 columns. Picker supports multi-select; returned items filtered out.

(function() {
  let picked = [];
  const MAX_COLS = 8;
  // Multi-select state for the picker modal
  let pickerSel = new Set();  // keys: "closet:123" / "wishlist:45"

  async function loadAllSources() {
    const closetAll = await dbGetAllItems();
    // Filter out returned items — they shouldn't show as compare options
    const closet = (typeof activeItems === 'function') ? activeItems(closetAll) : closetAll;
    const wish = (typeof dbGetAllWishlistItems === 'function') ? await dbGetAllWishlistItems() : [];
    return { closet, wish };
  }

  async function resolveItem(ref) {
    if (ref.source === 'closet') {
      const it = await dbGetItem(ref.id);
      if (!it) return null;
      return { source: 'closet', item: it };
    }
    if (ref.source === 'wishlist') {
      const all = await dbGetAllWishlistItems();
      const it = all.find(x => x.id === ref.id);
      if (!it) return null;
      return { source: 'wishlist', item: it };
    }
    return null;
  }

  function fmtMoney(n) {
    if (!n && n !== 0) return '—';
    return '$' + Number(n).toFixed(2);
  }
  function fmtDate(s) {
    if (!s) return '—';
    return s;
  }

  function compareRow(label, items, valueOf, opts = {}) {
    const values = items.map(({ item, source }) => valueOf(item, source));
    const allSame = values.every(v => String(v || '').toLowerCase() === String(values[0] || '').toLowerCase());
    return `
      <tr class="${allSame ? '' : 'cmp-diff'}">
        <th>${label}</th>
        ${values.map(v => `<td>${v ?? '—'}</td>`).join('')}
      </tr>
    `;
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;

    // Consume any Top 10 / external preload
    if (window._cmpPreload) {
      const p = window._cmpPreload;
      if (p && !picked.some(x => x.source === p.source && x.id === p.id) && picked.length < MAX_COLS) {
        picked.push({ source: p.source, id: p.id });
      }
      window._cmpPreload = null;
    }

    const resolved = (await Promise.all(picked.map(resolveItem))).filter(Boolean);

    main.innerHTML = `
      <div class="page-header" style="justify-content: center; flex-direction: column; text-align: center; gap: 0;">
        <h1 class="browse-title">Do I really need this?</h1>
        <div class="page-subtitle">Side by side · up to ${MAX_COLS} pieces</div>
      </div>

      <div class="row" style="justify-content: center; gap: 8px; margin-bottom: 18px;">
        <button class="btn btn-primary" id="cmp_add" ${resolved.length >= MAX_COLS ? 'disabled' : ''}>+ Add items to compare</button>
        ${resolved.length > 0 ? '<button class="btn" id="cmp_clear">Clear all</button>' : ''}
      </div>

      ${resolved.length === 0 ? `
        <div class="empty">
          <div class="empty-title">No items selected yet</div>
          <p>Click "+ Add items" and tick up to ${MAX_COLS} pieces from your closet or wishlist.</p>
        </div>
      ` : renderTable(resolved)}
    `;

    document.getElementById('cmp_add')?.addEventListener('click', openPicker);
    document.getElementById('cmp_clear')?.addEventListener('click', () => { picked = []; render(main); });
    main.querySelectorAll('[data-cmp-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.cmpRemove);
        picked.splice(idx, 1);
        render(main);
      });
    });
  }

  function renderTable(resolved) {
    const items = resolved.map(r => ({ item: r.item, source: r.source }));
    const cols = items.length;
    const photoOf = (it) => it.photo ? blobToUrl(it.photo) : (it.thumb ? blobToUrl(it.thumb) : '');
    const subtitleOf = (it, src) => {
      const cat = it.garmentType ? labelForGarmentType(it.garmentType) : '';
      const sub = it.subtype || '';
      return [src === 'wishlist' ? 'Wishlist' : 'In closet', cat, sub].filter(Boolean).join(' · ');
    };

    return `
      <div class="cmp-wrap">
        <div class="cmp-headers" style="grid-template-columns: 140px repeat(${cols}, 1fr);">
          <div></div>
          ${items.map((it, i) => `
            <div class="cmp-col-head">
              <button class="cmp-remove" data-cmp-remove="${i}" title="Remove">×</button>
              <div class="cmp-photo" style="background-image:url('${photoOf(it.item)}')"></div>
              <div class="cmp-name">${escapeHtml(it.item.name || '—')}</div>
              <div class="cmp-sub muted">${escapeHtml(subtitleOf(it.item, it.source))}</div>
            </div>
          `).join('')}
        </div>
        <table class="cmp-table" style="grid-template-columns: 140px repeat(${cols}, 1fr);">
          <tbody>
            ${compareRow('Brand',     items, (it) => escapeHtml(it.brand || '—'))}
            ${compareRow('Color',     items, (it) => escapeHtml(it.color || '—'))}
            ${compareRow('Size',      items, (it) => escapeHtml(it.size || '—'))}
            ${compareRow('Category',  items, (it) => it.garmentType ? labelForGarmentType(it.garmentType) : '—')}
            ${compareRow('Subtype',   items, (it) => escapeHtml(it.subtype || '—'))}
            ${compareRow('Price',     items, (it) => fmtMoney(it.purchasePrice ?? it.targetPrice))}
            ${compareRow('Date',      items, (it, src) => src === 'wishlist' ? '—' : fmtDate(it.purchaseDate))}
            ${compareRow('Wears',     items, (it, src) => src === 'wishlist' ? '—' : (it.wearLog?.length || 0))}
            ${compareRow('Rating',    items, (it) => {
              if (!window.ratingHelpers) return '—';
              const v = window.ratingHelpers.computeOverall(it);
              const fav = it.favorite ? '♥ ' : '';
              return v > 0 ? fav + window.ratingHelpers.starsHtml(v, { showNumber: true }) : (it.favorite ? '♥' : '—');
            })}
            ${compareRow('Status',    items, (it, src) => src === 'wishlist' ? 'On wishlist' : (it.status ? labelForStatus(it.status) : 'Keep'))}
            ${compareRow('Lifestyle', items, (it) => (it.lifestyleCategories || []).map(labelForLifestyle).join(', ') || '—')}
            ${compareRow('Seasons',   items, (it) => (it.seasons || []).map(labelForSeason).join(', ') || '—')}
            ${compareRow('Notes',     items, (it) => escapeHtml(it.notes || '—'))}
            ${items.some(({source, item}) => source === 'wishlist' && item.url) ? compareRow('Site', items, (it, src) => src === 'wishlist' && it.url ? `<a href="${escapeHtml(it.url)}" target="_blank" rel="noopener">Visit →</a>` : '—') : ''}
          </tbody>
        </table>
      </div>
    `;
  }

  // ===== Multi-select picker =====
  async function openPicker() {
    if (typeof openModal !== 'function') return;
    const { closet, wish } = await loadAllSources();

    pickerSel = new Set();
    const remaining = MAX_COLS - picked.length;

    // Already-picked keys so we can grey them out instead of letting them be added twice
    const already = new Set(picked.map(p => `${p.source}:${p.id}`));

    const closetHtml = closet.map(i => itemPickerCard(i, 'closet', already)).join('');
    const wishHtml = wish.map(i => itemPickerCard(i, 'wishlist', already)).join('');

    openModal(`
      <h2 style="margin: 0 0 8px;">Pick items to compare</h2>
      <div class="muted" style="font-size: 12px; margin-bottom: 12px;">
        ${remaining} slot${remaining === 1 ? '' : 's'} left · click cards to select
      </div>
      <div class="row" style="margin-bottom: 12px;">
        <input class="input" id="cmp_search" placeholder="Search by name or brand…" style="flex: 1;" />
      </div>
      <div class="cmp-picker-toolbar" style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px; padding: 10px 12px; background: var(--surface-2); border-radius: var(--radius);">
        <span id="cmp-picker-count" style="font-size: 13px; font-weight: 500;">0 selected</span>
        <span class="muted" style="font-size: 11px;">/ ${remaining} slots open</span>
        <div class="spacer" style="flex: 1;"></div>
        <button class="btn btn-ghost btn-sm" id="cmp-picker-clear">Clear</button>
        <button class="btn btn-primary" id="cmp-picker-done" disabled>Add 0 →</button>
      </div>
      <div class="cmp-picker-tabs">
        <button class="login-tab active" data-pickerTab="closet">Closet (${closet.length})</button>
        <button class="login-tab" data-pickerTab="wishlist">Wishlist (${wish.length})</button>
      </div>
      <div class="cmp-picker-grid" id="cmp_picker_closet">${closetHtml || '<div class="muted" style="padding: 20px;">Closet is empty.</div>'}</div>
      <div class="cmp-picker-grid" id="cmp_picker_wishlist" hidden>${wishHtml || '<div class="muted" style="padding: 20px;">Wishlist is empty.</div>'}</div>
    `);

    function refreshCount() {
      const n = pickerSel.size;
      const countEl = document.getElementById('cmp-picker-count');
      const doneEl = document.getElementById('cmp-picker-done');
      if (countEl) countEl.textContent = `${n} selected`;
      if (doneEl) {
        doneEl.textContent = `Add ${n} →`;
        doneEl.disabled = n === 0;
      }
    }

    document.querySelectorAll('[data-pickerTab]').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('[data-pickerTab]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const tab = b.dataset.pickerTab;
        document.getElementById('cmp_picker_closet').hidden = tab !== 'closet';
        document.getElementById('cmp_picker_wishlist').hidden = tab !== 'wishlist';
      });
    });

    document.getElementById('cmp_search').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.cmp-picker-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = !q || text.includes(q) ? '' : 'none';
      });
    });

    document.querySelectorAll('.cmp-picker-card').forEach(card => {
      // Already-picked cards are visually marked but not clickable
      if (card.classList.contains('cmp-already')) return;
      card.addEventListener('click', () => {
        const source = card.dataset.source;
        const id = Number(card.dataset.id);
        const key = `${source}:${id}`;
        if (pickerSel.has(key)) {
          pickerSel.delete(key);
          card.classList.remove('picker-selected');
        } else {
          if (pickerSel.size >= remaining) {
            showToast(`Only ${remaining} slot${remaining === 1 ? '' : 's'} left.`);
            return;
          }
          pickerSel.add(key);
          card.classList.add('picker-selected');
        }
        refreshCount();
      });
    });

    document.getElementById('cmp-picker-clear').addEventListener('click', () => {
      pickerSel.clear();
      document.querySelectorAll('.cmp-picker-card.picker-selected').forEach(c => c.classList.remove('picker-selected'));
      refreshCount();
    });

    document.getElementById('cmp-picker-done').addEventListener('click', () => {
      pickerSel.forEach(key => {
        const [source, idStr] = key.split(':');
        const id = Number(idStr);
        if (!picked.some(p => p.source === source && p.id === id)) {
          picked.push({ source, id });
        }
      });
      pickerSel.clear();
      closeModal();
      render(document.getElementById('main'));
    });
  }

  function itemPickerCard(item, source, already) {
    const url = item.thumb ? blobToUrl(item.thumb) : (item.photo ? blobToUrl(item.photo) : '');
    const name = item.name || item.subtype || '—';
    const brand = item.brand || '';
    const key = `${source}:${item.id}`;
    const isAlready = already && already.has(key);
    return `
      <div class="cmp-picker-card ${isAlready ? 'cmp-already' : ''}" data-source="${source}" data-id="${item.id}">
        <div class="picker-checkbox"></div>
        <div class="cmp-picker-thumb" style="background-image:url('${url}')"></div>
        <div class="cmp-picker-name">${escapeHtml(name)}</div>
        <div class="cmp-picker-brand muted">${escapeHtml(brand)}</div>
        ${isAlready ? '<div class="cmp-picker-flag">✓ already in compare</div>' : ''}
      </div>
    `;
  }

  window.renderCompareView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/compare') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/outfit-feedback-r1.js ===== */
// outfit-feedback-r1.js — train-the-system feedback for outfit rotations.
//
// Stores user thumbs/pins/bad-pairs in localStorage. Both global (applies
// to every capsule) and per-capsule (overrides global for that one) data
// is kept. The capsule rotation generator consults this module to:
//   - Skip outfit signatures the user has thumbs-down'd
//   - Use pinned outfits for specific days
//   - Avoid pairs flagged as "bad together" (>=2 strikes)
//   - Soft-prefer outfit signatures the user has thumbs-up'd

(function() {
  const LS_KEY = 'vc:outfitFeedback';

  function emptyBucket() {
    return { liked: [], disliked: [], pinned: {}, badPairs: {} };
  }

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { global: emptyBucket(), capsules: {} };
      const data = JSON.parse(raw);
      if (!data.global) data.global = emptyBucket();
      if (!data.capsules) data.capsules = {};
      return data;
    } catch (_) { return { global: emptyBucket(), capsules: {} }; }
  }

  function save(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); }
    catch (e) { console.warn('Feedback save failed:', e); }
  }

  function bucketFor(data, capsuleId) {
    if (capsuleId == null) return data.global;
    if (!data.capsules[capsuleId]) data.capsules[capsuleId] = emptyBucket();
    return data.capsules[capsuleId];
  }

  // Signature for an outfit — sorted item ids joined.
  function sig(items) {
    return (items || [])
      .map(it => (it && it.id != null) ? it.id : (typeof it === 'number' ? it : null))
      .filter(x => x != null)
      .sort((a, b) => a - b)
      .join('-');
  }

  // Pair key: smaller id first so order doesn't matter
  function pairKey(a, b) {
    const lo = Math.min(a, b), hi = Math.max(a, b);
    return `${lo}:${hi}`;
  }

  // ===== Public API =====

  function like(capsuleId, items) {
    const data = load();
    const s = sig(items);
    if (!s) return;
    [data.global, bucketFor(data, capsuleId)].forEach(b => {
      if (!b.liked.find(x => x.sig === s)) {
        b.liked.push({ sig: s, ts: Date.now() });
      }
    });
    save(data);
  }

  function dislike(capsuleId, items) {
    const data = load();
    const s = sig(items);
    if (!s) return;
    const ids = items.map(it => (it && it.id) || it).filter(x => x != null);
    [data.global, bucketFor(data, capsuleId)].forEach(b => {
      if (!b.disliked.find(x => x.sig === s)) {
        b.disliked.push({ sig: s, ts: Date.now() });
      }
      // Add a +1 strike to every pair in this outfit
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const k = pairKey(ids[i], ids[j]);
          b.badPairs[k] = (b.badPairs[k] || 0) + 1;
        }
      }
    });
    save(data);
  }

  function unvote(capsuleId, items) {
    const data = load();
    const s = sig(items);
    if (!s) return;
    [data.global, bucketFor(data, capsuleId)].forEach(b => {
      b.liked = b.liked.filter(x => x.sig !== s);
      b.disliked = b.disliked.filter(x => x.sig !== s);
    });
    save(data);
  }

  function pinDay(capsuleId, dayNum, items) {
    if (capsuleId == null) return;  // pinning is per-capsule only
    const data = load();
    const b = bucketFor(data, capsuleId);
    const ids = items.map(it => (it && it.id) || it).filter(x => x != null);
    b.pinned[dayNum] = { ids, ts: Date.now() };
    save(data);
  }

  function unpinDay(capsuleId, dayNum) {
    if (capsuleId == null) return;
    const data = load();
    const b = bucketFor(data, capsuleId);
    delete b.pinned[dayNum];
    save(data);
  }

  function getPinned(capsuleId, dayNum) {
    if (capsuleId == null) return null;
    const data = load();
    const b = bucketFor(data, capsuleId);
    return b.pinned[dayNum] || null;
  }

  // Returns true if this outfit signature is disliked anywhere
  function isDisliked(capsuleId, items) {
    const data = load();
    const s = sig(items);
    if (!s) return false;
    if (data.global.disliked.find(x => x.sig === s)) return true;
    const cap = data.capsules[capsuleId];
    if (cap && cap.disliked.find(x => x.sig === s)) return true;
    return false;
  }

  function isLiked(capsuleId, items) {
    const data = load();
    const s = sig(items);
    if (!s) return false;
    if (data.global.liked.find(x => x.sig === s)) return true;
    const cap = data.capsules[capsuleId];
    if (cap && cap.liked.find(x => x.sig === s)) return true;
    return false;
  }

  // Returns true if any pair in `items` has accumulated >= threshold strikes
  // either globally or in this capsule.
  function hasBadPair(capsuleId, items, threshold = 2) {
    const data = load();
    const ids = items.map(it => (it && it.id) || it).filter(x => x != null);
    const cap = data.capsules[capsuleId];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const k = pairKey(ids[i], ids[j]);
        const score = (data.global.badPairs[k] || 0) + ((cap && cap.badPairs[k]) || 0);
        if (score >= threshold) return true;
      }
    }
    return false;
  }

  // Summary counts for a capsule (global + capsule-specific)
  function summary(capsuleId) {
    const data = load();
    const cap = data.capsules[capsuleId] || emptyBucket();
    const liked = data.global.liked.length + cap.liked.length;
    const disliked = data.global.disliked.length + cap.disliked.length;
    const pinned = Object.keys(cap.pinned).length;
    const badPairCount = Object.keys(data.global.badPairs).length + Object.keys(cap.badPairs).length;
    return { liked, disliked, pinned, badPairCount };
  }

  // Reset training. Scope: 'global' | 'capsule:<id>' | 'all'
  function reset(scope, capsuleId) {
    const data = load();
    if (scope === 'global' || scope === 'all') {
      data.global = emptyBucket();
    }
    if ((scope === 'capsule' || scope === 'all') && capsuleId != null) {
      delete data.capsules[capsuleId];
    }
    save(data);
  }

  window.outfitFeedback = {
    like, dislike, unvote,
    pinDay, unpinDay, getPinned,
    isDisliked, isLiked, hasBadPair,
    summary, reset, sig,
  };
})();


/* ===== js/flatlay-r1.js ===== */
// flatlay-r1.js — Paper-doll / flat-lay render for outfit cards.
//
// Given an outfit (array of { role, item }), composes a stylized
// fashion-magazine flat-lay using the actual garment photos. Each piece
// is placed in a fixed zone (outerwear / top / bottom / shoes / accent)
// inside a portrait-aspect stage. Pure CSS, no AI.
//
// Exposed via window.flatlayHtmlForOutfit(items, opts).

(function() {
  // Zone definitions inside a 200x320 stage. Coordinates are CSS percent.
  // top + bottom may be replaced by a single dress (zone: dress).
  // Layer (outerwear) is offset so it visually sits behind/beside the top.
  const ZONES = {
    layer:  { left: '50%',  top: '4%',  width: '70%', height: '36%', zIndex: 1, opacity: 0.92, transform: 'translate(-58%, 0) rotate(-4deg)' },
    top:    { left: '50%',  top: '6%',  width: '60%', height: '32%', zIndex: 3, opacity: 1,    transform: 'translate(-50%, 0)' },
    dress:  { left: '50%',  top: '6%',  width: '60%', height: '60%', zIndex: 3, opacity: 1,    transform: 'translate(-50%, 0)' },
    bottom: { left: '50%',  top: '38%', width: '54%', height: '32%', zIndex: 2, opacity: 1,    transform: 'translate(-50%, 0)' },
    shoes:  { left: '50%',  top: '74%', width: '52%', height: '14%', zIndex: 4, opacity: 1,    transform: 'translate(-50%, 0)' },
    accent: { left: '6%',   top: '70%', width: '24%', height: '22%', zIndex: 4, opacity: 1,    transform: 'rotate(-6deg)' },
    extra:  { left: '74%',  top: '70%', width: '22%', height: '20%', zIndex: 4, opacity: 1,    transform: 'rotate(4deg)' },
  };

  function blobUrlFor(item) {
    if (!item) return '';
    if (item.thumb) return blobToUrl(item.thumb);
    if (item.photo) return blobToUrl(item.photo);
    return '';
  }

  function escape(s) {
    return (typeof escapeHtml === 'function') ? escapeHtml(s) : String(s || '');
  }

  // Map a role label to a zone key.
  // role values from generateRotation: 'Top', 'Bottom', 'Layer', 'Shoes', 'Accent', 'Dress'
  function zoneForRole(role) {
    switch (role) {
      case 'Layer':   return 'layer';
      case 'Top':     return 'top';
      case 'Dress':   return 'dress';
      case 'Bottom':  return 'bottom';
      case 'Shoes':   return 'shoes';
      case 'Accent':  return 'accent';
      default:        return 'extra';
    }
  }

  // Build the flat-lay HTML string from outfit items (array of { role, item }).
  // `opts` is reserved for future extensibility.
  function flatlayHtmlForOutfit(items, opts) {
    if (!Array.isArray(items) || items.length === 0) {
      return '<div class="flatlay-empty muted">No items</div>';
    }
    // Track which zones are taken so duplicates spill into 'extra'
    const used = new Set();
    const layers = items.map(({ role, item }) => {
      let zone = zoneForRole(role);
      if (used.has(zone)) zone = 'extra';
      used.add(zone);
      const url = blobUrlFor(item);
      const z = ZONES[zone] || ZONES.extra;
      const title = escape((item && (item.name || item.subtype || '')) + ' · ' + role);
      return `
        <div class="flatlay-zone flatlay-zone-${zone}"
             style="left:${z.left};top:${z.top};width:${z.width};height:${z.height};z-index:${z.zIndex};opacity:${z.opacity};transform:${z.transform};"
             title="${title}">
          <div class="flatlay-thumb" style="background-image:url('${url}')"></div>
        </div>
      `;
    }).join('');

    return `
      <div class="flatlay-stage">
        ${layers}
      </div>
    `;
  }

  window.flatlayHtmlForOutfit = flatlayHtmlForOutfit;
})();


/* ===== js/ratings-r1.js ===== */
// ratings-r1.js — closet item self-rating system.
//
// Each item stores:
//   - favorite: boolean (heart toggle)
//   - rating: number 0-5 (overall)
//   - ratingFit, ratingComfort, ratingStyle, ratingVersatility: 0-5
//
// If overall `rating` is unset but the 4 axes are set, computeOverall()
// derives one. Otherwise overall takes precedence.
//
// Visibility-to-friends ships when Supabase wires up; data persists now.

(function() {
  // Compute overall rating: if explicit, use it. Otherwise average of axes.
  function computeOverall(item) {
    if (!item) return 0;
    const explicit = Number(item.rating);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const axes = [item.ratingFit, item.ratingComfort, item.ratingStyle, item.ratingVersatility]
      .map(Number).filter(n => Number.isFinite(n) && n > 0);
    if (axes.length === 0) return 0;
    return axes.reduce((a, b) => a + b, 0) / axes.length;
  }

  // Render compact stars (read-only). value 0-5 (can be fractional).
  function starsHtml(value, opts = {}) {
    const v = Math.max(0, Math.min(5, Number(value) || 0));
    if (v === 0 && opts.hideEmpty) return '';
    const filled = Math.round(v);  // round to nearest whole star for display
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(`<span class="star ${i <= filled ? 'filled' : ''}">${i <= filled ? '★' : '☆'}</span>`);
    }
    const numLabel = opts.showNumber && v > 0 ? `<span class="star-num">${v.toFixed(1)}</span>` : '';
    return `<span class="stars" title="${v.toFixed(1)} / 5">${stars.join('')}${numLabel}</span>`;
  }

  // Editable star widget. `name` becomes the input id and form field name.
  // `current` is 0-5 (0 = unset).
  function ratingInputHtml(name, label, current) {
    const v = Math.max(0, Math.min(5, Number(current) || 0));
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(`<button type="button" class="star-btn ${i <= v ? 'filled' : ''}" data-rate-name="${name}" data-rate-value="${i}">${i <= v ? '★' : '☆'}</button>`);
    }
    return `
      <div class="rating-row">
        <span class="rating-row-label">${label}</span>
        <div class="rating-stars" data-rate-group="${name}">${stars.join('')}</div>
        <button type="button" class="rating-clear" data-rate-clear="${name}" title="Clear">×</button>
        <input type="hidden" id="${name}" value="${v || ''}" />
      </div>
    `;
  }

  // Wire up rating star buttons + clear button. Call after rendering a form
  // that contains ratingInputHtml() outputs.
  function wireRatingInputs(rootEl) {
    const root = rootEl || document;
    root.querySelectorAll('[data-rate-name]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.rateName;
        const val = Number(btn.dataset.rateValue);
        const hidden = root.querySelector(`#${name}`);
        if (hidden) hidden.value = String(val);
        // Update visual state in this group
        const group = root.querySelector(`[data-rate-group="${name}"]`);
        if (group) {
          group.querySelectorAll('button').forEach(b => {
            const v = Number(b.dataset.rateValue);
            b.classList.toggle('filled', v <= val);
            b.textContent = v <= val ? '★' : '☆';
          });
        }
      });
    });
    root.querySelectorAll('[data-rate-clear]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.rateClear;
        const hidden = root.querySelector(`#${name}`);
        if (hidden) hidden.value = '';
        const group = root.querySelector(`[data-rate-group="${name}"]`);
        if (group) {
          group.querySelectorAll('button').forEach(b => {
            b.classList.remove('filled');
            b.textContent = '☆';
          });
        }
      });
    });
  }

  // Read all rating values from a form into a plain object
  function collectRatings(rootEl) {
    const root = rootEl || document;
    const fields = ['rating', 'ratingFit', 'ratingComfort', 'ratingStyle', 'ratingVersatility'];
    const out = {};
    for (const f of fields) {
      const el = root.querySelector(`#${f}`);
      const v = el && el.value ? Number(el.value) : null;
      out[f] = (v && v > 0) ? v : null;
    }
    return out;
  }

  // Heart toggle helper (used on closet cards)
  function favoriteHtml(item, opts = {}) {
    const isFav = !!item.favorite;
    return `<button class="card-fav ${isFav ? 'is-fav' : ''}" data-fav-id="${item.id}" title="${isFav ? 'Unfavorite' : 'Favorite'}" aria-label="${isFav ? 'Unfavorite' : 'Favorite'}">${isFav ? '♥' : '♡'}</button>`;
  }

  window.ratingHelpers = {
    computeOverall,
    starsHtml,
    ratingInputHtml,
    wireRatingInputs,
    collectRatings,
    favoriteHtml,
  };
})();


/* ===== js/capsule-r1.js ===== */
// capsule-r1.js — Capsule wardrobe planner at #/capsule

(function() {
  const SHORT_SLEEVE_SUBTYPES = new Set(['T-shirt', 'Blouse', 'Shirt', 'Polo']);
  const PAJAMA_SUBTYPES = new Set(['Pajamas', 'Robe', 'Camisole', 'Slip']);

  function isPajamaItem(it) {
    if (!it) return false;
    if (PAJAMA_SUBTYPES.has(it.subtype)) return true;
    if (Array.isArray(it.lifestyleCategories) && it.lifestyleCategories.includes('loungewear')) return true;
    if (Array.isArray(it.tags)) {
      for (const t of it.tags) {
        const lower = String(t).toLowerCase();
        if (lower.includes('pajama') || lower.includes('sleep') || lower === 'pj' || lower.includes('loungewear')) return true;
      }
    }
    return false;
  }

  // Outerwear & Layers: includes ALL tops + ALL outerwear (per user request 2026-04-30)
  const CATEGORY_DEFS = {
    tops_long: {
      label: 'Tops — Long sleeve',
      filter: it => it.garmentType === 'tops' && it.subtype === 'Long sleeve',
    },
    tops_short: {
      label: 'Tops — Short sleeve',
      filter: it => it.garmentType === 'tops' && SHORT_SLEEVE_SUBTYPES.has(it.subtype),
    },
    tops_tank: {
      label: 'Tops — Tank top',
      filter: it => it.garmentType === 'tops' && it.subtype === 'Tank top',
    },
    bottoms: {
      label: 'Bottoms',
      filter: it => it.garmentType === 'bottoms',
    },
    dresses: {
      label: 'Dresses',
      filter: it => it.garmentType === 'dresses',
    },
    outerwear: {
      label: 'Outerwear & Layers',
      filter: it => it.garmentType === 'outerwear' || it.garmentType === 'tops',
    },
    intimates_swim: {
      label: 'Intimates & Swim',
      filter: () => true,
    },
    pajamas: {
      label: 'Pajamas (top & bottom)',
      filter: isPajamaItem,
    },
    sports_bra: {
      label: 'Sports Bras',
      filter: it => it.subtype === 'Sports bra',
    },
    shoes: {
      label: 'Shoes',
      filter: it => it.garmentType === 'shoes',
    },
    accessories: {
      label: 'Accessories',
      filter: it => it.garmentType === 'accessories',
    },
    tops: {
      label: 'Tops (legacy)',
      filter: it => it.garmentType === 'tops',
    },
  };

  const PRESETS = {
    lifestyle: {
      label: 'Lifestyle',
      tagline: 'Everyday mix-and-match wardrobe',
      targets: {
        tops_long: 2, tops_short: 2, tops_tank: 1,
        sports_bra: 1,
        bottoms: 3, dresses: 1, outerwear: 1,
        intimates_swim: 0, pajamas: 2,
        shoes: 2, accessories: 3,
      },
    },
    athletics: {
      label: 'Athletics',
      tagline: 'Sport-focused — sweat, lift, run, court',
      targets: {
        tops_long: 1, tops_short: 3, tops_tank: 2,
        sports_bra: 3,
        bottoms: 4, dresses: 0, outerwear: 2,
        intimates_swim: 0, pajamas: 0,
        shoes: 2, accessories: 2,
      },
    },
  };

  let editingId = null;
  let editingCapsule = null;
  const MAX_PICK_PER_OPERATION = 30;
  let pickerSelectedIds = new Set();
  let pickerCat = null;
  let pickerCachedItems = null;

  // Cache the most recent rotation so feedback buttons can refresh it without
  // a full regenerate (which would replace just-liked outfits).
  let _lastRotationContext = null;
  // 'grid' (default — small role-labeled thumbs) or 'flatlay' (paper-doll).
  let _rotationViewMode = (function() {
    try { return localStorage.getItem('vc:rotationViewMode') || 'grid'; }
    catch (_) { return 'grid'; }
  })();

  function categoryLabel(cat) { return CATEGORY_DEFS[cat]?.label || cat; }
  function filterForCategory(cat, items) {
    const def = CATEGORY_DEFS[cat];
    if (!def) return items;
    return items.filter(def.filter);
  }

  function synopsisHtml() {
    return `
      <div class="capsule-intro card" style="padding: 20px 22px; margin-bottom: 18px;">
        <h2 style="margin: 0 0 6px; font-family: 'Playfair Display', serif; font-size: 22px;">What is a capsule wardrobe?</h2>
        <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.55;">
          A small, intentional collection of pieces that mix and match — built
          around a neutral base, your real lifestyle, and quality fabrics.
        </p>
        <div class="capsule-intro-foot muted" style="font-size: 12px;">
          Pick a preset, drop in pieces, then click ✨ Generate 30-day rotation. Use 👍/👎/🔒 on each day to teach the system your style.
        </div>
      </div>
    `;
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    editingId = null;
    editingCapsule = null;

    const capsules = await dbGetAllCapsules();
    capsules.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>My Capsule Wardrobe</h1>
          <div class="page-subtitle">${capsules.length} saved · curated micro-collections</div>
        </div>
        <button class="btn btn-primary" id="cap_new">+ New capsule</button>
      </div>
      ${synopsisHtml()}
      ${capsules.length === 0 ? `
        <div class="empty">
          <div class="empty-title">No capsules yet</div>
          <p>Set targets, drop in pieces, save, then generate a 30-day rotation.</p>
          <button class="btn btn-primary" id="cap_new_empty">+ Build your first capsule</button>
        </div>
      ` : `
        <div class="capsule-list">${capsules.map(c => capsuleCardHtml(c)).join('')}</div>
      `}
    `;

    document.getElementById('cap_new')?.addEventListener('click', () => openPresetPicker());
    document.getElementById('cap_new_empty')?.addEventListener('click', () => openPresetPicker());
    main.querySelectorAll('[data-edit-capsule]').forEach(b => {
      b.addEventListener('click', () => openEditor(Number(b.dataset.editCapsule)));
    });
    main.querySelectorAll('[data-rotate-capsule]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.rotateCapsule);
        const all = await dbGetAllCapsules();
        const c = all.find(x => x.id === id);
        if (c) openRotationModal(c);
      });
    });
    main.querySelectorAll('[data-delete-capsule]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.deleteCapsule);
        if (!confirm('Delete this capsule? Your closet items are unaffected.')) return;
        await dbDeleteCapsule(id);
        render(main);
      });
    });
  }

  function capsuleCardHtml(c) {
    const total = Object.values(c.slots || {}).reduce((s, arr) => s + (arr || []).length, 0);
    const targetTotal = Object.values(c.targets || {}).reduce((s, n) => s + (n || 0), 0);
    const presetLabel = c.preset && PRESETS[c.preset] ? PRESETS[c.preset].label : 'Lifestyle';
    const presetClass = c.preset === 'athletics' ? 'capsule-pill-athletics' : 'capsule-pill-lifestyle';
    return `
      <div class="capsule-card">
        <div class="capsule-card-head">
          <h3 class="capsule-name">${escapeHtml(c.name || 'Untitled capsule')}</h3>
          <div class="capsule-progress">${total} / ${targetTotal} pieces</div>
        </div>
        <div class="capsule-preset-badge ${presetClass}">${escapeHtml(presetLabel)}</div>
        <div class="capsule-cat-mini">
          ${Object.entries(c.targets || {}).map(([cat, target]) => {
            const filled = (c.slots?.[cat] || []).length;
            return `<span class="capsule-cat-pill ${filled >= target ? 'done' : ''}">${escapeHtml(categoryLabel(cat))} ${filled}/${target}</span>`;
          }).join('')}
        </div>
        <div class="row" style="gap: 8px; margin-top: 12px;">
          <button class="btn btn-primary btn-sm" data-rotate-capsule="${c.id}">✨ Generate 30-day rotation</button>
          <button class="btn btn-sm" data-edit-capsule="${c.id}">Edit</button>
          <button class="btn btn-ghost btn-sm" data-delete-capsule="${c.id}">Delete</button>
        </div>
      </div>
    `;
  }

  function openPresetPicker() {
    if (typeof openModal !== 'function') return openEditor(null, 'lifestyle');
    openModal(`
      <h2 style="margin: 0 0 6px;">Pick a capsule type</h2>
      <div class="capsule-preset-grid">
        ${Object.entries(PRESETS).map(([key, p]) => `
          <button class="capsule-preset-card" data-preset="${key}">
            <div class="capsule-preset-name">${escapeHtml(p.label)}</div>
            <div class="capsule-preset-tagline muted">${escapeHtml(p.tagline)}</div>
          </button>
        `).join('')}
      </div>
    `);
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        closeModal();
        openEditor(null, preset);
      });
    });
  }

  async function openEditor(id, preset) {
    editingId = id;
    if (id) {
      const all = await dbGetAllCapsules();
      editingCapsule = all.find(x => x.id === id) || null;
    }
    if (!editingCapsule) {
      const presetKey = preset && PRESETS[preset] ? preset : 'lifestyle';
      const targets = { ...PRESETS[presetKey].targets };
      editingCapsule = {
        name: '',
        preset: presetKey,
        targets,
        slots: Object.fromEntries(Object.keys(targets).map(k => [k, []])),
      };
    }
    if (!editingCapsule.preset) editingCapsule.preset = 'lifestyle';

    // Backfill missing preset categories so legacy capsules show new sections
    const presetTargets = PRESETS[editingCapsule.preset].targets;
    if (!editingCapsule.slots) editingCapsule.slots = {};
    for (const key of Object.keys(presetTargets)) {
      if (!(key in editingCapsule.targets)) editingCapsule.targets[key] = 0;
      if (!editingCapsule.slots[key]) editingCapsule.slots[key] = [];
    }

    renderEditor();
  }

  async function renderEditor() {
    const main = document.getElementById('main');
    const items = await dbGetAllItems();
    const itemMap = new Map(items.map(i => [i.id, i]));
    const presetKey = editingCapsule.preset || 'lifestyle';
    const presetMeta = PRESETS[presetKey] || PRESETS.lifestyle;

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>${editingId ? 'Edit Capsule' : 'New Capsule'}</h1>
          <div class="page-subtitle">${escapeHtml(presetMeta.label)} · ${escapeHtml(presetMeta.tagline)}</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" id="cap_back">Back</button>
          ${editingId ? '<button class="btn" id="cap_rotate">✨ Generate rotation</button>' : ''}
          <button class="btn btn-primary" id="cap_save">${editingId ? 'Save changes' : 'Save capsule'}</button>
        </div>
      </div>

      <div class="card" style="padding: 14px 16px; margin-bottom: 16px;">
        <div class="field">
          <label class="field-label" for="cap_name">Capsule name</label>
          <input class="input" id="cap_name" type="text" placeholder="e.g. Spring 2026" value="${escapeHtml(editingCapsule.name || '')}" />
        </div>
        <div class="field" style="margin-top: 10px;">
          <label class="field-label">Preset</label>
          <div class="capsule-preset-toggle" id="cap_preset_toggle">
            ${Object.entries(PRESETS).map(([key, p]) =>
              `<button type="button" data-preset-toggle="${key}" class="${presetKey === key ? 'active' : ''}">${escapeHtml(p.label)}</button>`
            ).join('')}
          </div>
        </div>
      </div>

      ${Object.entries(editingCapsule.targets).map(([cat, target]) => {
        const slotIds = editingCapsule.slots[cat] || [];
        const slotItems = slotIds.map(id => itemMap.get(id)).filter(Boolean);
        return `
          <section class="capsule-section" data-cat="${cat}">
            <div class="capsule-section-head">
              <h2 class="capsule-section-title">${escapeHtml(categoryLabel(cat))}</h2>
              <div class="capsule-section-target">
                <label class="muted" style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;">Target</label>
                <input class="input" type="number" min="0" max="50" value="${target}" data-target="${cat}" style="width: 64px;" />
                <span class="capsule-fill-count">${slotItems.length} / ${target}</span>
              </div>
            </div>
            <div class="capsule-slot-grid">
              ${slotItems.map(it => slotItemHtml(it, cat)).join('')}
              <button class="capsule-add-tile" data-add="${cat}">+ Add</button>
            </div>
          </section>
        `;
      }).join('')}
    `;

    main.querySelectorAll('[data-target]').forEach(input => {
      input.addEventListener('input', e => {
        const cat = e.target.dataset.target;
        editingCapsule.targets[cat] = Math.max(0, Number(e.target.value) || 0);
        const fill = e.target.parentElement.querySelector('.capsule-fill-count');
        if (fill) fill.textContent = `${(editingCapsule.slots[cat] || []).length} / ${editingCapsule.targets[cat]}`;
      });
    });
    main.querySelectorAll('[data-remove-from-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        const id = Number(btn.dataset.removeFromCat);
        editingCapsule.slots[cat] = (editingCapsule.slots[cat] || []).filter(x => x !== id);
        renderEditor();
      });
    });
    main.querySelectorAll('[data-add]').forEach(btn => {
      btn.addEventListener('click', () => openItemPicker(btn.dataset.add));
    });
    main.querySelectorAll('[data-preset-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const newPreset = btn.dataset.presetToggle;
        if (newPreset === editingCapsule.preset) return;
        if (!editingId) {
          const newTargets = { ...PRESETS[newPreset].targets };
          const newSlots = Object.fromEntries(Object.keys(newTargets).map(k =>
            [k, (editingCapsule.slots && editingCapsule.slots[k]) || []]
          ));
          editingCapsule.targets = newTargets;
          editingCapsule.slots = newSlots;
        }
        editingCapsule.preset = newPreset;
        renderEditor();
      });
    });

    document.getElementById('cap_back').addEventListener('click', () => render(main));
    document.getElementById('cap_save').addEventListener('click', saveCapsule);
    document.getElementById('cap_rotate')?.addEventListener('click', () => openRotationModal(editingCapsule));
  }

  function slotItemHtml(it, cat) {
    const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
    return `
      <div class="capsule-slot-item">
        <div class="capsule-slot-thumb" style="background-image:url('${url}')"></div>
        <div class="capsule-slot-name">${escapeHtml(it.name || it.subtype || 'Untitled')}</div>
        <button class="capsule-slot-remove" data-remove-from-cat="${it.id}" data-cat="${cat}" title="Remove">×</button>
      </div>
    `;
  }

  // ===== Multi-select item picker =====
  async function openItemPicker(cat) {
    if (typeof openModal !== 'function') return;
    pickerCat = cat;
    pickerSelectedIds = new Set();
    const all = await dbGetAllItems();
    const active = (typeof activeItems === 'function') ? activeItems(all) : all;
    const eligible = filterForCategory(cat, active);
    pickerCachedItems = eligible;
    renderPickerModal();
  }

  function renderPickerModal() {
    const cat = pickerCat;
    const eligible = pickerCachedItems || [];
    const alreadySelected = new Set(editingCapsule.slots[cat] || []);

    openModal(`
      <h2 style="margin: 0 0 4px;">Add ${escapeHtml(categoryLabel(cat))}</h2>
      <div class="muted" style="font-size: 12px; margin-bottom: 12px;">
        ${eligible.length} eligible piece${eligible.length === 1 ? '' : 's'} ·
        click cards to select up to ${MAX_PICK_PER_OPERATION} at a time
      </div>
      <div class="cmp-picker-toolbar" style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px; padding: 10px 12px; background: var(--surface-2); border-radius: var(--radius);">
        <span id="picker-count" style="font-size: 13px; font-weight: 500;">0 selected</span>
        <span class="muted" style="font-size: 11px;">/ max ${MAX_PICK_PER_OPERATION}</span>
        <div class="spacer" style="flex: 1;"></div>
        <button class="btn btn-ghost btn-sm" id="picker-select-visible">Select all</button>
        <button class="btn btn-ghost btn-sm" id="picker-clear">Clear</button>
        <button class="btn btn-primary" id="picker-done" disabled>Add 0 →</button>
      </div>
      <div class="cmp-picker-grid">
        ${eligible.map(i => {
          const url = i.thumb ? blobToUrl(i.thumb) : (i.photo ? blobToUrl(i.photo) : '');
          const inSlot = alreadySelected.has(i.id);
          return `
            <div class="cmp-picker-card ${inSlot ? 'cmp-already' : ''}" data-pick-cat-id="${i.id}">
              <div class="picker-checkbox"></div>
              <div class="cmp-picker-thumb" style="background-image:url('${url}')"></div>
              <div class="cmp-picker-name">${escapeHtml(i.name || i.subtype || '—')}</div>
              <div class="cmp-picker-brand muted">${escapeHtml([i.brand, i.color].filter(Boolean).join(' · '))}</div>
              ${inSlot ? '<div class="cmp-picker-flag">✓ in capsule</div>' : ''}
            </div>
          `;
        }).join('') || '<div class="muted" style="padding: 20px;">No eligible pieces.</div>'}
      </div>
    `);

    function refreshCount() {
      const n = pickerSelectedIds.size;
      const countEl = document.getElementById('picker-count');
      const doneEl = document.getElementById('picker-done');
      if (countEl) countEl.textContent = `${n} selected`;
      if (doneEl) {
        doneEl.textContent = `Add ${n} →`;
        doneEl.disabled = n === 0;
      }
    }
    function toggleCard(card, id) {
      if (card.classList.contains('cmp-already')) {
        if (pickerSelectedIds.has(id)) {
          pickerSelectedIds.delete(id);
          card.classList.remove('picker-selected-remove');
        } else {
          pickerSelectedIds.add(id);
          card.classList.add('picker-selected-remove');
        }
        refreshCount();
        return;
      }
      if (pickerSelectedIds.has(id)) {
        pickerSelectedIds.delete(id);
        card.classList.remove('picker-selected');
      } else {
        if (pickerSelectedIds.size >= MAX_PICK_PER_OPERATION) {
          showToast(`You can add up to ${MAX_PICK_PER_OPERATION} items per round.`);
          return;
        }
        pickerSelectedIds.add(id);
        card.classList.add('picker-selected');
      }
      refreshCount();
    }

    document.querySelectorAll('[data-pick-cat-id]').forEach(card => {
      card.addEventListener('click', () => toggleCard(card, Number(card.dataset.pickCatId)));
    });
    document.getElementById('picker-select-visible')?.addEventListener('click', () => {
      const cards = document.querySelectorAll('[data-pick-cat-id]:not(.cmp-already)');
      cards.forEach(card => {
        if (pickerSelectedIds.size >= MAX_PICK_PER_OPERATION) return;
        const id = Number(card.dataset.pickCatId);
        if (!pickerSelectedIds.has(id)) {
          pickerSelectedIds.add(id);
          card.classList.add('picker-selected');
        }
      });
      refreshCount();
    });
    document.getElementById('picker-clear')?.addEventListener('click', () => {
      pickerSelectedIds.clear();
      document.querySelectorAll('[data-pick-cat-id]').forEach(c => {
        c.classList.remove('picker-selected', 'picker-selected-remove');
      });
      refreshCount();
    });
    document.getElementById('picker-done')?.addEventListener('click', () => {
      if (!editingCapsule.slots[cat]) editingCapsule.slots[cat] = [];
      const slot = editingCapsule.slots[cat];
      const alreadyInSlot = new Set(slot);
      const toRemove = [];
      const toAdd = [];
      pickerSelectedIds.forEach(id => {
        if (alreadyInSlot.has(id)) toRemove.push(id);
        else toAdd.push(id);
      });
      const newSlot = slot.filter(id => !toRemove.includes(id)).concat(toAdd);
      editingCapsule.slots[cat] = newSlot;
      pickerSelectedIds.clear();
      pickerCachedItems = null;
      pickerCat = null;
      closeModal();
      renderEditor();
      const n = toAdd.length + toRemove.length;
      if (n > 0) {
        const parts = [];
        if (toAdd.length) parts.push(`added ${toAdd.length}`);
        if (toRemove.length) parts.push(`removed ${toRemove.length}`);
        showToast(parts.join(' · '));
      }
    });
  }

  async function saveCapsule() {
    const name = document.getElementById('cap_name').value.trim();
    if (!name) { alert('Give your capsule a name.'); return; }
    editingCapsule.name = name;
    if (!editingCapsule.preset) editingCapsule.preset = 'lifestyle';
    try {
      if (editingId) {
        await dbUpdateCapsule(editingId, editingCapsule);
        showToast('Capsule updated');
      } else {
        await dbAddCapsule(editingCapsule);
        showToast('Capsule saved');
      }
      render(document.getElementById('main'));
    } catch (e) { alert('Save failed: ' + (e?.message || e)); }
  }

  // ============================================================
  // 30-day outfit rotation generator (with feedback awareness)
  // ============================================================
  function generateRotation(capsule, itemMap) {
    const slot = (k) => (capsule.slots?.[k] || []).map(id => itemMap.get(id)).filter(Boolean);
    const tops = [...slot('tops_long'), ...slot('tops_short'), ...slot('tops_tank'), ...slot('tops')];
    const bottoms = slot('bottoms');
    const dresses = slot('dresses');
    const outerwear = slot('outerwear');
    const shoes = slot('shoes');
    const accessories = slot('accessories');
    const pajamas = slot('pajamas');

    const fb = window.outfitFeedback;
    const days = [];

    function buildOutfit(i) {
      const outfit = { day: i + 1, items: [], pinned: false };
      const useDress = dresses.length > 0 && i % 4 === 3;
      const useOuter = outerwear.length > 0 && (i % 3 === 0 || i % 5 === 2);
      const useAcc = accessories.length > 0;

      if (useDress) {
        outfit.items.push({ role: 'Dress', item: dresses[i % dresses.length] });
      } else {
        if (tops.length > 0) outfit.items.push({ role: 'Top', item: tops[i % tops.length] });
        if (bottoms.length > 0) outfit.items.push({ role: 'Bottom', item: bottoms[(i * 3) % bottoms.length] });
      }
      if (useOuter) outfit.items.push({ role: 'Layer', item: outerwear[(Math.floor(i / 3)) % outerwear.length] });
      if (shoes.length > 0) outfit.items.push({ role: 'Shoes', item: shoes[(i * 7) % shoes.length] });
      if (useAcc) outfit.items.push({ role: 'Accent', item: accessories[i % accessories.length] });
      return outfit;
    }

    for (let i = 0; i < 30; i++) {
      const dayNum = i + 1;

      // Honor pinned days
      if (fb && capsule.id != null) {
        const pinned = fb.getPinned(capsule.id, dayNum);
        if (pinned && Array.isArray(pinned.ids)) {
          const pinnedItems = pinned.ids.map(id => itemMap.get(id)).filter(Boolean);
          if (pinnedItems.length > 0) {
            // Reconstruct roles best-effort by garmentType
            const rolesByType = { tops: 'Top', bottoms: 'Bottom', dresses: 'Dress', outerwear: 'Layer', shoes: 'Shoes', accessories: 'Accent' };
            days.push({
              day: dayNum, pinned: true,
              items: pinnedItems.map(it => ({ role: rolesByType[it.garmentType] || 'Item', item: it })),
            });
            continue;
          }
        }
      }

      // Build with up to 5 attempts to dodge dislikes/bad-pairs
      let outfit = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = buildOutfit(i + attempt * 11);  // jitter the seed
        const candidateItems = candidate.items.map(x => x.item);
        if (fb && capsule.id != null) {
          if (fb.isDisliked(capsule.id, candidateItems)) continue;
          if (fb.hasBadPair(capsule.id, candidateItems, 2)) continue;
        }
        outfit = candidate;
        outfit.day = dayNum;
        break;
      }
      if (!outfit) outfit = buildOutfit(i);  // fallback if every attempt collided
      outfit.day = dayNum;
      // Mark liked outfits visually
      if (fb && capsule.id != null) {
        outfit.liked = fb.isLiked(capsule.id, outfit.items.map(x => x.item));
      }
      days.push(outfit);
    }

    let pajamaDays = [];
    if (pajamas.length > 0) {
      for (let i = 0; i < 30; i++) {
        pajamaDays.push({ day: i + 1, item: pajamas[i % pajamas.length] });
      }
    }

    return {
      days, pajamaDays,
      stats: {
        tops: tops.length, bottoms: bottoms.length, dresses: dresses.length,
        outerwear: outerwear.length, shoes: shoes.length,
        accessories: accessories.length, pajamas: pajamas.length,
      },
    };
  }

  async function openRotationModal(capsule) {
    if (typeof openModal !== 'function') return;
    const items = await dbGetAllItems();
    const itemMap = new Map(items.map(i => [i.id, i]));
    const rotation = generateRotation(capsule, itemMap);
    _lastRotationContext = { capsule, itemMap, rotation };

    const minNeeded = (rotation.stats.tops + rotation.stats.dresses) > 0
                   && (rotation.stats.bottoms > 0 || rotation.stats.dresses > 0);
    if (!minNeeded) {
      openModal(`
        <h2 style="margin: 0 0 8px;">Not enough pieces yet</h2>
        <div class="muted" style="font-size: 13px;">
          Need at least one top + bottom (or one dress) to generate. You have:
          ${rotation.stats.tops} tops, ${rotation.stats.bottoms} bottoms, ${rotation.stats.dresses} dresses.
        </div>
        <button class="btn btn-primary" data-close>OK</button>
      `);
      return;
    }

    const fb = window.outfitFeedback;
    const summary = (fb && capsule.id != null) ? fb.summary(capsule.id) : { liked: 0, disliked: 0, pinned: 0, badPairCount: 0 };

    openModal(`
      <h2 style="margin: 0 0 6px; font-family: 'Playfair Display', serif;">
        ✨ 30-Day Rotation — ${escapeHtml(capsule.name || 'Capsule')}
      </h2>
      <div class="rotation-summary">
        <span>${rotation.stats.tops} tops · ${rotation.stats.bottoms} bottoms · ${rotation.stats.dresses} dresses · ${rotation.stats.shoes} shoes</span>
        <span class="rotation-train-stats">
          👍 ${summary.liked} · 👎 ${summary.disliked} · 🔒 ${summary.pinned} · ⚠ ${summary.badPairCount} bad pair${summary.badPairCount === 1 ? '' : 's'}
        </span>
      </div>
      <div class="rotation-view-toggle">
        <button data-view-mode="grid" class="${_rotationViewMode === 'grid' ? 'active' : ''}">📋 Grid</button>
        <button data-view-mode="flatlay" class="${_rotationViewMode === 'flatlay' ? 'active' : ''}">👗 Flat-lay</button>
      </div>
      <div class="muted" style="font-size: 11px; margin-bottom: 14px;">
        Tap 👍 to keep an outfit, 👎 to never see it again, 🔒 to lock it to that day. The system learns from each tap.
      </div>

      <div class="rotation-grid" id="rotation-grid">
        ${rotation.days.map(d => rotationDayHtml(d)).join('')}
      </div>

      ${rotation.pajamaDays.length > 0 ? `
        <h3 style="font-family: 'Playfair Display', serif; margin: 20px 0 10px;">🌙 30-Day Pajama Rotation</h3>
        <div class="rotation-pajama-strip">
          ${rotation.pajamaDays.map(p => {
            const url = p.item.thumb ? blobToUrl(p.item.thumb) : (p.item.photo ? blobToUrl(p.item.photo) : '');
            return `
              <div class="rotation-pajama-card" title="${escapeHtml(p.item.name || p.item.subtype || '')}">
                <div class="rotation-pajama-day">D${p.day}</div>
                <div class="rotation-pajama-thumb" style="background-image:url('${url}')"></div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <div class="row" style="gap: 8px; margin-top: 16px;">
        <button class="btn" data-close>Close</button>
        <button class="btn btn-ghost" id="rotation-reset">Reset training</button>
        <div class="spacer" style="flex: 1;"></div>
        <button class="btn btn-primary" id="rotation-regenerate">Regenerate (shuffle)</button>
      </div>
    `);

    wireRotationFeedback();
  }

  function wireRotationFeedback() {
    const ctx = _lastRotationContext;
    if (!ctx) return;
    const { capsule, itemMap, rotation } = ctx;
    const fb = window.outfitFeedback;
    if (!fb) return;

    document.querySelectorAll('[data-view-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.viewMode;
        if (mode === _rotationViewMode) return;
        _rotationViewMode = mode;
        try { localStorage.setItem('vc:rotationViewMode', mode); } catch (_) {}
        // Re-render the rotation modal with new mode
        closeModal();
        setTimeout(() => openRotationModal(capsule), 50);
      });
    });

    document.getElementById('rotation-regenerate')?.addEventListener('click', () => {
      const shuffled = JSON.parse(JSON.stringify(capsule));
      Object.keys(shuffled.slots || {}).forEach(k => {
        const arr = shuffled.slots[k];
        if (Array.isArray(arr) && arr.length > 1) {
          const offset = Math.floor(Math.random() * arr.length);
          shuffled.slots[k] = arr.slice(offset).concat(arr.slice(0, offset));
        }
      });
      // preserve id so feedback still applies to the same capsule
      shuffled.id = capsule.id;
      closeModal();
      setTimeout(() => openRotationModal(shuffled), 100);
    });

    document.getElementById('rotation-reset')?.addEventListener('click', () => {
      const choice = prompt(
        'Reset training data?\n\n' +
        'Type "capsule" to clear just this capsule\'s training,\n' +
        'or "all" to clear global + this capsule.\n\n' +
        '(Cancel to keep everything)'
      );
      if (!choice) return;
      if (choice.toLowerCase() === 'all') {
        fb.reset('all', capsule.id);
        showToast('All training reset');
      } else if (choice.toLowerCase() === 'capsule') {
        fb.reset('capsule', capsule.id);
        showToast('Capsule training reset');
      } else {
        return;
      }
      closeModal();
      setTimeout(() => openRotationModal(capsule), 100);
    });

    document.querySelectorAll('[data-day-like]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const day = Number(btn.dataset.dayLike);
        const dayObj = rotation.days.find(d => d.day === day);
        if (!dayObj) return;
        const items = dayObj.items.map(x => x.item);
        fb.like(capsule.id, items);
        showToast('Liked — system will favor this');
        refreshSummary();
        btn.classList.add('feedback-active-like');
      });
    });

    document.querySelectorAll('[data-day-dislike]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const day = Number(btn.dataset.dayDislike);
        const dayObj = rotation.days.find(d => d.day === day);
        if (!dayObj) return;
        const items = dayObj.items.map(x => x.item);
        fb.dislike(capsule.id, items);
        // Replace this day's outfit immediately
        replaceDay(day);
        showToast('Skipped — won\'t see this combination again');
        refreshSummary();
      });
    });

    document.querySelectorAll('[data-day-pin]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const day = Number(btn.dataset.dayPin);
        const dayObj = rotation.days.find(d => d.day === day);
        if (!dayObj) return;
        const items = dayObj.items.map(x => x.item);
        const existing = fb.getPinned(capsule.id, day);
        if (existing) {
          fb.unpinDay(capsule.id, day);
          btn.textContent = '🔒';
          btn.classList.remove('feedback-active-pin');
          showToast(`Day ${day} unpinned`);
        } else {
          fb.pinDay(capsule.id, day, items);
          btn.textContent = '🔓';
          btn.classList.add('feedback-active-pin');
          showToast(`Day ${day} pinned`);
        }
        refreshSummary();
      });
    });

    function refreshSummary() {
      const s = fb.summary(capsule.id);
      const el = document.querySelector('.rotation-train-stats');
      if (el) {
        el.innerHTML = `👍 ${s.liked} · 👎 ${s.disliked} · 🔒 ${s.pinned} · ⚠ ${s.badPairCount} bad pair${s.badPairCount === 1 ? '' : 's'}`;
      }
    }

    function replaceDay(dayNum) {
      // Re-run buildOutfit attempts for that single day; mutate rotation array
      // and re-render its card.
      const items = (capsule.slots || {});
      const slot = (k) => (items[k] || []).map(id => itemMap.get(id)).filter(Boolean);
      const tops = [...slot('tops_long'), ...slot('tops_short'), ...slot('tops_tank'), ...slot('tops')];
      const bottoms = slot('bottoms');
      const dresses = slot('dresses');
      const outerwear = slot('outerwear');
      const shoes = slot('shoes');
      const accessories = slot('accessories');
      function build(seedI) {
        const outfit = { day: dayNum, items: [] };
        const useDress = dresses.length > 0 && seedI % 4 === 3;
        const useOuter = outerwear.length > 0 && (seedI % 3 === 0 || seedI % 5 === 2);
        const useAcc = accessories.length > 0;
        if (useDress) {
          outfit.items.push({ role: 'Dress', item: dresses[seedI % dresses.length] });
        } else {
          if (tops.length > 0) outfit.items.push({ role: 'Top', item: tops[seedI % tops.length] });
          if (bottoms.length > 0) outfit.items.push({ role: 'Bottom', item: bottoms[(seedI * 3) % bottoms.length] });
        }
        if (useOuter) outfit.items.push({ role: 'Layer', item: outerwear[(Math.floor(seedI / 3)) % outerwear.length] });
        if (shoes.length > 0) outfit.items.push({ role: 'Shoes', item: shoes[(seedI * 7) % shoes.length] });
        if (useAcc) outfit.items.push({ role: 'Accent', item: accessories[seedI % accessories.length] });
        return outfit;
      }
      const baseI = dayNum - 1;
      let chosen = null;
      for (let k = 1; k < 20; k++) {
        const cand = build(baseI + k * 13);
        const candItems = cand.items.map(x => x.item);
        if (!fb.isDisliked(capsule.id, candItems) && !fb.hasBadPair(capsule.id, candItems, 2)) {
          chosen = cand;
          break;
        }
      }
      if (!chosen) chosen = build(baseI);
      const idx = rotation.days.findIndex(d => d.day === dayNum);
      if (idx >= 0) {
        rotation.days[idx] = chosen;
        // Replace just this card in the DOM
        const grid = document.getElementById('rotation-grid');
        const cards = grid?.querySelectorAll('.rotation-day-card');
        if (cards && cards[idx]) {
          const tmp = document.createElement('div');
          tmp.innerHTML = rotationDayHtml(chosen);
          cards[idx].replaceWith(tmp.firstElementChild);
          // Re-wire just this card's buttons
          wireRotationFeedback();
        }
      }
    }
  }

function rotationDayHtml(day) {
    const fb = window.outfitFeedback;
    const ctx = _lastRotationContext;
    const isPinned = ctx && fb && fb.getPinned(ctx.capsule.id, day.day);
    const isLiked = day.liked;

    let bodyHtml;
    if (_rotationViewMode === 'flatlay' && typeof window.flatlayHtmlForOutfit === 'function') {
      bodyHtml = window.flatlayHtmlForOutfit(day.items);
    } else {
      bodyHtml = `
        <div class="rotation-day-items">
          ${day.items.map(({ role, item }) => {
            const url = item.thumb ? blobToUrl(item.thumb) : (item.photo ? blobToUrl(item.photo) : '');
            return `
              <div class="rotation-day-item" title="${escapeHtml((item.name || item.subtype || '') + ' · ' + role)}">
                <div class="rotation-day-thumb" style="background-image:url('${url}')"></div>
                <div class="rotation-day-role muted">${escapeHtml(role)}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <div class="rotation-day-card ${isLiked ? 'is-liked' : ''} ${isPinned ? 'is-pinned' : ''} mode-${_rotationViewMode}">
        <div class="rotation-day-num">Day ${day.day}${isPinned ? ' 🔒' : ''}${isLiked ? ' 👍' : ''}</div>
        ${bodyHtml}
        <div class="rotation-day-actions">
          <button class="rotation-fb-btn" data-day-like="${day.day}" title="Like this outfit">👍</button>
          <button class="rotation-fb-btn" data-day-dislike="${day.day}" title="Skip — never show again">👎</button>
          <button class="rotation-fb-btn ${isPinned ? 'feedback-active-pin' : ''}" data-day-pin="${day.day}" title="${isPinned ? 'Unpin' : 'Pin to this day'}">${isPinned ? '🔓' : '🔒'}</button>
        </div>
      </div>
    `;
  }

  window.renderCapsuleView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/capsule') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/returned-r1.js ===== */
// returned-r1.js — Returned & Sold items page at #/returned
//
// Shows every item tagged status === 'returned' OR status === 'sold' with a
// faded visual treatment. Items here aren't counted in the sidebar piece
// total or any analytics, but the record stays for accounting / Girl Math
// resale tracking.
//
// User can tap any tile to edit (e.g. flip status back to Keep if they
// changed their mind).

(function() {
  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    const all = await dbGetAllItems();
    const returned = all.filter(i => i.status === 'returned')
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const sold = all.filter(i => i.status === 'sold')
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const total = returned.length + sold.length;

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Returned &amp; Sold</h1>
          <div class="page-subtitle">${total} item${total === 1 ? '' : 's'} no longer in your closet · not counted in totals</div>
        </div>
        <a href="#/closet" class="btn">Back to closet</a>
      </div>

      ${total === 0 ? `
        <div class="empty">
          <div class="empty-title">Nothing returned or sold yet</div>
          <p>When you tag a piece's status as <strong>Returned</strong> or <strong>Sold / gone</strong> in the Edit modal, it'll move here. These items don't count in your sidebar piece total or any analytics, but the record stays for your accounting.</p>
        </div>
      ` : `
        ${sold.length > 0 ? `
          <h2 class="returned-section-title">Sold <span class="muted">${sold.length}</span></h2>
          <div class="returned-grid">
            ${sold.map(it => returnedCardHtml(it, 'sold')).join('')}
          </div>
        ` : ''}

        ${returned.length > 0 ? `
          <h2 class="returned-section-title">Returned <span class="muted">${returned.length}</span></h2>
          <div class="returned-grid">
            ${returned.map(it => returnedCardHtml(it, 'returned')).join('')}
          </div>
        ` : ''}
      `}
    `;
    main.querySelectorAll('[data-rid]').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.dataset.rid);
        if (typeof openItemDetail === 'function') openItemDetail(id);
      });
    });
  }

  function returnedCardHtml(it, kind) {
    const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
    const name = it.name || it.subtype || labelForGarmentType(it.garmentType) || 'Untitled';
    const meta = [it.brand, it.color, labelForGarmentType(it.garmentType)].filter(Boolean).join(' · ');
    const date = it.purchaseDate ? `Purchased ${it.purchaseDate}` : '';
    const badgeText = kind === 'sold' ? 'SOLD' : 'RETURNED';
    return `
      <div class="returned-card returned-card--${kind}" data-rid="${it.id}">
        <div class="returned-thumb" style="background-image:url('${url}')"></div>
        <div class="returned-status-badge">${badgeText}</div>
        <div class="returned-info">
          <div class="returned-name">${escapeHtml(name)}</div>
          <div class="returned-meta">${escapeHtml(meta)}</div>
          ${date ? `<div class="returned-date">${escapeHtml(date)}</div>` : ''}
          ${it.purchasePrice ? `<div class="returned-price">$${Number(it.purchasePrice).toFixed(2)}</div>` : ''}
        </div>
      </div>
    `;
  }

  window.renderReturnedView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/returned') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/daily-r1.js ===== */
// daily-r1.js — Daily outfit logger at #/daily
// Upload one photo per day, optional caption, then check off which closet
// pieces you wore. Saved to dailyOutfits IndexedDB store.
//
// v37+: when a photo is uploaded, photo-suggest-r1.js runs heuristic color
// matching against the closet and surfaces top suggestions as quick-tap
// chips above the manual picker.

(function() {
  let editingId = null;
  let pendingPhoto = null;        // Blob (resized)
  let pendingPhotoUrl = null;     // object URL for preview
  let selectedItemIds = new Set();
  let photoSuggestions = [];      // [item, ...] from suggestItemsFromPhoto
  let photoSuggestLoading = false;

  function todayISO() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  function fmtDay(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso + 'T00:00');
      return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    } catch (_) { return iso; }
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    editingId = null;
    pendingPhoto = null;
    pendingPhotoUrl = null;
    selectedItemIds = new Set();
    photoSuggestions = [];
    photoSuggestLoading = false;

    const all = await dbGetAllDaily();
    all.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>What I Wore Today</h1>
          <div class="page-subtitle">${all.length} day${all.length === 1 ? '' : 's'} logged · build your wear history</div>
        </div>
        <button class="btn btn-primary" id="dailyNew">+ Log today</button>
      </div>

      <div class="card" style="padding: 16px 18px; margin-bottom: 16px;">
        <div class="muted" style="font-size: 13px; line-height: 1.55;">
          Upload a quick photo, then tap the closet pieces you wore. Looking
          back through your wear log shows your real style patterns over
          months and years — and feeds the slideshow on the next tab.
        </div>
      </div>

      ${all.length === 0 ? `
        <div class="empty">
          <div class="empty-title">No daily logs yet</div>
          <p>Snap a quick photo (or paste one), pick the items you wore, and save. Do this once a day for a beautiful wear-log.</p>
          <button class="btn btn-primary" id="dailyNewEmpty">+ Log today</button>
        </div>
      ` : `
        <div class="daily-grid">
          ${all.map(d => dailyCardHtml(d)).join('')}
        </div>
      `}
    `;

    document.getElementById('dailyNew')?.addEventListener('click', () => openEditor(null));
    document.getElementById('dailyNewEmpty')?.addEventListener('click', () => openEditor(null));
    main.querySelectorAll('[data-edit-daily]').forEach(b => {
      b.addEventListener('click', () => openEditor(Number(b.dataset.editDaily)));
    });
    main.querySelectorAll('[data-delete-daily]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.deleteDaily);
        if (!confirm('Delete this day from your log? Your closet items are unaffected.')) return;
        await dbDeleteDaily(id);
        render(main);
      });
    });
  }

  function dailyCardHtml(d) {
    const url = d.photo ? blobToUrl(d.photo) : '';
    const itemCount = (d.itemIds || []).length;
    return `
      <div class="daily-card" data-edit-daily="${d.id}">
        <div class="daily-photo" style="background-image: url('${url}');"></div>
        <div class="daily-meta">
          <div class="daily-date">${escapeHtml(fmtDay(d.date))}</div>
          ${d.caption ? `<div class="daily-caption">${escapeHtml(d.caption)}</div>` : ''}
          <div class="daily-piece-count">${itemCount} piece${itemCount === 1 ? '' : 's'} tagged</div>
        </div>
        <button class="daily-delete" data-delete-daily="${d.id}" title="Delete">×</button>
      </div>
    `;
  }

  async function openEditor(id) {
    editingId = id;
    pendingPhoto = null;
    pendingPhotoUrl = null;
    selectedItemIds = new Set();
    photoSuggestions = [];
    photoSuggestLoading = false;
    let existing = null;
    if (id) {
      const all = await dbGetAllDaily();
      existing = all.find(x => x.id === id);
      if (existing) {
        if (existing.photo) {
          pendingPhoto = existing.photo;
          pendingPhotoUrl = blobToUrl(existing.photo);
        }
        selectedItemIds = new Set(existing.itemIds || []);
      }
    }
    renderEditor(existing);
    // If we loaded an existing day with a photo, run suggestions in the
    // background. Editor re-renders on completion.
    if (pendingPhoto && typeof suggestItemsFromPhoto === 'function') {
      runSuggestionsForCurrentPhoto(existing);
    }
  }

  async function runSuggestionsForCurrentPhoto(existing) {
    if (!pendingPhoto || typeof suggestItemsFromPhoto !== 'function') return;
    photoSuggestLoading = true;
    photoSuggestions = [];
    try {
      const itemsRaw = await dbGetAllItems();
      const items = (typeof activeItems === 'function') ? activeItems(itemsRaw) : itemsRaw;
      const suggested = await suggestItemsFromPhoto(pendingPhoto, items, { topN: 15 });
      photoSuggestions = suggested || [];
    } catch (e) {
      console.warn('photo-suggest failed:', e);
      photoSuggestions = [];
    } finally {
      photoSuggestLoading = false;
    }
    // Re-render so the suggestion strip appears.
    renderEditor(existing);
  }

  function suggestionsHtml() {
    if (!pendingPhoto && !photoSuggestLoading) return '';
    if (photoSuggestLoading) {
      return `
        <div class="card daily-suggest-card" style="padding: 14px 18px; margin: 14px 0;">
          <div class="daily-suggest-head">
            <span class="daily-suggest-title">Suggested from photo</span>
            <span class="muted" style="font-size:11px;">analyzing colors…</span>
          </div>
        </div>
      `;
    }
    if (!photoSuggestions.length) {
      return `
        <div class="card daily-suggest-card" style="padding: 14px 18px; margin: 14px 0;">
          <div class="daily-suggest-head">
            <span class="daily-suggest-title">Suggested from photo</span>
            <span class="muted" style="font-size:11px;">No close color matches — tap pieces below.</span>
          </div>
        </div>
      `;
    }
    const chips = photoSuggestions.map(it => {
      const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
      const sel = selectedItemIds.has(it.id);
      const meta = [it.brand, it.color].filter(Boolean).join(' · ');
      return `
        <button type="button" class="daily-suggest-chip ${sel ? 'selected' : ''}" data-suggest-id="${it.id}" title="${escapeHtml(meta)}">
          <div class="daily-suggest-thumb" style="background-image:url('${url}')"></div>
          <div class="daily-suggest-text">
            <div class="daily-suggest-name">${escapeHtml(it.name || it.subtype || '—')}</div>
            <div class="daily-suggest-meta muted">${escapeHtml(meta)}</div>
          </div>
          ${sel ? '<div class="daily-suggest-check">✓</div>' : ''}
        </button>
      `;
    }).join('');
    return `
      <div class="card daily-suggest-card" style="padding: 14px 18px; margin: 14px 0;">
        <div class="daily-suggest-head">
          <span class="daily-suggest-title">Suggested from photo</span>
          <span class="muted" style="font-size:11px;">${photoSuggestions.length} match${photoSuggestions.length === 1 ? '' : 'es'} by color · tap to add</span>
        </div>
        <div class="daily-suggest-chips">${chips}</div>
      </div>
    `;
  }

  async function renderEditor(existing) {
    const main = document.getElementById('main');
    const itemsRaw = await dbGetAllItems();
    const items = (typeof activeItems === 'function') ? activeItems(itemsRaw) : itemsRaw;
    const date = existing?.date || todayISO();
    const caption = existing?.caption || '';

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>${editingId ? 'Edit day' : 'New day'}</h1>
          <div class="page-subtitle">${selectedItemIds.size} piece${selectedItemIds.size === 1 ? '' : 's'} tagged</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" id="dailyBack">Back</button>
          <button class="btn btn-primary" id="dailySave">${editingId ? 'Save changes' : 'Save day'}</button>
        </div>
      </div>

      <div class="card" style="padding: 16px 18px; margin-bottom: 16px;">
        <div class="row" style="gap: 16px; align-items: flex-start; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 220px;">
            <div class="field">
              <label class="field-label" for="d_date">Date</label>
              <input class="input" type="date" id="d_date" value="${escapeHtml(date)}" />
            </div>
            <div class="field" style="margin-top: 10px;">
              <label class="field-label" for="d_caption">Caption (optional)</label>
              <input class="input" type="text" id="d_caption" placeholder="e.g. Brunch with Mom" value="${escapeHtml(caption)}" />
            </div>
          </div>
          <div style="flex: 1; min-width: 220px;">
            <div class="daily-photo-pick" id="dailyPhotoPick" style="background-image: url('${pendingPhotoUrl || ''}');">
              ${pendingPhotoUrl ? '' : '<span>Click to upload a photo</span>'}
              <input type="file" id="d_photo" accept="image/*" hidden />
            </div>
            ${pendingPhotoUrl ? '<button class="btn btn-ghost btn-sm" id="d_photo_clear" style="margin-top: 6px;">Remove photo</button>' : ''}
            <div class="muted" style="font-size:11px; margin-top:6px;">Upload a photo and we'll suggest matching pieces from your closet.</div>
          </div>
        </div>
      </div>

      ${suggestionsHtml()}

      <h2 style="font-family: 'Playfair Display', serif; margin: 16px 0 10px;">Tag what you wore</h2>
      <div class="muted" style="font-size: 12px; margin-bottom: 12px;">${items.length} active pieces in your closet · click to toggle</div>
      <div class="daily-pick-grid">
        ${items.map(it => {
          const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
          const sel = selectedItemIds.has(it.id);
          return `
            <div class="daily-pick-card ${sel ? 'selected' : ''}" data-pick-id="${it.id}">
              <div class="daily-pick-thumb" style="background-image:url('${url}')"></div>
              <div class="daily-pick-name">${escapeHtml(it.name || it.subtype || '—')}</div>
              <div class="daily-pick-meta muted">${escapeHtml([it.brand, it.color].filter(Boolean).join(' · '))}</div>
              ${sel ? '<div class="daily-pick-check">✓</div>' : ''}
            </div>
          `;
        }).join('') || '<div class="muted">No active pieces in your closet yet.</div>'}
      </div>
    `;

    document.getElementById('dailyBack').addEventListener('click', () => render(main));
    document.getElementById('dailySave').addEventListener('click', () => saveDaily());

    const photoPick = document.getElementById('dailyPhotoPick');
    const photoInput = document.getElementById('d_photo');
    photoPick.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        if (typeof resizeImage === 'function') {
          const resized = await resizeImage(f, 1200);
          pendingPhoto = resized;
        } else {
          pendingPhoto = f;
        }
        if (pendingPhotoUrl) URL.revokeObjectURL(pendingPhotoUrl);
        pendingPhotoUrl = blobToUrl(pendingPhoto);
        photoSuggestions = [];
        photoSuggestLoading = true;
        renderEditor(existing);
        // Run suggestions in background; renderEditor will be called again
        // when they're ready.
        runSuggestionsForCurrentPhoto(existing);
      } catch (err) {
        alert('Could not load that image: ' + err.message);
      }
    });
    document.getElementById('d_photo_clear')?.addEventListener('click', () => {
      pendingPhoto = null;
      if (pendingPhotoUrl) URL.revokeObjectURL(pendingPhotoUrl);
      pendingPhotoUrl = null;
      photoSuggestions = [];
      photoSuggestLoading = false;
      renderEditor(existing);
    });

    main.querySelectorAll('[data-pick-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.dataset.pickId);
        toggleItem(id);
        // Update both the picker tile and any matching suggestion chip
        card.classList.toggle('selected', selectedItemIds.has(id));
        const check = card.querySelector('.daily-pick-check');
        if (selectedItemIds.has(id) && !check) {
          card.insertAdjacentHTML('beforeend', '<div class="daily-pick-check">✓</div>');
        } else if (!selectedItemIds.has(id) && check) {
          check.remove();
        }
        const suggestChip = main.querySelector(`[data-suggest-id="${id}"]`);
        if (suggestChip) {
          suggestChip.classList.toggle('selected', selectedItemIds.has(id));
          const sCheck = suggestChip.querySelector('.daily-suggest-check');
          if (selectedItemIds.has(id) && !sCheck) {
            suggestChip.insertAdjacentHTML('beforeend', '<div class="daily-suggest-check">✓</div>');
          } else if (!selectedItemIds.has(id) && sCheck) {
            sCheck.remove();
          }
        }
        updateCountSubtitle();
      });
    });

    main.querySelectorAll('[data-suggest-id]').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = Number(chip.dataset.suggestId);
        toggleItem(id);
        chip.classList.toggle('selected', selectedItemIds.has(id));
        const sCheck = chip.querySelector('.daily-suggest-check');
        if (selectedItemIds.has(id) && !sCheck) {
          chip.insertAdjacentHTML('beforeend', '<div class="daily-suggest-check">✓</div>');
        } else if (!selectedItemIds.has(id) && sCheck) {
          sCheck.remove();
        }
        // Sync the picker card too
        const pickerCard = main.querySelector(`[data-pick-id="${id}"]`);
        if (pickerCard) {
          pickerCard.classList.toggle('selected', selectedItemIds.has(id));
          const pCheck = pickerCard.querySelector('.daily-pick-check');
          if (selectedItemIds.has(id) && !pCheck) {
            pickerCard.insertAdjacentHTML('beforeend', '<div class="daily-pick-check">✓</div>');
          } else if (!selectedItemIds.has(id) && pCheck) {
            pCheck.remove();
          }
        }
        updateCountSubtitle();
      });
    });
  }

  function toggleItem(id) {
    if (selectedItemIds.has(id)) selectedItemIds.delete(id);
    else selectedItemIds.add(id);
  }

  function updateCountSubtitle() {
    const sub = document.querySelector('.page-subtitle');
    if (sub) sub.textContent = `${selectedItemIds.size} piece${selectedItemIds.size === 1 ? '' : 's'} tagged`;
  }

  async function saveDaily() {
    const date = document.getElementById('d_date').value;
    const caption = document.getElementById('d_caption').value.trim();
    if (!date) { alert('Pick a date for this entry.'); return; }
    const record = {
      date,
      caption,
      photo: pendingPhoto || null,
      itemIds: [...selectedItemIds],
    };
    try {
      if (editingId) {
        await dbUpdateDaily(editingId, record);
        showToast('Day updated');
      } else {
        await dbAddDaily(record);
        showToast('Day logged');
      }
      // Also append a wear entry to each tagged item's wearLog so other
      // views (Insights, slideshow, etc.) reflect this naturally.
      for (const id of selectedItemIds) {
        try {
          const it = await dbGetItem(id);
          if (!it) continue;
          const wearLog = Array.isArray(it.wearLog) ? it.wearLog.slice() : [];
          if (!wearLog.includes(date)) wearLog.push(date);
          await dbUpdateItem(id, { wearLog });
        } catch (_) {}
      }
      render(document.getElementById('main'));
    } catch (e) {
      alert('Save failed: ' + (e?.message || e));
    }
  }

  window.renderDailyView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/daily') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/slideshow-r1.js ===== */
// slideshow-r1.js — Monthly wear log slideshow at #/slideshow

(function() {
  // Two views: 'photo' (selfie/photo cover) and 'items' (grid of pieces worn).
  // Persists per-device. Defaults to 'photo' for back-compat with existing logs.
  function getView() {
    try {
      const v = localStorage.getItem('vc:wearlogView');
      return v === 'items' ? 'items' : 'photo';
    } catch (_) { return 'photo'; }
  }
  function setView(v) {
    try { localStorage.setItem('vc:wearlogView', v); } catch (_) {}
  }

  // Coerce any date-ish value to YYYY-MM-DD or empty.
  function toIsoDate(d) {
    if (!d) return '';
    if (d instanceof Date) {
      if (isNaN(d)) return '';
      return d.toISOString().slice(0, 10);
    }
    if (typeof d === 'string') {
      if (/^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
      const parsed = new Date(d);
      if (!isNaN(parsed)) return parsed.toISOString().slice(0, 10);
      return '';
    }
    if (typeof d === 'number') {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toISOString().slice(0, 10);
    }
    return '';
  }
  function ymKey(iso) {
    const s = toIsoDate(iso);
    if (!s || s.length < 7) return '';
    return s.slice(0, 7);
  }
  function monthLabel(ym) {
    if (!ym || ym.length !== 7) return ym || 'Undated';
    const [y, m] = ym.split('-');
    const yi = Number(y), mi = Number(m);
    if (!Number.isFinite(yi) || !Number.isFinite(mi)) return 'Undated';
    const d = new Date(yi, mi - 1, 1);
    if (isNaN(d)) return 'Undated';
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }
  function fmtDay(iso) {
    const s = toIsoDate(iso);
    if (!s) return '';
    const d = new Date(s + 'T00:00');
    if (isNaN(d)) return s;
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;

    const [dailyAll, itemsAll] = await Promise.all([
      dbGetAllDaily(),
      dbGetAllItems(),
    ]);
    const itemMap = new Map(itemsAll.map(i => [i.id, i]));

    const days = new Map();
    for (const d of dailyAll) {
      const key = toIsoDate(d.date);
      if (!key) continue;
      const entry = days.get(key) || { date: key, photo: null, caption: '', itemIds: new Set(), source: 'daily' };
      if (d.photo) entry.photo = d.photo;
      if (d.caption) entry.caption = d.caption;
      (d.itemIds || []).forEach(id => entry.itemIds.add(id));
      days.set(key, entry);
    }
    for (const it of itemsAll) {
      for (const rawDate of (it.wearLog || [])) {
        const key = toIsoDate(rawDate);
        if (!key) continue;
        const entry = days.get(key) || { date: key, photo: null, caption: '', itemIds: new Set(), source: 'wearLog' };
        entry.itemIds.add(it.id);
        days.set(key, entry);
      }
    }
    const dayList = [...days.values()].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    const months = new Map();
    for (const d of dayList) {
      const k = ymKey(d.date);
      if (!months.has(k)) months.set(k, []);
      months.get(k).push(d);
    }
    const monthList = [...months.entries()].sort((a, b) => String(b[0] || '').localeCompare(String(a[0] || '')));

    const view = getView();

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Wear Log</h1>
          <div class="page-subtitle">${dayList.length} day${dayList.length === 1 ? '' : 's'} on record · grouped by month</div>
        </div>
        <div style="display:flex; gap:10px; align-items:center;">
          <div class="view-toggle" role="tablist" aria-label="View mode">
            <button type="button" class="view-toggle-btn ${view === 'photo' ? 'active' : ''}" data-view="photo">Photos</button>
            <button type="button" class="view-toggle-btn ${view === 'items' ? 'active' : ''}" data-view="items">Items</button>
          </div>
          <a class="btn btn-primary" href="#/daily">+ Log a day</a>
        </div>
      </div>

      ${monthList.length === 0 ? `
        <div class="empty">
          <div class="empty-title">No wear history yet</div>
          <p>Log a day on the Daily tab to start building your slideshow.</p>
          <a class="btn btn-primary" href="#/daily">+ Log today</a>
        </div>
      ` : monthList.map(([ym, list]) => `
        <section class="slideshow-month">
          <h2 class="slideshow-month-title">${escapeHtml(monthLabel(ym))} <span class="muted" style="font-size: 12px; margin-left: 8px;">${list.length} day${list.length === 1 ? '' : 's'}</span></h2>
          <div class="slideshow-row">
            ${list.map(d => view === 'items' ? itemsCardHtml(d, itemMap) : slideCardHtml(d, itemMap)).join('')}
          </div>
        </section>
      `).join('')}
    `;

    // View toggle
    main.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.view;
        if (v === getView()) return;
        setView(v);
        render(main);
      });
    });

    main.querySelectorAll('[data-slide-day]').forEach(card => {
      card.addEventListener('click', () => {
        const date = card.dataset.slideDay;
        const day = days.get(date);
        if (day) openDayDetail(day, itemMap);
      });
    });
  }

  // Photo-first card (existing behavior — collage fallback when no day-photo)
  function slideCardHtml(day, itemMap) {
    const url = day.photo ? blobToUrl(day.photo) : '';
    const ids = [...day.itemIds];
    const previewItems = ids.slice(0, 4).map(id => itemMap.get(id)).filter(Boolean);
    const dateLabel = fmtDay(day.date) || 'Undated';

    let coverHtml;
    if (url) {
      coverHtml = `<div class="slide-cover" style="background-image: url('${url}');"></div>`;
    } else if (previewItems.length > 0) {
      const cells = previewItems.map(it => {
        const u = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
        return `<div class="slide-cover-cell" style="background-image:url('${u}')"></div>`;
      }).join('');
      const moreBadge = ids.length > 4 ? `<div class="slide-cover-more">+${ids.length - 4}</div>` : '';
      coverHtml = `<div class="slide-cover slide-cover-collage slide-cover-${previewItems.length}">${cells}${moreBadge}</div>`;
    } else {
      coverHtml = `<div class="slide-cover slide-cover-empty"><div class="slide-no-photo">No items</div></div>`;
    }

    return `
      <div class="slide-card" data-slide-day="${escapeHtml(day.date)}">
        ${coverHtml}
        <div class="slide-info">
          <div class="slide-date">${escapeHtml(dateLabel)}</div>
          ${day.caption ? `<div class="slide-caption">${escapeHtml(day.caption)}</div>` : ''}
          <div class="slide-piece-count muted">${ids.length} piece${ids.length === 1 ? '' : 's'}</div>
        </div>
      </div>
    `;
  }

  // Items-first card — same compact slide-card layout as Photos view, but
  // the cover is ALWAYS the 2x2 item-thumb collage (never the selfie).
  // This way every day looks identical regardless of whether a selfie was
  // uploaded — perfect for "not feeling cute" days.
  function itemsCardHtml(day, itemMap) {
    const ids = [...day.itemIds];
    const previewItems = ids.slice(0, 4).map(id => itemMap.get(id)).filter(Boolean);
    const dateLabel = fmtDay(day.date) || 'Undated';

    let coverHtml;
    if (previewItems.length > 0) {
      const cells = previewItems.map(it => {
        const u = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
        return `<div class="slide-cover-cell" style="background-image:url('${u}')"></div>`;
      }).join('');
      const moreBadge = ids.length > 4 ? `<div class="slide-cover-more">+${ids.length - 4}</div>` : '';
      coverHtml = `<div class="slide-cover slide-cover-collage slide-cover-${previewItems.length}">${cells}${moreBadge}</div>`;
    } else {
      coverHtml = `<div class="slide-cover slide-cover-empty"><div class="slide-no-photo">No items</div></div>`;
    }

    return `
      <div class="slide-card" data-slide-day="${escapeHtml(day.date)}">
        ${coverHtml}
        <div class="slide-info">
          <div class="slide-date">${escapeHtml(dateLabel)}</div>
          ${day.caption ? `<div class="slide-caption">${escapeHtml(day.caption)}</div>` : ''}
          <div class="slide-piece-count muted">${ids.length} piece${ids.length === 1 ? '' : 's'}</div>
        </div>
      </div>
    `;
  }

  function openDayDetail(day, itemMap) {
    if (typeof openModal !== 'function') return;
    const ids = [...day.itemIds];
    const items = ids.map(id => itemMap.get(id)).filter(Boolean);
    const url = day.photo ? blobToUrl(day.photo) : '';
    const dateLabel = fmtDay(day.date) || 'Undated';
    const itemRows = items.map(it => {
      const u = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
      const meta = [it.brand, it.color].filter(Boolean).join(' · ');
      return `
        <div class="slide-item-row">
          <div class="slide-item-thumb" style="background-image:url('${u}')"></div>
          <div class="slide-item-info">
            <div class="slide-item-name">${escapeHtml(it.name || it.subtype || 'Untitled')}</div>
            <div class="slide-item-meta muted">${escapeHtml(meta)}</div>
          </div>
        </div>
      `;
    }).join('') || '<div class="muted">No pieces tagged for this day.</div>';
    openModal(`
      <div class="slide-detail">
        ${url ? `<div class="slide-detail-photo" style="background-image: url('${url}');"></div>` : ''}
        <div class="slide-detail-meta">
          <h2 style="margin: 0 0 4px;">${escapeHtml(dateLabel)}</h2>
          ${day.caption ? `<div class="muted" style="margin-bottom: 12px;">${escapeHtml(day.caption)}</div>` : ''}
          <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted); margin: 12px 0 8px;">${items.length} piece${items.length === 1 ? '' : 's'} worn</div>
          <div class="slide-item-list">${itemRows}</div>
        </div>
      </div>
    `);
  }

  window.renderSlideshowView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/slideshow') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/notes-r1.js ===== */
// notes-r1.js — Personal updates / features-to-add board at #/notes
// A simple kanban-ish list: Idea → In progress → Done. User adds, edits,
// status-toggles, and deletes notes. Persists to userNotes IndexedDB store.

(function() {
  const STATUSES = [
    { id: 'idea',     label: 'Ideas' },
    { id: 'in_progress', label: 'In progress' },
    { id: 'done',     label: 'Done' },
  ];

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    const all = await dbGetAllNotes();
    all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const byStatus = Object.fromEntries(STATUSES.map(s => [s.id, []]));
    for (const n of all) {
      const s = byStatus[n.status] ? n.status : 'idea';
      byStatus[s].push(n);
    }

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>My Updates &amp; Wishlist</h1>
          <div class="page-subtitle">${all.length} note${all.length === 1 ? '' : 's'} · personal feature roadmap</div>
        </div>
      </div>

      <div class="card" style="padding: 14px 16px; margin-bottom: 18px;">
        <div class="row" style="gap: 8px; align-items: stretch;">
          <input class="input" id="noteInput" type="text" placeholder="What feature should we build next? Or what's bugging you?" style="flex: 1;" />
          <button class="btn btn-primary" id="noteAdd">Add</button>
        </div>
        <div class="muted" style="font-size: 11px; margin-top: 6px;">Tip: drag a note between columns by clicking its status badge.</div>
      </div>

      <div class="notes-board">
        ${STATUSES.map(s => `
          <section class="notes-col">
            <h2 class="notes-col-title">${escapeHtml(s.label)} <span class="muted" style="font-size: 11px; margin-left: 6px;">${byStatus[s.id].length}</span></h2>
            <div class="notes-list">
              ${byStatus[s.id].map(n => noteCardHtml(n)).join('') || '<div class="muted notes-empty">—</div>'}
            </div>
          </section>
        `).join('')}
      </div>
    `;

    document.getElementById('noteAdd').addEventListener('click', async () => {
      const inp = document.getElementById('noteInput');
      const text = (inp.value || '').trim();
      if (!text) return;
      await dbAddNote({ text, status: 'idea' });
      inp.value = '';
      render(main);
    });
    document.getElementById('noteInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('noteAdd').click();
    });

    main.querySelectorAll('[data-cycle-status]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.cycleStatus);
        const list = await dbGetAllNotes();
        const n = list.find(x => x.id === id);
        if (!n) return;
        const order = STATUSES.map(s => s.id);
        const idx = order.indexOf(n.status || 'idea');
        const next = order[(idx + 1) % order.length];
        await dbUpdateNote(id, { status: next });
        render(main);
      });
    });
    main.querySelectorAll('[data-edit-note]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.editNote);
        const list = await dbGetAllNotes();
        const n = list.find(x => x.id === id);
        if (!n) return;
        const next = prompt('Edit note:', n.text || '');
        if (next === null) return;
        const trimmed = next.trim();
        if (!trimmed) return;
        await dbUpdateNote(id, { text: trimmed });
        render(main);
      });
    });
    main.querySelectorAll('[data-delete-note]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.deleteNote);
        if (!confirm('Delete this note?')) return;
        await dbDeleteNote(id);
        render(main);
      });
    });
  }

  function noteCardHtml(n) {
    const status = n.status || 'idea';
    const statusLabel = (STATUSES.find(s => s.id === status) || STATUSES[0]).label;
    return `
      <div class="note-card status-${status}">
        <div class="note-text">${escapeHtml(n.text || '')}</div>
        <div class="note-actions">
          <button class="note-status-pill" data-cycle-status="${n.id}" title="Click to advance status">${escapeHtml(statusLabel)}</button>
          <button class="note-mini-btn" data-edit-note="${n.id}" title="Edit">✎</button>
          <button class="note-mini-btn" data-delete-note="${n.id}" title="Delete">×</button>
        </div>
      </div>
    `;
  }

  window.renderNotesView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/notes') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/receipts-r1.js ===== */
// receipts-r1.js — Invoices/receipts tab at #/receipts
// Lists every closet item that has a receipt attached and offers
// view/download links. Receipts are stored as Blobs on each item under
// item.receipt (image or PDF). Email forwarding is deferred until we move
// off pure browser storage.

(function() {
  function fmtBytes(n) {
    if (!n) return '';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function fileExtForBlob(blob) {
    if (!blob || !blob.type) return 'bin';
    if (blob.type === 'application/pdf') return 'pdf';
    if (blob.type.startsWith('image/')) return blob.type.split('/')[1] || 'img';
    return 'bin';
  }

  function safeName(s) {
    return String(s || 'receipt').replace(/[^a-z0-9-_]+/gi, '_').slice(0, 60);
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    const items = await dbGetAllItems();
    const withReceipt = items.filter(i => i.receipt);
    withReceipt.sort((a, b) => String(b.purchaseDate || '').localeCompare(String(a.purchaseDate || '')));

    const totalSpent = withReceipt.reduce((s, i) => s + (Number(i.purchasePrice) || 0), 0);

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Receipts &amp; Invoices</h1>
          <div class="page-subtitle">${withReceipt.length} receipt${withReceipt.length === 1 ? '' : 's'} on file${totalSpent ? ' · $' + totalSpent.toFixed(2) + ' documented' : ''}</div>
        </div>
        <a href="#/email-import" class="btn btn-primary">📧 Import from email</a>
      </div>

      <div class="card" style="padding: 16px 18px; margin-bottom: 18px;">
        <div style="font-size: 13px; line-height: 1.6;">
          Attach a receipt photo or PDF to any item from its detail page → Edit. Receipts live alongside the rest of your closet data — exported with your backup, never sent anywhere.
        </div>
        <div class="muted" style="font-size: 12px; margin-top: 8px;">
          <strong>Quick add from an order email:</strong> use the
          <a href="#/email-import" style="text-decoration: underline;">Email Importer</a>
          bookmarklet — open an order confirmation in Outlook or Gmail (browser version), click the bookmark, items land in your closet with price + date prefilled. No typing.
        </div>
      </div>

      ${withReceipt.length === 0 ? `
        <div class="empty">
          <div class="empty-title">No receipts yet</div>
          <p>Open any closet item, hit Edit, and use the "Attach receipt" field. PDF or image — both work.</p>
        </div>
      ` : `
        <div class="receipts-list">
          ${withReceipt.map(it => receiptRowHtml(it)).join('')}
        </div>
      `}
    `;

    main.querySelectorAll('[data-view-receipt]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.viewReceipt);
        const it = await dbGetItem(id);
        if (!it || !it.receipt) return;
        const url = URL.createObjectURL(it.receipt);
        window.open(url, '_blank');
        // Don't revoke immediately — let the new tab finish loading.
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      });
    });
    main.querySelectorAll('[data-download-receipt]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.downloadReceipt);
        const it = await dbGetItem(id);
        if (!it || !it.receipt) return;
        const ext = fileExtForBlob(it.receipt);
        const fname = `receipt_${safeName(it.brand)}_${safeName(it.name || it.subtype)}.${ext}`;
        const url = URL.createObjectURL(it.receipt);
        const a = document.createElement('a');
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      });
    });
    main.querySelectorAll('[data-open-item]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.openItem);
        if (typeof openItemDetail === 'function') openItemDetail(id);
      });
    });
  }

  function receiptRowHtml(it) {
    const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
    const r = it.receipt;
    const isPdf = r && r.type === 'application/pdf';
    const meta = [it.brand, it.color].filter(Boolean).join(' · ');
    const price = it.purchasePrice ? '$' + Number(it.purchasePrice).toFixed(2) : '—';
    const date = it.purchaseDate || '';
    return `
      <div class="receipt-row">
        <div class="receipt-thumb" style="background-image:url('${url}')"></div>
        <div class="receipt-info">
          <div class="receipt-name" data-open-item="${it.id}" style="cursor: pointer; text-decoration: underline;">${escapeHtml(it.name || it.subtype || 'Untitled')}</div>
          <div class="receipt-meta muted">${escapeHtml(meta)}${date ? ' · ' + escapeHtml(date) : ''}</div>
        </div>
        <div class="receipt-stats">
          <div class="receipt-price">${price}</div>
          <div class="receipt-fileinfo muted">${isPdf ? 'PDF' : 'Image'} · ${fmtBytes(r?.size)}</div>
        </div>
        <div class="receipt-actions">
          <button class="btn btn-sm" data-view-receipt="${it.id}">View</button>
          <button class="btn btn-sm" data-download-receipt="${it.id}">Download</button>
        </div>
      </div>
    `;
  }

  window.renderReceiptsView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/receipts') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/returns-due-r1.js ===== */
// returns-due-r1.js — Return-window alerts and dedicated /returns-due tab.
// Industry default: 30 days (per allreturnpolicies.com / brandsreturnpolicy.com,
// April 2026). User can override per item via Edit form.

(function() {
  const DEFAULT_RETURN_DAYS = 30;
  const ALERT_THRESHOLD_DAYS = 7;

  // Days between today and the item's return deadline. Positive = days left,
  // 0 = due today, negative = past deadline. null = no purchase date / no
  // window so we can't compute.
  function daysUntilReturnDeadline(item) {
    if (!item || !item.purchaseDate) return null;
    if (item.status === 'returned' || item.status === 'sold') return null;
    if (item.returnDecided) return null;
    const win = Number(item.returnWindowDays);
    const days = Number.isFinite(win) && win > 0 ? win : DEFAULT_RETURN_DAYS;
    const purchase = new Date(item.purchaseDate + 'T00:00');
    if (isNaN(purchase)) return null;
    const deadline = new Date(purchase);
    deadline.setDate(deadline.getDate() + days);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ms = deadline.getTime() - today.getTime();
    return Math.round(ms / (1000 * 60 * 60 * 24));
  }

  // Items currently in alert window — between (deadline-7) and deadline.
  function itemsInAlertWindow(items) {
    return (items || []).filter(it => {
      const d = daysUntilReturnDeadline(it);
      return d !== null && d >= 0 && d <= ALERT_THRESHOLD_DAYS;
    });
  }

  // Items past their return deadline (could still be returned at some
  // retailers but flag for awareness).
  function itemsPastDeadline(items) {
    return (items || []).filter(it => {
      const d = daysUntilReturnDeadline(it);
      return d !== null && d < 0 && d >= -7; // last week past, still relevant
    });
  }

  function fmtDeadline(item) {
    if (!item.purchaseDate) return '';
    const win = Number(item.returnWindowDays);
    const days = Number.isFinite(win) && win > 0 ? win : DEFAULT_RETURN_DAYS;
    const purchase = new Date(item.purchaseDate + 'T00:00');
    const deadline = new Date(purchase);
    deadline.setDate(deadline.getDate() + days);
    return deadline.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Banner rendered at the top of /closet — call from closet view code.
  function renderClosetReturnBanner(items) {
    const alertItems = itemsInAlertWindow(items);
    if (alertItems.length === 0) return '';
    const rows = alertItems
      .sort((a, b) => daysUntilReturnDeadline(a) - daysUntilReturnDeadline(b))
      .slice(0, 3)
      .map(it => {
        const d = daysUntilReturnDeadline(it);
        const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
        return `
          <a href="#/returns-due" class="rd-banner-row">
            <div class="rd-banner-thumb" style="background-image:url('${url}')"></div>
            <div class="rd-banner-info">
              <div class="rd-banner-name">${escapeHtml(it.name || it.subtype || 'Item')}</div>
              <div class="rd-banner-meta">${d === 0 ? 'Returns due TODAY' : (d === 1 ? '1 day left' : d + ' days left')} · ${escapeHtml(fmtDeadline(it))}</div>
            </div>
          </a>
        `;
      }).join('');
    const more = alertItems.length > 3 ? `<a href="#/returns-due" class="rd-banner-more">+${alertItems.length - 3} more →</a>` : '';
    return `
      <div class="rd-banner">
        <div class="rd-banner-head">
          <span class="rd-banner-icon">⏰</span>
          <strong>${alertItems.length} item${alertItems.length === 1 ? '' : 's'} approaching return deadline</strong>
          <a href="#/returns-due" class="rd-banner-link">See all →</a>
        </div>
        <div class="rd-banner-rows">${rows}${more}</div>
      </div>
    `;
  }

  // Sidebar badge — append a count pill to the Returns Due nav link.
  async function refreshSidebarBadge() {
    try {
      const items = await dbGetAllItems();
      const alertItems = itemsInAlertWindow(items);
      const link = document.querySelector('a[data-route="returns-due"]');
      if (!link) return;
      let badge = link.querySelector('.rd-nav-badge');
      if (alertItems.length > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'rd-nav-badge';
          link.appendChild(badge);
        }
        badge.textContent = alertItems.length;
      } else if (badge) {
        badge.remove();
      }
    } catch (_) {}
  }

  // Full /returns-due page
  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    const all = await dbGetAllItems();
    const due = itemsInAlertWindow(all)
      .sort((a, b) => daysUntilReturnDeadline(a) - daysUntilReturnDeadline(b));
    const past = itemsPastDeadline(all)
      .sort((a, b) => daysUntilReturnDeadline(b) - daysUntilReturnDeadline(a));

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Returns Due</h1>
          <div class="page-subtitle">${due.length} in alert window · ${past.length} just past deadline</div>
        </div>
      </div>

      <div class="card" style="padding: 14px 16px; margin-bottom: 16px;">
        <div style="font-size: 13px; line-height: 1.55;">
          Items show up here in the last 7 days of their return window — and the first week after, in case you still want to push it. Default window is 30 days
          (<a href="https://allreturnpolicies.com/" target="_blank" rel="noopener">industry standard</a>).
          Override per-item via Edit → Return Window.
        </div>
      </div>

      ${due.length === 0 && past.length === 0 ? `
        <div class="empty">
          <div class="empty-title">Nothing in the return window</div>
          <p>You're not approaching any return deadlines right now. Set return windows on individual items via Edit to track them here.</p>
        </div>
      ` : ''}

      ${due.length > 0 ? `
        <h2 style="font-family: 'Playfair Display', serif; margin: 12px 0 10px;">In alert window (next 7 days)</h2>
        <div class="rd-list">
          ${due.map(it => rowHtml(it)).join('')}
        </div>
      ` : ''}

      ${past.length > 0 ? `
        <h2 style="font-family: 'Playfair Display', serif; margin: 24px 0 10px;">Just past deadline</h2>
        <div class="rd-list">
          ${past.map(it => rowHtml(it)).join('')}
        </div>
      ` : ''}
    `;

    main.querySelectorAll('[data-rd-open]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.rdOpen);
        if (typeof openItemDetail === 'function') openItemDetail(id);
      });
    });
    main.querySelectorAll('[data-rd-mark]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.rdMark);
        const status = b.dataset.rdStatus;
        await dbUpdateItem(id, { status, returnDecided: true });
        showToast('Marked as returned');
        render(main);
        refreshSidebarBadge();
      });
    });
    main.querySelectorAll('[data-rd-keep]').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.rdKeep);
        await dbUpdateItem(id, { returnDecided: true });
        showToast('Kept — removed from Returns Due');
        render(main);
        refreshSidebarBadge();
      });
    });
  }

  function rowHtml(it) {
    const d = daysUntilReturnDeadline(it);
    const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
    const left = d === 0 ? 'Due TODAY' : (d > 0 ? `${d} day${d === 1 ? '' : 's'} left` : `${Math.abs(d)} day${Math.abs(d) === 1 ? '' : 's'} past`);
    const tone = d <= 1 ? 'rd-row-urgent' : (d < 0 ? 'rd-row-past' : '');
    return `
      <div class="rd-row ${tone}" data-rd-open="${it.id}">
        <div class="rd-thumb" style="background-image:url('${url}')"></div>
        <div class="rd-info">
          <div class="rd-name">${escapeHtml(it.name || it.subtype || 'Untitled')}</div>
          <div class="rd-meta muted">${escapeHtml([it.brand, it.color].filter(Boolean).join(' · '))}</div>
          <div class="rd-deadline">${escapeHtml(left)} · deadline ${escapeHtml(fmtDeadline(it))}</div>
        </div>
        <div class="rd-actions">
          <button class="btn btn-sm btn-primary" data-rd-mark="${it.id}" data-rd-status="returned">Returned</button>
          <button class="btn btn-sm" data-rd-keep="${it.id}">Kept</button>
        </div>
      </div>
    `;
  }

  // Expose globals
  window.renderReturnsDueView = function(main) { return render(main); };
  window.daysUntilReturnDeadline = daysUntilReturnDeadline;
  window.itemsInAlertWindow = itemsInAlertWindow;
  window.renderClosetReturnBanner = renderClosetReturnBanner;
  window.refreshReturnsDueBadge = refreshSidebarBadge;

  function maybeRender() {
    refreshSidebarBadge();
    if (location.hash === '#/returns-due') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/shop-r1.js ===== */
// shop-r1.js — Shop / Offer listing builder + buyer preview at #/shop
// Local-first: shows your own pieces marked forSale=true. Cross-user
// negotiation deferred until we move off pure browser storage.
//
// Two tabs:
//   - Manage: edit your listings (asking price, description, photos)
//   - Preview: see what a shopper would see when they hit your storefront

(function() {
  let mode = 'manage'; // or 'preview'
  // Holds offers/messages drafted in preview mode (local-only demo).
  // Stored as { itemId -> [{ offerCents, note, ts }] } in localStorage so
  // they survive a refresh in the same browser.
  const OFFERS_KEY = 'vc:shopOffers';
  function loadOffers() {
    try { return JSON.parse(localStorage.getItem(OFFERS_KEY) || '{}'); }
    catch (_) { return {}; }
  }
  function saveOffers(o) {
    try { localStorage.setItem(OFFERS_KEY, JSON.stringify(o)); } catch (_) {}
  }

  function fmtMoney(n) {
    if (n == null || n === '') return '—';
    const num = Number(n);
    if (isNaN(num)) return '—';
    return '$' + num.toFixed(2);
  }

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    const all = await dbGetAllItems();
    const listings = all.filter(it => it.forSale);

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Shop &amp; Offer</h1>
          <div class="page-subtitle">${listings.length} listed for sale · marketplace preview</div>
        </div>
      </div>

      <div class="card" style="padding: 14px 16px; margin-bottom: 16px;">
        <div style="font-size: 13px; line-height: 1.55;">
          List any closet piece for sale by opening it → Edit → "List for sale". Add an asking price and a quick description (condition, fit, why selling).
        </div>
        <div class="muted" style="font-size: 12px; margin-top: 8px;">
          <strong>Note:</strong> the cross-user marketplace where shoppers can find your storefront and send offers needs server infrastructure. For now, the Preview tab simulates the buyer view so you can refine your listings. Offers made in Preview save locally for design iteration.
        </div>
      </div>

      <div class="tab-bar" style="margin-bottom: 16px;">
        <button class="tab ${mode === 'manage' ? 'active' : ''}" data-shop-mode="manage">Your listings</button>
        <button class="tab ${mode === 'preview' ? 'active' : ''}" data-shop-mode="preview">Preview as buyer</button>
      </div>

      ${listings.length === 0 ? `
        <div class="empty">
          <div class="empty-title">No listings yet</div>
          <p>Open any closet piece, hit Edit, check "List for sale," set an asking price, and save. It'll appear here.</p>
        </div>
      ` : (mode === 'manage' ? renderManage(listings) : renderPreview(listings))}
    `;

    main.querySelectorAll('[data-shop-mode]').forEach(b => {
      b.addEventListener('click', () => {
        mode = b.dataset.shopMode;
        render(main);
      });
    });
    main.querySelectorAll('[data-shop-edit]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.shopEdit);
        if (typeof openItemEdit === 'function') openItemEdit(id);
        else if (typeof openItemDetail === 'function') openItemDetail(id);
      });
    });
    main.querySelectorAll('[data-shop-unlist]').forEach(b => {
      b.addEventListener('click', async () => {
        const id = Number(b.dataset.shopUnlist);
        if (!confirm('Remove this listing from your Shop?')) return;
        await dbUpdateItem(id, { forSale: false });
        showToast('Unlisted');
        render(main);
      });
    });
    // Buyer-side: offer buttons
    main.querySelectorAll('[data-buyer-offer]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.buyerOffer);
        const item = listings.find(x => x.id === id);
        if (!item) return;
        openOfferModal(item);
      });
    });
    main.querySelectorAll('[data-buyer-detail]').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger when offer button inside the card was clicked
        if (e.target.closest('[data-buyer-offer]')) return;
        const id = Number(card.dataset.buyerDetail);
        const item = listings.find(x => x.id === id);
        if (item) openBuyerDetail(item);
      });
    });
  }

  // ===== Manage view =====
  function renderManage(listings) {
    const offers = loadOffers();
    return `
      <div class="shop-manage-grid">
        ${listings.map(it => {
          const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
          const myOffers = offers[it.id] || [];
          return `
            <div class="shop-manage-card">
              <div class="shop-thumb" style="background-image:url('${url}')"></div>
              <div class="shop-info">
                <div class="shop-name">${escapeHtml(it.name || it.subtype || 'Untitled')}</div>
                <div class="shop-meta muted">${escapeHtml([it.brand, it.color, it.size].filter(Boolean).join(' · '))}</div>
                <div class="shop-price">${fmtMoney(it.askingPrice)}${it.purchasePrice ? `<span class="muted" style="font-size: 11px; margin-left: 8px;">paid ${fmtMoney(it.purchasePrice)}</span>` : ''}</div>
                ${it.listingDescription ? `<div class="shop-desc">${escapeHtml(it.listingDescription)}</div>` : '<div class="shop-desc muted">No description yet — add one for better offers.</div>'}
                ${myOffers.length ? `<div class="shop-offer-count">📩 ${myOffers.length} draft offer${myOffers.length === 1 ? '' : 's'}</div>` : ''}
              </div>
              <div class="shop-actions">
                <button class="btn btn-sm" data-shop-edit="${it.id}">Edit listing</button>
                <button class="btn btn-ghost btn-sm" data-shop-unlist="${it.id}">Unlist</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ===== Buyer preview =====
  function renderPreview(listings) {
    return `
      <div class="shop-preview-storefront">
        <div class="shop-storefront-head">
          <div>
            <h2 class="shop-storefront-title">Tiffany's Closet</h2>
            <div class="muted" style="font-size: 12px;">${listings.length} piece${listings.length === 1 ? '' : 's'} available · curated wardrobe</div>
          </div>
          <span class="shop-storefront-badge">Preview</span>
        </div>
        <div class="shop-buyer-grid">
          ${listings.map(it => {
            const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
            return `
              <div class="shop-buyer-card" data-buyer-detail="${it.id}">
                <div class="shop-buyer-thumb" style="background-image:url('${url}')"></div>
                <div class="shop-buyer-info">
                  <div class="shop-buyer-brand">${escapeHtml(it.brand || '—')}</div>
                  <div class="shop-buyer-name">${escapeHtml(it.name || it.subtype || 'Untitled')}</div>
                  <div class="shop-buyer-meta muted">${escapeHtml([it.color, it.size].filter(Boolean).join(' · '))}</div>
                  <div class="shop-buyer-price">${fmtMoney(it.askingPrice) || '—'}</div>
                  <button class="btn btn-primary btn-sm shop-buyer-offer" data-buyer-offer="${it.id}">Offer / negotiate</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function openBuyerDetail(item) {
    if (typeof openModal !== 'function') return;
    const photos = (typeof itemPhotos === 'function') ? itemPhotos(item) : [item.photo].filter(Boolean);
    const urls = photos.map(blobToUrl);
    openModal(`
      <div class="shop-detail">
        <div class="shop-detail-photos">
          ${urls.map(u => `<div class="shop-detail-photo" style="background-image:url('${u}')"></div>`).join('')}
        </div>
        <div class="shop-detail-info">
          <div class="muted" style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;">${escapeHtml(item.brand || 'Pre-loved')}</div>
          <h2 style="margin: 4px 0 8px;">${escapeHtml(item.name || item.subtype || 'Untitled')}</h2>
          <div class="shop-detail-price">${fmtMoney(item.askingPrice)}</div>
          <div class="muted" style="font-size: 13px; margin: 8px 0;">${escapeHtml([item.color, item.size].filter(Boolean).join(' · '))}</div>
          ${item.listingDescription ? `<p style="font-size: 14px; line-height: 1.5;">${escapeHtml(item.listingDescription)}</p>` : ''}
          <button class="btn btn-primary" data-buyer-offer="${item.id}" style="margin-top: 12px;">Make an offer</button>
        </div>
      </div>
    `);
    document.querySelectorAll('[data-buyer-offer]').forEach(b => {
      b.addEventListener('click', () => {
        closeModal();
        setTimeout(() => openOfferModal(item), 100);
      });
    });
  }

  function openOfferModal(item) {
    if (typeof openModal !== 'function') return;
    openModal(`
      <h2 style="margin: 0 0 6px;">Offer on ${escapeHtml(item.name || item.subtype)}</h2>
      <div class="muted" style="font-size: 12px; margin-bottom: 14px;">Asking ${fmtMoney(item.askingPrice)} · ${escapeHtml([item.brand, item.size].filter(Boolean).join(' · '))}</div>
      <div class="field">
        <label class="field-label" for="offer_amount">Your offer ($)</label>
        <input class="input" id="offer_amount" type="number" min="0" step="0.01" placeholder="${item.askingPrice || ''}" />
      </div>
      <div class="field">
        <label class="field-label" for="offer_note">Message (optional)</label>
        <textarea class="textarea" id="offer_note" placeholder="e.g. Would love it if available — flexible on shipping."></textarea>
      </div>
      <div class="muted" style="font-size: 11px; margin-bottom: 12px;">In Preview mode, your offer is saved locally so you can see what your listing would feel like to a buyer. Real offers will route to your inbox once we ship the marketplace.</div>
      <div class="row" style="gap: 8px;">
        <button class="btn" data-close>Cancel</button>
        <div class="spacer"></div>
        <button class="btn btn-primary" id="submitOfferBtn">Send offer</button>
      </div>
    `);
    document.getElementById('submitOfferBtn').addEventListener('click', () => {
      const amount = Number(document.getElementById('offer_amount').value);
      const note = document.getElementById('offer_note').value.trim();
      if (!amount || amount <= 0) {
        alert('Enter an offer amount.');
        return;
      }
      const offers = loadOffers();
      if (!offers[item.id]) offers[item.id] = [];
      offers[item.id].push({ offerCents: Math.round(amount * 100), note, ts: Date.now() });
      saveOffers(offers);
      closeModal();
      showToast('Offer recorded (preview mode)');
    });
  }

  window.renderShopView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/shop') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/top10-r1.js ===== */
// top10-r1.js — "My Top 10" view at #/top10
// Lists the highest-rated items in the active closet. Each card has:
//   - Rank number (1..10)
//   - Item photo + name + brand · color
//   - Computed overall rating (stars)
//   - Favorite heart if marked
//   - "Compare" button that pushes the item into the Compare tool

(function() {
  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    const all = await dbGetAllItems();
    const active = (typeof activeItems === 'function') ? activeItems(all) : all;
    const fb = window.ratingHelpers;
    const ranked = active
      .map(it => ({ it, score: fb ? fb.computeOverall(it) : 0 }))
      .filter(x => x.score > 0 || x.it.favorite)
      .sort((a, b) => {
        // Favorites bubble up if scores tie
        if (b.score !== a.score) return b.score - a.score;
        return (b.it.favorite ? 1 : 0) - (a.it.favorite ? 1 : 0);
      })
      .slice(0, 10);

    main.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>My Top 10</h1>
          <div class="page-subtitle">${ranked.length} of your highest-rated pieces</div>
        </div>
        <a href="#/compare" class="btn">Open Compare</a>
      </div>

      <div class="card" style="padding: 14px 16px; margin-bottom: 16px;">
        <div style="font-size: 13px; line-height: 1.55;">
          Items appear here once you rate them (open any piece, hit Edit, set Overall stars or any of Fit/Comfort/Style/Versatility). Hearted items count even without a numeric rating.
        </div>
      </div>

      ${ranked.length === 0 ? `
        <div class="empty">
          <div class="empty-title">No rated items yet</div>
          <p>Tap the heart on a closet card to favorite a piece, or open Edit and use the rating widget for stars. Your top 10 will fill in as you rate.</p>
        </div>
      ` : `
        <div class="top10-list">
          ${ranked.map((r, i) => top10CardHtml(r.it, r.score, i + 1)).join('')}
        </div>
      `}
    `;

    main.querySelectorAll('[data-top10-open]').forEach(b => {
      b.addEventListener('click', () => {
        const id = Number(b.dataset.top10Open);
        if (typeof openItemDetail === 'function') openItemDetail(id);
      });
    });
    main.querySelectorAll('[data-top10-compare]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(b.dataset.top10Compare);
        // Open compare with this item pre-loaded
        window._cmpPreload = { source: 'closet', id };
        location.hash = '#/compare';
      });
    });
  }

  function top10CardHtml(it, score, rank) {
    const url = it.thumb ? blobToUrl(it.thumb) : (it.photo ? blobToUrl(it.photo) : '');
    const fb = window.ratingHelpers;
    const stars = score > 0 && fb ? fb.starsHtml(score, { showNumber: true }) : '';
    const heart = it.favorite ? '<span class="top10-heart">♥</span>' : '';
    return `
      <div class="top10-row" data-top10-open="${it.id}">
        <div class="top10-rank">#${rank}</div>
        <div class="top10-thumb" style="background-image:url('${url}')"></div>
        <div class="top10-info">
          <div class="top10-name">${escapeHtml(it.name || it.subtype || 'Untitled')} ${heart}</div>
          <div class="top10-meta muted">${escapeHtml([it.brand, it.color, labelForGarmentType(it.garmentType)].filter(Boolean).join(' · '))}</div>
          <div class="top10-stars">${stars}</div>
        </div>
        <div class="top10-actions">
          <button class="btn btn-sm" data-top10-compare="${it.id}">Compare</button>
        </div>
      </div>
    `;
  }

  window.renderTop10View = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/top10') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/cartimport-r1.js ===== */
// cartimport-r1.js — Cart-import setup view at #/cart-import
// Bookmarklet uses content-shape detection: finds leaf elements with both
// an <img> and a $X.XX price, stops at "you might also like" heading.

(function() {
  var CLOSET_URL = 'https://tmquinones.github.io/virtual-closet/';

  var BMK = ''
    + "(function(){"
    + "function txt(el,sels){if(!el)return '';for(var i=0;i<sels.length;i++){var n=el.querySelector(sels[i]);if(n){var t=(n.textContent||'').trim();if(t)return t;}}return '';}"
    + "function attr(el,sel,a){var n=el&&el.querySelector(sel);return n?(n.getAttribute(a)||'').trim():'';}"
    + "function abs(u){if(!u)return '';try{return new URL(u,location.href).href;}catch(_){return u;}}"
    + "function priceOf(s){if(!s)return null;var m=String(s).replace(/[^\\d.,]/g,'').replace(/,/g,'');var n=parseFloat(m);return isNaN(n)?null:n;}"
    + "var host=location.hostname.toLowerCase();"
    + "var siteBrand={lululemon:'Lululemon',vuori:'Vuori',aloyoga:'Alo Yoga',patagonia:'Patagonia','rei.com':'REI',athleta:'Athleta','ae.com':'American Eagle',americaneagle:'American Eagle',varley:'Varley'};"
    + "var brand='';for(var k in siteBrand){if(host.indexOf(k)>-1){brand=siteBrand[k];break;}}"

    // Find a heading that marks the start of a recommendation/upsell
    // section, then stop scanning past it. Expanded list (v35) — Alo and
    // others use phrases that aren't in the original list.
    + "var endNode=null;"
    + "var allHs=document.querySelectorAll('h1,h2,h3,h4,p,div,section');"
    + "var endRe=/you might also like|you may also like|you may like|you might like|recommended for you|recommended|customers also|complete the look|complete your|complete your set|frequently bought|pair (it )?with|style (it )?with|shop the look|more from|wear it with|goes with|pairs well/;"
    + "for(var hi=0;hi<allHs.length;hi++){var ht=(allHs[hi].textContent||'').trim().toLowerCase();if(ht.length<80&&endRe.test(ht)){endNode=allHs[hi];break;}}"

    // Phrases that mark a non-product widget (payment buttons, chat
    // widgets, promo banners). If an element matched as image+price
    // contains any of these, skip — it's almost certainly not a cart row.
    + "var widgetRe=/apple pay|google pay|paypal|klarna|afterpay|affirm|sezzle|pay (with|in)|sam'?s club|powered by|chat (with|now)|customer (service|care)|need help|message us|live chat|gift card|sign up|subscribe|newsletter/;"

    + "function extractName(el){"
    +   "var n=txt(el,['h1','h2','h3','h4','h5','a','[class*=\"title\"]','[class*=\"name\"]','[class*=\"product\"]']);"
    +   "if(n)return n;"
    +   "var nodes=el.querySelectorAll('span,div,p');"
    +   "for(var i=0;i<nodes.length;i++){var t=(nodes[i].textContent||'').trim();if(t.length>3&&t.length<100&&!t.match(/^\\$/)&&!t.match(/^(XS|XXS|S|M|L|XL|XXL|XXXL|\\d+)$/i)&&!t.match(/^(color|size|qty|quantity|remove)/i)){return t;}}"
    +   "return '';"
    + "}"

    + "var items=[];"
    + "var nodeSet=new Set();"
    + "var all=document.querySelectorAll('*');"
    + "for(var i=0;i<all.length;i++){"
    +   "var el=all[i];"
    +   "if(endNode&&(endNode.compareDocumentPosition(el)&0x04))break;"
    +   "var img=el.querySelector('img');"
    +   "var pm=(el.textContent||'').match(/\\$\\d{1,4}(?:[,.]\\d{2,3})*\\.\\d{2}/);"
    +   "if(!img||!pm)continue;"
    // Skip non-product widgets — payment buttons, chat bubbles, promo tiles.
    +   "var elText=(el.textContent||'').toLowerCase();"
    +   "if(widgetRe.test(elText))continue;"
    // Skip tiny images (icons / payment-button glyphs / chat avatars).
    // naturalWidth is 0 when the image hasn't loaded — leave those alone.
    +   "if(img.naturalWidth>0&&img.naturalWidth<60)continue;"
    +   "if(img.naturalHeight>0&&img.naturalHeight<60)continue;"
    +   "var hasNestedItem=false;"
    +   "for(var c=0;c<el.children.length;c++){var ch=el.children[c];if(ch.querySelector('img')&&(ch.textContent||'').match(/\\$\\d{1,4}(?:[,.]\\d{2,3})*\\.\\d{2}/)){hasNestedItem=true;break;}}"
    +   "if(hasNestedItem)continue;"
    +   "var p=el.parentElement;var skip=false;while(p){if(nodeSet.has(p)){skip=true;break;}p=p.parentElement;}"
    +   "if(skip)continue;"
    +   "nodeSet.add(el);"
    +   "var name=extractName(el);"
    +   "if(!name)continue;"
    +   "items.push({"
    +     "name:name,"
    +     "brand:brand,"
    +     "color:txt(el,['[class*=\"color\"]','[class*=\"variant\"]','[class*=\"option\"]']),"
    +     "size:txt(el,['[class*=\"size\"]']),"
    +     "price:priceOf(pm[0]),"
    +     "url:abs((el.querySelector('a')||{}).href||location.href),"
    +     "imageUrl:abs(img.src||img.getAttribute('data-src')||'')"
    +   "});"
    + "}"

    // Dedupe (v35) — by imageUrl OR a name+price+size+color tuple. Sites
    // like Alo render the same item in multiple cart components (header
    // mini-cart + main cart list + sticky-bar summary), so leaf-detection
    // alone leaves duplicates.
    + "var dedup=[];var seenImg=new Set();var seenKey=new Set();"
    + "for(var di=0;di<items.length;di++){"
    +   "var it=items[di];"
    +   "var iKey=it.imageUrl||'';"
    +   "var nKey=(it.name||'').toLowerCase().replace(/\\s+/g,' ').trim()+'|'+(it.price||'')+'|'+(it.size||'')+'|'+(it.color||'');"
    +   "if(iKey&&seenImg.has(iKey))continue;"
    +   "if(seenKey.has(nKey))continue;"
    +   "if(iKey)seenImg.add(iKey);"
    +   "seenKey.add(nKey);"
    +   "dedup.push(it);"
    + "}"
    + "items=dedup;"

    + "if(items.length===0){alert('No cart items detected. Make sure you are on the shopping cart or product page.');return;}"
    + "if(items.length>25)items=items.slice(0,25);"
    + "try{var payload=btoa(unescape(encodeURIComponent(JSON.stringify(items))));"
    // URL-encode the payload — same '+' fix as v34 email importer.
    + "window.open('" + CLOSET_URL + "#/wishlist?cartImport='+encodeURIComponent(payload),'_blank');}"
    + "catch(e){alert('Failed to encode cart: '+e.message);}"
    + "})();";

  var BOOKMARKLET_HREF = 'javascript:' + encodeURIComponent(BMK);

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    main.innerHTML = ''
      + '<div class="page-header">'
      +   '<div class="page-title-group">'
      +     '<h1>Cart Importer</h1>'
      +     '<div class="page-subtitle">Bookmarklet · scan any cart, add to your wishlist</div>'
      +   '</div>'
      + '</div>'
      + '<div class="card" style="padding: 18px 22px; margin-bottom: 18px;">'
      +   '<h2 style="margin: 0 0 10px; font-family: \'Playfair Display\', serif; font-size: 22px;">One-time setup (1 minute)</h2>'
      +   '<ol style="font-size: 14px; line-height: 1.8; padding-left: 22px; margin: 0;">'
      +     '<li><strong>Show your bookmarks bar</strong> — Chrome/Edge: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> (Mac: <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>).</li>'
      +     '<li><strong>Drag</strong> this button onto your bookmarks bar (don\'t click — drag):'
      +       '<div style="margin: 12px 0 4px;">'
      +         '<a href="' + BOOKMARKLET_HREF + '" class="btn btn-primary" id="bookmarkletBtn" onclick="event.preventDefault(); alert(\'Don\\\'t click — DRAG this button to your bookmarks bar.\'); return false;" style="cursor: grab; padding: 10px 18px; font-size: 14px;">+ Add to Closet</a>'
      +       '</div>'
      +     '</li>'
      +     '<li>Visit any cart/checkout page → click the bookmark → items land in your wishlist.</li>'
      +   '</ol>'
      + '</div>'
      + '<div class="card" style="padding: 16px 20px;">'
      +   '<h3 style="margin: 0 0 8px; font-size: 15px;">How it works</h3>'
      +   '<div class="muted" style="font-size: 13px; line-height: 1.55;">The bookmarklet searches the cart page for elements that contain both a product image AND a $XX.XX price. It stops at headings like "You might also like" so recommendations don\'t pollute your import. Brand is auto-detected on Lululemon, Vuori, Alo Yoga, Patagonia, REI, Athleta, American Eagle, and Varley.</div>'
      + '</div>';
  }

  window.renderCartImportView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/cart-import') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/emailimport-r1.js ===== */
// emailimport-r1.js — Email-order-import setup view at #/email-import
// Bookmarklet that scans an open Outlook (or Gmail) order-confirmation email
// for image+price item rows, detects the brand from the sender/subject, and
// fires the items into the user's closet via #/closet?orderImport=BASE64.
//
// Sister module to cartimport-r1.js (which targets retail carts and lands in
// the wishlist). This one targets order CONFIRMATION emails and lands in the
// closet because they're already paid for. The receiver lives in
// closet-r10.js (_handleOrderImportParam).
//
// Outlook reading-pane note: the email body is typically rendered into an
// iframe with srcdoc="..." which is same-origin with outlook.live.com, so
// its contentDocument is readable. We try iframes first, then known
// reading-pane container selectors, then fall back to the whole document.

(function() {
  var CLOSET_URL = 'https://tmquinones.github.io/virtual-closet/';

  // Bookmarklet body — written as a string for the javascript: URL. Same
  // hand-rolled escaping style as cartimport-r1.js.
  var BMK = ''
    + "(function(){"
    + "function txt(el,sels){if(!el)return '';for(var i=0;i<sels.length;i++){var n=el.querySelector(sels[i]);if(n){var t=(n.textContent||'').trim();if(t)return t;}}return '';}"
    + "function abs(u,base){if(!u)return '';try{return new URL(u,base||location.href).href;}catch(_){return u;}}"
    + "function priceOf(s){if(!s)return null;var m=String(s).replace(/[^\\d.,]/g,'').replace(/,/g,'');var n=parseFloat(m);return isNaN(n)?null:n;}"

    // Brand dictionary — keyed by lowercased substring that appears in
    // sender domain, subject line, or page text. Order matters only for
    // ambiguous prefixes (none here).
    + "var BRANDS={lululemon:'Lululemon',vuori:'Vuori',aloyoga:'Alo Yoga','alo yoga':'Alo Yoga',patagonia:'Patagonia','rei.com':'REI',athleta:'Athleta','ae.com':'American Eagle','american eagle':'American Eagle',aerie:'Aerie',varley:'Varley',amazon:'Amazon',nordstrom:'Nordstrom',zara:'Zara','h&m':'H&M','hennes':'H&M',target:'Target',walmart:'Walmart','macys':'Macy\\'s','macy\\'s':'Macy\\'s',saks:'Saks',revolve:'Revolve','free people':'Free People','urban outfitters':'Urban Outfitters',anthropologie:'Anthropologie',madewell:'Madewell','j.crew':'J.Crew',jcrew:'J.Crew','banana republic':'Banana Republic',gap:'Gap','old navy':'Old Navy',oldnavy:'Old Navy',uniqlo:'Uniqlo',asos:'ASOS',shopbop:'Shopbop',ssense:'SSENSE',farfetch:'Farfetch','net-a-porter':'Net-a-Porter',sephora:'Sephora',ulta:'Ulta','victoria\\'s secret':'Victoria\\'s Secret','fabletics':'Fabletics','outdoor voices':'Outdoor Voices','everlane':'Everlane','reformation':'Reformation','levi':'Levi\\'s','levis':'Levi\\'s'};"

    // Find a list of DOM scopes (Documents or Elements) where the email body
    // likely lives. Outlook reading pane is an iframe with srcdoc; we also
    // try common selectors as a fallback.
    + "function gatherScopes(){"
    +   "var scopes=[];"
    +   "var iframes=document.querySelectorAll('iframe');"
    +   "for(var i=0;i<iframes.length;i++){"
    +     "try{var d=iframes[i].contentDocument;if(d&&d.body&&d.body.querySelector('img')&&d.body.querySelectorAll('*').length>5){scopes.push(d.body);}}catch(_){}"
    +   "}"
    +   "var sels=['[role=\"document\"]','[role=\"region\"][aria-label*=\"message body\" i]','div[aria-label*=\"message body\" i]','div[id*=\"ReadingPane\" i]','div[class*=\"readingPane\" i]','div[class*=\"messageBody\" i]','[data-app-section*=\"message\" i]'];"
    +   "for(var j=0;j<sels.length;j++){var els=document.querySelectorAll(sels[j]);for(var k=0;k<els.length;k++){if(els[k].querySelector('img')&&els[k].querySelectorAll('*').length>5){scopes.push(els[k]);}}}"
    +   "if(scopes.length===0)scopes.push(document.body);"
    +   "return scopes;"
    + "}"

    // Marketplace senders — when the email is from a peer-to-peer
    // marketplace (Poshmark, Mercari, etc.), the listing title is the
    // seller's wording, NOT the original brand. Leaving brand blank is
    // the right call because the user knows the actual product brand and
    // can fill it in via Edit. Auto-guessing produces wrong brands.
    + "var MARKETPLACES=['poshmark','mercari','depop','ebay','vinted','thredup','grailed','tradesy','vestiaire','therealreal','farfetch second life','rebag','fashionphile'];"

    // Brand detection — sender mailto first (most authoritative), then
    // subject heading, then iframe email-body text (only same-origin
    // readable iframes). NEVER scans document.body.textContent because
    // that includes Outlook's UI shell (sidebar, other email previews,
    // ads) and produces false matches.
    + "function detectBrand(){"
    +   "var hdr='';"
    +   "var subjEl=document.querySelector('[role=\"heading\"][aria-level=\"1\"], [role=\"heading\"][aria-level=\"2\"], [aria-label*=\"subject\" i]');"
    +   "if(subjEl)hdr+=' '+(subjEl.textContent||'');"
    +   "var fromEls=document.querySelectorAll('[aria-label*=\"sender\" i],[aria-label*=\"from\" i],a[href^=\"mailto:\"],span[title*=\"@\"]');"
    +   "for(var i=0;i<Math.min(fromEls.length,8);i++){hdr+=' '+(fromEls[i].textContent||'')+' '+(fromEls[i].getAttribute('href')||'')+' '+(fromEls[i].getAttribute('title')||'');}"
    +   "hdr=hdr.toLowerCase();"
    // If the sender/subject screams marketplace, leave brand blank.
    +   "for(var mi=0;mi<MARKETPLACES.length;mi++){if(hdr.indexOf(MARKETPLACES[mi])>-1)return '';}"
    +   "for(var k in BRANDS){if(hdr.indexOf(k)>-1)return BRANDS[k];}"
    // Fallback: scan iframe email bodies only (NOT the whole document).
    +   "var ifs=document.querySelectorAll('iframe');"
    +   "var bodyText='';"
    +   "for(var ii=0;ii<ifs.length;ii++){try{var d=ifs[ii].contentDocument;if(d&&d.body)bodyText+=' '+(d.body.textContent||'');}catch(_){}}"
    +   "bodyText=bodyText.toLowerCase().slice(0,4000);"
    +   "if(bodyText){"
    +     "for(var mj=0;mj<MARKETPLACES.length;mj++){if(bodyText.indexOf(MARKETPLACES[mj])>-1)return '';}"
    +     "for(var k2 in BRANDS){if(bodyText.indexOf(k2)>-1)return BRANDS[k2];}"
    +   "}"
    +   "return '';"
    + "}"

    // Strip noise from a captured product name. Order-confirmation emails
    // often label items with "Item:", "Order:", "Product:", and concatenate
    // size/color/price into the same text node — extractName grabs the
    // whole blob, this trims it back to just the product name.
    + "function cleanName(s){"
    +   "if(!s)return '';"
    +   "var n=String(s).replace(/\\s+/g,' ').trim();"
    +   "n=n.replace(/^\\s*(item|order|product|sku|style)\\s*[:#-]?\\s*/i,'');"
    +   "n=n.split(/\\s+(?:size|color|colour|qty|quantity|item\\s*price|price|sku|style|fit)\\s*[:#-]?\\s*/i)[0];"
    +   "n=n.split('$')[0];"
    +   "n=n.replace(/\\s*#[A-Za-z0-9_]+\\.\\.\\.?\\s*$/,'');"
    +   "return n.replace(/\\s+/g,' ').trim();"
    + "}"

    // Try to derive a clean item name from a candidate row element.
    + "function extractName(el){"
    +   "var n=txt(el,['h1','h2','h3','h4','h5','a','[class*=\"title\"]','[class*=\"name\"]','[class*=\"product\"]','strong','b']);"
    +   "if(n&&n.length<160)return n.replace(/\\s+/g,' ').trim();"
    +   "var nodes=el.querySelectorAll('span,div,p,td');"
    +   "for(var i=0;i<nodes.length;i++){var t=(nodes[i].textContent||'').trim();if(t.length>3&&t.length<120&&!t.match(/^\\$/)&&!t.match(/^(XS|XXS|S|M|L|XL|XXL|XXXL|\\d+)$/i)&&!t.match(/^(color|size|qty|quantity|order|item|total|subtotal|shipping|tax|price)/i)){return t.replace(/\\s+/g,' ').trim();}}"
    +   "return '';"
    + "}"

    + "var brand=detectBrand();"
    + "var scopes=gatherScopes();"
    + "var items=[];"
    + "var seen=new Set();"
    + "for(var s=0;s<scopes.length;s++){"
    +   "var scope=scopes[s];"
    +   "var baseDoc=scope.ownerDocument||document;"
    +   "var baseUrl=(baseDoc&&baseDoc.location&&baseDoc.location.href)||location.href;"
    +   "var all=scope.querySelectorAll('*');"
    +   "for(var i=0;i<all.length;i++){"
    +     "var el=all[i];"
    +     "var img=el.querySelector('img');"
    +     "var pm=(el.textContent||'').match(/\\$\\d{1,4}(?:[,.]\\d{2,3})*\\.\\d{2}/);"
    +     "if(!img||!pm)continue;"
    // Drop containers that wrap another image+price element — keep the leaf.
    +     "var hasNested=false;"
    +     "for(var c=0;c<el.children.length;c++){var ch=el.children[c];if(ch.querySelector&&ch.querySelector('img')&&(ch.textContent||'').match(/\\$\\d{1,4}(?:[,.]\\d{2,3})*\\.\\d{2}/)){hasNested=true;break;}}"
    +     "if(hasNested)continue;"
    +     "var p=el.parentElement;var skip=false;while(p){if(seen.has(p)){skip=true;break;}p=p.parentElement;}"
    +     "if(skip)continue;"
    +     "seen.add(el);"
    +     "var name=cleanName(extractName(el));"
    +     "if(!name||name.length<3)continue;"
    +     "var imgSrc=img.getAttribute('src')||img.getAttribute('data-src')||img.getAttribute('data-original-src')||'';"
    +     "var hrefEl=el.querySelector('a[href]');"
    +     "var href=hrefEl?hrefEl.getAttribute('href'):'';"
    +     "items.push({"
    +       "name:name,"
    +       "brand:brand,"
    +       "color:txt(el,['[class*=\"color\"]','[class*=\"variant\"]','[class*=\"option\"]']),"
    +       "size:txt(el,['[class*=\"size\"]']),"
    +       "price:priceOf(pm[0]),"
    +       "url:abs(href,baseUrl),"
    +       "imageUrl:abs(imgSrc,baseUrl)"
    +     "});"
    +   "}"
    + "}"

    // Dedupe by EITHER image URL OR a name+price+size+color tuple. Outlook
    // proxies images through different URLs in the iframe vs the parent
    // doc's [role=document] re-render, so an imageUrl-only check misses
    // multi-scope dupes. The attr tuple catches that case because the
    // visible text is identical across scopes.
    + "var dedup=[];var seenImg=new Set();var seenKey=new Set();"
    + "for(var di=0;di<items.length;di++){"
    +   "var it=items[di];"
    +   "var iKey=it.imageUrl||'';"
    +   "var nKey=(it.name||'').toLowerCase().replace(/\\s+/g,' ').trim()+'|'+(it.price||'')+'|'+(it.size||'')+'|'+(it.color||'');"
    +   "if(iKey&&seenImg.has(iKey))continue;"
    +   "if(seenKey.has(nKey))continue;"
    +   "if(iKey)seenImg.add(iKey);"
    +   "seenKey.add(nKey);"
    +   "dedup.push(it);"
    + "}"
    + "items=dedup;"

    + "if(items.length===0){alert('No order items detected. Make sure you have an order confirmation email open with the body visible.');return;}"
    + "if(items.length>25)items=items.slice(0,25);"
    + "try{var payload=btoa(unescape(encodeURIComponent(JSON.stringify(items))));"
    // URL-encode the payload so '+' chars in base64 don't get turned into
    // spaces by URLSearchParams on the receiving end.
    + "window.open('" + CLOSET_URL + "#/closet?orderImport='+encodeURIComponent(payload),'_blank');}"
    + "catch(e){alert('Failed to encode order: '+e.message);}"
    + "})();";

  var BOOKMARKLET_HREF = 'javascript:' + encodeURIComponent(BMK);

  async function render(main) {
    main = main || document.getElementById('main');
    if (!main) return;
    main.innerHTML = ''
      + '<div class="page-header">'
      +   '<div class="page-title-group">'
      +     '<h1>Email Order Importer</h1>'
      +     '<div class="page-subtitle">Bookmarklet · scan an open order email, drop items into your closet</div>'
      +   '</div>'
      + '</div>'

      + '<div class="card" style="padding: 18px 22px; margin-bottom: 18px;">'
      +   '<h2 style="margin: 0 0 10px; font-family: \'Playfair Display\', serif; font-size: 22px;">One-time setup (1 minute)</h2>'
      +   '<ol style="font-size: 14px; line-height: 1.8; padding-left: 22px; margin: 0;">'
      +     '<li><strong>Show your bookmarks bar</strong> — Chrome/Edge: <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> (Mac: <kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>).</li>'
      +     '<li><strong>Drag</strong> this button onto your bookmarks bar (don\'t click — drag):'
      +       '<div style="margin: 12px 0 4px;">'
      +         '<a href="' + BOOKMARKLET_HREF + '" class="btn btn-primary" id="emailBookmarkletBtn" onclick="event.preventDefault(); alert(\'Don\\\'t click — DRAG this button to your bookmarks bar.\'); return false;" style="cursor: grab; padding: 10px 18px; font-size: 14px;">📧 Order → Closet</a>'
      +       '</div>'
      +     '</li>'
      +     '<li>Open an order confirmation email in Outlook on the web (outlook.live.com or outlook.office.com) — make sure the email body is visible in the reading pane.</li>'
      +     '<li>Click the bookmark → a new tab opens at your closet → confirm the import → done.</li>'
      +   '</ol>'
      + '</div>'

      + '<div class="card" style="padding: 16px 20px; margin-bottom: 18px;">'
      +   '<h3 style="margin: 0 0 8px; font-size: 15px;">How it works</h3>'
      +   '<div class="muted" style="font-size: 13px; line-height: 1.55;">The bookmarklet looks at the email body that\'s currently open and finds rows that contain <em>both</em> a product image and a $XX.XX price. The brand is auto-detected from the sender, subject, or page text. Items go straight into your closet (not your wishlist) because order confirmations are already paid for. If something isn\'t right after import, just edit the closet item — the price and date are easy to fix.</div>'
      + '</div>'

      + '<div class="card" style="padding: 16px 20px; margin-bottom: 18px;">'
      +   '<h3 style="margin: 0 0 8px; font-size: 15px;">Tips</h3>'
      +     '<li>Works best on retailer-sent confirmation emails (Lululemon, Varley, Vuori, Nordstrom, Anthropologie, etc.). Marketplace emails (Poshmark, Mercari, etc.) will leave the brand blank because the seller writes their own listing title — fill in the real brand via Edit afterwards.</li>'
      +     '<li>If the bookmarklet pulls in too much (recommendations, footer ads, etc.), you can delete the extras from your closet right after import.</li>'
      +     '<li>Native Outlook desktop / phone app is <strong>not</strong> supported — only the browser version. Open the email at outlook.live.com first.</li>'
      +   '</ul>'
      + '</div>'

      + '<div class="card" style="padding: 16px 20px;">'
      +   '<h3 style="margin: 0 0 8px; font-size: 15px;">Coming later</h3>'
      +   '<div class="muted" style="font-size: 13px; line-height: 1.55;">A real forwarding address (forward your order email to closet@…). That requires a tiny server — it\'s on the roadmap.</div>'
      + '</div>';
  }

  window.renderEmailImportView = function(main) { return render(main); };

  function maybeRender() {
    if (location.hash === '#/email-import') render(document.getElementById('main'));
  }
  window.addEventListener('hashchange', maybeRender);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeRender);
  else maybeRender();
})();


/* ===== js/photo-suggest-r1.js ===== */
// photo-suggest-r1.js — heuristic color-based item suggestions from a daily photo.
// Local/no-server: extracts dominant photo colors via canvas, maps each to the
// nearest palette color in data-r9.js's COLOR_HEX, then ranks closet items by
// how well their `color` field overlaps. Exposes:
//   - window.extractDominantColors(blob, maxColors=6) → [{rgb:[r,g,b], weight}]
//   - window.suggestItemsFromPhoto(blob, items, {topN}) → [item, ...]

(function () {
  async function extractDominantColors(blob, maxColors = 6) {
    if (!blob) return [];
    const url = URL.createObjectURL(blob);
    try {
      const img = await new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = url;
      });
      const canvas = document.createElement('canvas');
      const SIZE = 80;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

      // Quantize to 4 bits/channel → 4096 buckets, accumulate exact RGB sums
      // so we can recover the bucket's centroid color.
      const buckets = new Map();
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue; // transparent
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Skip near-white (skin/background washout) and near-black extremes,
        // but keep a representative sample of each so they can still match.
        const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
        const cur = buckets.get(key) || { count: 0, r: 0, g: 0, b: 0 };
        cur.count++;
        cur.r += r;
        cur.g += g;
        cur.b += b;
        buckets.set(key, cur);
      }

      const total = SIZE * SIZE;
      return [...buckets.values()]
        .map(c => ({
          rgb: [Math.round(c.r / c.count), Math.round(c.g / c.count), Math.round(c.b / c.count)],
          weight: c.count / total,
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, maxColors);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string' || hex[0] !== '#' || hex.length !== 7) return null;
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  }
  function rgbDist2(a, b) {
    const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
    return dr * dr + dg * dg + db * db;
  }

  // Nearest palette color name (Black, Olive, Hot Pink, …) for a single RGB.
  function nearestPaletteColor(rgb) {
    if (typeof COLOR_HEX !== 'object' || !COLOR_HEX) return null;
    let bestName = null, bestDist = Infinity;
    for (const [name, hex] of Object.entries(COLOR_HEX)) {
      const target = hexToRgb(hex);
      if (!target) continue;
      const d = rgbDist2(rgb, target);
      if (d < bestDist) { bestDist = d; bestName = name; }
    }
    return bestName;
  }

  async function suggestItemsFromPhoto(blob, items, options) {
    options = options || {};
    const topN = options.topN || 15;
    if (!blob || !Array.isArray(items) || items.length === 0) return [];

    let dominants;
    try { dominants = await extractDominantColors(blob, 6); }
    catch (_) { return []; }
    if (!dominants.length) return [];

    // Build canonical-color and family weights from the photo's dominant
    // colors, weighted by pixel coverage.
    const colorWeights = new Map();
    const familyWeights = new Map();
    for (const dc of dominants) {
      const name = nearestPaletteColor(dc.rgb);
      if (!name) continue;
      colorWeights.set(name, (colorWeights.get(name) || 0) + dc.weight);
      const fam = (typeof familyForColor === 'function') ? familyForColor(name) : null;
      if (fam) familyWeights.set(fam, (familyWeights.get(fam) || 0) + dc.weight);
    }

    const scored = items.map(it => {
      let s = 0;
      const raw = (it.color || '').trim();
      if (!raw) return { item: it, score: 0 };
      const c = (typeof normalizeColor === 'function') ? normalizeColor(raw) : raw;
      if (c && colorWeights.has(c)) s += colorWeights.get(c) * 5;
      const fam = (typeof familyForColor === 'function') ? familyForColor(c) : null;
      if (fam && familyWeights.has(fam)) s += familyWeights.get(fam) * 2;
      return { item: it, score: s };
    });

    return scored
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
      .map(x => x.item);
  }

  window.extractDominantColors = extractDominantColors;
  window.suggestItemsFromPhoto = suggestItemsFromPhoto;
})();


/* ===== js/fit-r1.js ===== */
// fit-r1.js — make the .tile-grid fill the visible viewport.
// Picks columns by viewport width, rows = ceil(tiles/cols), then sets
// grid-template-rows + an explicit container height = (viewport - gridTop - bottomMargin).
// Tiles drop their aspect-ratio so they grow/shrink to fill cells.

(function() {
  const BOTTOM_MARGIN = 20;

  function pickColumns(tileCount, viewportWidth) {
    let cols;
    if (viewportWidth >= 1440) cols = 6;
    else if (viewportWidth >= 1200) cols = 5;
    else if (viewportWidth >= 900)  cols = 4;
    else if (viewportWidth >= 600)  cols = 3;
    else                            cols = 2;
    return Math.min(cols, tileCount);
  }

  function fitTileGrid() {
    const grid = document.querySelector('.tile-grid');
    if (!grid) return;
    const tiles = grid.querySelectorAll('.tile');
    if (!tiles.length) return;

    const cols = pickColumns(tiles.length, window.innerWidth);
    const rows = Math.ceil(tiles.length / cols);

    // Available vertical space: viewport - grid's top offset - bottom margin
    grid.style.height = '';                // reset before measuring
    grid.classList.remove('tile-grid-fitted');
    const top = grid.getBoundingClientRect().top + window.scrollY;
    const scrollTop = window.scrollY;
    const available = window.innerHeight - (top - scrollTop) - BOTTOM_MARGIN;

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    if (available > 120) {
      grid.style.height = available + 'px';
      grid.classList.add('tile-grid-fitted');
    }
  }

  // Tile grid renders inside #main via innerHTML. Try a few times after navigation
  // until tiles are present.
  function fitWhenReady() {
    let tries = 0;
    (function attempt() {
      const grid = document.querySelector('.tile-grid');
      if (grid && grid.querySelectorAll('.tile').length > 0) {
        fitTileGrid();
      } else if (tries++ < 8) {
        setTimeout(attempt, 60);
      }
    })();
  }

  window.addEventListener('hashchange', () => setTimeout(fitWhenReady, 50));
  window.addEventListener('resize', () => {
    // Cheap throttle
    if (window._fitT) cancelAnimationFrame(window._fitT);
    window._fitT = requestAnimationFrame(fitTileGrid);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fitWhenReady);
  } else {
    fitWhenReady();
  }

  // Expose for manual triggering after sign-in / redraws
  window.fitTileGrid = fitTileGrid;
  window.fitWhenReady = fitWhenReady;
})();


/* ===== js/theme-r2.js ===== */
// theme-r2.js — palette toggle (B&W / Warm / Dark), per-user storage
(function() {
  const DEFAULT_KEY = 'vc:theme';
  function userKey() {
    try {
      const u = JSON.parse(sessionStorage.getItem('vc:currentUser') || 'null');
      return u && u.id ? 'vc:theme:' + u.id : null;
    } catch (_) { return null; }
  }
  function readStored() {
    const uk = userKey();
    return (uk && localStorage.getItem(uk)) || localStorage.getItem(DEFAULT_KEY) || 'theme-bw';
  }
  function writeStored(name) {
    const uk = userKey();
    if (uk) localStorage.setItem(uk, name);
    else localStorage.setItem(DEFAULT_KEY, name);
  }
  function applyTheme(name) {
    document.body.classList.remove('theme-bw', 'theme-warm', 'theme-dark');
    document.body.classList.add(name);
    document.querySelectorAll('#themeToggle button').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === name);
    });
  }
  function init() {
    applyTheme(readStored());
    const tg = document.getElementById('themeToggle');
    if (tg) {
      tg.addEventListener('click', e => {
        const btn = e.target.closest('button[data-theme]');
        if (!btn) return;
        applyTheme(btn.dataset.theme);
        writeStored(btn.dataset.theme);
      });
    }
  }
  // Re-apply on user changes (login/logout)
  window.addEventListener('storage', e => {
    if (e.key === 'vc:currentUser') applyTheme(readStored());
  });
  // Expose for app.js to call on sign-in
  window.__refreshTheme = () => applyTheme(readStored());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ===== js/github-sync-r1.js ===== */
// github-sync-r1.js — daily auto-backup of the closet to a GitHub repo.
//
// Stores a fine-grained PAT in localStorage as 'vc:githubSync'. On every
// app load, if >24h since last successful backup, exports the closet
// (using dbExportAll) and PUTs it to data/backup-latest.json in the repo
// via GitHub's REST API. Also exposes a manual "Backup now" button via a
// settings modal opened from the sidebar.

(function() {
  const LS_KEY = 'vc:githubSync';
  const DEFAULT_OWNER  = 'tmquinones';
  const DEFAULT_REPO   = 'virtual-closet';
  const DEFAULT_BRANCH = 'main';
  const DEFAULT_PATH   = 'data/backup-latest.json';
  const AUTO_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24h

  function getConfig() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_) { return null; }
  }
  function saveConfig(cfg) {
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  }
  function clearConfig() {
    localStorage.removeItem(LS_KEY);
  }

  // Convert a string to base64 (handles unicode safely)
  function utf8ToB64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  async function ghApi(path, opts = {}) {
    const cfg = getConfig();
    if (!cfg || !cfg.token) throw new Error('GitHub Sync not configured');
    const headers = Object.assign({
      'Accept': 'application/vnd.github+json',
      'Authorization': 'Bearer ' + cfg.token,
      'X-GitHub-Api-Version': '2022-11-28',
    }, opts.headers || {});
    const res = await fetch('https://api.github.com' + path, {
      ...opts,
      headers,
    });
    const text = await res.text();
    let body;
    try { body = text ? JSON.parse(text) : null; }
    catch (_) { body = text; }
    if (!res.ok) {
      const msg = (body && body.message) ? body.message : ('HTTP ' + res.status);
      throw new Error(msg);
    }
    return body;
  }

  // Fetch the current SHA of the file (needed by the PUT call to update an
  // existing file). Returns null if the file doesn't exist yet.
  async function getCurrentSha() {
    const cfg = getConfig();
    try {
      const data = await ghApi(
        `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}?ref=${encodeURIComponent(cfg.branch)}`,
        { method: 'GET' }
      );
      return data && data.sha ? data.sha : null;
    } catch (err) {
      // 404 = file doesn't exist, that's fine on first backup
      if (/Not Found/i.test(err.message)) return null;
      throw err;
    }
  }

  let _uploadInFlight = false;
  async function uploadBackup() {
    if (_uploadInFlight) {
      throw new Error('A backup is already in progress — wait a moment and try again');
    }
    _uploadInFlight = true;
    try {
      const cfg = getConfig();
      if (!cfg || !cfg.token) throw new Error('GitHub Sync not configured');
      const data = await dbExportAll();
      const json = JSON.stringify(data);
      const doPut = async (sha) => {
        const body = {
          message: 'Auto-backup ' + new Date().toISOString(),
          content: utf8ToB64(json),
          branch: cfg.branch
        };
        if (sha) body.sha = sha;
        return ghApi(
          `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(cfg.path)}`,
          { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }
        );
      };
      let sha = await getCurrentSha();
      try {
        await doPut(sha);
      } catch (err) {
        // SHA mismatch — file changed between GET and PUT. Re-fetch SHA and try once more.
        if (/does not match|conflict/i.test(err.message)) {
          sha = await getCurrentSha();
          await doPut(sha);
        } else {
          throw err;
        }
      }
      cfg.lastBackupAt = Date.now();
      cfg.lastBackupSize = json.length;
      cfg.lastError = null;
      saveConfig(cfg);
      return { size: json.length, when: cfg.lastBackupAt };
    } finally {
      _uploadInFlight = false;
    }
  }

  async function maybeAutoBackup() {
    const cfg = getConfig();
    if (!cfg || !cfg.token || cfg.autoBackup === false) return;
    const since = Date.now() - (cfg.lastBackupAt || 0);
    if (since < AUTO_INTERVAL_MS) return;
    try {
      await uploadBackup();
      if (typeof showToast === 'function') showToast('Auto-backup saved to GitHub');
    } catch (err) {
      console.warn('Auto-backup failed:', err);
      const c = getConfig();
      if (c) { c.lastError = err.message; saveConfig(c); }
    }
  }

  // ===== Settings modal =====
  function openSyncModal() {
    const cfg = getConfig() || {
      owner: DEFAULT_OWNER, repo: DEFAULT_REPO, branch: DEFAULT_BRANCH,
      path: DEFAULT_PATH, token: '', autoBackup: true
    };
    const last = cfg.lastBackupAt
      ? new Date(cfg.lastBackupAt).toLocaleString()
      : 'never';
    const html = `
      <div class="gh-sync-modal">
        <h2 style="font-family: 'Playfair Display', serif; margin: 0 0 8px;">GitHub Sync</h2>
        <p class="muted" style="font-size: 13px; margin: 0 0 16px;">
          Auto-backs up your closet to <a href="https://github.com/${cfg.owner}/${cfg.repo}" target="_blank" rel="noopener">${cfg.owner}/${cfg.repo}</a> once per day.
          See <code>GITHUB-SYNC-SETUP.md</code> in your project folder for how to create a token.
        </p>
        <div class="field">
          <label class="field-label" for="ghSyncToken">Personal Access Token</label>
          <input class="input" id="ghSyncToken" type="password" placeholder="github_pat_..." value="${cfg.token ? cfg.token.replace(/"/g,'&quot;') : ''}">
          <div class="muted" style="font-size: 11px; margin-top: 4px;">Stored only in this browser's localStorage. Scope: contents:write to ${cfg.owner}/${cfg.repo} only.</div>
        </div>
        <details style="margin: 12px 0;">
          <summary class="muted" style="font-size: 12px; cursor: pointer;">Advanced (owner / repo / branch / path)</summary>
          <div class="field"><label class="field-label">Owner</label><input class="input" id="ghSyncOwner" value="${cfg.owner}"></div>
          <div class="field"><label class="field-label">Repo</label><input class="input" id="ghSyncRepo" value="${cfg.repo}"></div>
          <div class="field"><label class="field-label">Branch</label><input class="input" id="ghSyncBranch" value="${cfg.branch}"></div>
          <div class="field"><label class="field-label">File path</label><input class="input" id="ghSyncPath" value="${cfg.path}"></div>
        </details>
        <div class="field">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
            <input type="checkbox" id="ghSyncAuto" ${cfg.autoBackup !== false ? 'checked' : ''}>
            Auto-backup once per day on app open
          </label>
        </div>
        <div class="muted" style="font-size: 12px; margin: 12px 0;">
          Last backup: <strong>${last}</strong>${cfg.lastBackupSize ? ` · ${(cfg.lastBackupSize/1024).toFixed(1)} KB` : ''}
          ${cfg.lastError ? `<br><span style="color:#a02020;">Last error: ${escapeHtml(cfg.lastError)}</span>` : ''}
        </div>
        <div class="form-actions" style="display:flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-primary" id="ghSyncSaveBackup">Save &amp; back up now</button>
          <button class="btn" id="ghSyncBackupOnly">Back up now</button>
          <button class="btn btn-ghost" id="ghSyncForget">Forget token</button>
        </div>
      </div>
    `;
    if (typeof showModalHtml === 'function') {
      showModalHtml(html);
    } else {
      // Fallback: build minimal modal manually
      const m = document.getElementById('modal');
      const c = document.getElementById('modalContent');
      if (m && c) { c.innerHTML = html; m.hidden = false; }
    }

    function readForm() {
      return {
        token: (document.getElementById('ghSyncToken').value || '').trim(),
        owner: (document.getElementById('ghSyncOwner') || {value: cfg.owner}).value.trim() || cfg.owner,
        repo:  (document.getElementById('ghSyncRepo')  || {value: cfg.repo}).value.trim()  || cfg.repo,
        branch:(document.getElementById('ghSyncBranch')|| {value: cfg.branch}).value.trim()|| cfg.branch,
        path:  (document.getElementById('ghSyncPath')  || {value: cfg.path}).value.trim()  || cfg.path,
        autoBackup: !!document.getElementById('ghSyncAuto').checked,
        lastBackupAt: cfg.lastBackupAt || 0,
        lastBackupSize: cfg.lastBackupSize || 0,
        lastError: cfg.lastError || null,
      };
    }
    async function saveAndBackup() {
      const next = readForm();
      if (!next.token) { alert('Paste your token first.'); return; }
      saveConfig(next);
      try {
        const r = await uploadBackup();
        showToast(`Backup saved (${(r.size/1024).toFixed(1)} KB)`);
        openSyncModal(); // refresh
      } catch (err) {
        alert('Backup failed: ' + err.message);
      }
    }

    setTimeout(() => {
      const sb = document.getElementById('ghSyncSaveBackup');
      const bo = document.getElementById('ghSyncBackupOnly');
      const fg = document.getElementById('ghSyncForget');
      if (sb) sb.addEventListener('click', saveAndBackup);
      if (bo) bo.addEventListener('click', async () => {
        saveConfig(readForm());
        try {
          const r = await uploadBackup();
          showToast(`Backup saved (${(r.size/1024).toFixed(1)} KB)`);
          openSyncModal();
        } catch (err) { alert('Backup failed: ' + err.message); }
      });
      if (fg) fg.addEventListener('click', () => {
        if (confirm('Remove the saved GitHub token from this browser?')) {
          clearConfig();
          showToast('Token forgotten');
          const m = document.getElementById('modal');
          if (m) m.hidden = true;
        }
      });
    }, 0);
  }

  // Wire up sidebar button on DOMContentLoaded
  function wireSidebar() {
    const footer = document.querySelector('.sidebar-footer');
    if (!footer) return;
    if (document.getElementById('ghSyncBtn')) return; // already wired
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost btn-block';
    btn.id = 'ghSyncBtn';
    btn.textContent = 'GitHub Sync';
    btn.addEventListener('click', openSyncModal);
    // Insert before the export button so it's grouped with backup features
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) footer.insertBefore(btn, exportBtn);
    else footer.appendChild(btn);
  }

  // ===== Boot =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      wireSidebar();
      // Run auto-backup after a short delay so the rest of the app boots first
      setTimeout(maybeAutoBackup, 4000);
    });
  } else {
    wireSidebar();
    setTimeout(maybeAutoBackup, 4000);
  }

  // Expose for debugging
  window.ghSync = { open: openSyncModal, backup: uploadBackup, config: getConfig };
})();
