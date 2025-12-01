import { useQuery } from "@tanstack/react-query";
import type { ConfigurationGetLanguagesResponse } from "tmdb-js-web";
import apiClient from "@/lib/tmdbClient";

function useGetLanguages() {
  return useQuery<ConfigurationGetLanguagesResponse>({
    queryKey: ["languages"],
    queryFn: async () => {
      const response = await apiClient.v3.configuration.getLanguages();
      return response || [];
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days - languages rarely change
  });
}

export default useGetLanguages;
