"use client";

import { useState, type SubmitEvent } from "react";
import type { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import CategoryForm from "@/app/_components/admin/CategoryForm";

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

      <CategoryForm
        name={name}
        setName={setName}
        error={errors.name}
        isSubmitting={isSubmitting}
        submitLabel="作成"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
