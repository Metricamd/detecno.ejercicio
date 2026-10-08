"""Venvers "Contraloría" reel bed: variant of the "Mi cuenta" track (118 BPM, D major).

116 BPM, A major, vi–IV–I–V (F#m D A E), syncopated kick, shaker 16ths,
bell arpeggios and a whistle-like lead. Usage:
  python3 scripts/make_music_cuenta.py <out.wav> <seconds>
"""
import sys, wave
import numpy as np

SR = 48000
BPM = 118
BEAT = 60 / BPM
out_path, dur = sys.argv[1], float(sys.argv[2])
N = int(SR * dur)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(31)


def hz(n):
    return 440.0 * 2 ** ((n + 5 - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * gain * (1 + min(pan, 0))


def env(length, attack, decay):
    t = np.arange(int(length * SR)) / SR
    return np.minimum(1, t / attack) * np.exp(-t / decay), t


def kick():
    e, t = env(0.3, 0.001, 0.1)
    return np.sin(2 * np.pi * np.cumsum(55 + 120 * np.exp(-t * 40)) / SR) * e


def snap():
    e, t = env(0.15, 0.001, 0.04)
    n = rng.standard_normal(len(t))
    return (n - np.convolve(n, np.ones(10) / 10, "same")) * e * 1.4


def shaker(acc):
    e, t = env(0.06, 0.004, 0.018)
    n = rng.standard_normal(len(t))
    return (n - np.convolve(n, np.ones(3) / 3, "same")) * e * (1.0 if acc else 0.55)


def bell(f, length=0.6):
    e, t = env(length, 0.002, 0.22)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 1.6 * np.exp(-t * 6)
    return np.sin(2 * np.pi * f * t + mod) * e


def bass(f, length):
    e, t = env(length, 0.005, 0.18)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * e


def whistle(f, length):
    e, t = env(length, 0.03, 0.35)
    vib = 0.006 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t * 3)
    return np.sin(2 * np.pi * np.cumsum(f * (1 + vib)) / SR) * e


CHORDS = [(42, [66, 69, 73]), (38, [62, 66, 69]), (45, [69, 73, 76]), (40, [64, 68, 71])]
LEAD = [(0, 76), (1, 78), (1.5, 76), (2, 73), (3, 71), (4, 69), (4.5, 71), (5, 73), (6, 76), (7, 78)]

bars = int(dur / (4 * BEAT)) + 1
for b in range(bars):
    t0 = b * 4 * BEAT
    root, triad = CHORDS[b % 4]
    for k in (0, 1.5, 2, 3):  # syncopated kick pattern
        place(kick(), t0 + k * BEAT, 0.85)
    for k in (1, 3):
        place(snap(), t0 + k * BEAT, 0.35, pan=-0.1)
    for k in range(16):
        place(shaker(k % 4 == 2), t0 + k * BEAT / 4, 0.09, pan=0.35)
    for k in (0, 0.75, 1.5, 2.5, 3, 3.5):
        place(bass(hz(root), BEAT * 0.5), t0 + k * BEAT, 0.34)
    arp = triad + [triad[0] + 12]
    for k in range(8):
        place(bell(hz(arp[k % 4] + 12)), t0 + k * BEAT / 2, 0.07, pan=0.4 * (1 if k % 2 else -1))
    if (b // 2) % 2 == 1 and t0 + 4 * BEAT < dur - 1.5:
        half = b % 2
        for off, n in LEAD:
            if 4 * half <= off < 4 * (half + 1):
                place(whistle(hz(n), BEAT * 0.9), t0 + (off - 4 * half) * BEAT, 0.09, pan=-0.15)

t = np.arange(N) / SR
fade = np.minimum(1, t / 0.05) * np.clip((dur - t) / 1.2, 0, 1)
mix = np.stack([L * fade, R * fade], 1)
mix = np.tanh(mix / np.abs(mix).max() * 1.4) * 0.6
w = wave.open(out_path, "wb")
w.setnchannels(2)
w.setsampwidth(2)
w.setframerate(SR)
w.writeframes((mix * 32767).astype("<i2").tobytes())
w.close()
print("ok", out_path, dur, "s,", BPM, "BPM")
