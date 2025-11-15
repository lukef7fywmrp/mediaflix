import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  formatDate,
  formatDateShort,
  formatLanguage,
  formatPopularity,
  getBackdropUrl,
  getCountryCodeForLanguage,
  getCountryNameWithHistory,
  getPosterUrl,
  getProfileUrl,
  getValidCountryCodeForFlag,
} from "@/lib/utils";
import {
  Award,
  Calendar,
  CalendarDays,
  ExternalLink,
  Film,
  Globe,
  Play,
  Star,
  TrendingUp,
  Tv,
  Users,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import {
  MoviesGetWatchProvidersBuy,
  TVGetDetailsResponse,
  TVGetVideosResult,
} from "tmdb-js-node";
import ExpandableOverview from "./ExpandableOverview";
import SeasonEpisodesAccordion from "./SeasonEpisodesAccordion";
import TVShowVideoGallery from "./TVShowVideoGallery";
import WatchlistButton from "./WatchlistButton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import WatchProviders from "./WatchProviders";
import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

// Helper function to get embedded video URL for modal
const getEmbedUrl = (site: string, key: string) => {
  switch (site) {
    case "YouTube":
      return `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
    case "Vimeo":
      return `https://player.vimeo.com/video/${key}?autoplay=1&title=0&byline=0&portrait=0`;
    default:
      return "#";
  }
};

interface TVShowDetailProps {
  tvShow: TVGetDetailsResponse<
    (
      | "content_ratings"
      | "credits"
      | "recommendations"
      | "reviews"
      | "similar"
    )[]
  >;
  watchProviders?: {
    flatrate?: MoviesGetWatchProvidersBuy[];
  };
  country?: string;
  videos?: TVGetVideosResult[];
}

// Helper function to find the best trailer
const findBestTrailer = (videos: TVGetVideosResult[] | undefined) => {
  if (!videos || videos.length === 0) return null;

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
  const officialTrailers = videos.filter(
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
  const officialTeasers = videos.filter(
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
  const trailers = videos.filter(
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
  const teasers = videos.filter(
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

export default async function TVShowDetail({
  tvShow,
  watchProviders,
  country,
  videos,
}: TVShowDetailProps) {
  const { userId } = await auth();
  const totalEpisodes = tvShow.number_of_episodes;
  const totalSeasons = tvShow.number_of_seasons;
  const lastAirDate = tvShow.last_air_date;
  const nextAirDate = tvShow.next_episode_to_air;
  const director = tvShow.credits.crew.find(
    (person) => person.job === "Director",
  );
  const writers = tvShow.credits.crew.filter(
    (person) => person.job === "Writer",
  );
  const producers = tvShow.credits.crew.filter(
    (person) => person.job === "Producer",
  );

  const bestTrailer = findBestTrailer(videos);

  const preloaded = userId
    ? await preloadQuery(api.watchlist.isInWatchlist, {
        mediaType: "tv",
        mediaId: tvShow.id,
        userId: userId ?? "",
      })
    : undefined;

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
              <BreadcrumbPage className="line-clamp-1 max-w-[220px] sm:max-w-xs lg:max-w-sm">
                {tvShow.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Backdrop Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl(tvShow.backdrop_path)}
            alt={tvShow.name}
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
        </div>

        {/* TV Show Info Overlay */}
        <div className="relative px-4 py-6 lg:px-6 lg:pt-28 xl:pt-60 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative w-32 h-48 lg:w-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={getPosterUrl(tvShow.poster_path)}
                    alt={tvShow.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* TV Show Details */}
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
                  {tvShow.genres.map((genre) => (
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
                  {tvShow.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 lg:gap-6 mb-4 lg:mb-6 text-xs lg:text-base">
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span>{formatDate(tvShow.first_air_date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Tv className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span>
                      {totalSeasons} Season{totalSeasons !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <CalendarDays className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span>
                      {totalEpisodes} Episode{totalEpisodes !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <Star className="h-4 w-4 lg:h-5 lg:w-5 fill-yellow-400 text-yellow-400" />
                    <span>{tvShow.vote_average.toFixed(1)}</span>
                    <span className="text-white/70 text-xs lg:text-sm">
                      ({tvShow.vote_count.toLocaleString()})
                    </span>
                  </div>
                </div>

                <ExpandableOverview
                  overview={tvShow.overview}
                  className="mb-4 lg:mb-6 max-w-4xl"
                  textClassName="leading-relaxed tracking-wide text-xs lg:text-base mb-1"
                  maxLines={3}
                />

                <div className="mb-4 lg:mb-6">
                  <WatchProviders
                    watchProviders={watchProviders || { flatrate: [] }}
                    country={country}
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
                      mediaType="tv"
                      mediaId={tvShow.id}
                      title={tvShow.name}
                      posterPath={tvShow.poster_path}
                      releaseDate={tvShow.first_air_date}
                      overview={tvShow.overview ?? undefined}
                      voteAverage={tvShow.vote_average}
                      voteCount={tvShow.vote_count}
                      preloaded={preloaded}
                    />
                  )}
                  {tvShow.homepage && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-9 px-4 lg:h-10 lg:px-6 bg-white/20 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl text-xs lg:text-sm"
                      asChild
                    >
                      <a
                        href={tvShow.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
                        <span className="hidden sm:inline">
                          View more about {tvShow.name}
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
                      href={`https://www.themoviedb.org/tv/${tvShow.id}`}
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
            {tvShow.credits.cast.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Cast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tvShow.credits.cast.map((actor) => (
                      <div key={actor.id} className="text-center">
                        <Avatar className="h-10 w-10 mx-auto mb-2">
                          <AvatarImage
                            src={getProfileUrl(actor.profile_path)}
                            className="object-cover"
                          />
                          <AvatarFallback className="uppercase">
                            {actor.name.charAt(0) + actor.name.charAt(1)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-sm">{actor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Crew */}
            {(director || writers.length > 0 || producers.length > 0) && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Crew
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {director && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Director
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={getProfileUrl(director.profile_path)}
                            className="object-cover"
                          />
                          <AvatarFallback className="uppercase">
                            {director.name.charAt(0) + director.name.charAt(1)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">{director.name}</p>
                      </div>
                    </div>
                  )}
                  {writers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Writers
                      </h4>
                      <div className="space-y-3">
                        {writers.slice(0, 4).map((writer) => (
                          <div
                            key={writer.id}
                            className="flex items-center gap-3"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={getProfileUrl(writer.profile_path)}
                                className="object-cover"
                              />
                              <AvatarFallback className="uppercase">
                                {writer.name.charAt(0) + writer.name.charAt(1)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{writer.name}</p>
                          </div>
                        ))}
                      </div>
                      {writers.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{writers.length - 4} more writers
                        </p>
                      )}
                    </div>
                  )}
                  {producers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                        Producers
                      </h4>
                      <div className="space-y-3">
                        {producers.slice(0, 4).map((producer) => (
                          <div
                            key={producer.id}
                            className="flex items-center gap-3"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={getProfileUrl(producer.profile_path)}
                                className="object-cover"
                              />
                              <AvatarFallback className="uppercase">
                                {producer.name.charAt(0) +
                                  producer.name.charAt(1)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">
                              {producer.name}
                            </p>
                          </div>
                        ))}
                      </div>
                      {producers.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{producers.length - 4} more producers
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Seasons & Episodes */}
            <Card className="gap-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5" />
                  Seasons & Episodes
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                {tvShow.number_of_episodes > 0 ? (
                  <SeasonEpisodesAccordion
                    seasons={tvShow.seasons}
                    tvShowId={tvShow.id}
                  />
                ) : (
                  <div className="space-y-4">
                    {tvShow.seasons.map((season) => (
                      <div
                        key={season.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
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
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {season.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>
                              {season.episode_count} Episode
                              {season.episode_count !== 1 ? "s" : ""}
                            </span>
                            {season.air_date && (
                              <span>{formatDateShort(season.air_date)}</span>
                            )}
                          </div>
                          {season.overview && (
                            <p className="text-sm mt-2 line-clamp-2">
                              {season.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Videos */}
            {videos && videos.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5" />
                    Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TVShowVideoGallery videos={videos} />
                </CardContent>
              </Card>
            )}

            {/* Similar Shows */}
            {tvShow.similar.results.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Similar Shows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tvShow.similar.results.slice(0, 8).map((show) => (
                      <Link key={show.id} href={`/tv/${show.id}`}>
                        <div className="group cursor-pointer">
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            <Image
                              src={getPosterUrl(show.poster_path)}
                              alt={show.name}
                              fill
                              className="object-cover transition-transform md:group-hover:scale-105"
                            />
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 md:group-hover:text-primary">
                            {show.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(show.first_air_date)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {tvShow.recommendations.results.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tv className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tvShow.recommendations.results.slice(0, 8).map((show) => (
                      <Link key={show.id} href={`/tv/${show.id}`}>
                        <div className="group cursor-pointer">
                          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                            <Image
                              src={getPosterUrl(show.poster_path)}
                              alt={show.name}
                              fill
                              className="object-cover transition-transform md:group-hover:scale-105"
                            />
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 md:group-hover:text-primary">
                            {show.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(show.first_air_date)}
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
            {/* Show Stats */}
            <Card className="gap-3">
              <CardHeader>
                <CardTitle>Show Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium">{tvShow.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">{tvShow.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Original Language
                  </span>
                  <span className="text-sm font-medium">
                    {formatLanguage(tvShow.original_language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Seasons</span>
                  <span className="text-sm font-medium">{totalSeasons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Episodes
                  </span>
                  <span className="text-sm font-medium">{totalEpisodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Air Date
                  </span>
                  <span className="text-sm font-medium">
                    {lastAirDate ? formatDateShort(lastAirDate) : "N/A"}
                  </span>
                </div>
                {nextAirDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Next Air Date
                    </span>
                    <span className="text-sm font-medium">
                      {formatDateShort(nextAirDate)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Popularity
                  </span>
                  <span className="text-sm font-medium">
                    {formatPopularity(tvShow.popularity)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Networks */}
            {tvShow.networks.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Streaming on</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tvShow.networks.map((network) => (
                      <div key={network.id} className="flex items-center gap-3">
                        {network.logo_path ? (
                          <div className="flex-shrink-0 w-20 h-12 bg-muted/20 rounded border border-border p-2 flex items-center justify-center">
                            <Image
                              src={getBackdropUrl(network.logo_path)}
                              alt={network.name}
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
                                {network.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 3)}
                              </div>
                            </div>
                          </div>
                        )}
                        <p className="text-sm">{network.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Production Companies */}
            {tvShow.production_companies.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Produced by</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tvShow.production_companies.map((company) => (
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
            {tvShow.production_countries.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Released in</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tvShow.production_countries.map((country) => {
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
            {tvShow.spoken_languages.length > 0 && (
              <Card className="gap-3">
                <CardHeader>
                  <CardTitle>Spoken Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tvShow.spoken_languages.map((language) => {
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
