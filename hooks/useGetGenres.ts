import apiClient from "@/lib/tmdbClient";
import { useQuery } from "@tanstack/react-query";
import { GenresGetMovieListGenre, GenresGetTVListGenre } from "tmdb-js-web";

function useGetGenres() {
  return useQuery<{
    movieGenres: GenresGetMovieListGenre[];
    tvGenres: GenresGetTVListGenre[];
  }>({
    queryKey: ["genres"],
    queryFn: async () => {
      // Fetch movie and TV genres in parallel
      const [movieGenresRes, tvGenresRes] = await Promise.all([
        apiClient.v3.genres.getMovieList(),
        apiClient.v3.genres.getTVList(),
      ]);

      const movieGenres = movieGenresRes.genres || [];
      const tvGenres = tvGenresRes.genres || [];

      return {
        movieGenres,
        tvGenres,
      };
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - genres don't change often
  });
}

export default useGetGenres;
