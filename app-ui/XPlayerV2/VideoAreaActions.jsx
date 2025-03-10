import { AiOutlineLoading } from "react-icons/ai";
import { MdPlayCircle } from "react-icons/md";

const VideoAreaActions = (props) => {
  const { playerRef, progress = {}, settings = {}, isBuffering = false, setSettings } = props;

  const onForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(progress.playedSeconds + 10, "seconds");
    }
  };

  const togglePlayPause = () => {
    setSettings((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const onRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(Math.max(progress.playedSeconds - 10, 0), "seconds");
    }
  };

  const toggleFullscreen = () => {
    let XPlayer = document.getElementById("XPlayer");

    if (!document.fullscreenElement) {
      XPlayer.requestFullscreen();
      setSettings((prev) => ({ ...prev, fullscreen: true }));
    } else {
      document.exitFullscreen();
      setSettings((prev) => ({ ...prev, fullscreen: false }));
    }
  };

  return (
    <div className="grid grid-cols-8 absolute z-10 top-0 left-0 right-0 bottom-0">
      {isBuffering && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
          <AiOutlineLoading size={100} className="animate-spin" />
        </div>
      )}
      <div onDoubleClick={onRewind} className="col-span-2 h-full"></div>
      <div onDoubleClick={toggleFullscreen} onClick={togglePlayPause} className="col-span-4 h-full flex-center">
        <MdPlayCircle
          size={100}
          className={`duration-300 text-white ${settings.isPlaying ? "opacity-0" : "opacity-100"}`}
        />
      </div>
      <div onDoubleClick={onForward} className="col-span-2 h-full"></div>
    </div>
  );
};

export default VideoAreaActions;
