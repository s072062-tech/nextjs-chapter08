"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import CategoryForm, { type CategoryFormData } from "@/app/_components/admin/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminCategoryNewPage() {

  const router = useRouter();
  const { token } = useSupabaseSession();
  const { register, handleSubmit, formState: { isSubmitting }, } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
    },
  });

  // 新規カテゴリー追加
  const onSubmit = async (data: CategoryFormData) => {
    if (!token) return;

    const body: CreateCategoryRequestBody = { name: data.name };

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
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">カテゴリー作成</h1>

      <CategoryForm
        register={register}
        isSubmitting={isSubmitting}
        submitLabel="作成"
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
