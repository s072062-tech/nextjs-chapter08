"use client";

import Link from "next/link";
import useSWR from "swr";
import type { GetPostsResponse } from "@/app/api/posts/route";
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
    throw new Error(errorData.message ?? "記事の取得に失敗しました。");
  }

  const { posts }: GetPostsResponse = await res.json();
  return posts;
};

export default function AdminPostsPage() {

  const { token } = useSupabaseSession();

  // 記事一覧取得
  const { data: posts, error, isLoading } = useSWR(
    token ? ["/api/admin/posts", token] : null,
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
        <h1 className="text-2xl font-bold">記事一覧</h1>
        <button className="px-6 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-700">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>
      <ul>
        {/* 記事一覧表示 */}
        {posts?.map((post) => {
          return(
            <li key={post.id} className="border-b border-gray-200">
              <Link href={`/admin/posts/${post.id}`}
              className="block py-4 font-bold hover:bg-gray-50">
                <p>{post.title}</p>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString("ja-JP")}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
