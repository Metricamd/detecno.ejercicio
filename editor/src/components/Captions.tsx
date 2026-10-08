// Word-highlight captions (white, active word in lilac), placed in the lower
// third inside the Reels safe zone.
import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, POPPINS, SAFE } from "../theme";
import { VO_CLIPS, VO_PHRASES } from "../timings";

// Estimated word timings from the script (used until a real transcription
// exists in public/captions.json).
export const estimateCaptions = (): Caption[] => {
  const out: Caption[] = [];
  for (const [start, end, phrase] of VO_PHRASES) {
    const words = phrase.split(" ");
    const total = words.reduce((a, w) => a + w.length + 2, 0);
    let t = start;
    for (const w of words) {
      const d = ((w.length + 2) / total) * (end - start);
      out.push({ text: ` ${w}`, startMs: t * 1000, endMs: (t + d) * 1000, timestampMs: (t + d / 2) * 1000, confidence: null });
      t += d;
    }
  }
  return out;
};

// Real word timings (seconds in the voiceover file) mapped onto the reel
// through VO_CLIPS.
export type TimedWord = { text: string; start: number; end: number };
export const captionsFromTiming = (words: TimedWord[]): Caption[] =>
  words.flatMap((w) => {
    const clip = VO_CLIPS.find((c) => w.start >= c.from && w.end <= c.to + 0.05);
    if (!clip) return [];
    const shift = clip.at - clip.from;
    return [{ text: ` ${w.text}`, startMs: (w.start + shift) * 1000, endMs: (w.end + shift) * 1000, timestampMs: ((w.start + w.end) / 2 + shift) * 1000, confidence: 1 }];
  });

export const Captions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const { pages } = useMemo(() => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 1100 }), [captions]);
  const page = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs));
  if (!page) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.bottom - 190, height: 170, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 54, lineHeight: 1.2, color: C.white, textShadow: "0 4px 18px rgba(10,10,60,.85)", whiteSpace: "pre-wrap" }}>
          {page.tokens.map((t) => {
            const active = ms >= t.fromMs && ms < t.toMs;
            return (
              <span key={t.fromMs} style={{ color: active ? C.lilac : C.white }}>
                {t.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
