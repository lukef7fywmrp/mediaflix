"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
        className="bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl"
        disabled
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        Add to Watchlist
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleToggleWatchlist}
      className="bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl"
    >
      {isInWatchlist ? (
        <>
          <BookmarkCheck className="h-5 w-5" />
          Remove from Watchlist
        </>
      ) : (
        <>
          <Bookmark className="h-5 w-5" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
