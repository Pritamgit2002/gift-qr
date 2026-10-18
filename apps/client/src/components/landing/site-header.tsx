import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/brand/button";

const navLink =
  "rounded-full px-4 py-3 text-[15px] font-medium text-plum transition-colors duration-200 hover:bg-peach";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="relative z-20 pt-5">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 sm:px-8">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 min-[861px]:flex">
          <a className={navLink} href="/#how">
            How it works
          </a>
          <a className={navLink} href="/#demo">
            Try a scan
          </a>
          <a className={navLink} href="/#pricing">
            Pricing
          </a>
          <a className={navLink} href="/#story">
            Our story
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <Link className={buttonVariants({ size: "sm" })} href="/create-qr">
              My lists
            </Link>
          ) : (
            <>
              <Link className={navLink} href="/sign-in">
                Sign in
              </Link>
              <Link className={buttonVariants({ size: "sm" })} href="/sign-in">
                Make a GiftQR
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
