"use client";

import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";
import { getProfileUrl } from "@/lib/utils";
import ConditionalTooltip from "./ConditionalTooltip";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface GuestStarsListProps {
  guestStars: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path: string | null;
  }>;
  mediaType?: "movie" | "tv";
  mediaId?: number;
  mediaTitle?: string;
  seasonNumber?: number;
  seasonName?: string;
  episodeNumber?: number;
  episodeName?: string;
}

export default function GuestStarsList({
  guestStars,
  mediaType,
  mediaId,
  mediaTitle,
  seasonNumber,
  seasonName,
  episodeNumber,
  episodeName,
}: GuestStarsListProps) {
  if (!guestStars || guestStars.length === 0) return null;

  // Build query params for person page links
  const buildPersonLink = (personId: number) => {
    if (mediaType && mediaId && mediaTitle) {
      const params = new URLSearchParams({
        from: mediaType,
        mediaId: String(mediaId),
        mediaTitle: encodeURIComponent(mediaTitle),
      });
      if (seasonNumber !== undefined && seasonName) {
        params.set("seasonNumber", String(seasonNumber));
        params.set("seasonName", encodeURIComponent(seasonName));
      }
      if (episodeNumber !== undefined && episodeName) {
        params.set("episodeNumber", String(episodeNumber));
        params.set("episodeName", encodeURIComponent(episodeName));
      }
      return `/person/${personId}?${params.toString()}`;
    }
    return `/person/${personId}`;
  };

  return (
    <ScrollArea className="overflow-x-auto">
      <div className="flex gap-3 pb-2 snap-x snap-mandatory">
        {guestStars.map((star) => (
          <ConditionalTooltip
            key={star.id}
            name={star.name}
            character={star.character || "Guest Star"}
          >
            <Link
              href={buildPersonLink(star.id)}
              className="block w-28 sm:w-32 flex-shrink-0 snap-start text-center group"
              title={star.name}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden border bg-muted/20">
                <Image
                  src={
                    star.profile_path
                      ? (getProfileUrl(star.profile_path) ?? "")
                      : PLACEHOLDER_POSTER_URL
                  }
                  alt={star.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div className="mt-2">
                <p
                  className="font-medium text-sm line-clamp-1 group-hover:text-primary"
                  data-name
                >
                  {star.name}
                </p>
                <p
                  className="text-xs text-muted-foreground line-clamp-1"
                  data-character
                >
                  {star.character || "Guest Star"}
                </p>
              </div>
            </Link>
          </ConditionalTooltip>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
