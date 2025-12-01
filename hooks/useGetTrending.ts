import { useQuery } from "@tanstack/react-query";
import type { TrendingGetTrendingResponse } from "tmdb-js-web";
import apiClient from "@/lib/tmdbClient";

function useGetTrending() {
  return useQuery<TrendingGetTrendingResponse>({
    queryKey: ["trending", "all", "day"],
    queryFn: async () =>
      await apiClient.v3.trending.getTrending("all", "day", "en-US"),
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 12, // 12 hours
  });
}

export default useGetTrending;
