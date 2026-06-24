import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
