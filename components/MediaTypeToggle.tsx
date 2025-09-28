"use client";

import { Film, Tv } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaTypeToggleProps {
  activeType: "movies" | "tv";
  onTypeChange: (type: "movies" | "tv") => void;
}

export default function MediaTypeToggle({
  activeType,
  onTypeChange,
}: MediaTypeToggleProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <Tabs
        value={activeType}
        onValueChange={(val) => {
          if (val === "movies" || val === "tv") onTypeChange(val);
        }}
      >
        <TabsList className="bg-muted/50 border border-border/50 rounded-lg p-1">
          <TabsTrigger
            value="movies"
            className="flex items-center gap-2"
            aria-label="Show Movies"
          >
            <Film className="h-4 w-4" />
            Movies
          </TabsTrigger>
          <TabsTrigger
            value="tv"
            className="flex items-center gap-2"
            aria-label="Show TV Shows"
          >
            <Tv className="h-4 w-4" />
            TV Shows
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
