import MovieDetail from "@/components/MovieDetail";
import getBaseUrl from "@/lib/getBaseUrl";
import streamingClient from "@/lib/streamingClient";
import api from "@/lib/tmdb";
import { notFound } from "next/navigation";
import { StreamingOption } from "streaming-availability";
import { MoviesGetWatchProvidersResponse } from "tmdb-js-node";

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

  const movie = await api.v3.movies.getDetails(movieId, {
    append_to_response: ["credits", "similar", "recommendations"],
  });

  if (!movie?.id) {
    notFound();
  }
  // const watchProviders = await api.v3.movies.getWatchProviders(movieId);
  const res = await fetch(`${getBaseUrl()}/api/geo`);

  const country = await res.text();

  console.log("country", country);
  const show = await streamingClient.showsApi
    .getShow({
      id: `movie/${movieId}`,
      country,
    })
    .catch(() => null);

  let providers: StreamingOption[] | MoviesGetWatchProvidersResponse = [];
  providers = Object.values(show?.streamingOptions ?? {}).flat();

  if (providers.length === 0) {
    providers = await api.v3.movies.getWatchProviders(movieId);
  }

  return <MovieDetail movie={movie} watchProviders={providers} />;
}
