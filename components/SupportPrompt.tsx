"use client";

import { useEffect, useState } from "react";
import { Heart, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { useDonateDialog } from "./DonateDialogContext";

const STORAGE_KEY = "mediaflix-support-prompt-dismissed";
const DELAY_MS = 12000; // Show after 12 seconds on the site
const DISMISS_DELAY_MS = 3000; // Auto-close after 3 seconds when dismissed

export function SupportPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { openDialog } = useDonateDialog();

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const wasDismissed = localStorage.getItem(STORAGE_KEY);
    if (wasDismissed) return;

    // Show the prompt after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const closePrompt = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Match animation duration
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");

    // Auto-close after showing the message
    setTimeout(() => {
      closePrompt();
    }, DISMISS_DELAY_MS);
  };

  const handleSupport = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    closePrompt();
    openDialog();
  };

  const handleFooterClick = () => {
    document
      .getElementById("site-footer")
      ?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => closePrompt(), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      data-support-prompt
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 transition-all duration-300 ${
        isExiting
          ? "animate-out slide-out-to-bottom-5 fade-out"
          : "animate-in slide-in-from-bottom-5 fade-in"
      }`}
    >
      <div className="bg-background border rounded-lg shadow-lg p-4 max-w-sm mx-auto sm:mx-0 sm:ml-auto overflow-hidden">
        <div
          className={`transition-all duration-300 ${
            isDismissed ? "animate-in fade-in slide-in-from-right-5" : ""
          }`}
        >
          {isDismissed ? (
            // Dismissed state - show footer message
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 bg-muted rounded-full">
                <Check className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-[13px] text-muted-foreground">
                You can choose to support us anytime by visiting{" "}
                <button
                  onClick={handleFooterClick}
                  className="font-medium text-foreground hover:underline"
                >
                  Support Us
                </button>{" "}
                in the footer!
              </p>
            </div>
          ) : (
            // Initial state - show donate prompt
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Enjoying MediaFlix?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your support keeps us running ad-free.{" "}
                  <button
                    onClick={handleSupport}
                    className="text-primary hover:underline font-medium"
                  >
                    Click here to contribute!
                  </button>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1 flex-shrink-0"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
