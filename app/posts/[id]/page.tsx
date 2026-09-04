"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Post } from "@/app/_types/types";
import CategoryTag from "@/app/_components/CategoryTag";

// 記事詳細
export default function PostDetail() {

  const { id } = useParams();
  const [ post, setPost ]       = useState<Post | null>(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);

  const backLink = <Link href="/" className="inline-block mt-8 text-blue-600 font-semibold hover:underline">
      記事一覧へ戻る</Link>;

  // 記事詳細取得
  useEffect(() => {
    const fetcher = async () => {

      try {
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);

        if (!res.ok) throw new Error('Failed to fetch posts')

        const { post } = await res.json();
        setPost(post);  
      } catch {
        setError('記事の取得に失敗しました。')
      } finally {
        setLoading(false);
      }
      
    };
        
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
      <div>
        <p className="text-center text-gray-500 py-12">
          {error}
        </p>
        {backLink}
      </div>
    )
  }
  
  // 記事がない場合はメッセージを表示
  if(!post) {
    return (
      <div>
        <p className="text-center text-gray-500 py-12">
          記事が見つかりませんでした
        </p>
        {backLink}
      </div>
    )
  }

  const {title, thumbnailUrl, createdAt, categories, content} = post;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* サムネ画像 */}
      <Image src={thumbnailUrl} alt={title} width={800} height={400}
      className="py-4 object-cover shrink-0" />
      <div className="flex flex-row items-center gap-2 mb-6">
        {/* 作成時間 */}
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString('ja-JP', {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {/* カテゴリタグ */}
        <div>
          {categories.map((categorie) => (
            <CategoryTag key={categorie} categorie={categorie} />
          ))}
        </div>
      </div>
      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {/* 本文 */}
      <div dangerouslySetInnerHTML={{ __html: content }} 
      className="text-base leading-7" />

      {/* 戻る */}
      {backLink}
    </div>
  )
}
