import animeList from "@/anime_data/anime_data";
import AnimeCard from "@/app-ui/AnimeCard";

export default async function Home(props) {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {animeList.map((anime, i) => (
          <AnimeCard key={i} data={anime} />
        ))}
      </div>
    </div>
  );
}
