import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "./_components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gutachtomat - Psychotherapeutische Gutachten",
  description: "Erstellen Sie professionelle psychotherapeutische Gutachten nach PTV3-Norm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navigation />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
