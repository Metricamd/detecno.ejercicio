"""Soft corporate ambient bed (used under the Exppedify talking-head edit).

72 BPM feel, D major, Dmaj9–Bm9–Gmaj9–A6sus: slow evolving pads, a gentle
bell arpeggio and a warm sub, no drums, so it stays under the voice.
Usage: python3 scripts/make_music_ambient.py <out.wav> <seconds>
Everything is synthesized with numpy, so it has no licensing strings attached.
"""
import sys, wave
import numpy as np

SR = 48000
out_path, dur = sys.argv[1], float(sys.argv[2])
N = int(SR * dur)
t = np.arange(N) / SR
rng = np.random.default_rng(7)

mid = lambda m: 440 * 2 ** ((m - 69) / 12)
CHORDS = [(50, [62, 66, 69, 73, 76]), (47, [62, 66, 69, 71, 73]), (43, [62, 66, 67, 71, 74]), (45, [61, 64, 66, 69, 71])]
BAR = 60 / 72 * 4  # 3.33 s per chord

out = np.zeros(N)

def env(start, length, attack, release):
    e = np.zeros(N)
    s, l = int(start * SR), int(length * SR)
    if s >= N:
        return e
    seg = np.ones(l)
    a, r = int(attack * SR), int(release * SR)
    seg[:a] = np.linspace(0, 1, a)
    seg[-r:] *= np.linspace(1, 0, r)
    end = min(N, s + l)
    e[s:end] = seg[: end - s]
    return e

k = 0
while k * BAR < dur:
    root, notes = CHORDS[k % 4]
    start = k * BAR
    # pad: detuned sines with slow vibrato, long crossfades between chords
    e = env(start, BAR + 1.6, 1.2, 1.6)
    for m in notes:
        f = mid(m)
        for d in (-0.12, 0.0, 0.12):
            out += 0.028 * e * np.sin(2 * np.pi * (f * (1 + d / 100)) * t + 0.3 * np.sin(2 * np.pi * 0.2 * t))
    # warm sub
    out += 0.07 * env(start, BAR + 0.8, 0.6, 1.0) * np.sin(2 * np.pi * mid(root - 12) * t)
    # bell arpeggio: one soft note every half beat, decaying
    arp = [notes[0], notes[2], notes[4], notes[1], notes[3], notes[2], notes[4] + 12 if notes[4] + 12 < 90 else notes[4], notes[1]]
    for i, m in enumerate(arp):
        at = start + i * BAR / 8
        s = int(at * SR)
        if s >= N:
            break
        l = min(N - s, int(2.0 * SR))
        tt = np.arange(l) / SR
        f = mid(m + 12)
        tone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 2.6)
        out[s : s + l] += 0.035 * tone * (1 - np.exp(-tt * 200))
    k += 1

# soft air noise, low-passed
noise = np.convolve(rng.standard_normal(N), np.ones(60) / 60, mode="same")
out += 0.004 * noise

# simple stereo: slow auto-pan on the arpeggio-heavy mix
pan = 0.5 + 0.12 * np.sin(2 * np.pi * 0.05 * t)
L, R = out * (1 - pan) * 2, out * pan * 2

fade = np.ones(N)
fi, fo = int(1.5 * SR), int(2.5 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
L, R = L * fade, R * fade
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.8, R / peak * 0.8

with wave.open(out_path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
print(f"wrote {out_path} ({dur:.1f} s)")
