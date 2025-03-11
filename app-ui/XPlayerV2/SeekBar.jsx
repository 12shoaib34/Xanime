"use client";

import { fetchVttFile, parseVTT } from "@/helper";
import { useEffect, useRef, useState } from "react";

const SeekBar = ({ progress, playerRef, trackThumbnails = [] }) => {
  const seekBarRef = useRef(null);
  const handleRef = useRef(null);
  const seekProgressRef = useRef(null);
  const [handleDragging, setHandleDragging] = useState(false);
  const [seekPosition, setSeekPosition] = useState(progress.played * 100);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    if (trackThumbnails.length > 0) {
      const file = trackThumbnails[0].file;
      fetchVttFile(file).then((res) => {
        const parsVtt = parseVTT(res);
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
      aria-busy={handleDragging}
      onMouseDown={onSeekStart}
      onTouchStart={onSeekStart}
      ref={seekBarRef}
      className="flex items-center relative h-1 hover:scale-y-150 bg-black/50 cursor-pointer mb-2 outlined-3-primary"
    >
      <div
        role="presentation"
        aria-hidden
        style={{ width: `${progress.loaded * 100}%` }}
        className="block h-full bg-white/50 absolute top-0 left-0"
      ></div>
      <div
        ref={seekProgressRef}
        role="presentation"
        aria-hidden
        style={{ width: `${seekPosition}%` }}
        className="block h-full bg-primary absolute top-0 left-0 z-10"
      ></div>
      {/* <span
        style={{ left: `${seekPosition}%` }}
        ref={handleRef}
        className="select-none h-6 w-6 block bg-primary rounded-full absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      /> */}
    </div>
  );
};

export default SeekBar;
