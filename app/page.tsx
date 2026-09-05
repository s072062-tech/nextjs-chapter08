"use client";

import { useEffect, useState } from "react";
import type { MicroCmsPost } from "./_types/types";
import PostCard from "./_components/PostCard";

// 記事一覧ページ
export default function Home () {

  const [ posts, setPosts ]     = useState<MicroCmsPost[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);

  // 記事一覧取得
  useEffect(() => {
    const fetcher = async () => {

      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL!, {
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_API_KEY!,
          },
        })
        const { contents } = await res.json()
        setPosts(contents)

      } catch {
        setError('記事の取得に失敗しました。')
      } finally {
        setLoading(false);
      }

    }

    fetcher();
  }, []);

  // 読み込み中表示
  if(loading) {
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
        {error}
      </p>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      {/* 記事情報表示 */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
