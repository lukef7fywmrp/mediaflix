"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDateShort,
  getVideoUrl,
  getThumbnailUrl,
  getFallbackThumbnailUrl,
} from "@/lib/utils";
import { Play, Youtube, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { MoviesGetVideosResponse } from "tmdb-js-node";
import { useState } from "react";

export default function MovieVideoGallery({
  videos,
}: {
  videos: MoviesGetVideosResponse;
}) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_LIMIT = 6; // Show 6 videos initially

  // Filter for trailers and teasers first, then other videos
  const trailers = videos.results.filter(
    (video) => video.type === "Trailer" || video.type === "Teaser",
  );
  const otherVideos = videos.results.filter(
    (video) => video.type !== "Trailer" && video.type !== "Teaser",
  );
  const sortedVideos = [...trailers, ...otherVideos];

  if (videos.results.length === 0) {
    return null;
  }

  // Determine which videos to display
  const videosToShow = showAll
    ? sortedVideos
    : sortedVideos.slice(0, INITIAL_LIMIT);
  const hasMoreVideos = sortedVideos.length > INITIAL_LIMIT;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videosToShow.map((video) => (
          <div
            key={video.id}
            className="group relative bg-muted/50 rounded-xl overflow-hidden md:hover:shadow-lg transition-all duration-300"
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video">
              <Image
                src={getThumbnailUrl(video.site, video.key)}
                alt={video.name}
                fill
                className="object-cover md:group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to a lower quality thumbnail
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackThumbnailUrl(video.site, video.key);
                }}
              />

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <Play className="h-4 w-4 text-foreground fill-foreground" />
                </div>
              </div>

              {/* Video type badge */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant={video.type === "Trailer" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {video.type}
                </Badge>
              </div>

              {/* Official badge */}
              {video.official && (
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className="text-xs bg-black/50 text-white border-white/30"
                  >
                    Official
                  </Badge>
                </div>
              )}
            </div>

            {/* Video info */}
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                {video.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {video.site === "YouTube" && <Youtube className="h-3 w-3" />}
                  {video.site === "Vimeo" && <Play className="h-3 w-3" />}
                  <span>{video.site}</span>
                </div>
                <span>{formatDateShort(video.published_at)}</span>
              </div>
            </div>

            {/* Click to open video */}
            <a
              href={getVideoUrl(video.site, video.key)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
              aria-label={`Watch ${video.name} on ${video.site}`}
            />
          </div>
        ))}
      </div>

      {/* Show More/Show Less Button */}
      {hasMoreVideos && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show More ({sortedVideos.length - INITIAL_LIMIT} more)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
