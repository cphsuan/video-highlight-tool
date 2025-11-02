import { describe, it, expect } from 'vitest'
import { formatTime, findActiveSentence } from '@/utils/time-utils'

describe('timeUtils', () => {
  describe('formatTime', () => {
    it('should format 0 seconds correctly', () => {
      expect(formatTime(0)).toBe('00:00')
    })

    it('should format seconds less than 60', () => {
      expect(formatTime(5)).toBe('00:05')
      expect(formatTime(59)).toBe('00:59')
    })

    it('should format minutes and seconds', () => {
      expect(formatTime(65)).toBe('01:05')
      expect(formatTime(125)).toBe('02:05')
      expect(formatTime(599)).toBe('09:59')
    })

    it('should format hours, minutes and seconds', () => {
      expect(formatTime(3600)).toBe('01:00:00')
      expect(formatTime(3665)).toBe('01:01:05')
      expect(formatTime(7200)).toBe('02:00:00')
    })

    it('should handle decimal seconds', () => {
      expect(formatTime(65.5)).toBe('01:05')
      expect(formatTime(125.9)).toBe('02:05')
    })

    it('should handle negative numbers', () => {
      expect(formatTime(-10)).toBe('00:00')
    })

    it('should handle NaN', () => {
      expect(formatTime(NaN)).toBe('00:00')
    })
  })

  describe('findActiveSentence', () => {
    const mockSections = [
      {
        id: 'sec1',
        sentences: [
          { id: 's1', start: 0, end: 2.5, text: 'First' },
          { id: 's2', start: 2.5, end: 5.0, text: 'Second' },
          { id: 's3', start: 5.0, end: 8.0, text: 'Third' },
        ],
      },
      {
        id: 'sec2',
        sentences: [
          { id: 's4', start: 8.0, end: 10.0, text: 'Fourth' },
          { id: 's5', start: 10.0, end: 12.0, text: 'Fifth' },
        ],
      },
    ]

    it('should find the first sentence at time 0', () => {
      expect(findActiveSentence(mockSections, 0)).toBe('s1')
    })

    it('should find sentence in the middle of its duration', () => {
      expect(findActiveSentence(mockSections, 1.0)).toBe('s1')
      expect(findActiveSentence(mockSections, 3.5)).toBe('s2')
      expect(findActiveSentence(mockSections, 9.0)).toBe('s4')
    })

    it('should find sentence at boundary time', () => {
      // At boundary times, it can match either sentence (implementation dependent)
      // Our implementation returns the first match found
      const result1 = findActiveSentence(mockSections, 2.5)
      expect(['s1', 's2']).toContain(result1)

      const result2 = findActiveSentence(mockSections, 5.0)
      expect(['s2', 's3']).toContain(result2)
    })

    it('should find sentence at internal timestamps', () => {
      // Test with times that are clearly within a sentence
      expect(findActiveSentence(mockSections, 3.0)).toBe('s2')
      expect(findActiveSentence(mockSections, 6.0)).toBe('s3')
      expect(findActiveSentence(mockSections, 9.0)).toBe('s4')
    })

    it('should return null if time is after all sentences', () => {
      expect(findActiveSentence(mockSections, 15.0)).toBeNull()
    })

    it('should return null for empty sections', () => {
      expect(findActiveSentence([], 5.0)).toBeNull()
    })

    it('should work across sections', () => {
      expect(findActiveSentence(mockSections, 7.5)).toBe('s3')
      expect(findActiveSentence(mockSections, 11.0)).toBe('s5')
    })
  })
})
