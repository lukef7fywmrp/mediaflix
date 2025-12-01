"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ExpandableOverviewProps {
  overview: string;
  className?: string;
  textClassName?: string;
  buttonClassName?: string;
  maxLines?: number;
  title?: string;
}

export default function ExpandableOverview({
  overview,
  className = "",
  textClassName = "",
  buttonClassName = "",
  maxLines = 3,
  title = "Overview",
}: ExpandableOverviewProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Function to check if truncation is needed
  const checkTruncation = useCallback(() => {
    if (!textRef.current || !overview) return;

    // Temporarily remove line-clamp to measure full height
    const element = textRef.current;
    const originalStyles = {
      display: element.style.display,
      WebkitLineClamp: element.style.webkitLineClamp,
      WebkitBoxOrient: element.style.webkitBoxOrient,
      overflow: element.style.overflow,
    };

    // Remove truncation styles to measure full content
    element.style.display = "block";
    element.style.webkitLineClamp = "unset";
    element.style.webkitBoxOrient = "unset";
    element.style.overflow = "visible";

    const fullHeight = element.scrollHeight;

    // Restore original styles
    Object.assign(element.style, originalStyles);

    // Calculate if truncation is needed
    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const fontSize = parseFloat(computedStyle.fontSize);
    const actualLineHeight = Number.isNaN(lineHeight)
      ? fontSize * 1.2
      : lineHeight;
    const maxHeight = actualLineHeight * maxLines;

    setIsTruncated(fullHeight > maxHeight);
  }, [overview, maxLines]);

  // Check truncation on mount and when dependencies change
  useEffect(() => {
    checkTruncation();
  }, [checkTruncation]);

  // Add resize listener for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      checkTruncation();
    };

    window.addEventListener("resize", handleResize);

    // Also check when the component becomes visible (handles orientation changes)
    const observer = new ResizeObserver(() => {
      checkTruncation();
    });

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [checkTruncation]);

  if (!overview) {
    return null;
  }

  return (
    <div className={className}>
      <p
        ref={textRef}
        className={textClassName}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {overview}
      </p>

      {/* Only show button if text is actually truncated */}
      {isTruncated && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-white/70 hover:text-white hover:bg-white/10 h-6 font-normal transition-colors -ml-2 text-xs",
                buttonClassName,
              )}
            >
              Read more
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{title}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
              {overview}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
