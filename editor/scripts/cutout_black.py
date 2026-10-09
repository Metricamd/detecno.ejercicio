"""Cut glowing glass illustrations out of a pure black background.

Only the black that surrounds the object (connected to the image border),
plus large pure-black holes such as the inside of a loop, becomes
transparent. In that region alpha follows brightness, so glows fade out
softly; dark parts of the object itself stay opaque.
Usage: python3 scripts/cutout_black.py <in> <out.png> [size]
"""
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
size = int(sys.argv[3]) if len(sys.argv) > 3 else 900
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255
m = im.max(axis=2)
LO, HI = 0.07, 0.30

dark = m < HI
lab, n = ndimage.label(dark)
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bg = np.isin(lab, list(border))
# enclosed holes that are essentially black (e.g. inside the infinity loop)
for i in range(1, n + 1):
    if i in border:
        continue
    comp = lab == i
    if comp.sum() > 1500 and np.median(m[comp]) < 0.04:
        bg |= comp
bg = ndimage.binary_opening(bg, iterations=1)

ramp = np.clip((m - LO) / (HI - LO), 0, 1)
a = np.where(bg, ramp, 1.0)
hue = np.clip(im / np.maximum(m, 1e-3)[..., None], 0, 1)
rgb = np.where(bg[..., None], hue, im)

out = Image.fromarray((np.dstack([rgb, a]) * 255).astype(np.uint8), "RGBA")
out = out.crop(out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
out.thumbnail((size, size), Image.LANCZOS)
out.save(dst)
