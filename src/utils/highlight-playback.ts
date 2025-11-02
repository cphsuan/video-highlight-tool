import type { Transcript, HighlightSegment } from '@/types/transcript'

/**
 * Extract all highlighted sentences from transcript in order
 */
export const getHighlightSegments = (
  transcript: Transcript | null
): HighlightSegment[] => {
  if (!transcript) return []

  const highlighted: HighlightSegment[] = []

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
        })
      }
    }
  }

  return highlighted
}

/**
 * Get the next highlight segment after the current time
 * Returns null if there are no more highlights after current time
 */
export const getNextHighlightSegment = (
  segments: HighlightSegment[],
  currentTime: number
): HighlightSegment | null => {
  // Find the first segment that starts after current time
  for (const segment of segments) {
    if (segment.start > currentTime) {
      return segment
    }
  }
  return null
}

/**
 * Determine if we should seek to the next highlight segment
 * Returns true if:
 * - Current time has passed the end of a highlight segment
 * - There is a next highlight available
 *
 * @param segments - Array of highlight segments
 * @param currentTime - Current playback time
 * @param tolerance - Time tolerance for boundary checking (default 0.1s)
 */
export const shouldSeekToNextSegment = (
  segments: HighlightSegment[],
  currentTime: number,
  tolerance: number = 0.1
): boolean => {
  if (segments.length === 0) return false

  // Check if we're currently in a highlight (with tolerance)
  const currentSegment = segments.find(segment => {
    const withinStart = currentTime >= segment.start
    const withinEnd = currentTime < segment.end + tolerance
    return withinStart && withinEnd
  })

  // If we're in a highlight, don't seek
  if (currentSegment) return false

  // If we're not in a highlight, check if there's a next segment
  const nextSegment = getNextHighlightSegment(segments, currentTime)

  // Only seek if there's a next segment available
  return nextSegment !== null
}

/**
 * Get the previous highlight segment before the current time
 * Useful for "skip backward" functionality
 */
export const getPreviousHighlightSegment = (
  segments: HighlightSegment[],
  currentTime: number
): HighlightSegment | null => {
  // Find the last segment that starts before current time
  let previous: HighlightSegment | null = null

  for (const segment of segments) {
    if (segment.start < currentTime) {
      previous = segment
    } else {
      break
    }
  }

  return previous
}
