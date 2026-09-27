import { NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import type { PropsParams } from "@/app/_types/types";
import type { GetPostsIdResponse } from "@/app/api/posts/[id]/route";

// 記事更新リクエスト
export type UpdatePostRequestBody = {
  title: string,
  content: string,
  categories: { id: number }[],
  thumbnailImageKey: string,
};

export const GET = async (request: Request, {params}: PropsParams) => {
  const token = request.headers.get('Authorization') ?? '';

  const { error } = await supabase.auth.getUser(token);

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const {id} = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return NextResponse.json({ message: "不正なIDです" }, { status: 400 });
  }

  try {
    // Idを指定してPostを取得
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "記事が見つかりません" }, { status: 404 },);
    }

    // レスポンス
    return NextResponse.json<GetPostsIdResponse>({ post }, { status: 200 });

  // エラー
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = async (request: Request, {params}: PropsParams) => {
  const token = request.headers.get('Authorization') ?? '';

  const { error } = await supabase.auth.getUser(token);

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const {id} = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return NextResponse.json({ message: "不正なIDです" }, { status: 400 });
  }

  const body = (await request.json()) as UpdatePostRequestBody;
  const { title, content, categories, thumbnailImageKey } = body;

  try {
    // 指定されたPostを更新
    await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        thumbnailImageKey,
        postCategories: {
          deleteMany: {},
          create: categories.map((category) => ({ categoryId: category.id })),
        },
      },
    });

    // レスポンス
    return NextResponse.json({ message: "OK" }, { status: 200 });

  // エラー
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const DELETE = async (request: Request, {params}: PropsParams) => {
  const token = request.headers.get('Authorization') ?? '';

  const { error } = await supabase.auth.getUser(token);
  
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const {id} = await params;
  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return NextResponse.json({ message: "不正なIDです" }, { status: 400 });
  }

  try {
    // Idを指定してPostを削除
    await prisma.post.delete({
      where: { id: postId },
    });

    // レスポンス
    return NextResponse.json({ message: "OK" }, { status: 200 });

  // エラー
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
