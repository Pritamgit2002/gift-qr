import type { ReactNode } from "react";
import { Github, Globe, Instagram, Linkedin, Twitch } from "lucide-react";
import { cn } from "@/lib/utils";

type Brand = { name: string; background: string; icon: ReactNode };

const lucide = { size: 20, strokeWidth: 2.2, "aria-hidden": true } as const;

// Simple marks drawn in each site's colours; lucide covers the rest.
const youtube = (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 7.5v9l7.8-4.5z" fill="#fff" />
  </svg>
);
const spotify = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#191414" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M5.5 9.2c4.3-1.4 9-1 12.8 1.1" />
    <path d="M6.6 12.8c3.4-1 7-.7 10 .9" />
    <path d="M7.6 16.2c2.6-.7 5.2-.5 7.4.6" />
  </svg>
);
const facebook = (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M13.6 21v-7.2h2.5l.4-3h-2.9V8.9c0-.9.3-1.5 1.5-1.5h1.5V4.7c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.2v3h2.5V21z"
      fill="#fff"
    />
  </svg>
);
const x = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 3.5h4.6l11.4 17H15.4z" fill="#fff" />
    <path d="M19.4 3.5 4.6 20.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const whatsapp = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 20l1.2-4A8 8 0 1 1 8.4 19z" />
    <path d="M9.2 9.2c.3 2.4 2.2 4.6 4.8 5.3l1-1.2-1.6-1-.7.6c-.9-.4-1.7-1.2-2.1-2.1l.6-.7-1-1.6z" fill="#fff" strokeWidth="0.6" />
  </svg>
);
const music = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const brands: { match: RegExp; brand: Brand }[] = [
  { match: /(^|\.)(youtube\.com|youtu\.be)$/, brand: { name: "YouTube", background: "#FF0000", icon: youtube } },
  { match: /(^|\.)spotify\.com$/, brand: { name: "Spotify", background: "#1DB954", icon: spotify } },
  { match: /(^|\.)(facebook\.com|fb\.watch|fb\.com)$/, brand: { name: "Facebook", background: "#1877F2", icon: facebook } },
  {
    match: /(^|\.)instagram\.com$/,
    brand: {
      name: "Instagram",
      background: "linear-gradient(45deg, #F58529, #DD2A7B 55%, #8134AF)",
      icon: <Instagram {...lucide} color="#fff" />,
    },
  },
  { match: /(^|\.)(x\.com|twitter\.com)$/, brand: { name: "X", background: "#000000", icon: x } },
  { match: /(^|\.)(whatsapp\.com|wa\.me)$/, brand: { name: "WhatsApp", background: "#25D366", icon: whatsapp } },
  { match: /(^|\.)linkedin\.com$/, brand: { name: "LinkedIn", background: "#0A66C2", icon: <Linkedin {...lucide} color="#fff" /> } },
  { match: /(^|\.)github\.com$/, brand: { name: "GitHub", background: "#181717", icon: <Github {...lucide} color="#fff" /> } },
  { match: /(^|\.)twitch\.tv$/, brand: { name: "Twitch", background: "#9146FF", icon: <Twitch {...lucide} color="#fff" /> } },
  { match: /(^|\.)music\.apple\.com$/, brand: { name: "Apple Music", background: "#FA243C", icon: music } },
  { match: /(^|\.)soundcloud\.com$/, brand: { name: "SoundCloud", background: "#FF5500", icon: music } },
];

const web: Brand = { name: "Website", background: "#EFE7F6", icon: <Globe {...lucide} color="#23142E" /> };

/** Which site a link goes to, by its host. */
export function brandOf(link: string): Brand {
  let host: string;
  try {
    host = new URL(link).hostname.toLowerCase();
  } catch {
    return web;
  }
  return brands.find((b) => b.match.test(host))?.brand ?? web;
}

/** The site's mark on its own colour, in place of a plain "L". */
export function LinkBrand({ link, className }: { link: string; className?: string }) {
  const brand = brandOf(link);
  return (
    <span
      role="img"
      aria-label={brand.name}
      title={brand.name}
      className={cn("grid h-10 w-10 flex-none place-items-center rounded-xl", className)}
      style={{ background: brand.background }}
    >
      {brand.icon}
    </span>
  );
}
