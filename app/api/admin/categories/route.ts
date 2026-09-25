import { NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";

// カテゴリー一覧レスポンス
export type CategoriesResponse = {
  categories: {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
  }[]
};

// カテゴリー作成リクエスト
export type CreateCategoryRequestBody = {
  name: string,
};

// カテゴリー作成レスポンス
export type CreateCategoryResponse = {
  id: number,
};

export const GET = async (request: Request) => {
  const token = request.headers.get('Authorization') ?? '';

  const { error } = await supabase.auth.getUser(token);

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  try {
    // Categoryの一覧を取得
    const categories = await prisma.category.findMany({
      // 作成日時の降順
      orderBy: {
        createdAt: "desc",
      },
    });
  
    // レスポンス
    return NextResponse.json<CategoriesResponse>({ categories }, { status: 200 });

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
    const body = (await request.json()) as CreateCategoryRequestBody;
    const { name } = body;

    // nameを設定してCategoryを新規作成
    const category = await prisma.category.create({
      data: { name },
    });
  
    // レスポンス
    return NextResponse.json<CreateCategoryResponse>({ id: category.id }, { status: 200 });

  // エラー
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
