"use client";

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

// Helper function to parse .vtt files
// Helper function to parse .vtt files
const parseVTT = (vttText) => {
  const lines = vttText.split(/\r?\n/); // Split by new lines
  const captions = [];
  let tempCaption = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue; // Skip empty lines

    // Match timestamps (e.g., "00:00:01.000 --> 00:00:04.000")
    if (line.includes("-->")) {
      const [start, end] = line.split(" --> ");
      tempCaption = {
        start: timeToSeconds(start),
        end: timeToSeconds(end),
        text: "",
      };
    } else if (tempCaption.text !== undefined) {
      // Subtitle text (can be multiple lines)
      tempCaption.text += line + "<br/>";
    }

    // Push when we reach a blank line or end of file
    if (lines[i + 1] === "" || i === lines.length - 1) {
      if (tempCaption.text) {
        captions.push(tempCaption);
      }
      tempCaption = {};
    }
  }

  return captions;
};

// Converts timestamp to seconds (now correctly handles milliseconds)
const timeToSeconds = (time) => {
  const parts = time.split(":");
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseFloat(s);
  } else if (parts.length === 2) {
    const [m, s] = parts;
    return parseInt(m, 10) * 60 + parseFloat(s);
  }
  return 0;
};

export default CustomSubtitles;
