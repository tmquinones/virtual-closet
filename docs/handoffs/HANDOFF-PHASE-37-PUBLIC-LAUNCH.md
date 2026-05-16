# HANDOFF — Phase 37: Harden TMF Closet for public signup

> Goal: get from "works for friends + family today" to "safe to publish
> the URL publicly." Six work items, roughly in priority order. Total
> estimate: one focused session for items 1–4, plus a short follow-up
> session when the second drive arrives.
>
> Context: as of 2026-05-10, the full stack is live (frontend at
> tmfcloset.com v54, backend at api.tmfcloset.com), Tiffany's real
> closet data is migrated, multi-user auth + per-user data isolation
> work. The schema already supports any number of users; signup is
> currently open with **no rate limiting, no email verification, no
> backups, no monitoring**.

---

## Pre-flight: read these first

- `HANDOFF-2026-05-10.md` — what's currently shipped and where it lives
- `HANDOFF-v51.md` — design system + frontend architecture
- `server/SCHEMA.md` — table layout
- `server/src/routes/auth.js` — current signup/signin flow
- `js/auth-r2.js` — frontend auth client

---

## Item 1 — Rate limiting (priority: ⚠️ critical, est. 30 min)

**What:** Confirm `express-rate-limit` (already in package.json) is wired
to every route and tuned per-route. Right now without rate limits, a
single attacker can hammer `/api/auth/signin` with millions of password
guesses against any known username, or flood `/api/auth/signup` with
spam accounts.

**Audit step:**

```bash
# SSH to NAS, look for rateLimit usage
grep -rn "rateLimit\|express-rate-limit" /volume1/docker/tmfcloset/server/src/
```

If only imported but not applied, or applied loosely to all routes,
treat as not-wired.

**Recommended config:**

```js
// server/src/middleware/rateLimit.js (new file)
const rateLimit = require('express-rate-limit');

// Strict — auth endpoints, IP-based
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 10,                    // 10 attempts per IP per 15 min
  message: { error: 'too_many_attempts', detail: 'Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Looser — general API
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,    // 1 min
  max: 120,                    // 120 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
```

In `server/src/index.js`:

```js
const { authLimiter, apiLimiter } = require('./middleware/rateLimit');
app.use('/api/auth', authLimiter, authRouter);
app.use('/api', apiLimiter);  // applies to all routes below
```

**Acceptance:** `curl` `/api/auth/signin` 11 times within 15 min from
same IP — 11th should return 429.

---

## Item 2 — Automated SQLite backup (priority: ⚠️ critical, est. 15 min)

**What:** Nightly snapshot of `/volume1/docker/tmfcloset/db/tmfcloset.db`
to a different location on the NAS. Currently if the DB file corrupts
or the drive dies, every user's closet is gone.

**Implementation:** Synology DSM has a built-in Task Scheduler.

1. DSM → Control Panel → **Task Scheduler** → Create → Scheduled Task → User-defined script.
2. **Name:** `tmfcloset-db-backup`, **User:** `root` (needs container access).
3. **Schedule:** Daily, 3:00 AM.
4. **Task Settings → Run command:**

```bash
#!/bin/bash
TS=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/volume1/backups/tmfcloset"
mkdir -p "$BACKUP_DIR"
# Use sqlite3 inside the running container to get a consistent snapshot
docker exec tmfcloset-api sqlite3 /data/db/tmfcloset.db ".backup /data/db/backup-$TS.db"
# Move the backup out of the container's data volume to /volume1/backups
mv "/volume1/docker/tmfcloset/db/backup-$TS.db" "$BACKUP_DIR/"
# Retain last 14 daily backups
ls -t "$BACKUP_DIR"/backup-*.db | tail -n +15 | xargs -r rm
echo "Backed up to $BACKUP_DIR/backup-$TS.db ($(du -h "$BACKUP_DIR/backup-$TS.db" | cut -f1))"
```

5. **Email notification:** turn on "Send run details by email" only for failures.

**Acceptance:** Run the task manually once. Verify a `backup-*.db` file
appears at `/volume1/backups/tmfcloset/` and is openable by `sqlite3`.

**Future hardening (later):** also copy off-NAS — e.g. to Backblaze B2
or rsync to a friend's NAS — so a fire/theft doesn't take both copies.

---

## Item 3 — Email verification on signup (priority: high, est. 1–2 hours)

**What:** Block login until the user clicks a link emailed to the
address they signed up with. Stops bots from claiming any email.

**Schema:** Add a `verification_tokens` table (or reuse the
`password_reset_tokens` shape):

