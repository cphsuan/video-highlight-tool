import { useTranscriptStore, useHighlightSegments } from "@/stores/transcript-store";

export const TimelineBar = () => {
  const transcript = useTranscriptStore((state) => state.transcript);
  const currentTime = useTranscriptStore((state) => state.currentTime);
  const highlightedSentences = useHighlightSegments();

  if (!transcript) return null;

  const duration = transcript.duration;

  return (
    <div className="w-full" data-testid="timeline-bar">
      <div className="relative h-3 bg-gray-700 rounded overflow-hidden">
        {highlightedSentences.map((sentence) => {
          const startPercent = (sentence.start / duration) * 100;
          const widthPercent =
            ((sentence.end - sentence.start) / duration) * 100;

          return (
            <div
              key={sentence.sentenceId}
              className="absolute h-full bg-blue-500"
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
              }}
              title={sentence.text}
            />
          );
        })}

        <div
          className="absolute top-0 w-1 h-full bg-red-500 shadow-lg z-10"
          style={{
            left: `${(currentTime / duration) * 100}%`,
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg" />
        </div>
      </div>
    </div>
  );
};
