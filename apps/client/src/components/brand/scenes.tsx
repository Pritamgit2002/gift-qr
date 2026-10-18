import type { CSSProperties, ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { QR_PATH } from "./art";
import s from "./scenes.module.css";

// Illustrated scenes in the "Unwrapped" style, drawn in SVG so they stay crisp,
// weigh almost nothing and can move. They replace the old stock photos.

const INK = "#23142E";
const LINE = 2.5;
const HEART = "M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z";
const STAR = "M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z";

const handFont: CSSProperties = { fontFamily: "var(--font-hand), cursive", fontWeight: 700 };
const sansFont: CSSProperties = { fontFamily: "var(--font-sans), sans-serif", fontWeight: 700 };

export type SceneProps = {
  className?: string;
  /** Describes the scene for screen readers. Leave it out when the scene is decoration. */
  label?: string;
};

export type Scene = ComponentType<SceneProps>;

function Frame({ viewBox, label, className, children }: SceneProps & { viewBox: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children}
    </svg>
  );
}

function Qr({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 29})`}>
      <rect width="29" height="29" fill="#fff" />
      <path stroke={INK} d={QR_PATH} shapeRendering="crispEdges" />
    </g>
  );
}

function Twinkle({ x, y, size = 16, fill = "#FFC23D", delay = 0 }: { x: number; y: number; size?: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={cn(s.box, s.twinkle)} style={{ animationDelay: `${delay}s` }}>
        <path d={STAR} transform={`scale(${size / 20})`} fill={fill} />
      </g>
    </g>
  );
}

function Heart({ x, y, size = 24, fill = "#D6284A", stroke }: { x: number; y: number; size?: number; fill?: string; stroke?: boolean }) {
  return (
    <path
      d={HEART}
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`}
      fill={fill}
      stroke={stroke ? INK : undefined}
      strokeWidth={stroke ? 2 : undefined}
    />
  );
}

