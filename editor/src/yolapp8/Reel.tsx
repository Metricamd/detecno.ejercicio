// Yolapp reel 8 (1080 × 1920, 30 fps): "¿Ya activaste tu modo Yoler?" — a
// dialogue (she explains, he asks) about the app. Captions are the usual
// word-by-word ones, at the bottom over their hands.
//
// Face-safe layout: her face spans x ≈ 0–460, y ≈ 480–1060; his x ≈ 600–1080,
// y ≈ 280–960. Graphics live on the wall above them: the left block
// (x 30–560, y 40–420) or a thin full-width strip (y 40–260); the logo pops in
// the top-right corner (y ≤ 230). Video full screen, no filter.
//
// Audio: the video is muted; the voice plays from public/yolapp/v8/voz.wav
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
import { Burst, circle, glass } from "../yolapp/fx";
import {
  Chip,
  clamp,
  EASE,
  Glyph,
  Heart,
  LinkIcon,
  Pop,
  Tick,
} from "../yolapp/parts";
import { Moneda } from "../yolapp3/ilustraciones";
import {
  CLIPS,
  clipAt,
  GRAD,
  GraphicId,
  graphicSpan,
  isKeyword,
  SPEECH_END,
  TOTAL,
  W,
  wordAt,
  Word,
  WORDS,
  Y,
  YOLAPP_AT,
} from "./datos";

const SRC = "yolapp/v8/crudo.mp4";
const VOZ = "yolapp/v8/voz.wav";
const LOGO = "yolapp/logo/logo-color.png";
const A = wordAt;

/* ---------- video (gentle punch-ins on the speaker's side) + clean voice ---------- */
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip =
    CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ??
    CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  const hook =
    clip.i === 0
      ? interpolate(frame, [0, 14], [0.18, 0], { ...clamp, easing: EASE })
      : 0;
  // every other cut leans a little towards whoever is talking
  const scale = (clip.i % 2 === 0 ? 1.0 : 1.07) + 0.02 * local + hook;
  const origin = clip.who === "ella" ? "28% 40%" : "75% 35%";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, transformOrigin: origin }}
      >
        {CLIPS.map((c) => (
          <Sequence
            key={c.i}
            from={c.at}
            durationInFrames={c.len}
            layout="none"
          >
            <OffthreadVideo
              src={staticFile(SRC)}
              trimBefore={Math.round(c.from * 30)}
              muted
              style={{ width: W, height: 1920, objectFit: "cover" }}
            />
          </Sequence>
        ))}
        <Sequence from={SPEECH_END} layout="none">
          <Img
            src={staticFile("yolapp/v8/final.jpg")}
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Voice: React.FC = () => (
  <>
    {CLIPS.map((c) => (
      <Sequence key={c.i} from={c.at} durationInFrames={c.len}>
        <Audio
          src={staticFile(VOZ)}
          trimBefore={Math.round(c.from * 30)}
          volume={(f) => Math.min(1, (f + 1) / 2, (c.len - f) / 2)}
        />
      </Sequence>
    ))}
  </>
);

