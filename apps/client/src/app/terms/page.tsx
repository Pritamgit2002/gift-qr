import type { Metadata } from "next";
import Link from "next/link";
import { MIN_LIST_ITEMS } from "@giftqr/shared";
import { ContactDetails, EmailLink, LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { LEGAL, operatedBy } from "@/lib/legal";
import { GUEST_LIMITS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Terms of Service | GiftQR",
  description:
    "The agreement between you and GiftQR: accounts, your content, what's not allowed, payments, refunds, and how disputes are handled.",
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These Terms of Service are an agreement between you and {operatedBy()} (&quot;GiftQR&quot;, &quot;we&quot;,
          &quot;us&quot;), based in {LEGAL.location}. They cover your use of the website at {LEGAL.website} and every
          gift made with it.
        </p>
        <p>
          By signing in, making or paying for a gift, or opening one, you agree to these terms and to our{" "}
          <Link href="/privacy">Privacy Policy</Link>, <Link href="/cookies">Cookie Policy</Link> and{" "}
          <Link href="/refunds">Refund Policy</Link>. If you don&apos;t agree, please don&apos;t use GiftQR.
        </p>
        <p>
          This document is an electronic record under the Information Technology Act, 2000 and the rules made under it,
          and needs no physical or digital signature. It is published under rule 3(1) of the Information Technology
          (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, which asks us to publish our rules, privacy
          policy and user agreement.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who can use GiftQR",
    body: (
      <p>
        You must be at least 18 years old and able to enter a binding contract under the Indian Contract Act, 1872. If
        you use GiftQR for a business or another organisation, you confirm you are allowed to accept these terms for it.
      </p>
    ),
  },
  {
    id: "the-service",
    title: "What GiftQR does",
    body: (
      <>
        <p>
          You make a list of links, messages, photos, videos and audio clips, pay to unlock it, and get a QR code. Each
          time the code is scanned, it opens one item from the list at random.
        </p>
        <ul>
          <li>
            Once a list is paid for, new items go into a draft. Paying for the draft adds them to the same list, so the
            code you already shared keeps working.
          </li>
          <li>
            You can limit a gift to people you name by email address, and change who they are at any time, for free.
          </li>
          <li>
            A paid gift stays live for as long as GiftQR runs, unless you delete it or we remove it under these terms. If
            we ever close GiftQR, we will give at least 30 days&apos; notice on the site.
          </li>
        </ul>
        <p>
          We keep improving GiftQR, so features may change. We won&apos;t take away what you already paid for without
          offering a fix or a refund.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Accounts",
    body: (
      <ul>
        <li>
          <strong>Google accounts.</strong> You sign in with Google, so keep your Google account secure. You are
          responsible for what happens under your account. Tell us straight away if you think someone else is using it.
        </li>
        <li>
          <strong>Guests.</strong> Guests can make up to {GUEST_LIMITS.lists} free lists, with {GUEST_LIMITS.links}{" "}
          links and {GUEST_LIMITS.messages} messages each. A guest account is deleted when you sign out, and you
          can&apos;t get back into its lists after that, though their codes keep working.
        </li>
      </ul>
    ),
  },
  {
    id: "your-content",
    title: "Your content",
    body: (
      <>
        <p>
          You own what you put in your gifts. To run GiftQR, you give us a non-exclusive, worldwide, royalty-free licence
          to store, copy, process and show that content to you and to the people who open your gifts. The licence ends
          when you delete the content, apart from short-lived backups and copies other people already saved.
        </p>
        <p>By adding content, you confirm that:</p>
        <ul>
          <li>you have the right to share it, including any music, pictures or videos made by someone else;</li>
          <li>
            the people who appear in your photos, videos or recordings are happy for you to share them, and a parent or
            guardian is for any child;
          </li>
          <li>the people whose email addresses you add would expect a gift from you; and</li>
          <li>it follows these terms and the law.</li>
        </ul>
        <p>
          We don&apos;t check gifts before they are shared and aren&apos;t responsible for what users put in them, but we
          may remove anything that breaks these terms or the law.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "What's not allowed",
    body: (
      <>
        <p>You must not use GiftQR to host, show, upload, share or link to anything that:</p>
        <ol>
          <li>belongs to another person and you have no right to;</li>
          <li>
            is obscene, pornographic, paedophilic, or invades another person&apos;s privacy, including their bodily
            privacy;
          </li>
          <li>
            insults or harasses anyone on the basis of gender, is racially or ethnically objectionable, or relates to or
            encourages money laundering or gambling;
          </li>
          <li>is harmful to children;</li>
          <li>infringes a patent, trademark, copyright or other proprietary right;</li>
          <li>
            deceives or misleads people about where it came from, or knowingly shares misinformation or information that
            is patently false or misleading;
          </li>
          <li>impersonates another person, including with fake or digitally altered images, video or audio;</li>
          <li>
            threatens the unity, integrity, defence, security or sovereignty of India, India&apos;s friendly relations
            with other countries, or public order; incites any offence; prevents an investigation; or insults another
            nation;
          </li>
          <li>
            contains software viruses or any other code designed to interrupt, destroy or limit any computer resource;
          </li>
          <li>is phishing, a scam, spam, or a link to a harmful website; or</li>
          <li>breaks any law in force.</li>
        </ol>
        <p>You also must not:</p>
        <ul>
          <li>get around payments, limits or access controls, or open gifts you weren&apos;t meant to;</li>
          <li>access other people&apos;s accounts or data without permission;</li>
          <li>scrape, overload, probe or attack GiftQR, or interfere with how it works;</li>
          <li>copy or reverse engineer GiftQR, except where the law allows; or</li>
          <li>resell GiftQR without our written permission.</li>
        </ul>
        <p>
          To report a gift that breaks these rules, see <Link href="/contact#report">Report a gift</Link>.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing your gifts",
    body: (
      <p>
        A gift&apos;s QR code holds a web address that includes your email address and the list&apos;s name. Unless you
        limit a gift to certain people, anyone who has its code or address can open it. You decide who gets your codes,
        so share them with care. Our <Link href="/privacy#who-can-see-your-gifts">Privacy Policy</Link> explains this
        further.
      </p>
    ),
  },
  {
    id: "payments",
    title: "Prices and payment",
    body: (
      <ul>
        <li>
          Prices are per item and shown in our <Link href="/#pricing">pricing</Link> and at checkout, in Indian rupees,
          including any taxes that apply. The amount checkout shows is the amount you pay.
        </li>
        <li>
          A list needs at least {MIN_LIST_ITEMS} items before you can pay for it. Items added after that go into a draft,
          priced and paid for separately.
        </li>
        <li>Each payment is a one-time payment. There are no subscriptions and nothing renews automatically.</li>
        <li>
          Payments are processed by Razorpay, whose{" "}
          <a href="https://razorpay.com/terms/" target="_blank" rel="noopener noreferrer">
            terms
          </a>{" "}
          also apply. We never see or store your card, UPI or bank details.
        </li>
        <li>We unlock a list only after Razorpay confirms the payment.</li>
        <li>If our prices change, lists you have already paid for are not affected.</li>
      </ul>
    ),
  },
  {
    id: "refunds",
    title: "Cancellations and refunds",
    body: (
      <p>
        You can cancel any time before paying. Once a gift unlocks, the service has been delivered, but we refund in full
        when something goes wrong on our side, such as a payment taken twice or a list that didn&apos;t unlock. Our{" "}
        <Link href="/refunds">Refund Policy</Link> has the details.
      </p>
    ),
  },
  {
    id: "removal",
    title: "Removing content and accounts",
    body: (
      <>
        <p>
          We may remove content, or suspend or close an account, if it breaks these terms or the law, if a court or
          government agency lawfully orders us to, or to protect other people. We act on court orders, lawful government
          notices and complaints about intimate images shared without consent within the times the law sets. Where we
          reasonably can, we&apos;ll tell you why and give you a chance to respond.
        </p>
        <p>
          If we remove a paid gift because it broke these terms, we don&apos;t refund it. We may keep information about
          the removal as the law requires. You can stop using GiftQR whenever you like and delete your lists.
        </p>
      </>
    ),
  },
  {
    id: "our-rights",
    title: "Our intellectual property",
    body: (
      <p>
        The GiftQR name, logo, illustrations, design and code belong to us and are protected by law. These terms let you
        use GiftQR, but don&apos;t give you any other rights in it. If you send us feedback, we may use it without owing
        you anything.
      </p>
    ),
  },
  {
    id: "other-services",
    title: "Other services and links",
    body: (
      <p>
        GiftQR relies on other services, such as Google for sign-in and Razorpay for payments, and gifts can link to any
        website. Their own terms apply to them, and we aren&apos;t responsible for their content, availability or
        practices.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <p>
        We work hard to keep GiftQR running well, but we provide it &quot;as is&quot; and &quot;as available&quot;. To
        the extent the law allows, we don&apos;t promise that it will always be available or free of errors, that every
        device or app will read its codes, or that the websites your gifts link to will keep working. Nothing in these
        terms takes away the rights you have as a consumer under the Consumer Protection Act, 2019 or any other law.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limits on our liability",
    body: (
      <>
        <p>To the extent the law allows:</p>
        <ul>
          <li>
            we are not liable for indirect or consequential losses, such as lost profits, lost data or a spoiled
            occasion; and
          </li>
          <li>
            our total liability to you for any claim is limited to the amount you paid GiftQR in the 12 months before
            the event that led to it.
          </li>
        </ul>
        <p>These limits don&apos;t apply to liability that the law doesn&apos;t allow us to limit, such as for fraud.</p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Your responsibility to us",
    body: (
      <p>
        If someone makes a claim against us because of content you added, or because you broke these terms or the law,
        you agree to cover the reasonable costs and losses that result, including legal fees.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "Governing law and disputes",
    body: (
      <>
        <p>
          These terms are governed by the laws of India. If something goes wrong, please contact us first. Most problems
          can be solved quickly by email.
        </p>
        <p>
          If we can&apos;t resolve it within 30 days, the courts at {LEGAL.courts} have exclusive jurisdiction. This
          doesn&apos;t limit your right as a consumer to approach the National Consumer Helpline or a Consumer Commission
          under the Consumer Protection Act, 2019, as described on our <Link href="/contact">Contact</Link> page.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms as GiftQR or the law changes, and we update the date at the top when we do. For a
        significant change, we&apos;ll show a notice on GiftQR before it takes effect. If you keep using GiftQR after
        that, the new terms apply; if you don&apos;t agree with them, stop using GiftQR and delete your lists.
      </p>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <ul>
        <li>
          These terms, with the policies they mention, are the whole agreement between you and us about GiftQR.
        </li>
        <li>If a court finds part of them unenforceable, the rest still applies.</li>
        <li>If we don&apos;t enforce a right straight away, we haven&apos;t given it up.</li>
        <li>
          You can&apos;t transfer your rights under these terms. We may transfer ours if GiftQR is sold or merged, and
          your rights stay the same.
        </li>
        <li>
          We aren&apos;t responsible for delays or failures caused by events beyond our reasonable control, such as
          outages at our providers, natural disasters or government action.
        </li>
        <li>
          We send notices to the email address on your account or show them on GiftQR. Send yours to{" "}
          <EmailLink subject="Legal notice" />.
        </li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Contact and grievances",
    body: (
      <>
        <p>
          Questions about these terms, or complaints about GiftQR or a gift, go to our Grievance Officer. We acknowledge
          complaints within 24 hours and resolve them within 15 days.
        </p>
        <ContactDetails />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      href="/terms"
      title="Terms of Service"
      intro="The agreement between you and GiftQR: what we provide, what we ask of you, and what happens if something goes wrong."
      summary={[
        "You must be 18 or over to use GiftQR.",
        "You own what you put in your gifts. We only use it to run GiftQR.",
        "Don't upload anything you don't have the right to share, or anything harmful, hateful, sexual, misleading or illegal.",
        "You pay once per list, in rupees, through Razorpay. No subscriptions.",
        "Anyone with an open gift's code can open it, so share codes with care.",
        "Indian law applies, and your consumer rights are never taken away.",
      ]}
      sections={sections}
    />
  );
}
