// Yolapp reel (1080 × 1920, 30 fps): the talking-head take cut down to the
// good lines, punch-in zooms on every cut, word-by-word captions, stickers on
// the key phrases and brand scenes where the video shrinks into a bubble.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { POPPINS, poppinsReady } from "../theme";
import { CLIPS, clipAt, GRAD, GRAPHICS, GraphicId, graphicSpan, isKeyword, SPEECH_END, TOTAL, W, Word, wordAt, WORDS, Y } from "./datos";
import { Card, Check, Chip, clamp, Counter, EASE, EyeIcon, Glyph, Heart, ImageIcon, LinkIcon, PlayIcon, Pop, Stars, Sticker, Tick, useShake } from "./parts";

const SRC = "yolapp/crudo.mp4";
const A = wordAt;

/* ---------- when the video is a bubble (0 = full screen, 1 = bubble) ---------- */
const BUBBLE_SPANS = (() => {
  const spans = GRAPHICS.map((g) => graphicSpan(g.id));
  const out: { start: number; end: number }[] = [];
  for (const s of spans) {
    const last = out[out.length - 1];
    if (last && last.end === s.start) last.end = s.end;
    else out.push({ ...s });
  }
  return out;
})();
const IN = 9;
const bubbleAmount = (frame: number) => {
  let p = 0;
  for (const s of BUBBLE_SPANS) {
    const v = Math.min(interpolate(frame, [s.start - 2, s.start + IN], [0, 1], clamp), interpolate(frame, [s.end - IN, s.end], [1, 0], clamp));
    p = Math.max(p, v);
  }
  return EASE(p);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- background behind the bubble ---------- */
const BG: Record<GraphicId, string> = {
  dudoso: GRAD.warm,
  confiable: GRAD.cool,
  causa: GRAD.main,
  invisible: GRAD.deep,
  comparte: GRAD.main,
  recibir: GRAD.warm,
  resumen: GRAD.main,
};
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const current = GRAPHICS.filter((g) => frame >= graphicSpan(g.id).start - IN).pop()?.id ?? "dudoso";
  return (
    <AbsoluteFill style={{ background: BG[current], overflow: "hidden" }}>
      {[
        { x: 120, y: 380, r: 420, c: "rgba(255,255,255,.16)", s: 0.011 },
        { x: 900, y: 1250, r: 520, c: "rgba(255,255,255,.12)", s: 0.008 },
        { x: 260, y: 1650, r: 360, c: "rgba(255,74,58,.25)", s: 0.013 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x - b.r / 2 + Math.sin(frame * b.s + i) * 60,
            top: b.y - b.r / 2 + Math.cos(frame * b.s * 1.3 + i) * 50,
            width: b.r,
            height: b.r,
            borderRadius: "50%",
            background: b.c,
            filter: "blur(40px)",
          }}
        />
      ))}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.14) 2px, transparent 2px)", backgroundSize: "44px 44px" }} />
    </AbsoluteFill>
  );
};

