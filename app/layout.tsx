"use client";

import "./globals.css";
import type { ReactNode } from "react";
import Header from "./_components/Header";

type LayoutProps = {
  children: ReactNode,
  className?: string,
};

// レイアウト: 共通ヘッダーとメイン
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
