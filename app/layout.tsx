import type { Metadata } from "next";

import { Header } from "@/components/header";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hitpick Global Deal Room",
  description: "Initial scaffold for the Hitpick Global Deal Room project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#05060A] text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
