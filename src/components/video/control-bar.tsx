import { useMemo, useCallback } from "react";
import { useTranscriptStore } from "@/stores/transcript-store";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import {
  getNextHighlightSegment,
  getPreviousHighlightSegment,
} from "@/utils/highlight-playback";
import { formatTime } from "@/utils/time-utils";

interface ControlBarProps {
  handlePlayPause?: () => void;
}

export const ControlBar = ({ handlePlayPause }: ControlBarProps) => {
  const transcript = useTranscriptStore((state) => state.transcript);
  const currentTime = useTranscriptStore((state) => state.currentTime);
  const isPlaying = useTranscriptStore((state) => state.isPlaying);
  const setCurrentTime = useTranscriptStore((state) => state.setCurrentTime);
  const highlightSegments = useTranscriptStore(
    (state) => state.highlightSegments
  );

  const handlePrevious = useCallback(() => {
    const previousSegment = getPreviousHighlightSegment(
      highlightSegments,
      currentTime
    );
    if (previousSegment) {
      setCurrentTime(previousSegment.start);
    }
  }, [highlightSegments, currentTime, setCurrentTime]);

  const handleNext = useCallback(() => {
    const nextSegment = getNextHighlightSegment(highlightSegments, currentTime);
    if (nextSegment) {
      setCurrentTime(nextSegment.start);
    }
  }, [highlightSegments, currentTime, setCurrentTime]);

  const onPlayPause = useCallback(() => {
    handlePlayPause?.();
  }, [handlePlayPause]);

  const isPreviousDisabled = useMemo(() => {
    if (highlightSegments.length === 0) return true;
    const previousSegment = getPreviousHighlightSegment(
      highlightSegments,
      currentTime
    );
    return previousSegment === null;
  }, [highlightSegments, currentTime]);

  const isNextDisabled = useMemo(() => {
    if (highlightSegments.length === 0) return true;
    const nextSegment = getNextHighlightSegment(highlightSegments, currentTime);
    return nextSegment === null;
  }, [highlightSegments, currentTime]);

  return (
    <div
      className="px-6 py-4 bg-gray-900 flex items-center gap-4"
      data-testid="video-controls"
    >
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
        aria-label="Previous highlight"
        aria-disabled={isPreviousDisabled}
        title={
          isPreviousDisabled
            ? "No previous highlight available"
            : "Go to previous highlight"
        }
      >
        <SkipBack size={20} />
      </button>
      <button
        onClick={onPlayPause}
        disabled={!handlePlayPause}
        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
        aria-label="Next highlight"
        aria-disabled={isNextDisabled}
        title={
          isNextDisabled
            ? "No next highlight available"
            : "Go to next highlight"
        }
      >
        <SkipForward size={20} />
      </button>
      <span className="text-white">
        {formatTime(currentTime)} / {formatTime(transcript?.duration || 0)}
      </span>
    </div>
  );
};
