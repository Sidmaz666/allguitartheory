import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GuitarTheory - Master the Fretboard",
  description: "Interactive guitar music theory application. Learn scales, chords, and master the fretboard with our modern, intuitive interface.",
  keywords: ["Guitar", "Music Theory", "Scales", "Chords", "Fretboard", "Learning", "Practice", "Metronome"],
  authors: [{ name: "GuitarTheory Team" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎸</text></svg>",
  },
  openGraph: {
    title: "GuitarTheory - Master the Fretboard",
    description: "Interactive guitar music theory application with scales, chords, and practice tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GuitarTheory - Master the Fretboard",
    description: "Interactive guitar music theory application with scales, chords, and practice tools.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
