"use client";

import { useEffect, useRef, useState } from "react";

const SeekBar = ({ progress, playerRef }) => {
  const seekBarRef = useRef(null);
  const handleRef = useRef(null);
  const [handleDragging, setHandleDragging] = useState(false);
  const [seekPosition, setSeekPosition] = useState(progress.played * 100);

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
    handleRef.current.style.left = `${percentage * 100}%`;

    const updateSeekPosition = (percentage) => {
      if (playerRef.current) {
        playerRef.current.seekTo(percentage);
      }
    };

    const onMove = (moveEvent) => {
      const clientX = moveEvent.type.includes("touch") ? moveEvent.touches[0].clientX : moveEvent.clientX;
      percentage = (clientX - seekBarRef.current.getBoundingClientRect().left) / seekBarRef.current.offsetWidth;
      percentage = Math.max(0, Math.min(1, percentage));
      handleRef.current.style.left = `${percentage * 100}%`;

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

  return (
    <div
      onMouseDown={onSeekStart}
      onTouchStart={onSeekStart}
      ref={seekBarRef}
      className="flex items-center relative h-2 bg-black/50 rounded-full cursor-pointer mb-2"
    >
      <span
        style={{ width: `${progress.loaded * 100}%` }}
        className="block h-full bg-white/50 absolute top-0 left-0"
      ></span>
      <span style={{ width: `${seekPosition}%` }} className="block h-full bg-primary absolute top-0 left-0 z-10"></span>
      <span
        style={{ left: `${seekPosition}%` }}
        ref={handleRef}
        className="select-none h-6 w-6 block bg-primary rounded-full absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default SeekBar;
