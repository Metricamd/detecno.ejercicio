"""Upbeat, cheerful placeholder track (124 BPM, G major, I–V–vi–IV).

Usage: python3 scripts/make_music_upbeat.py <out.wav> <seconds>
Everything is synthesized with numpy, so it has no licensing strings attached.
"""
import sys, wave
import numpy as np

SR = 48000
BPM = 124
BEAT = 60 / BPM
out_path, dur = sys.argv[1], float(sys.argv[2])
N = int(SR * dur)
mix_l = np.zeros(N)
mix_r = np.zeros(N)
rng = np.random.default_rng(7)


def note(n):  # MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    mix_l[i : i + len(sig)] += sig * gain * (1 - max(pan, 0))
    mix_r[i : i + len(sig)] += sig * gain * (1 + min(pan, 0))


def env(length, attack=0.003, decay=0.2):
    t = np.arange(int(length * SR)) / SR
    return np.minimum(1, t / attack) * np.exp(-t / decay), t


def kick():
    e, t = env(0.35, 0.001, 0.12)
    f = 50 + 110 * np.exp(-t * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * e


def clap():
    e, t = env(0.18, 0.001, 0.05)
    n = rng.standard_normal(len(t))
    # crude band-pass: difference of two smoothed noises
    k1 = np.convolve(n, np.ones(3) / 3, "same")
    k2 = np.convolve(n, np.ones(14) / 14, "same")
    return (k1 - k2) * e * 1.6


def hat(open_=False):
    e, t = env(0.22 if open_ else 0.05, 0.001, 0.07 if open_ else 0.015)
    n = rng.standard_normal(len(t))
    return (n - np.convolve(n, np.ones(4) / 4, "same")) * e


def saw(f, length, harmonics=12, decay=0.25, attack=0.004, bright=1.0):
    e, t = env(length, attack, decay)
    s = sum(((-1) ** (k + 1)) * np.sin(2 * np.pi * f * k * t) / k * np.exp(-t * k * 3 / bright)
            for k in range(1, harmonics + 1))
    return s * e


def marimba(f, length=0.5):
    e, t = env(length, 0.002, 0.18)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)) * e


# G – D – Em – C, one bar each (MIDI roots and triads)
CHORDS = [(43, [67, 71, 74]), (38, [66, 69, 74]), (40, [67, 71, 76]), (36, [67, 72, 76])]
# cheerful pentatonic hook (beat offset within 2 bars, MIDI note)
HOOK = [(0, 79), (0.5, 81), (1, 83), (2, 86), (2.5, 83), (3.5, 81),
        (4, 79), (5, 81), (5.5, 79), (6, 76), (7, 74)]

bars = int(dur / (4 * BEAT)) + 1
for b in range(bars):
    t0 = b * 4 * BEAT
    root, triad = CHORDS[b % 4]
    last = t0 + 4 * BEAT > dur - 1.2
    for beat in range(4):
        tb = t0 + beat * BEAT
        place(kick(), tb, 0.9)
        if beat in (1, 3):
            place(clap(), tb, 0.35, pan=0.1)
        place(hat(), tb + BEAT / 2, 0.22, pan=-0.3)
        place(hat(), tb + BEAT * 0.75, 0.08, pan=0.3)
        # bouncy off-beat bass
        place(saw(note(root), BEAT * 0.45, 8, 0.12, bright=0.5), tb + BEAT / 2, 0.32)
        place(saw(note(root + 12), BEAT * 0.3, 6, 0.08, bright=0.5), tb + BEAT * 0.75, 0.14)
    if b % 2 == 1:
        place(hat(True), t0 + 3.5 * BEAT, 0.12)
    # syncopated chord stabs
    for off in (0, 0.75, 1.5, 2.5, 3.25):
        for i, n in enumerate(triad):
            place(saw(note(n), 0.35, 10, 0.16), t0 + off * BEAT, 0.06, pan=(i - 1) * 0.4)
    # hook (2 bars long) on every other pair of bars
    if (b // 2) % 2 == 1 and not last:
        half = b % 2
        for off, n in HOOK:
            if 4 * half <= off < 4 * (half + 1):
                place(marimba(note(n)), t0 + (off - 4 * half) * BEAT, 0.16, pan=0.2)

# fades + gentle glue
t = np.arange(N) / SR
fade = np.minimum(1, t / 0.05) * np.clip((dur - t) / 1.2, 0, 1)
mix = np.stack([mix_l * fade, mix_r * fade], 1)
mix = np.tanh(mix / np.abs(mix).max() * 1.4) * 0.6  # gentle glue/saturation
data = (mix * 32767).astype("<i2")
w = wave.open(out_path, "wb")
w.setnchannels(2)
w.setsampwidth(2)
w.setframerate(SR)
w.writeframes(data.tobytes())
w.close()
print("ok", out_path, dur, "s,", BPM, "BPM")
