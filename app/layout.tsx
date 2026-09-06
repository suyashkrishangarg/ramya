import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// v2 display face — geometric, techy, still professional. headings only.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ramyaai.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ramya ai — the universal hybrid agent platform",
    template: "%s · ramya ai",
  },
  description:
    "run routine ai tasks locally for free and offload complex reasoning to optimized cloud models. the desktop platform that slashes ai costs by up to 80%.",
  keywords: [
    "ramya ai",
    "hybrid ai",
    "local ai",
    "on-device ai",
    "aura desktop",
    "ramya flow",
    "ai cost savings",
    "byok",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ramya ai",
    title: "ramya ai — the universal hybrid agent platform",
    description:
      "routine tasks run free on your hardware. deep reasoning escalates to optimized cloud models. up to 80% off your ai bill.",
    images: [{ url: "/ramya_logo_blackbg.png", width: 1024, height: 1024, alt: "ramya ai" }],
  },
  twitter: {
    card: "summary",
    title: "ramya ai — the universal hybrid agent platform",
    description:
      "routine tasks run free on your hardware. deep reasoning escalates to the cloud. up to 80% off your ai bill.",
    images: ["/ramya_logo_blackbg.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-base text-ink">{children}</body>
    </html>
  );
}
