"use client";

import Link from "next/link";
import React from "react";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { supabase } from "../_libs/supabase";
import { useRouter } from "next/navigation";

// 共通ヘッダー
export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await router.replace('/');
  }  

  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="items-center px-4 py-3 bg-gray-800 text-white">
      <nav className="flex justify-between gap-4">
        <Link href="/" className="hover:underline">Blog</Link>

        {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin/posts" className="hover:underline">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="hover:underline">
                お問い合わせ
              </Link>
              <Link href="/signin" className="hover:underline">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
      </nav>
    </header>
  );
}
