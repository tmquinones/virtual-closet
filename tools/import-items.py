#!/usr/bin/env python3
"""
Imports closet items from the prior app's JSON exports into Hugo content.

Reads:    Virtual Closet/lululemon-import.json
          Virtual Closet/multi-brand-import.json
Writes:   hugo-site/content/categories/<slug>.md   (one per item)
          hugo-site/static/images/<slug>.jpg       (decoded photo)

Run from anywhere; it computes paths relative to the repo root.
"""
from __future__ import annotations
import base64, json, re, sys
from pathlib import Path

REPO_ROOT  = Path(__file__).resolve().parents[2]      # Virtual Closet/
HUGO_ROOT  = REPO_ROOT / "hugo-site"
CONTENT    = HUGO_ROOT / "content" / "categories"
IMAGES     = HUGO_ROOT / "static" / "images"
SOURCES    = [
    REPO_ROOT / "lululemon-import.json",
    REPO_ROOT / "multi-brand-import.json",
]

SAMPLE_FILES = ("sample-tank-top.md", "sample-skirt.md", "sample-pants.md")

def slugify(*parts: str) -> str:
    """brand+name → 'lululemon-wunder-train-racerback-tank'"""
    text = " ".join(p for p in parts if p)
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "item"

def decode_photo(data_uri: str | None) -> tuple[bytes, str] | None:
    """Returns (bytes, ext) or None. Handles 'data:image/jpeg;base64,...'."""
    if not data_uri or not data_uri.startswith("data:"):
        return None
    try:
        head, b64 = data_uri.split(",", 1)
    except ValueError:
        return None
    ext = "jpg"
    if "image/png" in head: ext = "png"
    elif "image/webp" in head: ext = "webp"
    elif "image/gif" in head: ext = "gif"
    try:
        return base64.b64decode(b64), ext
    except Exception:
        return None

def yaml_str(s: str | None) -> str:
    """Quote a string for YAML, handling embedded quotes."""
    if s is None: return '""'
    s = str(s).replace('"', '\\"').replace("\n", " ").strip()
    return f'"{s}"'

def yaml_list(items) -> str:
    if not items: return "[]"
    return "[" + ", ".join(yaml_str(x) for x in items) + "]"

def title_case_seasons(seasons):
    """Normalize ['fall','winter'] → ['Fall','Winter']."""
    out = []
    for s in seasons or []:
        s = str(s).strip()
        if s: out.append(s[0].upper() + s[1:].lower())
    return out

def main():
    CONTENT.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)

    # Remove placeholder sample files (skip if not deletable in this environment)
    for name in SAMPLE_FILES:
        p = CONTENT / name
        if p.exists():
            try:
                p.unlink()
                print(f"  removed placeholder {name}")
            except PermissionError:
                print(f"  ! could not remove {name} (run on host: git rm hugo-site/content/categories/{name})")

    # Collect items, dedupe by (brand, name)
    seen: set[tuple[str, str]] = set()
    items_to_write: list[dict] = []
    for src in SOURCES:
        if not src.exists():
            print(f"  skipping {src.name} (not found)")
            continue
        with src.open() as f:
            data = json.load(f)
        for it in data.get("items", []):
            key = (str(it.get("brand", "")).strip(), str(it.get("name", "")).strip())
            if key in seen: continue
            seen.add(key)
            items_to_write.append(it)
        print(f"  loaded {len(data.get('items', []))} from {src.name}")

    print(f"  {len(items_to_write)} unique items to import")

    written, photos_written = 0, 0
    for it in items_to_write:
        name  = (it.get("name") or "").strip()
        brand = (it.get("brand") or "").strip()
        if not name:
            continue

        slug = slugify(brand, name)
        # Hugo URL collision guard
        original = slug
        n = 2
        while (CONTENT / f"{slug}.md").exists():
            slug = f"{original}-{n}"; n += 1

        # Photo
        photo_field = "/images/placeholder.jpg"  # default if no photo
        decoded = decode_photo(it.get("photo")) or decode_photo(it.get("thumb"))
        if decoded:
            blob, ext = decoded
            (IMAGES / f"{slug}.{ext}").write_bytes(blob)
            photo_field = f"/images/{slug}.{ext}"
            photos_written += 1

        # Build categories list — include garmentType + subtype + lifestyle
        categories = []
        if it.get("garmentType"): categories.append(str(it["garmentType"]).lower())
        if it.get("subtype"):     categories.append(str(it["subtype"]).lower())
        for lc in (it.get("lifestyleCategories") or []):
            if lc: categories.append(str(lc).lower())
        # Dedupe preserving order
        categories = list(dict.fromkeys(categories))

        seasons = title_case_seasons(it.get("seasons"))

        tags = [t for t in (it.get("tags") or []) if t]

        # Body content
        notes = (it.get("notes") or "").strip()
        body = notes if notes else "_(no notes)_"

        # Frontmatter
        front = []
        front.append("---")
        front.append(f"title: {yaml_str(name)}")
        front.append(f"brand: {yaml_str(brand)}")
        if it.get("color"):    front.append(f"color: {yaml_str(it['color'])}")
        if it.get("size"):     front.append(f"size: {yaml_str(it['size'])}")
        if it.get("subtype"):  front.append(f"subtype: {yaml_str(it['subtype'])}")
        if it.get("garmentType"): front.append(f"garmentType: {yaml_str(it['garmentType'])}")
        front.append(f"categories: {yaml_list(categories)}")
        front.append(f"seasons: {yaml_list(seasons)}")
        front.append(f"tags: {yaml_list(tags)}")
        if it.get("purchaseDate"): front.append(f"purchaseDate: {yaml_str(it['purchaseDate'])}")
        if it.get("purchasePrice") is not None:
            front.append(f"purchasePrice: {it['purchasePrice']}")
        front.append(f'image: "{photo_field}"')
        front.append("---")
        front.append("")
        front.append(body)
        front.append("")

        (CONTENT / f"{slug}.md").write_text("\n".join(front))
        written += 1

    print(f"  wrote {written} markdown files")
    print(f"  wrote {photos_written} photo files")

if __name__ == "__main__":
    main()
