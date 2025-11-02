import { describe, it, expect } from 'vitest'
import {
  getHighlightSegments,
  getNextHighlightSegment,
  getPreviousHighlightSegment,
  shouldSeekToNextSegment,
} from '@/utils/highlight-playback'
import type { Transcript } from '@/types/transcript'

const createMockTranscript = (): Transcript => ({
  videoId: 'test-video',
  title: 'Test Video',
  duration: 100,
  sections: [
    {
      id: 'section1',
      title: 'Section 1',
      sentences: [
        { id: 's1', start: 0, end: 5, text: 'First sentence', isHighlight: false },
        { id: 's2', start: 5, end: 10, text: 'Second sentence', isHighlight: true },
        { id: 's3', start: 10, end: 15, text: 'Third sentence', isHighlight: false },
      ],
    },
    {
      id: 'section2',
      title: 'Section 2',
      sentences: [
        { id: 's4', start: 15, end: 20, text: 'Fourth sentence', isHighlight: true },
        { id: 's5', start: 20, end: 25, text: 'Fifth sentence', isHighlight: false },
        { id: 's6', start: 25, end: 30, text: 'Sixth sentence', isHighlight: true },
      ],
    },
  ],
})

describe('getHighlightSegments', () => {
  it('should return empty array for null transcript', () => {
    const result = getHighlightSegments(null)
    expect(result).toEqual([])
  })

  it('should extract only highlighted sentences', () => {
    const transcript = createMockTranscript()
    const segments = getHighlightSegments(transcript)

    expect(segments).toHaveLength(3)
    expect(segments[0].sentenceId).toBe('s2')
    expect(segments[1].sentenceId).toBe('s4')
    expect(segments[2].sentenceId).toBe('s6')
  })

  it('should include section information', () => {
    const transcript = createMockTranscript()
    const segments = getHighlightSegments(transcript)

    expect(segments[0].sectionId).toBe('section1')
    expect(segments[0].sectionTitle).toBe('Section 1')
    expect(segments[1].sectionId).toBe('section2')
    expect(segments[1].sectionTitle).toBe('Section 2')
  })

  it('should sort segments by start time', () => {
    const transcript: Transcript = {
      videoId: 'test',
      title: 'Test',
      duration: 100,
      sections: [
        {
          id: 'sec1',
          title: 'Section 1',
          sentences: [
            { id: 's1', start: 20, end: 25, text: 'Later', isHighlight: true },
            { id: 's2', start: 5, end: 10, text: 'Earlier', isHighlight: true },
            { id: 's3', start: 15, end: 18, text: 'Middle', isHighlight: true },
          ],
        },
      ],
    }

    const segments = getHighlightSegments(transcript)

    expect(segments[0].start).toBe(5)
    expect(segments[1].start).toBe(15)
    expect(segments[2].start).toBe(20)
  })

  it('should return empty array when no highlights', () => {
    const transcript: Transcript = {
      videoId: 'test',
      title: 'Test',
      duration: 100,
      sections: [
        {
          id: 'sec1',
          title: 'Section 1',
          sentences: [
            { id: 's1', start: 0, end: 5, text: 'Not highlighted', isHighlight: false },
          ],
        },
      ],
    }

    const segments = getHighlightSegments(transcript)
    expect(segments).toEqual([])
  })
})

