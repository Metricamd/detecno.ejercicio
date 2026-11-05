// Yolapp reel 6 (1080 × 1920, 30 fps): "Modo Yoler" — earn commissions by
// sharing a cause's link. Rules from public/yolapp/marca.md: full-screen video
// at all times (no cutaways, no filter), few soft SFX, the gradient logo as is
// every time she says "Yolapp".
//
// Face-safe layout: the face spans x ≈ 280–800, y ≈ 380–1320. Graphics only
// live on the chest band (y ≥ 1400), the side columns (x ≤ 230 or x ≥ 850)
// and above the head (y ≤ 330, captions/stickers/logo).
//
// Audio: the video is muted; the voice plays from public/yolapp/v6/voz.wav,
// the raw track cleaned with the chain in voz-cadena.txt (high-pass, FFT
// denoise, EQ, de-esser, compressor, soft gate, limiter).
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Freeze,
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
import { Moneda, Publicacion } from "../yolapp3/ilustraciones";
import { Burst, circle, glass, Phone } from "../yolapp/fx";
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
const VOZ = "yolapp/v6/voz.wav";
const LOGO = "yolapp/logo/logo-color.png";
const A = wordAt;

const inGraphic = (i: number) => GRAPHICS.some((g) => i >= g.from && i <= g.to);

// Continuous pieces of footage/audio: a take with a `skip` plays as two pieces.
const PARTS = CLIPS.flatMap((c) => {
  if (!c.skip) return [{ at: c.at, len: c.len, from: c.from, hold: c.hold }];
  const first = Math.round((c.skip[0] - c.from) * 30);
  return [
    { at: c.at, len: first, from: c.from, hold: undefined },
    { at: c.at + first, len: c.len - first, from: c.skip[1], hold: c.hold },
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
  const video = (from: number) => (
    <OffthreadVideo
      src={staticFile(SRC)}
      trimBefore={Math.round(from * 30)}
      muted
      style={{ width: W, height: 1920, objectFit: "cover" }}
    />
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, transformOrigin: "50% 40%" }}
      >
        {PARTS.map((p, k) => {
          const holdAt =
            p.hold === undefined ? p.len : Math.round((p.hold - p.from) * 30);
          return (
            <Sequence
              key={k}
              from={p.at}
              durationInFrames={p.len}
              layout="none"
            >
              {holdAt >= p.len ? (
                video(p.from)
              ) : (
                <Freeze frame={holdAt} active={(f) => f >= holdAt}>
                  {video(p.from)}
                </Freeze>
              )}
            </Sequence>
          );
        })}
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
  const size = page.top ? 60 : 68;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: page.top ? 110 : 1420,
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

/* ---------- above the head: stickers, logo pops, Yoler badge ---------- */
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
        top={150}
      />
    </Between>
    <Between from={clipAt(9)} to={clipAt(10)}>
      <Tachado
        at={clipAt(9) + 2}
        strikeAt={A(9, "gratis")}
        text="Links gratis"
        top={170}
      />
    </Between>
    <Between from={clipAt(10)} to={clipAt(11)}>
      <Sticker
        at={A(10, "modo")}
        text="Modo Yoler: ON"
        bg={GRAD.warm}
        size={76}
        rotate={3}
        top={160}
      />
    </Between>
  </>
);

// Gradient logo, as is, above the head on every "Yolapp" (until the take ends).
const LogoPops: React.FC = () => {
  const frame = useCurrentFrame();
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
          top: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile(LOGO)} style={{ width: 520 }} />
      </Pop>
    </AbsoluteFill>
  );
};

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
        top: 140,
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

/* ---------- shared bits for the graphics ---------- */
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

