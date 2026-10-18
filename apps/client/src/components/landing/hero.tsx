import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Check, Link as LinkIcon, MessageSquare, Play } from "lucide-react";
import { buttonVariants } from "@/components/brand/button";
import { QrArt, Sparkle } from "@/components/brand/art";
import { FallingConfetti, type FallingPiece } from "@/components/brand/confetti";
import { cn } from "@/lib/utils";
import { BirthdayScene } from "@/components/brand/scenes";
import styles from "./landing.module.css";

const confetti: FallingPiece[] = [
  { left: 4, color: "#FF5A6E", duration: 9 },
  { left: 11, color: "#FFC23D", duration: 12, delay: 2, round: true, width: 10, height: 10 },
  { left: 19, color: "#23142E", duration: 10, delay: 5, width: 6, height: 14 },
  { left: 27, color: "#FFC23D", duration: 13, delay: 1 },
  { left: 36, color: "#FF5A6E", duration: 11, delay: 7, round: true, width: 8, height: 8 },
  { left: 44, color: "#F9B8C3", duration: 9.5, delay: 3 },
  { left: 53, color: "#23142E", duration: 14, delay: 0.5, width: 6, height: 12 },
  { left: 61, color: "#FFC23D", duration: 10, delay: 4, round: true, width: 9, height: 9 },
  { left: 69, color: "#FF5A6E", duration: 12.5, delay: 6 },
  { left: 77, color: "#F9B8C3", duration: 9, delay: 2.5, width: 8, height: 16 },
  { left: 85, color: "#23142E", duration: 13, delay: 8, round: true, width: 7, height: 7 },
  { left: 93, color: "#FFC23D", duration: 10.5, delay: 1.5 },
];

// Where each piece of the lid-pop burst flies to.
const burst = [
  { x: -190, y: -170, rot: 220, color: "#FFC23D" },
  { x: -120, y: -250, rot: -160, color: "#FF5A6E" },
  { x: -40, y: -290, rot: 300, color: "#23142E", width: 8 },
  { x: 60, y: -300, rot: -240, color: "#FFC23D", round: true, width: 12, height: 12 },
  { x: 140, y: -240, rot: 180, color: "#FF5A6E" },
  { x: 210, y: -160, rot: -300, color: "#F9B8C3" },
  { x: -230, y: -60, rot: 140, color: "#F9B8C3", round: true, width: 10, height: 10 },
  { x: 240, y: -50, rot: 260, color: "#FFC23D" },
  { x: -90, y: -200, rot: -90, color: "#FFC23D", width: 8, height: 20 },
  { x: 100, y: -190, rot: 120, color: "#23142E", round: true, width: 9, height: 9 },
];