describe('getNextHighlightSegment', () => {
  it('should return next segment after current time', () => {
    const segments = [
      { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
      { sentenceId: 's2', start: 15, end: 20, text: 'Second', sectionId: 'sec1', sectionTitle: 'Section 1' },
      { sentenceId: 's3', start: 25, end: 30, text: 'Third', sectionId: 'sec1', sectionTitle: 'Section 1' },
    ]

    const next = getNextHighlightSegment(segments, 7)
    expect(next?.sentenceId).toBe('s2')
    expect(next?.start).toBe(15)
  })

  it('should return first segment when before all segments', () => {
    const segments = [
      { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
    ]

    const next = getNextHighlightSegment(segments, 0)
    expect(next?.sentenceId).toBe('s1')
  })

  it('should return null when after all segments', () => {
    const segments = [
      { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
    ]

    const next = getNextHighlightSegment(segments, 20)
    expect(next).toBeNull()
  })

  it('should return null for empty array', () => {
    const next = getNextHighlightSegment([], 10)
    expect(next).toBeNull()
  })
})

describe('getPreviousHighlightSegment', () => {
  it('should return previous segment before current time', () => {
    const segments = [
      { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
      { sentenceId: 's2', start: 15, end: 20, text: 'Second', sectionId: 'sec1', sectionTitle: 'Section 1' },
      { sentenceId: 's3', start: 25, end: 30, text: 'Third', sectionId: 'sec1', sectionTitle: 'Section 1' },
    ]

    const prev = getPreviousHighlightSegment(segments, 22)
    expect(prev?.sentenceId).toBe('s2')
    expect(prev?.start).toBe(15)
  })

  it('should return null when before all segments', () => {
    const segments = [
      { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
    ]

    const prev = getPreviousHighlightSegment(segments, 3)
    expect(prev).toBeNull()
  })

  it('should return last segment when after all segments', () => {
    const segments = [
      { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
      { sentenceId: 's2', start: 15, end: 20, text: 'Second', sectionId: 'sec1', sectionTitle: 'Section 1' },
    ]

    const prev = getPreviousHighlightSegment(segments, 30)
    expect(prev?.sentenceId).toBe('s2')
  })

  it('should return null for empty array', () => {
    const prev = getPreviousHighlightSegment([], 10)
    expect(prev).toBeNull()
  })

  it('should work with sorted segments', () => {
    const segments = [
      { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
      { sentenceId: 's2', start: 15, end: 20, text: 'Second', sectionId: 'sec1', sectionTitle: 'Section 1' },
      { sentenceId: 's3', start: 25, end: 30, text: 'Third', sectionId: 'sec1', sectionTitle: 'Section 1' },
    ]

    const prev = getPreviousHighlightSegment(segments, 17)
    expect(prev?.sentenceId).toBe('s2')
  })
})

describe('shouldSeekToNextSegment', () => {
  const segments = [
    { sentenceId: 's1', start: 5, end: 10, text: 'First', sectionId: 'sec1', sectionTitle: 'Section 1' },
    { sentenceId: 's2', start: 15, end: 20, text: 'Second', sectionId: 'sec1', sectionTitle: 'Section 1' },
  ]

  it('should return false when inside a segment', () => {
    expect(shouldSeekToNextSegment(segments, 7)).toBe(false)
    expect(shouldSeekToNextSegment(segments, 17)).toBe(false)
  })

  it('should return true when between segments', () => {
    expect(shouldSeekToNextSegment(segments, 12)).toBe(true)
  })

  it('should return true when before first segment', () => {
    expect(shouldSeekToNextSegment(segments, 2)).toBe(true)
  })

  it('should return false when after all segments', () => {
    expect(shouldSeekToNextSegment(segments, 25)).toBe(false)
  })

  it('should use tolerance at segment end', () => {
    expect(shouldSeekToNextSegment(segments, 10.05, 0.1)).toBe(false)
    expect(shouldSeekToNextSegment(segments, 10.15, 0.1)).toBe(true)
  })

  it('should return false for empty segments', () => {
    expect(shouldSeekToNextSegment([], 10)).toBe(false)
  })

  it('should handle edge case at exact end time', () => {
    expect(shouldSeekToNextSegment(segments, 10)).toBe(false)
  })

  it('should handle custom tolerance', () => {
    expect(shouldSeekToNextSegment(segments, 10.2, 0.3)).toBe(false)
    expect(shouldSeekToNextSegment(segments, 10.4, 0.3)).toBe(true)
  })
})
