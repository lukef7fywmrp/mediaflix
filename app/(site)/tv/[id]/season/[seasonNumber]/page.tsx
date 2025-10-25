import SeasonDetail from "@/components/SeasonDetail";
import api from "@/lib/tmdb";
import getCountry from "@/lib/getCountry";
import { notFound } from "next/navigation";
import { TVGetWatchProvidersResults } from "tmdb-js-node";

interface SeasonDetailPageProps {
  params: Promise<{ id: string; seasonNumber: string }>;
}

export async function generateMetadata({ params }: SeasonDetailPageProps) {
  const { id, seasonNumber } = await params;
  const tvShowId = parseInt(id);
  const seasonNum = parseInt(seasonNumber);

  if (isNaN(tvShowId) || isNaN(seasonNum)) {
    return {
      title: "Season Not Found",
    };
  }

  try {
    const [tvShow, season] = await Promise.all([
      api.v3.tv.getDetails(tvShowId),
      api.v3.tvSeasons.getDetails(tvShowId, seasonNum, {
        append_to_response: ["videos", "credits"],
      }),
    ]);

    return {
      title: `${tvShow.name} - ${season.name}`,
      description: season.overview || `Season ${seasonNum} of ${tvShow.name}`,
      openGraph: {
        title: `${tvShow.name} - ${season.name}`,
        description: season.overview || `Season ${seasonNum} of ${tvShow.name}`,
        images: season.poster_path
          ? [
              {
                url: `https://image.tmdb.org/t/p/w1280${season.poster_path}`,
                width: 1280,
                height: 1920,
                alt: season.name,
              },
            ]
          : [],
      },
    };
  } catch {
    return {
      title: "Season Not Found",
    };
  }
}

export default async function SeasonDetailPage({
  params,
}: SeasonDetailPageProps) {
  const { id, seasonNumber } = await params;
  const tvShowId = parseInt(id);
  const seasonNum = parseInt(seasonNumber);

  if (isNaN(tvShowId) || isNaN(seasonNum)) {
    notFound();
  }

  try {
    const [tvShow, season, providersRes] = await Promise.all([
      api.v3.tv.getDetails(tvShowId),
      api.v3.tvSeasons.getDetails(tvShowId, seasonNum, {
        append_to_response: ["videos", "credits", "images"],
      }),
      api.v3.tv.getWatchProviders(tvShowId),
    ]);

    const userCountry = await getCountry();

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
      <SeasonDetail
        tvShow={tvShow}
        season={season}
        tvShowId={tvShowId}
        watchProviders={providers}
        country={providerCountry}
      />
    );
  } catch {
    notFound();
  }
}
