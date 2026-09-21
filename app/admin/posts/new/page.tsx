"use client";

import { ChangeEvent, useEffect, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/_libs/supabase";
import type { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";
import PostForm from "@/app/_components/admin/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminPostNewPage() {

  const router = useRouter();
  const { token } = useSupabaseSession();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ]     = useState<string | null>(null);

  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");
  const [ thumbnailImageKey, setThumbnailImageKey ] = useState("");
  const [ thumbnailImageUrl, setThumbnailImageUrl ] = useState<null | string>(null);
  const [ categories, setCategories ]     = useState<CategoriesResponse["categories"]>([]);
  const [ selectCategories, setSelectCategories ] = useState<number[]>([]);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // カテゴリー一覧取得
  useEffect(() => {
    const fetcher = async () => {

      if (!token) return;

      try {
        const res = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { categories } = await res.json();
        setCategories(categories);

      } catch {
        setError('カテゴリーの取得に失敗しました。');
      } finally {
        setLoading(false);
      }

    }

    fetcher();
  }, [token]);

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

  // 新規記事送信
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) return;

    const body: CreatePostRequestBody = {
      title,
      content,
      thumbnailImageKey,
      categories: selectCategories.map((id) => ({ id })),
    };

    setIsSubmitting(true);

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

    } finally {
      setIsSubmitting(false);
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
    setThumbnailImageKey(data.path);

  }

  return (
    <div>
      <h1 className="text-2xl font-bold">記事作成</h1>

      <PostForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        categories={categories}
        selectCategories={selectCategories}
        setSelectCategories={setSelectCategories}
        isSubmitting={isSubmitting}
        submitLabel="作成"
        onSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        thumbnailImageUrl={thumbnailImageUrl}
      />
    </div>
  );
}
