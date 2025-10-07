"use client";

import { getProviderLogoUrl } from "@/lib/utils";
import { ChevronRight, Monitor } from "lucide-react";
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
  className?: string;
}

export default function WatchProvidersFallback({
  watchProviders,
  className = "",
}: WatchProvidersProps) {
  const [showAllProviders, setShowAllProviders] = useState(false);

  const streamingProviders = watchProviders.flatrate || [];

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
        <h3 className="text-base font-semibold text-white">Streaming On</h3>
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

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {sortedProviders.slice(0, 6).map((provider) => (
          <ProviderLogo key={provider.provider_id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
