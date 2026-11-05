// Yolapp reel 6 (1080 × 1920, 30 fps): "Modo Yoler" — earn commissions by
// sharing a cause's link. Rules from public/yolapp/marca.md: full-screen video
// at all times (no cutaways, no filter), few soft SFX, the gradient logo as is
// every time she says "Yolapp". Face spans y ≈ 380–1300, so cards live on the
// lower band (y ≈ 1340–1680) and captions move above the head while a card is up.
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
  Check,
  Chip,
  clamp,
  Counter,
  EASE,
  Glyph,
  Heart,
  LinkIcon,
  Pop,
  Sticker,
  Tick,
} from "../yolapp/parts";
import { Moneda, Publicacion } from "../yolapp3/ilustraciones";
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

const SRC = "yolapp/v6/crudo.mp4";
const LOGO = "yolapp/logo/logo-color.png";
const A = wordAt;

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

/* ---------- the talking-head video, always full screen, no filter ---------- */
const zoomFor = (i: number) => (inGraphic(i) ? 1.0 : i % 2 === 0 ? 1.0 : 1.1);
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip =
    CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ??
    CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  const hook =
    clip.i === 0
      ? interpolate(frame, [0, 14], [0.22, 0], { ...clamp, easing: EASE })
      : 0;
  const scale = zoomFor(clip.i) + 0.03 * local + hook;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, transformOrigin: "50% 40%" }}
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
        <Sequence from={SPEECH_END} layout="none">
          <Img
            src={staticFile("yolapp/v6/final.jpg")}
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
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
    end: i + 1 < pages.length ? Math.floor(pages[i + 1][0].start) : SPEECH_END,
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
        top: page.top ? 120 : 1390,
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

/* ---------- stickers above the head ---------- */
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
        size={64}
        rotate={-3}
        top={top}
      />
      <div
        style={{
          position: "absolute",
          top: top + 42,
          left: 170,
          width: 740 * s,
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
    <Between from={clipAt(3)} to={clipAt(4)}>
      <Sticker
        at={clipAt(3) + 2}
        text="¿Cómo funciona?"
        bg={GRAD.main}
        size={72}
        rotate={-3}
        top={170}
      />
    </Between>
    <Between from={clipAt(9)} to={clipAt(10)}>
      <Tachado
        at={clipAt(9) + 2}
        strikeAt={A(9, "gratis")}
        text="Links gratis"
        top={190}
      />
    </Between>
    <Between from={clipAt(10)} to={clipAt(11)}>
      <Sticker
        at={A(10, "modo")}
        text="Modo Yoler: ON"
        bg={GRAD.warm}
        size={76}
        rotate={3}
        top={180}
      />
    </Between>
  </>
);

// Gradient logo, as is, popping in above the head on every "Yolapp".
const LogoPops: React.FC = () => {
  const frame = useCurrentFrame();
  // shown until 40 frames later or the end of that take, whichever is first
  const endOf = (f: number) => {
    const c = CLIPS.find((x) => f >= x.at && f < x.at + x.len)!;
    return Math.min(f + 40, c.at + c.len);
  };
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
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile(LOGO)} style={{ width: 560 }} />
      </Pop>
    </AbsoluteFill>
  );
};

// "Yoler" badge right after "convertirte en Yoler".
const YolerBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const at = A(2, "yoler");
  if (frame < at || frame >= clipAt(3)) return null;
  return (
    <Pop
      at={at}
      from={0.2}
      rotate={4}
      style={{
        position: "absolute",
        top: 150,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: GRAD.warm,
          color: "#fff",
          fontFamily: POPPINS,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1,
          padding: "14px 54px 22px",
          borderRadius: 40,
          border: "6px solid #fff",
          boxShadow: "0 16px 40px rgba(255,5,102,.45)",
        }}
      >
        Yoler
      </div>
    </Pop>
  );
};