/* ---------- captions: word by word at the bottom, active word on a pink pill ---------- */
type Page = { words: Word[]; start: number; end: number };
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
  }));
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const page = PAGES.find((pg) => frame >= pg.start && frame < pg.end);
  if (!page) return null;
  const out = interpolate(frame, [page.end - 3, page.end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1440,
        height: 240,
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
                fontSize: 68,
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

/* ---------- logo pops (top-right) ---------- */
const LogoPops: React.FC = () => {
  const frame = useCurrentFrame();
  const clipOf = (f: number) =>
    CLIPS.find((x) => f >= x.at && f < x.at + x.len)!;
  const endOf = (f: number) => Math.min(f + 45, clipOf(f).at + clipOf(f).len);
  const at = [...YOLAPP_AT]
    .reverse()
    .find((f) => frame >= f - 2 && frame < endOf(f));
  if (at === undefined) return null;
  const end = endOf(at);
  const out = interpolate(frame, [end - 6, end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Pop
        at={at - 2}
        from={0.3}
        rotate={-4}
        style={{ position: "absolute", top: 60, right: 40 }}
      >
        <Img src={staticFile(LOGO)} style={{ width: 360 }} />
      </Pop>
    </AbsoluteFill>
  );
};

/* ---------- graphics on the wall ---------- */
const useSpan = (id: GraphicId) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start, end } = graphicSpan(id);
  const visible = frame >= start && frame < end;
  const exit = interpolate(frame, [end - 8, end], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  return { frame, fps, start, end, visible, exit, enter };
};
const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};
const LeftBlock: React.FC<{
  enter: number;
  exit: number;
  children: React.ReactNode;
}> = ({ enter, exit, children }) => (
  <div
    style={{
      position: "absolute",
      left: 36,
      top: 50,
      width: 540,
      opacity: 1 - exit,
      transform: `translateY(${(1 - enter) * -300}px)`,
    }}
  >
    {children}
  </div>
);

// 3D switch with kinetic label; `onAt` flips it.
const Switch: React.FC<{
  label: string;
  start: number;
  onAt: number;
  color?: string;
}> = ({ label, start, onAt, color = GRAD.warm }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const knob = spring({
    frame: frame - onAt,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const on = knob > 0.5;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <div style={{ display: "flex" }}>
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
                fontSize: 58,
                color: "#fff",
                opacity: p,
                whiteSpace: "pre",
                display: "inline-block",
                transform: `translateY(${(1 - p) * 24}px) rotate(${(1 - p) * 18}deg)`,
                textShadow: on
                  ? "0 0 22px rgba(255,5,102,.9), 0 4px 0 rgba(10,6,30,.6)"
                  : "0 4px 0 rgba(10,6,30,.6), 0 0 16px rgba(10,6,30,.6)",
              }}
            >
              {l}
            </span>
          );
        })}
      </div>
      <div
        style={{
          perspective: 900,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 300,
            height: 140,
            borderRadius: 70,
            transform: "rotateX(16deg)",
            background: on
              ? color
              : "linear-gradient(135deg, #4A4466, #2B2547)",
            boxShadow: on
              ? "0 0 50px rgba(255,5,102,.65), inset 0 6px 14px rgba(0,0,0,.25)"
              : "inset 0 6px 14px rgba(0,0,0,.4), 0 18px 36px rgba(10,6,30,.5)",
            border: "4px solid rgba(255,255,255,.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 9,
              left: 9 + knob * 160,
              ...circle(
                114,
                "radial-gradient(circle at 35% 30%, #fff, #E9E6F5)",
              ),
              boxShadow: "0 10px 22px rgba(10,6,30,.4)",
            }}
          >
            <Img src={staticFile(LOGO)} style={{ width: 86 }} />
          </div>
          <Burst at={onAt + 4} size={380} />
        </div>
        <Pop at={onAt + 8} rotate={6}>
          <Chip size={30} bg={Y.ok} style={{ border: "5px solid #fff" }}>
            <Tick size={28} />
            ON
          </Chip>
        </Pop>
      </div>
    </div>
  );
};

// 1. "¿Modo qué?" → the Yoler switch flips on.
const Modo: React.FC = () => {
  const { start, visible, exit, enter } = useSpan("modo");
  if (!visible) return null;
  return (
    <LeftBlock enter={enter} exit={exit}>
      <Switch label="MODO YOLER" start={start} onAt={A(2, "yoler")} />
      <Pop
        at={clipAt(1)}
        rotate={-8}
        style={{ position: "absolute", left: 420, top: -10 }}
      >
        <div
          style={{
            ...circle(96, GRAD.cool),
            border: "5px solid #fff",
            color: "#fff",
            fontFamily: POPPINS,
            fontWeight: 800,
            fontSize: 64,
          }}
        >
          ?
        </div>
      </Pop>
    </LeftBlock>
  );
};

