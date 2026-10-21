import { ImageResponse } from "next/og";
import { QR_PATH } from "@/components/brand/art";

// The card shown when a GiftQR link is shared in chats and social posts.
export const alt = "GiftQR: wrap your love in a QR code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#23142E";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "#FFF6F1",
          color: INK,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 620 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 40, fontWeight: 800 }}>
            <svg width="56" height="56" viewBox="0 0 40 40">
              <rect x="4" y="14" width="32" height="23" rx="6" fill="#FF5A6E" />
              <rect x="2" y="10.5" width="36" height="9" rx="4" fill="#E23B57" />
              <rect x="17" y="10.5" width="6" height="26.5" fill="#FFC23D" />
              <path d="M20 10.5 C 14 2, 7.5 6, 12 10.5 Z" fill="#FFC23D" />
              <path d="M20 10.5 C 26 2, 32.5 6, 28 10.5 Z" fill="#FFC23D" />
            </svg>
            GiftQR
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>
            <span>Wrap</span>
            <span>your</span>
            <span style={{ color: "#D6284A" }}>love</span>
            <span>in</span>
            <span>a</span>
            <span>QR</span>
            <span>code.</span>
          </div>
          <div style={{ fontSize: 30, color: "#4E3D5A", lineHeight: 1.4 }}>
            Songs, notes and photos in one code. Every scan unwraps a different surprise.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: 22,
              background: "#fff",
              border: `4px solid ${INK}`,
              borderRadius: 32,
              boxShadow: `10px 10px 0 ${INK}`,
              transform: "rotate(-4deg)",
            }}
          >
            <svg width="230" height="230" viewBox="0 0 29 29">
              <rect width="29" height="29" fill="#fff" />
              <path stroke={INK} d={QR_PATH} />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: -20,
              width: 330,
              height: 120,
              background: "#FF5A6E",
              border: `4px solid ${INK}`,
              borderRadius: "14px 14px 30px 30px",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 54, height: "100%", background: "#FFC23D", borderLeft: `4px solid ${INK}`, borderRight: `4px solid ${INK}` }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
