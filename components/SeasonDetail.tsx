import {
  formatDate,
  formatDateShort,
  formatRuntime,
  getPosterUrl,
} from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Play,
  Star,
  ThumbsUp,
  Tv,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  TVGetAccountStatesResponse,
  TVGetAlternativeTitlesResponse,
  TVGetChangesResponse,
  TVGetCreditsResponse,
  TVGetDetailsBaseResponse,
  TVGetExternalIdsResponse,
  TVGetImagesResponse,
  TVGetKeywordsResponse,
  TVGetLatestResponse,
  TVGetScreenedTheatricallyResponse,
  TVGetWatchProvidersResponse,
  TVSeasonsGetCreditsResponse,
  TVSeasonsGetDetailsBaseResponse,
  TVSeasonsGetVideosResponse,
} from "tmdb-js-node";
import ExpandableOverview from "./ExpandableOverview";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";

interface SeasonDetailProps {
  tvShow: TVGetDetailsBaseResponse & {
    account_states: TVGetAccountStatesResponse;
    alternative_titles: TVGetAlternativeTitlesResponse;
    changes: TVGetChangesResponse;
    credits: TVGetCreditsResponse;
    external_ids: TVGetExternalIdsResponse;
    images: TVGetImagesResponse;
    keywords: TVGetKeywordsResponse;
    latest: TVGetLatestResponse;
    screened_theatrically: TVGetScreenedTheatricallyResponse;
  };
  season: TVSeasonsGetDetailsBaseResponse & {
    credits: TVSeasonsGetCreditsResponse;
    videos: TVSeasonsGetVideosResponse;
    watch_providers: TVGetWatchProvidersResponse;
  };
  tvShowId: number;
}

