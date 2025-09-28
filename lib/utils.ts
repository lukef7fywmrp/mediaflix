import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPosterUrl = (posterPath: string | null) => {
  if (!posterPath) return "/placeholder-tv.jpg";
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};
