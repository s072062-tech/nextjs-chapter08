"use client";

import type { FormEvent } from "react";
import type { UseFormRegister } from "react-hook-form";

export type CategoryFormData = {
  name: string,
};

type Props = {
  register: UseFormRegister<CategoryFormData>;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
};

export default function CategoryForm({
  register,
  isSubmitting,
  submitLabel,
  onSubmit,
  onDelete,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      {/* カテゴリー名 入力 */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">カテゴリー名</label>
        <input
          type="text"
          {...register("name")}
          disabled={isSubmitting}
          className="border border-gray-300 w-full px-3 py-2"
        />
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
