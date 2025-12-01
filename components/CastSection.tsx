"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import type { MoviesGetCreditsResponse } from "tmdb-js-node";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";
import { getProfileUrl } from "@/lib/utils";
import ConditionalTooltip from "./ConditionalTooltip";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

function CastSection({ credits }: { credits: MoviesGetCreditsResponse }) {
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
                <div
                  className="w-28 sm:w-32 flex-shrink-0 snap-start text-center"
                  title={actor.name}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden border bg-muted/20">
                    <Image
                      src={
                        actor.profile_path
                          ? (getProfileUrl(actor.profile_path) ?? "")
                          : PLACEHOLDER_POSTER_URL
                      }
                      alt={actor.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="mt-2">
                    <p className="font-medium text-sm line-clamp-1" data-name>
                      {actor.name}
                    </p>
                    <p
                      className="text-xs text-muted-foreground line-clamp-1"
                      data-character
                    >
                      {actor.character}
                    </p>
                  </div>
                </div>
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
