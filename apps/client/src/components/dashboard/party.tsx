import type { CSSProperties } from "react";
import styles from "./dashboard.module.css";

const colors = ["#FF5A6E", "#FFC23D", "#23142E", "#F9B8C3"];

// Fixed positions so server and client render the same pieces.
const pieces = Array.from({ length: 36 }, (_, i) => {
  const width = 6 + ((i * 7) % 8);
  return {
    left: (i * 29) % 100,
    background: colors[i % 4],
    width,
    height: width + 6,
    delay: (i % 9) * 0.07,
    duration: 2 + (i % 5) * 0.3,
  };
});

/** One burst of confetti; remount it (change its key) to play it again. */
export function Party() {
  return (
    <div className={styles.party} aria-hidden="true">
      {pieces.map((piece, i) => {
        const style: CSSProperties = {
          left: `${piece.left}%`,
          background: piece.background,
          width: piece.width,
          height: piece.height,
          animationDelay: `${piece.delay}s`,
          animationDuration: `${piece.duration}s`,
        };
        return <span key={i} className={styles.partyPiece} style={style} />;
      })}
    </div>
  );
}