/* ---------- 1. the link you don't share: coins leak out of the phone ---------- */
const LinkScene: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("link");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const comisiones = A(0, "comisiones");
  const link = A(1, "link");
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const lost = interpolate(
    frame,
    [comisiones, comisiones + 50],
    [0, 1240],
    clamp,
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {/* phone floating bottom-left */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 1330,
          transform: `translateX(${(1 - enter) * -420}px) rotate(${-6 + (1 - enter) * -20}deg)`,
        }}
      >
        <Phone w={240} tiltY={18}>
          <div
            style={{ padding: 12, display: "flex", justifyContent: "center" }}
          >
            <Publicacion
              size={250}
              shared={interpolate(frame, [link, link + 8], [0, 1], clamp)}
            />
          </div>
        </Phone>
      </div>
      {/* coins leaking out of the phone and off the right edge */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = frame - comisiones - i * 5;
        if (t < 0 || t > 45) return null;
        const p = t / 45;
        const x = 300 + p * 640 + Math.sin(t / 5 + i) * 18;
        const y = 1600 - Math.sin(p * Math.PI) * 140 + p * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: interpolate(p, [0, 0.15, 0.75, 1], [0, 1, 1, 0]),
              transform: `rotate(${t * 14}deg) scale(${0.7 + (i % 3) * 0.12})`,
            }}
          >
            <Moneda size={86} />
          </div>
        );
      })}
      {/* loss ticker bottom-right */}
      <Pop
        at={comisiones + 2}
        rotate={-3}
        style={{ position: "absolute", right: 40, top: 1700 }}
      >
        <div
          style={{
            ...glass,
            borderRadius: 30,
            padding: "14px 26px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, opacity: 0.8 }}>
            Comisiones perdidas
          </span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#FF6B7A",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            -${Math.round(lost).toLocaleString("es-MX")}
          </span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

/* ---------- 2. the journey: a glowing path with a comet through 4 orbs ---------- */
const PATH = "M 60 1660 C 220 1500, 320 1790, 540 1640 S 860 1500, 1020 1620";
const NODES = [
  {
    x: 125,
    y: 1610,
    label: "Encuentras una causa",
    bg: GRAD.cool,
    icon: <Heart size={46} color="#fff" />,
  },
  {
    x: 405,
    y: 1690,
    label: "Compartes su link",
    bg: GRAD.main,
    icon: <LinkIcon size={46} />,
  },
  {
    x: 690,
    y: 1560,
    label: "Alguien dona",
    bg: GRAD.warm,
    icon: <Glyph name="amigos" size={50} />,
  },
  {
    x: 960,
    y: 1620,
    label: "Tu comisión",
    bg: "linear-gradient(135deg, #FFD54A, #FF9F1C)",
    icon: <Moneda size={64} />,
  },
];
const Journey: React.FC = () => {
  const { frame, visible, exit } = useSpan("pasos");
  if (!visible) return null;
  const at = [clipAt(4), clipAt(5), A(6, "donativo"), A(7, "comisión")];
  // the comet reaches node k at at[k]
  const prog = interpolate(frame, at, [0.06, 0.38, 0.66, 0.95], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const draw = interpolate(frame, [at[0], at[3]], [0.06, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="jg" x1="0" x2="1">
            <stop offset="0" stopColor={Y.teal} />
            <stop offset=".5" stopColor={Y.purple} />
            <stop offset="1" stopColor={Y.pink} />
          </linearGradient>
          <filter id="jglow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path
          d={PATH}
          fill="none"
          stroke="rgba(255,255,255,.3)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray="2 22"
        />
        <path
          d={PATH}
          fill="none"
          stroke="url(#jg)"
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          filter="url(#jglow)"
        />
        <path
          d={PATH}
          fill="none"
          stroke="url(#jg)"
          strokeWidth={8}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        {/* comet: a short bright dash riding the path */}
        <path
          d={PATH}
          fill="none"
          stroke="#fff"
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.03 1"
          strokeDashoffset={-prog + 0.015}
          filter="url(#jglow)"
        />
        <path
          d={PATH}
          fill="none"
          stroke="#fff"
          strokeWidth={8}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.02 1"
          strokeDashoffset={-prog + 0.01}
        />
      </svg>
      {NODES.map((n, k) => (
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
          <div style={{ position: "relative" }}>
            <div
              style={{
                ...circle(124, n.bg),
                border: "6px solid #fff",
                boxShadow: `0 0 0 ${8 + Math.sin((frame - at[k]) / 5) * 4}px rgba(255,255,255,.2), 0 16px 34px rgba(10,6,30,.5)`,
              }}
            >
              {n.icon}
            </div>
            <div
              style={{
                ...circle(42, Y.ink),
                position: "absolute",
                left: -6,
                top: -6,
                color: "#fff",
                fontWeight: 800,
                fontSize: 22,
                border: "3px solid #fff",
              }}
            >
              {k + 1}
            </div>
            {k === 3 && <Burst at={at[3]} size={300} />}
          </div>
          <div
            style={{
              ...glass,
              marginTop: 8,
              borderRadius: 16,
              padding: "6px 12px",
              fontSize: 22,
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.05,
            }}
          >
            {n.label}
          </div>
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

/* ---------- 3. "Ojo": a big 3D monetize switch ---------- */
const Monetize: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("monetizar");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const at = A(8, "monetizar");
  const knob = spring({
    frame: frame - at,
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
          top: 1450,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: `translateY(${(1 - enter) * 500}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 2 }}>
          {"MONETIZAR".split("").map((l, i) => {
            const p = interpolate(frame - (start + 6 + i * 2), [0, 8], [0, 1], {
              ...clamp,
              easing: EASE,
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: POPPINS,
                  fontWeight: 800,
                  fontSize: 66,
                  color: "#fff",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px) rotate(${(1 - p) * 20}deg)`,
                  display: "inline-block",
                  textShadow: on
                    ? "0 0 24px rgba(20,195,142,.9), 0 4px 0 rgba(10,6,30,.6)"
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
                ? "linear-gradient(135deg, #14C38E, #03C7C1)"
                : "linear-gradient(135deg, #4A4466, #2B2547)",
              boxShadow: on
                ? "0 0 60px rgba(20,195,142,.7), inset 0 6px 14px rgba(0,0,0,.25)"
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
              <Moneda size={88} />
            </div>
            <Burst at={at + 4} color="#5FF5EC" size={420} />
          </div>
        </div>
      </div>
      <Pop
        at={start + 2}
        rotate={-8}
        style={{ position: "absolute", left: 40, top: 1470 }}
      >
        <Chip
          size={36}
          bg="linear-gradient(135deg, #FFB800, #FF4A3A)"
          style={{ border: "5px solid #fff" }}
        >
          ¡Ojo!
        </Chip>
      </Pop>
      <Pop
        at={at + 10}
        rotate={6}
        style={{ position: "absolute", right: 40, top: 1470 }}
      >
        <Chip size={30} bg={Y.ok} style={{ border: "5px solid #fff" }}>
          <Tick size={30} />
          Activada
        </Chip>
      </Pop>
    </AbsoluteFill>
  );
};

/* ---------- 4. the app: phone with progress + commission notifications ---------- */
const STEPS: [string, string, number][] = [
  ["Descarga", "descarga", 11],
  ["Regístrate", "regístrate", 12],
  ["Modo Yoler", "activa", 12],
  ["Comparte", "compartir", 12],
];
const TOASTS = [
  { amount: 45, cause: "Perritos" },
  { amount: 120, cause: "Tratamiento" },
  { amount: 80, cause: "Comida" },
];
const AppScene: React.FC = () => {
  const { frame, start, visible, exit } = useSpan("app");
  const { fps } = useVideoConfig();
  if (!visible) return null;
  const stepAt = STEPS.map(([, w, take]) => A(take, w));
  const done = stepAt.filter((f) => frame >= f).length;
  const enter = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const share = A(12, "compartir");
  const toastAt = TOASTS.map((_, i) => share + 2 + i * 12);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      {/* phone bottom-right */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 1330,
          transform: `translateX(${(1 - enter) * 420}px) rotate(${6 + (1 - enter) * 20}deg)`,
        }}
      >
        <Phone w={240} tiltY={-18} glow="rgba(255,5,102,.45)">
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
              style={{ width: 150, alignSelf: "center" }}
            />
            {STEPS.map(([label], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: i < done ? 1 : 0.35,
                }}
              >
                <div style={{ ...circle(30, i < done ? Y.ok : "#D9D6E8") }}>
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
      {/* commission notifications sliding in bottom-left, newest on top */}
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
              left: 40,
              top: 1440 + newer * 124,
              transform: `translateX(${(1 - p) * -600}px)`,
              opacity: Math.min(1, p * 1.5) * (1 - newer * 0.2),
            }}
          >
            <div
              style={{
                ...glass,
                borderRadius: 26,
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: 500,
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
  { name: "cash", at: A(7, "comisión"), v: 0.15 },
  { name: "ding", at: A(8, "monetizar") + 4, v: 0.1 },
  { name: "ding", at: A(12, "compartir") + 2, v: 0.1 },
  { name: "ding", at: SPEECH_END, v: 0.1 },
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
      <Journey />
      <Monetize />
      <AppScene />
      <Stickers />
      <YolerBadge />
      <LogoPops />
      <Captions />
      <Outro />
      <Voice />
      <Audio
        src={staticFile("yolapp/v6/musica.wav")}
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

export const YOLAPP6_FRAMES = TOTAL;
