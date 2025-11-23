import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getPosterUrl } from "@/lib/utils";
import { Calendar, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MoviesGetTopRatedResult } from "tmdb-js-node";
import RatingSource from "./RatingSource";

interface MovieCardProps {
  movie: MoviesGetTopRatedResult;
  rank: number;
}

export default function MovieCard({ movie, rank }: MovieCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group pt-0 relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 md:hover:border-primary/50 transition-all duration-300 md:hover:shadow-xl md:hover:shadow-primary/10 md:hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className="text-muted dark:text-white font-black text-7xl drop-shadow-2xl"
            style={{
              textShadow:
                "0 0 15px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3), 0 0 45px rgba(0,0,0,0.2)",
            }}
          >
            {rank}
          </div>
        </div>

        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 md:group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardHeader className="pb-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 md:group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(movie.release_date)}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {movie.overview || "No overview available"}
          </p>
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          <RatingSource rating={movie.vote_average} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{movie.vote_count.toLocaleString()}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
