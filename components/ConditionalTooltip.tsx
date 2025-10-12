"use client";

import { useState, useRef, useEffect } from "react";
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
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!containerRef.current) return;

      const nameElement = containerRef.current.querySelector(
        "[data-name]",
      ) as HTMLElement;
      const characterElement = containerRef.current.querySelector(
        "[data-character]",
      ) as HTMLElement;

      if (nameElement && characterElement) {
        const isNameTruncated =
          nameElement.scrollWidth > nameElement.clientWidth;
        const isCharacterTruncated =
          characterElement.scrollWidth > characterElement.clientWidth;
        setShowTooltip(isNameTruncated || isCharacterTruncated);
      }
    };

    checkTruncation();

    const resizeObserver = new ResizeObserver(checkTruncation);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [name, character]);

  if (!showTooltip) {
    return <div ref={containerRef}>{children}</div>;
  }

  return (
    <div ref={containerRef}>
      <Tooltip>
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
