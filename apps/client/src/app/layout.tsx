// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { poppins, rubik } from "./fonts";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "GiftQR",
  description:
    "Turn your favorite links, heartfelt messages and photos into a personalized gift QR code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${rubik.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
