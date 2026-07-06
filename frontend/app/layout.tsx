import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://snake-ladder-rouge.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Play Snake & Ladder Online - Multiplayer Board Game",
    template: "%s | Snake & Ladder Online",
  },
  description:
    "Play Snake & Ladder online! Connect in real-time multiplayer lobbies or play local offline games with friends. Roll the dice, climb ladders, and dodge snakes.",
  keywords: [
    "online multiplayer games",
    "multiplayer browser games",
    "snake and ladder",
    "snake & ladder",
    "snake ladder online",
    "dice games",
    "board games",
    "two-player online games",
    "play with friends",
    "free online games",
    "real-time multiplayer games",
  ],
  verification: {
    google: "CVboI0AsWSgy2u4xqQWPJNhxOA6lHJs2RBnosXV20PE",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Play Snake & Ladder Online - Multiplayer Board Game",
    description:
      "Experience the ultimate Snake & Ladder board game online! Play real-time multiplayer matches with friends or local offline games. Roll the dice and reach cell 100!",
    siteName: "Snake & Ladder Online",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Snake & Ladder Online Multiplayer Game Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play Snake & Ladder Online - Multiplayer Board Game",
    description:
      "Experience the ultimate Snake & Ladder board game online! Play real-time multiplayer matches with friends or local offline games.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

import CursorManager from "@/app/_components/CursorManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Snake & Ladder Online",
    "url": baseUrl,
  };

  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Snake & Ladder Online",
    "description":
      "An interactive digital version of the classic Snake & Ladder board game. Features real-time online multiplayer lobby rooms and local offline play with up to 4 players.",
    "genre": ["Board Game", "Dice Game", "Multiplayer Game"],
    "playMode": ["SinglePlayer", "MultiPlayer", "CoOp"],
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "gamePlatform": "Web Browser",
    "url": baseUrl,
    "image": `${baseUrl}/logo.png`,
    "author": {
      "@type": "Organization",
      "name": "Snake & Ladder Multiplayer Team",
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD",
      "category": "free",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I play Snake and Ladder online with friends?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "To play with friends, select the 'Online Multiplayer' mode on the home screen, click 'Create Room' to generate a unique session invite code, and share this code with your friends. They can select 'Join Room' and enter your code to connect in real-time.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I play Snake and Ladder offline on the same device?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes! The game features a 'Local Offline' mode where 1 to 4 players can take turns rolling the dice and playing on the same screen, perfect for playing locally with family and friends.",
        },
      },
      {
        "@type": "Question",
        "name": "What is the Dice Prediction Panel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The Prediction Panel is a strategic helper that highlights potential landing cells on the board for future rolls of 2 through 6. It highlights snake heads in red and ladder bases in green, letting you anticipate risky or rewarding moves.",
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} m-0 p-0`}
    >
      <body className="m-0 p-0 bg-secondary-900 text-secondary-100 min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <CursorManager />
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}

