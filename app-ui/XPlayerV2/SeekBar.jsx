"use client";

import { fetchVttFile } from "@/helper";
import { useEffect, useRef, useState } from "react";

const SeekBar = ({ progress, playerRef, trackThumbnails = [] }) => {
  const seekBarRef = useRef(null);
  const seekProgressRef = useRef(null);
  const [handleDragging, setHandleDragging] = useState(false);
  const [seekPosition, setSeekPosition] = useState(progress.played * 100);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (trackThumbnails?.length > 0) {
      const file = trackThumbnails[0].file;
      fetchVttFile(file).then((res) => {
        const parsedVtt = parseVTT(res);
        setThumbnails(parsedVtt);
      });
    }
  }, [trackThumbnails]);

  useEffect(() => {
    if (!handleDragging) {
      setSeekPosition(progress.played * 100);
    }
  }, [progress.played, handleDragging]);

  const onSeekStart = (e) => {
    e.preventDefault();
    setHandleDragging(true);

    let percentage =
      ((e.clientX || e.touches[0].clientX) - seekBarRef.current.getBoundingClientRect().left) /
      seekBarRef.current.offsetWidth;

    percentage = Math.max(0, Math.min(1, percentage));
    seekProgressRef.current.width = `${percentage * 100}%`;

    const updateSeekPosition = (percentage) => {
      if (playerRef.current) {
        playerRef.current.seekTo(percentage);
        setSeekPosition(percentage * 100);
      }
    };

    const onMove = (moveEvent) => {
      const clientX = moveEvent.type.includes("touch") ? moveEvent.touches[0].clientX : moveEvent.clientX;
      percentage = (clientX - seekBarRef.current.getBoundingClientRect().left) / seekBarRef.current.offsetWidth;
      percentage = Math.max(0, Math.min(1, percentage));

      updateSeekPosition(percentage);
    };

    const onEnd = () => {
      setHandleDragging(false);
      updateSeekPosition(percentage);

      // Remove event listeners
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove, { passive: false });
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
  };

  const handleKeyDown = (e) => {
    if (!playerRef.current) return;
    if (!thumbnails || thumbnails?.length === 0) return;

    const currentTime = playerRef.current.getCurrentTime();
    const duration = playerRef.current.getDuration();
    let newTime = currentTime;

    if (e.key === "ArrowRight") {
      newTime = Math.min(currentTime + 10, duration); // Seek forward 10s
    } else if (e.key === "ArrowLeft") {
      newTime = Math.max(currentTime - 10, 0); // Rewind 10s
    } else {
      return;
    }

    e.preventDefault();
    playerRef.current.seekTo(newTime / duration);
    setSeekPosition((newTime / duration) * 100);
  };

  // Handle Mouse Move for Thumbnail Preview
  const handleMouseMove = (e) => {
    if (!seekBarRef.current || thumbnails.length === 0) return;

    const rect = seekBarRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const videoTime = percentage * (playerRef.current?.getDuration() || 0);

    const matchedThumb = thumbnails.find((thumb) => videoTime >= thumb.start && videoTime <= thumb.end);

    setThumbnail(matchedThumb || null);
    setHoverPosition({ x: e.clientX - rect.left, y: rect.top });
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={seekPosition}
      aria-orientation="horizontal"
      aria-label="Seek Bar"
      aria-live="polite"
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchEnd={() => setThumbnail(null)}
      onMouseLeave={() => setThumbnail(null)}
      aria-busy={handleDragging}
      onMouseDown={onSeekStart}
      onTouchStart={onSeekStart}
      ref={seekBarRef}
      className="flex items-center relative h-2 bg-white/50 cursor-pointer mb-2 outlined-3-primary hover:h-3 hover:transform hover:translate-y-1 duration-100"
    >
      <div
        role="presentation"
        aria-hidden
        style={{ width: `${progress.loaded * 100}%` }}
        className="block h-full bg-primary/40 absolute top-0 left-0"
      ></div>
      <div
        ref={seekProgressRef}
        role="presentation"
        aria-hidden
        style={{ width: `${seekPosition}%` }}
        className="block h-full bg-primary absolute top-0 left-0 z-10"
      ></div>

      {thumbnail && (
        <div
          className="absolute -translate-x-1/2 rounded-md overflow-hidden scale-110 duration-75 origin-bottom w-36 h-36 bg-no-repeat"
          style={{
            left: `${hoverPosition.x}px`,
            bottom: `12px`,
            backgroundImage: `url(${trackThumbnails?.[0]?.file?.replace("/thumbnails.vtt", "/")}/${
              thumbnail.imageUrl
            })`,
            backgroundPosition: `-${thumbnail.x}px -${thumbnail.y}px`,
            width: `${thumbnail.width}px`,
            height: `${thumbnail.height}px`,
          }}
        />
      )}
    </div>
  );
};

export const parseVTT = (vttText) => {
  const lines = vttText.split("\n").filter((line) => line.trim() !== "");
  const thumbnails = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("-->")) {
      const [start, end] = lines[i].split(" --> ").map((time) => time.trim());
      const imageLine = lines[i + 1];

      if (imageLine.includes("#xywh=")) {
        const [imageUrl, coords] = imageLine.split("#xywh=");
        const [x, y, width, height] = coords.split(",").map(Number);

        thumbnails.push({
          start: timeToSeconds(start),
          end: timeToSeconds(end),
          imageUrl: imageUrl.trim(),
          x,
          y,
          width,
          height,
        });
      }
    }
  }
  return thumbnails;
};

const timeToSeconds = (time) => {
  const parts = time.split(":").map(parseFloat);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
};

export default SeekBar;
