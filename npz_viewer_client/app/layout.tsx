import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { roger } from "@/components/fonts/fonts";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
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
  title: "NPZ Viewer",
  description: "A simple viewer for .npy and .npz files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roger.variable} antialiased`}
      >
          {children}
          <Toaster richColors />
      </body>
    </html>
  );
}
