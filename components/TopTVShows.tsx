import TVShowCard from "@/components/TVShowCard";
import api from "@/lib/tmdb";

export default async function TopTVShows() {
  const tvShows = await api.v3.tv.getTopRated();
  const top10TVShows = tvShows.results.slice(0, 10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {top10TVShows.map((tvShow, index) => (
        <TVShowCard key={tvShow.id} tvShow={tvShow} rank={index + 1} />
      ))}
    </div>
  );
}
