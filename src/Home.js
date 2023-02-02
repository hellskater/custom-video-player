import React from "react";
import { Link } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const Home = () => {
  return (
    <div className="bg-black h-screen w-screen text-white">
      <div className="h-full w-full">
        <VideoPlayer />
      </div>
    </div>
  );
};

export default Home;
