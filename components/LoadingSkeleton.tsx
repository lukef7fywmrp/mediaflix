import MovieCardSkeleton from "./MovieCardSkeleton";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