// 2. "La nueva app de causas en México".
const App: React.FC = () => {
  const { frame, visible, exit, enter } = useSpan("app");
  if (!visible) return null;
  const mex = A(6, "méxico");
  return (
    <LeftBlock enter={enter} exit={exit}>
      <div
        style={{
          ...glass,
          borderRadius: 36,
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 700, opacity: 0.8 }}>
          La nueva app de
        </span>
        <div style={{ ...row, gap: 10, flexWrap: "wrap" }}>
          {[
            {
              label: "Causas",
              icon: <Heart size={34} color="#fff" />,
              bg: GRAD.warm,
              at: A(6, "causas"),
            },
            {
              label: "México",
              icon: <Glyph name="mundo" size={34} />,
              bg: GRAD.cool,
              at: mex,
            },
          ].map((b) => (
            <Pop key={b.label} at={b.at}>
              <div
                style={{
                  ...row,
                  gap: 10,
                  background: b.bg,
                  borderRadius: 999,
                  padding: "8px 22px 8px 10px",
                  border: "3px solid rgba(255,255,255,.6)",
                }}
              >
                <div style={{ ...circle(50, "rgba(255,255,255,.2)") }}>
                  {b.icon}
                </div>
                <span style={{ fontSize: 40, fontWeight: 800 }}>{b.label}</span>
              </div>
            </Pop>
          ))}
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: "rgba(255,255,255,.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${interpolate(frame, [clipAt(6), mex + 10], [0, 100], clamp)}%`,
              background: GRAD.main,
            }}
          />
        </div>
      </div>
    </LeftBlock>
  );
};

