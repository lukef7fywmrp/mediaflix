import { z } from "zod";

// Username validation schema - lowercase only
export const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(64, "Username must be no more than 64 characters")
  .regex(
    /^[a-z0-9_-]+$/,
    "Username can only contain lowercase letters, numbers, underscores, and hyphens",
  )
  .refine(
    (val) => !val.startsWith("-") && !val.endsWith("-"),
    "Username cannot start or end with a hyphen",
  )
  .refine(
    (val) => !val.startsWith("_") && !val.endsWith("_"),
    "Username cannot start or end with an underscore",
  );

// Name validation schema
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(50, "Name must be no more than 50 characters")
  .regex(
    /^[a-zA-Z0-9\s'-]+$/,
    "Name can only contain letters, numbers, spaces, hyphens, and apostrophes",
  );

// Birth date validation schema
export const birthDateSchema = z
  .string()
  .refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - parsedDate.getFullYear();
    const monthDiff = today.getMonth() - parsedDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < parsedDate.getDate())
    ) {
      return age - 1 >= 13; // Must be at least 13 years old
    }
    return age >= 13;
  }, "You must be at least 13 years old")
  .refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    return parsedDate <= today;
  }, "Birth date cannot be in the future");

// Bio validation schema
export const bioSchema = z
  .string()
  .max(500, "Bio must be no more than 500 characters")
  .optional();

// Country validation schema
export const countrySchema = z
  .string()
  .max(100, "Country must be no more than 100 characters")
  .optional();

// Profile preferences validation schema
export const preferencesSchema = z
  .object({
    favoriteGenres: z
      .object({
        movies: z.array(z.string()).optional(),
        tv: z.array(z.string()).optional(),
      })
      .optional(),
    language: z.string().optional(),
    notifications: z.boolean().optional(),
  })
  .optional();

// Complete profile validation schema
export const profileSchema = z.object({
  username: usernameSchema,
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  birthDate: birthDateSchema.optional(),
  bio: bioSchema,
  country: countrySchema,
  preferences: preferencesSchema,
});

// Type for validated username
export type UsernameInput = z.infer<typeof usernameSchema>;

// Type for validated profile
export type ProfileInput = z.infer<typeof profileSchema>;
