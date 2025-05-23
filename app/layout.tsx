import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/custom_components/Navbar";
import Footer from "@/custom_components/Footer";
import { Toaster } from "@/components/ui/sonner"
import Providers from "./providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seekers of Knowledge",
  description: "Seek Knowledge Endlessly!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar></Navbar>
        <Providers>
          {children}
        </Providers>

        <Footer></Footer>
        <Toaster richColors />
      </body>


    </html>
  );
}
