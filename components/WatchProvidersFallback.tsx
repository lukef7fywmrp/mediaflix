"use client";

import { getProviderLogoUrl } from "@/lib/utils";
import { ChevronRight, CreditCard, Monitor, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  MoviesGetWatchProvidersBuy,
  MoviesGetWatchProvidersResponse,
} from "tmdb-js-node";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";

type ProviderWithType = MoviesGetWatchProvidersBuy & {
  type: "flatrate" | "buy" | "rent";
};

interface WatchProvidersProps {
  watchProviders: MoviesGetWatchProvidersResponse;
  className?: string;
}

export default function WatchProvidersFallback({
  watchProviders,
  className = "",
}: WatchProvidersProps) {
  const [showAllProviders, setShowAllProviders] = useState(false);

  // Get US providers by default, fallback to first available region
  const usProviders = watchProviders.results.US;
  const availableRegions = Object.keys(watchProviders.results);
  const regionProviders =
    usProviders || watchProviders.results[availableRegions[0]];

  if (!regionProviders) {
    return null;
  }

  const flatrate = regionProviders.flatrate || [];
  const buy = "buy" in regionProviders ? regionProviders.buy || [] : [];
  const rent = "rent" in regionProviders ? regionProviders.rent || [] : [];
  const link = regionProviders.link;

  // Combine all providers and remove duplicates
  const allProviders: ProviderWithType[] = [
    ...flatrate.map((p) => ({ ...p, type: "flatrate" as const })),
    ...buy.map((p) => ({ ...p, type: "buy" as const })),
    ...rent.map((p) => ({ ...p, type: "rent" as const })),
  ];

  // Remove duplicates by provider_id
  const uniqueProviders = allProviders.filter(
    (provider, index, self) =>
      index === self.findIndex((p) => p.provider_id === provider.provider_id),
  );

  // Sort by display_priority (lower number = higher priority)
  const sortedProviders = uniqueProviders.sort(
    (a, b) => a.display_priority - b.display_priority,
  );

  if (sortedProviders.length === 0) {
    return null;
  }

  // Group by type for display
  const flatrateProviders = sortedProviders.filter(
    (p) => p.type === "flatrate",
  );
  const rentProviders = sortedProviders.filter((p) => p.type === "rent");
  const buyProviders = sortedProviders.filter((p) => p.type === "buy");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flatrate":
        return <Monitor className="h-3 w-3" />;
      case "rent":
        return <CreditCard className="h-3 w-3" />;
      case "buy":
        return <ShoppingCart className="h-3 w-3" />;
      default:
        return <Monitor className="h-3 w-3" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "flatrate":
        return "Stream";
      case "rent":
        return "Rent";
      case "buy":
        return "Buy";
      default:
        return "Stream";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flatrate":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "rent":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "buy":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const ProviderCard = ({ provider }: { provider: ProviderWithType }) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-md px-2 py-1.5 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer min-w-fit"
    >
      {provider.logo_path ? (
        <Image
          src={getProviderLogoUrl(provider.logo_path)!}
          alt={provider.provider_name}
          width={18}
          height={18}
          className="rounded object-contain"
        />
      ) : (
        <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">
          {getTypeIcon(provider.type)}
        </div>
      )}
      <div className="flex items-center gap-1 w-full">
        <span className="text-xs text-white font-medium whitespace-nowrap">
          {provider.provider_name}
        </span>
        <div
          className={`px-1 py-0.5 rounded text-[10px] ml-auto font-medium border ${getTypeColor(provider.type)} leading-none`}
          style={{ minWidth: 0, paddingLeft: 4, paddingRight: 4 }}
        >
          {getTypeLabel(provider.type)}
        </div>
      </div>
    </a>
  );

  return (
    <div className={`space-y-3 ${className} w-fit`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-white">Where to Watch</h3>
        {sortedProviders.length > 4 && (
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
                  All Streaming Options
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {flatrateProviders.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-white/70">
                      <Monitor className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">Stream</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {flatrateProviders.map((provider) => (
                        <ProviderCard
                          key={provider.provider_id}
                          provider={provider}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {rentProviders.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-white/70">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">Rent</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {rentProviders.map((provider) => (
                        <ProviderCard
                          key={provider.provider_id}
                          provider={provider}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {buyProviders.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-white/70">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">Buy</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {buyProviders.map((provider) => (
                        <ProviderCard
                          key={provider.provider_id}
                          provider={provider}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* All providers in one horizontal line, grouped by type */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {/* Show up to 4 providers total, maintaining type grouping */}
        {sortedProviders.slice(0, 4).map((provider) => (
          <ProviderCard key={provider.provider_id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
