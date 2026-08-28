#!/usr/bin/env python3
"""Generate Khulna Bites brand/demo assets.

1. Crops the two logo variants (black-on-white, white-on-black) out of the
   brand board and re-exports them as transparent PNGs.
2. Generates editorial placeholder cover images for seed content so the MVP
   looks complete without hotlinking external photography.

Run:  python3 scripts/generate-assets.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
IMG = os.path.join(PUB, "images")
os.makedirs(IMG, exist_ok=True)

PAPER = (250, 247, 241)
INK = (28, 27, 23)
GREEN = (14, 107, 77)
GREEN_DARK = (10, 82, 60)
GREEN_TINT = (228, 239, 233)
AMBER = (217, 142, 27)
AMBER_TINT = (248, 238, 216)
LINE = (229, 223, 210)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def crop_logo(src: str) -> None:
    board = Image.open(src).convert("RGB")
    w, h = board.size
    halves = {"logo-black": (0, 0, w // 2, h), "logo-white": (w // 2, 0, w, h)}
    for name, box in halves.items():
        half = board.crop(box)
        gray = half.convert("L")
        # content = dark pixels for the black version, bright for the white one
        if name == "logo-black":
            mask = gray.point(lambda p: 255 if p < 100 else 0)
        else:
            mask = gray.point(lambda p: 255 if p > 155 else 0)
        bbox = mask.getbbox()
        if not bbox:
            continue
        pad = 18
        l, t, r, b = bbox
        l = max(0, l - pad); t = max(0, t - pad)
        r = min(half.width, r + pad); b = min(half.height, b + pad)
        logo = half.crop((l, t, r, b)).convert("RGBA")
        # make the background transparent
        datas = logo.getdata()
        out = []
        for px in datas:
            if name == "logo-black" and px[0] > 235 and px[1] > 235 and px[2] > 235:
                out.append((255, 255, 255, 0))
            elif name == "logo-white" and px[0] < 20 and px[1] < 20 and px[2] < 20:
                out.append((0, 0, 0, 0))
            else:
                out.append(px)
        logo.putdata(out)
        logo.save(os.path.join(PUB, f"{name}.png"))
        print(f"  {name}.png  {logo.size}")


def cover(filename: str, label: str, kicker: str, bg, fg, accent, style: int) -> None:
    W, H = 1280, 860
    im = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(im)
    fb = ImageFont.truetype(FONT_BOLD, 96)
    fk = ImageFont.truetype(FONT_BOLD, 30)
    fs = ImageFont.truetype(FONT_REG, 26)

    if style == 0:  # big circle
        d.ellipse([W - 560, -220, W + 160, 500], fill=accent)
        d.ellipse([W - 420, -80, W + 20, 360], fill=bg)
    elif style == 1:  # bottom band + dot
        d.rectangle([0, H - 190, W, H], fill=accent)
        d.ellipse([90, 90, 190, 190], outline=accent, width=10)
    elif style == 2:  # side column
        d.rectangle([0, 0, 300, H], fill=accent)
        d.rectangle([300, 0, 316, H], fill=fg)
    else:  # arcs
        for i in range(4):
            d.arc([W - 620 + i * 60, H - 620 + i * 60, W + 220 - i * 60, H + 220 - i * 60],
                  180, 270, fill=accent, width=14)

    # kicker
    d.text((72, 64), kicker.upper(), font=fk, fill=accent if style != 2 else fg)
    # label (word-wrap manually)
    words = label.split()
    lines, cur = [], ""
    for w_ in words:
        trial = (cur + " " + w_).strip()
        if d.textlength(trial, font=fb) > (W - 420 if style == 2 else W - 160):
            lines.append(cur); cur = w_
        else:
            cur = trial
    lines.append(cur)
    y = H // 2 - (len(lines) * 108) // 2
    x = 360 if style == 2 else 72
    for ln in lines:
        d.text((x, y), ln, font=fb, fill=fg)
        y += 108
    d.text((x, y + 16), "KHULNA BITES - DEMO COVER", font=fs,
           fill=accent if style != 2 else fg)
    im.save(os.path.join(IMG, filename), quality=88)
    print(f"  images/{filename}")


if __name__ == "__main__":
    src = os.path.expanduser("~/uploaded_files/khulna-bites-logo.png")
    if os.path.exists(src):
        print("Logos:")
        crop_logo(src)

    print("Covers:")
    specs = [
        ("news-1.jpg", "Rupsha Riverfront Gets a New Walkway", "City", GREEN, PAPER, AMBER, 0),
        ("news-2.jpg", "Khulna's Kacchi Alley: A Food Map", "Food", AMBER_TINT, INK, GREEN, 1),
        ("news-3.jpg", "Sundarbans Tourism Season Opens", "Travel", GREEN_DARK, PAPER, AMBER, 2),
        ("news-4.jpg", "KUET Team Wins National Robotics", "Education", PAPER, INK, GREEN, 3),
        ("news-5.jpg", "Monsoon Prep: City Drains Cleaned", "Civic", GREEN_TINT, INK, GREEN_DARK, 1),
        ("news-6.jpg", "Khulna Shipyard Orders Rise Again", "Business", AMBER, INK, GREEN_DARK, 0),
        ("offer-1.jpg", "20% Off at Boyra Biryani House", "Food Offer", GREEN, PAPER, AMBER, 1),
        ("offer-2.jpg", "Buy 1 Get 1 Coffee, Sonadanga", "Cafe Offer", AMBER_TINT, INK, GREEN, 0),
        ("offer-3.jpg", "Eid Collection Flat 30% Off", "Fashion", GREEN_DARK, PAPER, AMBER, 3),
        ("offer-4.jpg", "Gadget Exchange Bonus Tk 2,000", "Shopping", PAPER, INK, GREEN, 2),
        ("offer-5.jpg", "AC Servicing at Tk 999 Only", "Services", GREEN_TINT, INK, GREEN_DARK, 0),
        ("event-1.jpg", "Khulna Food Fest 2026", "Festival", AMBER, INK, GREEN_DARK, 1),
        ("event-2.jpg", "Borsha Utshob: Open-Air Concert", "Music", GREEN_DARK, PAPER, AMBER, 0),
        ("event-3.jpg", "Rupsha Photography Walk", "Community", GREEN_TINT, INK, GREEN_DARK, 3),
        ("event-4.jpg", "Startup Khulna Meetup Vol. 4", "Tech", PAPER, INK, GREEN, 1),
        ("event-5.jpg", "Inter-School Cricket Final", "Sports", GREEN, PAPER, AMBER, 2),
        ("og-default.jpg", "Khulna, One Bite at a Time", "Khulna Bites", GREEN_DARK, PAPER, AMBER, 1),
    ]
    for s in specs:
        cover(*s)
    print("Done.")
