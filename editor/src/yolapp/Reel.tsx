// Yolapp reel (1080 × 1920, 30 fps): the talking-head take cut down to the
// good lines, punch-in zooms on every cut, word-by-word captions, stickers on
// the key phrases and brand cards on the lower third. The video stays full
// screen the whole time; nothing is drawn over the face (y ≈ 380–1150).
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { POPPINS, poppinsReady } from "../theme";
import { CLIPS, clipAt, GRAD, GRAPHICS, GraphicId, graphicSpan, isKeyword, SPEECH_END, TAIL_END, TOTAL, W, Word, wordAt, WORDS, Y } from "./datos";
import { Card, Check, Chip, clamp, Counter, EASE, EyeIcon, Glyph, Heart, ImageIcon, LinkIcon, PlayIcon, Pop, Stars, Sticker, Tick, useShake } from "./parts";

const SRC = "yolapp/crudo.mp4";
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
const zoomFor = (i: number) => (inGraphic(i) ? 1.0 : i === 14 ? 1.3 : i % 2 === 0 ? 1.0 : 1.14);
const Talking: React.FC = () => {
  const frame = useCurrentFrame();
  const clip = CLIPS.find((c) => frame >= c.at && frame < c.at + c.len) ?? CLIPS[CLIPS.length - 1];
  const local = Math.min(1.5, (frame - clip.at) / clip.len);
  // hook: start tight and pull out; every cut drifts in slowly
  const hook = clip.i === 0 ? interpolate(frame, [0, 14], [0.28, 0], { ...clamp, easing: EASE }) : 0;
  const scale = zoomFor(clip.i) + 0.03 * local + hook;
  const tail = Math.round((TAIL_END - CLIPS[CLIPS.length - 1].to) * 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", transform: useShake(clipAt(14), 12, 18) }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 36%" }}>
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
          <OffthreadVideo src={staticFile(SRC)} trimBefore={Math.round(CLIPS[CLIPS.length - 1].to * 30)} muted style={{ width: W, height: 1920, objectFit: "cover" }} />
        </Sequence>
        <Sequence from={SPEECH_END + tail} layout="none">
          <Img src={staticFile("yolapp/final.jpg")} style={{ width: W, height: 1920, objectFit: "cover" }} />
        </Sequence>
      </AbsoluteFill>
      {/* soft top and bottom shade so captions and cards read */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(26,18,64,.45) 0%, rgba(26,18,64,0) 20%, rgba(26,18,64,0) 58%, rgba(26,18,64,.55) 100%)" }} />
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
  return pages.map((ws, i) => ({
    words: ws,
    start: Math.floor(ws[0].start),
    // a silent tail (e.g. the money gesture) shows no caption
    end: Math.min(i + 1 < pages.length ? Math.floor(pages[i + 1][0].start) : SPEECH_END, CLIPS[ws[0].clip].at + CLIPS[ws[0].clip].speech + 4),
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
    <div style={{ position: "absolute", left: 70, right: 70, top: page.top ? 150 : 1250, height: page.top ? 230 : 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
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

/* ---------- stickers on the talking-head shots (above the head) ---------- */
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
        // rise along the sides so they never cross the face
        const side = i % 2 === 0 ? 40 + (i % 3) * 40 : 830 + (i % 3) * 40;
        const y = interpolate(t, [0, 40], [1900, 600 + (i % 3) * 140], { ...clamp, easing: EASE });
        const x = side + Math.sin(t / 6 + i) * 24;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: interpolate(t, [30, 44], [1, 0], clamp), transform: `rotate(${(i % 2 ? 1 : -1) * 12}deg)` }}>
            <Heart size={70 + (i % 3) * 22} color={[Y.pink, Y.coral, "#fff"][i % 3]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Money gesture: coins burst up the sides, away from the face.
const CASH = clipAt(19) + CLIPS[19].speech + 2;
const Coins: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 10 }, (_, i) => {
        const t = frame - at - (i % 5) * 2;
        if (t < 0) return null;
        const left = i % 2 === 0;
        const x0 = left ? 120 + (i % 3) * 60 : 870 - (i % 3) * 60;
        const x = x0 + (left ? -1 : 1) * t * (2 + (i % 3));
        const y = 1500 - t * (28 - (i % 4) * 3) + t * t * 0.9;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 86,
              height: 86,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #FFF3B0, #FFC531 45%, #E09A00)",
              border: "5px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: POPPINS,
              fontWeight: 800,
              fontSize: 46,
              color: "#9A6400",
              opacity: interpolate(t, [22, 30], [1, 0], clamp),
              transform: `rotate(${t * (left ? -14 : 14)}deg) scale(${0.7 + (i % 3) * 0.15})`,
              boxShadow: "0 10px 24px rgba(26,18,64,.35)",
            }}
          >
            $
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
        <Sticker at={A(10, "clara")} text="Clara" bg={GRAD.cool} rotate={-5} top={150} />
        <Sticker at={A(10, "transparente")} text="+ transparente" bg={GRAD.warm} rotate={3} top={270} size={66} />
      </Between>
      <Between from={clipAt(11)} to={clipAt(14)}>
        <Sticker at={clipAt(11)} text="= más fácil ayudarte" bg={GRAD.main} size={58} rotate={-3} />
        <Hearts at={A(13, "ayudarte") - 4} />
      </Between>
      <Between from={aguas} to={clipAt(15)}>
        <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [aguas, aguas + 6], [0.75, 0], clamp) }} />
        <Sticker at={aguas + 1} text="¡Aguas!" bg={`linear-gradient(135deg, #FFB800, ${Y.coral})`} size={110} rotate={-6} top={170} />
      </Between>
      <Between from={clipAt(18)} to={clipAt(19)}>
        <Sticker at={A(18, "subir")} text="Subir" bg={GRAD.cool} rotate={-4} top={150} />
        <Sticker at={A(18, "no")} text="≠ recaudar" bg={GRAD.warm} rotate={3} top={275} size={70} />
      </Between>
      <Between from={CASH - 2} to={clipAt(20)}>
        <Sticker at={CASH} text="¡Ka-ching!" bg="linear-gradient(135deg, #FFD54A, #FF9F1C)" size={96} rotate={-5} top={190} />
        <Coins at={CASH} />
      </Between>
      <Between from={clipAt(23)} to={SPEECH_END}>
        <Sticker at={A(23, "historia")} text="Tu historia" bg={GRAD.warm} rotate={-3} />
      </Between>
    </>
  );
};

