"""Synthesized SFX for the Bling reel (no licensing strings attached).
Usage: python3 scripts/make_sfx_bling.py <out_dir>
"""
import sys, wave
import numpy as np

SR = 48000
out = sys.argv[1]
rng = np.random.default_rng(3)


def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    w = wave.open(f"{out}/{name}.wav", "wb")
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype("<i2").tobytes()); w.close()


def t(d):
    return np.arange(int(SR * d)) / SR


# paper crumple: many short filtered noise crackles
x = np.zeros(int(SR * 0.9))
for _ in range(70):
    i = rng.integers(0, len(x) - 2000)
    n = rng.normal(size=rng.integers(200, 1600))
    n = np.diff(n, prepend=0) * np.exp(-np.arange(len(n)) / (len(n) / 3))
    x[i : i + len(n)] += n * rng.uniform(0.2, 1)
x *= np.minimum(1, t(0.9) / 0.05) * np.clip((0.9 - t(0.9)) / 0.2, 0, 1)
save("crumple", x)

# comic error: two descending "wah" square-ish tones
def tone(f0, f1, d):
    tt = t(d)
    f = np.linspace(f0, f1, len(tt))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(3 * np.sin(ph)) * np.exp(-tt * 2.2) * (1 + 0.3 * np.sin(2 * np.pi * 7 * tt))
save("error", np.concatenate([tone(520, 470, 0.22), np.zeros(int(SR * 0.04)), tone(440, 300, 0.5)]))

# clock tick (single)
tt = t(0.05)
save("tick", np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 140) + rng.normal(size=len(tt)) * np.exp(-tt * 300) * 0.4)

# sparkle: rising bell arpeggio
x = np.zeros(int(SR * 1.2))
for k, f in enumerate([1568, 1976, 2349, 3136, 3951]):
    s = int(k * 0.06 * SR)
    tt = t(1.2 - k * 0.06)
    x[s : s + len(tt)] += (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * 5)
save("sparkle", x)

# pop
tt = t(0.12)
save("pop", np.sin(2 * np.pi * np.cumsum(np.linspace(900, 300, len(tt))) / SR) * np.exp(-tt * 40))

# swipe / whoosh
tt = t(0.45)
n = rng.normal(size=len(tt))
from numpy.fft import rfft, irfft
spec = rfft(n); freqs = np.fft.rfftfreq(len(n), 1 / SR)
spec *= np.exp(-((freqs - 1800) / 1500) ** 2)
save("swipe", irfft(spec, len(n)) * np.sin(np.pi * tt / 0.45) ** 2)
print("ok")
