import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";

export function useProfile() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const profile = useQuery(api.userProfiles.getUserProfile);
  const upsertProfile = useMutation(api.userProfiles.upsertUserProfile);
  const markComplete = useMutation(api.userProfiles.markProfileComplete);

  const updateProfile = async (data: {
    username?: string;
    avatarUrl?: string;
    isProfileComplete?: boolean;
  }) => {
    if (!user) throw new Error("User not authenticated");

    return await upsertProfile({
      username: data.username || undefined,
      avatarUrl: data.avatarUrl || undefined,
      isProfileComplete: data.isProfileComplete ?? false,
    });
  };

  const completeProfile = async () => {
    if (!user) throw new Error("User not authenticated");

    await upsertProfile({
      username: user.username || undefined,
      avatarUrl: user.imageUrl,
      isProfileComplete: true,
    });

    return await markComplete();
  };

  return {
    profile,
    updateProfile,
    completeProfile,
    isLoading: !isLoaded || profile === undefined,
    isProfileComplete: profile?.isProfileComplete ?? false,
  };
}
