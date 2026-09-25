import { NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";

// 記事情報一覧レスポンス
export type GetPostsResponse = {
  posts: {
    id: number,
    title: string,
    content: string,
    thumbnailImageKey: string,
    createdAt: Date,
    updatedAt: Date,
    postCategories: {
      category: {
        id: number,
        name: string,
      },
    }[],
  }[],
};

export const GET = async () => {
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
