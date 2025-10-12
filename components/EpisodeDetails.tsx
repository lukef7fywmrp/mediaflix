"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate, formatDateShort, formatRuntime } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Play,
  Star,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
  }>;
  guest_stars: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}

interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
  episodes: Episode[];
}

interface EpisodeDetailsProps {
  seasons: Season[];
  tvShowId: number;
  tvShowName: string;
}

export default function EpisodeDetails({
  seasons,
  tvShowId,
}: EpisodeDetailsProps) {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  const getEpisodeImage = (episode: Episode) => {
    if (episode.still_path) {
      return `https://image.tmdb.org/t/p/w500${episode.still_path}`;
    }
    return "/placeholder-tv.jpg";
  };

  const getDirector = (episode: Episode) => {
    return episode.crew.find((person) => person.job === "Director");
  };

  const getWriters = (episode: Episode) => {
    return episode.crew.filter((person) => person.job === "Writer");
  };

  return (
    <div className="space-y-6">
      {/* Season Selection */}
      <div className="flex flex-wrap gap-2">
        {seasons.map((season) => (
          <Button
            key={season.id}
            variant={
              selectedSeason === season.season_number ? "default" : "outline"
            }
            onClick={() => setSelectedSeason(season.season_number)}
            className="flex items-center gap-2"
          >
            <span>Season {season.season_number}</span>
            <Badge variant="secondary" className="ml-1">
              {season.episode_count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Episodes Display */}
      {selectedSeason !== null && (
        <div className="space-y-4">
          {seasons
            .find((s) => s.season_number === selectedSeason)
            ?.episodes.map((episode) => (
              <Card key={episode.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Episode Image */}
                  <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0">
                    <Image
                      src={getEpisodeImage(episode)}
                      alt={episode.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-white"
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
                            className="bg-black/50 hover:bg-black/70 text-white"
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
                                src={getEpisodeImage(episode)}
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
                                  <h4 className="font-semibold mb-2">
                                    Overview
                                  </h4>
                                  <p className="text-muted-foreground">
                                    {episode.overview ||
                                      "No overview available."}
                                  </p>
                                </div>

                                {/* Crew */}
                                <div className="space-y-3">
                                  {getDirector(episode) && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        Director
                                      </h4>
                                      <p className="text-sm">
                                        {getDirector(episode)?.name}
                                      </p>
                                    </div>
                                  )}

                                  {getWriters(episode).length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        Writers
                                      </h4>
                                      <p className="text-sm">
                                        {getWriters(episode)
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
                                            key={star.id}
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
                                    <ExternalLink className="h-4 w-4" />
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
                        <h3 className="font-semibold text-lg mb-1">
                          {episode.name}
                        </h3>
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
                        {getDirector(episode) && (
                          <span className="text-xs text-muted-foreground">
                            Dir: {getDirector(episode)?.name}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
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
      )}
    </div>
  );
}
