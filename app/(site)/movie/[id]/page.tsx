import { notFound } from "next/navigation";
import type { MoviesGetWatchProvidersResults } from "tmdb-js-node";
import MovieDetail from "@/components/MovieDetail";
import getCountry from "@/lib/getCountry";
import api from "@/lib/tmdb";

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (Number.isNaN(movieId)) {
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
  const movieId = parseInt(id, 10);

  if (Number.isNaN(movieId)) {
    notFound();
  }

  try {
    const movie = await api.v3.movies.getDetails(movieId, {
      append_to_response: ["credits", "similar", "recommendations", "videos"],
    });

    if (!movie?.id) {
      notFound();
    }

    const userCountry = await getCountry();

    const providersRes = await api.v3.movies.getWatchProviders(movieId);

    // Try to get providers for user's country, fallback to US, then first available
    let providers =
      providersRes.results[userCountry as keyof MoviesGetWatchProvidersResults];
    let providerCountry: string = userCountry;

    if (!providers && userCountry !== "US") {
      providers = providersRes.results.US;
      providerCountry = "US";
    }

    if (!providers && providersRes.results) {
      const availableCountries = Object.keys(
        providersRes.results,
      ) as (keyof MoviesGetWatchProvidersResults)[];
      if (availableCountries.length > 0) {
        providers = providersRes.results[availableCountries[0]];
        providerCountry = String(availableCountries[0]);
      }
    }

    return (
      <MovieDetail
        movie={movie}
        watchProviders={providers}
        country={providerCountry}
      />
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notFound();
  }
}
