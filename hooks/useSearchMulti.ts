import tmdbClient from "@/lib/tmdbClient";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useSearchMulti(query: string) {
  return useInfiniteQuery({
    queryKey: ["search", "multi", query.trim()],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await tmdbClient.v3.search.searchMulti({
        query: query.trim(),
        page: pageParam,
        // include_adult: true,
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
        totalResults: response.total_results,
      };
    },
    enabled: !!query.trim(),
    staleTime: Infinity, // Never consider data stale - prevents all automatic refetching
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Stop if we've reached the last page
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }

      // Stop if last page had no results
      if (lastPage.results.length === 0) {
        return undefined;
      }

      // Continue to next page if there are more results available
      return lastPage.page + 1;
    },
  });
}
