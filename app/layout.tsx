import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lm-stack",
  description: "A collection of language models and their insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="icon.svg" sizes="any" type="image/svg+xml"/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
