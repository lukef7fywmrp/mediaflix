import { Calendar, ExternalLink, Film, Globe, Tv, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CircleFlag } from "react-circle-flags";
import type {
  PeopleGetDetailsResponse,
  PeopleGetMovieCreditsResponse,
  PeopleGetTvCreditsResponse,
} from "tmdb-js-node";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";
import {
  calculateAge,
  formatDate,
  formatDateShort,
  getBackdropUrl,
  getCountryCodeFromPlaceOfBirth,
  getPosterUrl,
  getProfileUrl,
} from "@/lib/utils";
import ExpandableOverview from "./ExpandableOverview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface PersonDetailProps {
  person: PeopleGetDetailsResponse<[]>;
  movieCredits: PeopleGetMovieCreditsResponse;
  tvCredits: PeopleGetTvCreditsResponse;
  referrer?: {
    type: "movie" | "tv";
    id: string;
    title: string;
    seasonNumber?: number;
    seasonName?: string;
    episodeNumber?: number;
    episodeName?: string;
  } | null;
}

export default function PersonDetail({
  person,
  movieCredits,
  tvCredits,
  referrer,
}: PersonDetailProps) {
  // Separate movies by role (cast vs crew)
  const moviesAsCast = movieCredits.cast || [];
  const moviesAsCrew = movieCredits.crew || [];

  // Separate TV shows by role (cast vs crew)
  const tvAsCast = tvCredits.cast || [];
  const tvAsCrew = tvCredits.crew || [];

  // Get director credits
  const directedMovies = moviesAsCrew.filter(
    (credit) => credit.job === "Director",
  );
  const directedTV = tvAsCrew.filter((credit) => credit.job === "Director");

  // Sort by release date (most recent first)
  const sortByDate = <
    T extends {
      id: number;
      release_date?: string;
      first_air_date?: string;
      poster_path?: string | null;
      title?: string;
      name?: string;
      character?: string;
      job?: string;
    },
  >(
    items: T[],
  ) => {
    return [...items].sort((a, b) => {
      const dateA = a.release_date || a.first_air_date || "";
      const dateB = b.release_date || b.first_air_date || "";
      return dateB.localeCompare(dateA);
    });
  };

  const sortedMoviesAsCast = sortByDate(moviesAsCast);
  const sortedMoviesAsCrew = sortByDate(moviesAsCrew);
  const sortedTVAsCast = sortByDate(tvAsCast);
  const sortedTVAsCrew = sortByDate(tvAsCrew);
  const sortedDirectedMovies = sortByDate(directedMovies);
  const sortedDirectedTV = sortByDate(directedTV);

  // Deduplicate "Other Crew Work" by movie/show ID and combine jobs
  const deduplicateCrewByMedia = <
    T extends {
      id: number;
      job?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path?: string | null;
      title?: string;
      name?: string;
    },
  >(
    items: T[],
  ): T[] => {
    const mediaMap = new Map<number, T & { jobs: string[] }>();
    items.forEach((item) => {
      const existing = mediaMap.get(item.id);
      if (existing) {
        if (item.job && !existing.jobs.includes(item.job)) {
          existing.jobs.push(item.job);
        }
      } else {
        mediaMap.set(item.id, {
          ...item,
          jobs: item.job ? [item.job] : [],
        });
      }
    });
    return Array.from(mediaMap.values()).map((item) => {
      const { jobs, ...rest } = item;
      const result = {
        ...rest,
        job: jobs.join(", "),
      };
      return result as unknown as T;
    });
  };

  const deduplicatedOtherMoviesAsCrew = deduplicateCrewByMedia(
    sortedMoviesAsCrew.filter((c) => c.job !== "Director"),
  );
  const deduplicatedOtherTVAsCrew = deduplicateCrewByMedia(
    sortedTVAsCrew.filter((c) => c.job !== "Director"),
  );

  // Deduplicate cast credits by media ID and combine characters
  const deduplicateCastByMedia = <
    T extends {
      id: number;
      character?: string;
      release_date?: string;
      first_air_date?: string;
      poster_path?: string | null;
      title?: string;
      name?: string;
    },
  >(
    items: T[],
  ): T[] => {
    const mediaMap = new Map<number, T & { characters: string[] }>();
    items.forEach((item) => {
      const existing = mediaMap.get(item.id);
      if (existing) {
        if (item.character && !existing.characters.includes(item.character)) {
          existing.characters.push(item.character);
        }
      } else {
        mediaMap.set(item.id, {
          ...item,
          characters: item.character ? [item.character] : [],
        });
      }
    });
    return Array.from(mediaMap.values()).map((item) => {
      const { characters, ...rest } = item;
      const result = {
        ...rest,
        character: characters.join(", "),
      };
      return result as unknown as T;
    });
  };

  const deduplicatedMoviesAsCast = deduplicateCastByMedia(sortedMoviesAsCast);
  const deduplicatedTVAsCast = deduplicateCastByMedia(sortedTVAsCast);

  // Get country code for place of birth (lowercase for CircleFlag)
  const placeOfBirthCode = person.place_of_birth
    ? getCountryCodeFromPlaceOfBirth(person.place_of_birth).toLowerCase()
    : null;

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
            {referrer && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/?type=${referrer.type === "movie" ? "movies" : "tv"}`}
                    >
                      {referrer.type === "movie" ? "Movies" : "TV Shows"}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={`/${referrer.type}/${referrer.id}`}
                      className="line-clamp-1 max-w-[150px] sm:max-w-xs"
                    >
                      {referrer.title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {referrer.seasonNumber !== undefined && referrer.seasonName && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href={`/tv/${referrer.id}/season/${referrer.seasonNumber}`}
                          className="line-clamp-1 max-w-[150px] sm:max-w-xs"
                        >
                          {referrer.seasonName}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {referrer.episodeNumber !== undefined &&
                  referrer.episodeName && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link
                            href={`/tv/${referrer.id}/season/${referrer.seasonNumber}/episode/${referrer.episodeNumber}`}
                            className="line-clamp-1 max-w-[150px] sm:max-w-xs"
                          >
                            {referrer.episodeName}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[220px] sm:max-w-xs lg:max-w-sm">
                {person.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {person.profile_path && (
            <>
              <Image
                src={getBackdropUrl(person.profile_path)}
                alt={person.name}
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
            </>
          )}
        </div>

        {/* Person Info Overlay */}
        <div className="relative px-4 py-6 lg:px-6 lg:pt-28 xl:pt-40 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-48 lg:w-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
                  <Image
                    src={
                      person.profile_path
                        ? (getProfileUrl(person.profile_path) ??
                          PLACEHOLDER_POSTER_URL)
                        : PLACEHOLDER_POSTER_URL
                    }
                    alt={person.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Person Details */}
              <div className="flex-1 text-white">
                <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">
                  {person.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-4 lg:mb-6 text-sm lg:text-base">
                  {person.birthday && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span>
                        Born: {formatDate(person.birthday)}
                        {!person.deathday && (
                          <span className="text-white/70">
                            {" "}
                            ({calculateAge(person.birthday)} years)
                          </span>
                        )}
                        {person.deathday &&
                          ` - Died: ${formatDate(person.deathday)} (${calculateAge(person.birthday, person.deathday)} years)`}
                      </span>
                    </div>
                  )}
                  {person.place_of_birth && placeOfBirthCode && (
                    <div className="flex items-center gap-2">
                      <div
                        className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full"
                        title={person.place_of_birth}
                      >
                        <CircleFlag
                          countryCode={placeOfBirthCode}
                          height={20}
                        />
                      </div>
                      <span>{person.place_of_birth}</span>
                    </div>
                  )}
                </div>

                <ExpandableOverview
                  overview={person.biography || "No biography available."}
                  className="mb-6 max-w-4xl"
                  textClassName="leading-relaxed tracking-wide text-sm lg:text-base mb-1"
                  maxLines={5}
                />

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 lg:gap-4">
                  {person.homepage && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-9 px-4 lg:h-10 lg:px-6 bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl text-xs lg:text-sm"
                      asChild
                    >
                      <a
                        href={person.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
                        <span className="hidden sm:inline">
                          Official Website
                        </span>
                        <span className="sm:hidden">Website</span>
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-9 px-4 lg:h-10 lg:px-6 bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl text-xs lg:text-sm"
                    asChild
                  >
                    <a
                      href={`https://www.themoviedb.org/person/${person.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 lg:h-5 lg:w-5" />
                      View on TMDB
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Movies Directed */}
          {sortedDirectedMovies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Movies Directed ({sortedDirectedMovies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="overflow-x-auto">
                  <div className="flex gap-4 pb-2 snap-x snap-mandatory">
                    {sortedDirectedMovies.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="w-32 sm:w-40 flex-shrink-0 snap-start group"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border bg-muted/20">
                          <Image
                            src={getPosterUrl(movie.poster_path)}
                            alt={movie.title || "Movie"}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="160px"
                          />
                        </div>
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                          {movie.title}
                        </h4>
                        {movie.release_date && (
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(movie.release_date)}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* TV Shows Directed */}
          {sortedDirectedTV.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  TV Shows Directed ({sortedDirectedTV.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="overflow-x-auto">
                  <div className="flex gap-4 pb-2 snap-x snap-mandatory">
                    {sortedDirectedTV.map((show) => (
                      <Link
                        key={show.id}
                        href={`/tv/${show.id}`}
                        className="w-32 sm:w-40 flex-shrink-0 snap-start group"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border bg-muted/20">
                          <Image
                            src={getPosterUrl(show.poster_path)}
                            alt={show.name || "TV Show"}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="160px"
                          />
                        </div>
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                          {show.name}
                        </h4>
                        {show.first_air_date && (
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(show.first_air_date)}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Movies as Actor */}
          {deduplicatedMoviesAsCast.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Movies as Actor ({deduplicatedMoviesAsCast.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {deduplicatedMoviesAsCast.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border bg-muted/20">
                        <Image
                          src={getPosterUrl(movie.poster_path)}
                          alt={movie.title || "Movie"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      </div>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                        {movie.title}
                      </h4>
                      {movie.character && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          as {movie.character}
                        </p>
                      )}
                      {movie.release_date && (
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(movie.release_date)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TV Shows as Actor */}
          {deduplicatedTVAsCast.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  TV Shows as Actor ({deduplicatedTVAsCast.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {deduplicatedTVAsCast.map((show) => (
                    <Link
                      key={show.id}
                      href={`/tv/${show.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border bg-muted/20">
                        <Image
                          src={getPosterUrl(show.poster_path)}
                          alt={show.name || "TV Show"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      </div>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                        {show.name}
                      </h4>
                      {show.character && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          as {show.character}
                        </p>
                      )}
                      {show.first_air_date && (
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(show.first_air_date)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Movies as Crew (non-director) */}
          {deduplicatedOtherMoviesAsCrew.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Movies as Crew ({deduplicatedOtherMoviesAsCrew.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {deduplicatedOtherMoviesAsCrew.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border bg-muted/20">
                        <Image
                          src={getPosterUrl(movie.poster_path)}
                          alt={movie.title || "Movie"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      </div>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                        {movie.title}
                      </h4>
                      {movie.job && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {movie.job}
                        </p>
                      )}
                      {movie.release_date && (
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(movie.release_date)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* TV Shows as Crew (non-director) */}
          {deduplicatedOtherTVAsCrew.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  TV Shows as Crew ({deduplicatedOtherTVAsCrew.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {deduplicatedOtherTVAsCrew.map((show) => (
                    <Link
                      key={show.id}
                      href={`/tv/${show.id}`}
                      className="group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 border bg-muted/20">
                        <Image
                          src={getPosterUrl(show.poster_path)}
                          alt={show.name || "TV Show"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      </div>
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                        {show.name}
                      </h4>
                      {show.job && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {show.job}
                        </p>
                      )}
                      {show.first_air_date && (
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(show.first_air_date)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
