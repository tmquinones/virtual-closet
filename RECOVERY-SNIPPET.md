# Recovery snippet — extract tiffany's closet from github.io

Run this **at `https://tmquinones.github.io/virtual-closet/`** in the
DevTools console. It opens the IndexedDB directly and downloads a JSON
backup of everything (items, outfits, wishlist, capsules, daily log).

The page can be running any version of the site — the snippet doesn't
use any of the page's own code. As long as the origin is right and the
IndexedDB data is still there, it works.

## Step 1 — list what's in IndexedDB

Paste this first to see which databases are available. If DevTools shows
"Don't paste code into the DevTools Console...", type `allow pasting`
once, hit Enter, then paste.

```js
(async () => {
  const dbs = await indexedDB.databases();
  console.table(dbs);
  console.log('localStorage vc:users →', JSON.parse(localStorage.getItem('vc:users') || '[]'));
})();
```

Expected: at least one entry whose name starts with `virtual-closet-`
(probably `virtual-closet-u_<timestamp>_<random>` for your real account,
plus maybe `virtual-closet-guest`). The `localStorage vc:users` line
should show your account record.

**Send me the output** before running step 2 so I can confirm the right
DB to extract.

## Step 2 — extract + download

Once we've confirmed the DB name, paste this. Replace `DB_NAME` with the
exact name from step 1. It opens the DB, reads every store, converts
photo blobs to base64, and triggers a JSON download.

```js
(async () => {
  const DB_NAME = 'virtual-closet-u_REPLACE_ME';  // ← from step 1
  const STORES = ['items', 'outfits', 'wishlist', 'capsules', 'dailyOutfits'];

  function blobToB64(blob) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onloadend = () => res(r.result);  // data URL incl. mime prefix
      r.onerror = rej;
      r.readAsDataURL(blob);
    });
  }
  async function serialise(row) {
    const out = { ...row };
    for (const k of ['photo', 'thumb']) {
      if (out[k] && out[k] instanceof Blob) out[k] = await blobToB64(out[k]);
    }
    if (Array.isArray(out.photos)) {
      out.photos = await Promise.all(out.photos.map(p => p instanceof Blob ? blobToB64(p) : p));
    }
    return out;
  }
  function readStore(db, name) {
    return new Promise((res, rej) => {
      if (!db.objectStoreNames.contains(name)) return res([]);
      const tx = db.transaction(name, 'readonly');
      const req = tx.objectStore(name).getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = () => rej(req.error);
    });
  }

  const db = await new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME);
    r.onsuccess = e => res(e.target.result);
    r.onerror   = e => rej(e.target.error);
  });

  console.log('Opened', DB_NAME, '— stores:', [...db.objectStoreNames]);

  const out = { version: 2, exportedAt: new Date().toISOString() };
  out.items    = await Promise.all((await readStore(db, 'items')).map(serialise));
  out.outfits  = await readStore(db, 'outfits');
  out.wishlist = await Promise.all((await readStore(db, 'wishlist')).map(serialise));
  out.capsules = await readStore(db, 'capsules');
  out.daily    = await Promise.all((await readStore(db, 'dailyOutfits')).map(serialise));

  console.log('Counts:', {
    items:    out.items.length,
    outfits:  out.outfits.length,
    wishlist: out.wishlist.length,
    capsules: out.capsules.length,
    daily:    out.daily.length,
  });

  // Trigger download
  const blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tmf-closet-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);

  console.log('Download triggered. Save the file somewhere safe before doing anything else.');
})();
```

After this runs, you should see a `tmf-closet-backup-2026-05-10.json`
(or similar date) file downloaded. **Save it somewhere safe** — at
minimum the Downloads folder is fine, but copy it to your closet project
folder too as a paranoia backup.

## Step 3 — restore the redirect

Once the JSON is saved, **restore the custom-domain setting on the
github.io repo** so tmfcloset.com works again. (Repo Settings → Pages →
Custom domain → set back to `tmfcloset.com` → Save.)

## Step 4 — upload via the Migrate page

Visit `https://tmfcloset.com/#/migrate`, sign in as whichever account
you want to load the data into, click the file picker, choose the JSON,
and the page does the rest.
