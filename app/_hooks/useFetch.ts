import useSWR from "swr";

type Endpoint = string | [string, string];

const fetcher = async (endpoint: Endpoint) => {

  // 引数がendpointのみと複数の場合に対応
  const [url, token] = Array.isArray(endpoint) ? endpoint : [endpoint];

  // tokenが設定されている場合はヘッダーにAuthorizationを付ける
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
    },
  });

  if (!res.ok) {
    const errorData: { message?: string } = await res.json();
    throw new Error(errorData.message ?? "データの取得に失敗しました。");
  }

  return res.json();
};

// fetcherとuseSWRの処理を1つにまとめるカスタムフック
export const useFetch = <T = unknown>(endpoint: Endpoint | null) => {
  const { data, error, isLoading } = useSWR<T, Error>(endpoint, fetcher);

  return { data, error, isLoading };
};
