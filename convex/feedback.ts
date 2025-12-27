import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Generate an upload URL for feedback attachments
 */
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Submit user feedback (works for both authenticated and anonymous users)
 */
export const submitFeedback = mutation({
  args: {
    type: v.union(v.literal("bug"), v.literal("feature"), v.literal("general")),
    message: v.optional(v.string()),
    rating: v.optional(v.number()), // Star rating 1-5 (optional - feature disabled for now)
    email: v.optional(v.string()),
    page: v.optional(v.string()),
    attachmentId: v.optional(v.id("_storage")),
  },
  returns: v.id("feedback"),
  handler: async (ctx, args) => {
    // Validate rating range if provided
    if (args.rating !== undefined && (args.rating < 1 || args.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Get user ID if authenticated
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    // Insert the feedback
    const feedbackId = await ctx.db.insert("feedback", {
      userId,
      email: args.email,
      type: args.type,
      message: args.message,
      rating: args.rating,
      page: args.page,
      attachmentId: args.attachmentId,
      createdAt: Date.now(),
    });

    return feedbackId;
  },
});
