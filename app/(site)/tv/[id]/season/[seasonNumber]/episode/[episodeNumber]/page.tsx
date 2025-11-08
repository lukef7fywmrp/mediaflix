import EpisodeDetail from "@/components/EpisodeDetail";
import api from "@/lib/tmdb";
import getCountry from "@/lib/getCountry";
import { notFound } from "next/navigation";
import { TVGetWatchProvidersResults } from "tmdb-js-node";

interface EpisodeDetailPageProps {
  params: Promise<{
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  }>;
}

export async function generateMetadata({ params }: EpisodeDetailPageProps) {
  const { id, seasonNumber, episodeNumber } = await params;
  const tvShowId = parseInt(id);
  const seasonNum = parseInt(seasonNumber);
  const episodeNum = parseInt(episodeNumber);

  if (isNaN(tvShowId) || isNaN(seasonNum) || isNaN(episodeNum)) {
    return {
      title: "Episode Not Found",
    };
  }

  try {
    const [tvShow, season] = await Promise.all([
      api.v3.tv.getDetails(tvShowId),
      api.v3.tvSeasons.getDetails(tvShowId, seasonNum),
    ]);

    const episode = season.episodes?.find(
      (ep) => ep.episode_number === episodeNum,
    );

    if (!episode) {
      return {
        title: "Episode Not Found",
      };
    }

    return {
      title: `${episode.name} - ${tvShow.name} Season ${seasonNum}`,
      description:
        episode.overview ||
        `Episode ${episodeNum} of ${tvShow.name} Season ${seasonNum}`,
      openGraph: {
        title: `${episode.name} - ${tvShow.name} Season ${seasonNum}`,
        description:
          episode.overview ||
          `Episode ${episodeNum} of ${tvShow.name} Season ${seasonNum}`,
        images: episode.still_path
          ? [
              {
                url: `https://image.tmdb.org/t/p/w1280${episode.still_path}`,
                width: 1280,
                height: 720,
                alt: episode.name,
              },
            ]
          : [],
      },
    };
  } catch {
    return {
      title: "Episode Not Found",
    };
  }
}

export default async function EpisodeDetailPage({
  params,
}: EpisodeDetailPageProps) {
  const { id, seasonNumber, episodeNumber } = await params;
  const tvShowId = parseInt(id);
  const seasonNum = parseInt(seasonNumber);
  const episodeNum = parseInt(episodeNumber);

  if (isNaN(tvShowId) || isNaN(seasonNum) || isNaN(episodeNum)) {
    notFound();
  }

  try {
    const [tvEpisodesResponse, tvShowDetails, seasonDetails, providersRes] =
      await Promise.all([
        api.v3.tvEpisodes.getDetails(tvShowId, seasonNum, episodeNum, {
          append_to_response: ["videos", "credits"],
        }),
        api.v3.tv.getDetails(tvShowId),
        api.v3.tvSeasons.getDetails(tvShowId, seasonNum),
        api.v3.tv.getWatchProviders(tvShowId),
      ]);

    if (!tvEpisodesResponse?.id) {
      notFound();
    }

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
      <EpisodeDetail
        tvShowId={tvShowId}
        seasonNumber={seasonNum}
        tvShowName={tvShowDetails.name}
        seasonName={seasonDetails.name ?? `Season ${seasonNum}`}
        episode={tvEpisodesResponse}
        watchProviders={providers}
        country={providerCountry}
      />
    );
  } catch {
    notFound();
  }
}
