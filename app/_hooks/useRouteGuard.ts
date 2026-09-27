import { useSupabaseSession } from "./useSupabaseSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession()
  
  useEffect(() => {
    if (isLoading) return // sessionの取得中は何もしない

    const fetcher = async () => {
      if (session === null) {
        router.replace('/signin')
      }
    }

    fetcher()
  }, [router, isLoading, session])  
}
