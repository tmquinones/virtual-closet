# CLAUDE.md — TMF Closet (That's My Freaking Closet) pickup brief

> Read this top-to-bottom before doing anything in this project. It is
> the canonical "what's running, where things live, how to ship, what
> to watch out for" doc. Refreshed 2026-05-10 end-of-day, post-Phase-36.
>
> **For session-specific recent history**, read the latest dated
> `HANDOFF-YYYY-MM-DD.md` (most recent: `HANDOFF-2026-05-10.md`).
> **For long-form build log**, see `PROJECT-LOG.md`.
> **For the next planned work**, see `HANDOFF-PHASE-37-PUBLIC-LAUNCH.md`.

---

## TL;DR — What this project is now

**TMF Closet** ("That's My Freaking Closet") is a virtual closet web
app for Tiffany Foster. **It's a full stack as of 2026-05-10:**

- **Frontend:** static HTML/CSS/vanilla JS, no framework, no build step
  except a Python concat into `dist/app.bundle.js`. Lives at
  `https://tmfcloset.com`. Served via GitHub Pages from the `hugo-site/`
  subfolder in this repo, custom-domain via Cloudflare DNS.
- **Backend:** Node/Express + better-sqlite3 + JWT, in a Docker
  container on Tiffany's DS425+ NAS, exposed via Cloudflare Tunnel at
  `https://api.tmfcloset.com`. 12 routers cover items, outfits,
  wishlist, capsules, daily log, notes, feedback, preferences, photos,
  auth, migrate, health.
- **Per-user multi-tenancy works.** Multiple users can sign up; each
  gets isolated data via `user_id` foreign keys + JWT-scoped queries.
- **Photos** stored on the NAS filesystem at
  `/volume1/docker/tmfcloset/photos/<user_id>/<kind>/<uuid>.<ext>`.
  Served via `/api/photos`.
- **Tiffany's real closet** (176 items, 3 outfits, 6 wishlist,
  1 capsule, 3 daily) is migrated and live.

**Current frontend version:** `?v=1778464290732`, cache
`tmfcloset-v54`, 528 KB / 44 sources.

**Current backend container:** `tmfcloset-api` on the NAS, restart
policy `unless-stopped`, healthy.

**Status of "ready for public signup":** functionally yes (auth +
isolation work), but **not hardened**. See
`HANDOFF-PHASE-37-PUBLIC-LAUNCH.md` for the rate-limiting + backups +
email-verification + monitoring plan that should ship before
publishing the URL publicly.

---

## User context

- **Tiffany Foster** — GitHub: `tmquinones`. Email:
  `cqtq2025@gmail.com`. NAS admin user: `tq_admin`. Resend account:
  `tmfoster4`.
- **Not a developer.** Keep guidance terse and concrete: exact
  PowerShell commands, exact button labels, exact paths.
- **Always specify which window** each command belongs in:
  - **PowerShell** for `git`, `curl`, `scp`, `cd`, file ops
  - **SSH** (NAS) for `docker compose`, `vi`, server-side file ops
  - **DevTools Console** for JavaScript (`document.querySelector...`)
- **DevTools paste warning:** if "Don't paste code into the DevTools
  Console..." dialog appears, she types `allow pasting` once + Enter
  to unlock.

---

## Repo layout

```
Virtual Closet/                              ← project root (source-of-truth working copy)
├── CLAUDE.md                                ← THIS FILE — read first
├── HANDOFF-YYYY-MM-DD.md                    ← session-specific recent history (read latest)
├── HANDOFF-v43.md / HANDOFF-v51.md          ← older handoffs (historical reference)
├── HANDOFF-PHASE-37-PUBLIC-LAUNCH.md        ← next planned hardening session
├── PROJECT-LOG.md                           ← long-form running build log (Phases 1–36)
├── RECOVERY-SNIPPET.md                      ← IndexedDB extraction snippet (kept for reference)
├── tmf-closet-backup-*.json                 ← paranoia copies of Tiffany's migrated JSON
├── DEPLOY.ps1                               ← PowerShell deploy helper (git pull --rebase + push)
├── index.html                               ← top-header + drawer + page-hero + login overlay
├── styles.css / editorial.css /
│   style-guide-r1.css                       ← stylesheet stack (locked design system in style-guide-r1)
├── sw.js                                    ← service worker, bumped CACHE_NAME per release
├── manifest.json                            ← PWA manifest
├── dist/app.bundle.js                       ← built bundle (44 sources, ~528 KB)
├── js/                                      ← 44 source modules (see "Bundle build" below)
├── server/                                  ← backend source (Node/Express)
│   ├── src/
│   │   ├── index.js                         ← express app, route mounts
│   │   ├── config.js / db.js / email.js     ← config + DB connection + Resend wrapper
│   │   ├── middleware/                      ← auth + error handler
│   │   ├── migrations/001_initial.sql       ← schema (17 tables + 22 indexes)
│   │   ├── routes/                          ← 12 routers
│   │   └── utils/                           ← photo helpers, token helpers
│   ├── package.json
│   ├── Dockerfile / docker-compose.yml
│   ├── SCHEMA.md                            ← schema design doc (frozen)
│   └── README.md
└── hugo-site/                               ← GIT REPO published to GitHub Pages
    └── (mirrors index.html, sw.js, dist/, style-guide-r1.css, etc.)
```

