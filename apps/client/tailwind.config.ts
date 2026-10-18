import type { Config } from "tailwindcss";

// The "Unwrapped" look: blush paper, plum ink, ribbon red and gold, bold
// outlines with hard offset shadows, and motion that springs a little.
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFF6F1",
        blush: "#FFE9E0",
        peach: "#FFE4DA",
        shell: "#FFF0EB",
        plum: {
          DEFAULT: "#23142E",
          body: "#4E3D5A",
          sub: "#5B4A66",
          mute: "#6B5A77",
          mist: "#D9CCE3",
          haze: "#BFAECB",
        },
        ribbon: {
          DEFAULT: "#D6284A",
          deep: "#C21F45",
          dark: "#8F1232",
          light: "#FF5A6E",
          lid: "#E23B57",
        },
        gold: {
          DEFAULT: "#FFC23D",
          soft: "#FFF4D6",
          cream: "#FFF0C7",
        },
        rose: "#F9B8C3",
        lilac: "#EFE7F6",
        line: {
          DEFAULT: "#EBDDD6",
          soft: "#F3E4DD",
          warm: "#E9D6CE",
          dash: "#D6C3BA",
          track: "#F3D9CF",
        },
        mint: {
          DEFAULT: "#D8F3E3",
          ink: "#14532D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      letterSpacing: {
        display: "-0.025em",
      },
      boxShadow: {
        "hard-sm": "4px 4px 0 #23142E",
        hard: "6px 6px 0 #23142E",
        "hard-md": "8px 8px 0 #23142E",
        "hard-lg": "10px 10px 0 #23142E",
        "hard-xl": "14px 14px 0 #23142E",
        "hard-gold": "6px 6px 0 #FFC23D",
        outline: "inset 0 0 0 2px #23142E",
        cta: "0 12px 26px -12px rgba(214,40,74,.8), inset 0 -3px 0 rgba(0,0,0,.18)",
        "cta-hover": "0 18px 34px -12px rgba(214,40,74,.85), inset 0 -3px 0 rgba(0,0,0,.18)",
        "gold-cta": "0 12px 26px -12px rgba(255,194,61,.9), inset 0 -3px 0 rgba(0,0,0,.14)",
        photo: "0 18px 40px -18px rgba(35,20,46,.45)",
        "photo-lg": "0 30px 50px -20px rgba(35,20,46,.5)",
        phone: "0 40px 70px -30px rgba(35,20,46,.6)",
      },
      transitionTimingFunction: {
        // Buttons, cards, chips.
        pop: "cubic-bezier(.34,1.56,.64,1)",
        // Headlines, fades, reveals.
        glide: "cubic-bezier(.16,1,.3,1)",
        // Squiggles, progress bars.
        draw: "cubic-bezier(.65,0,.35,1)",
      },
      transitionDuration: {
        350: "350ms",
        450: "450ms",
      },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "none" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        "float-sm": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        twinkle: {
          "0%,100%": { transform: "scale(.35) rotate(0)", opacity: ".25" },
          "50%": { transform: "scale(1) rotate(45deg)", opacity: "1" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(.3)" },
          "70%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "card-in": {
          "0%": { opacity: "0", transform: "translateY(46px) scale(.86) rotate(-4deg)" },
          "60%": { opacity: "1", transform: "translateY(-6px) scale(1.03) rotate(1deg)" },
          "100%": { opacity: "1", transform: "none" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(1.8) rotate(-12deg)" },
          "55%": { opacity: "1", transform: "scale(.94) rotate(2deg)" },
          "100%": { transform: "none" },
        },
        "item-in": {
          "0%": { opacity: "0", transform: "translateY(-14px) scale(.96)" },
          "100%": { opacity: "1", transform: "none" },
        },
        progress: { from: { width: "0" }, to: { width: "100%" } },
        wobble: {
          "0%,70%,100%": { transform: "rotate(0)" },
          "76%": { transform: "rotate(-10deg)" },
          "82%": { transform: "rotate(8deg)" },
          "88%": { transform: "rotate(-4deg)" },
        },
        bounce: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        rise: "rise .8s cubic-bezier(.16,1,.3,1) both",
        float: "float 6s ease-in-out infinite",
        "float-sm": "float-sm 5s ease-in-out infinite",
        twinkle: "twinkle 2.4s ease-in-out infinite",
        "pop-in": "pop-in .8s cubic-bezier(.34,1.56,.64,1) both",
        "card-in": "card-in .75s cubic-bezier(.34,1.56,.64,1) both",
        stamp: "stamp .9s cubic-bezier(.34,1.56,.64,1) both",
        "item-in": "item-in .55s cubic-bezier(.34,1.56,.64,1) both",
        wobble: "wobble 2.8s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        bounce: "bounce 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
