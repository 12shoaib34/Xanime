"use client";

import { parseVTT } from "@/helper";
import { useEffect, useState } from "react";

const CustomSubtitles = ({ subtitleUrl, playerRef }) => {
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await fetch(subtitleUrl);
        const text = await response.text();

        const parsedSubtitles = parseVTT(text);

        setSubtitles(parsedSubtitles);
      } catch (error) {
        console.error("Failed to load subtitles", error);
      }
    };

    if (subtitleUrl) fetchSubtitles();
  }, [subtitleUrl]);

  useEffect(() => {
    const video = playerRef?.current?.getInternalPlayer();

    if (!video) return;

    const updateSubtitle = () => {
      if (!subtitles || subtitles.length === 0) return;

      const currentTime = video.currentTime;
      const activeSubtitle = subtitles.find((sub) => currentTime >= sub.start && currentTime <= sub.end);
      setCurrentSubtitle(activeSubtitle ? activeSubtitle.text : "");
    };

    video.addEventListener("timeupdate", updateSubtitle);
    return () => video.removeEventListener("timeupdate", updateSubtitle);
  }, [subtitles, playerRef]);

  return currentSubtitle ? (
    <div
      className="absolute w-max max-w-xl text-center bottom-16 md:bottom-22 left-1/2 -translate-x-1/2 bg-black/70 p-1 md:px-4 md:py-2 text-white text-xs md:text-xl"
      dangerouslySetInnerHTML={{ __html: currentSubtitle }}
    ></div>
  ) : null;
};

export default CustomSubtitles;
