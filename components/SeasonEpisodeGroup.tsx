"use client";

import { formatDateShort, getPosterUrl } from "@/lib/utils";
import { Calendar, ChevronRight, Tv } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TVGetDetailsSeason } from "tmdb-js-node";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

function SeasonEpisodeGroup({
  season,
  tvShowId,
}: {
  season: TVGetDetailsSeason;
  tvShowId: number;
}) {
  return (
    <Card className="overflow-hidden md:hover:shadow-md transition-shadow py-1 sm:p-0 border-0 shadow-none sm:border sm:shadow-sm rounded-none sm:rounded-xl border-b last:border-b-0 last:pb-0">
      <div className="flex flex-col sm:flex-row sm:min-h-[10rem]">
        {/* Season Poster - Touches all card edges */}
        <div className="relative w-45 aspect-[2/3] sm:w-32 sm:h-auto sm:aspect-auto flex-shrink-0">
          {season.poster_path ? (
            <Image
              src={getPosterUrl(season.poster_path)}
              alt={season.name}
              fill
              className="object-cover rounded-lg sm:rounded-none"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg sm:rounded-none">
              <Tv className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Season Info - Properly padded content area */}
        <div className="flex-1 min-w-0 px-2 py-4 sm:p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold truncate">{season.name}</h3>
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {season.episode_count} episodes
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            {season.air_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateShort(season.air_date)}
              </span>
            )}
          </div>

          {season.overview && (
            <p className="text-[13px] sm:text-sm text-muted-foreground mb-2 line-clamp-2 leading-tight">
              {season.overview}
            </p>
          )}

          <Link href={`/tv/${tvShowId}/season/${season.season_number}`}>
            <Button size="sm" className="gap-1 text-xs h-8 px-3">
              View Episodes
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default SeasonEpisodeGroup;
