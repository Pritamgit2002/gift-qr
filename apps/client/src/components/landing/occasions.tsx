import { Fragment } from "react";
import { Heart, Sparkle } from "@/components/brand/art";
import styles from "./landing.module.css";

const features = ["Links", "Messages", "Photos", "One QR code", "Endless surprises"];
const occasions = ["Birthdays", "Anniversaries", "Weddings", "Long distance", "Graduations", "Thank-yous", "Just because"];

/** Two crossed, scrolling ribbons of words. */
export function Occasions() {
  // Each band repeats its words so the loop has no seam.
  const featureRun = [...features, ...features];
  return (
    <section aria-label="Occasions" className="relative mb-10 h-[190px]">
      <div
        aria-hidden="true"
        className="absolute -left-10 -right-10 top-[60px] rotate-[2.2deg] overflow-hidden border-y-2 border-plum bg-gold py-3.5"
      >
        <div className={`${styles.bandReverse} font-display text-[26px] font-bold text-plum`}>
          {[0, 1].map((copy) => (
            <span key={copy}>
              {featureRun.map((word, i) => (
                <Fragment key={i}>
                  {word}
                  <Sparkle size={18} fill="#23142E" />
                </Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute -left-10 -right-10 top-[60px] -rotate-[2.2deg] overflow-hidden bg-plum py-[18px]">
        <div className={`${styles.band} font-display text-3xl font-bold text-paper`}>
          {[0, 1].map((copy) => (
            <span key={copy} aria-hidden={copy === 1 || undefined}>
              {occasions.map((word, i) => (
                <Fragment key={word}>
                  {word}
                  <Heart fill={i % 2 ? "#FFC23D" : "#FF5A6E"} />
                </Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