```sql
CREATE TABLE IF NOT EXISTS verification_tokens (
  token       TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  used_at     TEXT
);

ALTER TABLE users ADD COLUMN email_verified_at TEXT;
```

(Migration `002_email_verification.sql`.)

**Server changes:**

- `POST /api/auth/signup` — create user, generate UUID token, insert
  into `verification_tokens` (24-hour expiry), send email via Resend
  with link `https://tmfcloset.com/#/verify?token=<token>`. Return
  signup success but **do NOT issue JWT yet**.
- `GET /api/auth/verify-email?token=<token>` — look up token, mark
  user.email_verified_at = now, mark token used_at, return success.
  Frontend then prompts user to sign in.
- `POST /api/auth/signin` — reject (`email_not_verified`) when
  `email_verified_at IS NULL`.
- `POST /api/auth/resend-verification` (rate-limited) — for users
  who didn't get the email.

**Frontend changes (js/auth-r2.js + new js/verify-r1.js):**

- Signup form: capture email field in addition to username/password.
- After signup, show "Check your email" state instead of redirecting to
  closet.
- New route `#/verify` that calls `GET /api/auth/verify-email` on load,
  shows success or expired-token state.
- Login screen: show `email_not_verified` error with "Resend
  verification" button.

**Resend email template:**

```
Subject: Verify your That's My Freaking Closet account

Hi {username},

Click the link below to confirm your email and finish setting up
your TMF Closet account:

https://tmfcloset.com/#/verify?token={token}

This link expires in 24 hours. If you didn't sign up, you can
ignore this email.

— TMF Closet
```

**Acceptance:** Sign up with a real email → receive the email → click
the link → page confirms → sign in works. Sign up with a fake email
→ never receive → can't sign in.

---

## Item 4 — Forgot-password flow (priority: high, est. 45 min)

**What:** Self-serve password reset via email. The
`password_reset_tokens` table already exists in the schema.

**Server changes:**

- `POST /api/auth/forgot` — body `{ email }`. Look up user, generate
  UUID token, insert into `password_reset_tokens` (1-hour expiry),
  send email with link `https://tmfcloset.com/#/reset?token=<token>`.
  **Always return 200** even if email isn't registered (avoid leaking
  whether an account exists).
- `POST /api/auth/reset` — body `{ token, new_password }`. Validate
  token, update user's password hash, mark token used.

**Frontend changes:**

- Login screen: "Forgot password?" link below signin button.
- New route `#/forgot` — form with email field.
- New route `#/reset` — form with new password fields, reads token
  from URL.

**Reset email template:**

```
Subject: Reset your TMF Closet password

Hi,

Someone (hopefully you) asked to reset the password for the
@{username} account on TMF Closet. Click the link below to
choose a new password:

https://tmfcloset.com/#/reset?token={token}

This link expires in 1 hour. If you didn't ask for this, you
can ignore this email — your password won't change.

— TMF Closet
```

**Acceptance:** Forgot the password Tiffany just set → request reset
→ get email → set new password → sign in with new password.

---

## Item 5 (optional) — Invite-code gate (priority: medium, est. 30 min)

**Alternative or supplement to email verification.** If the goal is a
controlled rollout (close friends + select beta testers, not Reddit
launch), an invite code is simpler than full email verification.

**Schema:**

```sql
CREATE TABLE IF NOT EXISTS invite_codes (
  code       TEXT PRIMARY KEY,
  created_by TEXT REFERENCES users(id),
  used_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  used_at    TEXT
);
```

**Server change:**

- `POST /api/auth/signup` — require `invite_code` in body. Look up;
  if missing/used/expired, reject. On success, mark used_by = new
  user id.
- `POST /api/admin/invites` (Tiffany-only) — generate N invite codes.

**Frontend change:** Add an "Invite code" field to signup form.

**Acceptance:** Sign up without code → 400. Sign up with valid code
→ success + code is now marked used.

---

## Item 6 — Uptime monitoring (priority: medium, est. 15 min)

**What:** External free service that hits `/api/health` every 5 min and
emails if it's down for 2+ consecutive checks.

**Implementation:** Sign up for UptimeRobot (free tier: 50 monitors,
5-min interval).

1. uptimerobot.com → Sign up with cqtq2025@gmail.com.
2. New monitor:
   - **Type:** HTTPS
   - **URL:** `https://api.tmfcloset.com/api/health`
   - **Interval:** 5 minutes
   - **Keyword (optional):** `"ok":true` — fails if response doesn't contain this string
3. Alert contacts: email cqtq2025@gmail.com. Optionally SMS.

