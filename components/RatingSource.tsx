import { Star } from "lucide-react";

interface RatingSourceProps {
  rating: number;
  source?: string;
  className?: string;
}

export default function RatingSource({
  rating,
  source = "TMDB",
  className = "",
}: RatingSourceProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
      <span
        className={`text-xs ml-1 font-medium ${className.includes("text-") ? "text-white/70" : "text-muted-foreground/80"}`}
      >
        via {source}
      </span>
    </div>
  );
}
