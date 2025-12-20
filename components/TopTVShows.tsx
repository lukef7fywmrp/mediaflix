"use client";

import TVShowCard from "@/components/TVShowCard";
import useGetPopular from "@/hooks/tv/useGetPopular";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorDisplay from "./ErrorDisplay";

export default function TopTVShows() {
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
        title="Failed to load TV shows"
        description="We couldn't load the popular TV shows. Please try again."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data?.results.map((tvShow, index) => (
        <TVShowCard key={tvShow.id} tvShow={tvShow} rank={index + 1} />
      ))}
    </div>
  );
}
