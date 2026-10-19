// Scenes of the Fispal "accesos, usuarios y perfiles" reel (parrilla 2,
// reel 4). White canvas with mint and blue gradients; its own motion
// language — avatars, a permission matrix with toggles, a shield, profile
// tags dropping onto users and a padlock — and a card-swipe transition.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Illus } from "../fispal/Illus";
import { C, FONT, MONO, s } from "../fispal/theme";
import { CUE } from "./timeline";

type P = { from: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

const K = {
  mint: "#3FD497",
  mintSoft: "#C8F3E1",
  blue: "#2F6BFF",
  blueSoft: "#D3E1FF",
  ink: "#131313",
  sub: "#5E6480",
  line: "#E6E9F2",
  off: "#C9CDD8",
};

/* ---------- background: white with drifting mint & blue gradients ---------- */
export const MintBlueBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const a = frame / 80;
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1000, height: 1000, left: -380 + Math.sin(a) * 90, top: -320 + Math.cos(a) * 60, borderRadius: "50%", background: `radial-gradient(circle, ${K.mint} 0%, rgba(63,212,151,0) 65%)`, opacity: 0.55 }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, right: -460 + Math.cos(a * 0.9) * 90, top: 420 + Math.sin(a * 0.9) * 90, borderRadius: "50%", background: `radial-gradient(circle, ${K.blue} 0%, rgba(47,107,255,0) 65%)`, opacity: 0.35 }} />
      <div style={{ position: "absolute", width: 900, height: 900, left: -260, bottom: -520, borderRadius: "50%", background: `radial-gradient(circle, ${K.mint} 0%, rgba(63,212,151,0) 65%)`, opacity: 0.35 }} />
      {/* dotted texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(19,19,19,.07) 1.5px, transparent 1.5px)", backgroundSize: "36px 36px", maskImage: "linear-gradient(180deg, #000, transparent 70%)", WebkitMaskImage: "linear-gradient(180deg, #000, transparent 70%)" }} />
    </AbsoluteFill>
  );
};

/* ---------- card-swipe scene wrapper: incoming slides in from the right ---------- */
export const SwipeScene: React.FC<{ duration: number; first?: boolean; last?: boolean; overlap: number; children: React.ReactNode }> = ({ duration, first, last, overlap, children }) => {
  const frame = useCurrentFrame();
  const inP = first ? 1 : interpolate(frame, [0, overlap], [0, 1], { ...clamp, easing: easeOut });
  const outP = last ? 0 : interpolate(frame, [duration - overlap, duration], [0, 1], { ...clamp, easing: (x) => x * x });
  const x = (1 - inP) * 1080 - outP * 520;
  const sc = 1 - 0.12 * outP;
  const rot = (1 - inP) * 6 - outP * 3;
  return <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${sc}) rotate(${rot}deg)`, opacity: 1 - outP, borderRadius: inP < 1 ? 60 : 0 }}>{children}</AbsoluteFill>;
};

/* ---------- pieces ---------- */
const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "#FFFFFF", borderRadius: 32, border: `1px solid ${K.line}`, boxShadow: "0 24px 60px rgba(30,60,160,.12)", fontFamily: FONT, color: K.ink, ...style }}>{children}</div>
);

const PEOPLE = [
  { n: "Ana", i: "A", c: "#2F6BFF" },
  { n: "Luis", i: "L", c: "#20B07E" },
  { n: "Sofía", i: "S", c: "#F2A019" },
  { n: "Marco", i: "M", c: "#EC4C7A" },
  { n: "Eva", i: "E", c: "#7B61FF" },
];

const Avatar: React.FC<{ p: (typeof PEOPLE)[number]; size?: number; ring?: string }> = ({ p, size = 96, ring }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: `linear-gradient(145deg, ${p.c}, ${p.c}CC)`, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.42, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: ring ? `0 0 0 6px #fff, 0 0 0 11px ${ring}` : "0 0 0 5px #fff, 0 10px 24px rgba(30,60,160,.18)" }}>{p.i}</div>
);

