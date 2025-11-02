"use client";

import { useVideoPlayer } from "@/hooks/use-video-player";
import { TimelineBar } from "./timeline-bar";
import { VideoOverlay } from "./video-overlay";
import { ControlBar } from "./control-bar";

export const VideoPlayer = () => {
  const { videoRef, videoUrl, handlePlayPause } = useVideoPlayer();

  if (!videoUrl)
    return <p className="text-red-400 p-4">Oops! No video loaded.</p>;

  return (
    <div className="h-full flex flex-col bg-gray-800 relative">
      <div className="shrink-0 border-b border-gray-700 bg-gray-900 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Preview</h1>
      </div>
      <div className="relative flex-1 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          preload="auto"
          width={600}
          src={videoUrl}
          className="max-w-full max-h-full"
        />
        <VideoOverlay />
      </div>
      <ControlBar handlePlayPause={handlePlayPause} />
      <div className="px-6 py-3 bg-gray-800">
        <TimelineBar />
      </div>
    </div>
  );
};
