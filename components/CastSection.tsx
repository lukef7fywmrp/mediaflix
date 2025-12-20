"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { MoviesGetCreditsResponse } from "tmdb-js-node";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";
import { getProfileUrl } from "@/lib/utils";
import ConditionalTooltip from "./ConditionalTooltip";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface CastSectionProps {
  credits: MoviesGetCreditsResponse;
  mediaType?: "movie" | "tv";
  mediaId?: number;
  mediaTitle?: string;
}

function CastSection({
  credits,
  mediaType,
  mediaId,
  mediaTitle,
}: CastSectionProps) {
  // Build query params for person page links
  const buildPersonLink = (personId: number) => {
    if (mediaType && mediaId && mediaTitle) {
      const params = new URLSearchParams({
        from: mediaType,
        mediaId: String(mediaId),
        mediaTitle: encodeURIComponent(mediaTitle),
      });
      return `/person/${personId}?${params.toString()}`;
    }
    return `/person/${personId}`;
  };
  // Don't render anything if cast is empty
  if (!credits.cast || credits.cast.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Cast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="overflow-x-auto">
          <div className="flex gap-3 pb-2 snap-x snap-mandatory">
            {credits.cast.map((actor) => (
              <ConditionalTooltip
                key={actor.id}
                name={actor.name}
                character={actor.character}
              >
                <Link
                  href={buildPersonLink(actor.id)}
                  className="block w-28 sm:w-32 flex-shrink-0 snap-start text-center group"
                  title={actor.name}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden border bg-muted/20 min-h-0">
                    <Image
                      src={
                        actor.profile_path
                          ? (getProfileUrl(actor.profile_path) ?? "")
                          : PLACEHOLDER_POSTER_URL
                      }
                      alt={actor.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 112px, 128px"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2">
                    <p
                      className="font-medium text-sm line-clamp-1 group-hover:text-primary"
                      data-name
                    >
                      {actor.name}
                    </p>
                    <p
                      className="text-xs text-muted-foreground line-clamp-1"
                      data-character
                    >
                      {actor.character}
                    </p>
                  </div>
                </Link>
              </ConditionalTooltip>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default CastSection;
