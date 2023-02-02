import React, { useEffect, useRef, useState } from "react";
import { IoPlay } from "react-icons/io5";
import useHover from "./hooks/useHover";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import Subtitles from "./assets/captions/video1.vtt";
import { convertTimeToSeconds, parseVtt } from "./utils";

const VideoPlayer = () => {
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);
  const { ref, hovered } = useHover();
  const [triggered, setTriggered] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [showSubtitles, setShowSubtitles] = useState(true);

  const videoRef = useRef(null);

  useEffect(() => {
    const video = document.querySelector("video");
    setDuration(video.duration);
  }, []);

  useEffect(() => {
    fetch(Subtitles)
      .then((res) => res.text())
      .then((vttData) => {
        const parsedSubtitles = parseVtt(vttData);
        console.log(parsedSubtitles);
        setSubtitles(parsedSubtitles);
      });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.ontimeupdate = () => {
        const currentTime = videoRef.current.currentTime;

        const subtitle = subtitles.find(
          (cue) =>
            convertTimeToSeconds(cue.start) <= currentTime &&
            convertTimeToSeconds(cue.end) >= currentTime
        );

        if (subtitle) {
          setCurrentSubtitle(subtitle.text);
        } else {
          setCurrentSubtitle("");
        }
      };
    }
  }, [subtitles, videoRef]);

  const formatDuration = (duration) => {
    if (isNaN(duration)) return "00:00";

    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  };

  const increaseSpeed = () => {
    if (speed >= 2) {
      setSpeed(1);
      videoRef.current.playbackRate = 1;
      return;
    }

    setSpeed(speed + 0.5);
    videoRef.current.playbackRate = speed + 0.5;
  };

  const handleFullscreenClick = () => {
    if (fullScreen) {
      document.exitFullscreen();
      setFullScreen(false);
    } else {
      ref.current.requestFullscreen();
      setFullScreen(true);
    }
  };

  const handleToggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  return (
    <div
      className="relative h-full w-full cursor-pointer"
      ref={ref}
      onClick={() => {
        if (triggered) return;
        setTriggered(true);
        // unmute and reset the video
        videoRef.current.muted = false;
        videoRef.current.currentTime = 0;
      }}
    >
      <video
        className="w-full h-full object-cover"
        src="https://media.videoask.com/transcoded/dabd0292-cf99-40ba-a12a-245a279b31dc/video.mp4"
        onClick={() => {
          setPlaying(!playing);
          playing ? videoRef.current.pause() : videoRef.current.play();
        }}
        onTimeUpdate={() => {
          setPlayed(videoRef.current.currentTime / videoRef.current.duration);
          setDuration(videoRef.current.duration);
        }}
        onEnded={() => {
          setPlaying(false);
        }}
        ref={videoRef}
        controls={false}
        autoPlay
        muted
        preload="metadata"
        loop={!triggered}
      />

      {(!triggered || videoRef?.current?.currentTime < 2) && (
        <p className="absolute top-24 left-16 text-white text-5xl tracking-wider">
          Welcome
        </p>
      )}

      {!playing && (
        <div
          className="absolute top-0 flex justify-center items-center left-0 w-full h-full"
          onClick={() => {
            setPlaying(!playing);
            videoRef.current.play();
          }}
        >
          <div
            className={`bg-gray-200 h-16 w-16 rounded-full transition-all delay-300 duration-300 flex justify-center items-center ${
              hovered && "scale-125 bg-opacity-80"
            } bg-opacity-70`}
          >
            <IoPlay className="text-3xl text-black" />
          </div>
        </div>
      )}
      {showSubtitles && currentSubtitle && (
        <div className="absolute bottom-40 flex justify-center w-full">
          <p className="text-white w-fit text-center bg-black px-2 text-lg">
            {currentSubtitle}
          </p>
        </div>
      )}
      {triggered && (
        <>
          {/* Progress Bar */}
          <div className="absolute top-2 left-0 right-0">
            <div
              className="bg-gray-200 bg-opacity-50 cursor-pointer h-2 hover:h-4 transition-all duration-200 ease-in-out"
              onClick={(e) => {
                const clickPosition = e.clientX;
                const progressBar = e.target.getBoundingClientRect();
                const newTime =
                  (clickPosition - progressBar.left) / progressBar.width;
                videoRef.current.currentTime =
                  newTime * videoRef.current.duration;
              }}
            >
              <div
                className="w-full h-full bg-purple-500"
                style={{ width: `${played * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}

          <div className="absolute font-semibold text-xs top-10 right-5 flex items-center gap-3 justify-between p-2">
            {/* Duration */}
            <div className="text-white">
              {formatDuration(played * duration)} / {formatDuration(duration)}
            </div>

            {/* Subtitles */}
            <div
              onClick={handleToggleSubtitles}
              className={`text-white ${
                showSubtitles ? "bg-white text-black" : "bg-transparent"
              } w-7 flex justify-center rounded-md border-2 border-white hover:scale-105 transition-all duration-300`}
            >
              <p>CC</p>
            </div>

            {/* Speed */}
            <div
              className={`text-white w-7 flex justify-center rounded-md border-2 border-white hover:scale-105 transition-all duration-300
            ${speed !== 1 ? "bg-white text-black" : "bg-transparent text-white"}
         `}
              onClick={increaseSpeed}
            >
              {speed}x
            </div>

            {/* Full Screen */}
            <div
              onClick={handleFullscreenClick}
              className="text-white w-7 flex justify-center rounded-md border-2 border-white hover:scale-105 transition-all duration-300"
            >
              {fullScreen ? (
                <MdFullscreenExit className="text-base" />
              ) : (
                <MdFullscreen className="text-base" />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
