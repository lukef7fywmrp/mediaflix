"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface AnnouncementBannerProps {
  id: string; // Unique ID for localStorage persistence
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function AnnouncementBanner({
  id,
  message,
  actionLabel,
  onAction,
  icon,
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const storageKey = `mediaflix-announcement-${id}`;

  useEffect(() => {
    // Check if user has already dismissed this announcement
    const wasDismissed = localStorage.getItem(storageKey);
    if (!wasDismissed) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsExiting(true);
    localStorage.setItem(storageKey, "true");
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleAction = () => {
    onAction?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`w-full bg-background border-b transition-all duration-300 ${
        isExiting
          ? "animate-out slide-out-to-top fade-out"
          : "animate-in slide-in-from-top fade-in"
      }`}
    >
      {/* Desktop layout */}
      <div className="container mx-auto max-w-5xl px-4 h-[49px] hidden sm:flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-sm">
          {icon || <Sparkles className="h-4 w-4 shrink-0 text-primary" />}
          <span>{message}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {actionLabel && onAction && (
            <Button
              variant="default"
              size="sm"
              className="h-7 px-3 text-xs font-medium"
              onClick={handleAction}
            >
              {actionLabel}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-muted"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="container mx-auto px-4 py-3 sm:hidden">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[13px] flex-1">{message}</span>
          <button
            onClick={handleDismiss}
            className="p-1 -mr-1 -mt-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        {actionLabel && onAction && (
          <div className="mt-2.5">
            <Button
              variant="default"
              size="sm"
              className="h-7 px-3 text-xs font-medium"
              onClick={handleAction}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
