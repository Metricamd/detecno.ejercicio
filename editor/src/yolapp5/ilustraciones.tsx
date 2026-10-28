// Soft line illustrations for the emotional reel: white strokes, pink heart
// accents. `draw` (0 → 1) traces the strokes in.
import React from "react";
import { E } from "./datos";

const line = (draw: number, w = 3) =>
  ({
    fill: "none",
    stroke: "#fff",
    strokeWidth: w,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - draw,
  }) as const;

export const Corazon: React.FC<{
  size?: number;
  fill?: string;
  beat?: number;
}> = ({ size = 80, fill = E.rose, beat = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{
      transform: `scale(${1 + 0.12 * beat})`,
      filter: "drop-shadow(0 0 12px rgba(255,92,138,.6))",
    }}
  >
    <path
      d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3.1 1.7-1.9 3.1-3.1 5.3-3.1 3.7 0 5.8 3.7 4.3 7.2C19.5 16.4 12 21 12 21z"
      fill={fill}
    />
  </svg>
);

// Two cupped hands holding a heart.
export const Manos: React.FC<{
  size?: number;
  draw?: number;
  beat?: number;
}> = ({ size = 200, draw = 1, beat = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      {...line(draw)}
      d="M10 58 C18 58 26 62 32 70 C38 78 46 82 50 82 C54 82 62 78 68 70 C74 62 82 58 90 58"
    />
    <path
      {...line(draw)}
      d="M10 58 C10 70 18 84 32 90 L68 90 C82 84 90 70 90 58"
    />
    <path
      {...line(draw, 2.5)}
      d="M20 60 C22 52 26 48 30 50 M80 60 C78 52 74 48 70 50"
    />
    <g
      transform={`translate(50 46) scale(${(1 + 0.1 * beat) * Math.min(1, draw * 1.4)}) translate(-14 -14)`}
    >
      <path
        d="M14 26s-9-5.5-11.5-11.2C1 10.6 3.5 6 8 6c2.6 0 4.3 1.4 6 3.7C15.7 7.4 17.4 6 20 6c4.5 0 7 4.6 5.5 8.8C23 20.5 14 26 14 26z"
        fill={E.rose}
      />
    </g>
  </svg>
);

// Two people hugging.
export const Abrazo: React.FC<{ size?: number; draw?: number }> = ({
  size = 200,
  draw = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle {...line(draw)} cx="38" cy="28" r="11" />
    <circle {...line(draw)} cx="62" cy="30" r="11" />
    <path {...line(draw)} d="M20 92 C20 66 28 48 40 46 C46 45 50 50 50 56" />
    <path {...line(draw)} d="M80 92 C80 66 72 50 60 48 C54 47 50 52 50 58" />
    <path {...line(draw, 2.5)} d="M30 62 C40 70 60 70 72 60" />
    <g
      transform={`translate(50 74) scale(${Math.min(1, draw * 1.4)}) translate(-8 -8)`}
    >
      <path
        d="M8 15s-5-3-6.4-6.3C.6 6.3 2 3.6 4.6 3.6c1.5 0 2.4.8 3.4 2.1 1-1.3 1.9-2.1 3.4-2.1 2.6 0 4 2.7 3 5.1C13 12 8 15 8 15z"
        fill={E.rose}
      />
    </g>
  </svg>
);

// A house with a heart in it: a safe place.
export const Casa: React.FC<{
  size?: number;
  draw?: number;
  beat?: number;
}> = ({ size = 160, draw = 1, beat = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path {...line(draw, 4)} d="M14 48 L50 16 L86 48" />
    <path {...line(draw, 4)} d="M24 40 L24 88 L76 88 L76 40" />
    <g
      transform={`translate(50 62) scale(${(1 + 0.1 * beat) * Math.min(1, draw * 1.4)}) translate(-14 -14)`}
    >
      <path
        d="M14 26s-9-5.5-11.5-11.2C1 10.6 3.5 6 8 6c2.6 0 4.3 1.4 6 3.7C15.7 7.4 17.4 6 20 6c4.5 0 7 4.6 5.5 8.8C23 20.5 14 26 14 26z"
        fill={E.rose}
      />
    </g>
  </svg>
);

// An open hand reaching out, palm up.
export const Mano: React.FC<{ size?: number; draw?: number }> = ({
  size = 200,
  draw = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      {...line(draw)}
      d="M6 70 L28 70 C34 70 38 66 44 66 L66 66 C70 66 72 70 68 73 L50 76"
    />
    <path
      {...line(draw)}
      d="M28 84 L52 84 C58 84 62 82 68 78 L88 62 C92 58 88 52 82 56 L66 66"
    />
    <path {...line(draw)} d="M6 70 L6 88 L28 88 L28 70" />
  </svg>
);

// Balance scale; `tilt` in degrees (positive = left pan down).
export const Balanza: React.FC<{
  width?: number;
  tilt?: number;
  left: React.ReactNode;
  right: React.ReactNode;
}> = ({ width = 640, tilt = 0, left, right }) => {
  const arm = width * 0.42;
  const rad = (tilt * Math.PI) / 180;
  const dy = Math.sin(rad) * arm;
  const pan = (x: number, y: number, label: React.ReactNode) => (
    <div
      style={{
        position: "absolute",
        left: x - 140,
        top: y,
        width: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg width={140} height={46} viewBox="0 0 140 46">
        <path d="M70 0 L18 40 M70 0 L122 40" stroke="#fff" strokeWidth={3} />
        <path
          d="M6 40 Q70 58 134 40"
          fill="rgba(255,255,255,.25)"
          stroke="#fff"
          strokeWidth={4}
        />
      </svg>
      <div style={{ marginTop: 6 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "relative", width, height: 300 }}>
      <svg
        width={width}
        height={300}
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d={`M${width / 2} 40 L${width / 2} 270 M${width / 2 - 70} 270 L${width / 2 + 70} 270`}
          stroke="#fff"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <circle cx={width / 2} cy={34} r={10} fill={E.rose} />
        <line
          x1={width / 2 - arm * Math.cos(rad)}
          y1={40 + dy}
          x2={width / 2 + arm * Math.cos(rad)}
          y2={40 - dy}
          stroke="#fff"
          strokeWidth={6}
          strokeLinecap="round"
        />
      </svg>
      {pan(width / 2 - arm * Math.cos(rad), 40 + dy, left)}
      {pan(width / 2 + arm * Math.cos(rad), 40 - dy, right)}
    </div>
  );
};
