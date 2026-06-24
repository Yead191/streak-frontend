import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import AudioToggle from "@/components/ui/AudioToggle";

export const metadata: Metadata = {
  title: "Streak — rooted in community",
  description:
    "A new live-events platform embodying the meaning of connection. Support one business. Support every business.",
  openGraph: {
    title: "Streak — rooted in community",
    description:
      "A new live-events platform embodying the meaning of connection.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070503",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded via <link> rather than next/font so the build never
            blocks on a network fetch. Swap for next/font/google if you prefer. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="atmosphere">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <AudioToggle />
      </body>
    </html>
  );
}
