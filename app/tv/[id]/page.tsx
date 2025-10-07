import TVShowDetail from "@/components/TVShowDetail";
import getCountry from "@/lib/getCountry";
import api from "@/lib/tmdb";
import { notFound } from "next/navigation";
import { TVGetWatchProvidersResults } from "tmdb-js-node";

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

    const userCountry = await getCountry();

    const providersRes = await api.v3.tv.getWatchProviders(tvShowId);

    // Try to get providers for user's country, fallback to US, then first available
    let providers =
      providersRes.results[userCountry as keyof TVGetWatchProvidersResults];
    let providerCountry: string = userCountry;

    if (!providers && userCountry !== "US") {
      providers = providersRes.results.US;
      providerCountry = "US";
    }

    if (!providers && providersRes.results) {
      const availableCountries = Object.keys(
        providersRes.results,
      ) as (keyof TVGetWatchProvidersResults)[];
      if (availableCountries.length > 0) {
        const firstCountry =
          availableCountries[0] as keyof TVGetWatchProvidersResults;
        providers = providersRes.results[firstCountry];
        providerCountry = String(firstCountry);
      }
    }

    return (
      <TVShowDetail
        tvShow={tvShow}
        watchProviders={providers}
        country={providerCountry}
      />
    );
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    notFound();
  }
}
