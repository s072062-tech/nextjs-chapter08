"use client";

import Link from "next/link";

// 共通ヘッダー
export default function Header() {
  return (
    <header className="items-center px-4 py-3 bg-gray-800 text-white">
      <nav className="flex justify-between gap-4">
        <Link href="/" className="hover:underline">Blog</Link>
        <Link href="/contact" className="hover:underline">お問い合わせ</Link>
      </nav>
    </header>
  );
}
