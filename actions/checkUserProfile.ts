"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function checkUserProfile(userId: string): Promise<boolean> {
  try {
    const hasProfile = await convex.query(
      api.userProfiles.checkUserProfileExists,
      { userId },
    );
    return hasProfile;
  } catch (error) {
    console.error("Error checking user profile:", error);
    return false;
  }
}
