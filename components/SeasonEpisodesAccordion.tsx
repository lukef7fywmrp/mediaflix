import { Accordion } from "@/components/ui/accordion";
import { TVGetDetailsSeason } from "tmdb-js-node";
import SeasonEpisodeGroup from "./SeasonEpisodeGroup";

interface SeasonEpisodesAccordionProps {
  seasons: TVGetDetailsSeason[];
  tvShowId: number;
  tvShowName: string;
}

export default function SeasonEpisodesAccordion({
  seasons,
  tvShowId,
}: SeasonEpisodesAccordionProps) {
  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="w-full">
        {seasons.map((season) => (
          <SeasonEpisodeGroup
            key={season.id}
            season={season}
            tvShowId={tvShowId}
          />
        ))}
      </Accordion>
    </div>
  );
}
