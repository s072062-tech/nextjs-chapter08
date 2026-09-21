"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import type { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import CategoryForm from "@/app/_components/admin/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminCategoryNewPage() {

  const router = useRouter();
  const { token } = useSupabaseSession();
  const [ name, setName ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // 新規カテゴリー追加
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault();

    if (!token) return;

    const body: CreateCategoryRequestBody = { name };
    setIsSubmitting(true);

    try {
      await fetch("/api/admin/categories", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      alert("作成しました");
      router.push('/admin/categories');

    } catch(error) {
      console.error("作成に失敗しました:", error);

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
        isSubmitting={isSubmitting}
        submitLabel="作成"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
