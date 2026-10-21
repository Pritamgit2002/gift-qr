"use client";

import { useState } from "react";
import { Image as ImageIcon, Link as LinkIcon, Loader2, MessageSquare, Play, RotateCw } from "lucide-react";
import { buttonVariants } from "@/components/brand/button";
import { GiftMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { BirthdayScene, ScanSmileScene, type Scene } from "@/components/brand/scenes";
import styles from "./landing.module.css";

type Surprise =
  | { kind: "message"; list: string; text: string; sub: string }
  | { kind: "photo"; list: string; text: string; Scene: Scene }
  | { kind: "link"; list: string; text: string; sub: string };

// Sample scans: the real page picks one item from the list at random.
const surprises: Surprise[] = [
  { kind: "message", list: "Mom's 60th", text: "Everything good in me started with you.", sub: "— with love, from all of us" },
  { kind: "photo", list: "Our anniversary", text: "best. birthday. ever.", Scene: BirthdayScene },
  { kind: "link", list: "Our anniversary", text: "The song from our first dance", sub: "youtube.com" },
  { kind: "message", list: "Long distance", text: "Look up. I am probably smiling at you right now.", sub: "— see you in 12 days" },
  { kind: "photo", list: "Just because", text: "your face when you scanned this", Scene: ScanSmileScene },
  { kind: "link", list: "Just because", text: "A playlist for your drive home", sub: "open.spotify.com" },
];

const kinds = [
  {
    kind: "link",
    title: "A link opens",
    body: "A song, a video, a playlist, a page of memories.",
    iconBg: "bg-peach",
    icon: <LinkIcon size={24} strokeWidth={2.4} className="text-ribbon-deep" />,
  },
  {
    kind: "message",
    title: "A message appears",
    body: "A note in your words, shown big and warm.",
    iconBg: "bg-gold-cream",
    icon: <MessageSquare size={24} strokeWidth={2.4} className="text-[#8A5A00]" />,
  },
  {
    kind: "photo",
    title: "A photo is shown",
    body: "A picture that fills the whole screen.",
    iconBg: "bg-lilac",
    icon: <ImageIcon size={24} strokeWidth={2.4} className="text-plum" />,
  },
] as const;

export function ScanDemo() {
  const [scan, setScan] = useState(0);
  const current = surprises[scan % surprises.length];

  return (
    <section id="demo" className="py-20">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-14 px-4 sm:px-8">
        <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
          <span className="scroll-rise text-sm font-bold uppercase tracking-[.12em] text-ribbon-deep">Try a scan</span>
          <h2 className="scroll-rise m-0 font-display text-[clamp(38px,5vw,64px)] font-extrabold leading-none tracking-display">
            One code.
            <br />A new surprise every scan.
          </h2>
          <p className="scroll-rise-2 m-0 max-w-[520px] text-[19px] leading-relaxed text-plum-body">
            Each scan picks one item from the list at random. Press the button and see what they might get.
          </p>
          <ul className="scroll-rise-3 m-0 mt-2 flex list-none flex-col gap-2.5 p-0">
            {kinds.map((item) => (
              <li key={item.kind} className={cn(styles.kind, current.kind === item.kind && styles.kindOn)}>
                <span className={cn(styles.kindIcon, item.iconBg)} aria-hidden="true">
                  {item.icon}
                </span>
                <span>
                  <b className="mb-0.5 block text-[19px]">{item.title}</b>
                  <span className="text-plum-body">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-[18px]">
            <button
              className={cn(buttonVariants({ size: "lg" }), styles.scanButton)}
              type="button"
              onClick={() => setScan((n) => n + 1)}
            >
              <RotateCw size={20} strokeWidth={2.5} aria-hidden="true" />
              Scan again
            </button>
            <span className="text-[15px] text-plum-body" aria-live="polite">
              Scan no. <b className="text-plum">{scan + 1}</b>
            </span>
          </div>
        </div>

        {/* phone */}
        <div className="scroll-pop mx-auto flex min-w-0 flex-[0_1_340px] justify-center">
          <div className="h-[640px] w-[320px] rotate-3 rounded-[52px] bg-plum p-3 shadow-phone">
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[40px] bg-paper">
              <div className="flex justify-center pt-2.5" aria-hidden="true">
                <div className="h-[26px] w-24 rounded-full bg-plum" />
              </div>
              <div className="flex items-center gap-2 px-[22px] pt-4">
                <GiftMark size={24} />
                <span className="text-[13px] text-plum-body">
                  A surprise from <b className="text-plum">{current.list}</b>
                </span>
              </div>

              <div className="flex flex-1 items-center justify-center p-[18px]">
                {/* The key restarts the entrance animation on every scan. */}
                <div key={scan} className="w-full animate-card-in">
                  <DemoCard surprise={current} />
                </div>
              </div>
              <div className="px-[22px] pb-[26px] text-center text-[13px] text-plum-body">
                Scan again for another surprise
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoCard({ surprise }: { surprise: Surprise }) {
  if (surprise.kind === "message") {
    return (
      <div className="w-full -rotate-2 rounded-[8px_28px_28px_28px] border-2 border-plum bg-gold px-[22px] py-[26px] shadow-hard">
        <span className="block font-hand text-[34px] font-bold leading-[1.05]">{surprise.text}</span>
        <span className="mt-4 block text-[13px] font-semibold">{surprise.sub}</span>
      </div>
    );
  }
  if (surprise.kind === "photo") {
    return (
      <div className="mx-auto w-fit rotate-2 rounded-[10px] bg-white px-3 pb-4 pt-3 shadow-[0_24px_40px_-18px_rgba(35,20,46,.6)]">
        <surprise.Scene className="block h-[280px] w-[236px] rounded-md" label={surprise.text} />
        <span className="mt-2 block text-center font-hand text-[26px] font-bold">{surprise.text}</span>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-4">
      <span className="flex items-center gap-2.5 text-[15px] font-bold">
        <Loader2 size={20} strokeWidth={3} className="animate-spin text-ribbon" aria-hidden="true" />
        Opening your surprise…
      </span>
      <div className="overflow-hidden rounded-[22px] border-2 border-plum bg-white shadow-hard">
        <div className="grid h-[150px] place-items-center bg-ribbon">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white">
            <Play size={26} fill="#D6284A" strokeWidth={0} aria-hidden="true" />
          </span>
        </div>
        <div className="px-4 py-3.5">
          <b className="block text-base">{surprise.text}</b>
          <span className="text-[13px] text-plum-sub">{surprise.sub}</span>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-md bg-line-track">
        <div className={styles.progress} />
      </div>
    </div>
  );
}
