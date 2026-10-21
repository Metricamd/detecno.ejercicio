// Yolapp reel 2 (1080 × 1920, 30 fps): "3 recomendaciones para recaudar más".
// Same look and rules as reel 1 (public/yolapp/marca.md): full-screen video,
// punch-in zooms on the cuts, word-by-word captions, stickers above the head
// and brand cards on the lower third; nothing over the face (y ≈ 320–1100).
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
  EyeIcon,
  Glyph,
  Heart,
  ImageIcon,
  LinkIcon,
  PlayIcon,
  Pop,
  Sticker,
  Tick,
} from "../yolapp/parts";
import {
  CLIPS,
  clipAt,
  GRAD,
  GRAPHICS,
  GraphicId,
  graphicSpan,
  isKeyword,
  SPEECH_END,
  TAIL_END,
  TOTAL,
  W,
  Word,
  wordAt,
  WORDS,
  Y,
} from "./datos";

const SRC = "yolapp/v2/crudo.mp4";
const LOGO = "yolapp/logo/logo-color.png";
const A = wordAt;

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
const zoomFor = (i: number) => (inGraphic(i) ? 1.0 : i % 2 === 0 ? 1.0 : 1.14);
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip =
    CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ??
    CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  // hook: start tight and pull out; every cut drifts in slowly
  const hook =
    clip.i === 0
      ? interpolate(frame, [0, 14], [0.28, 0], { ...clamp, easing: EASE })
      : 0;
  const scale = zoomFor(clip.i) + 0.03 * local + hook;
  const tail = Math.round((TAIL_END - CLIPS[CLIPS.length - 1].to) * 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{ transform: `scale(${scale})`, transformOrigin: "50% 34%" }}
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
            src={staticFile("yolapp/v2/final.jpg")}
            style={{ width: W, height: 1920, objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
      {/* soft top and bottom shade so captions and cards read */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(26,18,64,.45) 0%, rgba(26,18,64,0) 20%, rgba(26,18,64,0) 58%, rgba(26,18,64,.55) 100%)",
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
    // with a card on the lower third the captions go above the head
    top: inGraphic(ws[0].clip),
  }));
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const page = PAGES.find((pg) => frame >= pg.start && frame < pg.end);
  if (!page) return null;
  const out = interpolate(frame, [page.end - 3, page.end], [1, 0], clamp);
  const size = page.top ? 64 : 76;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: page.top ? 130 : 1250,
        height: page.top ? 220 : 260,
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

const Stickers: React.FC = () => (
  <>
    <Between from={clipAt(7)} to={clipAt(8)}>
      <Sticker
        at={A(7, "subiste")}
        text="¿Ya subiste tu causa?"
        bg={GRAD.main}
        size={62}
        rotate={-3}
        top={170}
      />
    </Between>
    <Between from={clipAt(8)} to={clipAt(10)}>
      <Sticker
        at={A(8, "3")}
        text="3 tips"
        bg={GRAD.warm}
        size={96}
        rotate={-5}
        top={130}
      />
      <Sticker
        at={A(9, "donativos")}
        text="+ donativos"
        bg={GRAD.cool}
        size={64}
        rotate={3}
        top={280}
      />
    </Between>
    <Between from={clipAt(21)} to={clipAt(22)}>
      <Sticker
        at={A(21, "bonita")}
        text="La causa más bonita"
        bg={GRAD.main}
        size={58}
        rotate={-3}
        top={140}
      />
      <Sticker
        at={A(21, "nadie")}
        text="…si nadie la ve"
        bg={`linear-gradient(135deg, #FFB800, ${Y.coral})`}
        size={62}
        rotate={3}
        top={270}
      />
    </Between>
    <Between from={clipAt(26)} to={SPEECH_END}>
      <Sticker
        at={A(26, "lejos")}
        text="¡Más lejos!"
        bg={GRAD.warm}
        rotate={-4}
      />
    </Between>
  </>
);

