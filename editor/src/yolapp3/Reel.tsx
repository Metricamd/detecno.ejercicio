// Yolapp reel 3 (1080 × 1920, 30 fps): "Conviértete en Yoler" — earn while
// sharing causes. Same look and rules as reels 1–2 (public/yolapp/marca.md):
// full-screen video, word-by-word captions, stickers above the head and brand
// cards, illustrations and diagrams on the lower band. This take is framed
// tighter: the face spans y ≈ 420–1300, so cards live in y ≈ 1345–1675.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { POPPINS, poppinsReady } from "../theme";
import {
  Card,
  Chip,
  clamp,
  EASE,
  Glyph,
  Heart,
  Pop,
  Sticker,
  Tick,
} from "../yolapp/parts";
import {
  CLIPS,
  clipAt,
  CUTAWAYS,
  GRAD,
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
  Y,
} from "./datos";
import { Comida, Hospital, Moneda, Perro, Publicacion } from "./ilustraciones";

const SRC = "yolapp/v3/crudo.mp4";
const LOGO = "yolapp/logo/logo-color.png";
const A = wordAt;
const BAND = { top: 1345, height: 330 };

// Is take i shown with a brand card?
const inGraphic = (i: number) => GRAPHICS.some((g) => i >= g.from && i <= g.to);
const SPANS = (() => {
  const out: { start: number; end: number }[] = [];
  for (const s of GRAPHICS.map((g) => graphicSpan(g.id))) {
    const last = out[out.length - 1];
    if (last && last.end === s.start) last.end = s.end;
    else out.push({ ...s });
  }
  return out;
})();

// Continuous pieces of footage: a take with a `skip` plays as two pieces.
const PARTS = CLIPS.flatMap((c) => {
  if (!c.skip) return [{ at: c.at, len: c.len, from: c.from }];
  const first = Math.round((c.skip[0] - c.from) * 30);
  return [
    { at: c.at, len: first, from: c.from },
    { at: c.at + first, len: c.len - first, from: c.skip[1] },
  ];
});