/* ---------- the talking-head video ---------- */
const zoomFor = (i: number) => (i === 14 ? 1.3 : i % 2 === 0 ? 1.0 : 1.14);
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const p = bubbleAmount(frame);
  const clip = CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ?? CLIPS[CLIPS.length - 1];
  const local = (frame - clip.at) / clip.len;
  // hook: start tight and pull out; every other cut drifts in slowly
  const hook = clip.i === 0 ? interpolate(frame, [0, 14], [0.28, 0], { ...clamp, easing: EASE }) : 0;
  const zoom = zoomFor(clip.i) + 0.03 * local + hook;
  const scale = lerp(zoom, 1, p);
  const shake = useShake(clipAt(14), 12, 18);
  const size = 380;
  const innerW = lerp(W, 640, p);
  const innerH = (innerW * 854) / 480;
  return (
    <div
      style={{
        position: "absolute",
        left: lerp(0, (W - size) / 2, p),
        top: lerp(0, 175, p),
        width: lerp(W, size, p),
        height: lerp(1920, size, p),
        borderRadius: lerp(0, size / 2, p),
        overflow: "hidden",
        transform: shake,
        boxShadow: p > 0 ? `0 0 0 ${10 * p}px #fff, 0 24px 60px rgba(26,18,64,${0.45 * p})` : "none",
        background: "#000",
      }}
    >
      <div style={{ position: "absolute", left: lerp(0, size / 2 - 320, p), top: lerp(0, size / 2 - 0.36 * 1138, p), width: innerW, height: innerH, transform: `scale(${scale})`, transformOrigin: "50% 36%" }}>
        {CLIPS.map((c) => (
          <Sequence key={c.i} from={c.at} durationInFrames={c.len} layout="none">
            <OffthreadVideo
              src={staticFile(SRC)}
              trimBefore={Math.round(c.from * 30)}
              volume={(f) => Math.min(1, (f + 1) / 3, (c.len - f) / 3)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Sequence>
        ))}
      </div>
      {/* soft vignette so captions read on the full-screen shots */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(26,18,64,.35) 0%, rgba(26,18,64,0) 22%, rgba(26,18,64,0) 55%, rgba(26,18,64,.55) 100%)", opacity: 1 - p }} />
    </div>
  );
};

/* ---------- captions: word by word, active word on a pink pill ---------- */
type Page = { words: Word[]; start: number; end: number };
const PAGES: Page[] = (() => {
  const pages: Word[][] = [];
  for (const c of CLIPS) {
    let cur: Word[] = [];
    for (const w of WORDS.filter((x) => x.clip === c.i)) {
      cur.push(w);
      const punct = /[,.?!:]$/.test(w.text);
      if (cur.length >= 4 || (punct && cur.length >= 2)) {
        pages.push(cur);
        cur = [];
      }
    }
    if (cur.length) {
      if (cur.length === 1 && pages.length && pages[pages.length - 1][0].clip === c.i) pages[pages.length - 1].push(...cur);
      else pages.push(cur);
    }
  }
  return pages.map((ws, i) => ({ words: ws, start: Math.floor(ws[0].start), end: i + 1 < pages.length ? Math.floor(pages[i + 1][0].start) : SPEECH_END }));
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const page = PAGES.find((pg) => frame >= pg.start && frame < pg.end);
  if (!page) return null;
  const p = bubbleAmount(frame);
  const out = interpolate(frame, [page.end - 3, page.end], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: lerp(1250, 1470, p), height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "6px 14px", opacity: out }}>
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
                fontSize: 76,
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: active ? "#fff" : key ? "#5FF5EC" : "#fff",
                background: active ? Y.pink : "transparent",
                borderRadius: 20,
                padding: "0 14px",
                opacity: inP,
                filter: `blur(${(1 - inP) * 6}px)`,
                transform: `translateY(${(1 - inP) * 16}px) scale(${active ? 1.06 : 1}) rotate(${active ? -1.5 : 0}deg)`,
                textShadow: active ? "none" : "0 4px 0 rgba(26,18,64,.85), 0 0 18px rgba(26,18,64,.7), 0 0 4px rgba(26,18,64,.9)",
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

/* ---------- stickers on the talking-head shots ---------- */
const Between: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <AbsoluteFill style={{ opacity: interpolate(frame, [to - 4, to], [1, 0], clamp) }}>{children}</AbsoluteFill>;
};

