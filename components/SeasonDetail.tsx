import {
  formatDate,
  formatDateShort,
  formatRuntime,
  getBackdropUrl,
  getCountryName,
  getPosterUrl,
  getProfileUrl,
} from "@/lib/utils";
import {
  Calendar,
  ChevronRight,
  Clock,
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
  TVSeasonsGetImagesResponse,
  TVSeasonsGetVideosResponse,
} from "tmdb-js-node";
import ConditionalTooltip from "./ConditionalTooltip";
import ExpandableOverview from "./ExpandableOverview";
import { Badge } from "./ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const JUSTWATCH_LOGO_URL =
  "https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg";

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
    images: TVSeasonsGetImagesResponse;
    videos: TVSeasonsGetVideosResponse;
  };
  tvShowId: number;
  watchProviders?: TVGetWatchProvidersResponse["results"][string];
  country?: string;
}

export default function SeasonDetail({
  tvShow,
  season,
  tvShowId,
  watchProviders,
  country,
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/?type=tv">TV Shows</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/tv/${tvShowId}`}>{tvShow.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[220px] sm:max-w-xs lg:max-w-sm">
                {season.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Season Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Poster Image */}
            <div className="relative w-full lg:w-72 xl:w-80 flex-shrink-0">
              {season.poster_path ? (
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
                  <Image
                    src={getPosterUrl(season.poster_path)}
                    alt={season.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[2/3] flex items-center justify-center bg-muted rounded-lg">
                  <Tv className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="space-y-5">
                {/* Header Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="text-xs font-medium px-3 py-1"
                    >
                      Season {season.season_number}
                    </Badge>
                    {season.air_date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(season.air_date).getFullYear()}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
                    {season.name}
                  </h1>

                  {/* Compact Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {season.air_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {formatDate(season.air_date)}
                      </span>
                    )}
                  </div>

                  {/* Watch Providers */}
                  {watchProviders && (
                    <div className="pt-3">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Watch Now
                        </h3>
                        <div className="h-px bg-border/50 flex-1" />
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {watchProviders.flatrate &&
                          watchProviders.flatrate.length > 0 && (
                            <div className="flex items-center gap-1">
                              {watchProviders.flatrate
                                .slice(0, 4)
                                .map((provider) => (
                                  <Tooltip key={provider.provider_id}>
                                    <TooltipTrigger asChild>
                                      <div className="w-10 h-10 rounded overflow-hidden">
                                        <Image
                                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                          alt={provider.provider_name}
                                          width={40}
                                          height={40}
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{provider.provider_name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                            </div>
                          )}
                        {country && (
                          <span className="text-xs text-muted-foreground">
                            Streaming in {getCountryName(country)}
                          </span>
                        )}
                        {/* JustWatch Attribution - Only show if there are providers or country info */}
                        {(watchProviders.flatrate &&
                          watchProviders.flatrate.length > 0) ||
                        country ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-muted-foreground opacity-60">
                              Powered by
                            </span>
                            <a
                              href="https://www.justwatch.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center hover:opacity-80 transition-opacity"
                              aria-label="JustWatch"
                            >
                              <Image
                                src={JUSTWATCH_LOGO_URL}
                                alt="JustWatch"
                                width={80}
                                height={12}
                                className="h-3 w-auto object-contain"
                              />
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                {/* Overview */}
                <ExpandableOverview
                  overview={season.overview || ""}
                  className="max-w-2xl"
                  textClassName="text-sm leading-relaxed"
                  buttonClassName="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-6 font-normal transition-colors -ml-2 text-xs"
                  maxLines={3}
                />

                {/* Inline Stats */}
                <div className="flex items-center gap-6 pt-2 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{episodeCount}</div>
                    <div className="text-xs text-muted-foreground">
                      Episodes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {averageRating > 0 ? averageRating.toFixed(1) : "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {totalVotes > 0 ? totalVotes.toLocaleString() : "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Votes</div>
                  </div>
                  {season.air_date && (
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {new Date(season.air_date).getFullYear()}
                      </div>
                      <div className="text-xs text-muted-foreground">Year</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {season.credits?.cast && season.credits.cast.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">Cast</h2>
            </div>
            <ScrollArea className="overflow-x-auto">
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {season.credits.cast.map((person) => (
                  <ConditionalTooltip
                    key={person.id}
                    name={person.name}
                    character={person.character || ""}
                  >
                    <div
                      className="w-28 sm:w-32 flex-shrink-0 snap-start text-center"
                      title={person.name}
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden border bg-muted/20">
                        <Image
                          src={
                            person.profile_path
                              ? (getProfileUrl(person.profile_path) ?? "")
                              : PLACEHOLDER_POSTER_URL
                          }
                          alt={person.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>
                      <div className="mt-2">
                        <div
                          className="text-sm font-medium line-clamp-1"
                          data-name
                        >
                          {person.name}
                        </div>
                        <div
                          className="text-xs text-muted-foreground line-clamp-1"
                          data-character
                        >
                          {person.character}
                        </div>
                      </div>
                    </div>
                  </ConditionalTooltip>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        <Separator className="mb-8 bg-border/50" />

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
                  className="overflow-hidden hover:shadow-md transition-all duration-300 group border border-border/50 bg-card py-0 shadow-sm rounded-lg "
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Episode Image - Touches card corners */}
                    <div className="relative w-full aspect-video sm:w-56 lg:w-72 xl:w-96 sm:aspect-auto flex-shrink-0">
                      <Image
                        src={getBackdropUrl(episode.still_path)}
                        alt={episode.name}
                        fill
                        className="object-cover transition-transform duration-300 rounded-t-lg sm:rounded-none"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      {/* Only show play icon on hover if there's a backdrop */}
                      {episode.still_path && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      )}
                      {/* Rating overlay - only show if rating > 0 */}
                      {episode.vote_average > 0 && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {episode.vote_average.toFixed(1)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Episode Content - Better Layout */}
                    <div className="flex-1 min-w-0 px-3.5 py-4 sm:p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors truncate">
                          {episode.name}
                        </h3>

                        {/* Compact metadata */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            {episode.air_date
                              ? formatDateShort(episode.air_date)
                              : "TBA"}
                          </span>
                          {episode.runtime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
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
                          <div className="text-xs sm:text-sm text-muted-foreground mb-3">
                            <span className="font-medium">Director:</span>{" "}
                            {
                              episode.crew.find(
                                (person) => person.job === "Director",
                              )?.name
                            }
                          </div>
                        )}

                        {/* Overview */}
                        <p className="text-[13px] sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                          {episode.overview || "No overview available."}
                        </p>

                        {/* Guest stars count */}
                        {episode.guest_stars.length > 0 && (
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {episode.guest_stars.length} guest star
                            {episode.guest_stars.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      {/* Action Button - Moved to left */}
                      <div className="flex justify-start mt-3">
                        <Link
                          href={`/tv/${tvShowId}/season/${episode.season_number}/episode/${episode.episode_number}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 sm:h-9 text-xs sm:text-sm group-hover:bg-primary group-hover:text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                          >
                            View Details
                            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </Link>
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
