"use client";

import { useState, type SubmitEvent } from "react";
import type { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";

export default function AdminCategoryNewPage() {
  type FormErrors = {
    name?: string,
  };

  const [ name, setName ] = useState("");
  const [ errors, setErrors ] = useState<FormErrors>({});
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // バリデーション
  const validate = () => {
    const newErrors: FormErrors = {};

    if(!name) {
      newErrors.name = "カテゴリー名は必須です。";
    }

    return newErrors;
  }

  // 新規カテゴリー送信
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const validationErrors = validate();

    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const body: CreateCategoryRequestBody = { name };
    setIsSubmitting(true);

    try {
      await fetch("/api/admin/categories", {
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

  return (
    <div>
      <h1 className="text-2xl font-bold">カテゴリー作成</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* カテゴリー名 入力 */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">カテゴリー名</label>
          <input
            type="text" value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={isSubmitting}
            className="border border-gray-300 w-full px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
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
