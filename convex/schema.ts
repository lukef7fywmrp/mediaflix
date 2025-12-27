import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  // User profiles table for tracking personalization
  userProfiles: defineTable({
    userId: v.string(), // Clerk user ID
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    birthDate: v.optional(v.string()), // ISO date string
    country: v.optional(v.string()),
    preferences: v.optional(
      v.object({
        favoriteGenres: v.optional(
          v.object({
            movies: v.optional(v.array(v.string())),
            tv: v.optional(v.array(v.string())),
          }),
        ),
        language: v.optional(v.array(v.string())),
        notifications: v.optional(v.boolean()),
      }),
    ),
    isProfileComplete: v.boolean(),
    profileSetupCompletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_username", ["username"]),

  // Watchlist table for movies and TV shows
  watchlist: defineTable({
    userId: v.string(), // Clerk user ID
    mediaType: v.union(v.literal("movie"), v.literal("tv")), // Type of media
    mediaId: v.number(), // TMDB ID of the movie or TV show
    title: v.string(), // Media title
    posterPath: v.optional(v.string()), // Poster image path
    releaseDate: v.optional(v.string()), // Release or first air date
    overview: v.optional(v.string()), // Media overview/description
    voteAverage: v.optional(v.number()), // Average rating
    voteCount: v.optional(v.number()), // Number of votes
    addedAt: v.number(), // Timestamp when added to watchlist
  })
    .index("by_user_id", ["userId"])
    .index("by_user_and_media", ["userId", "mediaType", "mediaId"]),

  // Feedback table for user suggestions and bug reports
  feedback: defineTable({
    userId: v.optional(v.string()), // Clerk user ID (optional for anonymous feedback)
    email: v.optional(v.string()), // Contact email
    type: v.union(v.literal("bug"), v.literal("feature"), v.literal("general")),
    message: v.optional(v.string()), // Feedback content (optional)
    rating: v.optional(v.number()), // Star rating 1-5 (optional - feature disabled for now)
    page: v.optional(v.string()), // URL where feedback was submitted
    attachmentId: v.optional(v.id("_storage")), // Optional screenshot/attachment
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_created_at", ["createdAt"])
    .index("by_rating", ["rating"]),
});
