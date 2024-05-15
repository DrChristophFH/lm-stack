import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import icon from "./favicon.svg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LM-Stack",
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
