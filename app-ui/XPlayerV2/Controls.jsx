import React from "react";
import XButton from "./XButton";
import moment from "moment";
import {
  MdPlayArrow,
  MdPause,
  MdVolumeOff,
  MdVolumeUp,
  MdFullscreen,
  MdReplay10,
  MdForward10,
  MdFullscreenExit,
  MdSettings,
  MdSubtitles,
  MdSignalCellular4Bar,
} from "react-icons/md";

import { TbClockCog } from "react-icons/tb";

const Controls = (props) => {
  const { playerRef, settings, setSettings, progress, qualityLevels = [], captions = [], duration } = props;

  const [currentTab, setCurrentTab] = React.useState("SUBTITLES");
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleSettingOpen = () => {
    setIsOpen(!isOpen);
  };

  const togglePlay = () => {
    setSettings({ ...settings, isPlaying: !settings.isPlaying });
  };

  const toggleMute = () => {
    setSettings({ ...settings, isMuted: !settings.isMuted });
  };

  const toggleFullscreen = () => {
    let XPlayer = document.getElementById("XPlayer");

    if (!document.fullscreenElement) {
      XPlayer.requestFullscreen();
      setSettings((prev) => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setSettings((prev) => ({ ...prev, isFullscreen: false }));
    }
  };

  const onForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(progress.playedSeconds + 10, "seconds");
    }
  };

  const onRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(Math.max(progress.playedSeconds - 10, 0), "seconds");
    }
  };

  const onPlayBackRateChange = (speed) => {
    setSettings({ ...settings, playbackRate: speed });
    toggleSettingOpen();
  };

  const onQualityUpdate = (quality) => {
    const selectedIndex = quality.index;

    const internalPlayer = playerRef.current?.getInternalPlayer("hls");
    if (internalPlayer) {
      internalPlayer.currentLevel = selectedIndex;
    }

    setSettings((prev) => ({
      ...prev,
      selectedQuality: selectedIndex,
    }));

    toggleSettingOpen();
  };

  const onCaptionChange = (caption) => {
    setSettings((prev) => ({ ...prev, caption }));
    toggleSettingOpen();
    // if (playerRef?.current) {
    //   const video = playerRef.current.getInternalPlayer(); // Get the native video element

    //   if (video) {
    //     // Remove existing subtitle tracks
    //     const existingTracks = video.querySelectorAll("track");
    //     existingTracks.forEach((track) => track.remove());
    //     // Create a new track element
    //     const track = document.createElement("track");
    //     track.kind = "captions";
    //     track.label = caption.label;
    //     track.srclang = "en"; // Adjust based on the caption language
    //     track.src = caption.file;
    //     track.default = caption.default || false;

    //     // Append the new track to the video element
    //     video.appendChild(track);
    //   }
    // }
  };

  const formateTime = (seconds) => {
    if (!seconds) return "00:00";

    return moment.utc(seconds * 1000).format("mm:ss");
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <span className="block mr-2 text-xs leading-none">
          {formateTime(progress.playedSeconds)} / {formateTime(duration)}
        </span>
        <XButton onClick={togglePlay}>
          {settings?.isPlaying ? <MdPause size={22} /> : <MdPlayArrow size={22} />}
        </XButton>
        <XButton onClick={toggleMute}>
          {settings?.isMuted ? <MdVolumeOff size={22} /> : <MdVolumeUp size={22} />}
        </XButton>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <XButton onClick={toggleSettingOpen}>
            <MdSettings size={22} />
          </XButton>
          <div
            className={`min-w-[300px] min-h-[300px] absolute -translate-y-full -translate-x-full top-0 left-10 p-2 bg-background-tertiary rounded-2xl ${
              isOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center border-b mb-2 pb-2">
              <XButton active={currentTab === "SUBTITLES"} onClick={() => setCurrentTab("SUBTITLES")}>
                <MdSubtitles size={28} />
              </XButton>
              <XButton active={currentTab === "QUALITY"} onClick={() => setCurrentTab("QUALITY")}>
                <MdSignalCellular4Bar size={28} />
              </XButton>
              <XButton active={currentTab === "PLAYBACK_SPEED"} onClick={() => setCurrentTab("PLAYBACK_SPEED")}>
                <TbClockCog size={28} />
              </XButton>
            </div>
            {currentTab === "SUBTITLES" && captions?.length > 0 && (
              <div className="flex flex-col">
                {captions.map((caption, index) => (
                  <button
                    onClick={() => onCaptionChange(caption)}
                    className={`cursor-pointer text-left hover:bg-background-secondary py-2 px-4 rounded-2xl ${
                      settings.caption.label === caption.label ? "bg-background-secondary" : ""
                    }`}
                    key={index}
                  >
                    {caption.label}
                    {settings.caption.label === caption.label && " ✓"}
                  </button>
                ))}
              </div>
            )}
            {currentTab === "QUALITY" && qualityLevels?.length > 0 && (
              <div className="flex flex-col">
                {qualityLevels.map((quality, index) => (
                  <button
                    onClick={() => onQualityUpdate(quality)}
                    className={`cursor-pointer text-left hover:bg-background-secondary py-2 px-4 rounded-2xl ${
                      settings.selectedQuality === quality.index ? "bg-background-secondary" : ""
                    }`}
                    key={index}
                  >
                    {quality.resolution}
                    {settings.selectedQuality === quality.index && " ✓"}
                  </button>
                ))}
              </div>
            )}
            {currentTab === "PLAYBACK_SPEED" && (
              <div className="flex flex-col">
                {[0.5, 1, 1.5, 2].map((speed, index) => (
                  <button
                    onClick={() => onPlayBackRateChange(speed)}
                    className={`cursor-pointer text-left hover:bg-background-secondary py-2 px-4 rounded-2xl ${
                      settings.playbackRate === speed ? "bg-background-secondary" : ""
                    }`}
                    key={index}
                  >
                    {speed}x{settings.playbackRate === speed && " ✓"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <XButton onClick={onRewind}>{<MdReplay10 size={22} />}</XButton>
        <XButton onClick={onForward}>{<MdForward10 size={22} />}</XButton>
        <XButton onClick={toggleFullscreen}>
          {settings?.isFullscreen ? <MdFullscreenExit size={22} /> : <MdFullscreen size={22} />}
        </XButton>
      </div>
    </div>
  );
};

export default Controls;
