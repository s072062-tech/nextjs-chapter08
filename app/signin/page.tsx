"use client";

import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormData = {
  email: string,
  password: string,
}

export default function Page() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert('ログインに失敗しました');
    } else {
      router.replace('/admin/posts');
    }
  }

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "メールアドレスは必須です。" ,
              pattern: { value: /.+@.+\..+/, message: "メールアドレスの形式が正しくありません。"},
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "パスワードは必須です。" ,
              minLength: { value: 8, message: "パスワードは8文字以上で入力してください" },
            })}
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting}
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
