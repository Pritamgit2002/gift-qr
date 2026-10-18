// fonts/index.tsx
import { Bricolage_Grotesque, Caveat, DM_Sans } from "next/font/google";

/** Headlines. */
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

/** Body copy and UI. */
export const sans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-sans",
  display: "swap",
});

/** Handwritten notes only. */
export const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-hand",
  display: "swap",
});
