import type { Metadata } from "next";
import { Fraunces, Spline_Sans } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/app/_views/ThemeToggle";

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const bodyFont = Spline_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Leetwrappy — Your LeetCode Year in Review",
  description: "See your LeetCode journey beautifully visualized, Spotify Wrapped style.",
  openGraph: {
    title: "Leetwrappy",
    description: "Your LeetCode year in review",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
