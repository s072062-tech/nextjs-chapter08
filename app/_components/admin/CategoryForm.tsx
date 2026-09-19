"use client";

import type { SubmitEvent } from "react";

type Props = {
  name: string;
  setName: (name: string) => void;
  error?: string;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
};

export default function CategoryForm({
  name,
  setName,
  error,
  isSubmitting,
  submitLabel,
  onSubmit,
  onDelete,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* カテゴリー名 入力 */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">カテゴリー名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
          className="border border-gray-300 w-full px-3 py-2"
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
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
