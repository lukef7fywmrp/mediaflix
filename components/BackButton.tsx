"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="mb-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}

export default BackButton;
