"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="mb-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}

export default BackButton;
