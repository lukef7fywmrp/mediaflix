"use client";

import useGetTrending from "@/hooks/useGetTrending";
import { getPosterUrl } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TrendingUp, Search, Star, Film, Tv, Radio, User } from "lucide-react";

interface MediaSlide {
  type: "media";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  vote_average: number;
}

type Slide = MediaSlide;

function AuthHeroSlideshow() {
  const { data: trendingData, isLoading } = useGetTrending();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter and prepare media items with backdrop images using same logic as HeroSearch
  const mediaItems =
    trendingData?.results
      ?.filter((item) => {
        // Only include movies and TV shows, exclude people
        // Movies have 'title' and 'release_date', TV shows have 'name' and 'first_air_date'
        const isMovie = !!item.title && !!item.release_date;
        const isTV = !!item.name && !!item.first_air_date;
        return (isMovie || isTV) && item.poster_path;
      })
      ?.slice(0, 6) || [];

  // Only use media items for slideshow
  const allSlides: Slide[] = mediaItems.map((item) => ({
    type: "media" as const,
    title: item.title,
    name: item.name,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
  }));

  // Reset currentIndex when allSlides length changes to prevent out-of-bounds access
  useEffect(() => {
    if (currentIndex >= allSlides.length) {
      setCurrentIndex(0);
    }
  }, [allSlides.length, currentIndex]);

  // Auto-advance slideshow
  useEffect(() => {
    if (allSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSlides.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [allSlides.length]);

  if (isLoading) {
    return (
      <div className="bg-muted relative h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95" />
      </div>
    );
  }

  if (allSlides.length === 0) {
    return (
      <div className="bg-muted relative h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95" />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-white mb-1 leading-tight text-shadow-lg">
              Welcome to MediaFlix
            </h2>
            <p className="text-base text-white/80 mb-6 text-shadow-lg">
              Your Ultimate Entertainment Discovery Platform
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Search className="h-5 w-5 text-background flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  Advanced Search
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <TrendingUp className="h-5 w-5 text-background flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  Top Rated Content
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Star className="h-5 w-5 text-background flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  Real-time Data
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Film className="h-5 w-5 text-background flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  Movie Details
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Tv className="h-5 w-5 text-background flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  TV Show Details
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <User className="h-5 w-5 text-white flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  Personalization
                </span>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                <Radio className="h-3.5 w-3.5 text-green-400 animate-pulse" />
                <span className="text-xs text-white font-medium drop-shadow-lg">
                  Live Data
                </span>
              </div>
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all duration-300 relative z-10 cursor-pointer"
              >
                <Star className="h-3.5 w-3.5 text-purple-400 fill-purple-400" />
                <span className="text-xs text-white font-medium drop-shadow-lg">
                  Powered by TMDB
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSlide = allSlides[currentIndex] || allSlides[0];

  return (
    <div className="relative h-full w-full overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getPosterUrl(currentSlide.poster_path, true)}
          alt={currentSlide.title || currentSlide.name || "Media"}
          fill
          className="object-cover transition-opacity duration-1000"
          priority={currentIndex === 0}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-slate-800/60" />
      </div>

      {/* Default Content - MediaFlix Features (always visible) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-1 leading-tight text-shadow-lg">
            Welcome to MediaFlix
          </h2>
          <p className="text-base text-white/80 mb-4 text-shadow-lg">
            Your Ultimate Entertainment Discovery Platform
          </p>

          {/* Features Grid - Slightly Bigger */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Search className="h-5 w-5 text-background flex-shrink-0" />
              <span className="text-white/90 text-sm font-medium">
                Advanced Search
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <TrendingUp className="h-5 w-5 text-background flex-shrink-0" />
              <span className="text-white/90 text-sm font-medium">
                Top Rated Content
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Star className="h-5 w-5 text-background flex-shrink-0" />
              <span className="text-white/90 text-sm font-medium">
                Real-time Data
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Film className="h-5 w-5 text-background flex-shrink-0" />
              <span className="text-white/90 text-sm font-medium">
                Movie Details
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Tv className="h-5 w-5 text-background flex-shrink-0" />
              <span className="text-white/90 text-sm font-medium">
                TV Show Details
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <User className="h-5 w-5 text-white flex-shrink-0" />
              <span className="text-white/90 text-sm font-medium">
                Personalization
              </span>
            </div>
          </div>

          {/* Status Indicators - Better Contrast */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
              <Radio className="h-3.5 w-3.5 text-green-400 animate-pulse" />
              <span className="text-xs text-white font-medium drop-shadow-lg">
                Live Data
              </span>
            </div>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all duration-300 relative z-10 cursor-pointer"
            >
              <Star className="h-3.5 w-3.5 text-purple-400 fill-purple-400" />
              <span className="text-xs text-white font-medium drop-shadow-lg">
                Powered by TMDB
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Hover Content - Movie/Show Details (appears on hover) */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out pointer-events-none">
        <div className="max-w-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="mb-2">
            <span className="inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {!!currentSlide.title && !!currentSlide.release_date
                ? "Movie"
                : "TV Show"}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
            {currentSlide.title || currentSlide.name || "Unknown"}
          </h2>

          <div className="flex items-center gap-4 text-white/90">
            {currentSlide.release_date && (
              <span className="text-lg">
                {currentSlide.release_date.split("-")[0]}
              </span>
            )}
            {currentSlide.first_air_date && (
              <span className="text-lg">
                {currentSlide.first_air_date.split("-")[0]}
              </span>
            )}
            <div className="flex items-center gap-1">
              <svg className="h-5 w-5 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-lg font-medium">
                {Math.round(currentSlide.vote_average * 10) / 10}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AuthHeroSlideshow;