**Deploy model:**
- Source files at project root are the working copy.
- Code changes are made there, bundled, then SYNCED into `hugo-site/`,
  then `hugo-site/` is the actual git repo that gets pushed to GitHub.
- The backend `server/` directory is SCP'd to the NAS, never goes
  through git.

---

## Live URLs

| What | URL |
|---|---|
| Frontend | https://tmfcloset.com |
| Backend health | https://api.tmfcloset.com/api/health |
| GitHub repo | https://github.com/tmquinones/virtual-closet |
| Cloudflare DNS | https://dash.cloudflare.com → tmfcloset.com zone |
| Resend dashboard | https://resend.com (account `tmfoster4`) |
| NAS DSM | http://192.168.1.144 (LAN only) |
| NAS SSH | `ssh tq_admin@192.168.1.144` (LAN only) |

**Cloudflare Tunnel** `tmfcloset-nas` exposes the NAS to the public
internet at `api.tmfcloset.com`. No port forwarding involved.

---

## Frontend deploy workflow

1. Edit JS in `js/*.js`. **Always** `node --check <file>` after any
   non-trivial edit (the Edit/Write tools intermittently truncate
   files — see Gotchas).
2. **Rebuild the bundle** (paste-ready below, do NOT use the old
   `build.py`):

   ```bash
   cd "/sessions/<session>/mnt/Virtual Closet"
   python3 << 'EOF'
   import time
   from pathlib import Path
   ROOT = Path('.'); DIST = ROOT/'dist'; DIST.mkdir(exist_ok=True)
   SOURCES = [
     'js/data-r9.js','js/utils-r1.js','js/colorpick-r1.js','js/auth-r2.js','js/db-r4.js',
     'js/closet-r10.js','js/wear-r1.js','js/bgremove-r1.js','js/lookbook-r1.js','js/style-dna-r1.js',
     'js/rotation-r1.js','js/resale-r1.js','js/outfits-r7.js','js/color-pairs-r1.js','js/browse-r3.js',
     'js/app-r11.js','js/recover-r1.js','js/audit-r1.js','js/insights-r7.js','js/wishlist-r6.js',
     'js/girlmath-r3.js','js/trip-r1.js','js/compare-r1.js','js/outfit-feedback-r1.js','js/flatlay-r1.js',
     'js/ratings-r1.js','js/capsule-r1.js','js/returned-r1.js','js/daily-r1.js','js/slideshow-r1.js',
     'js/notes-r1.js','js/receipts-r1.js','js/returns-due-r1.js','js/shop-r1.js','js/top10-r1.js',
     'js/cartimport-r1.js','js/emailimport-r1.js','js/migrate-r1.js','js/fit-r1.js','js/theme-r2.js',
     'js/github-sync-r1.js','js/drawer-r1.js','js/scheme-r1.js','js/photo-suggest-r1.js',
   ]
   missing = [s for s in SOURCES if not (ROOT/s).exists()]
   if missing: print('MISSING:', missing); raise SystemExit(1)
   out = [f'/* TMF Closet bundle — built {time.strftime("%Y-%m-%d %H:%M:%S")} */',
          f'/* Sources: {", ".join(SOURCES)} */', '']
   for rel in SOURCES:
       out.append(f'\n/* ===== {rel} ===== */'); out.append((ROOT/rel).read_text())
   (DIST/'app.bundle.js').write_text('\n'.join(out))
   print(f'Wrote {(DIST/"app.bundle.js").stat().st_size} bytes, {len(SOURCES)} sources')
   EOF
   node --check dist/app.bundle.js && echo BUNDLE_OK
   ```

   **44 sources is the correct count. ALWAYS verify after build:**
   ```bash
   head -3 dist/app.bundle.js | grep -oE "js/[a-z0-9_-]*\.js" | wc -l
   ```

3. **Bump cache buster** in two places:
   - `index.html`: `<script src="dist/app.bundle.js?v=NEW_TIMESTAMP">`
   - `sw.js`: `const CACHE_NAME = 'tmfcloset-vNN';`
   Use `int(time.time() * 1000)` for the timestamp.

