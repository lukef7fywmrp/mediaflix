import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Rank Badge Skeleton */}
      <div className="absolute top-3 left-3 z-10">
        <Skeleton className="h-6 w-8 bg-muted/50" />
      </div>

      {/* Poster Skeleton */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Skeleton className="h-full w-full bg-muted/50" />
      </div>

      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4 bg-muted/50" />
        <Skeleton className="h-4 w-1/2 bg-muted/50" />
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full bg-muted/50" />
          <Skeleton className="h-3 w-full bg-muted/50" />
          <Skeleton className="h-3 w-2/3 bg-muted/50" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <Skeleton className="h-4 w-12 bg-muted/50" />
        <Skeleton className="h-3 w-16 bg-muted/50" />
      </CardFooter>
    </Card>
  );
}
