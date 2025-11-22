import TVShowCard from "@/components/TVShowCard";
import useGetPopular from "@/hooks/tv/useGetPopular";
import LoadingSkeleton from "./LoadingSkeleton";
import NetworkWarning from "./NetworkWarning";

export default function TopTVShows() {
  const { data, isLoading, error } = useGetPopular();

  if (isLoading) {
    return (
      <>
        <NetworkWarning isLoading={isLoading} loadingDuration={5000} />
        <LoadingSkeleton />
      </>
    );
  }
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data?.results.map((tvShow, index) => (
        <TVShowCard key={tvShow.id} tvShow={tvShow} rank={index + 1} />
      ))}
    </div>
  );
}
