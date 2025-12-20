import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PersonDetail from "@/components/PersonDetail";
import api from "@/lib/tmdb";

interface PersonDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    from?: "movie" | "tv";
    mediaId?: string;
    mediaTitle?: string;
    seasonNumber?: string;
    seasonName?: string;
    episodeNumber?: string;
    episodeName?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PersonDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const personId = parseInt(id, 10);

  if (Number.isNaN(personId)) {
    return {
      title: "Person Not Found",
    };
  }

  try {
    const person = await api.v3.people.getDetails(personId);
    return {
      title: person.name,
      description: person.biography || `Filmography of ${person.name}`,
      openGraph: {
        title: person.name,
        description: person.biography || `Filmography of ${person.name}`,
        images: person.profile_path
          ? [
              {
                url: `https://image.tmdb.org/t/p/w1280${person.profile_path}`,
                width: 1280,
                height: 720,
                alt: person.name,
              },
            ]
          : [],
      },
    };
  } catch {
    return {
      title: "Person Not Found",
    };
  }
}

export default async function PersonDetailPage({
  params,
  searchParams,
}: PersonDetailPageProps) {
  const { id } = await params;
  const {
    from,
    mediaId,
    mediaTitle,
    seasonNumber,
    seasonName,
    episodeNumber,
    episodeName,
  } = await searchParams;
  const personId = parseInt(id, 10);

  if (Number.isNaN(personId)) {
    notFound();
  }

  // Build referrer info if coming from a movie or TV page
  const referrer =
    from && mediaId && mediaTitle
      ? {
          type: from,
          id: mediaId,
          title: decodeURIComponent(mediaTitle),
          seasonNumber: seasonNumber ? parseInt(seasonNumber, 10) : undefined,
          seasonName: seasonName ? decodeURIComponent(seasonName) : undefined,
          episodeNumber: episodeNumber
            ? parseInt(episodeNumber, 10)
            : undefined,
          episodeName: episodeName
            ? decodeURIComponent(episodeName)
            : undefined,
        }
      : null;

  try {
    const [person, movieCredits, tvCredits] = await Promise.all([
      api.v3.people.getDetails(personId),
      api.v3.people.getMovieCredits(personId),
      api.v3.people.getTVCredits(personId),
    ]);

    if (!person?.id) {
      notFound();
    }

    return (
      <PersonDetail
        person={person}
        movieCredits={movieCredits}
        tvCredits={tvCredits}
        referrer={referrer}
      />
    );
  } catch (error) {
    console.error("Error fetching person details:", error);
    notFound();
  }
}
