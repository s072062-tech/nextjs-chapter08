"use client";

import { useForm } from "react-hook-form";

type FormData = {
  name: string,
  email: string,
  message: string,
}

// お問い合わせ
export default function Contact() {

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // 問い合わせ送信
  const onSubmit = async (data: FormData) => {
    try {
      await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      alert("送信しました");
      reset();

    } catch(error) {
      console.error("送信に失敗しました:", error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">問合わせフォーム</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* 名前 */}
        <div className="flex items-center gap-4">
          <label className="w-32 shrink-0 text-sm font-medium">お名前</label>
          <div className="w-full">
            <input
              type="text"
              {...register("name", {
                required: "お名前は必須です。",
                validate: (value) =>
                  value.length <= 30 || "お名前は30文字以内で入力してください。",
              })}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>
        {/* メールアドレス */}
        <div className="flex items-center gap-4">
          <label className="w-32 shrink-0 text-sm font-medium">メールアドレス</label>
          <div className="w-full">
            <input
              type="email"
              {...register("email", {
                required: "メールアドレスは必須です。",
                pattern: { value: /.+@.+\..+/, message: "メールアドレスの形式が正しくありません。" },
              })}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
        {/* 本文 */}
        <div className="flex items-center gap-4">
          <label className="w-32 shrink-0 text-sm font-medium pt-2">本文</label>
          <div className="w-full">
            <textarea
              {...register("message", {
                required: "本文は必須です。",
                validate: (value) =>
                  value.length <= 500 || "本文は500文字以内で入力してください。",
              })}
              disabled={isSubmitting}
              className="w-full h-40 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>
        </div>
        {/* ボタン */}
        <div className="flex justify-center gap-4 pt-4">
          <button type="submit"
          disabled={isSubmitting}
          className="w-24 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-400">
          送信</button>
          <button type="button" onClick={() => reset()}
          disabled={isSubmitting}
          className="w-24 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          クリア</button>
        </div>
      </form>
    </div>
  )
}
