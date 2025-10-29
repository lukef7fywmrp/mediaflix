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
        favoriteGenres: v.optional(v.array(v.string())),
        language: v.optional(v.string()),
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
});
