"""ALVA reel track: chaos first, then an urban-pop drop.

0 .. DROP   : clashing clusters, glitch blips, alarm beeps, irregular hits and a
              noise riser that cuts off right before the drop (the "problem").
DROP .. end : 104 BPM, C major, vi–IV–I–V (Am F C G): 808 kick/bass with glide,
              snap + clap on 2 and 4, rolling hats, plucked off-beat chords and a
              bright pentatonic pluck hook (the "solution").
Usage: python3 scripts/make_music_alva.py <out.wav> <seconds> [drop_seconds]
"""
import sys, wave
import numpy as np

SR = 48000
BPM = 104
BEAT = 60 / BPM
out_path, dur = sys.argv[1], float(sys.argv[2])
DROP = float(sys.argv[3]) if len(sys.argv) > 3 else 8.2
N = int(SR * dur)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)


def hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


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


def noise_hp(n, k):
    x = rng.standard_normal(n)
    return x - np.convolve(x, np.ones(k) / k, "same")


# ---------- drums ----------
def kick808(length=0.45):
    e, t = env(length, 0.001, 0.16)
    ph = np.cumsum(48 + 110 * np.exp(-t * 32)) / SR
    return np.tanh(2.2 * np.sin(2 * np.pi * ph)) * e * 0.9


def snap():
    e, t = env(0.12, 0.001, 0.03)
    return noise_hp(len(t), 6) * e * 1.3 + np.sin(2 * np.pi * 1800 * t) * e * 0.3


def clap():
    e, t = env(0.22, 0.001, 0.07)
    burst = sum(np.exp(-np.maximum(t - d, 0) * 90) * (t >= d) for d in (0, 0.012, 0.024))
    return noise_hp(len(t), 3) * (e * 0.6 + burst * 0.5)


def hat(open_=False):
    e, t = env(0.25 if open_ else 0.05, 0.001, 0.09 if open_ else 0.012)
    return noise_hp(len(t), 2) * e * 0.8


def crash(length=1.6):
    e, t = env(length, 0.002, 0.55)
    return noise_hp(len(t), 2) * e


# ---------- tonal ----------
def saw(f, t, detune=0.0):
    ph = (f * (1 + detune) * t) % 1.0
    return 2 * ph - 1


def pluck(f, length=0.35, decay=0.1):
    e, t = env(length, 0.002, decay)
    return (saw(f, t) * 0.6 + saw(f, t, 0.006) * 0.4) * e


def mallet(f, length=0.5):
    e, t = env(length, 0.002, 0.16)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 14)) * e


def bass808(f, length):
    e, t = env(length, 0.004, length * 0.7)
    glide = f * (1 + 0.08 * np.exp(-t * 25))
    ph = np.cumsum(glide) / SR
    return np.tanh(1.8 * np.sin(2 * np.pi * ph)) * e


# ======================= CHAOS =======================
t_c = np.arange(int(DROP * SR)) / SR
prog = t_c / DROP  # 0 → 1
# dissonant cluster pad: semitone-stacked detuned saws, rising and trembling
cluster = np.zeros_like(t_c)
for n in (50, 51, 54, 56, 57, 62):
    f = hz(n) * (1 + 0.12 * prog)
    ph = np.cumsum(f) / SR
    cluster += (2 * (ph % 1) - 1) * 0.5
cluster *= (0.12 + 0.2 * prog) * (0.7 + 0.3 * np.sin(2 * np.pi * (4 + 8 * prog) * t_c))
cluster *= np.minimum(1, t_c / 0.05)
i0 = 0
L[: len(cluster)] += cluster * 0.9
R[: len(cluster)] += cluster * 0.9

# glitch blips: density grows towards the drop
n_blips = 90
for t0 in np.sort(DROP * rng.random(n_blips) ** 0.8):
    f = rng.choice([220, 330, 466, 784, 1250, 2093, 3135]) * rng.uniform(0.9, 1.1)
    ln = rng.uniform(0.02, 0.09)
    e, t = env(ln, 0.001, ln / 2)
    sig = (np.sign(np.sin(2 * np.pi * f * t)) if rng.random() < 0.5 else np.sin(2 * np.pi * f * t)) * e
    place(sig, t0, 0.13 + 0.1 * t0 / DROP, pan=rng.uniform(-0.8, 0.8))

