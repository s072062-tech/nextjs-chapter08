"use client";

import Image from "next/image";
import type { ChangeEvent, FormEvent } from "react";
import type { UseFormGetValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";

export type PostFormData = {
  title: string,
  content: string,
  thumbnailImageKey: string,
  categories: number[],
};

type Props = {
  register: UseFormRegister<PostFormData>;
  setValue: UseFormSetValue<PostFormData>;
  getValues: UseFormGetValues<PostFormData>;
  categories: CategoriesResponse["categories"];
  selectCategories: number[];
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  handleImageChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  thumbnailImageUrl?: string | null;
};

export default function PostForm({
  register,
  setValue,
  getValues,
  categories,
  selectCategories,
  isSubmitting,
  submitLabel,
  onSubmit,
  onDelete,
  handleImageChange,
  thumbnailImageUrl,
}: Props) {
  // カテゴリー選択 切り替え
  const handleCategoryChange = (id: number, checked: boolean) => {
    const current = getValues("categories");
    if (checked) {
      setValue("categories", [...current, id]);
    } else {
      setValue(
        "categories",
        current.filter((categoryId) => categoryId !== id)
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
          {...register("title")}
          disabled={isSubmitting}
          className="border border-gray-300 w-full px-3 py-2"
        />
      </div>
      {/* 内容 入力 */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">内容</label>
        <textarea
          {...register("content")}
          disabled={isSubmitting}
          className="border border-gray-300 w-full h-40 px-3 py-2"
        />
      </div>
      {/* サムネイル画像 */}
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイル画像
        </label>
        <input type="file" id="thumbnailImageKey" onChange={handleImageChange} accept="image/*" />
      </div>

      {thumbnailImageUrl && (
        <div className="mt-2">
          <Image src={thumbnailImageUrl} alt="thumbnail" height={400} width={800} />
        </div>
      )}

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
