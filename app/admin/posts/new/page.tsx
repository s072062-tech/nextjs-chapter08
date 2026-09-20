"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import type { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";
import PostForm from "@/app/_components/admin/PostForm";

export default function AdminPostNewPage() {

  const router = useRouter();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);

  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");
  const [ thumbnailUrl, setThumbnailUrl ] = useState("");
  const [ categories, setCategories ]     = useState<CategoriesResponse["categories"]>([]);
  const [ selectCategories, setSelectCategories ] = useState<number[]>([]);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // カテゴリー一覧取得
  useEffect(() => {
    const fetcher = async () => {

      try {
        const res = await fetch("/api/admin/categories");
        const { categories } = await res.json();
        setCategories(categories);

      } catch {
        setError('カテゴリーの取得に失敗しました。');
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

  // 新規記事送信
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault();

    const body: CreatePostRequestBody = { 
      title,
      content,
      thumbnailUrl, 
      categories: selectCategories.map((id) => ({ id })),
    };

    setIsSubmitting(true);

    try {
      await fetch("/api/admin/posts", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      alert("作成しました");
      router.push('/admin/posts');

    } catch(error) {
      console.error("作成に失敗しました:", error);

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">記事作成</h1>

      <PostForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        selectCategories={selectCategories}
        setSelectCategories={setSelectCategories}
        isSubmitting={isSubmitting}
        submitLabel="作成"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