const Hearts: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 9 }, (_, i) => {
        const t = frame - at - i * 3;
        if (t < 0) return null;
        const y = interpolate(t, [0, 40], [1900, 700 + (i % 3) * 120], { ...clamp, easing: EASE });
        const x = 120 + ((i * 113) % 840) + Math.sin(t / 6 + i) * 30;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: interpolate(t, [30, 44], [1, 0], clamp), transform: `rotate(${(i % 2 ? 1 : -1) * 12}deg)` }}>
            <Heart size={70 + (i % 3) * 22} color={[Y.pink, Y.coral, "#fff"][i % 3]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Stickers: React.FC = () => {
  const frame = useCurrentFrame();
  const aguas = clipAt(14);
  return (
    <>
      <Between from={0} to={clipAt(2)}>
        <Sticker at={3} text="Seamos honestos" />
      </Between>
      <Between from={clipAt(7)} to={clipAt(8)}>
        <Sticker at={A(7, "causa")} text="Tu causa = tu producto" bg={GRAD.main} size={64} rotate={3} />
      </Between>
      <Between from={clipAt(10)} to={clipAt(11)}>
        <Sticker at={A(10, "clara")} text="Clara" bg={GRAD.cool} rotate={-5} top={230} />
        <Sticker at={A(10, "transparente")} text="+ transparente" bg={GRAD.warm} rotate={3} top={360} size={66} />
      </Between>
      <Between from={clipAt(11)} to={clipAt(14)}>
        <Sticker at={clipAt(11)} text="= más fácil ayudarte" bg={GRAD.main} size={58} rotate={-3} />
        <Hearts at={A(13, "ayudarte") - 4} />
      </Between>
      <Between from={aguas} to={clipAt(15)}>
        <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [aguas, aguas + 6], [0.75, 0], clamp) }} />
        <Sticker at={aguas + 1} text="¡Aguas!" bg={`linear-gradient(135deg, #FFB800, ${Y.coral})`} size={120} rotate={-6} top={220} />
      </Between>
      <Between from={clipAt(18)} to={clipAt(19)}>
        <Sticker at={A(18, "subir")} text="Subir" bg={GRAD.cool} rotate={-4} top={220} />
        <Sticker at={A(18, "no")} text="≠ recaudar" bg={GRAD.warm} rotate={3} top={350} size={70} />
      </Between>
      <Between from={clipAt(23)} to={SPEECH_END}>
        <Sticker at={A(23, "historia")} text="Tu historia" bg={GRAD.warm} rotate={-3} />
      </Between>
    </>
  );
};

