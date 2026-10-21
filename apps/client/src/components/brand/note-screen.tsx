import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { Sparkle } from "@/components/brand/art";

/** A full-screen note for pages with nothing else to show: a handwritten kicker, a headline, one line and its buttons. */
export function NoteScreen({
  note,
  title,
  body,
  children,
}: {
  note: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-paper">
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-5 sm:px-8">
        <Logo />
      </div>
      <main className="relative mx-auto my-auto flex w-full max-w-[520px] flex-col items-center gap-3.5 px-4 py-16 text-center">
        <Sparkle size={34} className="absolute left-2 top-4 animate-twinkle sm:-left-6" />
        <Sparkle size={22} fill="#FF5A6E" className="absolute bottom-8 right-4 animate-twinkle [animation-delay:1.2s] sm:-right-4" />
        <span className="animate-rise font-hand text-3xl font-bold text-ribbon-deep">{note}</span>
        <h1
          className="m-0 animate-rise font-display text-[38px] font-extrabold leading-[1.02] tracking-display sm:text-[48px]"
          style={{ animationDelay: ".1s" }}
        >
          {title}
        </h1>
        <p className="m-0 animate-rise text-base leading-relaxed text-plum-body sm:text-lg" style={{ animationDelay: ".2s" }}>
          {body}
        </p>
        <div className="mt-3 flex animate-rise flex-wrap justify-center gap-2.5" style={{ animationDelay: ".3s" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
