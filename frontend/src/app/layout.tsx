import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interview Infra • AI Interviewer HUD",
  description: "A cyber-minimal reactive interview interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrains.variable} ${inter.variable} antialiased`}
      >
        {/* Nebula Background Layers */}
        <div
          id="nebula-background"
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        />
        <div
          id="nebula-accent"
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        />
        <div className="hud-grid fixed inset-0 pointer-events-none" aria-hidden style={{ zIndex: 1 }} />
        {children}
      </body>
    </html>
  );
}
