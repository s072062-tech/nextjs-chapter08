"use client";

import { useEffect, useState } from "react";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminCategoriesPage() {

  const { token } = useSupabaseSession();
  const [ categories, setCategories ]     = useState<CategoriesResponse["categories"]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);

  // カテゴリー一覧取得
  useEffect(() => {
    const fetcher = async () => {

      if (!token) return;

      try {
        const res = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { categories } = await res.json();
        setCategories(categories);

      } catch {
        setError('カテゴリーの取得に失敗しました。');
      } finally {
        setLoading(false);
      }

    }

    fetcher();
  }, [token]);

  // 読み込み中表示
  if(loading) {
    return (
      <p className="text-center text-gray-500 py-12">
        読み込み中です...
      </p>
    )
  }

  // エラー表示
  if(error) {
    return (
      <p className="text-center text-red-500 py-12">
        {error}
      </p>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">カテゴリー一覧</h1>
        <button className="px-6 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-700">
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>
      <ul>
        {/* カテゴリー一覧表示 */}
        {categories.map((category) => {
          return(
            <li key={category.id} className="border-b border-gray-200">
              <Link href={`/admin/categories/${category.id}`}
              className="block py-4 font-bold hover:bg-gray-50">
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
