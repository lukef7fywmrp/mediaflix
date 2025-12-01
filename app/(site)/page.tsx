"use client";

import { Radio, Star, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import HeroSearch from "@/components/HeroSearch";
import MediaTypeToggle from "@/components/MediaTypeToggle";
import TopMovies from "@/components/TopMovies";
import TopTVShows from "@/components/TopTVShows";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const searchParams = useSearchParams();
  const mediaType = searchParams.get("type") === "tv" ? "tv" : "movies";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="hidden md:block h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent whitespace-nowrap">
              Top {mediaType === "movies" ? "Movies" : "TV Shows"} right now
            </h1>
          </div>
          <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular{" "}
            {mediaType === "movies" ? "movies" : "TV shows"} according to The
            Movie Database (TMDB)
          </p>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <Radio className="h-3 w-3 text-green-500 animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Live Data
              </span>
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Star className="h-3 w-3 text-purple-500 fill-purple-500" />
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Powered by TMDB
              </span>
            </span>
          </div>

          {/* Hero Search */}
          <div className="mt-6 mb-4">
            <HeroSearch />
          </div>
        </div>

        {/* Media Type Toggle */}
        <MediaTypeToggle />

        <Separator className="mb-8" />

        {/* Content Grid */}
        {mediaType === "movies" ? <TopMovies /> : <TopTVShows />}
      </div>
    </div>
  );
}
