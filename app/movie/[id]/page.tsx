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

    let providers: StreamingOption[] | MoviesGetWatchProvidersResponse | null =
      null;

    try {
      const res = await fetch(`${getBaseUrl()}/api/geo`);
      const country = await res.text();

      const show = await streamingClient.showsApi
        .getShow({
          id: `movie/${movieId}`,
          country,
        })
        .catch(() => null);

      // Properly handle streamingOptions - get options for the specific country
      if (show?.streamingOptions && country) {
        const countryOptions = show.streamingOptions[country];
        // Validate that countryOptions is an array before using it
        if (Array.isArray(countryOptions) && countryOptions.length > 0) {
          providers = countryOptions;
        }
      }
    } catch (error) {
      console.error("Error fetching streaming data:", error);
    }

    // Check if we have valid streaming providers (array with length > 0)
    const hasStreamingProviders =
      Array.isArray(providers) && providers.length > 0;

    if (!hasStreamingProviders) {
      try {
        providers = await api.v3.movies.getWatchProviders(movieId);
      } catch (error) {
        console.error("Error fetching TMDB watch providers:", error);
        providers = null;
      }
    }

    return <MovieDetail movie={movie} watchProviders={providers} />;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notFound();
  }
}