4. **Sync to hugo-site:**

   ```bash
   cp index.html sw.js style-guide-r1.css hugo-site/
   cp dist/app.bundle.js hugo-site/dist/app.bundle.js
   ```

5. **Push** from PowerShell:

   ```powershell
   cd "C:\Users\admin\Documents\Claude\Projects\Virtual Closet\hugo-site"
   git push
   ```

   (Or `.\DEPLOY.ps1 "<commit msg>"` from the project root, which adds
   `git pull --rebase` first.)

6. **Tiffany must clear the service worker after every ship:**
   - F12 → Application → Service Workers → **Unregister**
   - Storage → **Clear site data** (since we're on the API now, IndexedDB
     is empty/unused on tmfcloset.com origin — safe to clear everything)
   - Reload → sign back in.
   - Verify with DevTools Console:
     ```js
     document.querySelector('script[src*="app.bundle"]').src
     ```
     Should end in the new `?v=...`.

---

## Backend deploy workflow

```powershell
# From PowerShell, project root
cd "C:\Users\admin\Documents\Claude\Projects\Virtual Closet"
scp -O -r server\src tq_admin@192.168.1.144:/volume1/docker/tmfcloset/server/
```

**`-O` is mandatory** — Windows OpenSSH ↔ Synology DSM legacy SCP
compatibility.

Then from SSH:

```bash
ssh tq_admin@192.168.1.144
cd /volume1/docker/tmfcloset/server
sudo docker compose restart                 # picks up src/ changes
sudo docker compose logs --tail=30          # confirm clean boot
```

For dependency changes (`package.json`):

```bash
sudo docker compose down
sudo docker compose build
sudo docker compose up -d
```

**Smoke test from any browser:**
- https://api.tmfcloset.com/api/health → 200 with JSON
- https://api.tmfcloset.com/api/items → 401 `missing_authorization` (proves route mounted)

---

## Backend on the NAS

```
/volume1/docker/tmfcloset/
├── server/                                  ← scp'd source
├── db/tmfcloset.db                          ← SQLite (don't touch directly)
├── photos/<user_id>/<kind>/<uuid>.<ext>     ← user-uploaded photos
└── secrets/
    ├── jwt.secret                           ← 64 random hex bytes
    └── email.key                            ← Resend API key (re_xxxxx...)
```

Secrets are read at container boot via `*_FILE` env vars set in
`docker-compose.yml`.

**Container management:**
```bash
sudo docker compose ps                       # status
sudo docker compose logs --tail=50           # recent logs
sudo docker compose logs -f                  # live tail
sudo docker compose restart                  # src/ only
sudo docker compose down && sudo docker compose up -d  # full restart
```

---

## ⚠️ Critical gotchas

### 1. The Edit/Write tool truncation footgun

**The Edit and Write tools intermittently truncate files** — the new
file ends at the same byte count as the prior version, dropping the
tail. Bit me at minimum 6 times across the past few sessions on
`.js`, `.html`, `.md`, and migration SQL.

**Detection:** Always `node --check <file>` after any `.js` edit, or
visually verify tail length on non-JS files.

**Recovery patterns:**
- For `.js`: extract original from `dist/app.bundle.js` section markers
  (`/* ===== js/<file> ===== */`), then re-apply edit via Python
  `str.replace()` via bash heredoc (NOT the Edit tool).
- For `.html` / `.md`: use `head -n <last-clean-line>` + heredoc to
  append the missing tail.
- For `.sql`: same pattern.

**Prevention:** For any edit >10 lines, prefer Python heredoc via
`mcp__workspace__bash`:

```bash
python3 << 'PYEOF'
from pathlib import Path
p = Path('path/to/file.js')
text = p.read_text()
old = "unique anchor"
new = "replacement"
assert old in text and text.count(old) == 1
p.write_text(text.replace(old, new))
PYEOF
node --check path/to/file.js
```

### 2. Bundle source-list silent drops

**v52 dropped `drawer-r1.js` + `scheme-r1.js` from the SOURCES list
silently**, breaking the hamburger menu for two days. v53 dropped them
again. v54 restored them.

After every bundle build:
```bash
head -3 dist/app.bundle.js | grep -oE "js/[a-z0-9_-]*\.js" | wc -l
```
Expected: **44**. Drop without explanation = a file got cut.

### 3. `scp -O` always

Windows OpenSSH defaults to SFTP, which Synology DSM doesn't support.
Plain `scp` errors with `subsystem request failed`. **Always
`scp -O`** when going from Windows to NAS.

### 4. Service worker cache lag

