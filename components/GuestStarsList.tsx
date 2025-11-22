"use client";

import Image from "next/image";
import { getProfileUrl } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";
import ConditionalTooltip from "./ConditionalTooltip";

interface GuestStarsListProps {
  guestStars: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path: string | null;
  }>;
}

export default function GuestStarsList({ guestStars }: GuestStarsListProps) {
  if (!guestStars || guestStars.length === 0) return null;

  return (
    <ScrollArea className="overflow-x-auto">
      <div className="flex gap-3 pb-2 snap-x snap-mandatory">
        {guestStars.map((star) => (
          <ConditionalTooltip
            key={star.id}
            name={star.name}
            character={star.character || "Guest Star"}
          >
            <div
              className="w-28 sm:w-32 flex-shrink-0 snap-start text-center"
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
                <p className="font-medium text-sm line-clamp-1" data-name>
                  {star.name}
                </p>
                <p
                  className="text-xs text-muted-foreground line-clamp-1"
                  data-character
                >
                  {star.character || "Guest Star"}
                </p>
              </div>
            </div>
          </ConditionalTooltip>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
