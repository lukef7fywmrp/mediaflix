import { Badge } from "@/components/ui/badge";
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
import { TVGetTopRatedResult } from "tmdb-js-node";
import RatingSource from "./RatingSource";

interface TVShowCardProps {
  tvShow: TVGetTopRatedResult;
  rank: number;
}

export default function TVShowCard({ tvShow, rank }: TVShowCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link href={`/tv/${tvShow.id}`}>
      <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer">
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge
            variant="secondary"
            className="bg-primary/90 text-primary-foreground font-bold text-sm px-2 py-1 shadow-lg"
          >
            #{rank}
          </Badge>
        </div>

        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={getPosterUrl(tvShow.poster_path)}
            alt={tvShow.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardHeader className="pb-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {tvShow.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(tvShow.first_air_date)}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {tvShow.overview}
          </p>
        </CardContent>

        <CardFooter className="pt-0 flex items-center justify-between">
          <RatingSource rating={tvShow.vote_average} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{tvShow.vote_count.toLocaleString()}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
