// Flat illustrations for the Yolapp reel 3 cards, drawn in the brand palette.
import React from "react";
import { Y } from "./datos";

export const Perro: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#FFE7C2" />
    {/* ears */}
    <path d="M22 30 C10 34 10 58 20 66 C26 60 28 44 30 34 Z" fill="#B9773A" />
    <path d="M78 30 C90 34 90 58 80 66 C74 60 72 44 70 34 Z" fill="#B9773A" />
    {/* head */}
    <ellipse cx="50" cy="52" rx="27" ry="28" fill="#E2A15C" />
    <ellipse cx="50" cy="64" rx="15" ry="12" fill="#FFE1BC" />
    <circle cx="40" cy="48" r="4" fill={Y.ink} />
    <circle cx="60" cy="48" r="4" fill={Y.ink} />
    <circle cx="41.3" cy="46.6" r="1.3" fill="#fff" />
    <circle cx="61.3" cy="46.6" r="1.3" fill="#fff" />
    <ellipse cx="50" cy="58" rx="5.5" ry="4" fill={Y.ink} />
    <path d="M50 62 v4 M44 66 q6 5 12 0" stroke={Y.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M47 68 q3 9 6 0 z" fill={Y.pink} />
  </svg>
);

export const Comida: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#E3F7F5" />
    {/* steam */}
    <path d="M38 20 q-5 6 0 12 q5 6 0 12 M50 16 q-5 6 0 12 q5 6 0 12 M62 20 q-5 6 0 12 q5 6 0 12" stroke="#9FD9D4" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* food */}
    <circle cx="38" cy="54" r="10" fill="#FFB800" />
    <circle cx="52" cy="50" r="11" fill={Y.coral} />
    <circle cx="64" cy="55" r="9" fill="#7BD148" />
    <path d="M52 39 q3 -5 7 -4" stroke="#3E8E2A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* bowl */}
    <path d="M20 58 h60 c0 18 -13 28 -30 28 s-30 -10 -30 -28 z" fill={Y.blue} />
    <path d="M20 58 h60" stroke="#0563C0" strokeWidth="4" strokeLinecap="round" />
    <path d="M30 66 c4 8 12 12 20 12" stroke="rgba(255,255,255,.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export const Hospital: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#FFE6EF" />
    <rect x="22" y="34" width="56" height="50" rx="4" fill="#fff" stroke="#F3C6D6" strokeWidth="2" />
    <rect x="36" y="20" width="28" height="22" rx="4" fill="#fff" stroke="#F3C6D6" strokeWidth="2" />
    <path d="M50 24 v14 M43 31 h14" stroke={Y.pink} strokeWidth="5" strokeLinecap="round" />
    {[0, 1, 2].map((c) => [0, 1].map((r) => <rect key={`${c}${r}`} x={29 + c * 15} y={44 + r * 13} width="9" height="8" rx="1.5" fill="#9CC7F5" />))}
    <rect x="44" y="70" width="12" height="14" rx="2" fill={Y.indigo} />
  </svg>
);

export const Moneda: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="54" r="40" fill="#E09A00" />
    <circle cx="50" cy="48" r="40" fill="#FFC531" />
    <circle cx="50" cy="48" r="31" fill="none" stroke="#FFE38A" strokeWidth="4" />
    <text x="50" y="62" textAnchor="middle" fontFamily="Poppins" fontWeight="800" fontSize="40" fill="#9A6400">
      $
    </text>
  </svg>
);

// A social post on a phone, with a share arrow.
export const Publicacion: React.FC<{ size?: number; shared?: number }> = ({ size = 220, shared = 0 }) => (
  <svg width={size * 0.72} height={size} viewBox="0 0 72 100">
    <rect x="2" y="2" width="68" height="96" rx="10" fill={Y.ink} />
    <rect x="6" y="9" width="60" height="82" rx="5" fill="#fff" />
    <circle cx="13" cy="16" r="4" fill={Y.purple} />
    <rect x="20" y="13" width="24" height="3" rx="1.5" fill="#D9D6E8" />
    <rect x="20" y="18" width="14" height="2.5" rx="1.2" fill="#ECEAF4" />
    <rect x="9" y="24" width="54" height="38" rx="3" fill="#FFE7C2" />
    <path d="M9 62 L25 44 L36 54 L45 46 L63 62 Z" fill="#E2A15C" />
    <circle cx="52" cy="33" r="5" fill="#FFB800" />
    {/* actions */}
    <path d="M14 74 c-3 -4 -8 -1 -5 3 l5 5 l5 -5 c3 -4 -2 -7 -5 -3 z" fill={Y.pink} />
    <g transform={`translate(52 77) scale(${1 + 0.35 * Math.sin(Math.PI * shared)})`}>
      <circle r="9" fill={shared > 0 ? Y.blue : "#ECEAF4"} />
      <path d="M-4 3 L4 -3 M4 -3 h-4 M4 -3 v4" stroke={shared > 0 ? "#fff" : Y.muted} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
    <rect x="9" y="85" width="40" height="2.5" rx="1.2" fill="#ECEAF4" />
  </svg>
);