/* ---------- brand cards on the lower third ---------- */
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
        left: 60,
        right: 60,
        top: 1190,
        height: 470,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${(enter + exit) * 700}px) rotate(${(enter - exit) * 4}deg)`,
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
    style={{ position: "absolute", right: -24, bottom: -40, ...style }}
  >
    <Chip
      size={34}
      bg={bg}
      style={{
        border: "6px solid #fff",
        boxShadow: "0 14px 40px rgba(26,18,64,.35)",
      }}
    >
      <Tick size={36} />
      {text}
    </Chip>
  </Pop>
);
const Head: React.FC<{ at: number; text: string; bg?: string }> = ({
  at,
  text,
  bg = GRAD.warm,
}) => (
  <Pop at={at} rotate={-3} style={{ marginBottom: 18 }}>
    <Chip
      size={38}
      bg={bg}
      style={{
        border: "6px solid #fff",
        boxShadow: "0 12px 30px rgba(26,18,64,.35)",
      }}
    >
      {text}
    </Chip>
  </Pop>
);

const AVATARS = [
  GRAD.warm,
  GRAD.cool,
  GRAD.main,
  GRAD.deep,
  GRAD.warm,
  GRAD.cool,
];
const Comunidad: React.FC = () => {
  const first = A(0, "comunidad");
  const last = A(1, "ayudar");
  return (
    <Scene id="comunidad">
      <Pop at={A(0, "apoyo")} from={0.6}>
        <Card style={{ width: 920, padding: 30, position: "relative" }}>
          <Pop at={A(0, "apoyo") + 3} style={{ ...row, gap: 20 }}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: GRAD.warm,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Heart size={52} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 46, fontWeight: 800 }}>
                Gastos médicos
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: Y.muted }}>
                apoyo de una comunidad
              </div>
            </div>
          </Pop>
          <div style={{ ...row, gap: 0, marginTop: 24, minHeight: 100 }}>
            {AVATARS.map((bg, i) => (
              <Pop
                key={i}
                at={first + i * ((last - first) / AVATARS.length)}
                style={{ marginLeft: i ? -18 : 0 }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: bg,
                    border: "6px solid #fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(26,18,64,.25)",
                  }}
                >
                  <Glyph name="amigos" size={52} />
                </div>
              </Pop>
            ))}
            <Pop at={last - 4} style={{ marginLeft: 18 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: Y.purple }}>
                + personas
              </span>
            </Pop>
          </div>
          <Badge at={last} text="Quieren ayudar" />
        </Card>
      </Pop>
    </Scene>
  );
};

const LogoBeat: React.FC = () => (
  <Scene id="logo">
    <Pop at={A(2, "yolapp") - 3} from={0.3} rotate={-3}>
      <Img src={staticFile(LOGO)} style={{ width: 840 }} />
    </Pop>
  </Scene>
);

const Red: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, number][] = [
    ["Cuenta tu historia", A(4, "historia")],
    ["Recauda fondos", A(5, "recaudar")],
    ["Conecta con personas", A(6, "conectar")],
  ];
  return (
    <Scene id="red">
      <Card style={{ width: 920, padding: 30 }}>
        <div
          style={{ ...row, justifyContent: "space-between", marginBottom: 20 }}
        >
          <Img src={staticFile(LOGO)} style={{ height: 52 }} />
          <Pop at={A(3, "red")}>
            <Chip size={28} bg={GRAD.main}>
              Red social de causas
            </Chip>
          </Pop>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map(([label, at]) => (
            <div
              key={label}
              style={{ ...row, opacity: frame >= at ? 1 : 0.35 }}
            >
              <Check at={at} size={54} />
              <span style={{ fontSize: 42, fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </Scene>
  );
};

const Tip1: React.FC = () => {
  const frame = useCurrentFrame();
  const foto = A(11, "foto");
  const strike = interpolate(frame, [foto + 4, foto + 12], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <Scene id="tip1">
      <Head at={clipAt(10)} text="Tip 1" />
      <Card
        style={{
          width: 900,
          ...row,
          gap: 24,
          padding: 26,
          position: "relative",
        }}
      >
        <Pop
          at={foto - 4}
          style={{
            position: "relative",
            width: 250,
            height: 230,
            flexShrink: 0,
            borderRadius: 24,
            background: "#EEEBF6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <ImageIcon size={90} />
          <span style={{ fontSize: 28, fontWeight: 800, color: Y.muted }}>
            Solo 1 foto
          </span>
          <svg
            width={250}
            height={230}
            style={{ position: "absolute", inset: 0 }}
          >
            <line
              x1={30}
              y1={30}
              x2={30 + 190 * strike}
              y2={30 + 170 * strike}
              stroke={Y.pink}
              strokeWidth={14}
              strokeLinecap="round"
            />
            <line
              x1={220}
              y1={30}
              x2={220 - 190 * strike}
              y2={30 + 170 * strike}
              stroke={Y.pink}
              strokeWidth={14}
              strokeLinecap="round"
            />
          </svg>
        </Pop>
        <Pop
          at={A(12, "video") - 2}
          style={{
            flex: 1,
            height: 230,
            borderRadius: 24,
            background: GRAD.deep,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <PlayIcon size={100} />
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 1.1,
            }}
          >
            Video de
            <br />
            tu historia
          </span>
        </Pop>
        <Badge at={A(13, "conecten")} text="Que conecten contigo" bg={Y.pink} />
      </Card>
    </Scene>
  );
};

const Tip2: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, number][] = [
    ["Tus medicamentos", A(15, "medicamentos")],
    ["Tu tratamiento", A(15, "tratamiento")],
    ["Tu situación", A(16, "situación")],
  ];
  return (
    <Scene id="tip2">
      <Head at={clipAt(14)} text="Tip 2 · Evidencia" bg={GRAD.cool} />
      <Card style={{ width: 880, padding: 30, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map(([label, at]) => (
            <div
              key={label}
              style={{ ...row, opacity: frame >= at ? 1 : 0.35 }}
            >
              <Check at={at} size={54} />
              <span style={{ fontSize: 42, fontWeight: 700 }}>{label}</span>
            </div>
          ))}
        </div>
        <Badge at={A(16, "confianza")} text="Genera confianza" />
      </Card>
    </Scene>
  );
};

const SHARE = [
  { word: "amigos", label: "Amigos", glyph: "amigos", bg: GRAD.cool },
  { word: "familiares", label: "Familia", glyph: "casa", bg: GRAD.warm },
  { word: "conocidos", label: "Conocidos", glyph: "mundo", bg: GRAD.main },
  { word: "grupos", label: "Grupos", glyph: "grupo", bg: GRAD.deep },
  { word: "redes", label: "Redes", glyph: "redes", bg: GRAD.warm },
] as const;
const Tip3: React.FC = () => {
  const frame = useCurrentFrame();
  const { end } = graphicSpan("tip3");
  const first = A(20, "amigos");
  return (
    <Scene id="tip3">
      <Head
        at={A(18, "importante")}
        text="Tip 3 · El más importante"
        bg="linear-gradient(135deg, #FFB800, #FF4A3A)"
      />
      <div style={{ ...row, gap: 18, marginBottom: 28 }}>
        <Pop at={A(19, "link")}>
          <div
            style={{
              ...row,
              gap: 12,
              background: "#fff",
              borderRadius: 999,
              padding: "16px 30px",
              boxShadow: `0 0 0 ${8 + Math.sin(frame / 4) * 5}px rgba(255,255,255,.35), 0 14px 40px rgba(26,18,64,.35)`,
            }}
          >
            <LinkIcon size={46} color={Y.pink} />
            <span style={{ fontSize: 36, fontWeight: 800, color: Y.ink }}>
              yolapp.com/tu-causa
            </span>
          </div>
        </Pop>
        <Pop at={first - 4}>
          <div
            style={{
              ...row,
              gap: 10,
              background: Y.ink,
              borderRadius: 999,
              padding: "16px 28px",
            }}
          >
            <EyeIcon size={44} color="#5FF5EC" />
            <Counter
              from={0}
              to={1250}
              start={first}
              end={end - 4}
              style={{ fontSize: 38, fontWeight: 800, color: "#fff" }}
            />
          </div>
        </Pop>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {SHARE.map((b) => (
          <Pop
            key={b.word}
            at={A(20, b.word)}
            style={{
              width: 180,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                background: b.bg,
                border: "6px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 34px rgba(26,18,64,.35)",
              }}
            >
              <Glyph name={b.glyph} size={64} />
            </div>
            <Chip size={22} bg="#fff" color={Y.ink}>
              {b.label}
            </Chip>
          </Pop>
        ))}
      </div>
    </Scene>
  );
};

const Pasos: React.FC = () => {
  const frame = useCurrentFrame();
  const { end } = graphicSpan("pasos");
  const move = A(23, "moverla");
  const fill = interpolate(frame, [move, end - 4], [0, 100], {
    ...clamp,
    easing: EASE,
  });
  const step: React.CSSProperties = {
    width: 86,
    height: 86,
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: 46,
  };
  return (
    <Scene id="pasos">
      <Pop at={A(22, "crear")}>
        <Card style={{ width: 860, ...row, gap: 24, padding: "24px 30px" }}>
          <div style={{ ...step, background: GRAD.main }}>1</div>
          <div style={{ fontSize: 46, fontWeight: 800, flex: 1 }}>
            Crear tu causa
          </div>
          <Check at={A(22, "primer")} size={56} />
        </Card>
      </Pop>
      <Pop at={A(22, "primer")} style={{ margin: "14px 0" }}>
        <Chip size={30} bg={Y.pink}>
          Primer paso
        </Chip>
      </Pop>
      <Pop at={move}>
        <Card
          style={{
            width: 860,
            ...row,
            gap: 24,
            padding: "24px 30px",
            position: "relative",
          }}
        >
          <div style={{ ...step, background: GRAD.warm }}>2</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 46, fontWeight: 800 }}>Moverla</div>
            <div
              style={{
                height: 22,
                borderRadius: 11,
                background: "#EEEBF6",
                marginTop: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${fill}%`,
                  background: GRAD.warm,
                  borderRadius: 11,
                }}
              />
            </div>
          </div>
          <Badge
            at={A(23, "diferencia")}
            text="La diferencia"
            bg={Y.purple}
            style={{ bottom: -50 }}
          />
        </Card>
      </Pop>
    </Scene>
  );
};

