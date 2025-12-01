import { useQuery } from "@tanstack/react-query";
import type { TVGetPopularResponse } from "tmdb-js-web";
import apiClient from "@/lib/tmdbClient";

function useGetPopular() {
  return useQuery<TVGetPopularResponse>({
    queryKey: ["tv", "popular"],
    queryFn: async () => await apiClient.v3.tv.getPopular({ page: 1 }),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export default useGetPopular;
