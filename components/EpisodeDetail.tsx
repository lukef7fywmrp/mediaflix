import {
  formatDate,
  formatOrdinal,
  formatRuntime,
  getBackdropUrl,
  getProfileUrl,
} from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Star,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TVEpisodesGetDetailsResponse } from "tmdb-js-node";
import EpisodeVideoGallery from "./EpisodeVideoGallery";
import GuestStarsList from "./GuestStarsList";
import ShareButton from "./ShareButton";
import WatchProviders from "./WatchProviders";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface EpisodeDetailProps {
  tvShowId: number;
  seasonNumber: number;
  episode: TVEpisodesGetDetailsResponse<("videos" | "credits")[]>;
  watchProviders?: {
    flatrate?: Array<{
      display_priority: number;
      logo_path: string;
      provider_id: number;
      provider_name: string;
    }>;
  };
  country?: string;
}

export default function EpisodeDetail({
  tvShowId,
  seasonNumber,
  episode,
  watchProviders,
  country,
}: EpisodeDetailProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={`/tv/${tvShowId}/season/${seasonNumber}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Season {seasonNumber}
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Episode Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Badge
                variant="secondary"
                className="text-sm px-3 py-1.5 font-medium"
              >
                Episode {episode.episode_number}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1.5">
                Season {seasonNumber}
              </Badge>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              {episode.name}
            </h1>

            <div className="flex flex-wrap items-center gap-8">
              {episode.air_date && (
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Aired </span>
                  <span className="font-medium">
                    {formatDate(episode.air_date)}
                  </span>
                </div>
              )}
              {episode.runtime && (
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Runtime </span>
                  <span className="font-medium">
                    {formatRuntime(episode.runtime)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Episode Image and Rating */}
          <div className="relative h-96 lg:h-[500px] rounded-md overflow-hidden">
            <Image
              src={getBackdropUrl(episode.still_path)}
              alt={episode.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Rating overlay */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-black/70 rounded-lg px-3 py-2 flex items-center gap-2 text-white text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {episode.vote_average.toFixed(1)}/10
                </span>
                <span className="mx-2 h-4 w-px bg-white/30" />
                <ThumbsUp className="h-3 w-3" />
                <span>{episode.vote_count.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Episode Stats */}
          <div className="border-t border-b border-border/50 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-light text-foreground mb-1">
                  {formatOrdinal(episode.episode_number)}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Episode
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-light text-foreground mb-1">
                  {episode.runtime ? formatRuntime(episode.runtime) : "N/A"}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Runtime
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-light text-foreground mb-1">
                  {episode.vote_average.toFixed(1)}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Rating
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-light text-foreground mb-1">
                  {episode.air_date
                    ? new Date(episode.air_date).getFullYear()
                    : "TBA"}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Released
                </div>
              </div>
            </div>
          </div>

          {/* Watch Providers and Actions */}
          {watchProviders && (
            <div className="bg-muted/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1">
                  <WatchProviders
                    watchProviders={watchProviders}
                    country={country}
                    textColor="text-foreground"
                    countryBadgeColor="text-muted-foreground bg-muted/50"
                  />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {/* Watch Later / Add to List */}
                  {/* <Button variant="outline" size="lg">
                    <Plus className="h-4 w-4" />
                    Watch Later
                  </Button> */}

                  {/* Favorite */}
                  {/* <Button variant="outline" size="lg">
                    <Heart className="h-4 w-4" />
                    Favorite
                  </Button> */}

                  {/* Share */}
                  <ShareButton
                    title={episode.name}
                    url={`/tv/${tvShowId}/season/${seasonNumber}/episode/${episode.episode_number}`}
                    variant="outline"
                  />

                  {/* TMDB Link */}
                  <Button asChild>
                    <a
                      href={`https://www.themoviedb.org/tv/${tvShowId}/season/${seasonNumber}/episode/${episode.episode_number}`}
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
          )}

          {/* Overview */}
          {episode.overview && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {episode.overview}
              </p>
            </div>
          )}

          {/* Crew & Cast */}
          {((episode.crew && episode.crew.length > 0) ||
            (episode.guest_stars && episode.guest_stars.length > 0)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Crew */}
              {episode.crew && episode.crew.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Crew</h2>

                  {episode.crew.find((person) => person.job === "Director") && (
                    <div>
                      <h3 className="font-semibold text-muted-foreground mb-3">
                        Director
                      </h3>
                      {episode.crew
                        .filter((person) => person.job === "Director")
                        .map((director) => (
                          <div
                            key={director.id}
                            className="flex items-center gap-3 mb-3"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={getProfileUrl(director.profile_path)}
                                alt={director.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-sm">
                                {director.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-lg">
                                {director.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {director.known_for_department}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {episode.crew.filter((person) => person.job === "Writer")
                    .length > 0 && (
                    <div>
                      <h3 className="font-semibold text-muted-foreground mb-3">
                        Writers
                      </h3>
                      <div className="space-y-3">
                        {episode.crew
                          .filter((person) => person.job === "Writer")
                          .map((writer) => (
                            <div
                              key={writer.id}
                              className="flex items-center gap-3"
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={getProfileUrl(writer.profile_path)}
                                  alt={writer.name}
                                  className="object-cover"
                                />
                                <AvatarFallback className="text-xs">
                                  {writer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{writer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {writer.known_for_department}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Additional crew roles */}
                  {episode.crew
                    .filter(
                      (person) =>
                        !["Director", "Writer"].includes(person.job || ""),
                    )
                    .slice(0, 5)
                    .map((person) => (
                      <div key={person.id}>
                        <h3 className="font-semibold text-muted-foreground mb-2">
                          {person.job}
                        </h3>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={getProfileUrl(person.profile_path)}
                              alt={person.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-xs">
                              {person.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{person.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {person.known_for_department}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Guest Stars */}
              {episode.guest_stars && episode.guest_stars.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Cast</h2>
                  <div>
                    <h3 className="font-semibold text-muted-foreground mb-3">
                      Guest Stars ({episode.guest_stars.length})
                    </h3>
                    <GuestStarsList guestStars={episode.guest_stars} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Videos Section */}
          {episode.videos && episode.videos.results.length > 0 && (
            <EpisodeVideoGallery videos={episode.videos.results} />
          )}
        </div>
      </div>
    </div>
  );
}
