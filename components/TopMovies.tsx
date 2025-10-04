import MovieCard from "@/components/MovieCard";
import useGetPopular from "@/hooks/movies/useGetPopular";
import LoadingSkeleton from "./LoadingSkeleton";

export default function TopMovies() {
  const { data, isLoading, error } = useGetPopular();

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data?.results.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} rank={index + 1} />
      ))}
    </div>
  );
}
