import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prompt = Prompt({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "ResiLearn - Resistor Reading Training System",
  description: "Learn to read resistor values through progressive learning system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${prompt.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
