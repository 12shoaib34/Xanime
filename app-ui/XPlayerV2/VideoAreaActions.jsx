import { AiOutlineLoading } from "react-icons/ai";
import { MdPlayCircle } from "react-icons/md";

const VideoAreaActions = (props) => {
  const { playerRef, progress = {}, settings = {}, isBuffering = false, setSettings, onComplete = () => {} } = props;

  const onForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(progress.playedSeconds + 10, "seconds");
    }
  };

  const togglePlayPause = () => {
    setSettings((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));

    console.log("togglePlayPause");
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

  const onActions = (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlayPause();
    } else if (e.code === "ArrowRight") {
      onForward();
    } else if (e.code === "ArrowLeft") {
      onRewind();
    } else if (e.code === "ArrowUp") {
      setSettings((prev) => ({ ...prev, volume: Math.min(prev.volume + 0.1, 1) }));
    } else if (e.code === "ArrowDown") {
      setSettings((prev) => ({ ...prev, volume: Math.max(prev.volume - 0.1, 0) }));
    } else if (e.code === "KeyF") {
      toggleFullscreen();
    } else if (e.code === "KeyM") {
      setSettings((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    } else if (e.code === "KeyR") {
      window.location.reload();
    } else if (e.code === "KeyN") {
      onComplete();
    }
  };

  const bindFn = (e, fn) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  return (
    <div
      onKeyDown={onActions}
      tabIndex={0}
      role="button"
      className="grid grid-cols-8 absolute z-10 top-0 left-0 right-0 bottom-0"
    >
      {isBuffering && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
          <AiOutlineLoading size={100} className="animate-spin" />
        </div>
      )}

      <button
        onClick={(event) => bindFn(event, togglePlayPause)}
        onDoubleClick={(event) => bindFn(event, onRewind)}
        className="col-span-2 h-full outline-none"
      ></button>
      <button
        onDoubleClick={(event) => bindFn(event, toggleFullscreen)}
        onClick={(event) => bindFn(event, togglePlayPause)}
        className="col-span-4 h-full flex-center outline-none"
      >
        <MdPlayCircle
          size={100}
          className={`duration-300 text-white ${settings.isPlaying ? "opacity-0" : "opacity-100"}`}
        />
      </button>
      <button
        onClick={(event) => bindFn(event, togglePlayPause)}
        onDoubleClick={(event) => bindFn(event, onForward)}
        className="col-span-2 h-full outline-none"
      ></button>
    </div>
  );
};

export default VideoAreaActions;
