"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { formatDateShort, getPosterUrl } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Calendar, Film, Tv, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import RatingSource from "./RatingSource";

interface WatchlistItemCardProps {
  item: (typeof api.watchlist.getWatchlist._returnType)["page"][number];
}

export default function WatchlistItemCard({ item }: WatchlistItemCardProps) {
  const href =
    item.mediaType === "movie"
      ? `/movie/${item.mediaId}`
      : `/tv/${item.mediaId}`;
  const Icon = item.mediaType === "movie" ? Film : Tv;
  const toggleWatchlist = useMutation(api.watchlist.toggleWatchlist);
  const { userId } = useAuth();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId || isRemoving) return;

    setIsRemoving(true);
    try {
      await toggleWatchlist({
        mediaType: item.mediaType,
        mediaId: item.mediaId,
        title: item.title,
        posterPath: item.posterPath,
        releaseDate: item.releaseDate,
        overview: item.overview,
        voteAverage: item.voteAverage,
        voteCount: item.voteCount,
        userId: userId,
      });
      toast.success(`Removed ${item.title} from your watchlist`);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("Failed to remove from watchlist. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="relative group">
      {/* Remove Button - positioned relative to wrapper */}
      <div className="absolute -top-3 -right-3 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleRemove}
              disabled={isRemoving}
              className="h-8 w-8 rounded-full bg-background backdrop-blur-sm border border-border/40 shadow-sm hover:bg-background/80 hover:border-border/60 hover:shadow-md transition-all duration-200"
              aria-label={`Remove ${item.title} from watchlist`}
            >
              <X className="h-4 w-4 text-muted-foreground/80 hover:text-foreground/70 transition-colors" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="mb-1">
            <p>Remove from watchlist</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Link href={href}>
        <Card className="pt-0 relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1 cursor-pointer h-full flex flex-col">
          {/* Media Type Badge */}
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-background/85 backdrop-blur-sm border border-border/50 shadow-sm">
              <Icon className="h-3.5 w-3.5 text-primary/75" />
              <span className="text-xs font-medium text-primary/75 capitalize">
                {item.mediaType}
              </span>
            </div>
          </div>

          {/* Poster Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={getPosterUrl(item.posterPath || null)}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardHeader className="pb-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {item.releaseDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDateShort(item.releaseDate)}</span>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-0 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {item.overview || "No overview available"}
            </p>
          </CardContent>

          <CardFooter className="pt-0 flex items-center justify-between">
            {item.voteAverage !== undefined ? (
              <RatingSource rating={item.voteAverage} />
            ) : (
              <div className="text-xs text-muted-foreground">No rating</div>
            )}
            {item.voteCount !== undefined && item.voteCount > 0 ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{item.voteCount.toLocaleString()}</span>
              </div>
            ) : null}
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