/* ---------- cards on the lower band ---------- */
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
        top: 1340,
        height: 340,
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
const circle = (size: number, bg: string): React.CSSProperties => ({
  width: size,
  height: size,
  flexShrink: 0,
  borderRadius: "50%",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Coins slipping away while the link sits unshared, then the link gets shared.
const LinkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const comisiones = A(0, "comisiones");
  const link = A(1, "link");
  return (
    <Scene id="link">
      <Card
        style={{
          width: 920,
          ...row,
          gap: 24,
          padding: "24px 30px",
          position: "relative",
        }}
      >
        <Pop at={clipAt(0) + 4}>
          <Publicacion
            size={230}
            shared={interpolate(frame, [link, link + 8], [0, 1], clamp)}
          />
        </Pop>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}
        >
          <Pop at={clipAt(0) + 8}>
            <div
              style={{
                ...row,
                gap: 12,
                background: "#F4F2FA",
                borderRadius: 999,
                padding: "10px 24px",
              }}
            >
              <LinkIcon size={38} color={Y.purple} />
              <span style={{ fontSize: 32, fontWeight: 800 }}>tu link</span>
            </div>
          </Pop>
          <div style={{ position: "relative", height: 110 }}>
            {[0, 1, 2].map((i) => {
              // coins sit there from the start and slip away on "comisiones"
              if (frame < clipAt(0) + 10 + i * 3) return null;
              const t = frame - comisiones - i * 6;
              const fall = interpolate(t, [0, 30], [0, 1], clamp);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 30 + i * 110,
                    top: fall * 60,
                    opacity: 1 - fall * 0.7,
                    transform: `rotate(${fall * (i % 2 ? 40 : -40)}deg)`,
                  }}
                >
                  <Moneda size={90} />
                </div>
              );
            })}
          </div>
        </div>
        <Pop
          at={comisiones + 4}
          rotate={-4}
          style={{ position: "absolute", right: -20, top: -36 }}
        >
          <Chip size={30} bg={Y.coral} style={{ border: "5px solid #fff" }}>
            Comisiones perdidas
          </Chip>
        </Pop>
      </Card>
    </Scene>
  );
};

