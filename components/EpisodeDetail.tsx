import {
  formatDate,
  formatOrdinal,
  formatRuntime,
  getBackdropUrl,
  getProfileUrl,
} from "@/lib/utils";
import { Calendar, Clock, ExternalLink, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TVEpisodesGetDetailsResponse } from "tmdb-js-node";
import EpisodeVideoGallery from "./EpisodeVideoGallery";
import GuestStarsList from "./GuestStarsList";
import ShareButton from "./ShareButton";
import WatchProviders from "./WatchProviders";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import ConditionalTooltip from "./ConditionalTooltip";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";

interface EpisodeDetailProps {
  tvShowId: number;
  seasonNumber: number;
  tvShowName: string;
  seasonName: string;
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
  tvShowName,
  seasonName,
  episode,
  watchProviders,
  country,
}: EpisodeDetailProps) {
  // Deduplicate crew members by person ID and combine their roles
  type CrewMember = NonNullable<typeof episode.credits>["crew"][number];
  const crewByPerson = new Map<
    number,
    { person: CrewMember; roles: string[] }
  >();

  if (episode.credits?.crew && episode.credits.crew.length > 0) {
    episode.credits.crew.forEach((member) => {
      const existing = crewByPerson.get(member.id);
      if (existing) {
        // Person already exists, add role if not already present
        if (!existing.roles.includes(member.job ?? "")) {
          existing.roles.push(member.job ?? "");
        }
      } else {
        // New person, add them with their role
        crewByPerson.set(member.id, {
          person: member,
          roles: [member.job ?? ""],
        });
      }
    });
  }

  // Sort roles: Director first, then Writer, then others
  const rolePriority: Record<string, number> = {
    Director: 0,
    Writer: 1,
  };
  const sortedCrew = Array.from(crewByPerson.values()).map((entry) => ({
    ...entry,
    roles: entry.roles.sort(
      (a, b) =>
        (rolePriority[a] ?? 999) - (rolePriority[b] ?? 999) ||
        a.localeCompare(b),
    ),
  }));

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
                <Link href={`/tv/${tvShowId}`}>{tvShowName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/tv/${tvShowId}/season/${seasonNumber}`}>
                  {seasonName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[220px] sm:max-w-xs lg:max-w-sm">
                {episode.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="container mx-auto px-4 py-8">
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
          {((episode.credits?.crew && episode.credits.crew.length > 0) ||
            (episode.credits?.cast && episode.credits.cast.length > 0) ||
            (episode.credits?.guest_stars &&
              episode.credits.guest_stars.length > 0)) && (
            <div className="space-y-8">
              {/* Crew */}
              {sortedCrew.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Crew</h2>
                  <ScrollArea className="overflow-x-auto">
                    <div className="flex gap-3 pb-2 snap-x snap-mandatory">
                      {sortedCrew.map((entry) => (
                        <ConditionalTooltip
                          key={entry.person.id}
                          name={entry.person.name}
                          character={entry.roles.join(", ")}
                        >
                          <div className="w-28 sm:w-32 flex-shrink-0 snap-start text-center">
                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border bg-muted/20">
                              <Image
                                src={
                                  entry.person.profile_path
                                    ? (getProfileUrl(
                                        entry.person.profile_path,
                                      ) ?? "")
                                    : PLACEHOLDER_POSTER_URL
                                }
                                alt={entry.person.name}
                                fill
                                className="object-cover"
                                sizes="128px"
                              />
                            </div>
                            <div className="mt-2">
                              <p
                                className="font-medium text-sm line-clamp-1"
                                data-name
                              >
                                {entry.person.name}
                              </p>
                              <p
                                className="text-xs text-muted-foreground line-clamp-1"
                                data-character
                              >
                                {entry.roles.join(", ")}
                              </p>
                            </div>
                          </div>
                        </ConditionalTooltip>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}

              {/* Cast */}
              {episode.credits?.cast && episode.credits.cast.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Cast</h2>
                  <ScrollArea className="overflow-x-auto">
                    <div className="flex gap-3 pb-2 snap-x snap-mandatory">
                      {episode.credits.cast.map((actor) => (
                        <ConditionalTooltip
                          key={actor.id}
                          name={actor.name}
                          character={actor.character || "Actor"}
                        >
                          <div className="w-28 sm:w-32 flex-shrink-0 snap-start text-center">
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
                              <p
                                className="font-medium text-sm line-clamp-1"
                                data-name
                              >
                                {actor.name}
                              </p>
                              <p
                                className="text-xs text-muted-foreground line-clamp-1"
                                data-character
                              >
                                {actor.character || "Actor"}
                              </p>
                            </div>
                          </div>
                        </ConditionalTooltip>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}

              {/* Guest Stars */}
              {episode.credits?.guest_stars &&
                episode.credits.guest_stars.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Guest Stars</h2>
                    <GuestStarsList guestStars={episode.credits.guest_stars} />
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
