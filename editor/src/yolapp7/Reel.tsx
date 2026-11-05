// Yolapp reel 7 (1080 × 1920, 30 fps): "¿Ganar comisiones por compartir un
// link?". Rules from public/yolapp/marca.md: full-screen video at all times (no
// cutaways, no filter), few soft SFX, the gradient logo as is every time she
// says "Yolapp", clean mastered voice.
//
// Face-safe layout: the face spans x ≈ 250–830, y ≈ 300–1220. Graphics only
// live on the chest band (y ≥ 1380) and above the head (y ≤ 290).
//
// Audio: the video is muted; the voice plays from public/yolapp/v7/voz.wav
// (chain in voz-cadena.txt) and the render is mastered to −14 LUFS afterwards.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { POPPINS, poppinsReady } from "../theme";
import { Burst, circle, glass, Phone } from "../yolapp/fx";
import {
  Chip,
  clamp,
  EASE,
  Glyph,
  Heart,
  LinkIcon,
  Pop,
  Sticker,
  Tick,
} from "../yolapp/parts";
import {
  Comida,
  Hospital,
  Moneda,
  Perro,
  Publicacion,
} from "../yolapp3/ilustraciones";
import {
  CLIPS,
  clipAt,
  GRAD,
  GRAPHICS,
  GraphicId,
  graphicSpan,
  isKeyword,
  SPEECH_END,
  TOTAL,
  W,
  Word,
  wordAt,
  WORDS,
  Y,
  YOLAPP_AT,
} from "./datos";

const SRC = "yolapp/v7/crudo.mp4";
const VOZ = "yolapp/v7/voz.wav";
const LOGO = "yolapp/logo/logo-color.png";
const A = wordAt;

const inGraphic = (i: number) => GRAPHICS.some((g) => i >= g.from && i <= g.to);

// Continuous pieces of footage/audio: a take with a `skip` plays as two pieces.
const PARTS = CLIPS.flatMap((c) => {
  if (!c.skip) return [{ at: c.at, len: c.len, from: c.from }];
  const first = Math.round((c.skip[0] - c.from) * 30);
  return [
    { at: c.at, len: first, from: c.from },
    { at: c.at + first, len: c.len - first, from: c.skip[1] },
  ];
});

/* ---------- the talking-head video, always full screen, no filter ---------- */
const zoomFor = (i: number) => (inGraphic(i) ? 1.0 : i % 2 === 0 ? 1.0 : 1.08);
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip =
    CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ??
    CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  const hook =
    clip.i === 0
      ? interpolate(frame, [0, 14], [0.2, 0], { ...clamp, easing: EASE })
      : 0;
  const scale = zoomFor(clip.i) + 0.025 * local + hook;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, transformOrigin: "50% 38%" }}
      >
        {PARTS.map((p, k) => (
          <Sequence key={k} from={p.at} durationInFrames={p.len} layout="none">
            <OffthreadVideo
              src={staticFile(SRC)}
              trimBefore={Math.round(p.from * 30)}
              muted
              style={{ width: W, height: 1920, objectFit: "cover" }}
            />
          </Sequence>
        ))}
        <Sequence from={SPEECH_END} layout="none">
          <Img
            src={staticFile("yolapp/v7/final.jpg")}
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// The cleaned voice, cut exactly like the picture (2-frame fades at each cut).
const Voice: React.FC = () => (
  <>
    {PARTS.map((p, k) => (
      <Sequence key={k} from={p.at} durationInFrames={p.len}>
        <Audio
          src={staticFile(VOZ)}
          trimBefore={Math.round(p.from * 30)}
          volume={(f) => Math.min(1, (f + 1) / 2, (p.len - f) / 2)}
        />
      </Sequence>
    ))}
  </>
);

