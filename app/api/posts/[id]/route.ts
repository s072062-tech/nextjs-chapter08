import { NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import type { PropsParams } from "@/app/_types/types";

// 記事詳細レスポンス
export type GetPostsIdResponse = {
  post: {
    id: number,
    title: string,
    content: string,
    thumbnailUrl: string,
    createdAt: Date,
    updatedAt: Date,
    postCategories: {
      category: {
        id: number,
        name: string,
      },
    }[],
  },
};

export const GET = async (_request: Request, {params}: PropsParams) => {
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
