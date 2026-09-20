"use client";

import "../globals.css";
import type { ReactNode } from "react";
import AdminSidebar from "../_components/admin/AdminSidebar";

type LayoutProps = {
  children: ReactNode,
  className?: string,
};

// レイアウト: 共通サイドバーとメイン
export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