/* ---------- captions: word by word, active word on a pink pill ---------- */
type Page = { words: Word[]; start: number; end: number; top: boolean };
const PAGES: Page[] = (() => {
  const pages: Word[][] = [];
  for (const c of CLIPS) {
    let cur: Word[] = [];
    for (const w of WORDS.filter((x) => x.clip === c.i)) {
      cur.push(w);
      const punct = /[,.?!:;]$/.test(w.text);
      if (cur.length >= 4 || (punct && cur.length >= 2)) {
        pages.push(cur);
        cur = [];
      }
    }
    if (cur.length) {
      if (
        cur.length === 1 &&
        pages.length &&
        pages[pages.length - 1][0].clip === c.i
      )
        pages[pages.length - 1].push(...cur);
      else pages.push(cur);
    }
  }
  return pages.map((ws, i) => ({
    words: ws,
    start: Math.floor(ws[0].start),
    end: i + 1 < pages.length ? Math.floor(pages[i + 1][0].start) : SPEECH_END,
    top: inGraphic(ws[0].clip),
  }));
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const page = PAGES.find((pg) => frame >= pg.start && frame < pg.end);
  if (!page) return null;
  const out = interpolate(frame, [page.end - 3, page.end], [1, 0], clamp);
  const size = page.top ? 58 : 68;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: page.top ? 70 : 1420,
        height: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px 14px",
          opacity: out,
        }}
      >
        {page.words.map((w, i) => {
          const t = frame - w.start;
          const active = frame >= w.start && frame < w.end + 2;
          const inP = interpolate(t, [-1, 4], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                fontFamily: POPPINS,
                fontWeight: 800,
                fontSize: size,
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: active ? "#fff" : isKeyword(w.text) ? "#5FF5EC" : "#fff",
                background: active ? Y.pink : "transparent",
                borderRadius: 20,
                padding: "0 14px",
                opacity: inP,
                filter: `blur(${(1 - inP) * 6}px)`,
                transform: `translateY(${(1 - inP) * 16}px) scale(${active ? 1.06 : 1}) rotate(${active ? -1.5 : 0}deg)`,
                textShadow: active
                  ? "none"
                  : "0 4px 0 rgba(26,18,64,.85), 0 0 18px rgba(26,18,64,.7), 0 0 4px rgba(26,18,64,.9)",
                boxShadow: active ? "0 8px 24px rgba(255,5,102,.45)" : "none",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- above the head: stickers and logo pops ---------- */
const Between: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return (
    <AbsoluteFill
      style={{ opacity: interpolate(frame, [to - 4, to], [1, 0], clamp) }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Stickers: React.FC = () => (
  <>
    <Between from={clipAt(1)} to={clipAt(2)}>
      <Sticker
        at={A(1, "explicar")}
        text="Te explico cómo"
        bg={GRAD.main}
        size={66}
        rotate={-3}
        top={120}
      />
    </Between>
    <Between from={clipAt(8)} to={clipAt(9)}>
      <Sticker
        at={clipAt(8) + 2}
        text="¿Qué esperas?"
        bg={GRAD.warm}
        size={72}
        rotate={3}
        top={120}
      />
    </Between>
    <Between from={clipAt(11)} to={SPEECH_END}>
      <Sticker
        at={A(11, "oportunidad")}
        text="¡No la dejes pasar!"
        bg={`linear-gradient(135deg, #FFB800, ${Y.coral})`}
        size={60}
        rotate={-3}
        top={120}
      />
    </Between>
  </>
);

// Gradient logo, as is, above the head on every "Yolapp" (until the take ends).
// While a graphic is up the captions sit up there, so the logo goes just under them.
const LogoPops: React.FC = () => {
  const frame = useCurrentFrame();
  const clipOf = (f: number) =>
    CLIPS.find((x) => f >= x.at && f < x.at + x.len)!;
  const endOf = (f: number) => Math.min(f + 40, clipOf(f).at + clipOf(f).len);
  const at = [...YOLAPP_AT]
    .reverse()
    .find((f) => frame >= f - 2 && frame < endOf(f));
  if (at === undefined) return null;
  const end = endOf(at);
  const out = interpolate(frame, [end - 6, end], [1, 0], clamp);
  const top = inGraphic(clipOf(at).i) ? 1700 : 90;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Pop
        at={at - 2}
        from={0.3}
        rotate={-4}
        style={{
          position: "absolute",
          top,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile(LOGO)} style={{ width: top > 1000 ? 360 : 440 }} />
      </Pop>
    </AbsoluteFill>
  );
};

/* ---------- graphics ---------- */
const useSpan = (id: GraphicId) => {
  const frame = useCurrentFrame();
  const { start, end } = graphicSpan(id);
  const visible = frame >= start && frame < end;
  const exit = interpolate(frame, [end - 8, end], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return { frame, start, end, visible, exit };
};
const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};
const money = (n: number) => `$${Math.round(n).toLocaleString("es-MX")}`;

// 1. Share a link → coins flow into your commissions.
const Ganar: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("ganar");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const comisiones = A(0, "comisiones");
  const link = A(0, "link");
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const earned = interpolate(
    frame,
    [comisiones, comisiones + 40, link, link + 20],
    [0, 320, 320, 860],
    clamp,
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 1330,
          transform: `translateX(${(1 - enter) * -420}px) rotate(${-6 + (1 - enter) * -20}deg)`,
        }}
      >
        <Phone w={230} tiltY={18}>
          <div
            style={{ padding: 12, display: "flex", justifyContent: "center" }}
          >
            <Publicacion
              size={240}
              shared={interpolate(frame, [link, link + 8], [0, 1], clamp)}
            />
          </div>
        </Phone>
      </div>
      {/* coins flow from the phone into the earnings panel */}
      {Array.from({ length: 8 }, (_, i) => {
        const t = frame - comisiones - i * 6;
        if (t < 0 || t > 30) return null;
        const p = Easing.inOut(Easing.cubic)(t / 30);
        const x = 300 + p * 470;
        const y = 1560 - Math.sin(p * Math.PI) * 150;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: interpolate(t, [0, 4, 26, 30], [0, 1, 1, 0]),
              transform: `rotate(${t * 12}deg) scale(${0.8 - p * 0.25})`,
            }}
          >
            <Moneda size={80} />
          </div>
        );
      })}
      <Pop
        at={comisiones}
        rotate={3}
        style={{ position: "absolute", right: 50, top: 1500 }}
      >
        <div
          style={{
            ...glass,
            borderRadius: 30,
            padding: "16px 26px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, opacity: 0.8 }}>
            Tus comisiones
          </span>
          <span
            style={{
              fontSize: 60,
              fontWeight: 800,
              color: "#5FF5EC",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            +{money(earned)}
          </span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

// 2/7. Big 3D switch with kinetic letters.
const Switch: React.FC<{ id: GraphicId; label: string; onAt: number }> = ({
  id,
  label,
  onAt,
}) => {
  const { frame, start, visible, exit } = useSpan(id);
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const knob = spring({
    frame: frame - onAt,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const on = knob > 0.5;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `translateY(${(1 - enter) * 500}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 2 }}>
          {label.split("").map((l, i) => {
            const p = interpolate(frame - (start + 4 + i * 2), [0, 8], [0, 1], {
              ...clamp,
              easing: EASE,
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: POPPINS,
                  fontWeight: 800,
                  fontSize: 64,
                  color: "#fff",
                  opacity: p,
                  whiteSpace: "pre",
                  transform: `translateY(${(1 - p) * 30}px) rotate(${(1 - p) * 20}deg)`,
                  display: "inline-block",
                  textShadow: on
                    ? "0 0 24px rgba(255,5,102,.9), 0 4px 0 rgba(10,6,30,.6)"
                    : "0 4px 0 rgba(10,6,30,.6), 0 0 18px rgba(10,6,30,.6)",
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
        <div style={{ perspective: 900 }}>
          <div
            style={{
              position: "relative",
              width: 340,
              height: 160,
              borderRadius: 80,
              transform: "rotateX(18deg)",
              background: on
                ? GRAD.warm
                : "linear-gradient(135deg, #4A4466, #2B2547)",
              boxShadow: on
                ? "0 0 60px rgba(255,5,102,.7), inset 0 6px 14px rgba(0,0,0,.25)"
                : "inset 0 6px 14px rgba(0,0,0,.4), 0 20px 40px rgba(10,6,30,.5)",
              border: "4px solid rgba(255,255,255,.5)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10 + knob * 180,
                ...circle(
                  132,
                  "radial-gradient(circle at 35% 30%, #fff, #E9E6F5)",
                ),
                boxShadow: "0 10px 24px rgba(10,6,30,.4)",
              }}
            >
              <Img src={staticFile(LOGO)} style={{ width: 100 }} />
            </div>
            <Burst at={onAt + 4} color="#FFD54A" size={420} />
          </div>
        </div>
      </div>
      <Pop
        at={onAt + 10}
        rotate={6}
        style={{ position: "absolute", right: 50, top: 1440 }}
      >
        <Chip size={30} bg={Y.ok} style={{ border: "5px solid #fff" }}>
          <Tick size={30} />
          ON
        </Chip>
      </Pop>
    </AbsoluteFill>
  );
};

// 3. Pick a monetizable cause, then share it out to friends/family/socials.
const CAUSAS = [
  { label: "Perritos", Ill: Perro },
  { label: "Tratamiento", Ill: Hospital },
  { label: "Comida", Ill: Comida },
];
const DESTINOS = [
  { word: "amigos", label: "Amigos", glyph: "amigos", bg: GRAD.cool, x: 150 },
  {
    word: "familiares",
    label: "Familia",
    glyph: "casa",
    bg: GRAD.warm,
    x: 540,
  },
  { word: "redes", label: "Redes", glyph: "redes", bg: GRAD.deep, x: 930 },
] as const;
const Elige: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("elige");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const pick = A(3, "monetizable");
  const share = clipAt(4);
  const chosen = 1;
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  // phase 2: the chosen card shrinks to the center and the others leave
  const phase2 = interpolate(frame, [share, share + 12], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {CAUSAS.map((c, i) => {
        const isChosen = i === chosen;
        const sel = isChosen
          ? spring({ frame: frame - pick, fps, config: { damping: 11 } })
          : 0;
        const x = 70 + i * 330 + (1 - enter) * (i - 1) * 300;
        const leave = isChosen ? 0 : phase2;
        const cx = isChosen
          ? x + (540 - 155 - x) * phase2
          : x + (i - 1) * 500 * phase2;
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: cx,
              top: 1430 - sel * 30 - phase2 * 20,
              width: 310,
              opacity:
                (1 - leave) * enter * (frame >= pick && !isChosen ? 0.55 : 1),
              transform: `scale(${(1 + sel * 0.08) * (1 - phase2 * 0.25)}) rotate(${(i - 1) * 4 * (1 - sel)}deg)`,
            }}
          >
            <div
              style={{
                ...glass,
                borderRadius: 30,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                border:
                  isChosen && frame >= pick
                    ? "4px solid #5FF5EC"
                    : glass.border,
                boxShadow:
                  isChosen && frame >= pick
                    ? "0 0 40px rgba(95,245,236,.6)"
                    : glass.boxShadow,
              }}
            >
              <c.Ill size={130} />
              <span style={{ fontSize: 30, fontWeight: 800 }}>{c.label}</span>
            </div>
            {isChosen && (
              <Pop
                at={pick + 2}
                rotate={-5}
                style={{ position: "absolute", left: -10, top: -30 }}
              >
                <Chip size={22} bg={Y.ok} style={{ border: "4px solid #fff" }}>
                  <Tick size={22} />
                  Monetizable
                </Chip>
              </Pop>
            )}
          </div>
        );
      })}
      {/* destinations pop around the chosen card, with dotted links */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {DESTINOS.map((d) => {
          const p = interpolate(
            frame,
            [A(4, d.word), A(4, d.word) + 10],
            [0, 1],
            { ...clamp, easing: EASE },
          );
          if (p === 0 || d.x === 540) return null;
          const x0 = 540;
          const y0 = 1560;
          return (
            <line
              key={d.word}
              x1={x0}
              y1={y0}
              x2={x0 + (d.x - x0) * p}
              y2={y0 + 160 * p}
              stroke="#fff"
              strokeWidth={6}
              strokeDasharray="2 14"
              strokeLinecap="round"
              opacity={0.8}
            />
          );
        })}
      </svg>
      {DESTINOS.map((d) => (
        <Pop
          key={d.word}
          at={A(4, d.word)}
          style={{
            position: "absolute",
            left: d.x - 75,
            top: d.x === 540 ? 1690 : 1640,
            width: 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              ...circle(104, d.bg),
              border: "5px solid #fff",
              boxShadow: "0 12px 26px rgba(10,6,30,.4)",
            }}
          >
            <Glyph name={d.glyph} size={54} />
          </div>
          <span
            style={{
              ...glass,
              borderRadius: 14,
              padding: "2px 12px",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {d.label}
          </span>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

// 4. Someone donates via your link → a ring fills, your slice lights up.
const Porcentaje: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("porcentaje");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const dona = A(5, "dona");
  const pct = A(6, "porcentaje");
  const comision = A(6, "comisión");
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const fill = interpolate(frame, [dona + 6, dona + 30], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const slice = interpolate(frame, [pct, pct + 16], [0, 0.18], {
    ...clamp,
    easing: EASE,
  });
  const R = 120;
  const C = 2 * Math.PI * R;
  const coinDrop = interpolate(frame, [dona, dona + 12], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
          transform: `translateY(${(1 - enter) * 500}px)`,
        }}
      >
        {/* donor */}
        <Pop
          at={start + 2}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ ...circle(120, GRAD.cool), border: "5px solid #fff" }}>
            <Glyph name="amigos" size={64} />
          </div>
          <span
            style={{
              ...glass,
              borderRadius: 14,
              padding: "4px 14px",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Alguien dona
          </span>
        </Pop>
        {/* ring */}
        <div style={{ position: "relative", width: 300, height: 300 }}>
          <svg width={300} height={300} viewBox="0 0 300 300">
            <circle
              cx={150}
              cy={150}
              r={R}
              fill="rgba(22,14,52,.55)"
              stroke="rgba(255,255,255,.2)"
              strokeWidth={34}
            />
            <circle
              cx={150}
              cy={150}
              r={R}
              fill="none"
              stroke="url(#rg)"
              strokeWidth={34}
              strokeDasharray={`${C * fill} ${C}`}
              transform="rotate(-90 150 150)"
              strokeLinecap="round"
            />
            <circle
              cx={150}
              cy={150}
              r={R}
              fill="none"
              stroke="#FFD54A"
              strokeWidth={42}
              strokeDasharray={`${C * slice} ${C}`}
              transform="rotate(-90 150 150)"
              style={{ filter: "drop-shadow(0 0 10px rgba(255,213,74,.9))" }}
            />
            <defs>
              <linearGradient id="rg" x1="0" x2="1">
                <stop offset="0" stopColor={Y.teal} />
                <stop offset="1" stopColor={Y.purple} />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: POPPINS,
            }}
          >
            {frame < pct ? (
              <Heart size={80} color={Y.pink} />
            ) : (
              <>
                <span style={{ fontSize: 26, fontWeight: 700, opacity: 0.85 }}>
                  Tu parte
                </span>
                <span
                  style={{ fontSize: 64, fontWeight: 800, color: "#FFD54A" }}
                >
                  %
                </span>
              </>
            )}
          </div>
          {/* the donation coin dropping in */}
          {frame >= dona && coinDrop < 1 && (
            <div
              style={{
                position: "absolute",
                left: 100,
                top: -120 + coinDrop * 220,
                opacity: 1 - coinDrop * 0.6,
              }}
            >
              <Moneda size={100} />
            </div>
          )}
          <Burst at={comision} size={440} />
        </div>
        {/* your commission */}
        <Pop
          at={comision}
          from={0.3}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              ...circle(120, "linear-gradient(135deg, #FFD54A, #FF9F1C)"),
              border: "5px solid #fff",
              boxShadow: "0 0 40px rgba(255,213,74,.7)",
            }}
          >
            <Moneda size={86} />
          </div>
          <span
            style={{
              ...glass,
              borderRadius: 14,
              padding: "4px 14px",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Tu comisión
          </span>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

// 5. The loop: you share → someone supports → you earn, a comet circling.
const Ciclo: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("ciclo");
  if (!visible) return null;
  const at = [A(7, "compartes"), A(7, "apoya"), A(7, "recibes")];
  const nodes = [
    {
      x: 200,
      y: 1560,
      label: "Tú compartes",
      bg: GRAD.main,
      icon: <LinkIcon size={52} />,
    },
    {
      x: 540,
      y: 1450,
      label: "Alguien apoya",
      bg: GRAD.warm,
      icon: <Heart size={52} color="#fff" />,
    },
    {
      x: 880,
      y: 1560,
      label: "Tú recibes",
      bg: "linear-gradient(135deg, #FFD54A, #FF9F1C)",
      icon: <Moneda size={70} />,
    },
  ];
  const loop =
    "M 200 1560 C 300 1400, 440 1380, 540 1450 C 640 1380, 780 1400, 880 1560 C 760 1780, 320 1780, 200 1560 Z";
  const draw = interpolate(frame, [start, at[2] + 10], [0, 1], clamp);
  const comet = ((frame - start) / 45) % 1;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="cg" x1="0" x2="1">
            <stop offset="0" stopColor={Y.teal} />
            <stop offset=".5" stopColor={Y.pink} />
            <stop offset="1" stopColor="#FFD54A" />
          </linearGradient>
          <filter id="cglow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path
          d={loop}
          fill="none"
          stroke="url(#cg)"
          strokeWidth={14}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          filter="url(#cglow)"
        />
        <path
          d={loop}
          fill="none"
          stroke="url(#cg)"
          strokeWidth={7}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        {frame >= at[2] && (
          <path
            d={loop}
            fill="none"
            stroke="#fff"
            strokeWidth={16}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.03 1"
            strokeDashoffset={-comet}
            filter="url(#cglow)"
          />
        )}
      </svg>
      {nodes.map((n, k) => (
        <Pop
          key={k}
          at={at[k]}
          from={0.2}
          style={{
            position: "absolute",
            left: n.x - 95,
            top: n.y - 62,
            width: 190,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...circle(124, n.bg),
              border: "6px solid #fff",
              boxShadow: "0 16px 34px rgba(10,6,30,.5)",
            }}
          >
            {n.icon}
          </div>
          <div
            style={{
              ...glass,
              marginTop: 8,
              borderRadius: 16,
              padding: "6px 12px",
              fontSize: 24,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            {n.label}
          </div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

// 6. The app: phone with steps + commission notifications.
const STEPS: [string, string][] = [
  ["Descarga", "descarga"],
  ["Regístrate", "regístrate"],
  ["Modo Yoler", "activando"],
  ["Comparte", "compartir"],
];
const TOASTS = [
  { amount: 45, cause: "Perritos" },
  { amount: 120, cause: "Tratamiento" },
];
const AppScene: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("app");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const stepAt = STEPS.map(([, w]) => A(9, w));
  const done = stepAt.filter((f) => frame >= f).length;
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const toastAt = TOASTS.map((_, i) => A(9, "compartir") + 2 + i * 12);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 1320,
          transform: `translateX(${(1 - enter) * 420}px) rotate(${6 + (1 - enter) * 20}deg)`,
        }}
      >
        <Phone w={230} tiltY={-18} glow="rgba(255,5,102,.45)">
          <div
            style={{
              padding: "18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontFamily: POPPINS,
            }}
          >
            <Img
              src={staticFile(LOGO)}
              style={{ width: 140, alignSelf: "center" }}
            />
            {STEPS.map(([label], i) => (
              <div
                key={label}
                style={{ ...row, gap: 8, opacity: i < done ? 1 : 0.35 }}
              >
                <div style={circle(30, i < done ? Y.ok : "#D9D6E8")}>
                  {i < done ? (
                    <Tick size={20} />
                  ) : (
                    <span
                      style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: Y.ink }}>
                  {label}
                </span>
              </div>
            ))}
            <div
              style={{
                height: 12,
                borderRadius: 6,
                background: "#EEEBF6",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(done / STEPS.length) * 100}%`,
                  background: GRAD.warm,
                  borderRadius: 6,
                }}
              />
            </div>
          </div>
        </Phone>
      </div>
      {TOASTS.map((t, i) => {
        if (frame < toastAt[i]) return null;
        const p = spring({
          frame: frame - toastAt[i],
          fps,
          config: { damping: 13 },
        });
        const newer = TOASTS.filter(
          (_, j) => j > i && frame >= toastAt[j],
        ).length;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 50,
              top: 1480 + newer * 124,
              transform: `translateX(${(1 - p) * -600}px)`,
              opacity: Math.min(1, p * 1.5) * (1 - newer * 0.12),
            }}
          >
            <div
              style={{
                ...glass,
                borderRadius: 26,
                padding: "12px 18px",
                ...row,
                gap: 12,
                width: 480,
              }}
            >
              <Moneda size={54} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 21, fontWeight: 700, opacity: 0.75 }}>
                  Nueva comisión · {t.cause}
                </div>
                <div
                  style={{ fontSize: 36, fontWeight: 800, color: "#5FF5EC" }}
                >
                  +${t.amount} MXN
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 7. "No hay tope": the meter blows past its limit and the limit breaks off.
const Tope: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("tope");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const tope = A(10, "tope");
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const fill = interpolate(
    frame,
    [start + 4, tope, tope + 20],
    [0.1, 0.7, 1.25],
    { ...clamp, easing: EASE },
  );
  const broken = frame >= tope + 6;
  const fly = interpolate(frame, [tope + 6, tope + 26], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const amount = interpolate(fill, [0.1, 1.25], [120, 9999]);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1460,
          transform: `translateY(${(1 - enter) * 500}px)`,
        }}
      >
        <div
          style={{
            ...row,
            justifyContent: "space-between",
            marginBottom: 12,
            color: "#fff",
            fontFamily: POPPINS,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 800,
              textShadow: "0 3px 10px rgba(10,6,30,.7)",
            }}
          >
            Tus comisiones
          </span>
          <span
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "#5FF5EC",
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 3px 10px rgba(10,6,30,.7)",
            }}
          >
            {money(amount)}
            {broken ? "+" : ""}
          </span>
        </div>
        <div
          style={{
            position: "relative",
            height: 70,
            borderRadius: 35,
            ...glass,
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 6,
              bottom: 6,
              width: `calc(${Math.min(fill, 1.25) * 100}% - 12px)`,
              borderRadius: 30,
              background: GRAD.warm,
              boxShadow: broken ? "0 0 40px rgba(255,5,102,.8)" : "none",
            }}
          />
          {/* the limit marker */}
          <div
            style={{
              position: "absolute",
              left: "70%",
              top: -30,
              height: 130,
              width: 10,
              borderRadius: 5,
              background: "#fff",
              transformOrigin: "50% 100%",
              transform: `translate(${fly * 260}px, ${fly * 320}px) rotate(${fly * 120}deg)`,
              opacity: 1 - fly,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "70%",
              top: -76,
              transform: `translateX(-50%) translate(${fly * 200}px, ${fly * 300}px) rotate(${fly * 60}deg)`,
              opacity: 1 - fly,
            }}
          >
            <Chip size={24} bg={Y.ink}>
              Tope
            </Chip>
          </div>
          <Burst at={tope + 6} size={360} color="#FFD54A" />
        </div>
        <Pop
          at={tope + 8}
          rotate={-4}
          style={{ display: "flex", justifyContent: "center", marginTop: 26 }}
        >
          <Chip
            size={50}
            bg={GRAD.warm}
            style={{
              border: "6px solid #fff",
              boxShadow: "0 14px 40px rgba(255,5,102,.45)",
            }}
          >
            ¡Sin tope!
          </Chip>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- outro: gradient logo as is, over the video ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const start = SPEECH_END - 2;
  if (frame < start) return null;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        gap: 36,
        paddingTop: 1420,
      }}
    >
      <Pop at={start} from={0.3} rotate={-3}>
        <Img src={staticFile(LOGO)} style={{ width: 620 }} />
      </Pop>
      <Pop at={start + 12}>
        <Chip
          size={40}
          bg={GRAD.warm}
          style={{
            border: "6px solid #fff",
            boxShadow: "0 14px 40px rgba(26,18,64,.4)",
          }}
        >
          Activa tu modo Yoler
        </Chip>
      </Pop>
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [TOTAL - 8, TOTAL], [0, 1], clamp),
          background: "#000",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- sound: few, soft, low ---------- */
const SFX: { name: "pop" | "ding" | "cash"; at: number; v: number }[] = [
  ...YOLAPP_AT.map((at) => ({ name: "pop" as const, at: at - 2, v: 0.12 })),
  { name: "ding", at: A(2, "yoler") + 4, v: 0.1 },
  { name: "cash", at: A(6, "comisión"), v: 0.15 },
  { name: "ding", at: A(10, "tope") + 6, v: 0.1 },
  { name: "ding", at: SPEECH_END, v: 0.1 },
];

export const Yolapp7Reel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
      <Talking />
      <Ganar />
      <Switch id="modo" label="MODO YOLER" onAt={A(2, "yoler")} />
      <Elige />
      <Porcentaje />
      <Ciclo />
      <AppScene />
      <Tope />
      <Stickers />
      <LogoPops />
      <Captions />
      <Outro />
      <Voice />
      <Audio
        src={staticFile("yolapp/v7/musica.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 10, SPEECH_END - 10, SPEECH_END + 4, TOTAL - 15, TOTAL],
            [0, 0.045, 0.045, 0.18, 0.18, 0],
            clamp,
          )
        }
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={45}>
          <Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const YOLAPP7_FRAMES = TOTAL;
