import animeList from "@/anime_data/anime_data";
import AnimeCard from "@/app-ui/AnimeCard";

export default async function Home(props) {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-5 gap-4">
        {animeList.map((anime) => (
          <AnimeCard key={anime._id} data={anime} />
        ))}
      </div>
    </div>
  );
}
