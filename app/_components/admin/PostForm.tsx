"use client";

import type { SubmitEvent } from "react";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";

type Props = {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (thumbnailUrl: string) => void;
  categories: CategoriesResponse["categories"];
  selectCategories: number[];
  setSelectCategories: (
    selectCategories: number[] | ((prev: number[]) => number[])
  ) => void;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
};

export default function PostForm({
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  selectCategories,
  setSelectCategories,
  isSubmitting,
  submitLabel,
  onSubmit,
  onDelete,
}: Props) {
  // カテゴリー選択 切り替え
  const handleCategoryChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectCategories((prev) => [...prev, id]);
    } else {
      setSelectCategories((prev) =>
        prev.filter((categoryId) => categoryId !== id)
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      {/* タイトル 入力 */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">タイトル</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="border border-gray-300 w-full px-3 py-2"
        />
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
      </div>
      {/* サムネイルURL 入力 */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">サムネイルURL</label>
        <input
          type="text"
          value={thumbnailUrl}
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
        >
          {submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="rounded-lg bg-red-600 text-white px-4 py-2 disabled:opacity-50"
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
