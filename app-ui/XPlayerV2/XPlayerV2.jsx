"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import VideoAreaActions from "./VideoAreaActions";
import SeekBar from "./SeekBar";
import Hls from "hls.js";
import Controls from "./Controls";
import CustomSubtitles from "./CustomSubtitles";

const XPlayerV2 = ({ url, captions = [], trackThumbnails = [], onComplete }) => {
  const playerRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({});
  const [isInactive, setIsInactive] = useState(false);

  const [settings, setSettings] = useState({
    isMuted: false,
    isPlaying: true,
    fullscreen: false,
    volume: 100,
    playbackRate: 1,
    selectedQuality: -1,
    caption: captions?.[0] || {},
  });

  const [qualityLevels, setQualityLevels] = useState([]);

  useEffect(() => {
    if (Hls.isSupported() && url) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels.map((level, index) => ({
          index,
          resolution: `${level.height}p`,
          bitrate: level.bitrate,
        }));
        setQualityLevels([{ index: -1, resolution: "Auto" }, ...levels]);
      });

      hlsRef.current = hls;

      return () => {
        hls.destroy();
      };
    }
  }, [url]);

  useEffect(() => {
    if (!settings?.fullscreen) return;

    const resetTimer = () => {
      setIsInactive(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsInactive(true), 5000);
    };

    const handleUserActivity = () => {
      resetTimer();
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleUserActivity);
      containerRef.current.addEventListener("keydown", handleUserActivity);
    }

    resetTimer();

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleUserActivity);
        containerRef.current.removeEventListener("keydown", handleUserActivity);
      }
      clearTimeout(timeoutRef.current);
    };
  }, [settings?.fullscreen]);

  return (
    <div
      id="XPlayer"
      ref={containerRef}
      className={`w-full h-full relative bg-background-secondary group ${isInactive ? "cursor-none" : "cursor-auto"}`}
    >
      <div className="w-full h-full relative">
        <VideoAreaActions
          progress={progress}
          isBuffering={isBuffering}
          settings={settings}
          playerRef={playerRef}
          setSettings={setSettings}
          onComplete={onComplete}
        />
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={settings.isPlaying}
          muted={settings.isMuted}
          volume={settings.volume}
          playbackRate={settings.playbackRate}
          onDuration={setDuration}
          onProgress={setProgress}
          onEnded={onComplete}
          onBuffer={() => setIsBuffering(true)}
          onBufferEnd={() => setIsBuffering(false)}
          controls={false}
          width="100%"
          height="100%"
          config={{
            file: {
              forceHLS: true,
            },
          }}
          playsinline
        />
        {playerRef.current && (
          <CustomSubtitles subtitleUrl={settings.caption?.file || captions?.[0]?.file || ""} playerRef={playerRef} />
        )}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 px-4 pb-4 cursor-pointer z-20 bg-gradient-to-t from-black to-white/0 
        transition-opacity duration-300 ${isInactive ? "opacity-0" : "opacity-100"}`}
      >
        <SeekBar trackThumbnails={trackThumbnails} playerRef={playerRef} progress={progress} />
        <Controls
          duration={duration}
          setSettings={setSettings}
          playerRef={playerRef}
          settings={settings}
          progress={progress}
          captions={captions}
          qualityLevels={qualityLevels}
        />
      </div>
    </div>
  );
};

export default XPlayerV2;
