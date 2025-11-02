"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranscriptStore } from "@/stores/transcript-store";
import { getHighlightSegments } from "@/utils/highlight-playback";
import { TimelineBar } from "./timeline-bar";
import { VideoOverlay } from "./video-overlay";
import { ControlBar } from "./control-bar";

export const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    videoUrl,
    transcript,
    isPlaying,
    activeSentenceId,
    setActiveSentenceId,
    setIsPlaying,
    setCurrentTime,
  } = useTranscriptStore();
  const [jumping, setJumping] = useState(false);
  const sentences = useMemo(() => {
    return getHighlightSegments(transcript);
  }, [transcript]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sentences.length) return;

    const handleTimeUpdate = () => {
      if (jumping) return;
      // 避免重複觸發

      const t = video.currentTime;
      setCurrentTime(t);

      // 找出當前 sentence
      const currentSentence = sentences.find((s) => t >= s.start && t < s.end);
      // 若不在任何 sentence 範圍內 → 找下一個 start
      if (!currentSentence) {
        const next = sentences.find((s) => s.start > t);
        if (next) {
          setJumping(true);
          video.currentTime = next.start;
          setActiveSentenceId(next.sentenceId);
          setTimeout(() => setJumping(false), 300);
        }
        return;
      }
      // 若在當前 sentence，且播放超過 end → 跳下一句
      if (t >= currentSentence.end - 0.05) {
        const currentIndex = sentences.findIndex(
          (s) => s.sentenceId === currentSentence.sentenceId
        );
        const nextSentence = sentences[currentIndex + 1];
        if (nextSentence) {
          setJumping(true);
          video.currentTime = nextSentence.start;
          setActiveSentenceId(nextSentence.sentenceId);
          setTimeout(() => setJumping(false), 300);
        } else {
          console.log("🎬 Last sentence reached");
        }
      } else {
        // 更新目前 active sentence
        if (activeSentenceId !== currentSentence.sentenceId) {
          setActiveSentenceId(currentSentence.sentenceId);
        }
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [
    sentences,
    jumping,
    activeSentenceId,
    setActiveSentenceId,
    setCurrentTime,
  ]);

  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;
  //   // 避免在跳轉時重複觸發
  //   if (!jumping && Math.abs(video.currentTime - currentTime) > 0.05) {
  //     video.currentTime = currentTime;
  //   }
  // }, [currentTime, jumping]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!videoUrl) {
    return <p>Oops! Some Error Happen!</p>;
  }
  return (
    <div className="h-full flex flex-col bg-gray-800 relative">
      <div className="shrink-0 border-b border-gray-700 bg-gray-900 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Preview</h1>
      </div>
      <div className="relative flex-1 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          controls
          width={600}
          preload="auto"
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
