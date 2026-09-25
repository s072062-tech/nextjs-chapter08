"use client";

import { ChangeEvent, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/_libs/supabase";
import type { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";
import PostForm, { type PostFormData } from "@/app/_components/admin/PostForm";
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

  const { categories }: CategoriesResponse = await res.json();
  return categories;
};

export default function AdminPostNewPage() {

  const router = useRouter();
  const { token } = useSupabaseSession();
  const [ thumbnailImageUrl, setThumbnailImageUrl ] = useState<null | string>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
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

  // カテゴリー一覧取得
  const { data: categories, error, isLoading } = useSWR(
    token ? ["/api/admin/categories", token] : null,
    fetcher,
  );

  // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
  useEffect(() => {
    if (!thumbnailImageKey) return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  // 新規記事送信
  const onSubmit = async (data: PostFormData) => {
    if (!token) return;

    const body: CreatePostRequestBody = {
      title: data.title,
      content: data.content,
      thumbnailImageKey: data.thumbnailImageKey,
      categories: data.categories.map((id) => ({ id })),
    };

    try {
      await fetch("/api/admin/posts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      alert("作成しました");
      router.push('/admin/posts');

    } catch(error) {
      console.error("作成に失敗しました:", error);
    }
  }

  // サムネイル画像設定
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {

    if (!e.target.files || e.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = e.target.files[0];         // 選択された画像を取得
    const filePath = `private/${uuidv4()}`; // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail')   // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setValue("thumbnailImageKey", data.path);
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
      <h1 className="text-2xl font-bold">記事作成</h1>

      <PostForm
        register={register}
        setValue={setValue}
        getValues={getValues}
        categories={categories ?? []}
        selectCategories={selectCategories}
        isSubmitting={isSubmitting}
        submitLabel="作成"
        onSubmit={handleSubmit(onSubmit)}
        handleImageChange={handleImageChange}
        thumbnailImageUrl={thumbnailImageUrl}
      />
    </div>
  );
}
