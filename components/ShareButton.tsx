"use client";

import { Share } from "lucide-react";
import { Button } from "./ui/button";

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function ShareButton({
  title,
  url,
  className,
  variant = "outline",
  size = "default",
}: ShareButtonProps) {
  const handleShare = () => {
    // Convert relative URL to absolute URL
    const absoluteUrl = url.startsWith("/")
      ? `${window.location.origin}${url}`
      : url;

    // Check if Web Share API is available
    if (navigator.share) {
      // Optimistic: immediately open share dialog
      navigator
        .share({
          title,
          url: absoluteUrl,
        })
        .catch((error) => {
          // Only handle actual errors, not user cancellation
          if (error.name !== "AbortError") {
            console.error("Error sharing:", error);

            // Fallback: try to copy to clipboard if share fails
            try {
              navigator.clipboard.writeText(absoluteUrl);
              console.log("Link copied to clipboard!");
            } catch (clipboardError) {
              console.error("Error copying to clipboard:", clipboardError);
            }
          }
          // If it's an AbortError (user cancelled), do nothing
        });
    } else {
      // Fallback: copy to clipboard immediately
      navigator.clipboard
        .writeText(absoluteUrl)
        .then(() => {
          console.log("Link copied to clipboard!");
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
    >
      <Share className="h-4 w-4" />
      Share
    </Button>
  );
}
