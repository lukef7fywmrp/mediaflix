import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDate,
  formatDateShort,
  formatLanguage,
  formatLargeNumber,
  formatPopularity,
  formatRuntime,
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
  Clock,
  ExternalLink,
  Film,
  Globe,
  Play,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import {
  MoviesGetDetailsResponse,
  MoviesGetWatchProvidersBuy,
} from "tmdb-js-node";
import BackButton from "./BackButton";
import CastSection from "./CastSection";
import ExpandableOverview from "./ExpandableOverview";
import RatingSource from "./RatingSource";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import WatchProviders from "./WatchProviders";

interface MovieDetailProps {
  movie: MoviesGetDetailsResponse<
    ("credits" | "recommendations" | "similar")[]
  >;
  watchProviders?: {
    flatrate?: MoviesGetWatchProvidersBuy[];
  };
  country?: string;
}

export default function MovieDetail({
  movie,
  watchProviders,
  country,
}: MovieDetailProps) {
  const director = movie.credits.crew.find(
    (person) => person.job === "Director",
  );
  const writers = movie.credits.crew.filter(
    (person) => person.job === "Writer",
  );
  const producers = movie.credits.crew.filter(
    (person) => person.job === "Producer",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Backdrop Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
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

        {/* Navigation */}
        <div className="relative z-10 p-6 container mx-auto">
          <BackButton />
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-72 lg:w-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl">
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
                <div className="flex flex-wrap items-center gap-2 mb-4">
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

                <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm lg:text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <RatingSource
                      rating={movie.vote_average}
                      className="text-white"
                    />
                    <span className="text-white/70">
                      ({movie.vote_count.toLocaleString()})
                    </span>
                  </div>
                </div>

                <ExpandableOverview
                  overview={movie.overview}
                  className="mb-6 max-w-4xl"
                  textClassName="leading-relaxed tracking-wide text-sm lg:text-base mb-1"
                  maxLines={3}
                />

                {/* Watch Providers */}
                <div className="mb-6">
                  <WatchProviders
                    watchProviders={watchProviders || { flatrate: [] }}
                    country={country}
                    isMovie={true}
                    movieTitle={movie.title}
                    releaseDate={movie.release_date}
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 hover:scale-102 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Play className="h-5 w-5" />
                    Watch Trailer
                  </Button>
                  {movie.homepage && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/20 border-white/30 text-white hover:border-white/50 hover:scale-102 transition-all duration-200 shadow-lg hover:shadow-xl"
                      asChild
                    >
                      <a
                        href={movie.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-5 w-5" />
                        View more about {movie.title}
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/20 border-white/30 text-white hover:border-white/50 hover:scale-102 transition-all duration-200 shadow-lg hover:shadow-xl"
                    asChild
                  >
                    <a
                      href={`https://www.themoviedb.org/movie/${movie.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5" />
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
                        <div className="relative w-20 h-20 rounded-full overflow-hidden">
                          <Avatar className="size-full">
                            <AvatarImage
                              src={getProfileUrl(director.profile_path)}
                              className="object-cover"
                            />
                            <AvatarFallback className="uppercase">
                              {director.name.charAt(0) +
                                director.name.charAt(1)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
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
                            <div className="relative w-20 h-20 rounded-full overflow-hidden">
                              <Avatar className="size-full">
                                <AvatarImage
                                  src={getProfileUrl(writer.profile_path)}
                                  className="object-cover"
                                />
                                <AvatarFallback className="uppercase">
                                  {writer.name.charAt(0) +
                                    writer.name.charAt(1)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
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
                            <div className="relative w-20 h-20 rounded-full overflow-hidden">
                              <Avatar className="size-full">
                                <AvatarImage
                                  src={getProfileUrl(producer.profile_path)}
                                  className="object-cover"
                                />
                                <AvatarFallback className="uppercase">
                                  {producer.name.charAt(0) +
                                    producer.name.charAt(1)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
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
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
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
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
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
