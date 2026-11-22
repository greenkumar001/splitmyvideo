
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

const siteUrl = "https://splitmyvideo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "SplitMyVideo – Free Online Video Splitter",
    template: "%s | SplitMyVideo",
  },

  description:
    "Split large videos into smaller clips online for free. Choose your clip duration, process videos directly in your browser, and download your clips easily with SplitMyVideo.",

  applicationName: "SplitMyVideo",

  keywords: [
    "video splitter",
    "split video online",
    "free online video splitter",
    "cut video into parts",
    "split large video",
    "video cutter",
    "online video editor",
    "split video into clips",
  ],

  authors: [{ name: "Acustard Technologies" }],
  creator: "Acustard Technologies",
  publisher: "Acustard Technologies",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "SplitMyVideo",
    title: "SplitMyVideo – Free Online Video Splitter",
    description:
      "Split large videos into smaller clips for free. Choose your duration and process videos directly in your browser.",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "SplitMyVideo – Free Online Video Splitter",
    description:
      "Split large videos into smaller clips online for free with SplitMyVideo.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
