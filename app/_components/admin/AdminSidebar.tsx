"use client";

import Link from "next/link";

// 共通サイドバー
export default function AdminSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 p-4 space-y-2">
      <Link href="/admin/posts" className="block hover:underline">記事一覧</Link>
      <Link href="/admin/categories" className="block hover:underline">カテゴリー一覧</Link>
    </aside>
  );
}
