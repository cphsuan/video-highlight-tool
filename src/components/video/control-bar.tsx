import { useTranscriptStore } from "@/stores/transcript-store";
import { Play, Pause } from "lucide-react";

interface ControlBar {
  handlePlayPause?: () => void;
}

export const ControlBar = ({ handlePlayPause }: ControlBar) => {
  const { currentTime, isPlaying, transcript } = useTranscriptStore();
  return (
    <div
      className="px-6 py-4 bg-gray-900 flex items-center gap-4"
      data-testid="video-controls"
    >
      <button
        onClick={handlePlayPause}
        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
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
