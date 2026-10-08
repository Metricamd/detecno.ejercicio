"""Crop exported PNGs to their non-transparent bounds (backgrounds to 1080x1350)."""
import sys
from pathlib import Path
from PIL import Image

for p in Path(sys.argv[1]).glob("*.png"):
    im = Image.open(p).convert("RGBA")
    if p.stem.startswith("fondo-"):
        im = im.crop((0, 0, 2160, 2700)).resize((1080, 1350), Image.LANCZOS)
    else:
        box = im.getchannel("A").point(lambda a: 255 if a > 2 else 0).getbbox()
        if box:
            pad = 8
            im = im.crop((max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad)))
    im.save(p)
