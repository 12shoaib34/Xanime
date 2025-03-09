"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import XPlayerV2 from "./XPlayerV2/XPlayerV2";

const StreamingContainer = (props) => {
  const { anime, episode, cat } = props;

  const [loading, setLoading] = useState(true);
  const [animeData, setAnimeData] = useState(null);

  useEffect(() => {
    fetchEpisode(episode, cat);
  }, [cat, episode]);

  const fetchEpisode = async (episode, cat) => {
    try {
      setLoading(true);
      const url = `https://animesource.me/watch${anime.slug.replace("EPISODE", episode)}.json?cat=${cat}`;
      const { data } = await axios.get(url);
      if (data?.success) {
        setAnimeData(data?.data);
      } else {
        console.log("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sourceUrl = animeData?.sources?.[0]?.url;
  const tracks = animeData?.tracks;

  const captions = tracks?.filter((item) => item?.kind === "captions");

  if (loading) {
    return (
      <div className="h-full w-full bg-background-secondary flex-center">
        <AiOutlineLoading3Quarters className="animate-spin" size={100} />
      </div>
    );
  }

  if (!sourceUrl && !loading) {
    return (
      <div className="h-full w-full bg-background-secondary flex-center">
        <p>Source not found</p>
      </div>
    );
  }

  return <XPlayerV2 url={sourceUrl} captions={captions} />;
};

export default StreamingContainer;
