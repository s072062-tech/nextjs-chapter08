"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { GetPostsIdResponse } from "@/app/api/posts/[id]/route";
import { supabase } from "@/app/_libs/supabase";
import CategoryTag from "@/app/_components/CategoryTag";


// 記事詳細
export default function PostDetail() {

  const { id } = useParams();
  const [ post, setPost ]       = useState<GetPostsIdResponse["post"] | null>(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);
  const [ thumbnailImageUrl, setThumbnailImageUrl ] = useState<string | null>(null);

  const backLink = <Link href="/" className="inline-block mt-8 text-blue-600 font-semibold hover:underline">
      記事一覧へ戻る</Link>;

  // 記事詳細取得
  useEffect(() => {
    const fetcher = async () => {

      try {
        const res = await fetch(`/api/posts/${id}`);
        const { post } = await res.json() as GetPostsIdResponse;
        setPost(post) 

      } catch {
        setError('記事の取得に失敗しました。')
      } finally {
        setLoading(false);
      }
      
    };
        
    fetcher();
  }, []);

  // thumbnailImageKeyを用いて画像のURLを取得
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(post.thumbnailImageKey);

    setThumbnailImageUrl(publicUrl);
  }, [post?.thumbnailImageKey]);

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

  const {title, createdAt, postCategories, content} = post;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      {/* サムネ画像 */}
      {thumbnailImageUrl && (
        <Image src={thumbnailImageUrl} alt={title} width={800} height={400}
        className="py-4 object-cover shrink-0" />
      )}
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
          {postCategories.map(({category}) => (
            <CategoryTag key={category.name} categorie={category.name} />
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
