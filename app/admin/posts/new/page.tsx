"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import type { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";

export default function AdminPostNewPage() {
  type FormErrors = {
    title?: string,
  };

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);

  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");
  const [ thumbnailUrl, setThumbnailUrl ] = useState("");
  const [ categories, setCategories ]     = useState<CategoriesResponse["categories"]>([]);
  const [ selectCategories, setSelectCategories ] = useState<number[]>([]);
  const [ errors, setErrors ] = useState<FormErrors>({});
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

  // バリデーション
  const validate = () => {
    const newErrors: FormErrors = {};

    if(!title) {
      newErrors.title = "記事名は必須です。";
    }

    return newErrors;
  }

  // 新規記事送信
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const validationErrors = validate();

    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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

      alert("送信しました");
      setErrors({});

    } catch(error) {
      console.error("送信に失敗しました:", error);

    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCategoryChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectCategories((prev) => [...prev, id]);
    } else {
      setSelectCategories((prev) => prev.filter((categoryId) => categoryId !== id));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">記事作成</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル 入力 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">タイトル</label>
          <input
            type="text" value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            disabled={isSubmitting}
            className="border border-gray-300 w-full px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        {/* 内容 入力 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">内容</label>
          <textarea
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            disabled={isSubmitting}
            className="border border-gray-300 w-full h-40 px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        {/* サムネイルURL 入力 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">サムネイルURL</label>
          <input
            type="text" value={thumbnailUrl} 
            onChange={(e) => setThumbnailUrl(e.target.value)} 
            disabled={isSubmitting}
            className="border border-gray-300 w-full px-3 py-2"
          />
        </div>
        {/* カテゴリー選択 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">カテゴリー</label>
          <div className="border border-gray-300 rounded w-full px-3 py-2 flex flex-wrap gap-4">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectCategories.includes(category.id)}
                  onChange={(e) =>
                    handleCategoryChange(category.id, e.target.checked)
                  }
                  disabled={isSubmitting}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>      

        {/* ボタン */}
        <div className="flex gap-3">
          <button type="submit" 
          disabled={isSubmitting} 
          className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-50">
          作成</button>
        </div>
      </form>

    </div>
  );
}
