"use client";

import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

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
      const currentTime = video.currentTime;
      const activeSubtitle = subtitles.find((sub) => currentTime >= sub.start && currentTime <= sub.end);
      setCurrentSubtitle(activeSubtitle ? activeSubtitle.text : "");
    };

    video.addEventListener("timeupdate", updateSubtitle);
    return () => video.removeEventListener("timeupdate", updateSubtitle);
  }, [subtitles, playerRef]);

  return currentSubtitle ? (
    <div
      className="absolute w-full max-w-xl text-center rounded-2xl bottom-22 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 text-white text-xl"
      dangerouslySetInnerHTML={{ __html: currentSubtitle }}
    ></div>
  ) : null;
};

// Helper function to parse .vtt files
const parseVTT = (vttText) => {
  const regex = /(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})\s+([\s\S]+?)(?=\n\n|\n$)/g;
  let matches,
    results = [];

  while ((matches = regex.exec(vttText)) !== null) {
    const [_, start, end, text] = matches;
    results.push({
      start: timeToSeconds(start),
      end: timeToSeconds(end),
      text: text.replace(/\n/g, " "),
    });
  }
  return results;
};

// Converts timestamp to seconds
const timeToSeconds = (time) => {
  const [h, m, s] = time.split(":");
  return parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s);
};

export default CustomSubtitles;
