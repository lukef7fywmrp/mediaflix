"use client";

import { useRouter, useSearchParams } from "next/navigation";
import MediaTypeToggle from "./MediaTypeToggle";

export default function MediaTypeToggleWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = (searchParams.get("type") as "movies" | "tv") || "movies";

  const handleTypeChange = (type: "movies" | "tv") => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "movies") {
      params.delete("type"); // Default to movies when no type param
    } else {
      params.set("type", type);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <MediaTypeToggle activeType={currentType} onTypeChange={handleTypeChange} />
  );
}
