import type { CSSProperties } from "react";

/** Four-point sparkle. */
export function Sparkle({
  size = 24,
  fill = "#FFC23D",
  stroke,
  className,
  style,
}: {
  size?: number;
  fill?: string;
  stroke?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path
        d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? 1.5 : undefined}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Solid heart, for the occasion bands and badges. */
export function Heart({ size = 22, fill = "#FF5A6E" }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" fill={fill} />
    </svg>
  );
}

// A sample 29×29 code, for decoration only. Real codes come from the qrcode package.
export const QR_PATH =
  "M0 0.5h7m1 0h4m3 0h2m1 0h3m1 0h7M0 1.5h1m5 0h1m1 0h1m1 0h3m1 0h2m1 0h1m2 0h1m1 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m2 0h1m3 0h3m2 0h2m2 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m3 0h3m3 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m2 0h2m1 0h2m3 0h1m1 0h2m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m2 0h1m1 0h2m1 0h1m4 0h2m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h2m2 0h3m2 0h1m1 0h2M0 8.5h1m1 0h2m1 0h3m3 0h1m1 0h2m1 0h5m1 0h1m2 0h1m1 0h2M2 9.5h1m1 0h2m1 0h5m3 0h2m2 0h2m1 0h4m2 0h1M0 10.5h1m3 0h1m1 0h1m1 0h1m2 0h2m1 0h2m6 0h3m1 0h2M1 11.5h2m1 0h2m2 0h2m2 0h4m2 0h2m1 0h2M3 12.5h2m1 0h1m1 0h1m2 0h2m4 0h1m1 0h1m1 0h1m1 0h1m1 0h1M1 13.5h1m1 0h3m2 0h3m1 0h2m3 0h3m2 0h1m3 0h1m1 0h1M0 14.5h1m4 0h4m1 0h1m1 0h1m1 0h1m1 0h1m1 0h2m2 0h2m3 0h2M2 15.5h1m1 0h2m2 0h2m1 0h1m1 0h1m2 0h1m4 0h1m1 0h3M1 16.5h1m4 0h5m1 0h1m2 0h1m2 0h1m1 0h2m1 0h4m1 0h1M2 17.5h1m5 0h1m3 0h2m1 0h2m1 0h1m2 0h1m1 0h1m1 0h1M0 18.5h1m1 0h1m1 0h4m1 0h3m3 0h4m2 0h1m4 0h1M2 19.5h2m1 0h1m1 0h1m1 0h1m2 0h1m3 0h2m1 0h1m1 0h2m3 0h3M1 20.5h9m3 0h1m2 0h3m1 0h5m1 0h3M8 21.5h1m2 0h4m1 0h1m3 0h1m3 0h1m1 0h2M0 22.5h7m1 0h1m1 0h1m2 0h1m2 0h2m1 0h2m1 0h1m1 0h1m2 0h1M0 23.5h1m5 0h1m1 0h1m6 0h2m3 0h1m3 0h2m1 0h2M0 24.5h1m1 0h3m1 0h1m2 0h1m1 0h2m1 0h4m2 0h5m1 0h2M0 25.5h1m1 0h3m1 0h1m1 0h2m1 0h11m2 0h1m1 0h1m1 0h1M0 26.5h1m1 0h3m1 0h1m1 0h5m1 0h1m2 0h1m1 0h1m3 0h1m1 0h1m2 0h1M0 27.5h1m5 0h1m3 0h4m1 0h1m2 0h1m1 0h2m1 0h3m1 0h1M0 28.5h7m1 0h5m2 0h1m2 0h5m4 0h1";

export function QrArt({ size = 140, className, style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 29 29"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path fill="#ffffff" d="M0 0h29v29H0z" />
      <path stroke="#23142E" d={QR_PATH} />
    </svg>
  );
}

/** A tiny 7×7 code for gift tags. */
export function MiniQr({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 7 7" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" className="block">
      <path
        fill="#23142E"
        d="M0 0h3v1H0zM4 0h3v1H4zM0 1h1v2H0zM2 1h1v2H2zM4 1h1v2H4zM6 1h1v2H6zM0 2h3v1H0zM4 2h3v1H4zM0 4h3v1H0zM4 4h1v1H4zM6 4h1v1H6zM0 5h1v1H0zM2 5h1v1H2zM5 5h1v1H5zM0 6h3v1H0zM4 6h1v1H4zM6 6h1v1H6z"
      />
    </svg>
  );
}

export function GoogleMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8L20 3.2A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}
