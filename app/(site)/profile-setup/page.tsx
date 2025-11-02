"use client";

import ProfileSetup from "@/components/ProfileSetup";
import { Authenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react";

function ProfileSetupPage() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLoading>
      <Authenticated>
        <ProfileSetup />
      </Authenticated>
    </>
  );
}

export default ProfileSetupPage;