const Toggle: React.FC<{ on: number; size?: number }> = ({ on, size = 64 }) => (
  <div style={{ width: size, height: size * 0.56, borderRadius: size, background: on > 0.5 ? K.mint : K.off, position: "relative", transition: "none" }}>
    <div style={{ position: "absolute", top: size * 0.06, left: size * 0.06 + on * size * 0.44, width: size * 0.44, height: size * 0.44, borderRadius: size, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.2)" }} />
  </div>
);

const Lock: React.FC<{ size: number; closed: number; color?: string }> = ({ size, closed, color = K.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" transform={`translate(${(1 - closed) * 2.5} ${-(1 - closed) * 3})`} />
    <rect x={5} y={11} width={14} height={10} rx={2.5} fill={color} />
    <circle cx={12} cy={16} r={1.6} fill="#fff" />
  </svg>
);

const useSpr = (at: number, damping = 12, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

/* ---------- 1. Hay algo que no todos en Finanzas deberían poder hacer ---------- */
export const S1Algo: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const team = useSpr(0, 13, 150);
  const secret = useSpr(L(CUE.hacer) - 6, 11, 160);
  const q = useSpr(L(CUE.sabes) - 2, 7, 170);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, right: 90, top: 330, opacity: Math.min(1, team * 1.5), transform: `translateY(${(1 - team) * 60}px)` }}>
        <Card style={{ padding: "34px 40px" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", color: K.sub }}>EQUIPO · FINANZAS</div>
          <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
            {PEOPLE.map((p, i) => {
              const a = spring({ frame: frame - 6 - i * 4, fps, config: { damping: 9, stiffness: 190 } });
              return (
                <div key={p.n} style={{ transform: `scale(${a}) translateY(${Math.sin((frame + i * 9) / 12) * 4}px)` }}>
                  <Avatar p={p} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      {/* the hidden action */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 760, opacity: Math.min(1, secret * 1.5), transform: `scale(${0.7 + 0.3 * secret})` }}>
        <Card style={{ padding: "34px 36px", display: "flex", alignItems: "center", gap: 26, border: `3px dashed ${K.blue}` }}>
          <div style={{ width: 96, height: 96, borderRadius: 28, background: K.blueSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={58} closed={1} color={K.blue} />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {[1, 0.7].map((w, i) => (
              <div key={i} style={{ height: 26, width: `${w * 100}%`, borderRadius: 13, background: `linear-gradient(90deg, ${K.line}, #F4F6FB, ${K.line})`, backgroundSize: "200% 100%", backgroundPosition: `${(frame * 4) % 200}% 0` }} />
            ))}
          </div>
        </Card>
      </div>
      {frame >= L(CUE.sabes) - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", transform: `scale(${q}) rotate(${Math.sin(frame / 5) * 6}deg)` }}>
          <div style={{ width: 170, height: 170, borderRadius: 85, background: K.mint, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 120, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(63,212,151,.45)" }}>?</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 2. No todos necesitan… — a permission matrix filling row by row ---------- */
const ROWS: { k: keyof typeof CUE; label: string; on: number[] }[] = [
  { k: "administrar", label: "Administrar usuarios", on: [1, 0, 0, 0] },
  { k: "consultar", label: "Consultar CFDI", on: [1, 1, 0, 1] },
  { k: "funciones", label: "Reportes y descargas", on: [1, 0, 1, 0] },
];

export const S2Matriz: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const card = useSpr(0, 13, 150);
  const rowAt = [L(CUE.no1) + 4, L(CUE.no2) + 2, L(CUE.no3) + 2];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, top: 320, opacity: Math.min(1, card * 1.5), transform: `translateY(${(1 - card) * 60}px)` }}>
        <Card style={{ padding: "34px 30px" }}>
          {/* header with people */}
          <div style={{ display: "flex", alignItems: "center", paddingBottom: 24, borderBottom: `2px solid ${K.line}` }}>
            <div style={{ width: 330, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.08em", color: K.sub }}>PERMISOS</div>
            {PEOPLE.slice(0, 4).map((p) => (
              <div key={p.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <Avatar p={p} size={72} />
                <span style={{ fontWeight: 600, fontSize: 22, color: K.sub }}>{p.n}</span>
              </div>
            ))}
          </div>
          {ROWS.map((r, ri) => {
            const at = rowAt[ri];
            const rp = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 160 } });
            const active = frame >= at - 2;
            return (
              <div key={r.k} style={{ display: "flex", alignItems: "center", padding: "30px 0", borderBottom: ri < 2 ? `1px solid ${K.line}` : "none", opacity: active ? Math.min(1, rp * 1.5) : 0.15, transform: `translateX(${(1 - rp) * -40}px)` }}>
                <div style={{ width: 330, fontWeight: 700, fontSize: 32, lineHeight: 1.15 }}>{r.label}</div>
                {r.on.map((v, ci) => {
                  const flip = interpolate(frame, [at + 6 + ci * 4, at + 12 + ci * 4], [0, 1], { ...clamp, easing: easeOut });
                  return (
                    <div key={ci} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <Toggle on={v ? flip : 0} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Card>
      </div>
      <Illus name="colaboradores" at={4} x={900} y={250} size={230} />
    </AbsoluteFill>
  );
};

/* ---------- 3. Los accesos forman parte del control — a shield assembles ---------- */
export const S3Escudo: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const build = interpolate(frame, [L(CUE.accesos) - 10, L(CUE.control) + 6], [0, 1], { ...clamp, easing: easeOut });
  const lock = useSpr(L(CUE.control) - 2, 9, 170);
  const len = 1500;
  const keys = ["Usuarios", "Perfiles", "Funciones"];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 260 }}>
        <defs>
          <linearGradient id="sh" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={K.mint} />
            <stop offset="1" stopColor={K.blue} />
          </linearGradient>
        </defs>
        <path d="M540 90 L820 200 V470 C820 650 700 760 540 840 C380 760 260 650 260 470 V200 Z" fill="url(#sh)" opacity={0.14 * build} />
        <path d="M540 90 L820 200 V470 C820 650 700 760 540 840 C380 760 260 650 260 470 V200 Z" fill="none" stroke="url(#sh)" strokeWidth={16} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - build)} />
      </svg>
      <div style={{ position: "absolute", left: 540 - 110, top: 260 + 330, width: 220, height: 220, borderRadius: 60, background: "#fff", boxShadow: "0 24px 60px rgba(30,60,160,.18)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lock})` }}>
        <Lock size={130} closed={interpolate(frame, [L(CUE.control) + 4, L(CUE.control) + 12], [0, 1], clamp)} color={K.blue} />
      </div>
      {keys.map((k, i) => {
        const at = L(CUE.accesos) + i * 6;
        const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: easeOut });
        const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 3) + frame / 60;
        const r = 400;
        return (
          <div key={k} style={{ position: "absolute", left: 540 + Math.cos(ang) * r * p, top: 720 + Math.sin(ang) * r * 0.8 * p, transform: "translate(-50%, -50%)", opacity: p }}>
            <div style={{ background: "#fff", borderRadius: 999, padding: "16px 30px", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: K.ink, boxShadow: "0 14px 34px rgba(30,60,160,.15)", border: `2px solid ${K.mintSoft}` }}>{k}</div>
          </div>
        );
      })}
      <Illus name="credencial" at={L(CUE.control) + 4} x={880} y={330} size={250} />
    </AbsoluteFill>
  );
};

/* ---------- 4. Fispal: usuarios y perfiles + funciones según perfil ---------- */
const PROFILES = [
  { label: "Administrador", c: K.blue },
  { label: "Contador", c: "#20B07E" },
  { label: "Consulta", c: "#F2A019" },
];
const FUNCS: { label: string; on: boolean }[] = [
  { label: "Consultar CFDI", on: true },
  { label: "Descargar XML y PDF", on: true },
  { label: "Reportes", on: true },
  { label: "Administrar usuarios", on: false },
  { label: "Configuración", on: false },
];

export const S4Perfiles: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const panel = useSpr(0, 13, 150);
  const tagAt = L(CUE.perfiles) - 8;
  const swap = interpolate(frame, [L(CUE.puedes) - 6, L(CUE.puedes) + 10], [0, 1], { ...clamp, easing: easeOut });
  const fAt = L(CUE.funciones2);
  return (
    <AbsoluteFill>
      {/* users list with profile tags dropping in */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, opacity: Math.min(1, panel * 1.5) * (1 - 0.25 * swap), transform: `translateY(${(1 - panel) * 60 - swap * 40}px) scale(${1 - 0.18 * swap})`, transformOrigin: "50% 0" }}>
        <Card style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 20, borderBottom: `2px solid ${K.line}` }}>
            <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 40 }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: K.sub, letterSpacing: "0.08em", marginLeft: "auto" }}>USUARIOS Y PERFILES</span>
          </div>
          {PEOPLE.slice(0, 3).map((p, i) => {
            const t = spring({ frame: frame - tagAt - i * 5, fps, config: { damping: 10, stiffness: 180 } });
            const pr = PROFILES[i];
            return (
              <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 0", borderBottom: i < 2 ? `1px solid ${K.line}` : "none" }}>
                <Avatar p={p} size={70} />
                <span style={{ fontWeight: 700, fontSize: 34 }}>{p.n}</span>
                <div style={{ marginLeft: "auto", transform: `translateY(${(1 - t) * -120}px) scale(${0.6 + 0.4 * t})`, opacity: frame >= tagAt + i * 5 ? 1 : 0 }}>
                  <span style={{ fontWeight: 700, fontSize: 26, color: pr.c, background: `${pr.c}1A`, border: `2px solid ${pr.c}55`, borderRadius: 999, padding: "10px 22px" }}>{pr.label}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
      {/* profile "Contador": functions switched on/off */}
      {swap > 0 && (
        <div style={{ position: "absolute", left: 110, right: 110, top: 760, opacity: swap, transform: `translateY(${(1 - swap) * 120}px)` }}>
          <Card style={{ padding: "30px 34px", border: `3px solid #20B07E` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: K.sub, letterSpacing: "0.08em" }}>PERFIL</span>
              <span style={{ fontWeight: 800, fontSize: 36, color: "#20B07E" }}>Contador</span>
            </div>
            {FUNCS.map((f, i) => {
              const at = fAt + i * 5;
              const on = f.on ? interpolate(frame, [at, at + 6], [0, 1], clamp) : 0;
              const lit = frame >= at;
              return (
                <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", opacity: lit ? 1 : 0.35 }}>
                  <span style={{ fontWeight: 600, fontSize: 30, color: f.on || !lit ? K.ink : K.sub, textDecoration: !f.on && lit ? "line-through" : "none" }}>{f.label}</span>
                  <Toggle on={on} size={70} />
                </div>
              );
            })}
          </Card>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 5. La información fiscal también necesita control de acceso ---------- */
export const S5Candado: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const pop = useSpr(0, 10, 150);
  const close = interpolate(frame, [L(CUE.acceso) - 6, L(CUE.acceso) + 2], [0, 1], { ...clamp, easing: (x) => x * x });
  const ok = useSpr(L(CUE.acceso) + 2, 9, 180);
  const ripple = frame > L(CUE.acceso) ? ((frame - L(CUE.acceso)) % 30) / 30 : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 260, top: 420, width: 520, height: 520, transform: `scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop * 1.5) }}>
        {ripple > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `6px solid ${K.mint}`, transform: `scale(${1 + ripple * 0.4})`, opacity: 1 - ripple }} />}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `linear-gradient(145deg, ${K.mint}, ${K.blue})`, boxShadow: "0 40px 90px rgba(47,107,255,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={300} closed={close} color="#FFFFFF" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", transform: `scale(${ok})` }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 36px", borderRadius: 999 }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: K.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={28} height={28} viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 36 }}>Acceso controlado</span>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 6. CTA ---------- */
export const S6Cta: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const logo = useSpr(4, 11, 150);
  const btn = useSpr(Math.max(8, L(CUE.gratis) - 4), 8, 170);
  const url = useSpr(L(CUE.url), 12, 170);
  const shine = interpolate(frame % 50, [0, 30], [-120, 520], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Illus name="colaboradores" at={8} x={180} y={330} size={230} phase={0.5} />
      <Illus name="credencial" at={12} x={900} y={320} size={230} phase={2} />
      <Illus name="esfera" at={2} x={540} y={430} size={420} />
      <div style={{ position: "absolute", top: 700, transform: `scale(${0.85 + 0.15 * logo})`, opacity: logo }}>
        <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", top: 1010, transform: `scale(${btn})` }}>
        <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${K.mint}, ${K.blue})`, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 52, borderRadius: 999, padding: "30px 74px", boxShadow: "0 20px 50px rgba(47,107,255,.35)" }}>
          Únete gratis →
          <div style={{ position: "absolute", top: 0, bottom: 0, left: shine, width: 90, background: "linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)", transform: "skewX(-20deg)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 1210, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.text, background: "#fff", border: `1px solid ${K.line}`, borderRadius: 999, padding: "14px 34px", boxShadow: "0 10px 26px rgba(30,60,160,.12)" }}>fispal.mx</div>
      </div>
    </AbsoluteFill>
  );
};
