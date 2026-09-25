"use client";

import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/_libs/supabase";
import type { GetPostsIdResponse } from "@/app/api/posts/[id]/route";
import type { UpdatePostRequestBody } from "@/app/api/admin/posts/[id]/route";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";
import PostForm, { type PostFormData } from "@/app/_components/admin/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const categoriesFetcher = async ([url, token]: [string, string]) => {
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

  const { categories }: CategoriesResponse = await res.json();
  return categories;
};

const postFetcher = async ([url, token]: [string, string]) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message ?? "記事の取得に失敗しました。");
  }

  const { post }: GetPostsIdResponse = await res.json();
  return post;
};

export default function AdminPostIdPage() {

  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ thumbnailImageUrl, setThumbnailImageUrl ] = useState<null | string>(null);

  // IDの記事, カテゴリー一覧 取得
  const { data: categories, error: categoriesError, isLoading: isCategoriesLoading } = useSWR(
    token ? ["/api/admin/categories", token] : null,
    categoriesFetcher,
  );

  const { data: post, error: postError, isLoading: isPostLoading } = useSWR(
    token && id ? [`/api/admin/posts/${id}`, token] : null,
    postFetcher,
  );

  const error = postError ?? categoriesError;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<PostFormData>({
    defaultValues: {
      title: "",
      content: "",
      thumbnailImageKey: "",
      categories: [],
    },
  });

  const thumbnailImageKey = watch("thumbnailImageKey");
  const selectCategories = watch("categories");

  // 取得した記事の値を設定
  useEffect(() => {
    if (!post) return;

    reset({
      title: post.title,
      content: post.content,
      thumbnailImageKey: post.thumbnailImageKey,
      categories: post.postCategories.map((postCategory) => postCategory.category.id),
    });
  }, [post, reset]);

  // thumbnailImageKeyを用いて画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  // 記事更新
  const onSubmit = async (data: PostFormData) => {
    if (!token) return;

    const body: UpdatePostRequestBody = {
      title: data.title,
      content: data.content,
      thumbnailImageKey: data.thumbnailImageKey,
      categories: data.categories.map((categoryId) => ({ id: categoryId })),
    };

    try {
      await fetch(`/api/admin/posts/${id}`, {
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

  // 記事削除
  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return;

    if (!token) return;

    setIsDeleting(true);

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      alert("削除しました");
      router.push('/admin/posts');

    } catch(error) {
      console.error("削除に失敗しました:", error);

    } finally {
      setIsDeleting(false);
    }
  }

  // サムネイル画像設定
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files || e.target.files.length == 0) {
      return;
    }

    const file = e.target.files[0];
    const filePath = `private/${uuidv4()}`;

    const { data, error } = await supabase.storage
      .from('post_thumbnail')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setValue("thumbnailImageKey", data.path);
  }

  // 読み込み中表示
  if(isCategoriesLoading || isPostLoading) {
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
      <h1 className="text-2xl font-bold">記事作成</h1>

      <PostForm
        register={register}
        setValue={setValue}
        getValues={getValues}
        categories={categories ?? []}
        selectCategories={selectCategories}
        isSubmitting={isSubmitting || isDeleting}
        submitLabel="更新"
        onSubmit={handleSubmit(onSubmit)}
        onDelete={handleDelete}
        handleImageChange={handleImageChange}
        thumbnailImageUrl={thumbnailImageUrl}
      />
    </div>
  );
}