function Word({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className={styles.word}>
      <span className={className} style={{ animationDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  );
}

export function Hero({ startHref }: { startHref: string }) {
  return (
    <section id="top" className="relative pb-20 pt-10">
      <FallingConfetti pieces={confetti} />

      <div className="relative z-[1] mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-10 px-4 sm:px-8">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-7">
          <span
            className="inline-flex animate-rise items-center gap-2 self-start rounded-full border-2 border-plum bg-white py-2 pl-2.5 pr-4 text-sm font-semibold"
            style={{ animationDelay: ".1s" }}
          >
            <Sparkle size={20} stroke="#23142E" className="animate-twinkle" />A gift that keeps on giving
          </span>
          <h1 className="m-0 font-display text-[clamp(48px,7vw,92px)] font-extrabold leading-[.98] tracking-display">
            <Word delay={0.15}>Wrap</Word> <Word delay={0.25}>your</Word>{" "}
            <span className="relative inline-block">
              <Word delay={0.35} className="text-ribbon">
                love
              </Word>
              <svg
                className={styles.squiggle}
                viewBox="0 0 200 24"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{ position: "absolute", left: "-2%", bottom: -14, width: "104%", height: 22, overflow: "visible" }}
              >
                <path
                  d="M3 15 C 30 3, 52 21, 80 11 S 130 3, 155 13 S 188 17, 197 7"
                  fill="none"
                  stroke="#D6284A"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            <Word delay={0.45}>in</Word> <Word delay={0.55}>a</Word>{" "}
            <Word delay={0.65}>
              <span className={styles.highlight}>QR code.</span>
            </Word>
          </h1>
          <p
            className="m-0 max-w-[540px] animate-rise text-xl leading-[1.55] text-plum-body"
            style={{ animationDelay: ".8s" }}
          >
            Pack one QR code with songs, notes and photos. Every scan unwraps a different surprise, so your gift keeps
            giving long after the bow comes off.
          </p>
          <div className="flex animate-rise flex-wrap gap-3.5" style={{ animationDelay: ".95s" }}>
            <Link className={cn(buttonVariants({ size: "lg" }), "group")} href={startHref}>
              Make your GiftQR
              <ArrowRight
                size={20}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform duration-350 ease-pop group-hover:translate-x-1"
              />
            </Link>
            <a className={buttonVariants({ variant: "ghost", size: "lg" })} href="#demo">
              <Play size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              Feel a scan
            </a>
          </div>
          <ul
            className="m-0 flex animate-rise list-none flex-wrap items-center gap-x-[18px] gap-y-2.5 p-0 text-[15px] text-plum-body"
            style={{ animationDelay: "1.1s" }}
          >
            {["From ₹1 an item", "Sign in with Google", "Or try it as a guest"].map((point) => (
              <li key={point} className="inline-flex items-center gap-2">
                <Check size={18} strokeWidth={2.5} className="text-ribbon" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-[1_1_460px]">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}

function HeroStage() {
  return (
    <div
      className={styles.stage}
      role="img"
      aria-label="A gift box pops open and a QR code rises out, surrounded by a song link, a handwritten note and a photo"
    >
      <div className={styles.stageInner} aria-hidden="true">
        <div className="absolute left-[70px] top-20 h-[420px] w-[420px] rounded-full bg-peach" />
        <svg className={cn(styles.ring, "absolute left-10 top-[50px] h-[480px] w-[480px]")} viewBox="0 0 480 480">
          <circle cx="240" cy="240" r="234" fill="none" stroke="#23142E" strokeWidth="2" strokeDasharray="4 14" strokeLinecap="round" />
        </svg>
        <svg className={cn(styles.ringReverse, "absolute left-20 top-[90px] h-[400px] w-[400px]")} viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r="196"
            fill="none"
            stroke="#FF5A6E"
            strokeWidth="2"
            strokeDasharray="26 18"
            strokeLinecap="round"
            opacity=".5"
          />
        </svg>

        <Sparkle size={30} className="absolute left-10 top-[150px] animate-twinkle" style={{ animationDelay: ".3s" }} />
        <Sparkle size={22} fill="#FF5A6E" className="absolute left-[500px] top-[470px] animate-twinkle" style={{ animationDelay: "1.1s" }} />
        <Sparkle size={18} fill="#23142E" className="absolute left-[300px] top-[30px] animate-twinkle" style={{ animationDelay: "1.7s" }} />
        <Sparkle size={26} className="absolute left-[30px] top-[470px] animate-twinkle" style={{ animationDelay: ".8s" }} />

        {/* ground shadow */}
        <div className="absolute left-[150px] top-[520px] h-[22px] w-[260px] rounded-full bg-[rgba(35,20,46,.16)]" />

        <div className={cn(styles.boxDrop, "absolute inset-0")}>
          <div className={cn(styles.boxHop, "absolute inset-0")}>
            {/* QR card, behind the front of the box */}
            <div className={cn(styles.qrRise, "absolute left-[190px] top-32 z-[2] h-[214px] w-[180px]")}>
              <div
                className={cn(
                  styles.qrFloat,
                  "relative flex h-full w-full flex-col items-center gap-2 rounded-[22px] border-2 border-plum bg-white p-4 shadow-hard"
                )}
              >
                <div className="relative h-[140px] w-[140px]">
                  <QrArt size={140} />
                  <div className={styles.scanline} />
                </div>
                <span className="font-hand text-[26px] font-bold leading-none">scan me!</span>
              </div>
            </div>

            {burst.map((piece, i) => (
              <div
                key={i}
                className={styles.burst}
                style={
                  {
                    "--x": `${piece.x}px`,
                    "--y": `${piece.y}px`,
                    "--rot": `${piece.rot}deg`,
                    background: piece.color,
                    width: piece.width,
                    height: piece.height,
                    borderRadius: piece.round ? "50%" : undefined,
                  } as CSSProperties
                }
              />
            ))}

            {/* box body */}
            <div
              className="absolute left-[155px] top-[340px] z-[3] h-[180px] w-[250px] rounded-[10px_10px_22px_22px] border-2 border-plum bg-ribbon-light shadow-[inset_-18px_0_0_rgba(35,20,46,.1)]"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,.28) 3px, transparent 3.5px)",
                backgroundSize: "26px 26px",
              }}
            >
              <div className="absolute left-[104px] top-[-2px] h-[180px] w-[42px] border-x-2 border-plum bg-gold" />
            </div>

            {/* lid and bow */}
            <div className={cn(styles.lid, "absolute left-[141px] top-[302px] z-[4] h-[60px] w-[278px]")}>
              <div className="absolute inset-0 rounded-[14px] border-2 border-plum bg-ribbon-lid" />
              <div className="absolute left-[117px] top-0 h-[60px] w-11 border-2 border-plum bg-gold" />
              <div className="absolute left-[66px] top-[-42px] h-[50px] w-[74px] -rotate-[22deg] rounded-full border-[12px] border-gold outline outline-2 outline-plum" />
              <div className="absolute left-[138px] top-[-42px] h-[50px] w-[74px] rotate-[22deg] rounded-full border-[12px] border-gold outline outline-2 outline-plum" />
              <div className="absolute left-[124px] top-[-14px] h-[26px] w-[30px] rounded-[10px] border-2 border-plum bg-gold" />
            </div>
          </div>
        </div>

        {/* items orbiting the box */}
        <div className="absolute left-[352px] top-10 z-[5] animate-pop-in" style={{ animationDelay: "1.6s" }}>
          <div className="animate-float">
            <div className="w-[190px] rotate-[5deg] rounded-[6px_22px_22px_22px] border-2 border-plum bg-gold px-[18px] py-4 shadow-[5px_5px_0_#23142E]">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.08em]">
                <MessageSquare size={14} strokeWidth={2.5} />
                Message
              </span>
              <span className="font-hand text-[25px] font-bold leading-[1.05]">You make ordinary days feel like holidays.</span>
            </div>
          </div>
        </div>
        <div className="absolute left-[400px] top-[250px] z-[5] animate-pop-in" style={{ animationDelay: "1.85s" }}>
          <div className="animate-float [animation-direction:reverse] [animation-duration:7s]">
            <div className="w-[150px] -rotate-[7deg] rounded-lg bg-white px-2 pb-2.5 pt-2 shadow-[0_16px_30px_-14px_rgba(35,20,46,.55)]">
              <BirthdayScene className="block h-[120px] w-[134px] rounded" />
              <span className="mt-1 block text-center font-hand text-xl font-bold">best. birthday. ever.</span>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-[248px] z-[5] animate-pop-in" style={{ animationDelay: "2.1s" }}>
          <div
            className="flex animate-float items-center gap-2.5 rounded-full border-2 border-plum bg-white py-2 pl-2 pr-[18px] shadow-hard-sm"
            style={{ animationDelay: "1s" }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ribbon text-white">
              <LinkIcon size={16} strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-[1.15]">
              <b className="text-sm">Our song, on repeat</b>
              <span className="text-xs text-plum-sub">open.spotify.com</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
