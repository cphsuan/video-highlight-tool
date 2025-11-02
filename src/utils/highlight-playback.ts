import type { Transcript, HighlightSegment } from "@/types/transcript";

export const getHighlightSegments = (
  transcript: Transcript | null
): HighlightSegment[] => {
  if (!transcript) return [];

  const highlighted: HighlightSegment[] = [];

  for (const section of transcript.sections) {
    for (const sentence of section.sentences) {
      if (sentence.isHighlight) {
        highlighted.push({
          sentenceId: sentence.id,
          start: sentence.start,
          end: sentence.end,
          text: sentence.text,
          sectionId: section.id,
          sectionTitle: section.title,
        });
      }
    }
  }

  return highlighted.sort((a, b) => a.start - b.start);
};

export const getNextHighlightSegment = (
  segments: HighlightSegment[],
  currentTime: number
): HighlightSegment | null => {
  for (const segment of segments) {
    if (segment.start > currentTime) {
      return segment;
    }
  }
  return null;
};

export const shouldSeekToNextSegment = (
  segments: HighlightSegment[],
  currentTime: number,
  tolerance: number = 0.1
): boolean => {
  if (segments.length === 0) return false;

  const currentSegment = segments.find((segment) => {
    const withinStart = currentTime >= segment.start;
    const withinEnd = currentTime < segment.end + tolerance;
    return withinStart && withinEnd;
  });

  if (currentSegment) return false;

  const nextSegment = getNextHighlightSegment(segments, currentTime);

  return nextSegment !== null;
};

export const getPreviousHighlightSegment = (
  segments: HighlightSegment[],
  currentTime: number
): HighlightSegment | null => {
  let previous: HighlightSegment | null = null;

  for (const segment of segments) {
    if (segment.start < currentTime) {
      previous = segment;
    } else {
      break;
    }
  }

  return previous;
};
