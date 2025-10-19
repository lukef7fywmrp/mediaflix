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
    staleTime: 0, // No caching - always fetch fresh
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    initialPageParam: 1,
    // No maxPages limit - keep all loaded pages in memory
    getNextPageParam: (lastPage, allPages) => {
      // Stop if we've reached the last page
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }

      // Immediate stop: if last page had no results, don't fetch more
      if (lastPage.results.length === 0) {
        return undefined;
      }

      // After first page, check if we have enough results
      if (allPages.length >= 1) {
        const totalResults = allPages.reduce(
          (sum, page) => sum + page.results.length,
          0,
        );
        // If we only have 1-2 results after a page, stop
        if (totalResults <= 2) {
          return undefined;
        }
      }

      return lastPage.page + 1;
    },
  });
}
