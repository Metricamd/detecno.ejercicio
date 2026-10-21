"""Cash-register "ka-ching" for the Yolapp reel (synthesized, no licensing
strings attached). Usage: python3 scripts/make_sfx_cash.py <out.wav>
"""
import sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)
t = np.arange(int(SR * 1.4)) / SR
x = np.zeros_like(t)


def at(sec, sig):
    i = int(sec * SR)
    n = min(len(sig), len(x) - i)
    x[i:i + n] += sig[:n]


# "ka": drawer latch, a short band of noise with a hard attack
n = int(SR * 0.05)
latch = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * 0.008))
latch = np.convolve(latch, np.ones(6) / 6, mode="same")
at(0.0, latch * 0.9)
at(0.035, latch[: n // 2] * 0.5)

# "ching": bright bell, inharmonic partials with a slow decay
tb = np.arange(int(SR * 1.2)) / SR
bell = sum(a * np.sin(2 * np.pi * f * tb) * np.exp(-tb * d) for f, a, d in [
    (2093, 1.0, 3.2), (2637, 0.7, 3.6), (3136, 0.55, 4.2), (4186, 0.35, 5.5), (5274, 0.25, 7.0), (6645, 0.15, 9.0)])
bell *= 1 + 0.08 * np.sin(2 * np.pi * 7 * tb)
at(0.07, bell * 0.32)
at(0.16, bell * 0.18)

# a few coins jingling
for k in range(7):
    s = 0.12 + k * 0.06 + rng.uniform(0, 0.03)
    f = rng.uniform(3600, 6200)
    tc = np.arange(int(SR * 0.12)) / SR
    at(s, np.sin(2 * np.pi * f * tc) * np.exp(-tc * 40) * 0.12)

x = x / np.max(np.abs(x)) * 0.9
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((x * 32767).astype(np.int16).tobytes())
print("ok", sys.argv[1])
