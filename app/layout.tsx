'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/Header";
import { useEffect } from 'react';
import { useMotionStore } from '../store/useMotionStore';

const inter = Inter({ subsets: ["latin"] });

// Note: Since this is now a client component, you'll need to move metadata
// to a separate page.tsx or use next/head for SEO

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fetchBalance = useMotionStore((state) => state.fetchBalance);

  // Fetch initial balance when app loads
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-dark">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}