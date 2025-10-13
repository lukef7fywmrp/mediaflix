import tmdbClient from "@/lib/tmdbClient";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useSearchMulti(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", "multi", query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tmdbClient.v3.search.searchMulti({
        query,
        page: pageParam,
        include_adult: true,
      });

      const filtered = response.results.filter(
        (item) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.poster_path,
      );

      return {
        results: filtered,
        page: pageParam,
        totalPages: response.total_pages,
      };
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}
