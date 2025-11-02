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
    currentTime,
    transcript,
    isPlaying,
    activeSentenceId,
    setActiveSentenceId,
    setIsPlaying,
    setCurrentTime,
  } = useTranscriptStore();

  const [isExternalSeek, setIsExternalSeek] = useState(false);
  const sentences = useMemo(
    () => getHighlightSegments(transcript),
    [transcript]
  );

  const endTime = useMemo(() => {
    if (!sentences.length) return null;
    return sentences[sentences.length - 1].end;
  }, [sentences]);

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sentences.length || !endTime) return;

    const handleTimeUpdate = () => {
      if (isExternalSeek) return;

      const t = video.currentTime;
      setCurrentTime(t);

      if (t >= endTime - 0.05) {
        video.pause();
        setIsPlaying(false);
        return;
      }

      const currentSentence = sentences.find((s) => t >= s.start && t < s.end);

      if (!currentSentence) {
        const next = sentences.find((s) => s.start > t);
        if (isPlaying && next) {
          setIsExternalSeek(true);
          video.currentTime = next.start;
          setActiveSentenceId(next.sentenceId);
          setTimeout(() => setIsExternalSeek(false), 300);
        }
        return;
      }

      if (t >= currentSentence.end - 0.05) {
        const idx = sentences.findIndex(
          (s) => s.sentenceId === currentSentence.sentenceId
        );
        const next = sentences[idx + 1];
        if (isPlaying && next) {
          setIsExternalSeek(true);
          video.currentTime = next.start;
          setActiveSentenceId(next.sentenceId);
          setTimeout(() => setIsExternalSeek(false), 300);
        }
      } else if (currentSentence.sentenceId !== activeSentenceId) {
        setActiveSentenceId(currentSentence.sentenceId);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [
    isExternalSeek,
    sentences,
    isPlaying,
    endTime,
    activeSentenceId,
    setActiveSentenceId,
    setIsPlaying,
    setCurrentTime,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) > 0.1) {
      setIsExternalSeek(true);
      video.currentTime = currentTime;

      const handleSeeked = () => {
        setTimeout(() => setIsExternalSeek(false), 200);
        video.removeEventListener("seeked", handleSeeked);
      };
      video.addEventListener("seeked", handleSeeked);
    }
  }, [currentTime]);

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
          controls
          preload="auto"
          width={600}
          src={videoUrl}
          className="max-w-full max-h-full"
        />
      </div>
      <VideoOverlay />
      <ControlBar handlePlayPause={handlePlayPause} />
      <div className="px-6 py-3 bg-gray-800">
        <TimelineBar />
      </div>
    </div>
  );
};
