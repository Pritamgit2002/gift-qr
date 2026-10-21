// app/layout.tsx
import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, hand, sans } from "./fonts";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  // Absolute base for the share image and icons. Set SITE_URL in production.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "GiftQR: wrap your love in a QR code",
  description:
    "Pack one QR code with songs, notes and photos. Every scan unwraps a different surprise.",
};

export const viewport: Viewport = {
  themeColor: "#FFF6F1",
};

// Sonner reads its colours from these variables: a plum pill, like the design's toast.
const toastTheme = {
  "--normal-bg": "#23142E",
  "--normal-text": "#FFFFFF",
  "--normal-border": "#23142E",
  "--border-radius": "999px",
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${hand.variable}`}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-center"
            style={toastTheme}
            toastOptions={{ className: "font-sans! font-semibold! text-[15px]!" }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
