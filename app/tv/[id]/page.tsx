import { notFound } from "next/navigation";
import api from "@/lib/tmdb";
import TVShowDetail from "@/components/TVShowDetail";

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
    const [tvShow, credits, similarShows, recommendations] = await Promise.all([
      api.v3.tv.getDetails(tvShowId, {
        append_to_response: ["content_ratings", "reviews"],
      }),
      api.v3.tv.getCredits(tvShowId),
      api.v3.tv.getSimilarTVShows(tvShowId),
      api.v3.tv.getRecommendations(tvShowId),
    ]);

    console.log(tvShow);

    return (
      <TVShowDetail
        tvShow={tvShow}
        credits={credits}
        similarShows={similarShows.results}
        recommendations={recommendations.results}
      />
    );
  } catch {
    notFound();
  }
}
