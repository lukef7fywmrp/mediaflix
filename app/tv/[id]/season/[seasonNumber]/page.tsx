import SeasonDetail from "@/components/SeasonDetail";
import api from "@/lib/tmdb";
import { notFound } from "next/navigation";

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
        append_to_response: ["watch_providers", "videos", "credits"],
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
    const [tvShow, season] = await Promise.all([
      api.v3.tv.getDetails(tvShowId),
      api.v3.tvSeasons.getDetails(tvShowId, seasonNum, {
        append_to_response: ["watch_providers", "videos", "credits"],
      }),
    ]);

    return <SeasonDetail tvShow={tvShow} season={season} tvShowId={tvShowId} />;
  } catch {
    notFound();
  }
}
