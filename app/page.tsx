"use client";

import MediaTypeToggle from "@/components/MediaTypeToggle";
import TopMovies from "@/components/TopMovies";
import TopTVShows from "@/components/TopTVShows";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Radio, Star, TrendingUp } from "lucide-react";
import { use } from "react";

export default function Home(props: {
  searchParams: Promise<{ type: string }>;
}) {
  const searchParams = use(props.searchParams);
  const mediaType = searchParams.type === "tv" ? "tv" : "movies";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Top {mediaType === "movies" ? "Movies" : "TV Shows"} right now
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular{" "}
            {mediaType === "movies" ? "movies" : "TV shows"} according to The
            Movie Database (TMDB)
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              TMDB Popular
            </Badge>
            <Badge variant="outline" className="group">
              <Radio className="size-4 group-hover:animate-pulse" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Media Type Toggle */}
        <MediaTypeToggle />

        <Separator className="mb-8" />

        {/* Content Grid */}
        {mediaType === "movies" ? <TopMovies /> : <TopTVShows />}

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Powered by The Movie Database (TMDB)</p>
        </div>
      </div>
    </div>
  );
}
