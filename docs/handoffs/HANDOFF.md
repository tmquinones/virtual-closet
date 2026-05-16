# HANDOFF — Virtual Closet (Hugo + GitHub Pages)

This file is a brief for **Claude Code** (the CLI) running inside VS Code's terminal so it can pick up the project without re-asking the user (ChrTif, cqtq2025@gmail.com) for context.

If you are Claude Code: **read this whole file before doing anything**, then check `PROJECT-LOG.md` for prior phases and `SETUP-CHECKLIST.md` for the user-facing publish steps. Skim the existing app files (index.html, styles.css, etc.) only if relevant to what's being asked.

---

## What this project is

ChrTif's "Virtual Closet" — a digital wardrobe she's been building. Earlier phases produced a custom HTML/CSS/JS single-page app with Supabase backing, item imports from lululemon and other brands, and product photos in `photo-fixes/`.

In the most recent Cowork session (2026-04-29), the user asked for **a Hugo-based version that can be published to GitHub Pages**, plus a beginner-friendly checklist with checkboxes for someone with no prior GitHub/Hugo experience.

The user wants this to be convertible into an app later, so keep the Hugo content/data structure clean (frontmatter-driven, one markdown file per item).

---

## Repo layout (as of handoff)

```
Virtual Closet/
├── HANDOFF.md                ← you are here
├── INSTALL-CLAUDE-CODE.md    ← Windows install guide for Claude Code (for the user)
├── SETUP-CHECKLIST.md        ← user's checkbox guide to publishing to GitHub Pages
├── PROJECT-LOG.md            ← running build log — UPDATE THIS on every non-trivial change
├── ARCHITECTURE-CLOUD.md     ← prior architecture notes (Supabase backend etc.)
├── Virtual-Closet-Pitch-Deck.{pdf,pptx}
├── Virtual-Closet-Commercial-Script.md
│
├── index.html                ← prior single-page app (do NOT touch unless asked)
├── styles.css, editorial.css ← prior app styles
├── js/, dist/, supabase/, photo-fixes/  ← prior app assets
├── *-import.json             ← brand product imports
├── manifest.json, sw.js, build.py
│
└── hugo-site/                ← THE NEW HUGO SITE — work happens here
    ├── hugo.toml
    ├── archetypes/default.md
    ├── content/
    │   ├── _index.md
    │   ├── categories/         (sample-tank-top.md, sample-skirt.md, sample-pants.md)
    │   ├── seasons/            (spring, summer, fall, winter)
    │   ├── colors/             (neutrals, blacks, whites, blues, earth-tones, pastels)
    │   └── outfits/            (sample-weekend-walk.md)
    ├── layouts/
    │   ├── _default/{baseof,home,list,single}.html
    │   └── partials/{head,header,footer,item-card}.html
    ├── static/
    │   ├── css/closet.css      (clean & minimal theme — no external theme used)
    │   └── images/             (drop closet photos here)
    ├── .github/workflows/hugo.yml   (auto-deploy to GitHub Pages on push to main)
    └── .gitignore
```

The Hugo site is **self-contained**. The plan is for the user to push only `hugo-site/` to a new `virtual-closet` GitHub repo — not the whole `Virtual Closet/` folder.

---

## Conventions to follow

- **Theme:** custom inline (no upstream Hugo theme). Tailored CSS lives at `hugo-site/static/css/closet.css`. Fonts are Inter (sans) + Playfair Display (serif). Aesthetic: clean & minimal, gallery cards with 3:4 aspect, soft cream/off-white background.
- **Content model:** every closet item is a markdown file with this frontmatter:

  ```yaml
  title: "Item Name"
  brand: "Brand"
  color: "Color text"
  size: "S/M/L or numeric"
  season: ["Spring", "Summer"]   # array
  tags: ["tops", "casual"]       # array
  image: "/images/filename.jpg"  # leading slash, served from static/images
  ```

- **Sections:** `categories/`, `seasons/`, `colors/`, `outfits/`. The user said tabs/sections should cover "seasons, colors, outfits, etc." — keep this multi-axis structure; do NOT collapse into a single category list.
- **Site URL:** the `baseURL` in `hugo.toml` is a placeholder (`https://YOUR-USERNAME.github.io/virtual-closet/`). The user will replace it; don't pre-fill it from guesses.

---

## What's done

- ✅ Hugo scaffold complete with custom layouts and minimal theme.
- ✅ Sample content in every section so the site renders non-empty out of the box.
- ✅ GitHub Actions workflow at `hugo-site/.github/workflows/hugo.yml` (Hugo 0.128.0, builds + deploys to Pages).
- ✅ Beginner publish checklist (`SETUP-CHECKLIST.md`).
- ✅ Claude Code Windows install guide (`INSTALL-CLAUDE-CODE.md`).
- ✅ This handoff doc.

## What's NOT done (likely next asks from user)

1. **Import existing items.** The user has `lululemon-import.json` and `multi-brand-import.json` (~12 MB) full of real items, plus photos in `photo-fixes/`. A natural next step is a small Python or Node script that reads those JSON files and emits one markdown file per item into `hugo-site/content/categories/`, copying each photo into `hugo-site/static/images/`. **Inspect the JSON shape before writing the importer** — don't assume a format.
2. **Local preview.** Confirm `hugo server` runs cleanly on the user's machine. Build was not test-run in the sandbox (no Hugo binary available there).
3. **Domain choice.** The user picked the repo name `virtual-closet`. If they later move to a custom domain (e.g. `closet.chrtif.com`), update `hugo.toml` and add a `static/CNAME` file.
4. **Mobile-app conversion path.** The user mentioned wanting this convertible to an app eventually. Hugo's static output + a thin React Native or Capacitor wrapper is one route; another is exporting items as JSON for a separate app. Don't build this until asked, but mention the option if relevant.

---

## Working agreements with the user

- **Beginner level.** Default to plain English, click-by-click instructions, checkbox lists. Do not assume CLI fluency.
- **PROJECT-LOG.md must be updated** on any non-trivial change (this is from saved memory). New entries at the top of each phase's bullet list. Use bash heredoc to write to it (Edit/Write tools have a known truncation issue in this workspace — verify with `wc -c` and `tail -3` after every write).
- **Don't touch the prior app files** (`index.html`, `styles.css`, `js/`, etc.) unless the user explicitly asks. The Hugo site is a separate track.

---

## First message to send back to the user

Once Claude Code finishes reading this, a good opener is:

> I've read the handoff. The Hugo site is scaffolded in `hugo-site/` with sample content, a clean & minimal theme, and a GitHub Actions workflow. Want me to (a) help you preview it locally with `hugo server`, (b) write an importer that turns your existing `lululemon-import.json` items into closet pages, or (c) something else?