export default function SeasonDetail({
  tvShow,
  season,
  tvShowId,
}: SeasonDetailProps) {
  // Calculate derived values from episodes
  const episodeCount = season.episodes?.length || 0;
  const averageRating = season.episodes?.length
    ? season.episodes.reduce((sum, episode) => sum + episode.vote_average, 0) /
      season.episodes.length
    : 0;
  const totalVotes = season.episodes?.length
    ? season.episodes.reduce((sum, episode) => sum + episode.vote_count, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={`/tv/${tvShowId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {tvShow.name}
            </Button>
          </Link>
        </div>

        {/* Season Hero Section */}
        <div className="mb-8">
          <div className="relative h-[60vh] min-h-[450px] max-h-[600px] rounded-2xl overflow-hidden group">
            {/* Background Image with Fade Overlay */}
            <div className="absolute inset-0">
              {season.poster_path ? (
                <Image
                  src={getPosterUrl(season.poster_path)}
                  alt={season.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Tv className="h-24 w-24 text-muted-foreground/50" />
                </div>
              )}
              {/* Multi-layer fade overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-8">
              <div className="max-w-4xl space-y-4">
                {/* Season Badge */}
                <div>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white text-sm px-4 py-2"
                  >
                    Season {season.season_number}
                  </Badge>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {season.name}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  {season.air_date && (
                    <span className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5" />
                      {formatDate(season.air_date)}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-lg">
                    <Tv className="h-5 w-5" />
                    {episodeCount} Episodes
                  </span>
                  {averageRating > 0 && (
                    <span className="flex items-center gap-2 text-lg">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      {averageRating.toFixed(1)}/10
                    </span>
                  )}
                </div>

                {/* Overview */}
                <ExpandableOverview
                  overview={season.overview || ""}
                  className="max-w-3xl"
                  textClassName="text-sm lg:text-base text-white/90 leading-relaxed mb-1"
                  maxLines={3}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {episodeCount}
                    </div>
                    <div className="text-sm text-white/70">Episodes</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                    </div>
                    <div className="text-sm text-white/70">Rating</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {totalVotes > 0 ? totalVotes.toLocaleString() : "0"}
                    </div>
                    <div className="text-sm text-white/70">Votes</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {season.air_date
                        ? new Date(season.air_date).getFullYear()
                        : "TBA"}
                    </div>
                    <div className="text-sm text-white/70">Year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Episodes Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold">Episodes</h2>
              <div className="h-8 w-px bg-border" />
              <Badge
                variant="secondary"
                className="text-sm px-3 py-1.5 font-medium"
              >
                {episodeCount} episodes
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Season {season.season_number}
            </div>
          </div>

          {!season.episodes || season.episodes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Tv className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">
                No episodes available for this season
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {season.episodes.map((episode) => (
                <Card
                  key={episode.episode_number}
                  className="overflow-hidden hover:shadow-md transition-all duration-300 group border border-border/50 bg-card py-0 shadow-sm"
                >
                  <div className="flex">
                    {/* Episode Image - Touches card corners */}
                    <div className="relative w-56 lg:w-72 xl:w-96 flex-shrink-0">
                      <Image
                        src={getPosterUrl(episode.still_path)}
                        alt={episode.name}
                        fill
                        className="object-cover transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      {/* Rating overlay */}
                      <div className="absolute top-2 right-2">
                        <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {episode.vote_average.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Episode Content - Better Layout */}
                    <div className="flex-1 min-w-0 p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors truncate">
                          {episode.name}
                        </h3>

                        {/* Compact metadata */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {episode.air_date
                              ? formatDateShort(episode.air_date)
                              : "TBA"}
                          </span>
                          {episode.runtime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatRuntime(episode.runtime)}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-muted-foreground font-medium">
                            <ThumbsUp className="h-3 w-3" />
                            {episode.vote_count.toLocaleString()} votes
                          </span>
                        </div>

                        {/* Director info - Clearer */}
                        {episode.crew.find(
                          (person) => person.job === "Director",
                        ) && (
                          <div className="text-sm text-muted-foreground mb-3">
                            <span className="font-medium">Director:</span>{" "}
                            {
                              episode.crew.find(
                                (person) => person.job === "Director",
                              )?.name
                            }
                          </div>
                        )}

                        {/* Overview */}
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                          {episode.overview || "No overview available."}
                        </p>

                        {/* Guest stars count */}
                        {episode.guest_stars.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {episode.guest_stars.length} guest star
                            {episode.guest_stars.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      {/* Action Button - Moved to left */}
                      <div className="flex justify-start mt-3">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 text-sm group-hover:bg-primary group-hover:text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                            >
                              Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full sm:max-w-2xl p-6">
                            <SheetHeader className="mb-3 p-0">
                              <SheetTitle className="text-2xl">
                                {episode.name}
                              </SheetTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Episode {episode.episode_number}</span>
                                {episode.air_date && (
                                  <span>{formatDate(episode.air_date)}</span>
                                )}
                                {episode.runtime && (
                                  <span>{formatRuntime(episode.runtime)}</span>
                                )}
                              </div>
                            </SheetHeader>

                            <div className="space-y-6 h-full flex flex-col max-h-[90vh] overflow-y-auto">
                              {/* Episode Image */}
                              <div className="relative h-48 rounded-lg overflow-hidden">
                                <Image
                                  src={getPosterUrl(episode.still_path)}
                                  alt={episode.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                      {episode.vote_average.toFixed(1)}/10
                                    </span>
                                    <span className="flex items-center gap-1 text-white/70">
                                      <ThumbsUp className="h-3 w-3" />(
                                      {episode.vote_count.toLocaleString()}{" "}
                                      votes)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Episode Stats Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-muted/50 rounded-lg p-3 text-center">
                                  <div className="text-lg font-bold text-primary">
                                    {episode.episode_number}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Episode
                                  </div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3 text-center">
                                  <div className="text-lg font-bold">
                                    {episode.runtime
                                      ? formatRuntime(episode.runtime)
                                      : "N/A"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Runtime
                                  </div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3 text-center">
                                  <div className="text-lg font-bold text-primary">
                                    {episode.vote_average.toFixed(1)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Rating
                                  </div>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3 text-center">
                                  <div className="text-lg font-bold">
                                    {episode.air_date
                                      ? new Date(episode.air_date).getFullYear()
                                      : "TBA"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Year
                                  </div>
                                </div>
                              </div>

                              {/* Overview */}
                              {episode.overview && (
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Overview
                                  </h4>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {episode.overview}
                                  </p>
                                </div>
                              )}

                              {/* Crew & Cast */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Crew */}
                                <div className="space-y-4">
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
                                            (person) =>
                                              person.job === "Director",
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

                                  {/* Additional crew roles */}
                                  {episode.crew
                                    .filter(
                                      (person) =>
                                        !["Director", "Writer"].includes(
                                          person.job || "",
                                        ),
                                    )
                                    .slice(0, 3)
                                    .map((person) => (
                                      <div key={person.id}>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                          {person.job}
                                        </h4>
                                        <p className="text-sm">{person.name}</p>
                                      </div>
                                    ))}
                                </div>

                                {/* Guest Stars & Additional Info */}
                                <div className="space-y-4">
                                  {episode.guest_stars.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                        Guest Stars (
                                        {episode.guest_stars.length})
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
                                            +{episode.guest_stars.length - 6}{" "}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Air Date */}
                                  <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Air Date
                                    </h4>
                                    <p className="text-sm">
                                      {episode.air_date
                                        ? formatDate(episode.air_date)
                                        : "TBA"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* External Link */}
                              <div className="pt-6 mt-auto">
                                <Button className="w-full" asChild>
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
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
