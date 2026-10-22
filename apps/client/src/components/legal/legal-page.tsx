import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { auth } from "../../../auth";
import { Sparkle } from "@/components/brand/art";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { LEGAL, LEGAL_PAGES, type LegalHref } from "@/lib/legal";
import styles from "./legal.module.css";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * A legal document in the site's look: the fine-print header, a plain-words
 * summary, numbered sections with a contents list, then the other documents.
 */
export async function LegalPage({
  href,
  title,
  intro,
  summary,
  sections,
}: {
  href: LegalHref;
  title: string;
  intro: ReactNode;
  summary: ReactNode[];
  sections: LegalSection[];
}) {
  const session = await auth();
  const others = LEGAL_PAGES.filter((page) => page.href !== href);

  return (
    <div className="overflow-x-clip">
      <SiteHeader signedIn={Boolean(session?.user)} />
      <main className="mx-auto w-full max-w-[1160px] px-4 pb-20 pt-12 sm:px-8 sm:pt-16">
        <header className="relative mb-10 flex max-w-[780px] flex-col gap-2 border-b-2 border-plum pb-8">
          <Sparkle size={30} className="absolute right-1 top-0 animate-twinkle" />
          <span className="animate-rise font-hand text-3xl font-bold text-ribbon-deep">the fine print</span>
          <h1
            className="m-0 animate-rise font-display text-[42px] font-extrabold leading-[1.02] tracking-display sm:text-[56px]"
            style={{ animationDelay: ".1s" }}
          >
            {title}
          </h1>
          <p className="m-0 mt-1 text-[15px] text-plum-sub">Last updated: {LEGAL.updated}</p>
          <p className="m-0 mt-3 max-w-[640px] text-lg leading-[1.6] text-plum-body">{intro}</p>
        </header>

        <div className="lg:grid lg:grid-cols-[minmax(0,780px)_220px] lg:justify-between lg:gap-14">
          <div className="min-w-0">
            <section aria-labelledby="short-version" className={styles.summary}>
              <h2 id="short-version" className="m-0 mb-3 font-display text-[22px] font-extrabold tracking-display">
                The short version
              </h2>
              <ul>
                {summary.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </section>

            <details className="mb-10 rounded-[20px] border-2 border-line-warm bg-white px-5 py-3.5 lg:hidden">
              <summary className="cursor-pointer font-bold text-plum">On this page</summary>
              <Contents sections={sections} />
            </details>

            <article className={styles.prose}>
              {sections.map((section, i) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                  <h2 id={`${section.id}-title`}>
                    <span className={styles.num}>{i + 1}</span>
                    {section.title}
                  </h2>
                  {section.body}
                </section>
              ))}
            </article>
          </div>

          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pb-4">
              <p className="m-0 text-sm font-bold uppercase tracking-[.12em] text-ribbon-deep">On this page</p>
              <Contents sections={sections} />
            </nav>
          </aside>
        </div>

        <nav aria-labelledby="more-fine-print" className="mt-20 border-t-2 border-plum pt-10">
          <h2 id="more-fine-print" className="m-0 mb-6 font-display text-[28px] font-extrabold tracking-display">
            More of the fine print
          </h2>
          <ul className="m-0 grid list-none gap-3.5 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="flex h-full flex-col gap-1 rounded-[20px] border-2 border-plum bg-white p-5 shadow-hard-sm transition-[transform,box-shadow] duration-200 ease-pop hover:-translate-y-0.5 hover:shadow-hard"
                >
                  <span className="font-display text-lg font-extrabold leading-tight">{page.title}</span>
                  <span className="text-[15px] leading-snug text-plum-body">{page.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

function Contents({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="m-0 mt-3 flex list-none flex-col gap-0.5 p-0">
      {sections.map((section, i) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex gap-2.5 rounded-xl px-2 py-1.5 text-[15px] leading-snug text-plum-body hover:bg-peach hover:text-plum"
          >
            <span className="w-5 flex-none text-right font-bold text-ribbon-deep">{i + 1}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Our email address as a mail link, optionally with a subject filled in. */
export function EmailLink({ subject }: { subject?: string }) {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return <a href={`mailto:${LEGAL.email}${query}`}>{LEGAL.email}</a>;
}

/** A card of facts about one thing, such as a cookie or a service provider. Empty facts are left out. */
export function FactCard({ title, facts }: { title: ReactNode; facts: [term: string, detail: ReactNode][] }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <dl className={styles.facts}>
        {facts.filter(([, detail]) => detail).map(([term, detail]) => (
          <Fragment key={term}>
            <dt>{term}</dt>
            <dd>{detail}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}

export function FactCards({ children }: { children: ReactNode }) {
  return <div className={styles.cards}>{children}</div>;
}

/** Who to write to, with whichever of the operator's details are filled in. */
export function ContactDetails() {
  return (
    <FactCard
      title="GiftQR"
      facts={[
        ["Run by", LEGAL.operator],
        ["Email", <EmailLink key="email" />],
        ["Grievance Officer", LEGAL.grievanceOfficer ? `${LEGAL.grievanceOfficer}, at the email above` : "At the email above"],
        ["Phone", LEGAL.phone && <a href={`tel:${LEGAL.phone.replace(/\s/g, "")}`}>{LEGAL.phone}</a>],
        ["Address", LEGAL.address],
      ]}
    />
  );
}
