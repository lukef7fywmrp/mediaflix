"use client";

import MovieCard from "@/components/MovieCard";
import useGetPopular from "@/hooks/movies/useGetPopular";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorDisplay from "./ErrorDisplay";

export default function TopMovies() {
  const { data, isLoading, error, refetch } = useGetPopular();

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <>
        {/* <NetworkWarning isLoading={isLoading} loadingDuration={5000} /> */}
        <LoadingSkeleton />
      </>
    );
  }
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={handleRetry}
        title="Failed to load movies"
        description="We couldn't load the popular movies. Please try again."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data?.results.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} rank={index + 1} />
      ))}
    </div>
  );
}