/* ---------- the talking-head video, always full screen ---------- */
// The face is already big in this take, so the punch-ins are gentler.
const zoomFor = (i: number) => (inGraphic(i) ? 1.0 : i % 2 === 0 ? 1.0 : 1.08);
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip =
    CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ??
    CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  // hook: start tight and pull out; every cut drifts in slowly
  const hook =
    clip.i === 0
      ? interpolate(frame, [0, 14], [0.22, 0], { ...clamp, easing: EASE })
      : 0;
  const scale = zoomFor(clip.i) + 0.025 * local + hook;
  const tail = Math.round((TAIL_END - CLIPS[CLIPS.length - 1].to) * 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, transformOrigin: "50% 45%" }}
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
        {/* outro: let the last take run on silently, then hold its last frame */}
        <Sequence
          from={SPEECH_END}
          durationInFrames={Math.max(1, tail)}
          layout="none"
        >
          <OffthreadVideo
            src={staticFile(SRC)}
            trimBefore={Math.round(CLIPS[CLIPS.length - 1].to * 30)}
            muted
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
        <Sequence from={SPEECH_END + Math.max(1, tail)} layout="none">
          <Img
            src={staticFile("yolapp/v3/final.jpg")}
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
      {/* soft top and bottom shade so captions and cards read */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(26,18,64,.45) 0%, rgba(26,18,64,0) 20%, rgba(26,18,64,0) 62%, rgba(26,18,64,.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

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
    // a silent tail shows no caption
    end: Math.min(
      i + 1 < pages.length ? Math.floor(pages[i + 1][0].start) : SPEECH_END,
      CLIPS[ws[0].clip].at + CLIPS[ws[0].clip].speech + 4,
    ),
    // with a card on the lower band the captions go above the head
    top: inGraphic(ws[0].clip),
  }));
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const page = PAGES.find((pg) => frame >= pg.start && frame < pg.end);
  if (!page) return null;
  const out = interpolate(frame, [page.end - 3, page.end], [1, 0], clamp);
  const size = page.top ? 62 : 70;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: page.top ? 130 : 1380,
        height: page.top ? 240 : 240,
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
          const key = isKeyword(w.text);
          return (
            <span
              key={i}
              style={{
                fontFamily: POPPINS,
                fontWeight: 800,
                fontSize: size,
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: active ? "#fff" : key ? "#5FF5EC" : "#fff",
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

/* ---------- stickers on the talking-head shots (above the head) ---------- */
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

// Sticker that gets crossed out at `strikeAt`.
const Tachado: React.FC<{
  at: number;
  strikeAt: number;
  text: string;
  top: number;
}> = ({ at, strikeAt, text, top }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [strikeAt, strikeAt + 8], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <AbsoluteFill>
      <Sticker
        at={at}
        text={text}
        bg="linear-gradient(135deg, #6B6F94, #3A3560)"
        size={60}
        rotate={-3}
        top={top}
      />
      <div
        style={{
          position: "absolute",
          top: top + 40,
          left: 150,
          width: 780 * s,
          height: 14,
          borderRadius: 7,
          background: Y.pink,
          transform: "rotate(-4deg)",
          boxShadow: "0 4px 12px rgba(255,5,102,.5)",
        }}
      />
    </AbsoluteFill>
  );
};

const Stickers: React.FC = () => (
  <>
    <Between from={clipAt(2)} to={clipAt(3)}>
      <Sticker
        at={A(2, "causas")}
        text="Muchísimas causas"
        bg={GRAD.warm}
        size={66}
        rotate={-3}
        top={180}
      />
    </Between>
    <Between from={clipAt(6)} to={clipAt(7)}>
      <Sticker
        at={clipAt(6) + 2}
        text="¿Y tú qué puedes hacer?"
        bg={GRAD.main}
        size={58}
        rotate={3}
        top={190}
      />
    </Between>
    <Between from={clipAt(8)} to={clipAt(9)}>
      <Sticker
        at={A(8, "pasos")}
        text="En muy pocos pasos"
        bg={GRAD.cool}
        size={60}
        rotate={-3}
        top={150}
      />
      <Sticker
        at={A(8, "pasos") + 10}
        text="Paso 1"
        bg={GRAD.warm}
        size={84}
        rotate={4}
        top={280}
      />
    </Between>
    <Between from={clipAt(16)} to={clipAt(17)}>
      <Tachado
        at={clipAt(16) + 2}
        strikeAt={A(16, "compartir", 1)}
        text="Compartir por compartir"
        top={190}
      />
    </Between>
    <Between from={clipAt(17)} to={clipAt(18)}>
      <Sticker
        at={A(17, "causas")}
        text="Causas que hacen"
        bg={GRAD.cool}
        size={62}
        rotate={-3}
        top={150}
      />
      <Sticker
        at={A(17, "diferencia")}
        text="la diferencia"
        bg={GRAD.warm}
        size={70}
        rotate={3}
        top={275}
      />
    </Between>
  </>
);

/* ---------- brand cards on the lower band ---------- */
const Scene: React.FC<{ id: GraphicId; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const frame = useCurrentFrame();
  const { start, end } = graphicSpan(id);
  if (frame < start || frame >= end) return null;
  const enter = interpolate(frame, [start, start + 12], [1, 0], {
    ...clamp,
    easing: EASE,
  });
  const exit = interpolate(frame, [end - 8, end], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: BAND.top,
        height: BAND.height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${(enter + exit) * 600}px) rotate(${(enter - exit) * 4}deg)`,
      }}
    >
      {children}
    </div>
  );
};

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
};
const Badge: React.FC<{
  at: number;
  text: string;
  bg?: string;
  style?: React.CSSProperties;
}> = ({ at, text, bg = Y.ok, style }) => (
  <Pop
    at={at}
    rotate={-4}
    style={{ position: "absolute", right: -20, top: -36, ...style }}
  >
    <Chip
      size={30}
      bg={bg}
      style={{
        border: "5px solid #fff",
        boxShadow: "0 12px 30px rgba(26,18,64,.35)",
      }}
    >
      <Tick size={32} />
      {text}
    </Chip>
  </Pop>
);

// Arrow drawn from left to right as `p` goes 0 → 1.
const Arrow: React.FC<{ p: number; w?: number; color?: string }> = ({
  p,
  w = 90,
  color = Y.purple,
}) => (
  <svg width={w} height={40} viewBox={`0 0 ${w} 40`} style={{ flexShrink: 0 }}>
    <line
      x1={4}
      y1={20}
      x2={4 + (w - 20) * p}
      y2={20}
      stroke={color}
      strokeWidth={8}
      strokeLinecap="round"
      strokeDasharray="2 14"
    />
    {p > 0.95 && (
      <path
        d={`M${w - 22} 8 L${w - 6} 20 L${w - 22} 32`}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);
const useDraw = (at: number, len = 10) =>
  interpolate(useCurrentFrame(), [at, at + len], [0, 1], {
    ...clamp,
    easing: EASE,
  });

const Lanita: React.FC = () => {
  const frame = useCurrentFrame();
  const lanita = A(0, "lanita");
  const share = A(0, "compartiendo");
  const shared = interpolate(frame, [share + 6, share + 14], [0, 1], clamp);
  const arrow = useDraw(share + 8);
  return (
    <Scene id="lanita">
      <Pop at={lanita - 2} from={0.6}>
        <Card
          style={{
            width: 900,
            ...row,
            justifyContent: "space-around",
            padding: "22px 30px",
            position: "relative",
          }}
        >
          <Pop at={share}>
            <Publicacion size={250} shared={shared} />
          </Pop>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Arrow p={arrow} w={150} />
            <Pop at={A(0, "redes")}>
              <div style={{ ...row, gap: 8 }}>
                {(["redes", "amigos", "grupo"] as const).map((g, i) => (
                  <div
                    key={g}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      background: [GRAD.cool, GRAD.warm, GRAD.deep][i],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Glyph name={g} size={32} />
                  </div>
                ))}
              </div>
            </Pop>
          </div>
          <Pop
            at={lanita}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", width: 170, height: 150 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 20 + i * 30,
                    top: 30 - i * 18 + Math.sin((frame + i * 9) / 7) * 5,
                  }}
                >
                  <Moneda size={100} />
                </div>
              ))}
            </div>
            <span style={{ fontSize: 40, fontWeight: 800, color: Y.ink }}>
              Una lanita
            </span>
          </Pop>
        </Card>
      </Pop>
    </Scene>
  );
};

const LogoBeat: React.FC = () => (
  <Scene id="logo">
    <Pop at={A(1, "yolapp") - 3} from={0.3} rotate={-3}>
      <Img src={staticFile(LOGO)} style={{ width: 700 }} />
    </Pop>
    <Pop at={A(1, "posible")} rotate={4} style={{ marginTop: 16 }}>
      <Chip
        size={40}
        bg={GRAD.warm}
        style={{
          border: "5px solid #fff",
          boxShadow: "0 12px 30px rgba(26,18,64,.35)",
        }}
      >
        ¡Es posible!
      </Chip>
    </Pop>
  </Scene>
);

const CAUSAS = [
  { word: "perritos", label: "Perritos", Ill: Perro },
  { word: "comida", label: "Comida", Ill: Comida },
  { word: "hospitalarias", label: "Hospital", Ill: Hospital },
] as const;
const Causas: React.FC = () => (
  <Scene id="causas">
    <div style={{ position: "relative", display: "flex", gap: 22 }}>
      {CAUSAS.map((c) => (
        <Pop key={c.word} at={A(4, c.word)} from={0.5}>
          <Card
            style={{
              width: 260,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <c.Ill size={170} />
            <span style={{ fontSize: 36, fontWeight: 800 }}>{c.label}</span>
          </Card>
        </Pop>
      ))}
      <Pop
        at={A(5, "muchísimas")}
        rotate={-4}
        style={{ position: "absolute", right: -10, top: -40 }}
      >
        <Chip
          size={32}
          bg={GRAD.main}
          style={{
            border: "5px solid #fff",
            boxShadow: "0 12px 30px rgba(26,18,64,.35)",
          }}
        >
          + muchísimas más
        </Chip>
      </Pop>
    </div>
  </Scene>
);

const Yoler: React.FC = () => {
  const frame = useCurrentFrame();
  const at = A(7, "yoler");
  return (
    <Scene id="yoler">
      <Pop at={clipAt(7) + 2} from={0.6}>
        <Card
          style={{
            width: 860,
            padding: "26px 34px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          <div style={{ ...row, gap: 20 }}>
            <span style={{ fontSize: 46, fontWeight: 800 }}>
              Conviértete en
            </span>
            <Img src={staticFile(LOGO)} style={{ height: 58 }} />
          </div>
          <Pop at={at} from={0.2} rotate={-3}>
            <div
              style={{
                background: GRAD.warm,
                color: "#fff",
                fontSize: 110,
                fontWeight: 800,
                lineHeight: 1,
                padding: "14px 54px 22px",
                borderRadius: 40,
                boxShadow: `0 0 0 ${6 + Math.sin(frame / 4) * 4}px rgba(255,5,102,.25), 0 16px 40px rgba(255,5,102,.4)`,
              }}
            >
              Yoler
            </div>
          </Pop>
        </Card>
      </Pop>
    </Scene>
  );
};

const PASO_TARGETS = [
  { word: "amigos", label: "Amigos", glyph: "amigos", bg: GRAD.cool },
  { word: "redes", label: "Redes", glyph: "redes", bg: GRAD.warm },
  { word: "grupos", label: "Grupos", glyph: "grupo", bg: GRAD.deep },
] as const;
const Paso: React.FC = () => (
  <Scene id="paso">
    <Card
      style={{ width: 920, padding: "34px 30px 24px", position: "relative" }}
    >
      <Pop
        at={clipAt(9)}
        rotate={-3}
        style={{ position: "absolute", left: 24, top: -34 }}
      >
        <Chip size={32} bg={GRAD.main} style={{ border: "5px solid #fff" }}>
          Paso 1
        </Chip>
      </Pop>
      <div style={{ ...row, gap: 22 }}>
        <Pop at={A(9, "comparte")} style={{ ...row, gap: 16, flex: 1 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: GRAD.warm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Heart size={50} color="#fff" />
          </div>
          <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.1 }}>
            Comparte la causa
            <br />
            que más te interesa
          </span>
        </Pop>
      </div>
      <div
        style={{
          ...row,
          gap: 18,
          marginTop: 18,
          justifyContent: "center",
          minHeight: 70,
        }}
      >
        {PASO_TARGETS.map((t) => (
          <Pop key={t.word} at={A(10, t.word)}>
            <div
              style={{
                ...row,
                gap: 10,
                background: "#F4F2FA",
                borderRadius: 999,
                padding: "8px 22px 8px 8px",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: t.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name={t.glyph} size={34} />
              </div>
              <span style={{ fontSize: 30, fontWeight: 800 }}>{t.label}</span>
            </div>
          </Pop>
        ))}
      </div>
    </Card>
  </Scene>
);

// Diagram: you share → donations come in → you earn + they get help.
const Nodo: React.FC<{
  at: number;
  bg: string;
  label: string;
  children: React.ReactNode;
}> = ({ at, bg, label, children }) => (
  <Pop
    at={at}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      width: 170,
    }}
  >
    <div
      style={{
        width: 118,
        height: 118,
        borderRadius: "50%",
        background: bg,
        border: "6px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 28px rgba(26,18,64,.3)",
      }}
    >
      {children}
    </div>
    <span
      style={{
        fontSize: 30,
        fontWeight: 800,
        textAlign: "center",
        lineHeight: 1.05,
      }}
    >
      {label}
    </span>
  </Pop>
);
const Flujo: React.FC = () => {
  const frame = useCurrentFrame();
  const don = A(12, "donativos");
  const ayudas = A(14, "ayudas");
  const a1 = useDraw(don - 6);
  const a2 = useDraw(don + 6);
  const a3 = useDraw(ayudas - 4);
  const pulse = (at: number) =>
    1 +
    0.12 *
      Math.max(
        0,
        Math.sin(Math.PI * interpolate(frame, [at, at + 10], [0, 1], clamp)),
      );
  return (
    <Scene id="flujo">
      <Card
        style={{
          width: 960,
          padding: "22px 20px",
          ...row,
          justifyContent: "center",
          gap: 4,
          position: "relative",
        }}
      >
        <Nodo at={clipAt(11)} bg={GRAD.cool} label="Compartes">
          <Glyph name="redes" size={62} />
        </Nodo>
        <Arrow p={a1} w={80} />
        <Nodo
          at={don}
          bg="linear-gradient(135deg, #FFD54A, #FF9F1C)"
          label="Donativos"
        >
          <Moneda size={86} />
        </Nodo>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Arrow p={a2} w={80} />
          <Arrow p={a3} w={80} color={Y.pink} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Pop
            at={A(11, "ganar")}
            style={{
              ...row,
              gap: 12,
              transform: `scale(${pulse(A(13, "ganar"))})`,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: GRAD.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "5px solid #fff",
              }}
            >
              <Moneda size={56} />
            </div>
            <span style={{ fontSize: 34, fontWeight: 800 }}>Tú ganas</span>
          </Pop>
          <Pop at={ayudas} style={{ ...row, gap: 12 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: GRAD.warm,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "5px solid #fff",
              }}
            >
              <Heart size={44} color="#fff" />
            </div>
            <span style={{ fontSize: 34, fontWeight: 800 }}>Ayudas</span>
          </Pop>
        </div>
        <Badge at={A(15, "apoyo")} text="Reciben su apoyo" bg={Y.pink} />
      </Card>
    </Scene>
  );
};

const APP_CAUSAS = [
  { label: "Perritos", Ill: Perro },
  { label: "Comida", Ill: Comida },
  { label: "Hospital", Ill: Hospital },
];
const App: React.FC = () => {
  const frame = useCurrentFrame();
  const share = A(19, "compartir");
  const heart = A(19, "conecten");
  return (
    <Scene id="app">
      <Card style={{ width: 920, padding: "22px 26px", position: "relative" }}>
        <div
          style={{ ...row, justifyContent: "space-between", marginBottom: 14 }}
        >
          <Pop at={A(18, "yolapp") - 2}>
            <Img src={staticFile(LOGO)} style={{ height: 52 }} />
          </Pop>
          <Chip size={24} bg="#EEEBF6" color={Y.ink}>
            Causas para ti
          </Chip>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {APP_CAUSAS.map((c, i) => {
            const at = share + i * 4;
            const press = interpolate(
              frame,
              [at, at + 3, at + 7],
              [1, 0.85, 1],
              clamp,
            );
            return (
              <div
                key={c.label}
                style={{
                  flex: 1,
                  background: "#F7F5FC",
                  borderRadius: 24,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  position: "relative",
                }}
              >
                <c.Ill size={100} />
                <span style={{ fontSize: 26, fontWeight: 800 }}>{c.label}</span>
                <div
                  style={{
                    transform: `scale(${press})`,
                    background: frame >= at ? GRAD.warm : Y.ink,
                    color: "#fff",
                    borderRadius: 999,
                    padding: "6px 18px",
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  Compartir
                </div>
                <Pop
                  at={heart + i * 3}
                  style={{ position: "absolute", right: 6, top: 6 }}
                >
                  <Heart size={40} />
                </Pop>
              </div>
            );
          })}
        </div>
      </Card>
    </Scene>
  );
};

/* ---------- cutaways: full-screen brand shots over the look-aways ---------- */
const CUT_LOOK: Record<
  (typeof CUTAWAYS)[number]["id"],
  { bg: string; text: string; art: React.ReactNode }
> = {
  ayuda: {
    bg: GRAD.warm,
    text: "Necesitan ayuda",
    art: <Heart size={300} color="#fff" />,
  },
  personas: {
    bg: GRAD.cool,
    text: "Muchas personas",
    art: (
      <div style={{ display: "flex" }}>
        {[GRAD.warm, GRAD.main, GRAD.deep].map((bg, i) => (
          <div
            key={i}
            style={{
              marginLeft: i ? -40 : 0,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: bg,
              border: "10px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Glyph name="amigos" size={110} />
          </div>
        ))}
      </div>
    ),
  },
  comparte: {
    bg: GRAD.main,
    text: "Comparte causas",
    art: <Glyph name="redes" size={300} />,
  },
};
const Cutaways: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = CUTAWAYS.find(
    (c) => frame >= srcFrame(c.from) && frame < srcFrame(c.to),
  );
  if (!cut) return null;
  const start = srcFrame(cut.from);
  const look = CUT_LOOK[cut.id];
  const p = interpolate(frame, [start, start + 5], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <AbsoluteFill
      style={{
        background: look.bg,
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        flexDirection: "column",
        opacity: Math.min(1, p * 2),
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.16) 2px, transparent 2px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        style={{
          transform: `scale(${0.7 + 0.3 * p}) rotate(${(1 - p) * -8}deg)`,
        }}
      >
        {look.art}
      </div>
      <div
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1,
          textAlign: "center",
          textShadow: "0 8px 30px rgba(26,18,64,.35)",
          transform: `translateY(${(1 - p) * 40}px)`,
        }}
      >
        {look.text}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- outro: gradient logo over the video, as is ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const start = SPEECH_END - 4;
  if (frame < start) return null;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        gap: 34,
        paddingTop: 1350,
      }}
    >
      <Pop at={start} from={0.3} rotate={-3}>
        <Img src={staticFile(LOGO)} style={{ width: 640 }} />
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
          Conviértete en Yoler
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

/* ---------- sound ---------- */
const SFX: {
  name: "whoosh" | "pop" | "ding" | "click" | "cash";
  at: number;
  v: number;
}[] = [
  ...SPANS.flatMap((s) => [
    { name: "whoosh" as const, at: s.start - 3, v: 0.35 },
    { name: "whoosh" as const, at: s.end - 8, v: 0.25 },
  ]),
  { name: "cash", at: A(0, "lanita"), v: 0.5 },
  { name: "pop", at: A(0, "compartiendo"), v: 0.35 },
  { name: "pop", at: A(1, "yolapp") - 3, v: 0.5 },
  { name: "ding", at: A(1, "posible"), v: 0.35 },
  { name: "pop", at: A(2, "causas"), v: 0.4 },
  ...CAUSAS.map((c) => ({ name: "pop" as const, at: A(4, c.word), v: 0.35 })),
  { name: "pop", at: A(5, "muchísimas"), v: 0.35 },
  { name: "pop", at: clipAt(6) + 2, v: 0.4 },
  { name: "ding", at: A(7, "yoler"), v: 0.45 },
  { name: "pop", at: A(8, "pasos") + 10, v: 0.4 },
  ...CUTAWAYS.map((c) => ({
    name: "whoosh" as const,
    at: srcFrame(c.from) - 2,
    v: 0.3,
  })),
  ...PASO_TARGETS.map((t) => ({
    name: "pop" as const,
    at: A(10, t.word),
    v: 0.3,
  })),
  { name: "cash", at: A(11, "ganar"), v: 0.45 },
  { name: "pop", at: A(12, "donativos"), v: 0.4 },
  { name: "ding", at: A(14, "ayudas"), v: 0.35 },
  { name: "pop", at: A(15, "apoyo"), v: 0.4 },
  { name: "click", at: A(16, "compartir", 1), v: 0.55 },
  { name: "pop", at: A(17, "diferencia"), v: 0.4 },
  { name: "click", at: A(19, "compartir"), v: 0.5 },
  { name: "ding", at: A(19, "conecten"), v: 0.35 },
  { name: "whoosh", at: SPEECH_END - 8, v: 0.4 },
  { name: "ding", at: SPEECH_END + 8, v: 0.35 },
];

export const Yolapp3Reel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
      <Talking />
      <Lanita />
      <LogoBeat />
      <Causas />
      <Yoler />
      <Paso />
      <Flujo />
      <App />
      <Stickers />
      <Cutaways />
      <Captions />
      <Outro />
      <Audio
        src={staticFile("yolapp/v3/musica.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 10, SPEECH_END - 10, SPEECH_END + 4, TOTAL - 15, TOTAL],
            [0, 0.07, 0.07, 0.28, 0.28, 0],
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

export const YOLAPP3_FRAMES = TOTAL;
