import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const footerLink = "py-2.5 text-paper hover:text-gold";

export function SiteFooter() {
  return (
    <footer className="bg-plum pb-10 pt-14 text-paper">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-start justify-between gap-8 px-4 sm:px-8">
        <div className="flex max-w-[340px] flex-col gap-3">
          <Logo size={36} href={null} />
          <span className="leading-relaxed text-plum-mist">Links, messages and photos, wrapped in one QR code.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2">
          <Link className={footerLink} href="/#how">
            How it works
          </Link>
          <Link className={footerLink} href="/#pricing">
            Pricing
          </Link>
          <Link className={footerLink} href="/#story">
            Our story
          </Link>
          <Link className={footerLink} href="/policy">
            Privacy policy
          </Link>
        </nav>
      </div>
      <div className="mx-auto mt-10 w-full max-w-[1240px] px-4 sm:px-8">
        <div className="border-t border-white/[.14] pt-6 text-sm text-plum-haze">
          © {new Date().getFullYear()} GiftQR. Made with love and a lot of ribbon.
        </div>
      </div>
    </footer>
  );
}
