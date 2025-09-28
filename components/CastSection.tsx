"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { getProfileUrl } from "@/lib/utils";
import { MoviesGetCreditsResponse } from "tmdb-js-node";

function CastSection({ credits }: { credits: MoviesGetCreditsResponse }) {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 8;

  const displayedCast = showAll
    ? credits.cast
    : credits.cast.slice(0, initialDisplayCount);
  const hasMoreCast = credits.cast.length > initialDisplayCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Cast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedCast.map((actor) => (
            <div key={actor.id} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden">
                <Avatar className="size-full">
                  <AvatarImage
                    src={getProfileUrl(actor.profile_path)}
                    className="object-cover"
                  />
                  <AvatarFallback className="uppercase">
                    {actor.name.charAt(0) + actor.name.charAt(1)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="font-medium text-sm">{actor.name}</p>
              <p className="text-xs text-muted-foreground">{actor.character}</p>
            </div>
          ))}
        </div>

        {hasMoreCast && (
          <div className="flex justify-center mt-4">
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
                  Show More ({credits.cast.length - initialDisplayCount} more)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CastSection;
