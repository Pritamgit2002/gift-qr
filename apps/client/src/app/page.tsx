import { auth } from "../../auth";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Occasions } from "@/components/landing/occasions";
import { ScanDemo } from "@/components/landing/scan-demo";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Gallery } from "@/components/landing/gallery";
import { Pricing } from "@/components/landing/pricing";
import { Story } from "@/components/landing/story";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";

export default async function Home() {
  const session = await auth();
  const signedIn = Boolean(session?.user);
  // Signed-in visitors go straight to their lists.
  const startHref = signedIn ? "/create-qr" : "/sign-in";

  // clip, not hidden: a hidden overflow makes a scroll container, and the
  // scroll-driven reveals would then track it instead of the window.
  return (
    <div className="overflow-x-clip">
      <SiteHeader signedIn={signedIn} />
      <main>
        <Hero startHref={startHref} />
        <Occasions />
        <ScanDemo />
        <HowItWorks />
        <Gallery />
        <Pricing startHref={startHref} />
        <Story />
        <Faq />
        <FinalCta startHref={startHref} />
      </main>
      <SiteFooter />
    </div>
  );
}
