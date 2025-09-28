import MediaTypeToggleWrapper from "@/components/MediaTypeToggleWrapper";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import TopMovies from "@/components/TopMovies";
import TopTVShows from "@/components/TopTVShows";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Radio, Star, TrendingUp } from "lucide-react";
import { Suspense } from "react";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

interface HomeProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const mediaType = searchParams.type === "tv" ? "tv" : "movies";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Top 10 {mediaType === "movies" ? "Movies" : "TV Shows"}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the highest-rated{" "}
            {mediaType === "movies" ? "movies" : "TV shows"} according to The
            Movie Database (TMDB)
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              TMDB Rated
            </Badge>
            <Badge variant="outline" className="group">
              <Radio className="size-4 group-hover:animate-pulse" />
              Live Data
            </Badge>
          </div>
        </div>

        {/* Media Type Toggle */}
        <MediaTypeToggleWrapper />

        <Separator className="mb-8" />

        {/* Content Grid */}
        <Suspense fallback={<LoadingSkeleton />}>
          {mediaType === "movies" ? <TopMovies /> : <TopTVShows />}
        </Suspense>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground">
          <p>Powered by The Movie Database (TMDB)</p>
        </div>
      </div>
    </div>
  );
}
