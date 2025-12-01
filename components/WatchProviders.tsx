"use client";

import { ChevronRight, ExternalLink, MapPin, Monitor } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { MoviesGetWatchProvidersBuy } from "tmdb-js-node";
import { getCountryName, getProviderLogoUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const JUSTWATCH_LOGO_URL =
  "https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg";

interface WatchProvidersProps {
  watchProviders: {
    flatrate?: MoviesGetWatchProvidersBuy[];
  };
  country?: string;
  className?: string;
  isMovie?: boolean;
  movieTitle?: string;
  releaseDate?: string;
  textColor?: string;
  countryBadgeColor?: string;
}

export default function WatchProviders({
  watchProviders,
  country,
  className = "",
  isMovie = false,
  movieTitle,
  releaseDate,
  textColor = "text-white",
  countryBadgeColor = "text-white/60 bg-white/10",
}: WatchProvidersProps) {
  const [showAllProviders, setShowAllProviders] = useState(false);

  const streamingProviders = watchProviders.flatrate || [];

  // Check if movie is recent (within last 6 months)
  const isRecentMovie = () => {
    if (!releaseDate) return false;
    const movieDate = new Date(releaseDate);
    const currentDate = new Date();

    // Don't show for future releases
    if (movieDate > currentDate) return false;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    return movieDate >= sixMonthsAgo;
  };

  // Show cinema UI for movies with no streaming providers AND if it's recent
  if (streamingProviders.length === 0 && isMovie && isRecentMovie()) {
    return (
      <div className={`${className} w-fit`}>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(`${movieTitle || "movie"} showtimes near me`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-background/80 hover:text-background transition-colors duration-200"
        >
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-medium group-hover:underline">
            Check nearby theaters
          </span>
          <ExternalLink className="h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>
    );
  }

  if (streamingProviders.length === 0) {
    return null;
  }

  // Sort by display_priority (lower number = higher priority)
  const sortedProviders = streamingProviders.sort(
    (a, b) => a.display_priority - b.display_priority,
  );

  const ProviderLogo = ({
    provider,
  }: {
    provider: MoviesGetWatchProvidersBuy;
  }) => (
    <div className="flex items-center justify-center p-1">
      {provider.logo_path ? (
        <Image
          src={getProviderLogoUrl(provider.logo_path)!}
          alt={provider.provider_name}
          width={40}
          height={40}
          className="rounded object-contain transition-transform duration-200"
        />
      ) : (
        <div className="w-10 h-10 rounded flex items-center justify-center">
          <Monitor className="h-5 w-5 text-white/70" />
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-3 ${className} w-fit`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className={`text-base font-semibold ${textColor}`}>
            Streaming In
          </h3>
          {country && (
            <span className={`text-xs px-2 py-1 rounded ${countryBadgeColor}`}>
              {getCountryName(country)}
            </span>
          )}
        </div>
        {sortedProviders.length > 6 && (
          <Dialog open={showAllProviders} onOpenChange={setShowAllProviders}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 h-full text-xs text-white/70 hover:text-white transition-colors">
                View All
                <ChevronRight className="h-3 w-3" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/20 text-white sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  All Streaming Providers
                  {country && (
                    <span className="text-sm text-white/60 font-normal ml-2">
                      ({getCountryName(country)})
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {sortedProviders.map((provider) => (
                  <div
                    key={provider.provider_id}
                    className="flex flex-col items-center gap-2"
                  >
                    <ProviderLogo provider={provider} />
                    <span className="text-xs text-white/60 text-center">
                      {provider.provider_name}
                    </span>
                  </div>
                ))}
              </div>
              {/* JustWatch Attribution */}
              <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-white/10">
                <span className="text-xs text-white/60">Powered by</span>
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
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex overflow-x-auto scrollbar-hide">
          {sortedProviders.slice(0, 6).map((provider) => (
            <Tooltip key={provider.provider_id}>
              <TooltipTrigger asChild>
                <div>
                  <ProviderLogo provider={provider} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{provider.provider_name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        {/* JustWatch Attribution */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-xs ${textColor} opacity-60`}>Powered by</span>
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
      </div>
    </div>
  );
}
