import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Snake & Ladder Board Game",
  description: "An interactive Snake & Ladder board game. Play local offline matches or connect in multiplayer online rooms. Roll the dice, climb the ladders, dodge the snakes, and reach cell 100!",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Snake & Ladder Board Game",
    description: "An interactive Snake & Ladder board game. Play local offline matches or connect in multiplayer online rooms. Roll the dice, climb the ladders, dodge the snakes, and reach cell 100!",
    images: [
      {
        url: "/logo.png",
        width: 100,
        height: 100,
        alt: "Snake & Ladder Game Logo",
      },
    ],
  },
};

import CursorManager from "@/app/_components/CursorManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} m-0 p-0 overflow-hidden`}
    >
      <body className="m-0 p-0 overflow-hidden">
        <CursorManager />
        {children}
      </body>
    </html>
  );
}
