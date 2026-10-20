"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, MessageSquare, Mic, Play } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AudioPlayer } from "@/components/audio/audio-player";
import { cn } from "@/lib/utils";
import styles from "./reveal.module.css";

export type Surprise =
  | { kind: "message"; text: string }
  | { kind: "photo"; url: string; name: string }
  | { kind: "audio"; url: string; name: string; duration?: number }
  | { kind: "link"; url: string; host: string };

/** How long the link card shows before the link opens, matching its progress bar. */
const LINK_DELAY_MS = 4200;

const burst = [
  { x: -160, y: -420, r: 240, color: "#FFC23D" },
  { x: -90, y: -500, r: -200, color: "#FF5A6E" },
  { x: -20, y: -540, r: 300, color: "#23142E", width: 7 },
  { x: 50, y: -520, r: -260, color: "#FFC23D", round: true, width: 11, height: 11 },
  { x: 120, y: -470, r: 180, color: "#FF5A6E" },
  { x: 170, y: -380, r: -300, color: "#F9B8C3" },
  { x: -180, y: -300, r: 150, color: "#F9B8C3", round: true, width: 10, height: 10 },
  { x: 180, y: -260, r: 260, color: "#FFC23D" },
  { x: -60, y: -380, r: -90, color: "#FFC23D", width: 7, height: 18 },
  { x: 80, y: -360, r: 120, color: "#23142E", round: true, width: 9, height: 9 },
];

