"use client";

import { getProfileUrl } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface GuestStarsListProps {
  guestStars: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path: string | null;
  }>;
}

export default function GuestStarsList({ guestStars }: GuestStarsListProps) {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 8;

  const displayedStars = showAll
    ? guestStars
    : guestStars.slice(0, initialDisplayCount);
  const hasMore = guestStars.length > initialDisplayCount;

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        {displayedStars.map((star) => (
          <div key={star.id} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={getProfileUrl(star.profile_path)}
                alt={star.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xs">
                {star.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{star.name}</p>
              <p className="text-xs text-muted-foreground">
                {star.character || "Guest Star"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAll(!showAll)}
            className="text-muted-foreground hover:text-foreground -ml-2 h-7 w-fit justify-start px-2 text-xs"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Show All {guestStars.length}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