**Acceptance:** Manually `sudo docker compose down` on the NAS to
simulate outage → within 10 min get an email alert. Then `up -d` →
get a recovery email.

---

## Item 7 — Second drive into SHR pool (priority: do when hardware arrives, est. 15 min hands-on + several hours resilver)

**Expected hardware delivery:** ~2026-05-21 (per HANDOFF-v51).

**Steps when drive arrives:**

1. Physically install drive into the next empty bay on the DS425+.
2. DSM → Storage Manager → Storage Pool → click the existing pool →
   **Add Drive** action.
3. Select the new drive, confirm SHR (Synology Hybrid RAID — one-drive
   fault tolerance).
4. Resilver runs in background. NAS stays online and responsive
   during the rebuild.

**Acceptance:** After resilver completes, Storage Pool shows
"Healthy" with 2 drives + 1 drive of redundancy. Now a single drive
failure won't lose data.

---

## Suggested ship order

For a single focused session (~3-4 hours):

1. Item 1 (rate limit) — 30 min
2. Item 2 (backup cron) — 15 min
3. Item 6 (uptime monitor) — 15 min (run while doing other work)
4. Item 4 (password reset) — 45 min — quicker than email verification, validates the email-send plumbing, useful even before verification
5. Item 3 (email verification) — 1–2 hours — biggest piece, but builds on the email plumbing from Item 4

Then **deploy + smoke test each piece**:
- Sign up a test user → verify email arrives → click link → sign in
- Forgot password → email arrives → reset → sign in with new password
- Hit `/api/auth/signin` 11 times fast → see 429
- Kill the container → wait 10 min → uptime email arrives → restart → recovery email

After that batch, public-launch is realistic for a few hundred users.

Item 5 (invite codes) only if Tiffany wants a controlled beta phase
between "friends and family" and "public on internet" — skip if she's
going straight from beta to public.

Item 7 (second drive) is hardware-bound and independent — slot it in
when the drive lands.

---

## Things explicitly NOT in scope for Phase 37

These would be needed if traffic gets serious, but aren't blocking
a small public launch:

- CDN for photos (currently every photo request hits the NAS through
  Cloudflare Tunnel — fine for hundreds of users, painful for tens
  of thousands)
- Migrating from SQLite to Postgres (SQLite handles low-to-mid
  thousands of concurrent users easily; only worth migrating when
  there's actual write contention)
- Multi-region or HA setup (current setup goes down if Tiffany's
  home internet goes down — acceptable for v1)
- Account deletion flow (legal-requirement-ish for GDPR; nice-to-have
  but not blocker for friends-and-family launch)
- 2FA (good to have eventually but most personal apps don't ship
  with it in v1)
- Audit logs / admin dashboard (Tiffany can `sqlite3` directly when
  needed)
- Photo upload via API on the Add Item flow (this is a feature bug,
  not a hardening bug — already on the v44 backlog)

---

## Gotchas carried over from prior sessions

- **`scp -O` always** when pushing source from Windows PowerShell to
  the NAS. Plain `scp` errors with subsystem-request-failed.
- **Bundle source-list audit after every build** — v52 silently
  dropped `drawer-r1.js`. Always re-check by:
  `head -3 dist/app.bundle.js | grep -oE "js/[a-z0-9_-]*\.js" | wc -l`
  → should be 44.
- **Edit-tool truncation footgun** — for `.js` source edits >10 lines,
  use Python heredoc via bash, not the Edit tool. Always
  `node --check <file>` after any edit.
- **PowerShell vs SSH vs DevTools Console** — three windows, three
  syntaxes. Specify which window each command goes in.
- **Service worker refresh after every ship** — DevTools → Application
  → unregister + clear site data. The SW caches the bundle.
- **Cloudflare cache** — purge if the site 404s after a config change
  (Cache → Configuration → Purge Everything).

---

## Open questions for Tiffany before starting Phase 37

1. Public launch or invite-only beta first? (Affects whether Item 5 is
   in or out.)
2. Email address for verification + password-reset emails — sender
   `noreply@tmfcloset.com` matches the Resend setup. Reply-to address?
   (Probably `cqtq2025@gmail.com` or none.)
3. Acceptable rate limit numbers? Defaults above (10 auth/15min,
   120 api/min) are reasonable; can be tuned.
4. Want SMS alerts on downtime in addition to email? (UptimeRobot
   free tier supports email; SMS requires paid tier.)

---

_Written 2026-05-10 evening. Pickup brief for the next focused
hardening session — pickable up cold by a fresh Claude session
given the prior HANDOFF-*.md files for current-state context._
