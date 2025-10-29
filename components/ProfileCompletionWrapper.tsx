"use client";

import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

interface ProfileCompletionWrapperProps {
  children: React.ReactNode;
}

export function ProfileCompletionWrapper({
  children,
}: ProfileCompletionWrapperProps) {
  const { isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
