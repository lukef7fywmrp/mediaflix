import { Star } from "lucide-react";

interface RatingSourceProps {
  rating: number;
  source?: string;
}

export default function RatingSource({
  rating,
  source = "TMDB",
}: RatingSourceProps) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground/80 ml-1 font-medium">
        via {source}
      </span>
    </div>
  );
}
