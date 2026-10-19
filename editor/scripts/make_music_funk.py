"""Groovy, funky placeholder track for the Fispal multi-RFC reel.

Funk-pop feel: 104 BPM, Dm7–G7–Cmaj7–Am7, four-on-the-floor kick,
off-beat hats, soft claps, sub bass, warm pad and a filtered pluck arpeggio.
Usage: python3 scripts/make_music_funk.py <out.wav> <seconds>
Everything is synthesized with numpy, so it has no licensing strings attached.
"""
import sys, wave
import numpy as np

SR = 48000
BPM = 104
BEAT = 60 / BPM
out_path, dur = sys.argv[1], float(sys.argv[2])
N = int(SR * dur)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(91)


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * (1 - max(pan, 0))
    R[i:i + len(sig)] += sig * gain * (1 + min(pan, 0))


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    x = rng.standard_normal(n)
    x = np.diff(np.concatenate([[0], x]))  # crude high-pass
    return x * env(n, 0.001, 0.06 if open_ else 0.015)


def clap():
    n = int(0.25 * SR)
    x = rng.standard_normal(n) * env(n, 0.002, 0.07)
    return np.diff(np.concatenate([[0], x]))


def saw(f, n):
    t = np.arange(n) / SR
    return 2 * ((t * f) % 1) - 1


def lowpass(x, a):
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y


def pad(notes, length):
    n = int(length * SR)
    x = sum(saw(hz(m) * d, n) for m in notes for d in (0.997, 1.003))
    x = lowpass(x / (len(notes) * 2), 0.04)
    t = np.arange(n) / SR
    return x * np.minimum(1, t / 0.4) * np.minimum(1, (length - t) / 0.4)


def pluck(m):
    n = int(0.3 * SR)
    return lowpass(saw(hz(m), n), 0.18) * env(n, 0.002, 0.09)


def sub(m, length):
    n = int(length * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * hz(m) * t) * np.minimum(1, t / 0.01) * np.exp(-t / 0.5)


# ii–V–I–vi (Dm7 G7 Cmaj7 Am7), one chord per bar
CHORDS = [(50, [53, 57, 60]), (55, [53, 59, 62]), (48, [52, 55, 59]), (57, [55, 60, 64])]
BAR = 4 * BEAT
bars = int(dur / BAR) + 1
for b in range(bars):
    t0 = b * BAR
    root, ch = CHORDS[b % 4]
    place(pad([x + 12 for x in ch], BAR), t0, 0.16)
    for k in range(4):
        tb = t0 + k * BEAT
        place(kick(), tb, 0.9)
        place(hat(), tb + BEAT / 2, 0.12, pan=0.3)
        if k % 2 == 1:
            place(clap(), tb, 0.18, pan=-0.1)
        place(sub(root - 12, BEAT * 0.4), tb, 0.4); place(sub(root, BEAT * 0.25), tb + BEAT * 0.75, 0.25)
    if b >= 1:  # arpeggio enters after the first bar
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 24]
        for k in range(8):
            place(pluck(arp[(k * 3) % 4] + 12), t0 + k * BEAT / 2, 0.12, pan=(-0.4 if k % 2 else 0.4))
    if b % 4 == 3:
        place(hat(True), t0 + 3.5 * BEAT, 0.1)

mix = np.stack([L, R], 1)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.85
fade = int(1.5 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
with wave.open(out_path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("ok", out_path, dur, "s,", BPM, "BPM")