/* ---------- brand scenes ---------- */
const Scene: React.FC<{ id: GraphicId; children: React.ReactNode }> = ({ id, children }) => {
  const frame = useCurrentFrame();
  const { start, end } = graphicSpan(id);
  if (frame < start || frame >= end) return null;
  const enter = interpolate(frame, [start, start + 12], [1, 0], { ...clamp, easing: EASE });
  const exit = interpolate(frame, [end - 8, end], [0, 1], { ...clamp, easing: EASE });
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 600,
        height: 840,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateX(${enter * 1000 - exit * 1000}px) rotate(${enter * 6 - exit * 6}deg)`,
        opacity: 1 - exit * 0.6,
      }}
    >
      {children}
    </div>
  );
};

const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 18 };

const Dudoso: React.FC = () => {
  const real = A(4, "real");
  return (
    <Scene id="dudoso">
      <div style={{ transform: useShake(real + 3, 12, 16), position: "relative" }}>
        <Card style={{ width: 800 }}>
          <div style={{ ...row, justifyContent: "space-between", marginBottom: 24 }}>
            <Chip size={26}>Vendedor A</Chip>
            <Pop at={A(2, "foto")}>
              <Chip size={26} bg="#EEEBF6" color={Y.ink}>
                1 foto
              </Chip>
            </Pop>
          </div>
          <div style={{ height: 360, borderRadius: 28, background: "#EEEBF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={130} />
          </div>
          <div style={{ marginTop: 26, height: 30, width: "70%", borderRadius: 15, background: "#ECEAF4" }} />
          <div style={{ marginTop: 14, height: 24, width: "45%", borderRadius: 12, background: "#F2F0F8" }} />
          <Pop at={A(3, "cero")} style={{ ...row, marginTop: 28 }}>
            <Stars from={0} count={0} size={56} />
            <span style={{ fontSize: 42, fontWeight: 800, color: Y.coral }}>0 reseñas</span>
          </Pop>
        </Card>
        <Pop at={real} from={2.4} rotate={-12} style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
          <div style={{ border: `10px solid ${Y.pink}`, color: Y.pink, background: "rgba(255,255,255,.92)", borderRadius: 26, padding: "10px 34px", fontFamily: POPPINS, fontWeight: 800, fontSize: 104, letterSpacing: "0.02em" }}>
            ¿ES REAL?
          </div>
        </Pop>
      </div>
    </Scene>
  );
};

const TILES = [
  { label: "Frente", bg: GRAD.main },
  { label: "Lado", bg: GRAD.warm },
  { label: "Atrás", bg: GRAD.cool },
  { label: "Detalle", bg: GRAD.deep },
];
const Confiable: React.FC = () => {
  const fotos = A(5, "fotos");
  return (
    <Scene id="confiable">
      <Card style={{ width: 800, position: "relative" }}>
        <div style={{ ...row, justifyContent: "space-between", marginBottom: 24 }}>
          <Chip size={26} bg={Y.blue}>
            Vendedor B
          </Chip>
          <Pop at={A(5, "ángulos")}>
            <Chip size={26} bg="#E5F8F7" color="#058C88">
              +4 fotos
            </Chip>
          </Pop>
        </div>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, height: 360 }}>
          {TILES.map((t, i) => (
            <Pop key={t.label} at={fotos + i * 5} style={{ borderRadius: 24, background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <ImageIcon size={64} color="#fff" />
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 28 }}>{t.label}</span>
            </Pop>
          ))}
          <Pop at={A(6, "videos")} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PlayIcon size={130} />
          </Pop>
        </div>
        <div style={{ ...row, marginTop: 28, minHeight: 60 }}>
          <Stars from={A(6, "reseñas")} step={3} size={56} />
          <Pop at={A(6, "reseñas") + 10}>
            <span style={{ fontSize: 38, fontWeight: 800 }}>4.9 · 128 reseñas</span>
          </Pop>
        </div>
        <Pop at={A(6, "confianza")} rotate={-4} style={{ position: "absolute", right: -30, bottom: -50 }}>
          <Chip size={40} bg={Y.ok} style={{ boxShadow: "0 14px 40px rgba(20,195,142,.5)", border: "6px solid #fff" }}>
            <Tick />
            Da confianza
          </Chip>
        </Pop>
      </Card>
    </Scene>
  );
};

const Causa: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, number][] = [
    ["Fotos de tus medicamentos", A(9, "medicamentos")],
    ["Tu tratamiento", A(9, "tratamiento")],
    ["Lo que lo compruebe", A(9, "comprobar")],
  ];
  return (
    <Scene id="causa">
      <Card style={{ width: 820, padding: 0, overflow: "visible", position: "relative" }}>
        <div style={{ background: GRAD.main, borderRadius: "44px 44px 0 0", padding: "26px 36px", ...row, justifyContent: "space-between" }}>
          <Img src={staticFile("yolapp/logo/logo-blanco.png")} style={{ height: 54 }} />
          <Chip size={24} bg="rgba(255,255,255,.22)">
            Mi causa
          </Chip>
        </div>
        <div style={{ padding: 32 }}>
          <div style={{ height: 250, borderRadius: 26, background: GRAD.deep, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
            <Pop at={A(8, "video")}>
              <PlayIcon size={110} />
            </Pop>
            <Pop at={A(8, "historia")}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 46 }}>Tu historia</span>
            </Pop>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 30 }}>
            {items.map(([label, at]) => (
              <div key={label} style={{ ...row, opacity: frame >= at ? 1 : 0.35 }}>
                <Check at={at} size={58} />
                <span style={{ fontSize: 40, fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <Pop at={A(9, "cierta")} rotate={-5} style={{ position: "absolute", right: -26, bottom: -46 }}>
          <Chip size={38} bg={Y.ok} style={{ border: "6px solid #fff", boxShadow: "0 14px 40px rgba(20,195,142,.5)" }}>
            <Tick />
            Causa verificada
          </Chip>
        </Pop>
      </Card>
    </Scene>
  );
};

const Invisible: React.FC = () => {
  const frame = useCurrentFrame();
  const { start } = graphicSpan("invisible");
  const nadie = A(16, "nadie");
  const fill = interpolate(frame, [start + 8, A(15, "completa") + 10], [0, 100], { ...clamp, easing: EASE });
  const grey = interpolate(frame, [nadie, nadie + 10], [0, 1], clamp);
  return (
    <Scene id="invisible">
      <div style={{ transform: useShake(nadie, 10, 12), position: "relative" }}>
        <Card style={{ width: 800, filter: `grayscale(${grey})`, opacity: 1 - grey * 0.25 }}>
          <div style={{ ...row, justifyContent: "space-between" }}>
            <Img src={staticFile("yolapp/logo/logo-color.png")} style={{ height: 52 }} />
            <span style={{ fontSize: 30, fontWeight: 800, color: Y.ok }}>{Math.round(fill)}%</span>
          </div>
          <div style={{ fontSize: 46, fontWeight: 800, marginTop: 22 }}>Causa completa</div>
          <div style={{ height: 26, borderRadius: 13, background: "#EEEBF6", marginTop: 18, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${fill}%`, background: GRAD.cool, borderRadius: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 24, flexWrap: "wrap" }}>
            {["Video", "Fotos", "Pruebas"].map((t, i) => (
              <div key={t} style={{ ...row, gap: 10 }}>
                <Check at={start + 10 + i * 5} size={42} />
                <span style={{ fontSize: 32, fontWeight: 600 }}>{t}</span>
              </div>
            ))}
          </div>
          <Pop at={A(16, "link")} style={{ marginTop: 30 }}>
            <div style={{ ...row, background: GRAD.main, color: "#fff", borderRadius: 999, padding: "18px 30px", fontSize: 36, fontWeight: 800 }}>
              <LinkIcon size={44} />
              yolapp.com/tu-causa
            </div>
          </Pop>
        </Card>
        <Pop at={nadie} rotate={4} style={{ position: "absolute", left: 0, right: 0, bottom: -80, display: "flex", justifyContent: "center" }}>
          <div style={{ ...row, background: "#fff", borderRadius: 999, padding: "18px 40px", border: `8px solid ${Y.pink}`, boxShadow: "0 18px 50px rgba(26,18,64,.4)" }}>
            <EyeIcon size={72} crossed />
            <span style={{ fontSize: 64, fontWeight: 800, color: Y.pink }}>0 visitas</span>
          </div>
        </Pop>
      </div>
    </Scene>
  );
};

