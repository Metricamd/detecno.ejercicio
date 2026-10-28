"""Soft SFX for emotional reels (synthesized, no licensing strings attached):
brillo.wav (glassy chime), suave.wav (airy swell), latido.wav (soft heartbeat).

Usage: python3 scripts/make_sfx_emotiva.py <out_dir>
"""
import sys, wave
import numpy as np

SR = 48000
out = sys.argv[1]
rng = np.random.default_rng(5)


def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.8
    with wave.open(f"{out}/{name}.wav", "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


# brillo: two soft bell tones a fifth apart, slow decay, gentle shimmer
t = np.arange(int(SR * 2.2)) / SR
bell = np.zeros_like(t)
for f0, d0 in [(1318.5, 0.0), (1975.5, 0.06)]:
    tt = np.clip(t - d0, 0, None)
    on = (t >= d0).astype(float)
    bell += on * sum(a * np.sin(2 * np.pi * f0 * k * tt) * np.exp(-tt * dk) for k, a, dk in [(1, 1.0, 2.2), (2.76, 0.25, 4.0), (5.4, 0.08, 7.0)])
bell *= 1 + 0.06 * np.sin(2 * np.pi * 6 * t)
bell *= np.clip(t / 0.004, 0, 1)
save("brillo", bell)

# suave: band-limited noise swelling in and out
n = int(SR * 1.1)
noise = rng.standard_normal(n)
k = 60
noise = np.convolve(noise, np.ones(k) / k, mode="same") - np.convolve(noise, np.ones(k * 8) / (k * 8), mode="same")
env = np.sin(np.pi * np.arange(n) / n) ** 2
save("suave", noise * env)

# latido: two low, soft thumps
t = np.arange(int(SR * 0.9)) / SR


def thump(t0, g):
    tt = np.clip(t - t0, 0, None)
    return (t >= t0) * np.sin(2 * np.pi * 55 * tt * (1 - 0.3 * tt)) * np.exp(-tt * 18) * g


save("latido", thump(0.0, 1.0) + thump(0.28, 0.7))
print("ok", out)