// Diagram: find a cause → share its link → someone donates → you earn.
const Paso: React.FC<{
  at: number;
  n: number;
  label: string;
  bg: string;
  children: React.ReactNode;
}> = ({ at, n, label, bg, children }) => (
  <Pop
    at={at}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      width: 190,
    }}
  >
    <div style={{ position: "relative" }}>
      <div
        style={{
          ...circle(112, bg),
          border: "6px solid #fff",
          boxShadow: "0 12px 28px rgba(26,18,64,.3)",
        }}
      >
        {children}
      </div>
      <div
        style={{
          ...circle(40, Y.ink),
          position: "absolute",
          left: -6,
          top: -6,
          color: "#fff",
          fontWeight: 800,
          fontSize: 22,
          border: "3px solid #fff",
        }}
      >
        {n}
      </div>
    </div>
    <span
      style={{
        fontSize: 26,
        fontWeight: 800,
        textAlign: "center",
        lineHeight: 1.05,
      }}
    >
      {label}
    </span>
  </Pop>
);
const Arrow: React.FC<{ at: number }> = ({ at }) => {
  const p = interpolate(useCurrentFrame(), [at, at + 8], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <svg
      width={44}
      height={30}
      viewBox="0 0 44 30"
      style={{ flexShrink: 0, marginTop: -40, opacity: p }}
    >
      <path
        d="M4 15 H34 M26 6 L36 15 L26 24"
        fill="none"
        stroke={Y.purple}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
const Pasos: React.FC = () => {
  const s1 = clipAt(4);
  const s2 = clipAt(5);
  const s3 = A(6, "donativo");
  const s4 = A(7, "comisión");
  return (
    <Scene id="pasos">
      <Card
        style={{
          width: 960,
          padding: "26px 14px 22px",
          ...row,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Paso at={s1} n={1} label="Encuentras una causa" bg={GRAD.cool}>
          <Heart size={56} color="#fff" />
        </Paso>
        <Arrow at={s2 - 4} />
        <Paso at={s2} n={2} label="Compartes su link" bg={GRAD.main}>
          <LinkIcon size={56} />
        </Paso>
        <Arrow at={s3 - 4} />
        <Paso at={s3} n={3} label="Alguien dona" bg={GRAD.warm}>
          <Glyph name="amigos" size={60} />
        </Paso>
        <Arrow at={s4 - 4} />
        <Paso
          at={s4}
          n={4}
          label="Recibes comisión"
          bg="linear-gradient(135deg, #FFD54A, #FF9F1C)"
        >
          <Moneda size={74} />
        </Paso>
      </Card>
    </Scene>
  );
};

// "Ojo": the cause needs monetization switched on.
const Monetizar: React.FC = () => {
  const frame = useCurrentFrame();
  const at = A(8, "monetizar");
  const on = interpolate(frame, [at, at + 8], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <Scene id="monetizar">
      <Card style={{ width: 880, padding: "26px 34px", position: "relative" }}>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <div style={{ ...row, gap: 14 }}>
            <Img src={staticFile(LOGO)} style={{ height: 44 }} />
            <span style={{ fontSize: 34, fontWeight: 800 }}>
              Ajustes de la causa
            </span>
          </div>
        </div>
        <div
          style={{
            ...row,
            justifyContent: "space-between",
            marginTop: 22,
            background: "#F4F2FA",
            borderRadius: 26,
            padding: "18px 24px",
          }}
        >
          <div style={{ ...row, gap: 14 }}>
            <Moneda size={60} />
            <span style={{ fontSize: 40, fontWeight: 800 }}>Monetizar</span>
          </div>
          <div
            style={{
              width: 130,
              height: 70,
              borderRadius: 35,
              background: on > 0.5 ? Y.ok : "#D9D6E8",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 7,
                left: 7 + on * 60,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 4px 10px rgba(26,18,64,.25)",
              }}
            />
          </div>
        </div>
        <Pop
          at={clipAt(8) + 2}
          rotate={-5}
          style={{ position: "absolute", left: -18, top: -40 }}
        >
          <Chip
            size={34}
            bg="linear-gradient(135deg, #FFB800, #FF4A3A)"
            style={{ border: "5px solid #fff" }}
          >
            ¡Ojo!
          </Chip>
        </Pop>
        <Pop
          at={at + 8}
          rotate={4}
          style={{ position: "absolute", right: -18, bottom: -36 }}
        >
          <Chip size={30} bg={Y.ok} style={{ border: "5px solid #fff" }}>
            <Tick size={32} />
            Activada
          </Chip>
        </Pop>
      </Card>
    </Scene>
  );
};

// Download → sign up → Yoler mode → share.
const App: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, number][] = [
    ["Descarga Yolapp", A(11, "descarga")],
    ["Regístrate", A(12, "regístrate")],
    ["Activa tu modo Yoler", A(12, "activa")],
    ["Comparte la causa", A(12, "compartir")],
  ];
  return (
    <Scene id="app">
      <Card style={{ width: 900, padding: "22px 30px", position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 20px",
          }}
        >
          {items.map(([label, at], i) => (
            <div
              key={label}
              style={{ ...row, gap: 12, opacity: frame >= at ? 1 : 0.35 }}
            >
              <div
                style={{
                  ...circle(
                    54,
                    [GRAD.cool, GRAD.main, GRAD.warm, GRAD.deep][i],
                  ),
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 28,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  flex: 1,
                  lineHeight: 1.1,
                }}
              >
                {label}
              </span>
              <Check at={at + 4} size={42} />
            </div>
          ))}
        </div>
        <Pop
          at={A(12, "compartir") + 6}
          style={{ ...row, gap: 12, marginTop: 16, justifyContent: "center" }}
        >
          <span style={{ fontSize: 28, fontWeight: 700, color: Y.muted }}>
            Comisiones:
          </span>
          <Counter
            from={0}
            to={850}
            start={A(12, "compartir") + 6}
            end={SPEECH_END}
            style={{ fontSize: 40, fontWeight: 800, color: Y.ok }}
          />
          <span style={{ fontSize: 40, fontWeight: 800, color: Y.ok }}>
            MXN
          </span>
        </Pop>
      </Card>
    </Scene>
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
        paddingTop: 1360,
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
  ...YOLAPP_AT.map((at) => ({ name: "pop" as const, at: at - 2, v: 0.15 })),
  { name: "cash", at: A(7, "comisión"), v: 0.18 },
  { name: "ding", at: A(8, "monetizar") + 8, v: 0.12 },
  { name: "ding", at: A(10, "modo"), v: 0.12 },
  { name: "ding", at: SPEECH_END, v: 0.12 },
];

export const Yolapp6Reel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
      <Talking />
      <LinkScene />
      <Pasos />
      <Monetizar />
      <App />
      <Stickers />
      <YolerBadge />
      <LogoPops />
      <Captions />
      <Outro />
      <Audio
        src={staticFile("yolapp/v6/musica.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 10, SPEECH_END - 10, SPEECH_END + 4, TOTAL - 15, TOTAL],
            [0, 0.05, 0.05, 0.2, 0.2, 0],
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

export const YOLAPP6_FRAMES = TOTAL;
