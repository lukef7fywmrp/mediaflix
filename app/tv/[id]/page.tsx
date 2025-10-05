import { notFound } from "next/navigation";
import api from "@/lib/tmdb";
import TVShowDetail from "@/components/TVShowDetail";
import getBaseUrl from "@/lib/getBaseUrl";
import streamingClient from "@/lib/streamingClient";
import { TVGetWatchProvidersResponse } from "tmdb-js-node";
import { StreamingOption } from "streaming-availability";

interface TVShowDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TVShowDetailPageProps) {
  const { id } = await params;
  const tvShowId = parseInt(id);

  if (isNaN(tvShowId)) {
    return {
      title: "TV Show Not Found",
    };
  }

  try {
    const tvShow = await api.v3.tv.getDetails(tvShowId);
    return {
      title: `${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()})`,
      description: tvShow.overview,
      openGraph: {
        title: `${tvShow.name} (${new Date(tvShow.first_air_date).getFullYear()})`,
        description: tvShow.overview,
        images: [
          {
            url: `https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path}`,
            width: 1280,
            height: 720,
            alt: tvShow.name,
          },
        ],
      },
    };
  } catch {
    return {
      title: "TV Show Not Found",
    };
  }
}

export default async function TVShowDetailPage({
  params,
}: TVShowDetailPageProps) {
  const { id } = await params;
  const tvShowId = parseInt(id);

  const tvShow = await api.v3.tv.getDetails(tvShowId, {
    append_to_response: [
      "content_ratings",
      "reviews",
      "credits",
      "similar",
      "recommendations",
    ],
  });

  if (!tvShow?.id) {
    notFound();
  }
  // const watchProviders = await api.v3.movies.getWatchProviders(movieId);
  const res = await fetch(`${getBaseUrl()}/api/geo`);

  const country = await res.text();

  console.log("country", country);
  const show = await streamingClient.showsApi
    .getShow({
      id: `tv/${tvShowId}`,
      country,
    })
    .catch(() => null);

  let providers: StreamingOption[] | TVGetWatchProvidersResponse = [];
  providers = Object.values(show?.streamingOptions ?? {}).flat();

  if (providers.length === 0) {
    providers = await api.v3.tv.getWatchProviders(tvShowId);
  }

  return <TVShowDetail tvShow={tvShow} watchProviders={providers} />;
}
