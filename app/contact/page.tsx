"use client";

import { useState, type SubmitEvent } from "react";

// お問い合わせ
export default function Contact() {

  type FormErrors = {
    name?: string,
    email?: string,
    message?: string,
  };

  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ message, setMessage ] = useState("");
  const [ errors, setErrors ] = useState<FormErrors>({});
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // バリデーション
  const validate = () => {
    const newErrors: FormErrors = {};

    if(!name) {
      newErrors.name = "お名前は必須です。";
    }
    else if(name.length > 30) {
      newErrors.name = "お名前は30文字以内で入力してください。"
    }

    if(!email) {
      newErrors.email = "メールアドレスは必須です。";
    }
    else if(!email.match(/.+@.+\..+/)) {
      newErrors.email = "メールアドレスの形式が正しくありません。"
    }

    if(!message) {
      newErrors.message = "本文は必須です。";
    }
    else if(message.length > 500) {
      newErrors.message = "本文は500文字以内で入力してください。"
    }

    return newErrors;
  }

  // 問い合わせ送信
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const validationErrors = validate();

    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        }
      );

      alert("送信しました");
      handleClear();
      setErrors({});

    } catch(error) {
      console.error("送信に失敗しました:", error);

    } finally {
      setIsSubmitting(false);
    }
  }

  // 入力クリア
  const handleClear = () => {
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">問合わせフォーム</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 名前 */}
        <div className="flex items-center gap-4">
          <label className="w-32 shrink-0 text-sm font-medium">お名前</label>
          <div className="w-full">
            <input
              type="text" value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        </div>
        {/* メールアドレス */}
        <div className="flex items-center gap-4">
          <label className="w-32 shrink-0 text-sm font-medium">メールアドレス</label>
          <div className="w-full">
            <input
              type="email" value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={isSubmitting} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>
        {/* 本文 */}
        <div className="flex items-center gap-4">
          <label className="w-32 shrink-0 text-sm font-medium pt-2">本文</label>
          <div className="w-full">
            <textarea
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              disabled={isSubmitting}
              className="w-full h-40 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>
        </div>
        {/* ボタン */}
        <div className="flex justify-center gap-4 pt-4">
          <button type="submit" 
          disabled={isSubmitting} 
          className="w-24 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-400">
          送信</button>
          <button type="button" onClick={handleClear} 
          disabled={isSubmitting}
          className="w-24 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          クリア</button>
        </div>
      </form>
    </div>
  )
}