const BUBBLES = [
  { word: "familia", label: "Familia", glyph: "casa", x: -280, y: -230, bg: GRAD.warm },
  { word: "amigos", label: "Amigos", glyph: "amigos", x: 280, y: -230, bg: GRAD.cool },
  { word: "redes", label: "Redes", glyph: "redes", x: -300, y: 150, bg: GRAD.deep },
  { word: "grupo", label: "Grupos", glyph: "grupo", x: 300, y: 150, bg: GRAD.warm },
  { word: "donde", label: "¡Donde sea!", glyph: "mundo", x: 0, y: 320, bg: GRAD.cool },
] as const;
const Comparte: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = graphicSpan("comparte");
  const first = A(17, "familia");
  return (
    <Scene id="comparte">
      <div style={{ position: "relative", width: 920, height: 840 }}>
        <svg width={920} height={840} style={{ position: "absolute", inset: 0 }}>
          {BUBBLES.map((b) => {
            const d = interpolate(frame, [A(17, b.word), A(17, b.word) + 8], [0, 1], clamp);
            return <line key={b.word} x1={460} y1={440} x2={460 + b.x * d} y2={440 + b.y * d} stroke="rgba(255,255,255,.75)" strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />;
          })}
        </svg>
        <Pop at={first - 6} style={{ position: "absolute", left: 0, right: 0, top: -10, display: "flex", justifyContent: "center" }}>
          <div style={{ ...row, background: "#fff", borderRadius: 999, padding: "14px 34px", boxShadow: "0 14px 40px rgba(26,18,64,.35)" }}>
            <EyeIcon size={56} color={Y.ok} />
            <Counter from={0} to={1250} start={first} end={end - 4} style={{ fontSize: 50, fontWeight: 800, color: Y.ink }} />
            <span style={{ fontSize: 36, fontWeight: 600, color: Y.muted }}>visitas</span>
          </div>
        </Pop>
        <Pop at={start + 4} style={{ position: "absolute", left: 460 - 95, top: 440 - 95 }}>
          <div style={{ width: 190, height: 190, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${12 + Math.sin(frame / 4) * 6}px rgba(255,255,255,.3), 0 20px 50px rgba(26,18,64,.4)` }}>
            <LinkIcon size={100} color={Y.pink} />
          </div>
        </Pop>
        {BUBBLES.map((b) => (
          <Pop key={b.word} at={A(17, b.word)} style={{ position: "absolute", left: 460 + b.x - 90, top: 440 + b.y - 90, width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 150, height: 150, borderRadius: "50%", background: b.bg, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(26,18,64,.35)" }}>
              <Glyph name={b.glyph} size={74} />
            </div>
            <Chip size={26} bg="#fff" color={Y.ink}>
              {b.label}
            </Chip>
          </Pop>
        ))}
      </div>
    </Scene>
  );
};

const Recibir: React.FC = () => {
  const frame = useCurrentFrame();
  const { end } = graphicSpan("recibir");
  const fill = interpolate(frame, [A(19, "para"), end - 4], [0, 78], { ...clamp, easing: EASE });
  return (
    <Scene id="recibir">
      <Pop at={A(19, "compartir")}>
        <Card style={{ width: 760, ...row, gap: 26 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: GRAD.main, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 52 }}>1</div>
          <div>
            <div style={{ fontSize: 50, fontWeight: 800 }}>Comparte tu link</div>
            <div style={{ fontSize: 30, fontWeight: 600, color: Y.muted }}>yolapp.com/tu-causa</div>
          </div>
        </Card>
      </Pop>
      <Pop at={A(19, "primer")} style={{ margin: "18px 0" }}>
        <Chip size={34} bg="#fff" color={Y.pink}>
          Primer paso
        </Chip>
      </Pop>
      <Pop at={A(19, "para")}>
        <Card style={{ width: 760 }}>
          <div style={{ ...row, gap: 26 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: GRAD.warm, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={56} color="#fff" />
            </div>
            <div style={{ fontSize: 50, fontWeight: 800 }}>Recibe apoyo</div>
          </div>
          <div style={{ height: 30, borderRadius: 15, background: "#EEEBF6", marginTop: 26, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${fill}%`, background: GRAD.warm, borderRadius: 15 }} />
          </div>
        </Card>
      </Pop>
    </Scene>
  );
};

