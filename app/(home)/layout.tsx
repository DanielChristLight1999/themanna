import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Mana Restaurant",
  description: "Fast Food Delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  h-full bg-gradient-to-r from-orange-50 to-amber-50 antialiased`}
      >
        {children}
        <Toaster position="top-left" richColors />
      </body>
    </html>
  );
}
