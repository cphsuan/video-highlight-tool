import { useMemo } from "react";
import { useTranscriptStore } from "@/stores/transcript-store";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import {
  getHighlightSegments,
  getNextHighlightSegment,
  getPreviousHighlightSegment,
} from "@/utils/highlight-playback";

interface ControlBar {
  handlePlayPause?: () => void;
}

export const ControlBar = ({ handlePlayPause }: ControlBar) => {
  const { currentTime, isPlaying, transcript, setCurrentTime } =
    useTranscriptStore();

  const highlightSegments = useMemo(
    () => getHighlightSegments(transcript),
    [transcript]
  );

  const handlePrevious = () => {
    const previousSegment = getPreviousHighlightSegment(
      highlightSegments,
      currentTime - 3
    );
    if (previousSegment) {
      setCurrentTime(previousSegment.start);
    }
  };

  const handleNext = () => {
    const nextSegment = getNextHighlightSegment(highlightSegments, currentTime);
    if (nextSegment) {
      setCurrentTime(nextSegment.start);
    }
  };

  return (
    <div
      className="px-6 py-4 bg-gray-900 flex items-center gap-4"
      data-testid="video-controls"
    >
      <button
        onClick={handlePrevious}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
        aria-label="Previous highlight"
      >
        <SkipBack size={20} />
      </button>
      <button
        onClick={handlePlayPause}
        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button
        onClick={handleNext}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
        aria-label="Next highlight"
      >
        <SkipForward size={20} />
      </button>
      <span className="text-white">
        {Math.floor(currentTime / 60)}:
        {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
        {Math.floor((transcript?.duration || 0) / 60)}:
        {String(Math.floor((transcript?.duration || 0) % 60)).padStart(2, "0")}
      </span>
    </div>
  );
};
