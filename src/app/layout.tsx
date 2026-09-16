import type { Metadata, Viewport } from "next";
import "./globals.css";
import InstallApp from "@/components/InstallApp";

const TAGLINE =
  "Answer a few questions, get a week of meals built around your numbers, and log what you actually eat.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nutri-track-lilac.vercel.app"),
  title: { default: "NutriTrack", template: "%s · NutriTrack" },
  description: TAGLINE,
  applicationName: "NutriTrack",
  appleWebApp: { capable: true, title: "NutriTrack", statusBarStyle: "black-translucent" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "NutriTrack",
    title: "NutriTrack",
    description: TAGLINE,
  },
  twitter: { card: "summary_large_image", title: "NutriTrack", description: TAGLINE },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EEF2ED" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1512" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        {children}
        <InstallApp />
      </body>
    </html>
  );
}
