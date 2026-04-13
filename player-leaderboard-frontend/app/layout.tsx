import "./globals.css";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Player Leaderboard",
  description: "Track global player rankings in real-time.",
    icons: {
    icon: "/favicon.ico",
  },
  keywords: ["leaderboard", "gaming", "ranking", "scores"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Player Leaderboard",
    description: "Track global player rankings in real-time.",
    url: "https://player-leaderboard.vercel.app",
    siteName: "Player Leaderboard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
