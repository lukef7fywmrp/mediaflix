"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ConditionalTooltipProps {
  children: React.ReactNode;
  name: string;
  character: string;
}

export default function ConditionalTooltip({
  children,
  name,
  character,
}: ConditionalTooltipProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkTruncation = useCallback(() => {
    if (!containerRef.current) return;

    const nameElement = containerRef.current.querySelector(
      "[data-name]",
    ) as HTMLElement | null;
    const characterElement = containerRef.current.querySelector(
      "[data-character]",
    ) as HTMLElement | null;

    const isElTruncated = (el: HTMLElement | null) => {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const lineClamp = Number(style.webkitLineClamp) || 0;
      const truncByWidth = el.scrollWidth > el.clientWidth + 1;
      const truncByHeight =
        lineClamp > 0 ? el.scrollHeight > el.clientHeight + 1 : false;
      return truncByWidth || truncByHeight;
    };

    const isNameTruncated = isElTruncated(nameElement);
    const isCharacterTruncated = isElTruncated(characterElement);
    setIsTruncated(isNameTruncated || isCharacterTruncated);
  }, []);

  useEffect(() => {
    checkTruncation();

    const resizeObserver = new ResizeObserver(checkTruncation);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [checkTruncation]);

  // Handler to control tooltip open state - only allow opening if truncated
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && !isTruncated) {
        // Don't allow opening if not truncated
        return;
      }
      setIsOpen(open);
    },
    [isTruncated],
  );

  // Always render the same DOM structure to prevent unmounting/remounting children
  // which causes images to reload and flicker
  return (
    <div ref={containerRef}>
      <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">as {character}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
