"use client";

import useSWR from "swr";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message ?? "カテゴリーの取得に失敗しました。");
  }

  const { categories }: CategoriesResponse = await res.json();
  return categories;
};

export default function AdminCategoriesPage() {

  const { token } = useSupabaseSession();

  // カテゴリー一覧取得
  const { data: categories, error, isLoading } = useSWR(
    token ? ["/api/admin/categories", token] : null,
    fetcher,
  );

  // 読み込み中表示
  if(isLoading) {
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
        {error.message}
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
        {categories?.map((category) => {
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
