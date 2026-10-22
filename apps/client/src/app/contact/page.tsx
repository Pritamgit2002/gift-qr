import type { Metadata } from "next";
import Link from "next/link";
import { ContactDetails, EmailLink, LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Contact & Grievances | GiftQR",
  description:
    "How to reach GiftQR and its Grievance Officer, report a gift, ask about your data or a payment, and where else to turn.",
};

const sections: LegalSection[] = [
  {
    id: "get-in-touch",
    title: "Get in touch",
    body: (
      <>
        <p>
          The quickest way to reach us is email. Write from the address you sign in with, if you have an account, so we
          can find your lists. We answer within 2 working days.
        </p>
        <ContactDetails />
      </>
    ),
  },
  {
    id: "grievance-officer",
    title: "Grievance Officer",
    body: (
      <>
        <p>
          Under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the
          Consumer Protection (E-Commerce) Rules, 2020 and the Digital Personal Data Protection Act, 2023, you can raise a
          complaint about GiftQR, a gift, or how we handle your personal data with our Grievance Officer
          {LEGAL.grievanceOfficer ? `, ${LEGAL.grievanceOfficer}` : ""}, at <EmailLink subject="Grievance" />.
        </p>
        <ul>
          <li>We acknowledge every complaint within 24 hours.</li>
          <li>We resolve it within 15 days and tell you what we did, and why.</li>
          <li>Please include your name, how to reach you, and the gift link or payment ID if it&apos;s about one.</li>
        </ul>
      </>
    ),
  },
  {
    id: "report",
    title: "Report a gift",
    body: (
      <>
        <p>
          If a gift contains something harmful, illegal, or that breaks our{" "}
          <Link href="/terms#acceptable-use">rules</Link>, such as a phishing link or someone&apos;s private images,
          email <EmailLink subject="Report a gift" /> with:
        </p>
        <ul>
          <li>
            the gift&apos;s link, which is the address your browser opened when you scanned it, such as{" "}
            <code>{LEGAL.website}/someone@example.com/birthday</code>;
          </li>
          <li>what&apos;s wrong with it; and</li>
          <li>if it&apos;s your own content or image, that it&apos;s yours.</li>
        </ul>
        <p>
          Scanned gifts also have a &quot;Report this gift&quot; link that fills this in for you. We review every report
          and remove what breaks our rules. Reports of intimate images shared without consent, or anything that puts a
          child at risk, go to the front of the queue and are acted on as quickly as possible and within the time the law
          sets.
        </p>
      </>
    ),
  },
  {
    id: "privacy-requests",
    title: "Your data",
    body: (
      <p>
        To see, correct or delete your personal data, or to withdraw your consent, email{" "}
        <EmailLink subject="Privacy request" /> from the address on your account. We reply within 30 days. Our{" "}
        <Link href="/privacy#your-rights">Privacy Policy</Link> explains your rights.
      </p>
    ),
  },
  {
    id: "payments",
    title: "Payments and refunds",
    body: (
      <p>
        For a payment problem, email <EmailLink subject="Payment issue" /> with the Razorpay payment ID (it starts with
        &quot;pay_&quot;). Our <Link href="/refunds">Refund Policy</Link> explains when and how we refund.
      </p>
    ),
  },
  {
    id: "other-options",
    title: "If we can't resolve it",
    body: (
      <>
        <p>We hope we can always put things right, but you can also go to:</p>
        <ul>
          <li>
            <strong>The National Consumer Helpline:</strong> call 1915 or file a complaint at{" "}
            <a href="https://consumerhelpline.gov.in/" target="_blank" rel="noopener noreferrer">
              consumerhelpline.gov.in
            </a>
            .
          </li>
          <li>
            <strong>A Consumer Commission</strong>, by filing a case at{" "}
            <a href="https://e-jagriti.gov.in/" target="_blank" rel="noopener noreferrer">
              e-jagriti.gov.in
            </a>
            .
          </li>
          <li>
            <strong>The Grievance Appellate Committee</strong>, within 30 days of our Grievance Officer&apos;s decision
            about content or your account, at{" "}
            <a href="https://gac.gov.in/" target="_blank" rel="noopener noreferrer">
              gac.gov.in
            </a>
            .
          </li>
          <li>
            <strong>The Data Protection Board of India</strong>, about how we handle your personal data, once you have
            raised it with us.
          </li>
        </ul>
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <LegalPage
      href="/contact"
      title="Contact & Grievances"
      intro="Questions, complaints, reports and requests about your data or a payment all start here."
      summary={[
        <>
          Email us at <EmailLink /> and we&apos;ll answer within 2 working days.
        </>,
        "Complaints to our Grievance Officer are acknowledged within 24 hours and resolved within 15 days.",
        "To report a gift, send us its link and what's wrong with it.",
      ]}
      sections={sections}
    />
  );
}
