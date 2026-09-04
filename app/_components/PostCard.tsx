"use client";

import Link from "next/link";
import Image from "next/image";
import type { Post } from "../_types/types";
import CategoryTag from "./CategoryTag";

type PostCardProps = {
  post: Post,
};

// 記事情報
export default function PostCard({ post }: PostCardProps) {
  const {id, title, thumbnailUrl, createdAt, categories, content} = post;

  return (
    <Link href={`/posts/${id}`} className="block">
      <div className="flex flex-row overflow-hidden shadow-sm hover:shadow-md transition">
        {/* サムネ画像 */}
        <Image src={thumbnailUrl} alt={title} width={240} height={160} 
        className="py-4 object-cover shrink-0" />
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
              {categories.map((categorie) => (
                <CategoryTag key={categorie} categorie={categorie} />
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
