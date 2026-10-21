import { ImageResponse } from "next/og";

// Home-screen icon for iOS: the gift box on blush paper.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFE9E0" }}>
        <svg width="132" height="132" viewBox="0 0 40 40">
          <rect x="4" y="14" width="32" height="23" rx="6" fill="#FF5A6E" stroke="#23142E" strokeWidth="1.6" />
          <rect x="2" y="10.5" width="36" height="9" rx="4" fill="#E23B57" stroke="#23142E" strokeWidth="1.6" />
          <rect x="17" y="10.5" width="6" height="26.5" fill="#FFC23D" stroke="#23142E" strokeWidth="1.2" />
          <path d="M20 10.5 C 14 2, 7.5 6, 12 10.5 Z" fill="#FFC23D" stroke="#23142E" strokeWidth="1.2" />
          <path d="M20 10.5 C 26 2, 32.5 6, 28 10.5 Z" fill="#FFC23D" stroke="#23142E" strokeWidth="1.2" />
        </svg>
      </div>
    ),
    size,
  );
}
