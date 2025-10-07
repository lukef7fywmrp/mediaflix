import MovieDetail from "@/components/MovieDetail";
import getCountry from "@/lib/getCountry";
import api from "@/lib/tmdb";
import { notFound } from "next/navigation";
import { MoviesGetWatchProvidersResults } from "tmdb-js-node";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    return {
      title: "Movie Not Found",
    };
  }

  try {
    const movie = await api.v3.movies.getDetails(movieId);
    return {
      title: `${movie.title} (${new Date(movie.release_date).getFullYear()})`,
      description: movie.overview,
      openGraph: {
        title: `${movie.title} (${new Date(movie.release_date).getFullYear()})`,
        description: movie.overview,
        images: [
          {
            url: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
            width: 1280,
            height: 720,
            alt: movie.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Movie Not Found",
    };
  }
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    notFound();
  }

  try {
    const movie = await api.v3.movies.getDetails(movieId, {
      append_to_response: ["credits", "similar", "recommendations"],
    });

    if (!movie?.id) {
      notFound();
    }

    const country = await getCountry();

    const providersRes = await api.v3.movies.getWatchProviders(movieId);

    // Try to get providers for user's country, fallback to US, then first available
    let providers =
      providersRes.results[country as keyof MoviesGetWatchProvidersResults];

    if (!providers && country !== "US") {
      providers = providersRes.results.US;
    }

    if (!providers && providersRes.results) {
      const availableCountries = Object.keys(
        providersRes.results,
      ) as (keyof MoviesGetWatchProvidersResults)[];
      if (availableCountries.length > 0) {
        providers = providersRes.results[availableCountries[0]];
      }
    }

    return (
      <MovieDetail movie={movie} watchProviders={providers} country={country} />
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notFound();
  }
}
