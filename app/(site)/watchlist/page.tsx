"use client";

import ClearWatchlistDialog from "@/components/ClearWatchlistDialog";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import WatchlistItemCard from "@/components/WatchlistItemCard";
import { api } from "@/convex/_generated/api";
import { Authenticated, usePaginatedQuery, useQuery } from "convex/react";
import { Bookmark, Film, Grid3x3, Loader2, Search, Tv, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDebounce } from "@/hooks/useDebounce";

type FilterType = "all" | "movie" | "tv";

export default function WatchlistPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    results: watchlist,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.watchlist.getWatchlist,
    {
      searchQuery:
        debouncedSearchQuery.trim() !== ""
          ? debouncedSearchQuery.trim()
          : undefined,
      mediaType: filter !== "all" ? filter : undefined,
    },
    { initialNumItems: 20 },
  );

  // Get counts (returns both filtered and total counts in one query)
  const countsData = useQuery(
    api.watchlist.getWatchlistCounts,
    debouncedSearchQuery.trim() !== ""
      ? { searchQuery: debouncedSearchQuery.trim() }
      : {},
  );

  // Ref to store the last successfully loaded counts data
  const lastSuccessfulCountsDataRef = useRef<
    | {
        filtered: { all: number; movies: number; tv: number };
        total: { all: number; movies: number; tv: number };
      }
    | undefined
  >(undefined);

  // Update the ref whenever countsData is successfully loaded
  useEffect(() => {
    if (countsData) {
      lastSuccessfulCountsDataRef.current = countsData;
    }
  }, [countsData]);

  // Use the current countsData if available, otherwise use the last successful data from the ref
  const currentCountsData = countsData ??
    lastSuccessfulCountsDataRef.current ?? {
      filtered: { all: 0, movies: 0, tv: 0 },
      total: { all: 0, movies: 0, tv: 0 },
    };

  const counts = currentCountsData.filtered;
  const unfilteredCounts = currentCountsData.total;

  // Keep previous results visible during query transitions
  const previousResultsRef = useRef<typeof watchlist>(undefined);
  const unfilteredWatchlistRef = useRef<typeof watchlist>(undefined);
  const isInitialLoad = useRef(true);
  const lastQueryRef = useRef<string>("");
  const lastFilterRef = useRef<FilterType>("all");

  useEffect(() => {
    if (watchlist !== undefined) {
      previousResultsRef.current = watchlist;
      // Track unfiltered watchlist (when no filters/search are active)
      if (filter === "all" && !debouncedSearchQuery.trim()) {
        unfilteredWatchlistRef.current = watchlist;
      }
      // Track that we've received results for this query
      lastQueryRef.current = debouncedSearchQuery;
      lastFilterRef.current = filter;
    }
    // Mark initial load as complete once we're no longer loading and have received data
    if (!isLoading && watchlist !== undefined) {
      isInitialLoad.current = false;
    }
  }, [watchlist, isLoading, filter, debouncedSearchQuery]);

  // Reset filter to "all" if current filter tab has 0 items
  useEffect(() => {
    if (filter === "movie" && counts.movies === 0) {
      setFilter("all");
    } else if (filter === "tv" && counts.tv === 0) {
      setFilter("all");
    }
  }, [filter, counts.movies, counts.tv]);

  // Use current results if available, otherwise use previous results
  const displayWatchlist =
    watchlist !== undefined ? watchlist : previousResultsRef.current;

  // Check if we're waiting for new search results
  // We're waiting if: query/filter changed OR we're actively loading new results
  const isWaitingForResults =
    debouncedSearchQuery !== lastQueryRef.current ||
    filter !== lastFilterRef.current ||
    (isLoading && watchlist === undefined);

  // Determine if watchlist is truly empty (not just filtered)
  // Use unfiltered counts to check if watchlist has items at all
  const hasAnyWatchlistItems = unfilteredCounts.all > 0;
  const hasActiveFilters =
    filter !== "all" || debouncedSearchQuery.trim() !== "";
  // Only show truly empty when we have confirmed empty results for current query and not waiting
  const isTrulyEmpty =
    !hasActiveFilters &&
    watchlist !== undefined &&
    watchlist.length === 0 &&
    !isLoading &&
    !isWaitingForResults;

  // Show loading skeleton only during initial load
  // Keep showing until query finishes AND we have data (or confirmed empty)
  // After initial load, never show skeleton (use previous results instead)
  const showLoadingSkeleton =
    isInitialLoad.current && (isLoading || watchlist === undefined);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-muted/20 h-full flex flex-col">
      <div className="container mx-auto px-4 py-8 md:py-20 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-8 px-3.5">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              My Watchlist
            </h1>

            {hasAnyWatchlistItems && <ClearWatchlistDialog />}
          </div>

          {(hasAnyWatchlistItems || showLoadingSkeleton) && (
            <Separator className="mb-6 opacity-0" />
          )}

          {/* Search Bar */}
          {showLoadingSkeleton ? (
            <div className="mb-6 max-w-lg">
              <Skeleton className="h-[46px] w-full rounded-2xl" />
            </div>
          ) : hasAnyWatchlistItems ? (
            <div className="mb-6 max-w-lg">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <Search className="h-5 w-5 text-muted-foreground/70 transition-colors group-focus-within:text-foreground/70" />
                </div>
                <input
                  type="text"
                  placeholder="Search your watchlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 text-sm rounded-2xl border border-border/40 bg-background/50 backdrop-blur-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 focus:bg-background/80 transition-all duration-300 hover:border-border/60 hover:bg-background/60 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* Filter Tabs */}
          {showLoadingSkeleton ? (
            <div className="flex items-center ">
              <Skeleton className="h-9 w-[356px] rounded-lg" />
            </div>
          ) : hasAnyWatchlistItems ? (
            <div className="flex items-center">
              <Tabs
                value={filter}
                onValueChange={(v) => setFilter(v as FilterType)}
              >
                <TabsList className="bg-muted/50 border border-border/50 rounded-lg p-1">
                  <TabsTrigger
                    value="all"
                    className="flex items-center gap-2 tabular-nums"
                    aria-label="Show All"
                  >
                    <Grid3x3 className="h-4 w-4" />
                    All ({counts.all})
                  </TabsTrigger>
                  {counts.movies > 0 && (
                    <TabsTrigger
                      value="movie"
                      className="flex items-center gap-2 tabular-nums"
                      aria-label="Show Movies"
                    >
                      <Film className="h-4 w-4" />
                      Movies ({counts.movies})
                    </TabsTrigger>
                  )}
                  {counts.tv > 0 && (
                    <TabsTrigger
                      value="tv"
                      className="flex items-center gap-2 tabular-nums"
                      aria-label="Show TV Shows"
                    >
                      <Tv className="h-4 w-4" />
                      TV Shows ({counts.tv})
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </div>
          ) : null}
        </div>

        {(hasAnyWatchlistItems || showLoadingSkeleton) && (
          <Separator className="mb-5 mx-3.5" />
        )}

        {/* Content area - always maintain structure to prevent layout shift */}
        <div className="min-h-[400px] h-full flex flex-col flex-1">
          {showLoadingSkeleton ? (
            <LoadingSkeleton className="p-3.5" />
          ) : isTrulyEmpty && watchlist !== undefined ? (
            <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 border border-border/50 mb-6">
                <Bookmark className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Your watchlist is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
                Start adding movies and TV shows to your watchlist by browsing
                our collection
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button asChild variant="outline" size="lg">
                  <Link href="/">
                    <Film className="h-4 w-4" />
                    Browse Movies
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/?type=tv">
                    <Tv className="h-4 w-4" />
                    Browse TV Shows
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Only show "No results found" when we have results for the current query and they're empty */}
              {watchlist !== undefined &&
              watchlist.length === 0 &&
              !isLoading &&
              !isWaitingForResults ? (
                <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 border border-border/50 mb-4">
                    {debouncedSearchQuery ? (
                      <Search className="h-8 w-8 text-muted-foreground opacity-50" />
                    ) : filter === "movie" ? (
                      <Film className="h-8 w-8 text-muted-foreground opacity-50" />
                    ) : (
                      <Tv className="h-8 w-8 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <h2 className="text-lg font-semibold mb-1">
                    {debouncedSearchQuery
                      ? "No results found"
                      : `No ${filter === "movie" ? "movies" : "TV shows"} in your watchlist`}
                  </h2>
                  <p className="text-muted-foreground mb-3 max-w-md mx-auto text-sm">
                    {debouncedSearchQuery
                      ? `No items match "${debouncedSearchQuery}". Try a different search term.`
                      : filter === "movie"
                        ? "Start adding movies to your watchlist"
                        : "Start adding TV shows to your watchlist"}
                  </p>
                  {debouncedSearchQuery ? (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </Button>
                  ) : (
                    <Button asChild variant="outline">
                      <Link href={filter === "movie" ? "/" : "/?type=tv"}>
                        Browse {filter === "movie" ? "Movies" : "TV Shows"}
                      </Link>
                    </Button>
                  )}
                </div>
              ) : displayWatchlist && displayWatchlist.length > 0 ? (
                <InfiniteScroll
                  dataLength={watchlist?.length ?? 0}
                  next={() => loadMore(20)}
                  hasMore={status === "CanLoadMore"}
                  loader={
                    <div className="flex justify-center py-8">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
                        <p className="text-sm text-muted-foreground">
                          Loading more...
                        </p>
                      </div>
                    </div>
                  }
                  scrollThreshold={0.8}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-3.5">
                    {(displayWatchlist ?? []).map((item) => (
                      <WatchlistItemCard key={item._id} item={item} />
                    ))}
                  </div>
                  {watchlist === undefined &&
                    displayWatchlist !== undefined && (
                      <div className="flex justify-center py-4">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/60" />
                          <p className="text-xs text-muted-foreground">
                            Updating results...
                          </p>
                        </div>
                      </div>
                    )}
                </InfiniteScroll>
              ) : (
                // Maintain grid structure during transitions to prevent layout shift
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-3.5">
                  {previousResultsRef.current &&
                  previousResultsRef.current.length > 0
                    ? // Show previous results while loading new ones
                      previousResultsRef.current.map((item) => (
                        <WatchlistItemCard key={item._id} item={item} />
                      ))
                    : // Show skeleton placeholders if no previous results
                      Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[2/3] rounded-lg bg-muted/50 animate-pulse"
                        />
                      ))}
                  {/* Show loading indicator during transition */}
                  <div className="col-span-full flex justify-center py-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/60" />
                      <p className="text-xs text-muted-foreground">
                        {isWaitingForResults ? "Searching..." : "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
