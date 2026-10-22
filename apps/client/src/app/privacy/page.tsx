import type { Metadata } from "next";
import Link from "next/link";
import {
  ContactDetails,
  EmailLink,
  FactCard,
  FactCards,
  LegalPage,
  type LegalSection,
} from "@/components/legal/legal-page";
import { LEGAL, operatedBy, PROCESSORS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | GiftQR",
  description:
    "What GiftQR collects when you make, pay for or open a gift, why we need it, who sees it, and your rights under India's DPDP Act.",
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          {operatedBy()} (&quot;GiftQR&quot;, &quot;we&quot;, &quot;us&quot;), is based in {LEGAL.location} and runs
          the website at {LEGAL.website}. GiftQR turns links, messages, photos, videos and audio clips into a gift
          behind one QR code.
        </p>
        <p>
          This policy explains what personal data we collect when you visit GiftQR, make or pay for a gift, or open one
          by scanning its code; what we do with it; who we share it with; and the choices and rights you have. For this
          data we are the <strong>Data Fiduciary</strong> under India&apos;s Digital Personal Data Protection Act, 2023
          (the &quot;DPDP Act&quot;), and the &quot;controller&quot; under laws such as the EU and UK GDPR. We also
          follow the Information Technology Act, 2000 and the rules made under it.
        </p>
        <p>
          Read it together with our <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <h3>When you sign in with Google</h3>
        <p>
          Google tells us your <strong>name</strong>, <strong>email address</strong> and a link to your{" "}
          <strong>profile photo</strong>. We never see your Google password, contacts, or anything else in your Google
          account.
        </p>
        <h3>When you try GiftQR as a guest</h3>
        <p>
          We make up a guest name and ID for you, such as &quot;Guest4821&quot;. We don&apos;t ask for your email
          address or any other detail.
        </p>
        <h3>What you put in a gift</h3>
        <p>
          The <strong>list name</strong>, and the <strong>links</strong>, <strong>messages</strong>,{" "}
          <strong>photos</strong>, <strong>videos</strong> and <strong>audio clips</strong> you add, with their file
          names. For audio, your browser works out a small loudness outline for the waveform before uploading.
        </p>
        <p>
          Files are stored exactly as you upload them, including any hidden details they carry, such as where and when a
          photo was taken. If you don&apos;t want the people who open your gift to get those details, remove them before
          uploading.
        </p>
        <h3>People you send a gift to</h3>
        <p>
          If you limit a gift to certain people, we store the <strong>email addresses</strong> you enter. We use them
          only to check who may open that gift and to list it for them when they sign in to GiftQR. We never email them
          or use their addresses for anything else. Only add people who would expect a gift from you.
        </p>
        <h3>When you pay</h3>
        <p>
          Razorpay runs our checkout. We pass it your name, and your email address if you signed in with Google, so it
          can fill in the form. Your card, UPI, bank or wallet details go straight to Razorpay and{" "}
          <strong>never reach our servers</strong>. Razorpay sends us back an order ID, a payment ID, the amount and
          whether the payment succeeded, and we store those with the list.
        </p>
        <h3>When you open a gift</h3>
        <p>
          Opening a gift that anyone can open needs no account, and we set no cookies. Opening a gift that is limited to
          certain people means signing in with Google, so we can check that your email address is one of them.
        </p>
        <h3>Technical data</h3>
        <p>
          When something goes wrong, our server records the error, the kind of request and the address it was for. For a
          scanned gift, that address includes the gift maker&apos;s email address and the list name. Our hosting and
          storage providers also keep standard request logs, such as your network (IP) address, browser type and the
          time, to run and protect their services. We set a few essential cookies, listed in our{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>
        <h3>What we don&apos;t collect</h3>
        <p>
          No analytics or advertising trackers, no precise location, no contacts, no data from other apps, and nothing
          about you bought from data brokers.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <>
        <ul>
          <li>
            <strong>To run GiftQR:</strong> signing you in, saving your lists and files, making QR codes, and showing an
            item when a code is scanned.
          </li>
          <li>
            <strong>To take payments</strong>, check them with Razorpay, unlock what you paid for, and handle refunds.
          </li>
          <li>
            <strong>To control access</strong> to gifts limited to certain people.
          </li>
          <li>
            <strong>To keep GiftQR safe:</strong> preventing fraud, abuse and spam, and finding and fixing errors.
          </li>
          <li>
            <strong>To talk to you:</strong> answering your messages, and telling you about your account or payments
            when we need to. We don&apos;t send marketing.
          </li>
          <li>
            <strong>To follow the law:</strong> keeping records that tax and accounting laws require, and answering
            lawful requests from courts and authorities.
          </li>
        </ul>
        <p>
          We don&apos;t sell your personal data, use it for advertising, use your gifts to train AI models, or make
          automated decisions about you that have legal or similarly significant effects.
        </p>
        <h3>Our legal basis</h3>
        <p>
          Under the DPDP Act, we process your personal data with your <strong>consent</strong>, which you give when you
          sign in, add content or pay after being shown this policy, and for the <strong>legitimate uses</strong> the
          Act allows, such as meeting a legal obligation. If the GDPR or a similar law applies to you, we rely on
          performing our contract with you (running GiftQR and taking payments), our legitimate interests (keeping
          GiftQR secure and working), our legal obligations, and your consent where we ask for it.
        </p>
        <p>
          You can withdraw your consent at any time, as easily as you gave it (see{" "}
          <a href="#your-rights">Your rights and choices</a>). That doesn&apos;t undo anything done before, and without
          it we may not be able to keep providing GiftQR to you.
        </p>
      </>
    ),
  },
  {
    id: "who-can-see-your-gifts",
    title: "Who can see your gifts",
    body: (
      <>
        <p>Please read this before you share a code. A gift is only as private as the way you share it.</p>
        <ul>
          <li>
            A gift&apos;s QR code holds a web address of the form{" "}
            <code>{LEGAL.website}/&lt;your email&gt;/&lt;list name&gt;</code>. Anyone who has the code or the address can
            see your email address and the list&apos;s name in it.
          </li>
          <li>
            If you don&apos;t limit a gift, <strong>anyone with the code or address can open it</strong>, one random
            item per scan. Share it the way you would share a private link.
          </li>
          <li>
            If you limit a gift to certain people, only you and they can open it, after signing in with Google. They will
            see your name and email address next to the gift.
          </li>
          <li>Until a list is paid for, scanning its code shows none of its items.</li>
          <li>Gift pages ask search engines not to list them, and we don&apos;t publish a directory of gifts.</li>
          <li>
            Photos, videos and audio clips are served through private links that stop working after an hour. Anyone who
            opens a gift can still save or screenshot what they see.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We share personal data only with the service providers that help us run GiftQR, who may use it only to provide
          their service to us, and where the law requires it.
        </p>
        <FactCards>
          {PROCESSORS.map((processor) => (
            <FactCard
              key={processor.name}
              title={processor.name}
              facts={[
                ["Does", processor.role],
                ["Gets", processor.data],
                [
                  "Policy",
                  processor.policy && (
                    <a href={processor.policy} target="_blank" rel="noopener noreferrer">
                      Their privacy policy
                    </a>
                  ),
                ],
              ]}
            />
          ))}
        </FactCards>
        <p>We may also disclose personal data:</p>
        <ul>
          <li>
            <strong>When the law requires it</strong>, for example in response to a court order or a lawful request from
            a government agency under the Information Technology Act, 2000.
          </li>
          <li>
            <strong>To protect people</strong>: to prevent fraud, investigate misuse of GiftQR, or protect the rights,
            property and safety of our users, the public or us.
          </li>
          <li>
            <strong>If GiftQR changes hands</strong>, as part of a merger, sale or transfer of the service. We&apos;ll
            tell you before your data becomes subject to a different privacy policy.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "where-its-stored",
    title: "Where your data is stored",
    body: (
      <p>
        Our providers store and process data on servers that may be outside India, including in the United States. The
        DPDP Act allows this except to countries the Government of India restricts, and we will follow any such
        restriction. We choose providers that protect data with strong security and contractual safeguards.
      </p>
    ),
  },
  {
    id: "how-long-we-keep-it",
    title: "How long we keep it",
    body: (
      <>
        <ul>
          <li>
            <strong>Your account:</strong> while you use GiftQR. Email us to delete it, and we will delete it and
            everything in it within 30 days.
          </li>
          <li>
            <strong>Lists and files:</strong> until you delete them. Deleting a list removes the list, its draft and all
            of their files straight away.
          </li>
          <li>
            <strong>Guest accounts:</strong> deleted when the guest signs out. Guest lists aren&apos;t linked to any
            personal details and their codes keep working afterwards, but nobody can get back in to edit or delete them,
            so delete a guest list before signing out if you want it gone. Otherwise, email us its link.
          </li>
          <li>
            <strong>People a gift is limited to:</strong> until you remove them from the gift or delete it.
          </li>
          <li>
            <strong>Payment references:</strong> stored with the list and deleted with it. Razorpay keeps its own record
            of each payment, and we may keep transaction records, for as long as tax and accounting laws require.
          </li>
          <li>
            <strong>Error logs:</strong> only as long as we need them to investigate and fix problems.
          </li>
          <li>
            <strong>Sign-in cookie:</strong> up to 30 days after your last visit.
          </li>
        </ul>
        <p>Deleted data can remain in our providers&apos; backups for a short time before it is overwritten.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <>
        <ul>
          <li>Connections to GiftQR are encrypted with HTTPS.</li>
          <li>Your sign-in is kept in an encrypted, signed cookie that scripts on the page can&apos;t read.</li>
          <li>
            Files sit in a private storage bucket and open only through signed links that expire after an hour. Their
            folders are named with a one-way code made from your email address, not the address itself.
          </li>
          <li>
            Payment details go straight to Razorpay, a PCI DSS compliant payment gateway, and we check every payment with
            Razorpay before unlocking anything.
          </li>
          <li>Only the people who run GiftQR can reach its systems.</li>
        </ul>
        <p>
          No system is perfectly secure. If a breach affects your personal data, we will tell you and the Data Protection
          Board of India as the law requires, including what happened and what you can do about it.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights and choices",
    body: (
      <>
        <p>Under the DPDP Act you have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> a summary of the personal data we hold about you, what we do with it, and who we have
            shared it with.
          </li>
          <li>
            <strong>Correct, complete or update</strong> it. Your name and photo come from Google: change them there and
            sign in again.
          </li>
          <li>
            <strong>Erase</strong> it. You can delete any list from your dashboard at any time, or ask us to delete your
            account and everything in it.
          </li>
          <li>
            <strong>Withdraw your consent</strong>, by signing out and asking us to delete your data.
          </li>
          <li>
            <strong>Have your grievances heard</strong> by our Grievance Officer (see{" "}
            <a href="#contact">Contact</a>), and if you&apos;re not satisfied with our answer, complain to the Data
            Protection Board of India.
          </li>
          <li>
            <strong>Nominate someone</strong> to exercise these rights for you if you die or become unable to.
          </li>
        </ul>
        <p>
          If you live in the European Economic Area, the United Kingdom or another place with similar laws, you can also
          object to or restrict how we use your data, ask for a copy in a portable format, and complain to your local data
          protection authority.
        </p>
        <h3>How to ask</h3>
        <p>
          Email <EmailLink subject="Privacy request" /> from the address on your GiftQR account, so we know it&apos;s
          you, and tell us what you&apos;d like. It&apos;s free, and we reply within 30 days. For a guest list, send us
          its link, since we have no other way to tell whose it is.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        GiftQR is for people aged 18 and over. Under the DPDP Act anyone under 18 is a child, and we don&apos;t knowingly
        collect a child&apos;s personal data. If you think a child has signed up, contact us and we will delete their
        data. If you put a photo, video or recording of a child in a gift, make sure their parent or guardian is happy
        for you to.
      </p>
    ),
  },
  {
    id: "other-sites",
    title: "Links to other sites",
    body: (
      <p>
        Gifts can contain links to other websites, and signing in or paying takes you to Google or Razorpay. Their own
        privacy policies apply there, and we have no control over them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        When we change this policy, we update the date at the top. If a change is significant, such as collecting a new
        kind of data or using it for a new purpose, we will show a notice on GiftQR before it takes effect and ask for
        your consent again where the law requires.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact and Grievance Officer",
    body: (
      <>
        <p>
          For any question, request or complaint about your personal data, write to us. Our Grievance Officer
          acknowledges complaints within 24 hours and resolves them within 15 days. More ways to reach us are on our{" "}
          <Link href="/contact">Contact &amp; Grievances</Link> page.
        </p>
        <ContactDetails />
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      href="/privacy"
      title="Privacy Policy"
      intro="What we collect when you make, pay for or open a gift, why we need it, and how to stay in control of it."
      summary={[
        "We collect only what a gift needs: your Google name, email and photo (or a made-up guest name), what you put in your lists, and payment references.",
        <>
          Anyone with an open gift&apos;s code can open it, and the code&apos;s web address includes your email address.{" "}
          <a href="#who-can-see-your-gifts">Who can see your gifts</a>
        </>,
        "Razorpay handles card, UPI and bank details. They never touch our servers.",
        "No ads, no analytics trackers, no selling your data. Only essential cookies.",
        "Delete any list whenever you like, and email us to see, fix or delete everything else.",
      ]}
      sections={sections}
    />
  );
}
