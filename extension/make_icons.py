#!/usr/bin/env python3
"""Generate 16/48/128 px icons for the HSN Lookup India Chrome extension.

Design: rounded-square in the hsnlookup.in brand gradient (blue→purple),
with a bold 'HS' mark in white monospace. Matches the site's logo-mark.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path(__file__).parent / "icons"
OUT.mkdir(exist_ok=True)

SIZES = [16, 48, 128]

# Colors (match site)
BG_TOP = (37, 99, 235)      # #2563EB brand blue
BG_BOT = (124, 58, 237)     # #7C3AED purple

def make_gradient(size):
    img = Image.new("RGB", (size, size), BG_TOP)
    px = img.load()
    for y in range(size):
        t = y / max(1, size - 1)
        r = int(BG_TOP[0] * (1 - t) + BG_BOT[0] * t)
        g = int(BG_TOP[1] * (1 - t) + BG_BOT[1] * t)
        b = int(BG_TOP[2] * (1 - t) + BG_BOT[2] * t)
        for x in range(size):
            px[x, y] = (r, g, b)
    return img

def rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask

def find_font(size_px):
    # Try bold monospace fonts on macOS first, then fall back
    candidates = [
        "/System/Library/Fonts/Menlo.ttc",
        "/System/Library/Fonts/SFNSMono.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial Bold.ttf",
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size_px)
        except Exception:
            continue
    return ImageFont.load_default()

for size in SIZES:
    grad = make_gradient(size)
    mask = rounded_mask(size, radius=max(3, size // 6))

    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)

    # Draw "HS" in white — letter size scales with image size.
    d = ImageDraw.Draw(out)
    font_size = max(8, int(size * 0.55))
    font = find_font(font_size)
    text = "HS"
    # Center the text
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) // 2 - bbox[0]
    y = (size - th) // 2 - bbox[1] - (size // 20)  # slight visual centering
    d.text((x, y), text, fill=(255, 255, 255, 255), font=font)

    out.save(OUT / f"icon-{size}.png")
    print(f"wrote icons/icon-{size}.png")
