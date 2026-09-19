"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import type { CategoryResponse, UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import CategoryForm from "@/app/_components/admin/CategoryForm";

export default function AdminCategoryIdPage() {
  type FormErrors = {
    name?: string,
  };

  const router = useRouter();
  const { id } = useParams();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);

  const [ name, setName ] = useState("");
  const [ errors, setErrors ] = useState<FormErrors>({});
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // IDのカテゴリー取得
  useEffect(() => {
    const fetcher = async () => {

      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const { category } = await res.json() as CategoryResponse;
        setName(category.name);

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

    if(!name) {
      newErrors.name = "カテゴリー名は必須です。";
    }

    return newErrors;
  }

  // カテゴリー更新
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const validationErrors = validate();

    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const body: UpdateCategoryRequestBody = { name };
    setIsSubmitting(true);

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      alert("更新しました");
      setErrors({});

    } catch(error) {
      console.error("更新に失敗しました:", error);

    } finally {
      setIsSubmitting(false);
    }
  }

  // カテゴリー削除
  const handleDelete = async () => { 
    if (!confirm('削除しますか？')) return;

    setIsSubmitting(true);

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      alert("削除しました");
      router.push('/admin/categories');

    } catch(error) {
      console.error("削除に失敗しました:", error);

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">カテゴリー編集</h1>

      <CategoryForm
        name={name}
        setName={setName}
        error={errors.name}
        isSubmitting={isSubmitting}
        submitLabel="更新"
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}
