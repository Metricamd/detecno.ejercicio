// Yolapp reel 5 (1080 × 1920, 30 fps): "Déjate cuidar" — the emotional cut.
// Same rules as reels 1–4 (public/yolapp/marca.md): full-screen video, no
// silences or retakes, nothing over the face (y ≈ 380–1050), cutaways over
// look-aways. The tone is softer: slow blur-fades instead of pops, glass
// cards, italic quotes, warm grade, floating lights and hearts, piano music.
import { loadFont } from "@remotion/fonts";
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
  staticFile,
  useCurrentFrame,
} from "remotion";
import { POPPINS, poppinsReady } from "../theme";
import { clamp } from "../yolapp/parts";
import {
  CLIPS,
  clipAt,
  CUTAWAYS,
  E,
  EGRAD,
  GRAPHICS,
  GraphicId,
  graphicSpan,
  isKeyword,
  SPEECH_END,
  srcFrame,
  TAIL_END,
  TOTAL,
  W,
  Word,
  wordAt,
  WORDS,
} from "./datos";
import { Abrazo, Balanza, Casa, Corazon, Mano, Manos } from "./ilustraciones";

const SRC = "yolapp/v5/crudo.mp4";
const LOGO = "yolapp/logo/logo-color.png";
const A = wordAt;
const SOFT = Easing.bezier(0.25, 0.1, 0.25, 1);
const italicReady = loadFont({
  family: POPPINS,
  url: staticFile("fonts/poppins-latin-700-italic.woff2"),
  weight: "700",
  style: "italic",
});

// 0 → 1 over `len` frames from `at`, eased softly.
const useFade = (at: number, len = 16) =>
  interpolate(useCurrentFrame(), [at, at + len], [0, 1], {
    ...clamp,
    easing: SOFT,
  });
const beatAt = (frame: number, at: number) =>
  Math.max(
    0,
    Math.sin(Math.PI * interpolate(frame, [at, at + 14], [0, 1], clamp)),
  );

