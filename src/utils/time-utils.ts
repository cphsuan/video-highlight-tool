export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Finds which sentence is active at a given time
 * @param sections - All transcript sections
 * @param currentTime - Current video time in seconds
 * @returns The ID of the active sentence, or null if none found
 */
export const findActiveSentence = (
  sections: Array<{
    sentences: Array<{ id: string; start: number; end: number }>;
  }>,
  currentTime: number
): string | null => {
  for (const section of sections) {
    for (const sentence of section.sentences) {
      if (currentTime >= sentence.start && currentTime <= sentence.end) {
        return sentence.id;
      }
    }
  }
  return null;
};
