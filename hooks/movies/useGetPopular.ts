import { useQuery } from "@tanstack/react-query";
import type { MoviesGetPopularResponse } from "tmdb-js-web";
import apiClient from "@/lib/tmdbClient";

function useGetPopular() {
  return useQuery<MoviesGetPopularResponse>({
    queryKey: ["movies", "popular"],
    queryFn: async () => await apiClient.v3.movies.getPopular({ page: 1 }),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export default useGetPopular;
