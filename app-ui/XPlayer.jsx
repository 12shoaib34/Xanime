"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { MdPlayArrow, MdPause, MdVolumeOff, MdVolumeUp, MdFullscreen, MdReplay10, MdForward10, MdFullscreenExit } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/navigation";

const XPlayer = ({ videoUrl, tracks = [], nextEpisode, animeId }) => {
  const router = useRouter();
  const playerRef = useRef(null);
  const handleRef = useRef(null);
  const hideCursorTimeout = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState({});
  const [handleDragging, setHandleDragging] = useState(false);
  const [_, setHideControlsTimeout] = useState(5000);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [setting, setSetting] = useState({
    isMuted: false,
    isPlaying: true,
    volume: 0.1,
    playbackRate: 1,
    fullscreen: false,
  });

  const captions = tracks?.filter((track) => track.kind === "captions");

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "ArrowRight") {
        onForward();
      } else if (e.code === "ArrowLeft") {
        onRewind();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setSetting({ ...setting, volume: Math.min(setting.volume + 0.1, 1) });
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setSetting({ ...setting, volume: Math.max(setting.volume - 0.1, 0) });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [progress.playedSeconds, setting.isPlaying]);

  // hide cursor
  useEffect(() => {
    if (!setting.fullscreen) return;

    document.addEventListener("mousemove", resetCursorTimer);

    return () => {
      document.removeEventListener("mousemove", resetCursorTimer);
      if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current);
    };
  }, [setting.fullscreen]);

  // hide controls
  useEffect(() => {
    if (!showControls) return;

    let timer = setInterval(() => {
      setHideControlsTimeout((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          setShowControls(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showControls]);

  // hide cursor
  const resetCursorTimer = () => {
    document.body.style.cursor = "auto";

    if (hideCursorTimeout.current) clearTimeout(hideCursorTimeout.current);

    hideCursorTimeout.current = setTimeout(() => {
      document.body.style.cursor = "none";
    }, 5000);
  };

  // go to next episode
  const onComplete = () => {
    if (nextEpisode) {
      router.push(`/anime?animeId=${animeId}&ep=${nextEpisode}`);
    }
  };

  // player controls
  const togglePlay = () => {
    setSetting({ ...setting, isPlaying: !setting.isPlaying });
  };

  // player controls mute
  const toggleMute = () => {
    setSetting({ ...setting, isMuted: !setting.isMuted });
  };

  // player controls volume
  const handleVolumeChange = (e) => {
    setSetting({ ...setting, volume: e.target.value });
  };

  // player controls fullscreen
  const toggleFullscreen = () => {
    const videoContainer = document.getElementById("_x-player");

    console.log(videoContainer);

    if (videoContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainer.requestFullscreen().catch((err) => {
          console.error("Error attempting fullscreen:", err);
        });
      }

      setSetting((prev) => ({ ...prev, fullscreen: !prev.fullscreen }));
    }
  };

  const onProgressUpdate = useCallback((e) => {
    if (handleDragging) return;
    setProgress(e);
  }, []);

  // player controls buffer
  const onBuffer = (e) => {
    setIsBuffering(true);
  };

  const onBufferEnd = (e) => {
    setIsBuffering(false);
  };

  // player controls progress
  const onDragProgressHandle = (e) => {
    e.preventDefault();
    setHandleDragging(true);

    const progressBar = e.currentTarget.parentElement; // Get progress bar container
    const rect = progressBar.getBoundingClientRect();
    let percentage;

    const updatePosition = (clientX) => {
      percentage = (clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));
      if (handleRef?.current) {
        handleRef.current.style.left = `${percentage * 100}%`;
      }
    };

    const onMove = (e) => {
      const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };

    const onEnd = () => {
      if (playerRef.current) {
        playerRef.current.seekTo(percentage);
      }
      setHandleDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onEnd);

    // Handle touch event separately
    if (e.type === "touchstart") {
      updatePosition(e.touches[0].clientX);
    }
  };

  // player controls progress
  const onClickProgressbar = (e) => {
    if (handleDragging) return;
    if (playerRef.current) {
      const percentage = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
      setProgress({ played: percentage });
      playerRef.current.seekTo(percentage);
    }
  };

  // player controls seek forward
  const onForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(progress.playedSeconds + 10, "seconds");
    }
  };

  // player controls seek rewind
  const onRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(Math.max(progress.playedSeconds - 10, 0), "seconds");
    }
  };

  // player controls show controls
  const onShowControls = () => {
    setShowControls(true);
    setHideControlsTimeout(5000);
  };

  // player controls hide controls
  const onHideControls = () => {
    setShowControls(false);
  };

  const onDuration = (duration) => {
    console.log(duration);
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div onMouseLeave={onHideControls} onMouseMove={onShowControls} id="_x-player" className={`relative w-full h-full`}>
      <div className="relative w-full h-full">
        {isBuffering && (
          <div onClick={togglePlay} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <AiOutlineLoading className="animate-spin" size={100} />
          </div>
        )}
        <div className="w-full h-full" onDoubleClick={toggleFullscreen} onClick={togglePlay}>
          <ReactPlayer
            width="100%"
            height="100%"
            controls={false}
            url={
              "https://frostbite27.pro/_v7/0e586cf57f7f977a0a0d129859d92f2ced9bb0ae641f36ab28058f8fa1271400506921e23ad4866dd5ae3f7ded70c0288241625dfaf1b4ca4536c97b55ff501c2feede20bec276e2d3d0e90bba30e4b27d523f0cba2c67d3f97364ec1a72fc049335b5882fbfaf164e0a5aac1e81ebbabb2c89df0781dff23d0b5ef8ea552d94/master.m3u8"
            }
            ref={playerRef}
            playing={setting.isPlaying}
            muted={setting.isMuted}
            volume={setting.volume}
            onDuration={onDuration}
            onProgress={onProgressUpdate}
            onEnded={onComplete}
            onBuffer={onBuffer}
            onBufferEnd={onBufferEnd}
            config={{
              file: {
                attributes: { crossOrigin: "anonymous" },
                tracks: captions.map((caption, index) => ({
                  kind: "subtitles",
                  src: caption.file,
                  srcLang: caption.label,
                  label: caption.label || "English",
                  default: index === 0,
                })),
              },
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-white/0 px-2">
          <div className="w-full top-0 left-0 h-[8px] cursor-pointer mb-2">
            <div onMouseUp={onClickProgressbar} className="bg-white/20 h-full relative flex items-center">
              {/* handle */}
              <span
                ref={handleRef}
                onMouseDown={onDragProgressHandle}
                style={{ left: `${progress.played * 100}%` }}
                className="-translate-x-1/2 relative bg-primary w-6 min-w-6 h-6 rounded-full z-10 flex items-center justify-center group"
              >
                <span className="block min-w-[200%] w-[200%] h-[200%] bg-primary/30 rounded-full opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100 duration-200"></span>
              </span>
              {/* buffer */}
              <span style={{ width: `${progress.loaded * 100}%` }} className="bg-white/50 absolute top-0 left-0 h-full" />
              {/* progress */}
              <span style={{ width: `${progress.played * 100}%` }} className="bg-primary absolute top-0 left-0 h-full" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button onClick={togglePlay}>{setting.isPlaying ? <MdPause /> : <MdPlayArrow />}</Button>
              <Button onClick={toggleMute}>{setting.isMuted ? <MdVolumeOff /> : <MdVolumeUp />}</Button>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-1 text-white font-semibold mr-4">
                <span>{formatTime(progress.playedSeconds)}</span>
                <span> / </span>
                <span>{formatTime(duration)}</span>
              </div>
              <Button onClick={onRewind}>
                <MdReplay10 />
              </Button>
              <Button onClick={onForward}>
                <MdForward10 />
              </Button>
              <Button onClick={toggleFullscreen}>{setting.fullscreen ? <MdFullscreenExit /> : <MdFullscreen />}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPlayer;

const Button = (props) => {
  const { onClick = () => {}, children } = props;

  return (
    <button onClick={onClick} className="cursor-pointer h-12 w-12 min-w-12 text-3xl text-white hover:bg-black/50 duration-100 rounded-full flex items-center justify-center">
      {children}
    </button>
  );
};