/** Paper, spinning rays, the logo and the list's name. */
function Frame({ listName, children }: { listName: string; children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-paper">
      <div aria-hidden="true" className={styles.rays} />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col px-[22px] pb-[30px] pt-[22px]">
        <div className="flex items-center justify-between gap-3">
          <Logo size={28} />
          <span className="max-w-[60%] truncate rounded-full border-2 border-plum bg-white px-3 py-1.5 text-[13px] font-semibold">
            {listName}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

/** A page with nothing to unwrap: not found, not paid for, or empty. */
export function RevealNote({ listName, note, title, body }: { listName: string; note: string; title: string; body: string }) {
  return (
    <Frame listName={listName}>
      <div className="my-auto flex flex-col items-center gap-3.5 py-10 text-center">
        <span className="animate-rise font-hand text-3xl font-bold text-ribbon-deep">{note}</span>
        <h1 className="m-0 animate-rise font-display text-[38px] font-extrabold leading-[1.02] tracking-display">{title}</h1>
        <p className="m-0 animate-rise text-base leading-relaxed text-plum-body">{body}</p>
        <Link className={cn(styles.pill, "mt-3 bg-ribbon text-white hover:text-white")} href="/">
          Make your own
        </Link>
      </div>
    </Frame>
  );
}

export function Reveal({ listName, surprise }: { listName: string; surprise: Surprise }) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  // A link opens on its own once its card has had a moment on screen.
  useEffect(() => {
    if (!opened || surprise.kind !== "link") return;
    const timer = setTimeout(() => window.location.assign(surprise.url), LINK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [opened, surprise]);

  // Wrapping it again draws a fresh item for the next unwrap.
  const wrapAgain = () => {
    setOpened(false);
    router.refresh();
  };

  if (!opened) {
    return (
      <Frame listName={listName}>
        <div className="mt-12 flex flex-col items-center gap-3.5 px-1.5 text-center">
          <span className="animate-rise font-hand text-3xl font-bold text-ribbon-deep">psst…</span>
          <h1
            className="m-0 animate-rise font-display text-[40px] font-extrabold leading-[1.02] tracking-display"
            style={{ animationDelay: ".1s" }}
          >
            Someone packed a surprise for you.
          </h1>
        </div>
        <button
          type="button"
          className={cn(styles.tap, "relative mx-auto mt-auto h-[300px] w-[240px] flex-none")}
          aria-label="Tap to unwrap your surprise"
          onClick={() => setOpened(true)}
        >
          <ClosedBox />
        </button>
        <div className="mt-6 flex animate-bounce flex-col items-center gap-1.5">
          <ArrowUp size={22} strokeWidth={2.5} aria-hidden="true" />
          <span className="text-[17px] font-bold">Tap the box to unwrap</span>
        </div>
      </Frame>
    );
  }

  return (
    <Frame listName={listName}>
      {/* the box opening, behind everything */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-16 left-1/2 -ml-[120px] h-[196px] w-[240px]">
        <div className={cn(styles.boxSink, "absolute left-2.5 top-9 h-40 w-[220px] rounded-[8px_8px_22px_22px] border-2 border-plum bg-ribbon-light")} />
        <div className={cn(styles.lidOff, "absolute left-0 top-0 h-[52px] w-[240px] rounded-xl border-2 border-plum bg-ribbon-lid")} />
        {burst.map((piece, i) => (
          <div
            key={i}
            className={styles.burst}
            style={
              {
                "--x": `${piece.x}px`,
                "--y": `${piece.y}px`,
                "--r": `${piece.r}deg`,
                background: piece.color,
                width: piece.width,
                height: piece.height,
                borderRadius: piece.round ? "50%" : undefined,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative mt-[74px] flex flex-col items-center gap-[18px]">
        <SurpriseCard surprise={surprise} />
      </div>

      <div className={cn(styles.after, "relative mt-auto flex flex-col items-center gap-3 pt-8 text-center")}>
        <span className="text-[15px] text-plum-body">Scan again later. It might be something else.</span>
        <div className="flex flex-wrap justify-center gap-2.5">
          <button type="button" className={cn(styles.pill, "bg-white text-plum shadow-outline")} onClick={wrapAgain}>
            Wrap it again
          </button>
          <Link className={cn(styles.pill, "bg-ribbon text-white hover:text-white")} href="/">
            Make your own
          </Link>
        </div>
      </div>
    </Frame>
  );
}

function SurpriseCard({ surprise }: { surprise: Surprise }) {
  if (surprise.kind === "message") {
    // Long notes get smaller type so they still fit the card.
    const size = surprise.text.length > 220 ? "text-[28px]" : surprise.text.length > 110 ? "text-[34px]" : "text-[44px]";
    return (
      <div
        className={cn(styles.cardUp, "w-full -rotate-2 rounded-[8px_32px_32px_32px] border-2 border-plum bg-gold px-[26px] pb-7 pt-[34px] shadow-hard-md")}
      >
        <span className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.1em]">
          <MessageSquare size={14} strokeWidth={2.5} aria-hidden="true" />A message for you
        </span>
        <p className={cn("m-0 max-h-[52vh] overflow-auto whitespace-pre-line break-words font-hand font-bold leading-none", size)}>
          {surprise.text}
        </p>
      </div>
    );
  }

  if (surprise.kind === "audio") {
    return (
      <div
        className={cn(styles.cardUp, "flex w-full -rotate-1 flex-col gap-4 rounded-[32px_32px_32px_8px] border-2 border-plum bg-white px-[22px] pb-[22px] pt-[26px] shadow-hard-md")}
      >
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.1em]">
          <Mic size={14} strokeWidth={2.5} aria-hidden="true" />A voice note for you
        </span>
        <p className="m-0 break-words font-hand text-[38px] font-bold leading-none">{surprise.name}</p>
        <AudioPlayer src={surprise.url} name={surprise.name} duration={surprise.duration} />
      </div>
    );
  }

  if (surprise.kind === "photo") {
    return (
      <figure className={cn(styles.cardUp, "m-0 rotate-2 rounded-xl bg-white px-3.5 pb-[18px] pt-3.5 shadow-[0_30px_50px_-22px_rgba(35,20,46,.6)]")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- user photos live on S3 */}
        <img src={surprise.url} alt={surprise.name} className="block h-[min(360px,50vh)] w-[min(300px,72vw)] rounded-md object-cover" />
        <figcaption className="mt-2.5 text-center font-hand text-[32px] font-bold leading-tight">{surprise.name}</figcaption>
      </figure>
    );
  }

  return (
    <div className={cn(styles.cardUp, "flex w-full flex-col gap-4")}>
      <span className="text-center font-display text-3xl font-extrabold leading-[1.05] tracking-display">
        Taking you somewhere special…
      </span>
      <div className="overflow-hidden rounded-[26px] border-2 border-plum bg-white shadow-hard-md">
        <div className="grid h-[190px] place-items-center bg-ribbon">
          <span className="grid h-[76px] w-[76px] place-items-center rounded-full bg-white">
            <Play size={30} fill="#D6284A" strokeWidth={0} aria-hidden="true" />
          </span>
        </div>
        <div className="px-[18px] py-4">
          <b className="block text-lg">{surprise.host}</b>
          <span className="block truncate text-sm text-plum-sub">{surprise.url}</span>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-md bg-line-track">
        <div className={styles.bar} />
      </div>
      <a className={cn(styles.pill, "self-center bg-plum text-white hover:text-white")} href={surprise.url} rel="noopener">
        Open it now
      </a>
    </div>
  );
}

function ClosedBox() {
  const part = "absolute block border-2 border-plum";
  return (
    <span className={cn(styles.idle, "absolute left-0 top-[60px] block h-[230px] w-[240px]")}>
      <span
        className={cn(part, "left-2.5 top-[70px] h-40 w-[220px] rounded-[8px_8px_22px_22px] bg-ribbon-light")}
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.28) 3px, transparent 3.5px)", backgroundSize: "24px 24px" }}
      />
      <span className="absolute left-[100px] top-[70px] block h-40 w-10 border-x-2 border-plum bg-gold" />
      <span className={cn(part, "left-0 top-[34px] h-[52px] w-[240px] rounded-xl bg-ribbon-lid")} />
      <span className={cn(part, "left-[99px] top-[34px] h-[52px] w-[42px] bg-gold")} />
      <span className="absolute left-[52px] top-[-2px] block h-[46px] w-[70px] -rotate-[22deg] rounded-full border-[12px] border-gold outline outline-2 outline-plum" />
      <span className="absolute left-[118px] top-[-2px] block h-[46px] w-[70px] rotate-[22deg] rounded-full border-[12px] border-gold outline outline-2 outline-plum" />
      <span className={cn(part, "left-[106px] top-[22px] h-6 w-7 rounded-[9px] bg-gold")} />
    </span>
  );
}
