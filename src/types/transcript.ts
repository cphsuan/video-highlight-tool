/**
 * Represents a single sentence in the transcript
 */
export interface Sentence {
  /** Unique identifier for the sentence */
  id: string
  /** Start time in seconds */
  start: number
  /** End time in seconds */
  end: number
  /** The text content of the sentence */
  text: string
  /** Whether this sentence is selected as a highlight */
  isHighlight: boolean
}

/**
 * Represents a section of the transcript containing multiple sentences
 */
export interface Section {
  /** Unique identifier for the section */
  id: string
  /** Title of the section */
  title: string
  /** Array of sentences in this section */
  sentences: Sentence[]
}

/**
 * Represents the complete transcript data for a video
 */
export interface Transcript {
  /** Unique identifier for the video */
  videoId: string
  /** Title of the video/transcript */
  title: string
  /** Total duration of the video in seconds */
  duration: number
  /** Array of sections in the transcript */
  sections: Section[]
}

/**
 * View state for the application
 */
export type ViewState = 'upload' | 'processing' | 'editor'

/**
 * Represents a highlight segment for export or display
 */
export interface HighlightSegment {
  /** Sentence ID */
  sentenceId: string
  /** Start time in seconds */
  start: number
  /** End time in seconds */
  end: number
  /** Text content */
  text: string
  /** Section this segment belongs to */
  sectionId: string
  /** Section title */
  sectionTitle: string
}
