import api from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export default async function TopMovies() {
  const movies = await api.v3.movies.getTopRated();
  const top10Movies = movies.results.slice(0, 10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {top10Movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} rank={index + 1} />
      ))}
    </div>
  );
}