// 3. How it works, as a strip along the wall with a comet: enter → monetize
// cause → share link → someone donates → your commission.
const FLOW = [
  {
    label: "Entras",
    icon: <Img src={staticFile(LOGO)} style={{ width: 70 }} />,
    bg: "radial-gradient(circle at 35% 30%, #fff, #E9E6F5)",
    take: 7,
    word: "metes",
  },
  {
    label: "Causa monetizable",
    icon: <Heart size={46} color="#fff" />,
    bg: GRAD.cool,
    take: 7,
    word: "monetizar",
  },
  {
    label: "Compartes link",
    icon: <LinkIcon size={46} />,
    bg: GRAD.main,
    take: 7,
    word: "compartes",
  },
  {
    label: "Alguien dona",
    icon: <Glyph name="amigos" size={50} />,
    bg: GRAD.warm,
    take: 8,
    word: "donar",
  },
  {
    label: "Tu comisión",
    icon: <Moneda size={66} />,
    bg: "linear-gradient(135deg, #FFD54A, #FF9F1C)",
    take: 8,
    word: "comisión",
  },
];
const Flujo: React.FC = () => {
  const { frame, visible, exit } = useSpan("flujo");
  if (!visible) return null;
  const at = FLOW.map((f) => A(f.take, f.word));
  const xs = FLOW.map((_, i) => 110 + i * 215);
  const y = 130;
  const prog = interpolate(frame, at, [0, 0.25, 0.5, 0.75, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const cometX = xs[0] + (xs[4] - xs[0]) * prog;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <svg
        width={1080}
        height={400}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <defs>
          <linearGradient id="fg" x1="0" x2="1">
            <stop offset="0" stopColor={Y.teal} />
            <stop offset=".5" stopColor={Y.purple} />
            <stop offset="1" stopColor="#FFD54A" />
          </linearGradient>
          <filter id="fglow">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <line
          x1={xs[0]}
          y1={y}
          x2={xs[4]}
          y2={y}
          stroke="rgba(255,255,255,.3)"
          strokeWidth={8}
          strokeDasharray="2 18"
          strokeLinecap="round"
        />
        <line
          x1={xs[0]}
          y1={y}
          x2={cometX}
          y2={y}
          stroke="url(#fg)"
          strokeWidth={12}
          strokeLinecap="round"
          filter="url(#fglow)"
        />
        <line
          x1={xs[0]}
          y1={y}
          x2={cometX}
          y2={y}
          stroke="url(#fg)"
          strokeWidth={7}
          strokeLinecap="round"
        />
        <circle cx={cometX} cy={y} r={14} fill="#fff" filter="url(#fglow)" />
      </svg>
      {FLOW.map((f, k) => (
        <Pop
          key={k}
          at={at[k]}
          from={0.2}
          style={{
            position: "absolute",
            left: xs[k] - 95,
            top: y - 56,
            width: 190,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                ...circle(112, f.bg),
                border: "5px solid #fff",
                boxShadow: "0 14px 30px rgba(10,6,30,.45)",
              }}
            >
              {f.icon}
            </div>
            <div
              style={{
                ...circle(38, Y.ink),
                position: "absolute",
                left: -6,
                top: -6,
                color: "#fff",
                fontWeight: 800,
                fontSize: 20,
                border: "3px solid #fff",
                fontFamily: POPPINS,
              }}
            >
              {k + 1}
            </div>
            {k === 4 && <Burst at={at[4]} size={280} />}
          </div>
          <div
            style={{
              ...glass,
              marginTop: 6,
              borderRadius: 14,
              padding: "4px 10px",
              fontSize: 22,
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.05,
            }}
          >
            {f.label}
          </div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

// 4. "Ganar-ganar": two rings that lock together.
const Ganar: React.FC = () => {
  const { frame, visible, exit, enter } = useSpan("ganar");
  if (!visible) return null;
  const join = interpolate(
    frame,
    [A(10, "ganarganar") - 10, A(10, "ganarganar") + 6],
    [0, 1],
    { ...clamp, easing: EASE },
  );
  const ring = (
    label: string,
    sub: string,
    bg: string,
    side: number,
    at: number,
  ) => (
    <Pop
      at={at}
      style={{
        position: "absolute",
        left: 155 + side * (140 - join * 55),
        top: 0,
      }}
    >
      <div
        style={{
          ...circle(230, "transparent"),
          border: "16px solid",
          borderColor: "rgba(255,255,255,.9)",
          background: bg,
          boxShadow: "0 16px 36px rgba(10,6,30,.45)",
          flexDirection: "column",
          fontFamily: POPPINS,
          color: "#fff",
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 800 }}>{label}</span>
        <span style={{ fontSize: 22, fontWeight: 700, opacity: 0.9 }}>
          {sub}
        </span>
      </div>
    </Pop>
  );
  return (
    <LeftBlock enter={enter} exit={exit}>
      <div style={{ position: "relative", height: 260 }}>
        {ring(
          "Tú ganas",
          "comisiones",
          "linear-gradient(135deg, rgba(255,213,74,.9), rgba(255,159,28,.9))",
          -1,
          A(9, "comisiones"),
        )}
        {ring(
          "Ayudas",
          "a una causa",
          "linear-gradient(135deg, rgba(255,79,139,.9), rgba(125,14,213,.9))",
          1,
          A(10, "ayudar"),
        )}
        <Burst at={A(10, "ganarganar") + 6} size={360} />
      </div>
      <Pop
        at={A(10, "ganarganar") + 4}
        rotate={-4}
        style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
      >
        <Chip size={40} bg={GRAD.main} style={{ border: "5px solid #fff" }}>
          ¡Ganar-ganar!
        </Chip>
      </Pop>
    </LeftBlock>
  );
};

// 5. Sign-up steps checklist.
const PASOS: [string, number, string][] = [
  ["Entra a Yolapp", 12, "yolapp"],
  ["Descárgala", 13, "descargas"],
  ["Regístrate", 14, "registras"],
  ["Activa modo Yoler", 14, "activas"],
  ["Busca tu causa", 14, "buscar"],
];
const Pasos: React.FC = () => {
  const { frame, visible, exit, enter } = useSpan("pasos");
  if (!visible) return null;
  return (
    <LeftBlock enter={enter} exit={exit}>
      <div
        style={{
          ...glass,
          borderRadius: 34,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {PASOS.map(([label, take, word], i) => {
          const at = A(take, word);
          const done = frame >= at;
          return (
            <div
              key={label}
              style={{
                ...row,
                gap: 12,
                opacity: done ? 1 : 0.35,
                transform: `translateX(${done ? 0 : -10}px)`,
              }}
            >
              <div
                style={{
                  ...circle(44, done ? Y.ok : "rgba(255,255,255,.2)"),
                  border: "3px solid rgba(255,255,255,.6)",
                }}
              >
                {done ? (
                  <Tick size={28} />
                ) : (
                  <span style={{ fontSize: 22, fontWeight: 800 }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: 34, fontWeight: 800 }}>{label}</span>
            </div>
          );
        })}
      </div>
    </LeftBlock>
  );
};

// 6. "¡Ojo! monetizable" switch.
const Monetizable: React.FC = () => {
  const { start, visible, exit, enter } = useSpan("monetizable");
  if (!visible) return null;
  return (
    <LeftBlock enter={enter} exit={exit}>
      <Switch
        label="MONETIZABLE"
        start={start}
        onAt={A(15, "monetizable")}
        color="linear-gradient(135deg, #14C38E, #03C7C1)"
      />
      <Pop
        at={start + 2}
        rotate={-10}
        style={{ position: "absolute", left: 360, top: 70 }}
      >
        <Chip
          size={34}
          bg="linear-gradient(135deg, #FFB800, #FF4A3A)"
          style={{ border: "5px solid #fff" }}
        >
          ¡Ojo!
        </Chip>
      </Pop>
    </LeftBlock>
  );
};

// 7. Share anywhere: orbs fly out along the wall.
const DESTINOS = [
  { word: "redes", label: "Redes", glyph: "redes", bg: GRAD.deep },
  { word: "amigos", label: "Amigos", glyph: "amigos", bg: GRAD.cool },
  { word: "grupos", label: "Grupos", glyph: "grupo", bg: GRAD.warm },
  { word: "donde", label: "¡Donde sea!", glyph: "mundo", bg: GRAD.main },
] as const;
const Comparte: React.FC = () => {
  const { frame, visible, exit } = useSpan("comparte");
  if (!visible) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {DESTINOS.map((d, i) => {
        const at = A(16, d.word);
        const p = interpolate(frame, [at, at + 12], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.back(1.6)),
        });
        if (frame < at) return null;
        const x = 120 + i * 270;
        return (
          <div
            key={d.word}
            style={{
              position: "absolute",
              left: x - 85 + (1 - p) * (540 - x),
              top: 60 + (1 - p) * 120,
              width: 170,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              opacity: Math.min(1, p * 2),
              transform: `scale(${0.4 + 0.6 * p})`,
            }}
          >
            <div
              style={{
                ...circle(118, d.bg),
                border: "5px solid #fff",
                boxShadow: "0 14px 30px rgba(10,6,30,.45)",
              }}
            >
              <Glyph name={d.glyph} size={60} />
            </div>
            <span
              style={{
                ...glass,
                borderRadius: 14,
                padding: "2px 12px",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 8. "No hay tope": the bar breaks its limit.
const Tope: React.FC = () => {
  const { frame, start, visible, exit, enter } = useSpan("tope");
  if (!visible) return null;
  const tope = A(21, "tope");
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
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 60,
        opacity: 1 - exit,
        transform: `translateY(${(1 - enter) * -300}px)`,
      }}
    >
      <div
        style={{
          ...row,
          justifyContent: "space-between",
          marginBottom: 10,
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
          ${Math.round(amount).toLocaleString("es-MX")}
          {broken ? "+" : ""}
        </span>
      </div>
      <div
        style={{ position: "relative", height: 64, borderRadius: 32, ...glass }}
      >
        <div
          style={{
            position: "absolute",
            left: 6,
            top: 6,
            bottom: 6,
            width: `calc(${Math.min(fill, 1.25) * 100}% - 12px)`,
            borderRadius: 28,
            background: GRAD.warm,
            boxShadow: broken ? "0 0 40px rgba(255,5,102,.8)" : "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "70%",
            top: -26,
            height: 116,
            width: 10,
            borderRadius: 5,
            background: "#fff",
            transform: `translate(${fly * 240}px, ${fly * 160}px) rotate(${fly * 120}deg)`,
            opacity: 1 - fly,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "70%",
            top: -70,
            transform: `translateX(-50%) translate(${fly * 200}px, ${fly * 140}px) rotate(${fly * 60}deg)`,
            opacity: 1 - fly,
          }}
        >
          <Chip size={22} bg={Y.ink}>
            Tope
          </Chip>
        </div>
        <Burst at={tope + 6} size={340} />
      </div>
      <Pop
        at={tope + 8}
        rotate={-4}
        style={{ display: "flex", justifyContent: "flex-start", marginTop: 18 }}
      >
        <Chip
          size={46}
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
        gap: 30,
        paddingTop: 1430,
      }}
    >
      <Pop at={start} from={0.3} rotate={-3}>
        <Img src={staticFile(LOGO)} style={{ width: 600 }} />
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
  { name: "cash", at: A(8, "comisión"), v: 0.15 },
  { name: "ding", at: A(15, "monetizable") + 4, v: 0.1 },
  { name: "ding", at: A(21, "tope") + 6, v: 0.1 },
  { name: "ding", at: SPEECH_END, v: 0.1 },
];

export const Yolapp8Reel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
      <Talking />
      <Modo />
      <App />
      <Flujo />
      <Ganar />
      <Pasos />
      <Monetizable />
      <Comparte />
      <Tope />
      <LogoPops />
      <Captions />
      <Outro />
      <Voice />
      <Audio
        src={staticFile("yolapp/v8/musica.wav")}
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

export const YOLAPP8_FRAMES = TOTAL;
