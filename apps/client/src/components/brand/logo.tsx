import Link from "next/link";
import { cn } from "@/lib/utils";

/** The gift box mark. */
export function GiftMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <rect x="4" y="13" width="32" height="23" rx="6" fill="#FF5A6E" />
      <rect x="2" y="10" width="36" height="9" rx="4" fill="#E23B57" />
      <rect x="17" y="10" width="6" height="26" fill="#FFC23D" />
      <path d="M20 10 C 14 2, 8 6, 12 10 Z" fill="#FFC23D" />
      <path d="M20 10 C 26 2, 32 6, 28 10 Z" fill="#FFC23D" />
    </svg>
  );
}

/** Mark plus wordmark, linking home unless `href` is null. */
export function Logo({
  size = 40,
  href = "/",
  className,
}: {
  size?: number;
  href?: string | null;
  className?: string;
}) {
  const content = (
    <>
      <GiftMark size={size} />
      <span className="font-display font-extrabold tracking-display" style={{ fontSize: size * 0.65 }}>
        GiftQR
      </span>
    </>
  );
  const classes = cn("flex items-center gap-2.5", className);
  if (href === null) return <span className={classes}>{content}</span>;
  return (
    <Link href={href} className={classes} aria-label="GiftQR home">
      {content}
    </Link>
  );
}
