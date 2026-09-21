"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { GetPostsIdResponse } from "../api/posts/[id]/route";
import { supabase } from "@/app/_libs/supabase";
import CategoryTag from "./CategoryTag";

// 記事情報
export default function PostCard({ post }: GetPostsIdResponse) {
  const {id, title, thumbnailImageKey, createdAt, postCategories, content} = post;
  const [ thumbnailImageUrl, setThumbnailImageUrl ] = useState<string | null>(null);

  useEffect(() => {
    if (!thumbnailImageKey) return;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('post_thumbnail')
      .getPublicUrl(thumbnailImageKey);

    setThumbnailImageUrl(publicUrl);
  }, [thumbnailImageKey]);

  return (
    <Link href={`/posts/${id}`} className="block">
      <div className="flex flex-row overflow-hidden shadow-sm hover:shadow-md transition">
        {/* サムネ画像 */}
        {thumbnailImageUrl && (
          <Image src={thumbnailImageUrl} alt={title} width={240} height={160}
          className="py-4 object-cover shrink-0" />
        )}
        <div className="p-4">
          <div className="flex flex-row items-center gap-2 mb-2">
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
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          {/* 本文 */}
          <div dangerouslySetInnerHTML={{ __html: content }} 
          className="text-sm text-gray-700 line-clamp-2" />
        </div>
      </div>
    </Link>
  );
}