# alarm beeps (two-tone) every ~0.45 s, faster later
t0 = 0.3
while t0 < DROP - 0.3:
    for k, f in enumerate((880, 660)):
        e, t = env(0.09, 0.002, 0.06)
        place(np.sin(2 * np.pi * f * t) * e, t0 + k * 0.1, 0.12, pan=0.5 * (-1) ** k)
    t0 += 0.55 - 0.25 * t0 / DROP

# irregular, clumsy drums
t0 = 0.0
while t0 < DROP - 0.2:
    place(kick808(0.25), t0, rng.uniform(0.35, 0.7))
    if rng.random() < 0.6:
        place(clap(), t0 + rng.uniform(0.05, 0.2), rng.uniform(0.2, 0.5), pan=rng.uniform(-0.6, 0.6))
    for _ in range(rng.integers(0, 4)):
        place(hat(), t0 + rng.uniform(0, 0.4), rng.uniform(0.1, 0.25), pan=rng.uniform(-0.7, 0.7))
    t0 += rng.uniform(0.22, 0.62)

# noise riser to the drop
e = (t_c / DROP) ** 3
riser = noise_hp(len(t_c), 4) * e * 0.35
L[: len(riser)] += riser
R[: len(riser)] += riser[::-1]

# hard cut: 0.14 s of silence, then the impact
gap0, gap1 = int((DROP - 0.14) * SR), int(DROP * SR)
L[gap0:gap1] *= 0.0
R[gap0:gap1] *= 0.0

# ======================= URBAN POP DROP =======================
CHORDS = [(45, [69, 72, 76]), (41, [65, 69, 72]), (48, [67, 72, 76]), (43, [67, 71, 74])]
HOOK = [  # (beat offset in 4-beat bar pair, midi) – C major pentatonic, bright
    (0, 79), (0.75, 81), (1.5, 84), (2.5, 81), (3, 79), (4, 76), (4.75, 79), (5.5, 81),
    (6, 84), (7, 88), (7.5, 86),
]
bars = int((dur - DROP) / (4 * BEAT)) + 1
place(crash(), DROP, 0.5)
place(kick808(0.7), DROP, 1.0)
for b in range(bars):
    t0 = DROP + b * 4 * BEAT
    root, triad = CHORDS[b % 4]
    for k in (0, 1.75, 2.5):  # boom + syncopated push
        place(kick808(), t0 + k * BEAT, 0.95)
    for k in (1, 3):
        place(snap(), t0 + k * BEAT, 0.5, pan=-0.1)
        place(clap(), t0 + k * BEAT, 0.55, pan=0.1)
    for k in range(8):  # 8th hats, with a 16th roll at the end of each bar
        place(hat(k == 7), t0 + k * BEAT / 2, 0.16, pan=0.3)
    if b % 2 == 1:
        for k in (3.5, 3.625, 3.75, 3.875):
            place(hat(), t0 + k * BEAT, 0.14, pan=0.3)
    for k, ln in ((0, 0.9), (2.5, 0.45), (3, 0.8)):  # 808 line
        place(bass808(hz(root - 12), ln * BEAT), t0 + k * BEAT, 0.62)
    for k in (0.5, 1.5, 2.5, 3.5):  # off-beat plucked chords
        for n in triad:
            place(pluck(hz(n)), t0 + k * BEAT, 0.07, pan=-0.2)
    if b % 2 == 0 or b >= 1:
        half = b % 2
        for off, n in HOOK:
            if 4 * half <= off < 4 * (half + 1):
                place(mallet(hz(n)), t0 + (off - 4 * half) * BEAT, 0.17, pan=0.15)
                place(pluck(hz(n + 12), 0.2, 0.05), t0 + (off - 4 * half) * BEAT, 0.035, pan=-0.3)

# outro: final hit on the logo and a soft fade
t = np.arange(N) / SR
fade = np.minimum(1, t / 0.02) * np.clip((dur - t) / 1.3, 0, 1)
mix = np.stack([L * fade, R * fade], 1)
mix = np.tanh(mix / np.abs(mix).max() * 1.5) * 0.6
w = wave.open(out_path, "wb")
w.setnchannels(2)
w.setsampwidth(2)
w.setframerate(SR)
w.writeframes((mix * 32767).astype("<i2").tobytes())
w.close()
print("ok", out_path, dur, "s, drop", DROP, "s,", BPM, "BPM")
