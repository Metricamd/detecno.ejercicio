"""Emotional placeholder track: soft piano arpeggios over a string pad
(72 BPM, A minor, vi–IV–I–V), with a slow build and a long fade.

Usage: python3 scripts/make_music_emotiva.py <out.wav> <seconds>
Everything is synthesized with numpy, so it has no licensing strings attached.
"""
import sys, wave
import numpy as np

SR = 48000
BPM = 72
BEAT = 60 / BPM
BAR = 4 * BEAT
out_path, dur = sys.argv[1], float(sys.argv[2])
N = int(SR * dur)
mix_l = np.zeros(N)
mix_r = np.zeros(N)
rng = np.random.default_rng(11)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# Am – F – C – G, one bar each
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [45, 41, 48, 43]


def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    n = min(len(sig), N - i)
    mix_l[i:i + n] += sig[:n] * gain * (1 - pan) * 0.5
    mix_r[i:i + n] += sig[:n] * gain * (1 + pan) * 0.5


def piano(midi, length=2.4, vel=0.5):
    t = np.arange(int(SR * length)) / SR
    f = hz(midi)
    tone = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in [(1, 1.0), (2, 0.42), (3, 0.18), (4, 0.08), (5, 0.04)])
    env = (1 - np.exp(-t * 400)) * np.exp(-t * (1.6 + midi / 90))
    return tone * env * vel


def pad(notes, length):
    t = np.arange(int(SR * length)) / SR
    sig = np.zeros_like(t)
    for m in notes:
        for det in (-0.12, 0.0, 0.11):
            f = hz(m + 12) * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            # soft "string": a few odd/even harmonics, slow vibrato
            vib = 1 + 0.003 * np.sin(2 * np.pi * 5.1 * t + ph)
            sig += sum(a * np.sin(2 * np.pi * f * k * t * vib + ph) for k, a in [(1, 1.0), (2, 0.35), (3, 0.15)])
    att = np.clip(t / 1.2, 0, 1)
    rel = np.clip((length - t) / 1.0, 0, 1)
    return sig * att * rel / (len(notes) * 3)


def bass(midi, length):
    t = np.arange(int(SR * length)) / SR
    env = np.clip(t / 0.3, 0, 1) * np.clip((length - t) / 0.6, 0, 1)
    return np.sin(2 * np.pi * hz(midi) * t) * env


bars = int(dur / BAR) + 1
for b in range(bars):
    t0 = b * BAR
    chord, root = CHORDS[b % 4], ROOTS[b % 4]
    progress = t0 / dur
    # piano arpeggio in eighths: root, fifth, octave, third...
    arp = [chord[0], chord[2], chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 12, chord[0] + 12, chord[2]]
    for k, m in enumerate(arp):
        vel = 0.34 + 0.08 * (k == 0) + 0.06 * progress
        add(piano(m + 12, vel=vel), t0 + k * BEAT / 2, pan=0.25 * np.sin(k), gain=0.55)
    # a melody note on top from the 3rd bar on
    if b >= 2:
        top = [76, 72, 72, 74][b % 4] if b % 8 < 4 else [72, 77, 76, 74][b % 4]
        add(piano(top, length=3.0, vel=0.42), t0 + BEAT * 0.02, gain=0.5)
    # strings enter after ~8 s and swell towards 70 %
    if t0 > 8:
        swell = min(1.0, 0.35 + progress * 0.9)
        add(pad(chord, BAR + 1.0), t0, gain=0.55 * swell)
    if t0 > 16:
        add(bass(root, BAR), t0, gain=0.22)

mix = np.stack([mix_l, mix_r])


# light reverb: a few feedback combs per channel
def comb(x, delay, fb):
    d = int(delay * SR)
    y = x.copy()
    for i in range(d, len(y), d):
        y[i:i + d] += y[i - d:i][: len(y[i:i + d])] * fb
    return y


wet = np.stack([sum(comb(mix[c], dl, 0.45) for dl in (0.0297, 0.0371, 0.0411, 0.0437)) / 4 for c in range(2)])
mix = mix * 0.7 + wet * 0.5

fade_in = np.clip(np.arange(N) / (SR * 2.0), 0, 1)
fade_out = np.clip((N - np.arange(N)) / (SR * 4.0), 0, 1)
mix *= fade_in * fade_out
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.85

with wave.open(out_path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print("ok", out_path, f"{dur:.1f} s, {BPM} BPM")
