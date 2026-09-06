import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false, // body font — loads on demand, doesn't block first paint
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  preload: false, // technical accents only — no preload needed
});

// v2 display face — geometric, techy, still professional. headings only.
// the only preloaded font: it renders the above-fold hero headline.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ramyaai.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "ramya ai — affordable hybrid ai agents · local first, cloud when it counts",
    template: "%s · ramya ai",
  },
  description:
    "ramya ai builds the universal hybrid agent platform: routine ai work runs free and private on your hardware, deep reasoning escalates to cost-optimized cloud models. up to 80% off your ai bill — built in india, for the world.",
  keywords: [
    "ramya",
    "ramya ai",
    "ramyaai",
    "ramyaai.tech",
    "ai agents",
    "ai agent platform",
    "hybrid ai",
    "hybrid ai engine",
    "local ai",
    "on-device ai",
    "private ai",
    "ai cost savings",
    "affordable ai",
    "claude code alternative",
    "agentic ai",
    "desktop ai assistant",
    "ai desktop app",
    "ai from india",
    "text to video ai",
  ],
  applicationName: "ramya ai",
  authors: [{ name: "ramya ai", url: siteUrl }],
  creator: "ramya ai",
  publisher: "ramya ai",
  category: "technology",
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ramya ai",
    title: "ramya ai — affordable hybrid ai agents",
    description:
      "routine ai work runs free and private on your hardware. deep reasoning escalates to cost-optimized cloud models. up to 80% off your ai bill.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ramya ai — affordable hybrid ai agents",
    description:
      "routine ai work runs free on your hardware. deep reasoning escalates to cost-optimized cloud models. up to 80% off your ai bill.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // explicit favicon set — the app/icon.png route serves the brand mark;
  // declaring all three bundles guarantees the logo appears in the browser
  // tab AND as the apple touch icon (partial "icons" metadata would otherwise
  // override next's automatic app/icon.png detection)
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/ramya_logo_blackbg.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ramya ai",
    alternateName: ["ramya", "ramyaai"],
    url: siteUrl,
    logo: `${siteUrl}/ramya_logo_blackbg.png`,
    description:
      "ramya ai builds the universal hybrid agent platform — routine ai work runs free and private on your hardware, deep reasoning escalates to cost-optimized cloud models.",
    foundingLocation: { "@type": "Place", name: "India" },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ramya ai",
    alternateName: "ramya",
    url: siteUrl,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-base text-ink">
        <JsonLd data={[organization, website]} />
        {children}
      </body>
    </html>
  );
}