const App: React.FC = () => {
  const frame = useCurrentFrame();
  const copia = A(25, "copia");
  const press = interpolate(
    frame,
    [copia, copia + 3, copia + 7],
    [1, 0.88, 1],
    clamp,
  );
  return (
    <Scene id="app">
      <Card style={{ width: 900, padding: 30, position: "relative" }}>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <Pop at={A(24, "yolapp") - 2}>
            <Img src={staticFile(LOGO)} style={{ height: 60 }} />
          </Pop>
          <Chip size={24} bg="#EEEBF6" color={Y.ink}>
            Mi causa
          </Chip>
        </div>
        <div
          style={{
            ...row,
            marginTop: 24,
            background: "#F4F2FA",
            borderRadius: 999,
            padding: "12px 12px 12px 28px",
          }}
        >
          <LinkIcon size={40} color={Y.purple} />
          <span style={{ fontSize: 34, fontWeight: 700, flex: 1 }}>
            yolapp.com/tu-causa
          </span>
          <div
            style={{
              transform: `scale(${press})`,
              background: GRAD.warm,
              color: "#fff",
              borderRadius: 999,
              padding: "14px 30px",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            Copiar
          </div>
        </div>
        <div style={{ ...row, gap: 14, marginTop: 22, minHeight: 90 }}>
          {(["amigos", "grupo", "redes", "casa"] as const).map((g, i) => (
            <Pop key={g} at={A(25, "compártelo") + i * 3}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: [GRAD.cool, GRAD.deep, GRAD.warm, GRAD.main][i],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Glyph name={g} size={46} />
              </div>
            </Pop>
          ))}
          <Pop at={A(25, "compártelo") + 10}>
            <span style={{ fontSize: 36, fontWeight: 800, color: Y.purple }}>
              ¡Compártelo!
            </span>
          </Pop>
        </div>
        <Badge
          at={copia + 4}
          text="¡Link copiado!"
          bg={Y.ok}
          style={{ top: -40, bottom: "auto" }}
        />
      </Card>
    </Scene>
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
        gap: 40,
        paddingTop: 1220,
      }}
    >
      <Pop at={start} from={0.3} rotate={-3}>
        <Img src={staticFile(LOGO)} style={{ width: 760 }} />
      </Pop>
      <Pop at={start + 12}>
        <Chip
          size={42}
          bg={GRAD.warm}
          style={{
            border: "6px solid #fff",
            boxShadow: "0 14px 40px rgba(26,18,64,.4)",
          }}
        >
          Comparte tu causa
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
  ...GRAPHICS.slice(1)
    .filter((g) => SPANS.every((s) => s.start !== graphicSpan(g.id).start))
    .map((g) => ({
      name: "whoosh" as const,
      at: graphicSpan(g.id).start - 2,
      v: 0.3,
    })),
  { name: "pop", at: A(0, "gastos"), v: 0.4 },
  { name: "ding", at: A(1, "ayudar"), v: 0.35 },
  { name: "pop", at: A(2, "yolapp") - 3, v: 0.5 },
  { name: "ding", at: A(4, "historia"), v: 0.3 },
  { name: "ding", at: A(5, "recaudar"), v: 0.3 },
  { name: "ding", at: A(6, "conectar"), v: 0.3 },
  { name: "pop", at: A(7, "subiste"), v: 0.4 },
  { name: "pop", at: A(8, "3"), v: 0.45 },
  { name: "cash", at: A(9, "donativos"), v: 0.45 },
  { name: "pop", at: clipAt(10), v: 0.4 },
  { name: "click", at: A(11, "foto") + 4, v: 0.5 },
  { name: "pop", at: A(12, "video"), v: 0.35 },
  { name: "ding", at: A(13, "conecten"), v: 0.35 },
  { name: "pop", at: clipAt(14), v: 0.4 },
  { name: "ding", at: A(15, "medicamentos"), v: 0.3 },
  { name: "ding", at: A(15, "tratamiento"), v: 0.3 },
  { name: "ding", at: A(16, "situación"), v: 0.3 },
  { name: "pop", at: A(16, "confianza"), v: 0.4 },
  { name: "pop", at: A(18, "importante"), v: 0.45 },
  { name: "pop", at: A(19, "link"), v: 0.4 },
  ...SHARE.map((b) => ({ name: "pop" as const, at: A(20, b.word), v: 0.3 })),
  { name: "pop", at: A(21, "bonita"), v: 0.4 },
  { name: "click", at: A(21, "nadie"), v: 0.5 },
  { name: "ding", at: A(22, "primer"), v: 0.3 },
  { name: "pop", at: A(23, "moverla"), v: 0.35 },
  { name: "ding", at: A(23, "diferencia"), v: 0.35 },
  { name: "pop", at: A(24, "yolapp") - 2, v: 0.35 },
  { name: "click", at: A(25, "copia"), v: 0.6 },
  { name: "pop", at: A(25, "compártelo"), v: 0.35 },
  { name: "pop", at: A(26, "lejos"), v: 0.4 },
  { name: "whoosh", at: SPEECH_END - 8, v: 0.4 },
  { name: "ding", at: SPEECH_END + 8, v: 0.35 },
];

export const Yolapp2Reel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
      <Talking />
      <Comunidad />
      <LogoBeat />
      <Red />
      <Tip1 />
      <Tip2 />
      <Tip3 />
      <Pasos />
      <App />
      <Stickers />
      <Captions />
      <Outro />
      <Audio
        src={staticFile("yolapp/v2/musica.wav")}
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

export const YOLAPP2_FRAMES = TOTAL;
