"use client";

type CategoryTagProps = { 
  categorie: string,
};

// カテゴリタグ
export default function CategoryTag({ categorie }: CategoryTagProps) {
  return (
    <span 
    className="inline-block text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mr-1">
      {categorie}
    </span>
  )
}
