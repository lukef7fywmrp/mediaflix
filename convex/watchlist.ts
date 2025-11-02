import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

/**
 * Toggle a movie or TV show in the user's watchlist (add if not present, remove if present)
 */
export const toggleWatchlist = mutation({
  args: {
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    mediaId: v.number(),
    title: v.string(),
    posterPath: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    overview: v.optional(v.string()),
    voteAverage: v.optional(v.number()),
    voteCount: v.optional(v.number()),
    userId: v.string(),
  },
  returns: v.boolean(), // Returns true if now in watchlist, false if removed
  handler: async (ctx, args) => {
    if (!args.userId) {
      throw new Error("User ID is required");
    }

    // Check if item is already in watchlist
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_and_media", (q) =>
        q
          .eq("userId", args.userId)
          .eq("mediaType", args.mediaType)
          .eq("mediaId", args.mediaId),
      )
      .first();

    if (existing) {
      // Already in watchlist, remove it
      await ctx.db.delete(existing._id);
      return false;
    }

    // Not in watchlist, add it
    await ctx.db.insert("watchlist", {
      userId: args.userId,
      mediaType: args.mediaType,
      mediaId: args.mediaId,
      title: args.title,
      posterPath: args.posterPath,
      releaseDate: args.releaseDate,
      overview: args.overview,
      voteAverage: args.voteAverage,
      voteCount: args.voteCount,
      addedAt: Date.now(),
    });
    return true;
  },
});

/**
 * Check if a movie or TV show is in the user's watchlist
 */
export const isInWatchlist = query({
  args: {
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    mediaId: v.number(),
    userId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    if (!args.userId) {
      throw new Error("User ID is required");
    }

    const item = await ctx.db
      .query("watchlist")
      .withIndex("by_user_and_media", (q) =>
        q
          .eq("userId", args.userId)
          .eq("mediaType", args.mediaType)
          .eq("mediaId", args.mediaId),
      )
      .first();

    return !!item;
  },
});

/**
 * Get the user's watchlist with pagination, search, and filtering
 */
export const getWatchlist = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("movie"), v.literal("tv"))),
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id("watchlist"),
        _creationTime: v.number(),
        userId: v.string(),
        mediaType: v.union(v.literal("movie"), v.literal("tv")),
        mediaId: v.number(),
        title: v.string(),
        posterPath: v.optional(v.string()),
        releaseDate: v.optional(v.string()),
        overview: v.optional(v.string()),
        voteAverage: v.optional(v.number()),
        voteCount: v.optional(v.number()),
        addedAt: v.number(),
      }),
    ),
    isDone: v.boolean(),
    continueCursor: v.string(),
    pageStatus: v.optional(v.union(v.string(), v.null())),
    splitCursor: v.optional(v.union(v.string(), v.null())),
  }),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Base query
    let query = ctx.db
      .query("watchlist")
      .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
      .order("desc");

    // If we have search or filter, we need to collect, filter, and paginate manually
    if (args.searchQuery || args.mediaType) {
      const allItems = await query.collect();

      // Apply filters
      let filteredItems = allItems;

      // Filter by media type
      if (args.mediaType) {
        filteredItems = filteredItems.filter(
          (item) => item.mediaType === args.mediaType,
        );
      }

      // Filter by search query
      if (args.searchQuery) {
        const searchLower = args.searchQuery.toLowerCase().trim();
        filteredItems = filteredItems.filter((item) =>
          item.title.toLowerCase().includes(searchLower),
        );
      }

      // Manual pagination
      const { numItems, cursor } = args.paginationOpts;
      const startIndex = cursor ? parseInt(cursor, 10) : 0;
      const endIndex = startIndex + numItems;
      const page = filteredItems.slice(startIndex, endIndex);
      const isDone = endIndex >= filteredItems.length;
      const continueCursor = isDone ? "" : endIndex.toString();

      const result = {
        page,
        isDone,
        continueCursor,
        pageStatus: null,
        splitCursor: null,
      };

      return result;
    }

    // No filters - use standard pagination
    const result = await query.paginate(args.paginationOpts);

    return result;
  },
});

/**
 * Get counts for all, movies, and TV shows in the user's watchlist
 * Returns both filtered (if search query provided) and total (unfiltered) counts
 */
export const getWatchlistCounts = query({
  args: {
    searchQuery: v.optional(v.string()),
    userId: v.string(),
  },
  returns: v.object({
    filtered: v.object({
      all: v.number(),
      movies: v.number(),
      tv: v.number(),
    }),
    total: v.object({
      all: v.number(),
      movies: v.number(),
      tv: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    if (!args.userId) {
      throw new Error("User ID is required");
    }

    const allItems = await ctx.db
      .query("watchlist")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    // Calculate total (unfiltered) counts
    const total = {
      all: allItems.length,
      movies: allItems.filter((item) => item.mediaType === "movie").length,
      tv: allItems.filter((item) => item.mediaType === "tv").length,
    };

    // Filter by search query if provided
    let filteredItems = allItems;
    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase().trim();
      filteredItems = filteredItems.filter((item) =>
        item.title.toLowerCase().includes(searchLower),
      );
    }

    // Calculate filtered counts
    const filtered = {
      all: filteredItems.length,
      movies: filteredItems.filter((item) => item.mediaType === "movie").length,
      tv: filteredItems.filter((item) => item.mediaType === "tv").length,
    };

    return {
      filtered,
      total,
    };
  },
});

/**
 * Clear the entire watchlist for the current user
 */
export const clearWatchlist = mutation({
  args: {},
  returns: v.number(), // Returns the number of items deleted
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const items = await ctx.db
      .query("watchlist")
      .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
      .collect();

    // Delete all items
    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    return items.length;
  },
});
