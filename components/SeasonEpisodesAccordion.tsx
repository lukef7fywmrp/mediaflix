import { TVGetDetailsSeason } from "tmdb-js-node";
import SeasonEpisodeGroup from "./SeasonEpisodeGroup";

interface SeasonEpisodesAccordionProps {
  seasons: TVGetDetailsSeason[];
  tvShowId: number;
}

export default function SeasonEpisodesAccordion({
  seasons,
  tvShowId,
}: SeasonEpisodesAccordionProps) {
  return (
    <div className="space-y-4">
      {seasons.map((season) => (
        <SeasonEpisodeGroup
          key={season.id}
          season={season}
          tvShowId={tvShowId}
        />
      ))}
    </div>
  );
}
