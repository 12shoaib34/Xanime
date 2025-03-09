"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import VideoAreaActions from "./VideoAreaActions";
import SeekBar from "./SeekBar";
import Hls from "hls.js";
import Controls from "./Controls";
import CustomSubtitles from "./CustomSubtitles";

const XPlayerV2 = ({ url, captions }) => {
  const playerRef = useRef(null);
  const hlsRef = useRef(null);

  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState({});
  const [settings, setSettings] = useState({
    isMuted: false,
    isPlaying: true,
    volume: 0.5,
    playbackRate: 1,
    selectedQuality: -1,
    caption: captions?.[0] || {},
  });

  const [qualityLevels, setQualityLevels] = useState([]);

  useEffect(() => {
    if (Hls.isSupported() && url) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(playerRef.current.getInternalPlayer());

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

  return (
    <div id="XPlayer" className="w-full h-full relative">
      <div className="w-full h-full relative">
        <VideoAreaActions
          progress={progress}
          isBuffering={isBuffering}
          settings={settings}
          playerRef={playerRef}
          setSettings={setSettings}
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
          onBuffer={() => setIsBuffering(true)}
          onBufferEnd={() => setIsBuffering(false)}
          controls={false}
          width="100%"
          height="100%"
          config={{
            file: {
              forceHLS: true,
              attributes: { crossOrigin: "anonymous" },
            },
          }}
          playsinline
        />
        <CustomSubtitles subtitleUrl={settings.caption?.file || captions?.[0]?.file || ""} playerRef={playerRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-4 cursor-pointer z-20 bg-gradient-to-t from-gray-900 to-white/0">
        <SeekBar playerRef={playerRef} progress={progress} />
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
