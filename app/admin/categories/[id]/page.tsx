"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { CategoryResponse, UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import CategoryForm, { type CategoryFormData } from "@/app/_components/admin/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const fetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message ?? "カテゴリーの取得に失敗しました。");
  }

  const { category }: CategoryResponse = await res.json();
  return category;
};

export default function AdminCategoryIdPage() {

  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [ isDeleting, setIsDeleting ] = useState(false);

  // IDのカテゴリー取得
  const { data: category, error, isLoading } = useSWR(
    token && id ? [`/api/admin/categories/${id}`, token] : null,
    fetcher,
  );

  const { register, handleSubmit, reset, formState: { isSubmitting }, } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
    },
  });

  // 取得したカテゴリーの値を設定
  useEffect(() => {
    if (!category) return;

    reset({ 
      name: category.name 
    });
  }, [category, reset]);

  // カテゴリー更新
  const onSubmit = async (data: CategoryFormData) => {
    if (!token) return;

    const body: UpdateCategoryRequestBody = { name: data.name };

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      alert("更新しました");

    } catch(error) {
      console.error("更新に失敗しました:", error);
    }
  }

  // カテゴリー削除
  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return;

    if (!token) return;

    setIsDeleting(true);

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      alert("削除しました");
      router.push('/admin/categories');

    } catch(error) {
      console.error("削除に失敗しました:", error);

    } finally {
      setIsDeleting(false);
    }
  }

  // 読み込み中表示
  if(isLoading) {
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
        {error.message}
      </p>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">カテゴリー編集</h1>

      <CategoryForm
        register={register}
        isSubmitting={isSubmitting || isDeleting}
        submitLabel="更新"
        onSubmit={handleSubmit(onSubmit)}
        onDelete={handleDelete}
      />
    </div>
  );
}
