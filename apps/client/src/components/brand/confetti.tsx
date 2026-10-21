import type { CSSProperties } from "react";

export type FallingPiece = {
  /** Horizontal position, % of the parent's width. */
  left: number;
  color: string;
  /** Seconds for one fall. */
  duration: number;
  delay?: number;
  round?: boolean;
  width?: number;
  height?: number;
};

/** Confetti drifting down behind content. The parent must be positioned and clip overflow. */
export function FallingConfetti({ pieces }: { pieces: FallingPiece[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece, i) => {
        const style: CSSProperties = {
          left: `${piece.left}%`,
          background: piece.color,
          animationDuration: `${piece.duration}s`,
          animationDelay: `${piece.delay ?? 0}s`,
          width: piece.width,
          height: piece.height,
          borderRadius: piece.round ? "50%" : undefined,
        };
        return <span key={i} className="confetti-fall" style={style} />;
      })}
    </div>
  );
}