After every ship, Tiffany must Unregister SW + Clear site data +
reload + sign in again. Hard-refresh (Ctrl+F5) alone is not enough
because the SW intercepts the bundle request.

### 5. Three windows, three syntaxes

PowerShell vs SSH vs DevTools Console — easy to paste in the wrong
one. If a JS-looking command errors with "not recognized as a cmdlet,"
it was pasted in PowerShell instead of DevTools.

### 6. Cloudflare cache 404s

If the site shows 404 after a config change, purge Cloudflare cache:
Cloudflare → tmfcloset.com → Caching → Configuration → **Purge
Everything**. (Cloudflare caches 404 responses with a long TTL.)

### 7. Custom-domain on/off cycle re-verifies

Removing custom domain from repo Pages settings, then re-adding it,
re-triggers user-level verified-domains TXT-record check (since
Tiffany has verified domains enabled). The TXT record always has the
same hostname (`_github-pages-challenge-tmquinones.tmfcloset.com`)
with a fresh challenge value each time. Add to Cloudflare DNS, Verify
in GitHub, done in 30 sec.

### 8. CNAME-flip data recovery

If we ever need to extract IndexedDB data from the github.io origin
again, see `RECOVERY-SNIPPET.md`. Important: use a **normal browser
tab** (NOT incognito — separate storage) with DevTools "Disable cache"
enabled. Disable the repo's custom domain first to stop the redirect.

### 9. Never wipe IndexedDB without consent

Pre-migration, every user's closet lived in IndexedDB scoped to the
origin. Post-migration, IndexedDB is empty on `tmfcloset.com` (data
on the NAS). But `tmquinones.github.io` still has the source-of-truth
copy of Tiffany's pre-migration data. Don't `indexedDB.deleteDatabase`
that origin without an explicit ask.

---

## Multi-user readiness

The schema fully supports multiple users — every closet table has
`user_id` foreign keys, every route scopes queries via `req.userId`
from the JWT. Two users can sign up right now and they'll have
isolated data.

**What's NOT yet wired before public signup is safe:**

1. Rate limiting on `/api/auth/*` (DoS / brute-force protection)
2. Automated SQLite backups (currently zero backups exist)
3. Email verification on signup (currently any email works)
4. Forgot-password flow (table exists, endpoints don't)
5. Uptime monitoring (no alerts if container dies)
6. Second drive in SHR pool (no fault tolerance against single drive
   failure — second drive arrives ~2026-05-21)

Plan for these: `HANDOFF-PHASE-37-PUBLIC-LAUNCH.md`. Until that
ships, the URL is fine for friends and family but **not for public
posting**.

---

## Style / brand context

- **Brand:** "That's My Freaking Closet" — pronounceable as TMF
  Closet, wordmark is lowercase `tmf`.
- **Tagline:** "Wear what you have. Buy what you love."
- **Aesthetic:** editorial / warm-organic. Coastal & Co + Waldor & Co
  + architectural moodboard references.
- **Typography:** Cormorant Garamond (italic headlines) + Inter (body).
- **Palette:** 8 named schemes locked in `style-guide-r1.css`. Each
  route gets one scheme via `js/scheme-r1.js`.
- **Navigation:** top header (≡ left, `tmf` center, ⌕ + ○ right), no
  permanent sidebar. Drawer slides in from left with 7 grouped
  sections.

---

## On deck (post-Phase-37, in rough priority order)

- **Phase 37: harden for public signup** (next session — see plan doc)
- **Photo upload via API** on the Add Item flow (currently `/api/photos`
  only serves, doesn't accept)
- **Search modal** (`⌕` button is still a placeholder)
- **Theme toggle relocation** (sidebar is hidden; toggle is invisible)
- **Two cosmetic console warnings:** `mobile-web-app-capable` meta +
  favicon 404
- **Cloudflare A-record proxy mode audit** (currently proxied; DNS-only
  is recommended for GitHub Pages custom domains)

---

## How to resume in a future session

1. Read this file (`CLAUDE.md`) top-to-bottom.
2. Read the latest `HANDOFF-YYYY-MM-DD.md` for session-specific recent
   state.
3. If picking up Phase 37, read `HANDOFF-PHASE-37-PUBLIC-LAUNCH.md`.
4. Confirm with Tiffany before any non-trivial change:
   - "Is the backend container still healthy?" → run
     `curl https://api.tmfcloset.com/api/health` first.
   - "What's the goal for this session?" → pick from on-deck list or
     her explicit ask.
5. Use TodoWrite for any multi-step task.
6. **Always update `PROJECT-LOG.md`** after meaningful work.
7. **Always write a fresh `HANDOFF-YYYY-MM-DD.md`** at end of session.

---

_Last updated 2026-05-10 end-of-day. v54 frontend + full backend live._
