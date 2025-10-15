import apiClient from "@/lib/tmdbClient";
import { useQuery } from "@tanstack/react-query";
import { TrendingGetTrendingResponse } from "tmdb-js-web";

function useGetTrending() {
  return useQuery<TrendingGetTrendingResponse>({
    queryKey: ["trending", "all", "day"],
    queryFn: async () => await apiClient.v3.trending.getTrending("all", "day"),
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
    gcTime: 1000 * 60 * 60 * 12, // 12 hours
  });
}

export default useGetTrending;
