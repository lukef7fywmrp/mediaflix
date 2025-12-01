"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Film, Tv } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import apiClient from "@/lib/tmdbClient";

export default function MediaTypeToggle() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const currentType = (searchParams.get("type") as "movies" | "tv") || "movies";
  const router = useRouter();
  const [value, setValue] = useState<string>(currentType);

  // Sync the tab value with URL changes
  useEffect(() => {
    setValue(currentType);
  }, [currentType]);

  const handlePrefetch = (type: "movies" | "tv") => {
    queryClient.prefetchQuery({
      queryKey: [type, "popular"],
      queryFn: async () =>
        type === "movies"
          ? await apiClient.v3.movies.getPopular({ page: 1 })
          : await apiClient.v3.tv.getPopular({ page: 1 }),
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  };

  return (
    <div className="flex items-center justify-center mb-8">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList className="bg-muted/50 border border-border/50 rounded-lg p-1">
          <TabsTrigger
            value="movies"
            className="flex items-center gap-2"
            aria-label="Show Movies"
            onClick={() => router.push("/")}
            onMouseOver={() => {
              handlePrefetch("movies");
              router.prefetch("/");
            }}
          >
            <Film className="h-4 w-4" />
            Movies
          </TabsTrigger>
          <TabsTrigger
            value="tv"
            className="flex items-center gap-2"
            aria-label="Show TV Shows"
            onClick={() => router.push("/?type=tv")}
            onMouseOver={() => {
              handlePrefetch("tv");
              router.prefetch("/?type=tv");
            }}
          >
            <Tv className="h-4 w-4" />
            TV Shows
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