/* ---------- brand cards on the lower third ---------- */
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

const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16 };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14, flex: 1, minWidth: 0 };
const Badge: React.FC<{ at: number; text: string; style?: React.CSSProperties }> = ({ at, text, style }) => (
  <Pop at={at} rotate={-4} style={{ position: "absolute", right: -24, bottom: -40, ...style }}>
    <Chip size={34} bg={Y.ok} style={{ border: "6px solid #fff", boxShadow: "0 14px 40px rgba(20,195,142,.5)" }}>
      <Tick size={36} />
      {text}
    </Chip>
  </Pop>
);

const Dudoso: React.FC = () => {
  const real = A(4, "real");
  return (
    <Scene id="dudoso">
      <div style={{ transform: useShake(real + 3, 12, 16), position: "relative" }}>
        <Card style={{ width: 920, ...row, gap: 28, padding: 28 }}>
          <div style={{ position: "relative", width: 270, height: 270, flexShrink: 0, borderRadius: 26, background: "#EEEBF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImageIcon size={110} />
            <Pop at={A(2, "foto")} style={{ position: "absolute", left: 14, top: 14 }}>
              <Chip size={22} bg={Y.ink}>
                1 foto
              </Chip>
            </Pop>
          </div>
          <div style={col}>
            <div>
              <Chip size={24}>Vendedor A</Chip>
            </div>
            <div style={{ height: 28, width: "85%", borderRadius: 14, background: "#ECEAF4" }} />
            <div style={{ height: 22, width: "55%", borderRadius: 11, background: "#F2F0F8" }} />
            <Pop at={A(3, "cero")} style={{ ...row, flexWrap: "wrap", gap: 10 }}>
              <Stars from={0} count={0} size={46} />
              <span style={{ fontSize: 36, fontWeight: 800, color: Y.coral }}>0 reseñas</span>
            </Pop>
          </div>
        </Card>
        <Pop at={real} from={2.4} rotate={-10} style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}>
          <div style={{ border: `10px solid ${Y.pink}`, color: Y.pink, background: "rgba(255,255,255,.94)", borderRadius: 26, padding: "6px 34px", fontFamily: POPPINS, fontWeight: 800, fontSize: 96, letterSpacing: "0.02em" }}>
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
      <Card style={{ width: 920, ...row, gap: 28, padding: 28, position: "relative" }}>
        <div style={{ position: "relative", width: 290, height: 290, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {TILES.map((t, i) => (
            <Pop key={t.label} at={fotos + i * 5} style={{ borderRadius: 20, background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <ImageIcon size={46} color="#fff" />
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>{t.label}</span>
            </Pop>
          ))}
          <Pop at={A(6, "videos")} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PlayIcon size={100} />
          </Pop>
        </div>
        <div style={col}>
          <div style={{ ...row, gap: 10, flexWrap: "wrap" }}>
            <Chip size={24} bg={Y.blue}>
              Vendedor B
            </Chip>
            <Pop at={A(5, "ángulos")}>
              <Chip size={24} bg="#E5F8F7" color="#058C88">
                +4 fotos
              </Chip>
            </Pop>
          </div>
          <Stars from={A(6, "reseñas")} step={3} size={50} />
          <Pop at={A(6, "reseñas") + 10}>
            <span style={{ fontSize: 34, fontWeight: 800 }}>4.9 · 128 reseñas</span>
          </Pop>
        </div>
        <Badge at={A(6, "confianza")} text="Da confianza" />
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
      <Card style={{ width: 920, ...row, gap: 26, padding: 28, position: "relative" }}>
        <div style={{ width: 260, height: 290, flexShrink: 0, borderRadius: 26, background: GRAD.deep, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Pop at={A(8, "video")}>
            <PlayIcon size={100} />
          </Pop>
          <Pop at={A(8, "historia")}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 34 }}>Tu historia</span>
          </Pop>
        </div>
        <div style={col}>
          <Img src={staticFile(LOGO)} style={{ height: 50, alignSelf: "flex-start" }} />
          {items.map(([label, at]) => (
            <div key={label} style={{ ...row, gap: 12, opacity: frame >= at ? 1 : 0.35 }}>
              <Check at={at} size={46} />
              <span style={{ fontSize: 31, fontWeight: 600, lineHeight: 1.15 }}>{label}</span>
            </div>
          ))}
        </div>
        <Badge at={A(9, "cierta")} text="Causa verificada" />
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
        <Card style={{ width: 920, padding: 30, filter: `grayscale(${grey})`, opacity: 1 - grey * 0.2 }}>
          <div style={{ ...row, justifyContent: "space-between" }}>
            <Img src={staticFile(LOGO)} style={{ height: 50 }} />
            <span style={{ fontSize: 40, fontWeight: 800 }}>Causa completa</span>
            <span style={{ fontSize: 34, fontWeight: 800, color: Y.ok }}>{Math.round(fill)}%</span>
          </div>
          <div style={{ height: 24, borderRadius: 12, background: "#EEEBF6", marginTop: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${fill}%`, background: GRAD.cool, borderRadius: 12 }} />
          </div>
          <div style={{ ...row, gap: 26, marginTop: 20 }}>
            {["Video", "Fotos", "Pruebas"].map((t, i) => (
              <div key={t} style={{ ...row, gap: 10 }}>
                <Check at={start + 10 + i * 5} size={40} />
                <span style={{ fontSize: 30, fontWeight: 600 }}>{t}</span>
              </div>
            ))}
          </div>
          <Pop at={A(16, "link")} style={{ marginTop: 22 }}>
            <div style={{ ...row, background: GRAD.main, color: "#fff", borderRadius: 999, padding: "14px 28px", fontSize: 34, fontWeight: 800, alignSelf: "flex-start", width: "fit-content" }}>
              <LinkIcon size={40} />
              yolapp.com/tu-causa
            </div>
          </Pop>
        </Card>
        <Pop at={nadie} rotate={4} style={{ position: "absolute", right: -10, bottom: -50 }}>
          <div style={{ ...row, background: "#fff", borderRadius: 999, padding: "14px 34px", border: `8px solid ${Y.pink}`, boxShadow: "0 18px 50px rgba(26,18,64,.4)" }}>
            <EyeIcon size={60} crossed />
            <span style={{ fontSize: 54, fontWeight: 800, color: Y.pink }}>0 visitas</span>
          </div>
        </Pop>
      </div>
    </Scene>
  );
};

const BUBBLES = [
  { word: "familia", label: "Familia", glyph: "casa", bg: GRAD.warm },
  { word: "amigos", label: "Amigos", glyph: "amigos", bg: GRAD.cool },
  { word: "redes", label: "Redes", glyph: "redes", bg: GRAD.deep },
  { word: "grupo", label: "Grupos", glyph: "grupo", bg: GRAD.warm },
  { word: "donde", label: "¡Donde sea!", glyph: "mundo", bg: GRAD.cool },
] as const;
const Comparte: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = graphicSpan("comparte");
  const first = A(17, "familia");
  return (
    <Scene id="comparte">
      <div style={{ ...row, gap: 18, marginBottom: 34 }}>
        <Pop at={start + 4}>
          <div style={{ ...row, gap: 12, background: "#fff", borderRadius: 999, padding: "16px 30px", boxShadow: `0 0 0 ${8 + Math.sin(frame / 4) * 5}px rgba(255,255,255,.35), 0 14px 40px rgba(26,18,64,.35)` }}>
            <LinkIcon size={46} color={Y.pink} />
            <span style={{ fontSize: 36, fontWeight: 800, color: Y.ink }}>yolapp.com/tu-causa</span>
          </div>
        </Pop>
        <Pop at={first - 6}>
          <div style={{ ...row, gap: 10, background: Y.ink, borderRadius: 999, padding: "16px 28px" }}>
            <EyeIcon size={44} color="#5FF5EC" />
            <Counter from={0} to={1250} start={first} end={end - 4} style={{ fontSize: 38, fontWeight: 800, color: "#fff" }} />
          </div>
        </Pop>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {BUBBLES.map((b) => (
          <Pop key={b.word} at={A(17, b.word)} style={{ width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: b.bg, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(26,18,64,.35)" }}>
              <Glyph name={b.glyph} size={70} />
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

const Recibir: React.FC = () => {
  const frame = useCurrentFrame();
  const { end } = graphicSpan("recibir");
  const fill = interpolate(frame, [A(19, "para"), end - 4], [0, 78], { ...clamp, easing: EASE });
  const step: React.CSSProperties = { width: 86, height: 86, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 46 };
  return (
    <Scene id="recibir">
      <Pop at={A(19, "compartir")}>
        <Card style={{ width: 860, ...row, gap: 24, padding: "24px 30px" }}>
          <div style={{ ...step, background: GRAD.main }}>1</div>
          <div>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Comparte tu link</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: Y.muted }}>yolapp.com/tu-causa</div>
          </div>
        </Card>
      </Pop>
      <Pop at={A(19, "primer")} style={{ margin: "14px 0" }}>
        <Chip size={30} bg={Y.pink}>
          Primer paso
        </Chip>
      </Pop>
      <Pop at={A(19, "para")}>
        <Card style={{ width: 860, ...row, gap: 24, padding: "24px 30px" }}>
          <div style={{ ...step, background: GRAD.warm }}>
            <Heart size={50} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Recibe apoyo</div>
            <div style={{ height: 24, borderRadius: 12, background: "#EEEBF6", marginTop: 12, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${fill}%`, background: GRAD.warm, borderRadius: 12 }} />
            </div>
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
      <Pop at={start + 2} style={{ marginBottom: 16 }}>
        <Chip size={30} bg="#fff" color={Y.purple}>
          Tu checklist
        </Chip>
      </Pop>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map(([label, at], i) => (
          <Pop key={label} at={at} from={0.6}>
            <Card style={{ width: 820, ...row, gap: 24, padding: "18px 28px", borderRadius: 34 }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: [GRAD.main, GRAD.cool, GRAD.warm][i], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 40 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, flex: 1 }}>{label}</div>
              <Check at={at + 8} size={54} />
            </Card>
          </Pop>
        ))}
      </div>
    </Scene>
  );
};

/* ---------- outro: gradient logo over the video, on the lower third ---------- */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const start = SPEECH_END - 4;
  if (frame < start) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "column", gap: 40, paddingTop: 1220 }}>
      <Pop at={start} from={0.3} rotate={-3}>
        <Img src={staticFile(LOGO)} style={{ width: 760 }} />
      </Pop>
      <Pop at={start + 12}>
        <Chip size={42} bg={GRAD.warm} style={{ border: "6px solid #fff", boxShadow: "0 14px 40px rgba(26,18,64,.4)" }}>
          Comparte tu causa
        </Chip>
      </Pop>
      <AbsoluteFill style={{ opacity: interpolate(frame, [TOTAL - 8, TOTAL], [0, 1], clamp), background: "#000" }} />
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const SFX: { name: "whoosh" | "pop" | "ding" | "click" | "cash"; at: number; v: number }[] = [
  { name: "cash", at: CASH, v: 0.6 },
  ...SPANS.flatMap((s) => [
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
  { name: "whoosh", at: SPEECH_END - 8, v: 0.4 },
  { name: "ding", at: SPEECH_END + 8, v: 0.35 },
];

export const YolappReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: POPPINS }}>
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
        volume={(f) => interpolate(f, [0, 10, SPEECH_END - 10, SPEECH_END + 4, TOTAL - 15, TOTAL], [0, 0.07, 0.07, 0.28, 0.28, 0], clamp)}
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
