"use client";

import apiClient from "@/lib/tmdbClient";
import {
  formatDate,
  formatDateShort,
  formatRuntime,
  getPosterUrl,
} from "@/lib/utils";
import {
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Play,
  Star,
  Tv,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState, useTransition } from "react";
import { TVGetDetailsSeason, TVSeasonsGetDetailsResponse } from "tmdb-js-node";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function SeasonEpisodeGroup({
  season,
  tvShowId,
}: {
  season: TVGetDetailsSeason;
  tvShowId: number;
}) {
  const [activeSeason, setActiveSeason] = useState<TVSeasonsGetDetailsResponse<
    ("videos" | "watch_providers" | "credits")[]
  > | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGetSeasonDetails = useCallback(async () => {
    if (
      !tvShowId ||
      season.season_number === undefined ||
      season.season_number === null
    )
      return;

    startTransition(async () => {
      try {
        const seasonDetails = await apiClient.v3.tvSeasons.getDetails(
          tvShowId,
          season.season_number,
          { append_to_response: ["watch_providers", "videos", "credits"] },
        );
        setActiveSeason(seasonDetails);
      } catch (error) {
        console.error("Error getting season details", error);
      }
    });
  }, [tvShowId, season.season_number]);

  // Remove the automatic fetch on mount - we'll fetch when accordion opens
  // useEffect(() => {
  //   handleGetSeasonDetails();
  // }, [season.id, tvShowId, handleGetSeasonDetails]);

  const handleAccordionToggle = () => {
    // Only fetch if we don't have data yet
    if (!activeSeason && !isPending) {
      handleGetSeasonDetails();
    }
  };

  return (
    <AccordionItem
      key={season.season_number}
      value={`season-${season.season_number}`}
    >
      <AccordionTrigger
        className="hover:no-underline"
        onClick={handleAccordionToggle}
      >
        <div className="flex items-center gap-4 w-full">
          {/* Season Poster */}
          <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
            {season.poster_path ? (
              <Image
                src={getPosterUrl(season.poster_path)}
                alt={season.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Tv className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Season Info */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">{season.name}</h3>
              <Badge variant="secondary">{season.episode_count} episodes</Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {season.air_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateShort(season.air_date)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Tv className="h-4 w-4" />
                Season {season.season_number}
              </span>
            </div>

            {season.overview && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {season.overview}
              </p>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="pt-4 space-y-3">
          {isPending && (
            <div className="text-center py-8 text-muted-foreground">
              Loading episodes...
            </div>
          )}
          {!isPending && !activeSeason && (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load episodes
            </div>
          )}
          {!isPending &&
            activeSeason &&
            (!activeSeason.episodes || activeSeason.episodes.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No episodes available for this season
              </div>
            )}
          {activeSeason?.episodes?.map((episode) => (
            <Card
              key={episode.episode_number}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Episode Image */}
                <div className="relative w-full md:w-40 h-32 md:h-24 flex-shrink-0">
                  <Image
                    src={getPosterUrl(episode.still_path)}
                    alt={episode.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white text-xs"
                    >
                      E{episode.episode_number}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0"
                          onClick={() => {}}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            {episode.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Episode Hero */}
                          <div className="relative h-64 rounded-lg overflow-hidden">
                            <Image
                              src={getPosterUrl(episode.still_path)}
                              alt={episode.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                              <h3 className="text-2xl font-bold mb-2">
                                {episode.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span>Episode {episode.episode_number}</span>
                                {episode.air_date && (
                                  <span>{formatDate(episode.air_date)}</span>
                                )}
                                {episode.runtime && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatRuntime(episode.runtime)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Episode Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Overview</h4>
                                <p className="text-muted-foreground">
                                  {episode.overview || "No overview available."}
                                </p>
                              </div>

                              {/* Crew */}
                              <div className="space-y-3">
                                {episode.crew.find(
                                  (person) => person.job === "Director",
                                ) && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Director
                                    </h4>
                                    <p className="text-sm">
                                      {
                                        episode.crew.find(
                                          (person) => person.job === "Director",
                                        )?.name
                                      }
                                    </p>
                                  </div>
                                )}

                                {episode.crew.filter(
                                  (person) => person.job === "Writer",
                                ).length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Writers
                                    </h4>
                                    <p className="text-sm">
                                      {episode.crew
                                        .filter(
                                          (person) => person.job === "Writer",
                                        )
                                        .map((writer) => writer.name)
                                        .join(", ")}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Guest Stars */}
                              {episode.guest_stars.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                    Guest Stars
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {episode.guest_stars
                                      .slice(0, 6)
                                      .map((star) => (
                                        <Badge
                                          key={star.name}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {star.name}
                                        </Badge>
                                      ))}
                                    {episode.guest_stars.length > 6 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        +{episode.guest_stars.length - 6} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Episode Stats */}
                            <div className="space-y-4">
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm">
                                    Episode Info
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Rating
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span>
                                        {episode.vote_average.toFixed(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Votes
                                    </span>
                                    <span>
                                      {episode.vote_count.toLocaleString()}
                                    </span>
                                  </div>
                                  {episode.runtime && (
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        Runtime
                                      </span>
                                      <span>
                                        {formatRuntime(episode.runtime)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Air Date
                                    </span>
                                    <span>
                                      {episode.air_date
                                        ? formatDateShort(episode.air_date)
                                        : "TBA"}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>

                              <Button
                                variant="outline"
                                className="w-full"
                                asChild
                              >
                                <a
                                  href={`https://www.themoviedb.org/tv/${tvShowId}/season/${episode.season_number}/episode/${episode.episode_number}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View on TMDB
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Episode Info */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-base mb-1">
                        {episode.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Episode {episode.episode_number}</span>
                        {episode.air_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDateShort(episode.air_date)}
                          </span>
                        )}
                        {episode.runtime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatRuntime(episode.runtime)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {episode.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {episode.overview || "No overview available."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {episode.crew.find(
                        (person) => person.job === "Director",
                      ) && (
                        <span className="text-xs text-muted-foreground">
                          Dir:{" "}
                          {
                            episode.crew.find(
                              (person) => person.job === "Director",
                            )?.name
                          }
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                      className="text-primary hover:text-primary/80"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default SeasonEpisodeGroup;
