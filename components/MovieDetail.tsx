import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import {
  Award,
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Globe,
  Play,
  TrendingUp,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import type {
  MoviesGetDetailsResponse,
  MoviesGetWatchProvidersBuy,
} from "tmdb-js-node";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { PLACEHOLDER_POSTER_URL } from "@/lib/constants";
import {
  cn,
  formatDate,
  formatDateShort,
  formatLanguage,
  formatLargeNumber,
  formatPopularity,
  formatRuntime,
  getBackdropUrl,
  getCountryCodeForLanguage,
  getCountryNameWithHistory,
  getEmbedUrl,
  getPosterUrl,
  getProfileUrl,
  getValidCountryCodeForFlag,
} from "@/lib/utils";
import CastSection from "./CastSection";
import ConditionalTooltip from "./ConditionalTooltip";
import ExpandableOverview from "./ExpandableOverview";
import MovieVideoGallery from "./MovieVideoGallery";
import RatingSource from "./RatingSource";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import WatchlistButton from "./WatchlistButton";
import WatchProviders from "./WatchProviders";

interface MovieDetailProps {
  movie: MoviesGetDetailsResponse<
    ("credits" | "recommendations" | "similar" | "videos")[]
  >;
  watchProviders?: {
    flatrate?: MoviesGetWatchProvidersBuy[];
  };
  country?: string;
}

// Helper function to find the best trailer
const findBestTrailer = (
  videos: MoviesGetDetailsResponse<
    ("credits" | "recommendations" | "similar" | "videos")[]
  >["videos"],
) => {
  if (!videos?.results || videos.results.length === 0) return null;

  // Helper functions to check title content
  const hasOfficialTrailerInTitle = (name: string) => {
    return name.toLowerCase().includes("official trailer");
  };

  const hasTrailerInTitle = (name: string) => {
    const lowerName = name.toLowerCase();
    // Check for "trailer" but not "official trailer" to avoid double matching
    return (
      lowerName.includes("trailer") && !lowerName.includes("official trailer")
    );
  };

  // Priority: Official Trailer > Official Teaser > Trailer > Teaser
  // Within each category, prioritize: "Official Trailer" > "Trailer" > other
  // Always prioritize official content first

  // Official Trailers - prioritize in this order:
  // 1. Exact match "Official Trailer"
  // 2. Contains "Official Trailer"
  // 3. Contains "Trailer" (but not "Official Trailer")
  // 4. Any official trailer
  const officialTrailers = videos.results.filter(
    (video) => video.type === "Trailer" && video.official === true,
  );
  if (officialTrailers.length > 0) {
    // First priority: Exact match "Official Trailer"
    const exactOfficialTrailer = officialTrailers.find(
      (video) => video.name.toLowerCase().trim() === "official trailer",
    );
    if (exactOfficialTrailer) return exactOfficialTrailer;

    // Second priority: Contains "Official Trailer"
    const withOfficialTrailerTitle = officialTrailers.find((video) =>
      hasOfficialTrailerInTitle(video.name),
    );
    if (withOfficialTrailerTitle) return withOfficialTrailerTitle;

    // Third priority: Contains "Trailer" (but not "Official Trailer")
    const withTrailerTitle = officialTrailers.find((video) =>
      hasTrailerInTitle(video.name),
    );
    if (withTrailerTitle) return withTrailerTitle;

    // Fallback: First official trailer
    return officialTrailers[0];
  }

  // Official Teasers - prioritize in this order:
  // 1. Contains "Official Trailer"
  // 2. Contains "Trailer" (but not "Official Trailer")
  // 3. Any official teaser
  const officialTeasers = videos.results.filter(
    (video) => video.type === "Teaser" && video.official === true,
  );
  if (officialTeasers.length > 0) {
    // First priority: Contains "Official Trailer"
    const withOfficialTrailerTitle = officialTeasers.find((video) =>
      hasOfficialTrailerInTitle(video.name),
    );
    if (withOfficialTrailerTitle) return withOfficialTrailerTitle;

    // Second priority: Contains "Trailer" (but not "Official Trailer")
    const withTrailerTitle = officialTeasers.find((video) =>
      hasTrailerInTitle(video.name),
    );
    if (withTrailerTitle) return withTrailerTitle;

    // Fallback: First official teaser
    return officialTeasers[0];
  }

  // Non-official Trailers - prioritize ones with "Trailer" in title
  const trailers = videos.results.filter(
    (video) => video.type === "Trailer" && video.official !== true,
  );
  if (trailers.length > 0) {
    const withTrailerTitle = trailers.find((video) =>
      hasTrailerInTitle(video.name),
    );
    if (withTrailerTitle) return withTrailerTitle;
    // If no trailer with matching title, return first trailer
    return trailers[0];
  }

  // Non-official Teasers - prioritize ones with "Trailer" in title
  const teasers = videos.results.filter(
    (video) => video.type === "Teaser" && video.official !== true,
  );
  if (teasers.length > 0) {
    const withTrailerTitle = teasers.find((video) =>
      hasTrailerInTitle(video.name),
    );
    if (withTrailerTitle) return withTrailerTitle;
    // If no teaser with matching title, return first teaser
    return teasers[0];
  }

  // Return null if no trailer/teaser found - don't show Watch Trailer button
  return null;
};

export default async function MovieDetail({
  movie,
  watchProviders,
  country,
}: MovieDetailProps) {
  const { userId } = await auth();
  const director = movie.credits.crew.find(
    (person) => person.job === "Director",
  );
  const writers = movie.credits.crew.filter(
    (person) => person.job === "Writer",
  );
  const producers = movie.credits.crew.filter(
    (person) => person.job === "Producer",
  );

  // Deduplicate crew members by person ID and combine their roles
  const allCrew = [...(director ? [director] : []), ...writers, ...producers];
  type CrewMember = (typeof movie.credits.crew)[number];
  const crewByPerson = new Map<
    number,
    { person: CrewMember; roles: string[] }
  >();

  allCrew.forEach((member) => {
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

  // Sort roles: Director first, then Writer, then Producer, then others
  const rolePriority: Record<string, number> = {
    Director: 0,
    Writer: 1,
    Producer: 2,
  };
  const sortedCrew = Array.from(crewByPerson.values()).map((entry) => ({
    ...entry,
    roles: entry.roles.sort(
      (a, b) =>
        (rolePriority[a] ?? 999) - (rolePriority[b] ?? 999) ||
        a.localeCompare(b),
    ),
  }));

  const preloaded = userId
    ? await preloadQuery(api.watchlist.isInWatchlist, {
        mediaType: "movie",
        mediaId: movie.id,
        userId: userId ?? "",
      })
    : undefined;

  const bestTrailer = findBestTrailer(movie.videos);

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
                <Link href="/?type=movies">Movies</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[220px] sm:max-w-xs lg:max-w-sm">
                {movie.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Backdrop Hero Section */}
      <div className={cn("relative overflow-hidden")}>
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        </div>

        {/* Movie Info Overlay */}
        <div className="relative px-4 py-6 lg:px-6 lg:pt-48 xl:pt-60 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-48 lg:w-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Movie Details */}
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
                  {movie.genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-2xl lg:text-4xl font-extrabold mb-3 lg:mb-4 leading-tight">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 lg:gap-6 mb-4 lg:mb-6 text-xs lg:text-base">
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <RatingSource
                      rating={movie.vote_average}
                      className="text-white"
                    />
                    <span className="text-white/70 text-xs lg:text-sm">
                      ({movie.vote_count.toLocaleString()})
                    </span>
                  </div>
                </div>

                <ExpandableOverview
                  overview={movie.overview}
                  className="mb-4 lg:mb-6 max-w-4xl"
                  textClassName="leading-relaxed tracking-wide text-xs lg:text-base mb-1"
                  maxLines={3}
                />

                {/* Watch Providers */}
                <div className="mb-4 lg:mb-6">
                  <WatchProviders
                    watchProviders={watchProviders || { flatrate: [] }}
                    country={country}
                    isMovie={true}
                    movieTitle={movie.title}
                    releaseDate={movie.release_date}
                  />
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 lg:gap-4">
                  {bestTrailer && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          variant="secondary"
                          className="w-full sm:w-auto h-9 px-4 lg:h-10 lg:px-6"
                        >
                          <Play className="h-4 w-4 lg:h-5 lg:w-5" />
                          Watch Trailer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-4xl w-full p-0 overflow-hidden border-primary bg-primary">
                        <DialogTitle className="sr-only">
                          {bestTrailer.name}
                        </DialogTitle>
                        <div className="relative aspect-video">
                          <iframe
                            src={getEmbedUrl(bestTrailer.site, bestTrailer.key)}
                            className="w-full h-full rounded-b-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  {preloaded && (
                    <WatchlistButton
                      mediaType="movie"
                      mediaId={movie.id}
                      title={movie.title}
                      posterPath={movie.poster_path ?? undefined}
                      releaseDate={movie.release_date}
                      overview={movie.overview ?? undefined}
                      voteAverage={movie.vote_average}
                      voteCount={movie.vote_count}
                      preloaded={preloaded}
                    />
                  )}
                  {movie.homepage && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-9 px-4 lg:h-10 lg:px-6 bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl text-xs lg:text-sm"
                      asChild
                    >
                      <a
                        href={movie.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
                        <span className="hidden sm:inline">
                          View more about {movie.title}
                        </span>
                        <span className="sm:hidden">More info</span>
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
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cast */}
            <CastSection credits={movie.credits} />

            {/* Crew */}
            {sortedCrew.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Crew
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            {/* Videos */}
            {movie.videos?.results.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5" />
                    Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MovieVideoGallery videos={movie.videos} />
                </CardContent>
              </Card>
            )}

            {/* Similar Movies */}
            {movie.similar.results.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Similar Movies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {movie.similar.results.slice(0, 8).map((movie) => (
                      <Link key={movie.id} href={`/movie/${movie.id}`}>
                        <div className="group cursor-pointer">
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            <Image
                              src={getPosterUrl(movie.poster_path)}
                              alt={movie.title}
                              fill
                              className="object-cover transition-transform md:group-hover:scale-105"
                            />
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 md:group-hover:text-primary">
                            {movie.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(movie.release_date)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {movie.recommendations.results.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Film className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {movie.recommendations.results.slice(0, 8).map((movie) => (
                      <Link key={movie.id} href={`/movie/${movie.id}`}>
                        <div className="group cursor-pointer">
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            <Image
                              src={getPosterUrl(movie.poster_path)}
                              alt={movie.title}
                              fill
                              className="object-cover transition-transform md:group-hover:scale-105"
                            />
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 md:group-hover:text-primary">
                            {movie.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(movie.release_date)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Movie Stats */}
            <Card className="gap-3">
              <CardHeader>
                <CardTitle>Movie Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium">{movie.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Original Language
                  </span>
                  <span className="text-sm font-medium">
                    {formatLanguage(movie.original_language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Budget (USD)
                  </span>
                  <span className="text-sm font-medium">
                    {movie.budget > 0 ? formatLargeNumber(movie.budget) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Revenue (USD)
                  </span>
                  <span className="text-sm font-medium">
                    {movie.revenue > 0
                      ? formatLargeNumber(movie.revenue)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Popularity
                  </span>
                  <span className="text-sm font-medium">
                    {formatPopularity(movie.popularity)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Production Companies */}
            {movie.production_companies.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Produced by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {movie.production_companies.map((company) => (
                      <div key={company.id} className="flex items-center gap-3">
                        {company.logo_path ? (
                          <div className="flex-shrink-0 w-20 h-12 bg-muted/20 rounded border border-border p-2 flex items-center justify-center">
                            <Image
                              src={getBackdropUrl(company.logo_path)}
                              alt={company.name}
                              width={64}
                              height={32}
                              className="object-contain max-w-full max-h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-12 bg-muted/30 rounded flex items-center justify-center flex-shrink-0 border border-muted">
                            <div className="text-center">
                              <Film className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                              <div className="text-[10px] text-muted-foreground font-medium leading-none">
                                {company.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 3)}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{company.name}</p>
                          {company.origin_country && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {company.origin_country}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Production Countries */}
            {movie.production_countries.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Released in</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {movie.production_countries.map((country) => {
                      const validCountryCode = getValidCountryCodeForFlag(
                        country.iso_3166_1,
                      );
                      const countryName = getCountryNameWithHistory(
                        country.iso_3166_1,
                      );

                      return (
                        <div
                          key={country.iso_3166_1}
                          className="flex items-center gap-3"
                        >
                          <ReactCountryFlag
                            countryCode={validCountryCode}
                            svg
                            style={{
                              width: "28px",
                              height: "18px",
                              borderRadius: "3px",
                            }}
                            title={countryName}
                          />
                          <p className="text-sm">{countryName}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spoken Languages */}
            {movie.spoken_languages.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Spoken Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {movie.spoken_languages.map((language) => {
                      const countryCode = getCountryCodeForLanguage(
                        language.iso_639_1,
                      );

                      return (
                        <div
                          key={language.iso_639_1}
                          className="flex items-center gap-3"
                        >
                          <ReactCountryFlag
                            countryCode={countryCode}
                            svg
                            style={{
                              width: "28px",
                              height: "18px",
                              borderRadius: "3px",
                            }}
                            title={language.name}
                          />
                          <p className="text-sm">{language.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
