import { NextResponse } from "next/server";
import { prisma } from "@/app/_libs/prisma";
import { supabase } from "@/app/_libs/supabase";
import type { PropsParams } from "@/app/_types/types";

// カテゴリーレスポンス
export type CategoryResponse = {
  category: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }
}

// カテゴリー更新リクエスト
export type UpdateCategoryRequestBody = {
  name: string,
};

export const GET = async (request: Request, {params}: PropsParams) => {
  const token = request.headers.get('Authorization') ?? '';

  const { error } = await supabase.auth.getUser(token);

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 });

  const {id} = await params;
  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    return NextResponse.json({ message: "不正なIDです" }, { status: 400 });
  }

  try {
    // Idを指定してCategoryを取得
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ message: "カテゴリーが見つかりません" }, { status: 404 },);
    }

    // レスポンス
    return NextResponse.json<CategoryResponse>({ category }, { status: 200 });

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
  const categoryId = Number(id);

  const body = (await request.json()) as UpdateCategoryRequestBody;
  const { name } = body;

  try {
    // 指定されたCategoryを更新
    await prisma.category.update({
      where: { id: categoryId },
      data: { name },
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
  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    return NextResponse.json({ message: "不正なIDです" }, { status: 400 });
  }

  try {
    // Idを指定してCategoryを削除
    await prisma.category.delete({
      where: { id: categoryId },
    });

    // レスポンス
    return NextResponse.json({ message: "OK" }, { status: 200 });

  // エラー
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
