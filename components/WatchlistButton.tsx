"use client";

import { useAuth } from "@clerk/nextjs";
import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

interface WatchlistButtonProps {
  mediaType: "movie" | "tv";
  mediaId: number;
  title: string;
  posterPath?: string;
  releaseDate?: string;
  overview?: string;
  voteAverage?: number;
  voteCount?: number;
  preloaded: Preloaded<typeof api.watchlist.isInWatchlist>;
}

export default function WatchlistButton({
  mediaType,
  mediaId,
  title,
  posterPath,
  releaseDate,
  overview,
  voteAverage,
  voteCount,
  preloaded,
}: WatchlistButtonProps) {
  const isInWatchlist = usePreloadedQuery(preloaded);
  const toggleWatchlist = useMutation(api.watchlist.toggleWatchlist);
  const { userId } = useAuth();
  const handleToggleWatchlist = async () => {
    if (!userId) return;

    try {
      const nowInWatchlist = await toggleWatchlist({
        mediaType,
        mediaId,
        title,
        posterPath,
        releaseDate,
        overview,
        voteAverage,
        voteCount,
        userId,
      });
      toast.success(
        nowInWatchlist
          ? `Added ${title} to your watchlist`
          : `Removed ${title} from your watchlist`,
      );
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast.error("Failed to update watchlist. Please try again.");
    }
  };

  // Show loading state while checking watchlist status
  if (isInWatchlist === undefined) {
    return (
      <Button
        variant="outline"
        size="lg"
        className="w-full sm:w-auto h-9 px-4 lg:h-10 lg:px-6 bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl text-xs lg:text-sm"
        disabled
      >
        <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin" />
        <span className="hidden sm:inline">Add to Watchlist</span>
        <span className="sm:hidden">Watchlist</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleToggleWatchlist}
      className="w-full sm:w-auto h-9 px-4 lg:h-10 lg:px-6 bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl text-xs lg:text-sm"
    >
      {isInWatchlist ? (
        <>
          <BookmarkCheck className="h-4 w-4 lg:h-5 lg:w-5" />
          <span>Remove from Watchlist</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4 lg:h-5 lg:w-5" />
          <span>Add to Watchlist</span>
        </>
      )}
    </Button>
  );
}
