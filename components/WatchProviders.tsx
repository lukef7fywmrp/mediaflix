"use client";

import { getProviderLogoUrl, getCountryName } from "@/lib/utils";
import { ChevronRight, Monitor, Film, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MoviesGetWatchProvidersBuy } from "tmdb-js-node";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
      <div className={`space-y-3 ${className} w-fit`}>
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Film className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium mb-1">May Be In Cinemas</h4>
              <p className="text-white/70 text-sm mb-2">
                This movie may be playing in theaters near you
              </p>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent((movieTitle || "movie") + " showtimes near me")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Check local theaters</span>
                </a>
              </div>
            </div>
          </div>
        </div>
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
          className="rounded object-contain hover:scale-105 transition-transform duration-200"
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
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex overflow-x-auto scrollbar-hide">
        {sortedProviders.slice(0, 6).map((provider) => (
          <ProviderLogo key={provider.provider_id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
