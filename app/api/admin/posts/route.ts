import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import { GetPostsResponse } from "../../posts/route";

// 記事作成リクエスト
export type CreatePostRequestBody = {
  title: string,
  content: string,
  categories: { id: number }[],
  thumbnailImageKey: string,
};

// 記事作成レスポンス
export type CreatePostResponse = {
  id: number,
};

export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get('Authorization') ?? '';

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含める
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時の降順
      orderBy: {
        createdAt: "desc",
      },
    });

    // レスポンス
    return NextResponse.json<GetPostsResponse>({ posts }, { status: 200 });

  // エラー
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = async (request: Request) => {
  const token = request.headers.get('Authorization') ?? '';

  const { error } = await supabase.auth.getUser(token);
  
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    const body = (await request.json()) as CreatePostRequestBody;
    const { title, content, categories, thumbnailImageKey } = body;

    // dataを設定してPostを新規作成
    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
        postCategories: {
          create: categories.map((category) => ({ categoryId: category.id })),
        },
      },
    });

    // レスポンス
    return NextResponse.json<CreatePostResponse>({ id: post.id }, { status: 200 });

  // エラー
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
