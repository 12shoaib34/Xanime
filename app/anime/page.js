import animeList from "@/anime_data/anime_data";
import AnimeEpList from "@/app-ui/AnimeEpList";
import StreamingContainer from "@/app-ui/StreamingContainer";
import { fetchEpisode } from "@/services/services";

const Anime = async (props) => {
  const params = await props.searchParams;
  const animeId = Number(params.id);
  const cat = params.cat || "dub";
  const episode = Number(params.ep) || 1;

  const anime = animeList.find((anime) => anime._id === animeId);

  return (
    <div className="x-container py-12 flex flex-col gap-4">
      <div className="w-full overflow-hidden bg-background-secondary rounded-md md:h-[650px]">
        <StreamingContainer anime={anime} episode={episode} cat={cat} />
      </div>
      <AnimeEpList selectedEpisode={episode} data={anime} />
    </div>
  );
};

export default Anime;
