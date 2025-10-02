import { notFound } from "next/navigation";
import api from "@/lib/tmdb";
import MovieDetail from "@/components/MovieDetail";

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
    const watchProviders = await api.v3.movies.getWatchProviders(movieId);

    return <MovieDetail movie={movie} watchProviders={watchProviders} />;
  } catch {
    notFound();
  }
}
