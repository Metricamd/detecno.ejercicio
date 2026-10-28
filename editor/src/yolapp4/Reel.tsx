// Yolapp reel 4 (1080 × 1920, 30 fps): "No cometas este error" — creating
// the cause is only step one, sharing the link is what brings donations.
// Same look and rules as reels 1–3 (public/yolapp/marca.md): full-screen
// video, word-by-word captions, stickers above the head, brand cards and
// diagrams on the lower third, cutaways over look-aways. Face y ≈ 380–1150.
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
  LinkIcon,
  Pop,
  Sticker,
  Tick,
} from "../yolapp/parts";
import { Moneda, Perro } from "../yolapp3/ilustraciones";
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

const SRC = "yolapp/v4/crudo.mp4";
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
const zoomFor = (i: number) => (inGraphic(i) ? 1.0 : i % 2 === 0 ? 1.0 : 1.1);
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip =
    CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ??
    CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  // hook: start tight and pull out; every cut drifts in slowly
  const hook =
    clip.i === 0
      ? interpolate(frame, [0, 14], [0.25, 0], { ...clamp, easing: EASE })
      : 0;
  const scale = zoomFor(clip.i) + 0.03 * local + hook;
  const tail = Math.max(
    1,
    Math.round((TAIL_END - CLIPS[CLIPS.length - 1].to) * 30),
  );
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
            src={staticFile("yolapp/v4/final.jpg")}
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
        height: page.top ? 230 : 260,
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
        size={56}
        rotate={-3}
        top={top}
      />
      <div
        style={{
          position: "absolute",
          top: top + 38,
          left: 130,
          width: 820 * s,
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

const WARN = `linear-gradient(135deg, #FFB800, ${Y.coral})`;
const Stickers: React.FC = () => (
  <>
    <Between from={0} to={clipAt(1)}>
      <Sticker
        at={A(0, "dinero") - 2}
        text="¿Necesitas dinero?"
        bg={GRAD.main}
        size={64}
        rotate={-3}
        top={170}
      />
      <Sticker
        at={A(0, "error")}
        text="¡No cometas este error!"
        bg={WARN}
        size={60}
        rotate={3}
        top={300}
      />
    </Between>
    <Between from={clipAt(9)} to={clipAt(10)}>
      <Tachado
        at={clipAt(9) + 2}
        strikeAt={A(9, "solos")}
        text="Esperar a que lleguen solos"
        top={200}
      />
    </Between>
    <Between from={clipAt(13)} to={clipAt(14)}>
      <Sticker
        at={A(13, "ayudarte")}
        text="Alguien quiere ayudarte"
        bg={GRAD.warm}
        size={60}
        rotate={-3}
        top={160}
      />
      <Sticker
        at={A(13, "conocer")}
        text="…si conoce tu causa"
        bg={GRAD.cool}
        size={62}
        rotate={3}
        top={290}
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
    style={{ position: "absolute", right: -22, bottom: -40, ...style }}
  >
    <Chip
      size={32}
      bg={bg}
      style={{
        border: "5px solid #fff",
        boxShadow: "0 12px 30px rgba(26,18,64,.35)",
      }}
    >
      <Tick size={34} />
      {text}
    </Chip>
  </Pop>
);
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

// Step 1 of 3 done, the rest still pending.
const Paso: React.FC = () => {
  const frame = useCurrentFrame();
  const primer = A(1, "primer");
  const steps: [string, string][] = [
    ["1", "Crear tu causa"],
    ["2", "Compartir el link"],
    ["3", "Recibir donativos"],
  ];
  return (
    <Scene id="paso">
      <Pop at={clipAt(1) + 2} from={0.6}>
        <Card
          style={{ width: 900, padding: "26px 30px", position: "relative" }}
        >
          {steps.map(([n, label], i) => {
            const done = i === 0;
            return (
              <div
                key={n}
                style={{
                  ...row,
                  marginTop: i ? 14 : 0,
                  opacity: done
                    ? 1
                    : interpolate(
                        frame,
                        [primer, primer + 8],
                        [1, 0.35],
                        clamp,
                      ),
                }}
              >
                <div
                  style={{
                    ...circle(64, done ? GRAD.main : "#D9D6E8"),
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 34,
                  }}
                >
                  {n}
                </div>
                <span style={{ fontSize: 40, fontWeight: 800, flex: 1 }}>
                  {label}
                </span>
                {done ? (
                  <Check at={clipAt(1) + 6} size={50} />
                ) : (
                  <span
                    style={{ fontSize: 28, fontWeight: 700, color: Y.muted }}
                  >
                    pendiente
                  </span>
                )}
              </div>
            );
          })}
          <Badge at={primer} text="Solo el primer paso" bg={Y.pink} />
        </Card>
      </Pop>
    </Scene>
  );
};

const Nadie: React.FC = () => {
  const frame = useCurrentFrame();
  const nadie = A(2, "nadie");
  const grey = interpolate(frame, [nadie, nadie + 10], [0, 1], clamp);
  return (
    <Scene id="nadie">
      <div style={{ position: "relative" }}>
        <Card
          style={{
            width: 880,
            ...row,
            gap: 24,
            padding: 26,
            filter: `grayscale(${grey})`,
          }}
        >
          <div style={{ ...circle(150, "#FFF3E2") }}>
            <Perro size={140} />
          </div>
          <div style={{ flex: 1 }}>
            <Img src={staticFile(LOGO)} style={{ height: 44 }} />
            <div style={{ fontSize: 42, fontWeight: 800, marginTop: 6 }}>
              Mi historia
            </div>
            <div
              style={{
                height: 20,
                width: "80%",
                borderRadius: 10,
                background: "#ECEAF4",
                marginTop: 12,
              }}
            />
            <div
              style={{
                height: 18,
                width: "55%",
                borderRadius: 9,
                background: "#F2F0F8",
                marginTop: 10,
              }}
            />
          </div>
        </Card>
        <Pop
          at={nadie}
          rotate={4}
          style={{ position: "absolute", right: -16, bottom: -54 }}
        >
          <div
            style={{
              ...row,
              background: "#fff",
              borderRadius: 999,
              padding: "12px 30px",
              border: `7px solid ${Y.pink}`,
              boxShadow: "0 16px 40px rgba(26,18,64,.4)",
            }}
          >
            <EyeIcon size={54} crossed />
            <span style={{ fontSize: 46, fontWeight: 800, color: Y.pink }}>
              Nadie la conoce
            </span>
          </div>
        </Pop>
      </div>
    </Scene>
  );
};

const CANALES = [
  {
    take: 4,
    word: "facebook",
    label: "Facebook",
    glyph: "amigos",
    bg: "linear-gradient(135deg, #1877F2, #3E58F8)",
  },
  {
    take: 4,
    word: "whatsapp",
    label: "WhatsApp",
    glyph: "grupo",
    bg: "linear-gradient(135deg, #25D366, #03C7C1)",
  },
  { take: 4, word: "redes", label: "Redes", glyph: "redes", bg: GRAD.warm },
  { take: 5, word: "grupos", label: "Grupos", glyph: "casa", bg: GRAD.deep },
  {
    take: 5,
    word: "quieras",
    label: "¡Donde sea!",
    glyph: "mundo",
    bg: GRAD.main,
  },
] as const;
const Comparte: React.FC = () => {
  const frame = useCurrentFrame();
  const copia = A(4, "copia");
  const press = interpolate(
    frame,
    [copia + 4, copia + 7, copia + 11],
    [1, 0.85, 1],
    clamp,
  );
  return (
    <Scene id="comparte">
      <Pop at={clipAt(4)} style={{ marginBottom: 26 }}>
        <div
          style={{
            ...row,
            gap: 14,
            background: "#fff",
            borderRadius: 999,
            padding: "12px 12px 12px 30px",
            boxShadow: "0 14px 40px rgba(26,18,64,.35)",
          }}
        >
          <LinkIcon size={44} color={Y.purple} />
          <span style={{ fontSize: 36, fontWeight: 800, color: Y.ink }}>
            yolapp.com/tu-causa
          </span>
          <div
            style={{
              transform: `scale(${press})`,
              background: frame >= copia + 6 ? Y.ok : GRAD.warm,
              color: "#fff",
              borderRadius: 999,
              padding: "12px 26px",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            {frame >= copia + 6 ? "¡Copiado!" : "Copiar"}
          </div>
        </div>
      </Pop>
      <div style={{ display: "flex", gap: 8 }}>
        {CANALES.map((c) => (
          <Pop
            key={c.word}
            at={A(c.take, c.word)}
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
                ...circle(130, c.bg),
                border: "6px solid #fff",
                boxShadow: "0 14px 34px rgba(26,18,64,.35)",
              }}
            >
              <Glyph name={c.glyph} size={64} />
            </div>
            <Chip size={22} bg="#fff" color={Y.ink}>
              {c.label}
            </Chip>
          </Pop>
        ))}
      </div>
    </Scene>
  );
};

// Diagram: more people know the cause → more donations → support.
const Mas: React.FC = () => {
  const frame = useCurrentFrame();
  const { start } = graphicSpan("mas");
  const don = A(7, "donativos");
  const bars = [0.25, 0.45, 0.7, 1];
  const grow = interpolate(frame, [A(7, "más"), don + 10], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <Scene id="mas">
      <Card
        style={{
          width: 920,
          ...row,
          gap: 26,
          padding: "26px 30px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            width: 300,
          }}
        >
          <div style={{ display: "flex" }}>
            {[GRAD.warm, GRAD.cool, GRAD.main, GRAD.deep].map((bg, i) => (
              <Pop
                key={i}
                at={start + 4 + i * 6}
                style={{ marginLeft: i ? -22 : 0 }}
              >
                <div style={{ ...circle(84, bg), border: "5px solid #fff" }}>
                  <Glyph name="amigos" size={46} />
                </div>
              </Pop>
            ))}
          </div>
          <Counter
            from={0}
            to={2400}
            start={start + 4}
            end={A(6, "causa") + 6}
            style={{ fontSize: 50, fontWeight: 800, color: Y.ink }}
          />
          <span style={{ fontSize: 26, fontWeight: 700, color: Y.muted }}>
            personas conocen tu causa
          </span>
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
        >
          <div style={{ ...row, gap: 10 }}>
            <Moneda size={56} />
            <span style={{ fontSize: 36, fontWeight: 800 }}>Donativos</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 14,
              height: 170,
            }}
          >
            {bars.map((b, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.max(4, b * 100 * interpolate(grow, [i * 0.15, i * 0.15 + 0.55], [0, 1], clamp))}%`,
                  borderRadius: 14,
                  background: i === bars.length - 1 ? GRAD.warm : GRAD.cool,
                }}
              />
            ))}
          </div>
        </div>
        <Badge at={A(8, "apoyo")} text="Y encuentras apoyo" bg={Y.pink} />
      </Card>
    </Scene>
  );
};

const App: React.FC = () => {
  const frame = useCurrentFrame();
  const copia = A(10, "copia");
  const press = interpolate(
    frame,
    [copia, copia + 3, copia + 7],
    [1, 0.85, 1],
    clamp,
  );
  const lejos = A(12, "lejos");
  const fly = interpolate(frame, [lejos - 6, lejos + 10], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  return (
    <Scene id="app">
      <Card style={{ width: 900, padding: 28, position: "relative" }}>
        <div style={{ ...row, justifyContent: "space-between" }}>
          <Img src={staticFile(LOGO)} style={{ height: 56 }} />
          <Pop at={A(11, "hoy")}>
            <Chip size={28} bg={GRAD.warm}>
              ¡Hoy mismo!
            </Chip>
          </Pop>
        </div>
        <div
          style={{
            ...row,
            marginTop: 22,
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
              background: frame >= copia + 3 ? Y.ok : GRAD.warm,
              color: "#fff",
              borderRadius: 999,
              padding: "14px 28px",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            {frame >= copia + 3 ? "¡Copiado!" : "Copiar"}
          </div>
        </div>
        <div style={{ ...row, gap: 14, marginTop: 20, minHeight: 86 }}>
          {(["amigos", "grupo", "redes", "casa"] as const).map((g, i) => (
            <Pop key={g} at={A(11, "compártelo") + i * 3}>
              <div
                style={circle(
                  80,
                  [GRAD.cool, GRAD.deep, GRAD.warm, GRAD.main][i],
                )}
              >
                <Glyph name={g} size={44} />
              </div>
            </Pop>
          ))}
          <div style={{ flex: 1, position: "relative", height: 80 }}>
            <div
              style={{
                position: "absolute",
                left: `${fly * 70}%`,
                top: 6 - fly * 20,
                opacity: frame >= lejos - 6 ? 1 : 0,
                transform: `rotate(${-20 + fly * 20}deg)`,
              }}
            >
              <svg width={90} height={70} viewBox="0 0 24 18">
                <path d="M1 9 L23 1 L16 17 L11 11 Z" fill={Y.pink} />
                <path d="M11 11 L23 1" stroke="#fff" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
        <Badge at={lejos} text="¡Mucho más lejos!" bg={Y.purple} />
      </Card>
    </Scene>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, number][] = [
    ["Ingresa a Yolapp", A(14, "ingresa")],
    ["Copia tu link", A(14, "copia")],
    ["Recibe más donativos", A(14, "recibir")],
  ];
  return (
    <Scene id="final">
      <Card style={{ width: 860, padding: "26px 32px", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map(([label, at], i) => (
            <div
              key={label}
              style={{ ...row, opacity: frame >= at ? 1 : 0.35 }}
            >
              <div
                style={{
                  ...circle(62, [GRAD.main, GRAD.cool, GRAD.warm][i]),
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 34,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 42, fontWeight: 800, flex: 1 }}>
                {label}
              </span>
              <Check at={at + 4} size={50} />
            </div>
          ))}
        </div>
        <Pop
          at={A(14, "donativos")}
          style={{ position: "absolute", right: -30, top: -60 }}
        >
          <div style={{ display: "flex" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  marginLeft: i ? -40 : 0,
                  transform: `translateY(${Math.sin((frame + i * 9) / 6) * 6}px)`,
                }}
              >
                <Moneda size={90} />
              </div>
            ))}
          </div>
        </Pop>
      </Card>
    </Scene>
  );
};

/* ---------- cutaways: full-screen brand shots over the look-aways ---------- */
const CUT_LOOK: Record<
  (typeof CUTAWAYS)[number]["id"],
  { bg: string; text: string; art: React.ReactNode }
> = {
  importante: {
    bg: `linear-gradient(135deg, #FFB800, ${Y.coral} 55%, ${Y.pink})`,
    text: "Lo importante",
    art: (
      <div
        style={{
          ...circle(300, "rgba(255,255,255,.2)"),
          border: "10px solid #fff",
          color: "#fff",
          fontSize: 220,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        !
      </div>
    ),
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
          fontSize: 110,
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
        gap: 40,
        paddingTop: 1230,
      }}
    >
      <Pop at={start} from={0.3} rotate={-3}>
        <Img src={staticFile(LOGO)} style={{ width: 720 }} />
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
  ...CUTAWAYS.map((c) => ({
    name: "whoosh" as const,
    at: srcFrame(c.from) - 2,
    v: 0.35,
  })),
  { name: "cash", at: A(0, "dinero"), v: 0.45 },
  { name: "click", at: A(0, "error"), v: 0.55 },
  { name: "ding", at: clipAt(1) + 6, v: 0.3 },
  { name: "pop", at: A(1, "primer"), v: 0.4 },
  { name: "click", at: A(2, "nadie"), v: 0.5 },
  { name: "click", at: A(4, "copia") + 5, v: 0.55 },
  ...CANALES.map((c) => ({
    name: "pop" as const,
    at: A(c.take, c.word),
    v: 0.3,
  })),
  { name: "cash", at: A(7, "donativos"), v: 0.45 },
  { name: "pop", at: A(8, "apoyo"), v: 0.4 },
  { name: "pop", at: clipAt(9) + 2, v: 0.4 },
  { name: "click", at: A(9, "solos"), v: 0.55 },
  { name: "click", at: A(10, "copia"), v: 0.55 },
  { name: "pop", at: A(11, "compártelo"), v: 0.3 },
  { name: "pop", at: A(11, "hoy"), v: 0.35 },
  { name: "whoosh", at: A(12, "lejos") - 6, v: 0.35 },
  { name: "pop", at: A(13, "ayudarte"), v: 0.4 },
  { name: "pop", at: A(13, "conocer"), v: 0.4 },
  { name: "ding", at: A(14, "ingresa") + 4, v: 0.3 },
  { name: "ding", at: A(14, "copia") + 4, v: 0.3 },
  { name: "cash", at: A(14, "donativos"), v: 0.45 },
  { name: "whoosh", at: SPEECH_END - 8, v: 0.4 },
  { name: "ding", at: SPEECH_END + 8, v: 0.35 },
];

export const Yolapp4Reel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
      <Talking />
      <Paso />
      <Nadie />
      <Comparte />
      <Mas />
      <App />
      <Final />
      <Stickers />
      <Cutaways />
      <Captions />
      <Outro />
      <Audio
        src={staticFile("yolapp/v4/musica.wav")}
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

export const YOLAPP4_FRAMES = TOTAL;