/** A heart that floats up and fades, on a loop. */
function RisingHeart({ x, y, size = 18, fill = "#D6284A", delay = 0 }: { x: number; y: number; size?: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={cn(s.box, s.heartUp)} style={{ animationDelay: `${delay}s` }}>
        <Heart x={0} y={0} size={size} fill={fill} />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery: places a GiftQR can live. 216 × 216.                       */
/* ------------------------------------------------------------------ */

export function BirthdayCardScene(props: SceneProps) {
  return (
    <Frame viewBox="0 0 216 216" {...props}>
      <rect width="216" height="216" fill="#FFF0C7" />
      <circle cx="186" cy="34" r="5" fill="#FF5A6E" opacity=".5" />
      <circle cx="28" cy="176" r="4" fill="#D6284A" opacity=".4" />
      <circle cx="196" cy="150" r="3" fill={INK} opacity=".3" />

      {/* balloon */}
      <g transform="translate(36 34)">
        <g className={s.bob}>
          <path d="M0 26 C 4 60, -10 80, 4 112" fill="none" stroke={INK} strokeWidth="1.5" />
          <ellipse cx="0" cy="0" rx="19" ry="23" fill="#FF5A6E" stroke={INK} strokeWidth={LINE} />
          <path d="M-5 22 L5 22 L0 28 Z" fill="#FF5A6E" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
          <ellipse cx="-7" cy="-9" rx="4" ry="7" fill="#fff" opacity=".55" />
        </g>
      </g>

      <ellipse cx="118" cy="192" rx="58" ry="6" fill={INK} opacity=".12" />
      <g transform="translate(68 40)">
        <g className={s.rock}>
          <path d="M12 6 L106 0 L106 140 L12 148 Z" fill="#FFE4DA" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
          <rect x="0" y="8" width="98" height="142" rx="6" fill="#fff" stroke={INK} strokeWidth={LINE} />
          <text x="49" y="38" textAnchor="middle" fontSize="22" fill="#C21F45" style={handFont}>
            Happy
          </text>
          <text x="49" y="60" textAnchor="middle" fontSize="22" fill="#C21F45" style={handFont}>
            Birthday!
          </text>
          <Qr x={27} y={72} size={44} />
          <text x="49" y="137" textAnchor="middle" fontSize="9" fill="#4E3D5A" style={sansFont}>
            SCAN ME
          </text>
        </g>
      </g>
      <Twinkle x={186} y={74} size={18} />
      <Twinkle x={176} y={186} size={14} fill="#FF5A6E" delay={0.8} />
    </Frame>
  );
}

export function GiftTagScene(props: SceneProps) {
  return (
    <Frame viewBox="0 0 216 216" {...props}>
      <rect width="216" height="216" fill="#FFE4DA" />
      {/* box in the corner */}
      <rect x="-20" y="128" width="150" height="110" fill="#FF5A6E" stroke={INK} strokeWidth={LINE} />
      <rect x="42" y="128" width="26" height="110" fill="#FFC23D" stroke={INK} strokeWidth={LINE} />
      <rect x="-26" y="110" width="162" height="28" rx="6" fill="#E23B57" stroke={INK} strokeWidth={LINE} />
      <rect x="41" y="110" width="28" height="28" fill="#FFC23D" stroke={INK} strokeWidth={LINE} />
      <ellipse cx="38" cy="98" rx="20" ry="12" transform="rotate(-24 38 98)" fill="none" stroke="#FFC23D" strokeWidth="9" />
      <ellipse cx="38" cy="98" rx="20" ry="12" transform="rotate(-24 38 98)" fill="none" stroke={INK} strokeWidth="1.5" />
      <ellipse cx="72" cy="98" rx="20" ry="12" transform="rotate(24 72 98)" fill="none" stroke="#FFC23D" strokeWidth="9" />
      <ellipse cx="72" cy="98" rx="20" ry="12" transform="rotate(24 72 98)" fill="none" stroke={INK} strokeWidth="1.5" />
      <rect x="46" y="100" width="18" height="16" rx="5" fill="#FFC23D" stroke={INK} strokeWidth="2" />

      {/* string and swinging tag */}
      <path d="M58 104 C 100 60, 130 46, 152 50" fill="none" stroke={INK} strokeWidth="2" />
      <g className={cn(s.pivot, s.swing)} style={{ transformOrigin: "152px 50px" }}>
        <path d="M152 50 L152 64" stroke={INK} strokeWidth="2" />
        <path d="M152 58 L184 80 L184 190 L120 190 L120 80 Z" fill="#fff" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
        <circle cx="152" cy="72" r="4.5" fill="#FFE4DA" stroke={INK} strokeWidth="2" />
        <Qr x={130} y={92} size={44} />
        <text x="152" y="172" textAnchor="middle" fontSize="21" fill="#C21F45" style={handFont}>
          to: you
        </text>
      </g>
      <Twinkle x={190} y={30} size={18} />
      <Twinkle x={100} y={30} size={12} fill="#D6284A" delay={1.1} />
    </Frame>
  );
}

export function WelcomeSignScene(props: SceneProps) {
  return (
    <Frame viewBox="0 0 216 216" {...props}>
      <rect width="216" height="216" fill="#EFE7F6" />
      {/* easel */}
      <path d="M108 30 L108 206" stroke="#BFAECB" strokeWidth="5" strokeLinecap="round" />
      <path d="M108 30 L58 208 M108 30 L158 208" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="108" cy="28" r="6" fill="#FFC23D" stroke={INK} strokeWidth="2" />
      <rect x="44" y="172" width="128" height="8" rx="3" fill={INK} />

      <g className={s.sway} style={{ transformOrigin: "108px 176px", transformBox: "view-box" }}>
        <rect x="48" y="46" width="120" height="128" rx="8" fill="#fff" stroke={INK} strokeWidth={LINE} />
        <rect x="55" y="53" width="106" height="114" rx="5" fill="none" stroke="#F9B8C3" strokeWidth="2" strokeDasharray="4 4" />
        <text x="108" y="80" textAnchor="middle" fontSize="27" fill="#C21F45" style={handFont}>
          Welcome
        </text>
        <text x="108" y="96" textAnchor="middle" fontSize="8.5" fill="#4E3D5A" style={sansFont}>
          SCAN FOR A SURPRISE
        </text>
        <Qr x={86} y={104} size={44} />
        <Heart x={108} y={160} size={11} />
      </g>

      {/* flowers */}
      <g transform="translate(30 168)">
        <g className={s.bob}>
          <path d="M0 0 L0 40" stroke="#2F6B4F" strokeWidth="3" />
          <circle cx="0" cy="-4" r="11" fill="#F9B8C3" stroke={INK} strokeWidth="2" />
          <circle cx="0" cy="-4" r="4" fill="#FFC23D" />
        </g>
      </g>
      <g transform="translate(188 160)">
        <g className={s.bob} style={{ animationDelay: "1.2s" }}>
          <path d="M0 0 L0 50" stroke="#2F6B4F" strokeWidth="3" />
          <circle cx="0" cy="-4" r="12" fill="#FF5A6E" stroke={INK} strokeWidth="2" />
          <circle cx="0" cy="-4" r="4.5" fill="#FFC23D" />
        </g>
      </g>
      <Twinkle x={30} y={40} size={18} />
      <Twinkle x={188} y={58} size={14} fill="#D6284A" delay={0.9} />
    </Frame>
  );
}

export function TableTentScene(props: SceneProps) {
  return (
    <Frame viewBox="0 0 216 216" {...props}>
      <rect width="216" height="216" fill="#FFE9E0" />
      <rect x="0" y="172" width="216" height="44" fill="#F3D9CF" />
      <path d="M0 172 H216" stroke={INK} strokeWidth={LINE} />
      <ellipse cx="96" cy="174" rx="64" ry="5" fill={INK} opacity=".12" />

      <g transform="translate(0 0)">
        <g className={s.rock} style={{ animationDuration: "5s" }}>
          <path d="M40 172 L58 46 L134 46 L152 172 Z" fill="#fff" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
          <text x="96" y="80" textAnchor="middle" fontSize="25" fill="#C21F45" style={handFont}>
            Scan me!
          </text>
          <Qr x={74} y={92} size={44} />
          <text x="96" y="156" textAnchor="middle" fontSize="8.5" fill="#4E3D5A" style={sansFont}>
            A SURPRISE INSIDE
          </text>
        </g>
      </g>

      {/* cup with steam */}
      <path d="M162 136 H196 L192 172 H166 Z" fill="#FFC23D" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
      <path d="M195 144 C 208 144, 208 162, 193 162" fill="none" stroke={INK} strokeWidth={LINE} />
      <Heart x={179} y={154} size={12} fill="#D6284A" />
      {[168, 179, 190].map((x, i) => (
        <g key={x} transform={`translate(${x} 104)`}>
          <path
            className={s.steam}
            style={{ animationDelay: `${i * 0.6}s` }}
            d="M0 26 C -5 18, 5 12, 0 4"
            fill="none"
            stroke="#BFAECB"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}
      <Twinkle x={184} y={40} size={18} />
      <Twinkle x={22} y={110} size={12} fill="#FF5A6E" delay={1.3} />
    </Frame>
  );
}

export function EnvelopeScene(props: SceneProps) {
  return (
    <Frame viewBox="0 0 216 216" {...props}>
      <rect width="216" height="216" fill="#F9B8C3" />
      <ellipse cx="108" cy="198" rx="78" ry="6" fill={INK} opacity=".14" />
      <rect x="34" y="96" width="148" height="98" rx="6" fill="#FFF0EB" stroke={INK} strokeWidth={LINE} />

      <g className={s.slide}>
        <rect x="48" y="44" width="120" height="112" rx="4" fill="#fff" stroke={INK} strokeWidth={LINE} />
        <text x="108" y="64" textAnchor="middle" fontSize="16" fill="#C21F45" style={handFont}>
          open me
        </text>
        <Qr x={86} y={70} size={44} />
      </g>

      <path d="M34 112 L108 154 L182 112 L182 188 Q182 194 176 194 L40 194 Q34 194 34 188 Z" fill="#fff" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
      <path d="M36 192 L94 150 M180 192 L122 150" stroke={INK} strokeWidth="2" />
      <g transform="translate(108 156)">
        <g className={cn(s.box, s.pulse)}>
          <circle cx="0" cy="0" r="15" fill="#D6284A" stroke={INK} strokeWidth="2" />
          <Heart x={0} y={1} size={15} fill="#FFF6F1" />
        </g>
      </g>
      <Twinkle x={28} y={40} size={18} fill="#FFC23D" />
      <Twinkle x={192} y={70} size={14} fill="#fff" delay={0.7} />
    </Frame>
  );
}

export function FridgeNoteScene(props: SceneProps) {
  return (
    <Frame viewBox="0 0 216 216" {...props}>
      <rect width="216" height="216" fill={INK} />
      <rect x="26" y="-12" width="164" height="244" rx="18" fill="#FFF6F1" />
      <rect x="40" y="30" width="9" height="74" rx="4.5" fill="#D9CCE3" />
      <path d="M26 126 H190" stroke="#E9D6CE" strokeWidth="3" />

      <circle cx="166" cy="40" r="9" fill="#FFC23D" stroke={INK} strokeWidth="2" />
      <g transform="translate(64 172)">
        <path d={STAR} transform="scale(1.1)" fill="#FF5A6E" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      </g>

      <g className={cn(s.pivot, s.swing)} style={{ transformOrigin: "122px 56px", animationDuration: "4.6s" }}>
        <path d="M72 58 H172 V170 Q148 166 120 172 Q96 176 72 170 Z" fill="#FFC23D" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
        <Qr x={100} y={80} size={44} />
        <text x="122" y="152" textAnchor="middle" fontSize="20" fill={INK} style={handFont}>
          for you
        </text>
      </g>
      <Heart x={122} y={56} size={26} fill="#D6284A" stroke />
      <Twinkle x={14} y={36} size={14} />
      <Twinkle x={204} y={190} size={14} fill="#FF5A6E" delay={1} />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* "Photos" for the scan demo and the hero polaroid. 240 × 280.        */
/* ------------------------------------------------------------------ */

const bunting = [
  { x: 14, y: 38, fill: "#FF5A6E" },
  { x: 52, y: 49, fill: "#FFC23D" },
  { x: 90, y: 54, fill: "#D6284A" },
  { x: 128, y: 55, fill: "#F9B8C3" },
  { x: 166, y: 50, fill: "#FFC23D" },
  { x: 204, y: 41, fill: "#FF5A6E" },
];

export function BirthdayScene(props: SceneProps) {
  return (
    <Frame viewBox="0 0 240 280" {...props}>
      <rect width="240" height="280" fill="#FFE9E0" />
      <g className={s.sway} style={{ transformOrigin: "120px 0px", transformBox: "view-box" }}>
        <path d="M-10 30 Q120 80 250 30" fill="none" stroke={INK} strokeWidth="2" />
        {bunting.map((flag) => (
          <path
            key={flag.x}
            d={`M${flag.x - 14} ${flag.y - 4} L${flag.x + 14} ${flag.y - 4} L${flag.x} ${flag.y + 24} Z`}
            fill={flag.fill}
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ))}
      </g>

      <rect x="0" y="232" width="240" height="48" fill="#F3D9CF" />
      <path d="M0 232 H240" stroke={INK} strokeWidth={LINE} />
      <ellipse cx="120" cy="232" rx="90" ry="10" fill="#fff" stroke={INK} strokeWidth={LINE} />

      {/* cake */}
      <rect x="48" y="170" width="144" height="60" rx="10" fill="#FFF6F1" stroke={INK} strokeWidth={LINE} />
      <path
        d="M48 182 Q48 170 60 170 H180 Q192 170 192 182 V186 Q184 198 176 186 Q168 200 158 186 Q148 196 138 186 Q128 200 118 186 Q108 196 98 186 Q88 200 78 186 Q68 196 58 186 Q52 194 48 186 Z"
        fill="#FF5A6E"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {[66, 92, 120, 148, 174].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 214 : 208} r="3" fill={i % 2 ? "#FFC23D" : "#D6284A"} />
      ))}
      <rect x="74" y="124" width="92" height="48" rx="10" fill="#FFC23D" stroke={INK} strokeWidth={LINE} />
      <path d="M74 138 H166" stroke="#fff" strokeWidth="4" strokeDasharray="2 8" strokeLinecap="round" />

      {/* candles and flames */}
      {[96, 120, 144].map((x, i) => (
        <g key={x}>
          <rect x={x - 4} y="92" width="8" height="34" rx="3" fill="#fff" stroke={INK} strokeWidth="2" />
          <path d={`M${x - 4} 102 L${x + 4} 98 M${x - 4} 112 L${x + 4} 108`} stroke="#D6284A" strokeWidth="2" />
          <g transform={`translate(${x} 88)`}>
            <circle className={cn(s.box, s.glow)} style={{ animationDelay: `${i * 0.3}s` }} cx="0" cy="-8" r="14" fill="#FFC23D" />
            <g className={cn(s.box, s.flicker)} style={{ animationDelay: `${i * 0.25}s` }}>
              <path d="M0 -20 C 8 -8, 7 2, 0 4 C -7 2, -8 -8, 0 -20 Z" fill="#FFC23D" stroke={INK} strokeWidth="1.5" />
              <path d="M0 -10 C 4 -4, 3 1, 0 2 C -3 1, -4 -4, 0 -10 Z" fill="#FF5A6E" />
            </g>
          </g>
        </g>
      ))}

      <rect x="24" y="96" width="7" height="11" rx="2" fill="#FFC23D" transform="rotate(24 24 96)" />
      <rect x="208" y="120" width="7" height="11" rx="2" fill="#D6284A" transform="rotate(-30 208 120)" />
      <circle cx="30" cy="160" r="4" fill={INK} opacity=".3" />
      <Twinkle x={34} y={78} size={18} />
      <Twinkle x={208} y={88} size={16} fill="#FF5A6E" delay={1} />
    </Frame>
  );
}

export function ScanSmileScene(props: SceneProps) {
  const skin = "#C98B62";
  return (
    <Frame viewBox="0 0 240 280" {...props}>
      <rect width="240" height="280" fill="#FFE4DA" />
      <circle cx="120" cy="126" r="96" fill="#FFC23D" />
      <circle cx="120" cy="126" r="96" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="3 10" strokeLinecap="round" />

      <path d="M34 280 C 44 214, 196 214, 206 280 Z" fill="#D6284A" stroke={INK} strokeWidth={LINE} />
      <path d="M96 222 Q120 240 144 222" fill="none" stroke={INK} strokeWidth="2" />

      <g className={cn(s.pivot, s.nod)} style={{ transformOrigin: "120px 200px" }}>
        <rect x="106" y="176" width="28" height="34" fill={skin} stroke={INK} strokeWidth={LINE} />
        <circle cx="122" cy="80" r="17" fill={INK} />
        <circle cx="120" cy="136" r="52" fill={skin} stroke={INK} strokeWidth={LINE} />
        <path d="M68 134 C 66 92, 98 76, 124 78 C 156 80, 176 102, 172 136 C 162 114, 140 102, 118 106 C 98 108, 80 118, 68 134 Z" fill={INK} />
        <path d="M95 138 Q103 128 111 138 M129 138 Q137 128 145 138" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="92" cy="154" r="8" fill="#F9B8C3" opacity=".9" />
        <circle cx="148" cy="154" r="8" fill="#F9B8C3" opacity=".9" />
        <path d="M102 156 Q120 186 138 156 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M110 167 Q120 162 130 167 Q126 176 120 176 Q114 176 110 167 Z" fill="#FF5A6E" />
      </g>

      {/* phone in hand */}
      <g transform="rotate(-12 178 228)">
        <rect x="152" y="186" width="54" height="88" rx="10" fill={INK} />
        <rect x="157" y="194" width="44" height="70" rx="6" fill="#FFF6F1" />
        <Heart x={179} y={226} size={22} fill="#D6284A" />
        <circle cx="152" cy="236" r="10" fill={skin} stroke={INK} strokeWidth="2" />
        <circle cx="206" cy="226" r="9" fill={skin} stroke={INK} strokeWidth="2" />
      </g>
      <RisingHeart x={188} y={180} size={18} />
      <RisingHeart x={204} y={190} size={13} fill="#FF5A6E" delay={1.1} />
      <RisingHeart x={170} y={178} size={11} fill={INK} delay={2.1} />
      <Twinkle x={36} y={60} size={18} fill="#D6284A" />
      <Twinkle x={210} y={46} size={14} delay={0.8} />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Story: someone scanning the tag on a gift. 560 × 440.                */
/* ------------------------------------------------------------------ */

const bulbs = [
  { x: 50, y: 60, fill: "#FFC23D" },
  { x: 138, y: 73, fill: "#FF5A6E" },
  { x: 224, y: 66, fill: "#FFC23D" },
  { x: 336, y: 34, fill: "#F9B8C3" },
  { x: 422, y: 28, fill: "#FFC23D" },
  { x: 510, y: 40, fill: "#FF5A6E" },
];

export function StoryScene(props: SceneProps) {
  const skin = "#A86B4A";
  return (
    <Frame viewBox="0 0 560 440" {...props}>
      <rect width="560" height="440" fill="#FFF0C7" />

      {/* string lights */}
      <path d="M-10 40 Q140 100 280 50 Q420 0 570 60" fill="none" stroke={INK} strokeWidth="2" />
      {bulbs.map((bulb, i) => (
        <g key={bulb.x} transform={`translate(${bulb.x} ${bulb.y})`}>
          <rect x="-3" y="0" width="6" height="7" fill={INK} />
          <circle
            className={cn(s.box, s.glow)}
            style={{ animationDelay: `${i * 0.35}s` }}
            cx="0"
            cy="16"
            r="16"
            fill={bulb.fill}
          />
          <ellipse cx="0" cy="15" rx="7" ry="9" fill={bulb.fill} stroke={INK} strokeWidth="2" />
        </g>
      ))}

      {/* window with a drifting cloud */}
      <path d="M340 262 V168 A75 75 0 0 1 490 168 V262 Z" fill="#EFE7F6" />
      <g>
        <g className={s.drift}>
          <path d="M360 150 a14 14 0 0 1 26 -6 a12 12 0 0 1 20 10 h-46 z" fill="#fff" />
        </g>
      </g>
      <circle cx="452" cy="132" r="16" fill="#FFC23D" />
      <path d="M340 262 V168 A75 75 0 0 1 490 168 V262 Z M415 93 V262 M340 190 H490" fill="none" stroke={INK} strokeWidth={LINE} />

      {/* plant */}
      <g transform="translate(78 300)">
        <g className={s.sway} style={{ transformOrigin: "0px 0px", transformBox: "view-box" }}>
          <path d="M0 0 C -30 -30, -40 -70, -20 -100 C -6 -70, -4 -30, 0 0 Z" fill="#2F6B4F" stroke={INK} strokeWidth="2" />
          <path d="M0 0 C 26 -26, 46 -56, 34 -92 C 16 -64, 6 -30, 0 0 Z" fill="#5FA47E" stroke={INK} strokeWidth="2" />
          <path d="M0 0 C -6 -40, 4 -80, 14 -120 C 22 -80, 12 -40, 0 0 Z" fill="#2F6B4F" stroke={INK} strokeWidth="2" />
        </g>
      </g>
      <path d="M48 298 H108 L100 362 H56 Z" fill="#D6284A" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />

      {/* table */}
      <rect x="0" y="360" width="560" height="80" fill="#E9D6CE" />
      <path d="M0 360 H560" stroke={INK} strokeWidth={LINE} />
      <ellipse cx="244" cy="362" rx="100" ry="8" fill={INK} opacity=".15" />

      {/* gift */}
      <rect x="168" y="272" width="152" height="90" rx="6" fill="#FF5A6E" stroke={INK} strokeWidth={LINE} />
      <rect x="230" y="272" width="28" height="90" fill="#FFC23D" stroke={INK} strokeWidth={LINE} />
      <rect x="158" y="250" width="172" height="30" rx="8" fill="#E23B57" stroke={INK} strokeWidth={LINE} />
      <rect x="229" y="250" width="30" height="30" fill="#FFC23D" stroke={INK} strokeWidth={LINE} />
      <ellipse cx="226" cy="238" rx="24" ry="13" transform="rotate(-22 226 238)" fill="none" stroke="#FFC23D" strokeWidth="10" />
      <ellipse cx="226" cy="238" rx="24" ry="13" transform="rotate(-22 226 238)" fill="none" stroke={INK} strokeWidth="1.5" />
      <ellipse cx="262" cy="238" rx="24" ry="13" transform="rotate(22 262 238)" fill="none" stroke="#FFC23D" strokeWidth="10" />
      <ellipse cx="262" cy="238" rx="24" ry="13" transform="rotate(22 262 238)" fill="none" stroke={INK} strokeWidth="1.5" />
      <rect x="234" y="240" width="20" height="18" rx="6" fill="#FFC23D" stroke={INK} strokeWidth="2" />

      <path d="M318 266 C 334 270, 340 280, 344 288" fill="none" stroke={INK} strokeWidth="2" />
      <g className={cn(s.pivot, s.swing)} style={{ transformOrigin: "344px 288px", animationDuration: "3.8s" }}>
        <path d="M344 282 L370 300 L370 362 L318 362 L318 300 Z" fill="#fff" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
        <circle cx="344" cy="296" r="4" fill="#FFF0C7" stroke={INK} strokeWidth="2" />
        <Qr x={326} y={308} size={36} />
      </g>

      {/* scan beam from the phone to the tag */}
      <path className={s.beam} d="M404 226 L364 300 L364 356 L412 270 Z" fill="#FFC23D" />

      {/* arm reaching in from the right, holding the phone */}
      <path d="M600 292 C 550 284, 508 262, 470 246" fill="none" stroke={INK} strokeWidth="46" strokeLinecap="round" />
      <path d="M600 292 C 550 284, 508 262, 470 246" fill="none" stroke={skin} strokeWidth="40" strokeLinecap="round" />
      <g transform="rotate(-16 440 234)">
        <rect x="404" y="172" width="72" height="124" rx="14" fill={INK} />
        <rect x="410" y="180" width="60" height="104" rx="9" fill="#FFF6F1" />
        <rect x="422" y="202" width="36" height="36" rx="4" fill="none" stroke="#D6284A" strokeWidth="3" strokeDasharray="10 16" />
        <Heart x={440} y={258} size={16} />
        <ellipse cx="404" cy="248" rx="10" ry="14" fill={skin} stroke={INK} strokeWidth="2" />
        <ellipse cx="478" cy="236" rx="11" ry="9" fill={skin} stroke={INK} strokeWidth="2" />
      </g>

      <RisingHeart x={244} y={226} size={22} />
      <RisingHeart x={268} y={232} size={15} fill="#FF5A6E" delay={1.1} />
      <RisingHeart x={222} y={230} size={13} fill={INK} delay={2.2} />
      <Twinkle x={150} y={170} size={22} />
      <Twinkle x={520} y={300} size={18} fill="#D6284A" delay={0.8} />
    </Frame>
  );
}
