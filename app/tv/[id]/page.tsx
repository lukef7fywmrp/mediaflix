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

  if (isNaN(tvShowId)) {
    notFound();
  }

  try {
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

    let providers: StreamingOption[] | TVGetWatchProvidersResponse | null =
      null;

    try {
      const res = await fetch(`${getBaseUrl()}/api/geo`);
      const country = await res.text();

      const show = await streamingClient.showsApi
        .getShow({
          id: `tv/${tvShowId}`,
          country,
        })
        .catch(() => null);

      // Properly handle streamingOptions - it's an object with arrays as values
      if (show?.streamingOptions) {
        const streamingOptions = Object.values(show.streamingOptions);
        // Check if any of the values are arrays and flatten them
        const flattened = streamingOptions.flat();
        // Only set providers if we got a valid array with items
        if (Array.isArray(flattened) && flattened.length > 0) {
          providers = flattened;
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
        providers = await api.v3.tv.getWatchProviders(tvShowId);
      } catch (error) {
        console.error("Error fetching TMDB watch providers:", error);
        providers = null;
      }
    }

    return <TVShowDetail tvShow={tvShow} watchProviders={providers} />;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    notFound();
  }
}
