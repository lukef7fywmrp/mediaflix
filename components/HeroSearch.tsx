"use client";

import {
  ChevronRight,
  Film,
  Loader2,
  Search,
  TrendingUp,
  Tv,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import useGetTrending from "@/hooks/useGetTrending";
import { useSearchMulti } from "@/hooks/useSearchMulti";
import { formatPopularity, getPosterUrl } from "@/lib/utils";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isHoveringResults, setIsHoveringResults] = useState(false);
  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use React Query infinite query for search with caching
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMulti(debouncedQuery);

  // Fetch trending data for suggested search terms
  const { data: trendingData, isLoading: isTrendingLoading } = useGetTrending();

  // Flatten all pages into a single array and deduplicate by unique key
  const results = useMemo(() => {
    if (!data?.pages) return [];

    const seen = new Set<string>();
    const deduplicatedResults = [];

    // Process pages in order to maintain pagination order
    for (const page of data.pages) {
      for (const result of page.results) {
        const uniqueKey = `${result.id}-${result.media_type}`;
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          deduplicatedResults.push(result);
        }
      }
    }

    return deduplicatedResults;
  }, [data]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show results when we have them and clear stale results
  useEffect(() => {
    if (query.trim() && debouncedQuery.trim() === query.trim()) {
      // Show dropdown when search is complete (debounced query caught up)
      // This includes both cases: with results and without results (for "No results found")
      setShowResults(true);
    } else if (!query.trim()) {
      setShowResults(false);
    } else if (query.trim() !== debouncedQuery.trim()) {
      // Hide results while user is still typing (debounced query hasn't caught up)
      setShowResults(false);
    }
  }, [query, debouncedQuery]);

  // Lock body scroll when hovering over search results
  useEffect(() => {
    if (showResults && isFocused && isHoveringResults) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      };
    }
  }, [showResults, isFocused, isHoveringResults]);

  // Track scroll state and reset when query changes
  useEffect(() => {
    setHasScrolled(false);
  }, []);

  // Reset hover state when results close
  useEffect(() => {
    if (!showResults) {
      setIsHoveringResults(false);
    }
  }, [showResults]);

  // Check if content overflows and listen for scroll events
  useEffect(() => {
    const scrollableDiv = scrollableRef.current;
    if (!scrollableDiv) return;

    // Check if there's overflow content
    const checkOverflow = () => {
      const hasOverflowContent =
        scrollableDiv.scrollHeight > scrollableDiv.clientHeight;
      setHasOverflow(hasOverflowContent);
    };

    // Check overflow initially and after results change
    checkOverflow();

    const handleScroll = () => {
      if (scrollableDiv.scrollTop > 0) {
        setHasScrolled(true);
      }
    };

    scrollableDiv.addEventListener("scroll", handleScroll);

    // Use ResizeObserver to detect content changes
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(scrollableDiv);

    return () => {
      scrollableDiv.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const handleResultClick = useCallback(
    (path: string) => {
      setIsFocused(false);
      setShowResults(false);
      setQuery("");
      router.push(path);
    },
    [router],
  );

  const handleSuggestedTermClick = useCallback((term: string) => {
    setQuery(term);
    setIsFocused(true);

    // Focus the input and position cursor at the end
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Position cursor at the end of the text using the term length
        inputRef.current.setSelectionRange(term.length, term.length);
      }
    }, 0);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    if (results.length > 0 && query.trim()) {
      setShowResults(true);
    }
  }, [results.length, query]);

  const hasResults = results.length > 0;
  const isTyping = query.trim() !== debouncedQuery.trim();

  // Get suggested terms from trending data - memoized to prevent unnecessary re-renders
  const suggestedTerms = useMemo(() => {
    if (!trendingData?.results) return [];

    return trendingData.results
      .filter((item) => {
        // Only include movies and TV shows, exclude people
        // Movies have 'title' and 'release_date', TV shows have 'name' and 'first_air_date'
        const isMovie = !!item.title && !!item.release_date;
        const isTV = !!item.name && !!item.first_air_date;
        return isMovie || isTV;
      })
      .slice(0, 6) // Show top 6 trending items
      .map((item, index) => {
        // Determine media type based on available fields
        const isMovie = !!item.title && !!item.release_date;
        const title = isMovie ? item.title : item.name;

        return {
          id: `${item.id}-${index}`, // Add unique ID for React keys
          title: title || "Unknown",
          mediaType: isMovie ? "movie" : "tv",
        };
      });
  }, [trendingData?.results]);

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
          <Search className="h-5 w-5 text-muted-foreground/70 transition-colors group-focus-within:text-foreground/70" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            startTransition(() => {
              setQuery(value);
            });
          }}
          onFocus={handleInputFocus}
          placeholder="Search for movies and TV shows..."
          className="w-full pl-12 pr-12 py-3 text-base sm:text-sm rounded-2xl border border-border/40 bg-background/50 backdrop-blur-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 focus:bg-background/80 transition-all duration-300 hover:border-border/60 hover:bg-background/60 shadow-sm"
        />
        {(isLoading || isPending) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <Loader2 className="h-4 w-4 text-foreground/60 animate-spin" />
          </div>
        )}
        {!isLoading && !isPending && query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setShowResults(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggested Search Terms - Only show when no search results */}
      <div className="mt-4 min-h-[50px]">
        {isTrendingLoading ? (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[70, 85, 75, 90, 80, 65].map((width) => (
              <div
                key={`skeleton-${width}`}
                className="h-6 bg-muted/60 rounded-full animate-pulse"
                style={{
                  width: `${width}px`,
                }}
              />
            ))}
          </div>
        ) : (
          suggestedTerms.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
                {suggestedTerms.map((term, index) => (
                  <Badge
                    key={term.id}
                    variant="secondary"
                    asChild
                    className="cursor-pointer transition-colors duration-150"
                    style={{
                      animation: `slideIn 0.15s ease-out ${index * 0.03}s both`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSuggestedTermClick(term.title)}
                      className="flex items-center gap-1"
                    >
                      {term.mediaType === "movie" ? (
                        <Film className="h-3 w-3" />
                      ) : (
                        <Tv className="h-3 w-3" />
                      )}
                      <span className="">{term.title}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && isFocused && (
        <section
          aria-label="Search results"
          className="absolute top-full left-0 right-0 z-40 animate-in fade-in slide-in-from-top-2 duration-300 -mt-[58px]"
          onMouseEnter={() => setIsHoveringResults(true)}
          onMouseLeave={() => setIsHoveringResults(false)}
        >
          <div className="rounded-2xl border border-border/40 bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden relative">
            <div
              ref={scrollableRef}
              id="searchScrollableDiv"
              className="max-h-[500px] overflow-y-auto"
            >
              {isLoading && !isFetchingNextPage && (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">Searching...</p>
                </div>
              )}

              {!isLoading && !isTyping && query && !hasResults && (
                <div className="py-10 text-center px-6">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
                    <Search className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    No results found for &quot;{query}&quot;
                  </p>
                </div>
              )}

              {/* Trending Suggestions in Results */}
              {hasResults && !isTyping && suggestedTerms.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Trending
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedTerms.map((term) => (
                      <Badge
                        key={`trending-${term.id}`}
                        variant="secondary"
                        asChild
                        className="cursor-pointer transition-colors duration-150 text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => handleSuggestedTermClick(term.title)}
                          className="flex items-center gap-1"
                        >
                          {term.mediaType === "movie" ? (
                            <Film className="h-2.5 w-2.5" />
                          ) : (
                            <Tv className="h-2.5 w-2.5" />
                          )}
                          <span className="">{term.title}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {hasResults && !isTyping && (
                <InfiniteScroll
                  dataLength={results.length}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  loader={
                    <div className="py-4 flex justify-center">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/60" />
                        <p className="text-xs text-muted-foreground">
                          Loading more...
                        </p>
                      </div>
                    </div>
                  }
                  scrollableTarget="searchScrollableDiv"
                >
                  <div className="p-2 space-y-0.5">
                    {results.map((result, index) => {
                      const isMovie = result.media_type === "movie";
                      const title = isMovie ? result.title : result.name;
                      const releaseDate = isMovie
                        ? result.release_date
                        : result.first_air_date;
                      const popularity = formatPopularity(result.popularity);
                      const path = isMovie
                        ? `/movie/${result.id}`
                        : `/tv/${result.id}`;

                      // Create truly unique key combining id, media_type, and index
                      const uniqueKey = `${result.id}-${result.media_type}-${index}`;

                      return (
                        <button
                          type="button"
                          key={uniqueKey}
                          onClick={() => handleResultClick(path)}
                          onMouseEnter={() => router.prefetch(path)}
                          className="w-full group relative"
                          style={
                            index < 10
                              ? {
                                  animation: `slideIn 0.15s ease-out ${index * 0.03}s both`,
                                }
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-muted/70">
                            {/* Poster */}
                            <div className="relative flex-shrink-0 w-20 h-[120px] rounded-xl overflow-hidden shadow-lg ring-1 ring-border/20 group-hover:ring-foreground/20 transition-all duration-200">
                              {result.poster_path ? (
                                <Image
                                  src={getPosterUrl(result.poster_path)}
                                  alt={title || "Poster"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/20">
                                  {isMovie ? (
                                    <Film className="h-7 w-7 text-muted-foreground/30" />
                                  ) : (
                                    <Tv className="h-7 w-7 text-muted-foreground/30" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-foreground transition-colors">
                                  {title}
                                </h4>
                                <span
                                  className={`flex-shrink-0 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded ${
                                    isMovie
                                      ? "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400"
                                      : "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400"
                                  }`}
                                >
                                  {isMovie ? "Movie" : "TV"}
                                </span>
                                {/* {result.adult && (
                                  <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-red-500/15 text-red-600 dark:bg-red-400/15 dark:text-red-400">
                                    18+
                                  </span>
                                )} */}
                              </div>
                              <div className="flex items-center gap-2.5 text-xs mb-1.5">
                                {releaseDate && (
                                  <span className="text-muted-foreground font-medium">
                                    {releaseDate.substring(0, 4)}
                                  </span>
                                )}
                                {!!result.vote_average &&
                                  result.vote_average > 0 && (
                                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                      <span className="text-[10px]">★</span>
                                      <span className="font-semibold text-[10px]">
                                        {result.vote_average.toFixed(1)}
                                      </span>
                                    </div>
                                  )}
                                {popularity.trim() !== "0%" && (
                                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <TrendingUp className="w-2.5 h-2.5" />
                                    <span className="text-[10px] font-semibold">
                                      {popularity}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {result.overview && (
                                <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
                                  {result.overview}
                                </p>
                              )}
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1">
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </InfiniteScroll>
              )}
            </div>

            {/* Bottom Fade - shows when there's scrollable content and user hasn't scrolled */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/60 via-background/30 to-transparent pointer-events-none transition-opacity duration-300 ${
                hasOverflow && !hasScrolled && hasResults
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
          </div>
        </section>
      )}
    </div>
  );
}
