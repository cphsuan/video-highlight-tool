import { useCallback, useEffect, useRef, useState } from "react";
import { useTranscriptStore } from "@/stores/transcript-store";
import { getNextHighlightSegment } from "@/utils/highlight-playback";

const END_TOLERANCE = 0.05;
const SEEK_THRESHOLD = 0.1;
const DEFAULT_SEEK_RESET_DELAY = 300;
const SEEKED_RESET_DELAY = 200;

export const useVideoPlayer = () => {
  const videoUrl = useTranscriptStore((state) => state.videoUrl);
  const currentTime = useTranscriptStore((state) => state.currentTime);
  const isPlaying = useTranscriptStore((state) => state.isPlaying);
  const activeSentenceId = useTranscriptStore((state) => state.activeSentenceId);
  const setActiveSentenceId = useTranscriptStore(
    (state) => state.setActiveSentenceId
  );
  const setIsPlaying = useTranscriptStore((state) => state.setIsPlaying);
  const setCurrentTime = useTranscriptStore((state) => state.setCurrentTime);
  const highlightSegments = useTranscriptStore(
    (state) => state.highlightSegments
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExternalSeek, setIsExternalSeek] = useState(false);
  const externalSeekResetTimeout = useRef<number | null>(null);

  const clearExternalSeekReset = useCallback(() => {
    if (externalSeekResetTimeout.current !== null) {
      window.clearTimeout(externalSeekResetTimeout.current);
      externalSeekResetTimeout.current = null;
    }
  }, []);

  const scheduleExternalSeekReset = useCallback(
    (delay: number) => {
      clearExternalSeekReset();
      externalSeekResetTimeout.current = window.setTimeout(() => {
        setIsExternalSeek(false);
        externalSeekResetTimeout.current = null;
      }, delay);
    },
    [clearExternalSeekReset]
  );

  const performExternalSeek = useCallback(
    (
      video: HTMLVideoElement,
      time: number,
      sentenceId?: string,
      delay: number | null = DEFAULT_SEEK_RESET_DELAY
    ) => {
      setIsExternalSeek(true);
      video.currentTime = time;
      if (sentenceId) {
        setActiveSentenceId(sentenceId);
      }
      if (delay !== null) {
        scheduleExternalSeekReset(delay);
      }
    },
    [scheduleExternalSeekReset, setActiveSentenceId]
  );

  useEffect(() => {
    return () => {
      clearExternalSeekReset();
    };
  }, [clearExternalSeekReset]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const playPromise = video.play();
    setIsPlaying(true);
    if (playPromise !== undefined) {
      playPromise.catch(() => setIsPlaying(false));
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !highlightSegments.length) return;

    const handleTimeUpdate = () => {
      if (isExternalSeek) return;

      const currentTimestamp = video.currentTime;
      const firstSentence = highlightSegments[0];
      const lastSentence = highlightSegments[highlightSegments.length - 1];

      setCurrentTime(currentTimestamp);

      if (lastSentence && currentTimestamp >= lastSentence.end - END_TOLERANCE) {
        if (isPlaying && firstSentence) {
          performExternalSeek(
            video,
            firstSentence.start,
            firstSentence.sentenceId
          );
        } else {
          video.pause();
          setIsPlaying(false);
        }
        return;
      }

      const currentSentence = highlightSegments.find(
        (sentence) =>
          currentTimestamp >= sentence.start && currentTimestamp < sentence.end
      );

      if (!currentSentence) {
        if (!isPlaying) return;
        const next = getNextHighlightSegment(
          highlightSegments,
          currentTimestamp
        );
        if (next) {
          performExternalSeek(video, next.start, next.sentenceId);
        }
        return;
      }

      if (currentTimestamp >= currentSentence.end - END_TOLERANCE) {
        const idx = highlightSegments.findIndex(
          (sentence) => sentence.sentenceId === currentSentence.sentenceId
        );
        const next = highlightSegments[idx + 1];
        if (isPlaying) {
          if (next) {
            performExternalSeek(video, next.start, next.sentenceId);
          } else if (firstSentence) {
            performExternalSeek(
              video,
              firstSentence.start,
              firstSentence.sentenceId
            );
          }
        }
      } else if (currentSentence.sentenceId !== activeSentenceId) {
        setActiveSentenceId(currentSentence.sentenceId);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [
    isExternalSeek,
    highlightSegments,
    isPlaying,
    activeSentenceId,
    setActiveSentenceId,
    setIsPlaying,
    setCurrentTime,
    performExternalSeek,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) <= SEEK_THRESHOLD) return;

    performExternalSeek(video, currentTime, undefined, null);

    const handleSeeked = () => {
      scheduleExternalSeekReset(SEEKED_RESET_DELAY);
      video.removeEventListener("seeked", handleSeeked);
    };

    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [currentTime, performExternalSeek, scheduleExternalSeekReset]);

  return {
    videoRef,
    videoUrl,
    handlePlayPause,
  };
};
