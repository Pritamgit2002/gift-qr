import Link from "next/link";
import { redirect } from "next/navigation";
import { Image as ImageIcon, Info, Link as LinkIcon, MessageSquare } from "lucide-react";
import { auth } from "../../../auth";
import { Logo } from "@/components/brand/logo";
import { MiniQr, Sparkle } from "@/components/brand/art";
import { FallingConfetti } from "@/components/brand/confetti";
import { cn } from "@/lib/utils";
import { SignInButtons } from "./sign-in-buttons";
import styles from "./sign-in.module.css";

export const metadata = { title: "Sign in · GiftQR" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if ((await auth())?.user) redirect("/create-qr");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-wrap gap-5 bg-paper p-5">
      <ArtPanel />

      <main className="flex min-w-0 flex-[1_1_440px] items-center justify-center px-2 py-6">
        <div className={cn(styles.cardIn, "flex w-full max-w-[440px] flex-col gap-[26px]")}>
          <Logo size={36} className="md:hidden" />
          <div className="flex flex-col gap-2.5">
            <span className="animate-rise font-hand text-3xl font-bold text-ribbon-deep" style={{ animationDelay: ".4s" }}>
              hello there <span className={styles.wave}>✦</span>
            </span>
            <h1
              className="m-0 animate-rise font-display text-[52px] font-extrabold leading-none tracking-display"
              style={{ animationDelay: ".5s" }}
            >
              Let&apos;s wrap something.
            </h1>
            <p className="m-0 animate-rise text-lg leading-[1.55] text-plum-body" style={{ animationDelay: ".6s" }}>
              Sign in to build your lists and unlock their QR codes.
            </p>
          </div>

          {error && (
            <p role="alert" className="m-0 rounded-[18px] bg-peach px-[18px] py-4 font-semibold text-ribbon-dark">
              That sign-in didn&apos;t work. Please try again.
            </p>
          )}

          <div className="animate-rise" style={{ animationDelay: ".7s" }}>
            <SignInButtons />
          </div>

          <div
            className="flex animate-rise items-start gap-3 rounded-[18px] bg-white px-[18px] py-4 text-[15px] leading-[1.55] text-plum-body"
            style={{ animationDelay: ".85s" }}
          >
            <Info size={20} strokeWidth={2.4} className="mt-0.5 flex-none text-ribbon-deep" aria-hidden="true" />
            <span>Guests can make up to two free lists, with two links and two messages each.</span>
          </div>

          <p className="m-0 animate-rise text-sm text-plum-mute" style={{ animationDelay: ".95s" }}>
            By continuing you agree to our{" "}
            <Link className="text-ribbon-deep underline hover:text-ribbon-dark" href="/terms">
              terms
            </Link>{" "}
            and{" "}
            <Link className="text-ribbon-deep underline hover:text-ribbon-dark" href="/privacy">
              privacy policy
            </Link>
            , and to the{" "}
            <Link className="text-ribbon-deep underline hover:text-ribbon-dark" href="/cookies">
              essential cookies
            </Link>{" "}
            that keep you signed in.{" "}
            <Link className="text-ribbon-deep underline hover:text-ribbon-dark" href="/">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function ArtPanel() {
  const orbitIcon = "grid h-14 w-14 place-items-center rounded-[18px]";
  return (
    <section
      aria-hidden="true"
      className="relative flex min-h-[560px] min-w-0 flex-[1_1_520px] flex-col justify-between overflow-hidden rounded-[36px] bg-plum p-10 max-md:hidden"
    >
      <FallingConfetti
        pieces={[
          { left: 8, color: "#FFC23D", duration: 9 },
          { left: 22, color: "#FF5A6E", duration: 11, delay: 3 },
          { left: 38, color: "#F9B8C3", duration: 10, delay: 1, round: true, width: 8, height: 8 },
          { left: 61, color: "#FFC23D", duration: 12, delay: 5 },
          { left: 79, color: "#FF5A6E", duration: 9.5, delay: 2 },
          { left: 92, color: "#F9B8C3", duration: 13, delay: 6 },
        ]}
      />

      <Logo size={36} href={null} className="relative text-paper" />

      <div className="relative h-[380px] w-[380px] self-center">
        <div className={cn(styles.pulseRing, "absolute left-[110px] top-[110px] h-40 w-40 rounded-full border-2 border-gold")} />
        <div
          className={cn(styles.pulseRing, "absolute left-[110px] top-[110px] h-40 w-40 rounded-full border-2 border-ribbon-light")}
          style={{ animationDelay: "1.2s" }}
        />
        <svg width="380" height="380" viewBox="0 0 380 380" className="absolute inset-0">
          <circle cx="190" cy="190" r="150" fill="none" stroke="rgba(255,246,241,.25)" strokeWidth="2" strokeDasharray="3 12" strokeLinecap="round" />
        </svg>

        {/* the gift tag in the middle */}
        <div className="absolute left-[130px] top-[60px] flex w-[120px] flex-col items-center">
          <div className="h-[70px] w-0.5 bg-gold" />
          <div className={cn(styles.swing, "relative -mt-0.5 w-[130px] rounded-[16px_16px_22px_22px] bg-paper px-3 pb-4 pt-[18px] text-center")}>
            <div className="mx-auto mb-2 h-3.5 w-3.5 rounded-full bg-plum" />
            <div className="mx-auto w-fit">
              <MiniQr size={64} />
            </div>
            <span className="mt-1.5 block font-hand text-2xl font-bold text-plum">to: you</span>
          </div>
        </div>

        <div className={cn(styles.orbit, "absolute inset-0")}>
          <div className="absolute left-[162px] top-3">
            <div className={cn(styles.counter, orbitIcon, "bg-ribbon text-white")}>
              <LinkIcon size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="absolute left-[292px] top-[248px]">
            <div className={cn(styles.counter, orbitIcon, "bg-gold text-plum")}>
              <MessageSquare size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="absolute left-8 top-[248px]">
            <div className={cn(styles.counter, orbitIcon, "bg-paper text-plum")}>
              <ImageIcon size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <Sparkle size={24} className="absolute left-5 top-10 animate-twinkle" />
        <Sparkle size={18} fill="#FF5A6E" className="absolute left-[340px] top-[90px] animate-twinkle" style={{ animationDelay: "1s" }} />
      </div>

      <p className="relative m-0 max-w-[520px] font-display text-[clamp(30px,3.4vw,46px)] font-extrabold leading-[1.05] tracking-display text-paper">
        Someone&apos;s about to get a <span className="text-gold">very</span> good scan.
      </p>
    </section>
  );
}
