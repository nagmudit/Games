import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XOXOverse - 20 Unique Tic-Tac-Toe Variants",
  description:
    "Explore 20 creative tic-tac-toe variants including 3D, Ultimate, Blind, Power-ups, Three-player, and many more. From classic to expert difficulty levels with beautiful animations.",
  keywords:
    "tic-tac-toe, games, variants, puzzles, strategy, 3D, ultimate, blind, power-ups, three-player, circular, numerical, dice, brain games, XOXOverse",
  authors: [{ name: "XOXOverse" }],
  creator: "XOXOverse Collection",
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#10b981" },
  ],
  openGraph: {
    title: "XOXOverse - 20 Unique Tic-Tac-Toe Variants",
    description:
      "Play 20 creative tic-tac-toe variants with beautiful animations and dark/light themes",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "XOXOverse - 20 Unique Tic-Tac-Toe Variants",
    description:
      "Explore 20 creative tic-tac-toe variants from classic to expert difficulty",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
