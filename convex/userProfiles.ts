import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get user profile by Clerk user ID
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
      .first();
  },
});

// Check if user profile exists by userId (for middleware use)
export const checkUserProfileExists = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    return !!profile;
  },
});

// Create or update user profile
export const upsertUserProfile = mutation({
  args: {
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    birthDate: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
      .first();

    const now = Date.now();

    if (existingProfile) {
      // Update existing profile - only patch fields that are explicitly provided
      const updateData: any = {
        updatedAt: now,
      };

      // Only include fields that are explicitly provided (not undefined)
      if (args.username !== undefined) updateData.username = args.username;
      if (args.avatarUrl !== undefined) updateData.avatarUrl = args.avatarUrl;
      if (args.firstName !== undefined) updateData.firstName = args.firstName;
      if (args.lastName !== undefined) updateData.lastName = args.lastName;
      if (args.birthDate !== undefined) updateData.birthDate = args.birthDate;
      if (args.country !== undefined) updateData.country = args.country;
      if (args.preferences !== undefined)
        updateData.preferences = args.preferences;
      if (args.isProfileComplete !== undefined) {
        updateData.isProfileComplete = args.isProfileComplete;
        updateData.profileSetupCompletedAt = args.isProfileComplete
          ? now
          : existingProfile.profileSetupCompletedAt;
      }

      await ctx.db.patch(existingProfile._id, updateData);
      return existingProfile._id;
    } else {
      // Create new profile
      return await ctx.db.insert("userProfiles", {
        userId: userId.subject,
        username: args.username,
        avatarUrl: args.avatarUrl,
        firstName: args.firstName,
        lastName: args.lastName,
        birthDate: args.birthDate,
        country: args.country,
        preferences: args.preferences,
        isProfileComplete: args.isProfileComplete,
        profileSetupCompletedAt: args.isProfileComplete ? now : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Check if username is available
export const isUsernameAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    // Username is available if no profile exists with this username
    // or if it's the current user's username
    return !existingProfile || existingProfile.userId === userId.subject;
  },
});

// Mark profile as complete
export const markProfileComplete = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, {
      isProfileComplete: true,
      profileSetupCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return profile._id;
  },
});

// Generate upload URL for avatar
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL from storage ID
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get avatar URL from storage ID
export const getAvatarUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the file URL from storage
    const fileUrl = await ctx.storage.getUrl(args.storageId);

    if (!fileUrl) {
      throw new Error("Failed to get file URL");
    }

    return fileUrl;
  },
});

// Update only username
export const updateUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
      .first();

    const now = Date.now();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        username: args.username,
        updatedAt: now,
      });
      return existingProfile._id;
    } else {
      // Create new profile with relevant info from Clerk
      return await ctx.db.insert("userProfiles", {
        userId: userId.subject,
        username: args.username,
        avatarUrl: userId.pictureUrl,
        isProfileComplete: false,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Update only avatar
export const updateAvatar = mutation({
  args: { avatarUrl: v.string() },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId.subject))
      .first();

    if (!existingProfile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(existingProfile._id, {
      avatarUrl: args.avatarUrl,
      updatedAt: Date.now(),
    });

    return existingProfile._id;
  },
});

// Generate a unique username based on user's name or email
export const generateUsername = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user info from Clerk
    const userInfo = await ctx.auth.getUserIdentity();
    if (!userInfo) {
      throw new Error("User not found");
    }

    // Try to generate username from name or email (lowercase only)
    let baseUsername = "";
    if (userInfo.name) {
      baseUsername = userInfo.name
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "")
        .substring(0, 15);
    } else if (userInfo.email) {
      baseUsername = userInfo.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "")
        .substring(0, 15);
    }

    if (!baseUsername) {
      baseUsername = "user";
    }

    // Check if base username is available
    let username = baseUsername;
    let counter = 1;

    while (true) {
      const existingProfile = await ctx.db
        .query("userProfiles")
        .withIndex("by_username", (q) => q.eq("username", username))
        .first();

      if (!existingProfile || existingProfile.userId === userId.subject) {
        break;
      }

      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  },
});
