import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LEGAL_PAGES } from "@/lib/legal";

const footerLink = "py-1.5 text-paper hover:text-gold";
const footerHeading = "m-0 mb-2 text-sm font-bold uppercase tracking-[.12em] text-plum-haze";

export function SiteFooter() {
  return (
    <footer className="bg-plum pb-10 pt-14 text-paper">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-start justify-between gap-10 px-4 sm:px-8">
        <div className="flex max-w-[340px] flex-col gap-3">
          <Logo size={36} href={null} />
          <span className="leading-relaxed text-plum-mist">Links, messages, photos, videos and audio, wrapped in one QR code.</span>
        </div>
        <div className="flex flex-wrap gap-x-20 gap-y-8">
          <nav aria-labelledby="footer-giftqr" className="flex flex-col">
            <h2 id="footer-giftqr" className={footerHeading}>
              GiftQR
            </h2>
            <Link className={footerLink} href="/#how">
              How it works
            </Link>
            <Link className={footerLink} href="/#pricing">
              Pricing
            </Link>
            <Link className={footerLink} href="/#story">
              Our story
            </Link>
          </nav>
          <nav aria-labelledby="footer-legal" className="flex flex-col">
            <h2 id="footer-legal" className={footerHeading}>
              Legal
            </h2>
            {LEGAL_PAGES.map((page) => (
              <Link key={page.href} className={footerLink} href={page.href}>
                {page.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-[1240px] px-4 sm:px-8">
        <div className="border-t border-white/[.14] pt-6 text-sm text-plum-haze">
          © {new Date().getFullYear()} GiftQR. Made with love and a lot of ribbon.
        </div>
      </div>
    </footer>
  );
}