// Soft appearance: fade, rise and un-blur.
const Fade: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  len?: number;
  rise?: number;
}> = ({ at, children, style, len = 16, rise = 24 }) => {
  const p = useFade(at, len);
  if (useCurrentFrame() < at) return null;
  return (
    <div
      style={{
        ...style,
        opacity: p,
        filter: `blur(${(1 - p) * 10}px)`,
        transform: `${style?.transform ?? ""} translateY(${(1 - p) * rise}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Is take i shown with a card?
const inGraphic = (i: number) => GRAPHICS.some((g) => i >= g.from && i <= g.to);

// Continuous pieces of footage: a take with a `skip` plays as two pieces.
const PARTS = CLIPS.flatMap((c) => {
  if (!c.skip) return [{ at: c.at, len: c.len, from: c.from }];
  const first = Math.round((c.skip[0] - c.from) * 30);
  return [
    { at: c.at, len: first, from: c.from },
    { at: c.at + first, len: c.len - first, from: c.skip[1] },
  ];
});

/* ---------- the talking-head video, full screen, warm grade ---------- */
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip =
    CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ??
    CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  // gentle: alternate 1.0 / 1.05 and drift slowly in
  const scale =
    (inGraphic(clip.i) || clip.i % 2 === 0 ? 1.0 : 1.05) + 0.035 * local;
  const tail = Math.max(
    1,
    Math.round((TAIL_END - CLIPS[CLIPS.length - 1].to) * 30),
  );
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
              volume={(f) => Math.min(1, (f + 1) / 3, (p.len - f) / 3)}
              style={{ width: W, height: 1920, objectFit: "cover" }}
            />
          </Sequence>
        ))}
        <Sequence from={SPEECH_END} durationInFrames={tail} layout="none">
          <OffthreadVideo
            src={staticFile(SRC)}
            trimBefore={Math.round(CLIPS[CLIPS.length - 1].to * 30)}
            muted
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
        <Sequence from={SPEECH_END + tail} layout="none">
          <Img
            src={staticFile("yolapp/v5/final.jpg")}
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
      {/* warm grade + vignette */}
      <AbsoluteFill
        style={{
          background: "rgba(255,150,110,.10)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 38%, rgba(0,0,0,0) 55%, rgba(42,26,62,.55) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(42,26,62,.5) 0%, rgba(42,26,62,0) 22%, rgba(42,26,62,0) 58%, rgba(42,26,62,.6) 100%)",
        }}
      />
      {/* fade in from black */}
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: interpolate(frame, [0, 12], [1, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- floating warm lights along the sides ---------- */
const LIGHTS = Array.from({ length: 16 }, (_, i) => ({
  x: i % 2 === 0 ? 20 + ((i * 53) % 200) : 860 + ((i * 37) % 200),
  r: 10 + ((i * 7) % 26),
  speed: 0.6 + ((i * 13) % 10) / 12,
  phase: (i * 137) % 1920,
  o: 0.18 + ((i * 11) % 10) / 40,
}));
const Lights: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {LIGHTS.map((l, i) => {
        const y = 1960 - ((frame * l.speed + l.phase) % 2100);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: l.x + Math.sin((frame + l.phase) / 40) * 16,
              top: y,
              width: l.r * 2,
              height: l.r * 2,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,230,200,.95), rgba(255,180,150,0) 70%)",
              opacity: l.o,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Hearts rising slowly along the sides.
const Hearts: React.FC<{ at: number; count?: number }> = ({
  at,
  count = 7,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const t = frame - at - i * 5;
        if (t < 0 || t > 70) return null;
        const left = i % 2 === 0;
        const x =
          (left ? 50 + (i % 3) * 45 : 900 - (i % 3) * 45) +
          Math.sin(t / 9 + i) * 20;
        const y = interpolate(t, [0, 70], [1750, 700 + (i % 3) * 120], {
          ...clamp,
          easing: Easing.out(Easing.quad),
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: interpolate(
                t,
                [0, 10, 50, 70],
                [0, 0.95, 0.9, 0],
                clamp,
              ),
            }}
          >
            <Corazon
              size={48 + (i % 3) * 18}
              fill={[E.rose, E.blush, "#fff"][i % 3]}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- captions: word by word, soft glow ---------- */
type Page = { words: Word[]; start: number; end: number; top: boolean };
const PAGES: Page[] = (() => {
  const pages: Word[][] = [];
  for (const c of CLIPS) {
    let cur: Word[] = [];
    for (const w of WORDS.filter((x) => x.clip === c.i)) {
      cur.push(w);
      const punct = /[,.?!:;»]$/.test(w.text);
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
    end: Math.min(
      i + 1 < pages.length ? Math.floor(pages[i + 1][0].start) : SPEECH_END,
      CLIPS[ws[0].clip].at + CLIPS[ws[0].clip].speech + 4,
    ),
    top: inGraphic(ws[0].clip),
  }));
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const page = PAGES.find((pg) => frame >= pg.start && frame < pg.end);
  if (!page) return null;
  const out = interpolate(frame, [page.end - 5, page.end], [1, 0], clamp);
  const size = page.top ? 60 : 68;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: page.top ? 140 : 1260,
        height: 230,
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
          gap: "4px 16px",
          opacity: out,
        }}
      >
        {page.words.map((w, i) => {
          const t = frame - w.start;
          const active = frame >= w.start && frame < w.end + 3;
          const inP = interpolate(t, [-2, 7], [0, 1], {
            ...clamp,
            easing: SOFT,
          });
          const key = isKeyword(w.text);
          return (
            <span
              key={i}
              style={{
                fontFamily: POPPINS,
                fontWeight: 600,
                fontSize: size,
                lineHeight: 1.15,
                color: active ? E.peach : key ? E.blush : "#fff",
                opacity: inP,
                filter: `blur(${(1 - inP) * 8}px)`,
                transform: `translateY(${(1 - inP) * 12}px) scale(${active ? 1.05 : 1})`,
                textShadow: active
                  ? "0 0 22px rgba(255,140,120,.9), 0 3px 10px rgba(42,26,62,.8)"
                  : "0 0 18px rgba(42,26,62,.75), 0 3px 8px rgba(42,26,62,.85)",
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

/* ---------- italic quotes above the head on the talking-head shots ---------- */
const Quote: React.FC<{
  at: number;
  until: number;
  text: string;
  top?: number;
  size?: number;
}> = ({ at, until, text, top = 200, size = 64 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= until) return null;
  const p = interpolate(frame, [at, at + 18], [0, 1], {
    ...clamp,
    easing: SOFT,
  });
  const out = interpolate(frame, [until - 10, until], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: p * out,
        filter: `blur(${(1 - p) * 12}px)`,
        transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      <div
        style={{
          fontFamily: POPPINS,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.12,
          color: "#fff",
          textAlign: "center",
          textShadow:
            "0 0 30px rgba(255,92,138,.55), 0 4px 14px rgba(42,26,62,.8)",
        }}
      >
        {text}
      </div>
      <div
        style={{
          height: 4,
          width: 220 * p,
          borderRadius: 2,
          background:
            "linear-gradient(90deg, rgba(255,179,207,0), #FFB3CF, rgba(255,179,207,0))",
        }}
      />
    </div>
  );
};

const Quotes: React.FC = () => (
  <>
    <Quote
      at={A(0, "necesitar")}
      until={clipAt(1)}
      text="Necesitar a alguien"
    />
    <Quote
      at={A(3, "permitir")}
      until={clipAt(4)}
      text="Permitir que nos cuiden"
    />
    <Quote
      at={A(4, "grabado")}
      until={clipAt(5)}
      text="Algo que se me quedó grabado"
      size={56}
    />
    <Quote
      at={A(8, "ayuda")}
      until={clipAt(9)}
      text="A mí también me cuesta pedir ayuda"
      size={54}
    />
    <Quote
      at={A(13, "permitirme")}
      until={clipAt(15)}
      text="¿Por qué me cuesta tanto?"
    />
    <Quote
      at={A(18, "ayude")}
      until={clipAt(19)}
      text="Cuando no dejamos que nos ayuden"
      size={56}
    />
    <Quote
      at={A(20, "compartirlo")}
      until={clipAt(21)}
      text="¿Demasiado para compartirlo?"
      size={58}
    />
    <Quote
      at={A(26, "algo")}
      until={clipAt(27)}
      text="Te tengo que decir algo"
    />
    <Quote
      at={A(29, "crecer")}
      until={clipAt(30)}
      text="Dejarte cuidar es crecer"
    />
    <Quote
      at={A(30, "querer")}
      until={clipAt(31)}
      text="Dejarte cuidar es querer"
    />
    <Quote at={A(33, "ti")} until={A(33, "ella")} text="Estar para ti" />
    <Quote
      at={A(33, "ella")}
      until={SPEECH_END}
      text="…como tú estás para ella"
      size={58}
    />
  </>
);

const HeartMoments: React.FC = () => (
  <>
    <Hearts at={A(6, "apoyas")} />
    <Hearts at={A(12, "seguro")} count={5} />
    <Hearts at={A(28, "tuyo")} />
    <Hearts at={A(30, "querer")} count={5} />
    <Hearts at={SPEECH_END - 10} count={9} />
  </>
);

/* ---------- soft glass cards on the lower third ---------- */
const Scene: React.FC<{ id: GraphicId; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const frame = useCurrentFrame();
  const { start, end } = graphicSpan(id);
  if (frame < start || frame >= end) return null;
  const p = interpolate(frame, [start, start + 18], [0, 1], {
    ...clamp,
    easing: SOFT,
  });
  const out = interpolate(frame, [end - 12, end], [1, 0], {
    ...clamp,
    easing: SOFT,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1180,
        height: 480,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: p * out,
        filter: `blur(${(1 - p * out) * 12}px)`,
        transform: `translateY(${(1 - p) * 40 + (1 - out) * 20}px)`,
      }}
    >
      {children}
    </div>
  );
};

const glass: React.CSSProperties = {
  background: "rgba(58,28,82,.38)",
  backdropFilter: "blur(22px) saturate(1.2)",
  WebkitBackdropFilter: "blur(22px) saturate(1.2)",
  border: "2px solid rgba(255,255,255,.38)",
  borderRadius: 44,
  boxShadow: "0 24px 60px rgba(42,26,62,.35)",
  color: "#fff",
  fontFamily: POPPINS,
};
const Glass: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div style={{ ...glass, ...style }}>{children}</div>
);
const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = EGRAD.warm, size = 32, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: bg,
      color: "#fff",
      borderRadius: 999,
      padding: `${size * 0.35}px ${size * 0.8}px`,
      fontFamily: POPPINS,
      fontWeight: 700,
      fontSize: size,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(255,92,138,.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Dar: React.FC = () => {
  const items: [string, number, React.ReactNode][] = [
    ["Estar", A(1, "estar"), <Abrazo key="a" size={130} />],
    [
      "Escuchar",
      A(2, "escucharlas"),
      <Corazon key="c" size={100} fill="rgba(255,255,255,.95)" />,
    ],
    ["Sostener", A(2, "sostenerlas"), <Manos key="m" size={130} />],
  ];
  return (
    <Scene id="dar">
      <Glass
        style={{
          width: 920,
          padding: "26px 20px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {items.map(([label, at, art]) => (
          <Fade
            key={label}
            at={at}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              width: 260,
            }}
          >
            <div style={{ height: 140, display: "flex", alignItems: "center" }}>
              {art}
            </div>
            <span style={{ fontSize: 40, fontWeight: 700 }}>{label}</span>
          </Fade>
        ))}
      </Glass>
    </Scene>
  );
};

// The friend's words, revealed as she says them.
const Cita: React.FC = () => {
  const frame = useCurrentFrame();
  const words = WORDS.filter((w) => w.clip === 5 || w.clip === 6);
  const apoyas = A(6, "apoyas");
  return (
    <Scene id="cita">
      <Glass
        style={{ width: 940, padding: "34px 44px 30px", position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            left: 22,
            top: -30,
            fontSize: 150,
            lineHeight: 1,
            fontWeight: 800,
            color: E.blush,
            fontFamily: POPPINS,
            textShadow: "0 0 24px rgba(255,92,138,.6)",
          }}
        >
          “
        </div>
        <div
          style={{
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 44,
            lineHeight: 1.3,
            textAlign: "center",
          }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              style={{
                opacity: interpolate(
                  frame,
                  [w.start - 2, w.start + 6],
                  [0.18, 1],
                  clamp,
                ),
                color: ["apoyas", "apoyarte", "recuerda"].some((k) =>
                  w.text.toLowerCase().includes(k),
                )
                  ? E.blush
                  : "#fff",
              }}
            >
              {w.text.replace(/[«»]/g, "")}{" "}
            </span>
          ))}
        </div>
        <div style={{ position: "absolute", right: 30, bottom: -36 }}>
          <Corazon size={78} beat={beatAt(frame, apoyas)} />
        </div>
      </Glass>
    </Scene>
  );
};

const Carga: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(
    frame,
    [A(10, "carga") + 6, A(10, "carga") + 18],
    [0, 1],
    { ...clamp, easing: SOFT },
  );
  const chips: [string, number][] = [
    ["Intimidad", A(11, "intimidad")],
    ["Confianza", A(12, "confianza")],
  ];
  const seguro = A(12, "seguro");
  return (
    <Scene id="carga">
      <Glass
        style={{
          width: 920,
          padding: "28px 34px",
          display: "flex",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div style={{ position: "relative", alignSelf: "flex-start" }}>
            <span
              style={{
                fontSize: 50,
                fontWeight: 700,
                opacity: 1 - strike * 0.45,
              }}
            >
              Una carga
            </span>
            <div
              style={{
                position: "absolute",
                left: -6,
                top: "52%",
                height: 6,
                width: `${strike * 105}%`,
                borderRadius: 3,
                background: E.rose,
                boxShadow: "0 0 12px rgba(255,92,138,.8)",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {chips.map(([label, at]) => (
              <Fade key={label} at={at}>
                <Pill size={34}>{label}</Pill>
              </Fade>
            ))}
            <Fade at={seguro}>
              <Pill size={34} bg={EGRAD.dawn}>
                Un lugar seguro
              </Pill>
            </Fade>
          </div>
        </div>
        <Fade at={seguro - 6}>
          <Casa
            size={190}
            draw={useFade(seguro - 6, 24)}
            beat={beatAt(frame, seguro + 16)}
          />
        </Fade>
      </Glass>
    </Scene>
  );
};

const Peso: React.FC<{ text: string }> = ({ text }) => (
  <Pill size={30} style={{ boxShadow: "0 8px 20px rgba(42,26,62,.3)" }}>
    {text}
  </Pill>
);
const BalanzaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cuidar = A(16, "cuidar");
  const cuidados = A(17, "cuidados");
  const tilt = interpolate(
    frame,
    [cuidar, cuidar + 24, cuidados, cuidados + 30],
    [0, 16, 16, 0],
    { ...clamp, easing: SOFT },
  );
  return (
    <Scene id="balanza">
      <Glass
        style={{
          width: 940,
          padding: "18px 10px 8px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Balanza
          width={860}
          tilt={tilt}
          left={
            <Fade at={A(15, "capacidad")}>
              <Peso text="Cuidar a los demás" />
            </Fade>
          }
          right={
            <Fade at={A(17, "derecho")}>
              <Pill size={30} bg={EGRAD.dawn}>
                Ser cuidados
              </Pill>
            </Fade>
          }
        />
      </Glass>
    </Scene>
  );
};

const Persona: React.FC<{ label: string; highlight?: number }> = ({
  label,
  highlight = 0,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      width: 200,
    }}
  >
    <div
      style={{
        width: 130,
        height: 130,
        borderRadius: "50%",
        border: "4px solid #fff",
        background: `rgba(255,92,138,${0.15 + highlight * 0.5})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${highlight * 40}px rgba(255,92,138,.8)`,
      }}
    >
      <svg
        width={70}
        height={70}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </svg>
    </div>
    <span style={{ fontSize: 36, fontWeight: 700 }}>{label}</span>
  </div>
);
const Decision: React.FC = () => {
  const frame = useCurrentFrame();
  const pert = A(24, "pertenece");
  const move = interpolate(frame, [pert - 4, pert + 20], [0, 1], {
    ...clamp,
    easing: SOFT,
  });
  const doubts: [string, number][] = [
    ["¿No puede?", A(22, "puede")],
    ["¿No quiere?", A(22, "quiere")],
    ["¿No sería capaz?", A(23, "capaz")],
  ];
  const fadeDoubts = interpolate(frame, [pert, pert + 14], [1, 0.25], clamp);
  return (
    <Scene id="decision">
      <Glass style={{ width: 940, padding: "26px 30px", position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Persona label="Tú" highlight={1 - move} />
          <div style={{ flex: 1, position: "relative", height: 70 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 33,
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,.45)",
              }}
            />
            <Fade
              at={A(21, "decidiendo")}
              style={{ position: "absolute", left: `${move * 64}%`, top: 6 }}
            >
              <Pill size={28} bg={EGRAD.dawn}>
                Decidir
              </Pill>
            </Fade>
          </div>
          <Persona label="El otro" highlight={move} />
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            marginTop: 18,
            opacity: fadeDoubts,
            minHeight: 56,
          }}
        >
          {doubts.map(([d, at]) => (
            <Fade key={d} at={at}>
              <div
                style={{
                  border: "2px dashed rgba(255,255,255,.7)",
                  borderRadius: 999,
                  padding: "8px 22px",
                  fontSize: 28,
                  fontWeight: 600,
                }}
              >
                {d}
              </div>
            </Fade>
          ))}
        </div>
      </Glass>
    </Scene>
  );
};

const Lugar: React.FC = () => {
  const frame = useCurrentFrame();
  const a1 = A(27, "seguro");
  const a2 = A(28, "tuyo");
  const loop = useFade(a2 - 6, 26);
  return (
    <Scene id="lugar">
      <Glass
        style={{
          width: 940,
          padding: "24px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Fade
          at={a1 - 8}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            width: 300,
          }}
        >
          <Casa
            size={170}
            draw={useFade(a1 - 8, 26)}
            beat={beatAt(frame, a1 + 18)}
          />
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            Eres su lugar seguro
          </span>
        </Fade>
        <svg width={200} height={180} viewBox="0 0 200 180">
          <path
            d="M10 70 C60 10 140 10 190 70"
            fill="none"
            stroke="#fff"
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - useFade(a1, 22)}
          />
          <path
            d="M190 110 C140 170 60 170 10 110"
            fill="none"
            stroke={E.blush}
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - loop}
          />
        </svg>
        <Fade
          at={a2 - 6}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            width: 300,
          }}
        >
          <Casa size={170} draw={loop} beat={beatAt(frame, a2 + 18)} />
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            Deja que sea el tuyo
          </span>
        </Fade>
      </Glass>
    </Scene>
  );
};

const ManoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const mano = A(31, "mano");
  const drop = interpolate(frame, [mano + 6, mano + 30], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  return (
    <Scene id="mano">
      <Glass
        style={{
          width: 920,
          padding: "24px 34px",
          display: "flex",
          alignItems: "center",
          gap: 30,
        }}
      >
        <div style={{ position: "relative", width: 260, height: 240 }}>
          <div style={{ position: "absolute", left: 10, top: 20 }}>
            <Mano size={240} draw={useFade(clipAt(31) + 4, 30)} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 104,
              top: interpolate(drop, [0, 1], [-20, 98]),
              opacity: Math.min(1, drop * 3),
            }}
          >
            <Corazon size={70} beat={beatAt(frame, mano + 30)} />
          </div>
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Fade at={mano}>
            <span
              style={{
                fontSize: 46,
                fontWeight: 700,
                fontStyle: "italic",
                lineHeight: 1.15,
              }}
            >
              Cuando alguien te ofrezca su mano…
            </span>
          </Fade>
          <Fade at={A(32, "apartarla")}>
            <Pill size={34} bg={EGRAD.dawn}>
              No la apartes
            </Pill>
          </Fade>
        </div>
      </Glass>
    </Scene>
  );
};

/* ---------- soft cutaways over the look-aways ---------- */
const CUT_LOOK: Record<
  (typeof CUTAWAYS)[number]["id"],
  { text: string; art: React.ReactNode; bg: string }
> = {
  profundo: {
    text: "Algo más profundo",
    art: <Corazon size={230} fill="rgba(255,255,255,.95)" />,
    bg: EGRAD.dusk,
  },
  dolor: { text: "Nuestro dolor", art: <Manos size={300} />, bg: EGRAD.dusk },
  decidir: {
    text: "Decidimos por el otro",
    art: <Abrazo size={300} />,
    bg: EGRAD.dawn,
  },
  ayudando: {
    text: "Siempre ayudando",
    art: <Manos size={300} />,
    bg: EGRAD.dawn,
  },
  estar: { text: "Estar para ti", art: <Abrazo size={300} />, bg: EGRAD.dusk },
};
const Cutaways: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = CUTAWAYS.find(
    (c) => frame >= srcFrame(c.from) && frame < srcFrame(c.to),
  );
  if (!cut) return null;
  const start = srcFrame(cut.from);
  const end = srcFrame(cut.to);
  const look = CUT_LOOK[cut.id];
  const p = Math.min(
    interpolate(frame, [start, start + 6], [0, 1], { ...clamp, easing: SOFT }),
    interpolate(frame, [end - 5, end], [1, 0], clamp),
  );
  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${40 * p}px)`,
        WebkitBackdropFilter: `blur(${40 * p}px)`,
      }}
    >
      <AbsoluteFill style={{ background: look.bg, opacity: 0.85 * p }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 40,
          opacity: p,
        }}
      >
        <div
          style={{
            transform: `scale(${0.9 + 0.1 * p})`,
            filter: "drop-shadow(0 0 30px rgba(255,255,255,.5))",
          }}
        >
          {look.art}
        </div>
        <div
          style={{
            fontFamily: POPPINS,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 92,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.05,
            padding: "0 60px",
            textShadow: "0 0 30px rgba(255,92,138,.6)",
          }}
        >
          {look.text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- outro: warm veil, gradient logo as is ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const start = SPEECH_END;
  if (frame < start - 6) return null;
  const veil = interpolate(frame, [start - 6, start + 30], [0, 1], {
    ...clamp,
    easing: SOFT,
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(42,26,62,0) 30%, rgba(42,26,62,.55) 100%)",
          opacity: veil,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 34,
          paddingTop: 1220,
        }}
      >
        <Fade at={start + 6} len={26} rise={30}>
          <Img src={staticFile(LOGO)} style={{ width: 700 }} />
        </Fade>
        <Fade at={start + 26} len={22}>
          <Pill size={44} bg={EGRAD.warm}>
            <Corazon size={44} fill="#fff" />
            Déjate cuidar
          </Pill>
        </Fade>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: interpolate(frame, [TOTAL - 22, TOTAL], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- sound: soft chimes, breaths and heartbeats ---------- */
const SFX: { name: "brillo" | "suave" | "latido"; at: number; v: number }[] = [
  ...GRAPHICS.map((g) => ({
    name: "suave" as const,
    at: graphicSpan(g.id).start - 4,
    v: 0.22,
  })),
  ...CUTAWAYS.map((c) => ({
    name: "suave" as const,
    at: srcFrame(c.from) - 3,
    v: 0.25,
  })),
  ...[
    A(0, "necesitar"),
    A(3, "permitir"),
    A(4, "grabado"),
    A(8, "ayuda"),
    A(13, "permitirme"),
    A(18, "ayude"),
    A(20, "compartirlo"),
    A(26, "algo"),
    A(29, "crecer"),
    A(30, "querer"),
    A(33, "ti"),
  ].map((at) => ({ name: "brillo" as const, at, v: 0.16 })),
  { name: "brillo", at: A(1, "estar"), v: 0.14 },
  { name: "brillo", at: A(2, "escucharlas"), v: 0.14 },
  { name: "brillo", at: A(2, "sostenerlas"), v: 0.14 },
  { name: "latido", at: A(6, "apoyas"), v: 0.4 },
  { name: "brillo", at: A(11, "intimidad"), v: 0.14 },
  { name: "brillo", at: A(12, "confianza"), v: 0.14 },
  { name: "latido", at: A(12, "seguro") + 16, v: 0.35 },
  { name: "brillo", at: A(17, "cuidados"), v: 0.16 },
  { name: "brillo", at: A(24, "pertenece"), v: 0.16 },
  { name: "latido", at: A(28, "tuyo") + 18, v: 0.35 },
  { name: "latido", at: A(31, "mano") + 30, v: 0.4 },
  { name: "brillo", at: SPEECH_END + 6, v: 0.22 },
  { name: "latido", at: SPEECH_END + 30, v: 0.3 },
];

export const Yolapp5Reel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    Promise.all([poppinsReady(), italicReady]).then(() =>
      continueRender(handle),
    );
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
      <Talking />
      <Lights />
      <Dar />
      <Cita />
      <Carga />
      <BalanzaScene />
      <Decision />
      <Lugar />
      <ManoScene />
      <Quotes />
      <HeartMoments />
      <Cutaways />
      <Captions />
      <Outro />
      <Audio
        src={staticFile("yolapp/v5/musica.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 30, SPEECH_END - 20, SPEECH_END + 10, TOTAL - 20, TOTAL],
            [0, 0.15, 0.15, 0.5, 0.5, 0],
            clamp,
          )
        }
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={70}>
          <Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const YOLAPP5_FRAMES = TOTAL;
