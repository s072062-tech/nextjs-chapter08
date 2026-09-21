"use client";

import { ChangeEvent, useEffect, useState, type SubmitEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/_libs/supabase";
import type { GetPostsIdResponse } from "@/app/api/posts/[id]/route";
import type { UpdatePostRequestBody } from "@/app/api/admin/posts/[id]/route";
import type { CategoriesResponse } from "@/app/api/admin/categories/route";
import PostForm from "@/app/_components/admin/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function AdminPostIdPage() {

  const router = useRouter();
  const { id } = useParams();
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

  // IDの記事, カテゴリー一覧 取得
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

      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { post } = await res.json() as GetPostsIdResponse;
        setTitle(post.title);
        setContent(post.content);
        setThumbnailImageKey(post.thumbnailImageKey);
        setSelectCategories(
          post.postCategories.map((postCategory) => postCategory.category.id)
        );

      } catch {
        setError('記事の取得に失敗しました。');
      } finally {
        setLoading(false);
      }

    }

    fetcher();
  }, [token, id]);

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

  // 記事更新
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) return;

    const body: UpdatePostRequestBody = {
      title,
      content,
      thumbnailImageKey,
      categories: selectCategories.map((id) => ({ id })),
    };

    setIsSubmitting(true);

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

    } finally {
      setIsSubmitting(false);
    }
  }

  // 記事削除
  const handleDelete = async () => {
    if (!confirm('削除しますか？')) return;

    if (!token) return;

    setIsSubmitting(true);

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
      setIsSubmitting(false);
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
        submitLabel="更新"
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        handleImageChange={handleImageChange}
        thumbnailImageUrl={thumbnailImageUrl}
      />
    </div>
  );
}