const Resumen: React.FC = () => {
  const { start } = graphicSpan("resumen");
  const items: [string, number][] = [
    ["Mejora tu causa", clipAt(20)],
    ["Genera confianza", clipAt(21)],
    ["Comparte tu link", clipAt(22)],
  ];
  return (
    <Scene id="resumen">
      <Pop at={start + 2} style={{ marginBottom: 30 }}>
        <Chip size={36} bg="#fff" color={Y.purple}>
          Tu checklist
        </Chip>
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map(([label, at], i) => (
          <Pop key={label} at={at} from={0.6}>
            <Card style={{ width: 780, ...row, gap: 26, padding: "28px 34px" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: [GRAD.main, GRAD.cool, GRAD.warm][i], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 46 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 50, fontWeight: 800, flex: 1 }}>{label}</div>
              <Check at={at + 8} size={60} />
            </Card>
          </Pop>
        ))}
      </div>
    </Scene>
  );
};

/* ---------- outro ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const start = SPEECH_END - 8;
  if (frame < start) return null;
  const r = interpolate(frame, [start, start + 14], [0, 1300], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 50% 45%)` }}>
      <AbsoluteFill style={{ background: GRAD.main }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.16) 2px, transparent 2px)", backgroundSize: "44px 44px" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50, flexDirection: "column" }}>
        <Pop at={start + 8} from={0.3}>
          <Img src={staticFile("yolapp/logo/logo-blanco.png")} style={{ width: 760 }} />
        </Pop>
        <Pop at={start + 20}>
          <Chip size={46} bg="#fff" color={Y.pink}>
            Comparte tu causa
          </Chip>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const SFX: { name: "whoosh" | "pop" | "ding" | "click"; at: number; v: number }[] = [
  ...BUBBLE_SPANS.flatMap((s) => [
    { name: "whoosh" as const, at: s.start - 3, v: 0.35 },
    { name: "whoosh" as const, at: s.end - 8, v: 0.25 },
  ]),
  { name: "whoosh", at: graphicSpan("confiable").start - 2, v: 0.3 },
  { name: "whoosh", at: graphicSpan("comparte").start - 2, v: 0.3 },
  { name: "pop", at: 3, v: 0.45 },
  { name: "pop", at: A(2, "foto"), v: 0.35 },
  { name: "pop", at: A(3, "cero"), v: 0.35 },
  { name: "click", at: A(4, "real"), v: 0.6 },
  { name: "pop", at: A(6, "videos"), v: 0.35 },
  { name: "ding", at: A(6, "confianza"), v: 0.35 },
  { name: "pop", at: A(7, "causa"), v: 0.4 },
  { name: "ding", at: A(9, "medicamentos"), v: 0.3 },
  { name: "ding", at: A(9, "tratamiento"), v: 0.3 },
  { name: "ding", at: A(9, "comprobar"), v: 0.3 },
  { name: "pop", at: A(9, "cierta"), v: 0.4 },
  { name: "pop", at: A(10, "clara"), v: 0.4 },
  { name: "pop", at: A(10, "transparente"), v: 0.4 },
  { name: "pop", at: clipAt(11), v: 0.35 },
  { name: "click", at: clipAt(14), v: 0.7 },
  { name: "pop", at: A(16, "link"), v: 0.35 },
  { name: "click", at: A(16, "nadie"), v: 0.55 },
  ...BUBBLES.map((b) => ({ name: "pop" as const, at: A(17, b.word), v: 0.35 })),
  { name: "pop", at: A(18, "subir"), v: 0.4 },
  { name: "pop", at: A(18, "no"), v: 0.4 },
  { name: "pop", at: A(19, "compartir"), v: 0.35 },
  { name: "pop", at: A(19, "para"), v: 0.35 },
  { name: "ding", at: clipAt(20) + 8, v: 0.3 },
  { name: "ding", at: clipAt(21) + 8, v: 0.3 },
  { name: "ding", at: clipAt(22) + 8, v: 0.3 },
  { name: "pop", at: A(23, "historia"), v: 0.4 },
  { name: "whoosh", at: SPEECH_END - 10, v: 0.4 },
  { name: "ding", at: SPEECH_END + 2, v: 0.35 },
];

export const YolappReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: Y.ink, fontFamily: POPPINS }}>
      <Background />
      <Talking />
      <Dudoso />
      <Confiable />
      <Causa />
      <Invisible />
      <Comparte />
      <Recibir />
      <Resumen />
      <Stickers />
      <Captions />
      <Outro />
      <Audio
        src={staticFile("yolapp/musica.wav")}
        volume={(f) => interpolate(f, [0, 10, SPEECH_END - 10, SPEECH_END + 4, TOTAL - 20, TOTAL], [0, 0.07, 0.07, 0.28, 0.28, 0], clamp)}
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={45}>
          <Audio src={staticFile(`sfx/${s.name}.wav`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const YOLAPP_FRAMES = TOTAL;
