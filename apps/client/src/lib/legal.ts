/**
 * Facts the legal pages quote, kept in one place so they stay in step.
 *
 * Fill in the empty ones before taking live payments: India's Consumer
 * Protection (E-Commerce) Rules, 2020 and IT (Intermediary Guidelines) Rules,
 * 2021 expect the site to show who runs it, a postal address and a named
 * Grievance Officer. Empty fields are left off the pages.
 */
export const LEGAL = {
  /** Legal name of the person or business that runs GiftQR, e.g. "Jane Doe" or "GiftQR Labs Pvt. Ltd." */
  operator: "",
  /** Where GiftQR is run from. */
  location: "West Bengal, India",
  /** Postal address for notices and complaints. */
  address: "",
  /** Customer care phone number. */
  phone: "",
  email: "pritamgaindev@gmail.com",
  /** Grievance Officer's name. Their contact is `email`. */
  grievanceOfficer: "",
  /** Whose courts hear disputes. */
  courts: "Kolkata, West Bengal",
  website: "giftqr.in",
  /** When the current versions took effect. Change it with every material edit. */
  updated: "22 October 2026",
} as const;

/** "GiftQR" or "GiftQR, run by <operator>", for opening lines. */
export const operatedBy = () => (LEGAL.operator ? `GiftQR, run by ${LEGAL.operator}` : "GiftQR");

/** The legal documents, in the order the footer and the pages list them. */
export const LEGAL_PAGES = [
  { href: "/privacy", title: "Privacy Policy", blurb: "What we collect, why, and your rights." },
  { href: "/terms", title: "Terms of Service", blurb: "The rules for making and sharing gifts." },
  { href: "/cookies", title: "Cookie Policy", blurb: "The few essential cookies we set." },
  { href: "/refunds", title: "Refund Policy", blurb: "Payments, delivery, cancellations and refunds." },
  { href: "/contact", title: "Contact & Grievances", blurb: "Questions, complaints and reporting a gift." },
] as const;

export type LegalHref = (typeof LEGAL_PAGES)[number]["href"];

/** Services that handle personal data for us. Update when a provider changes. */
export const PROCESSORS = [
  {
    name: "Google",
    role: "Sign in with Google",
    data: "Confirms who you are and shares your name, email address and profile photo with us. Your profile photo loads from Google's servers.",
    policy: "https://policies.google.com/privacy",
  },
  {
    name: "Razorpay",
    role: "Payments",
    data: "Your name, your email address (for Google accounts), the amount, and the card, UPI, bank or wallet details you enter in checkout.",
    policy: "https://razorpay.com/privacy-policy/",
  },
  {
    name: "Amazon Web Services",
    role: "File storage (Amazon S3)",
    data: "The photos, videos and audio clips you upload, and the network address of anyone who opens them.",
    policy: "https://aws.amazon.com/privacy/",
  },
  {
    name: "MongoDB Atlas",
    role: "Database",
    data: "Accounts, lists, the email addresses a gift is limited to, payment references and error logs.",
    policy: "https://www.mongodb.com/legal/privacy/privacy-policy",
  },
  {
    name: "Our hosting provider",
    role: "Runs the website and API",
    data: "Every request to GiftQR, including your network (IP) address and browser details.",
    policy: null,
  },
] as const;
