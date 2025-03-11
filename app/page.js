import animeList from "@/anime_data/anime_data";
import AnimeCard from "@/app-ui/AnimeCard";
import Heading from "@/app-ui/Heading";
import Image from "next/image";
import { FaAngleRight } from "react-icons/fa";

export default async function Home(props) {
  return (
    <>
      <section className="pt-12">
        <div className="x-container ">
          <div className="relative rounded-lg overflow-hidden">
            <Image objectFit="cover" priority layout="fill" src={"/cover/hero-1.jpg"} alt="hero" />
            <div className="p-5 md:pt-56 md:px-12 md:pb-8">
              <div className="relative z-10 max-w-lg">
                <div className="bg-white text-primary text-sm px-2 py-1 w-max">Adventure</div>
                <h2 className="font-oswald text-white font-semibold mt-4 md:mt-8 mb-2 text-2xl md:text-4xl md:leading-12">
                  Fate / Stay Night: Unlimited Blade Works
                </h2>
                <p className="mb-4 md:mb-8">After 30 days of travel across the world...</p>
                <a className="flex gap-2" href="#">
                  <span className="btn btn-primary btn-md rounded-s-sm">Watch Now</span>{" "}
                  <span className="btn btn-primary w-max rounded-e-sm px-0.5">
                    <div className="flex-center h-full">
                      <FaAngleRight size={16} />
                    </div>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="x-container">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="md:col-span-6 lg:col-span-8">
              <Heading variant={4} className="uppercase">
                Trending now
              </Heading>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 gap-y-6 md:gap-6 mt-10">
                {animeList
                  ?.sort((a, b) => b.collection - a.collection)
                  .map((anime) => (
                    <AnimeCard key={anime._id} data={anime} />
                  ))}
              </div>
            </div>
            <div className="md:col-span-6 lg:col-span-4"></div>
          </div>
        </div>
      </section>
    </>
  );
}
