import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import type { UserResource } from "@clerk/types";

function UserProfile({ user }: { user: UserResource }) {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  return (
    <div className="flex items-center justify-start gap-2 p-2">
      <div className="flex flex-col space-y-1 leading-none">
        <p className="text-sm font-medium">
          {userProfile?.username?.toLowerCase() ||
            user?.username?.toLowerCase() ||
            (user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName || "User")}
        </p>
        {user.emailAddresses?.[0]?.emailAddress && (
          <p className="w-[200px] truncate text-xs text-muted-foreground">
            {user.emailAddresses[0].emailAddress}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
