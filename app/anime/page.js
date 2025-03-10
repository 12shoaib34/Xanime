import animeList from "@/anime_data/anime_data";
import AnimeEpList from "@/app-ui/AnimeEpList";
import StreamingContainer from "@/app-ui/StreamingContainer";
import { fetchEpisode } from "@/services/services";

const Anime = async (props) => {
  const params = await props.searchParams;
  const animeId = Number(params.id);
  const cat = params.cat;
  const episode = Number(params.ep);

  const anime = animeList.find((anime) => anime._id === animeId);

  return (
    <div className="x-container py-12 flex flex-col  gap-4">
      <div className="flex flex-col-reverse md:flex-row md:items-start gap-4">
        <AnimeEpList selectedEpisode={episode} data={anime} />
        <StreamingContainer anime={anime} episode={episode} cat={cat} />
      </div>
    </div>
  );
};

export default Anime;
