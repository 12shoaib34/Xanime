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
    if (!episode) return;

    try {
      setLoading(true);
      let url = `https://animesource.me/watch${anime.slug.replace("{{ep}}", episode)}.json?cat=${cat}`;

      const { data } = await axios.get(url);
      if (data?.success) {
        setAnimeData(data?.data);
      } else {
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
  const trackThumbnails = tracks?.filter((item) => item?.kind === "thumbnails");

  const onNext = () => {
    window.location.href = `/anime?id=${anime._id}&ep=${episode + 1}&cat=${cat || ""}`;
  };

  const onPrev = () => {
    window.location.href = `/anime?id=${anime._id}&ep=${episode - 1}&cat=${cat || ""}`;
  };

  const onCatChange = (cat) => {
    window.location.href = `/anime?id=${anime._id}&ep=${episode}&cat=${cat || ""}`;
  };

  if (!episode) {
    return (
      <Container>
        <div className="flex-center flex-col h-full w-full gap-2">
          <p>Please select an episode</p>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="flex-center h-full w-full">
          <AiOutlineLoading3Quarters className="animate-spin" size={100} />
        </div>
      </Container>
    );
  }

  if (!sourceUrl && !loading) {
    return (
      <Container>
        <div className="flex-center flex-col h-full w-full gap-2">
          <p>Source not found</p>
          <button className="btn btn-primary btn-xs" onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </Container>
    );
  }

  return (
    <div className="flex-1">
      <div className="pb-[56%] relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-lg overflow-hidden">
          <XPlayerV2 url={sourceUrl} captions={captions} trackThumbnails={trackThumbnails} onComplete={onNext} />
        </div>
      </div>
      {!loading && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button onClick={onPrev} className="btn btn-secondary btn-xs">
              Prev
            </button>
            <button onClick={onNext} className="btn btn-secondary btn-xs">
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            {anime?.cat?.map((item) => (
              <button onClick={() => onCatChange(item)} className="btn btn-secondary btn-xs" key={item}>
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingContainer;

const Container = (props) => {
  const { children } = props;
  return (
    <div className="flex-1 bg-background-secondary rounded-lg">
      <div className="pb-[56%] relative">
        <div className="absolute top-0 left-0 right-0 bottom-0">{children}</div>
      </div>
    </div>
  );
};
