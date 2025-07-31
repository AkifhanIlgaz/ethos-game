import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ethOS Games",
  description: "Educational and entertaining games",
  generator: "yucci",
};

function Header() {
  return (
    <header className="w-full ">
      <div className="container mx-auto px-4 py-4 items-center">
       
       
           <Link href="/" className="flex items-center space-x-2">
          <span className="text-white font-bold text-xl">EthOS Games</span>
        </Link>

      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 min-h-screen">
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
