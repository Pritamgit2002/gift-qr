import type { Metadata } from "next";
import Link from "next/link";
import {
  ContactDetails,
  FactCard,
  FactCards,
  LegalPage,
  type LegalSection,
} from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy | GiftQR",
  description:
    "GiftQR sets only the essential cookies that keep you signed in and secure. No analytics, advertising or tracking cookies.",
};

/** The cookies Auth.js sets, by their names over plain HTTP. */
const COOKIES = [
  {
    name: "authjs.session-token",
    when: "When you sign in",
    purpose:
      "Keeps you signed in. It is encrypted and signed, holds your name, email address, profile photo link and account type, and can't be read by scripts on the page. A large one is split into parts ending .0, .1 and so on.",
    lasts: "30 days after your last visit, or until you sign out",
  },
  {
    name: "authjs.csrf-token",
    when: "When you sign in or out",
    purpose: "Protects signing in and out from cross-site request forgery, where another site tries to act as you.",
    lasts: "Until you close your browser",
  },
  {
    name: "authjs.callback-url",
    when: "When you sign in",
    purpose: "Remembers which page to take you to once you're signed in.",
    lasts: "Until you close your browser",
  },
  {
    name: "authjs.pkce.code_verifier",
    when: "When you sign in with Google",
    purpose: "Secures the hand-off between GiftQR and Google, so nobody can intercept your sign-in.",
    lasts: "15 minutes",
  },
];

const BROWSER_HELP = [
  { name: "Chrome", href: "https://support.google.com/chrome/answer/95647" },
  { name: "Safari", href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
  { name: "Firefox", href: "https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox" },
  {
    name: "Edge",
    href: "https://support.microsoft.com/en-us/edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use",
  },
];

const sections: LegalSection[] = [
  {
    id: "what-cookies-are",
    title: "What cookies are",
    body: (
      <p>
        Cookies are small text files a website asks your browser to keep, so it can recognise you from one page to the
        next. This policy covers cookies and similar technologies, such as your browser&apos;s local storage, on GiftQR.
        Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal data more broadly.
      </p>
    ),
  },
  {
    id: "our-cookies",
    title: "The cookies GiftQR sets",
    body: (
      <>
        <p>
          GiftQR sets <strong>only strictly necessary cookies</strong>, and only when you sign in or out. Browsing the
          site, or opening a gift that anyone can open, sets no cookies at all. We don&apos;t use local storage or similar
          technologies to identify you.
        </p>
        <FactCards>
          {COOKIES.map((cookie) => (
            <FactCard
              key={cookie.name}
              title={<code>{cookie.name}</code>}
              facts={[
                ["Set", cookie.when],
                ["Purpose", cookie.purpose],
                ["Lasts", cookie.lasts],
                ["Set by", "GiftQR"],
              ]}
            />
          ))}
        </FactCards>
        <p>
          On our live site the names start with <code>__Secure-</code> or <code>__Host-</code>, such as{" "}
          <code>__Secure-authjs.session-token</code>. That prefix tells your browser to send the cookie only over an
          encrypted connection.
        </p>
      </>
    ),
  },
  {
    id: "other-services",
    title: "Cookies from other services",
    body: (
      <>
        <p>Some steps take you to, or load content from, another company. Their cookies are covered by their policies.</p>
        <ul>
          <li>
            <strong>Google.</strong> Signing in with Google happens on Google&apos;s own pages, which use Google&apos;s
            cookies. Your profile photo also loads from Google&apos;s servers. See{" "}
            <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
              how Google uses cookies
            </a>
            .
          </li>
          <li>
            <strong>Razorpay.</strong> When you pay, Razorpay&apos;s checkout opens over GiftQR and may set its own
            cookies or use local storage to process your payment and prevent fraud. See{" "}
            <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
              Razorpay&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            <strong>Amazon Web Services.</strong> Photos, videos and audio clips load straight from Amazon S3, which sees
            your network address but doesn&apos;t set cookies for this.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "what-we-dont-use",
    title: "What we don't use",
    body: (
      <>
        <p>
          No analytics cookies, no advertising or retargeting cookies, no social media pixels, and no tracking across
          other websites. Our fonts are served from GiftQR itself, so loading a page doesn&apos;t contact Google Fonts.
        </p>
        <p>
          Because every cookie we set is strictly necessary for something you asked for, we don&apos;t show a cookie
          consent banner. If we ever want to add optional cookies, we will ask for your consent first and update this
          policy.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "Controlling cookies",
    body: (
      <>
        <p>
          You can see, block and delete cookies in your browser&apos;s settings. If you block GiftQR&apos;s cookies, you
          won&apos;t be able to sign in, but you can still open gifts that anyone can open. Here&apos;s how in:
        </p>
        <ul>
          {BROWSER_HELP.map((browser) => (
            <li key={browser.name}>
              <a href={browser.href} target="_blank" rel="noopener noreferrer">
                {browser.name}
              </a>
            </li>
          ))}
        </ul>
        <p>
          Signing out deletes the session cookie straight away. Since we don&apos;t track you, &quot;Do Not
          Track&quot; and Global Privacy Control signals have nothing to switch off.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If the cookies we use change, we update this page and the date at the top. If we ever add cookies that
        aren&apos;t strictly necessary, we&apos;ll ask before setting them.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>Questions about cookies? Write to us.</p>
        <ContactDetails />
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      href="/cookies"
      title="Cookie Policy"
      intro="GiftQR uses a handful of essential cookies to sign you in and keep that safe. Here is every one of them."
      summary={[
        `We set ${COOKIES.length} cookies, all strictly necessary, and only when you sign in or out.`,
        "No analytics, advertising or tracking cookies, ever.",
        "Opening a gift that anyone can open sets no cookies at all.",
        "Google and Razorpay set their own cookies when you sign in or pay on their pages.",
      ]}
      sections={sections}
    />
  );
}
