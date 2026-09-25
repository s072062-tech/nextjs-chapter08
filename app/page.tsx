"use client";

import useSWR from "swr";
import type { GetPostsResponse } from "@/app/api/posts/route";
import PostCard from "./_components/PostCard";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message ?? "記事の取得に失敗しました。");
  }

  const { posts }: GetPostsResponse = await res.json();
  return posts;
};

// 記事一覧ページ
export default function Home () {

  // 記事一覧取得
  const { data: posts, error, isLoading } = useSWR("/api/posts", fetcher);

  // 読み込み中表示
  if(isLoading) {
    return (
      <p className="text-center text-gray-500 py-12">
        記事を読み込み中です...
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      {/* 記事情報表示 */}
      <div className="space-y-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
