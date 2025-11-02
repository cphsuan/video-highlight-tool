import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTranscriptStore } from '@/stores/transcript-store'
import type { Transcript } from '@/types/transcript'

const createMockTranscript = (): Transcript => ({
  videoId: 'test_video',
  title: 'Test Transcript',
  duration: 100,
  sections: [
    {
      id: 'sec1',
      title: 'Section 1',
      sentences: [
        { id: 's1', start: 0, end: 5, text: 'First sentence', isHighlight: false },
        { id: 's2', start: 5, end: 10, text: 'Second sentence', isHighlight: false },
      ],
    },
  ],
})

vi.mock('@/lib/api/upload', () => ({
  uploadVideo: vi.fn().mockResolvedValue('test-job'),
}))

vi.mock('@/lib/api/transcript', () => ({
  fetchTranscript: vi.fn().mockImplementation(async () => ({
    transcript: createMockTranscript(),
    videoUrl: '/test_video.mp4',
  })),
}))

// Mock URL.createObjectURL for blob URL creation
globalThis.URL.createObjectURL = vi.fn(() => 'blob:test-url')

const createTestFile = () =>
  new File(['content'], 'test.mp4', { type: 'video/mp4', lastModified: Date.now() })

describe('transcriptStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTranscriptStore.getState().reset()
  })

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useTranscriptStore.getState()

      expect(state.transcript).toBeNull()
      expect(state.videoUrl).toBeNull()
      expect(state.viewState).toBe('upload')
      expect(state.processingStep).toBe('idle')
      expect(state.currentTime).toBe(0)
      expect(state.isPlaying).toBe(false)
      expect(state.activeSentenceId).toBeNull()
    })
  })

  describe('loadTranscript', () => {
    it('should load transcript successfully', async () => {
      const { loadTranscript } = useTranscriptStore.getState()

      await loadTranscript(createTestFile())

      const state = useTranscriptStore.getState()
      expect(state.transcript).toBeDefined()
      expect(state.transcript?.videoId).toBe('test_video')
      expect(state.videoUrl).toBe('blob:test-url')
      expect(state.viewState).toBe('editor')
      expect(state.processingStep).toBe('idle')
    })

    it('should set loading state during fetch', async () => {
      const { loadTranscript } = useTranscriptStore.getState()

      const promise = loadTranscript(createTestFile())

      expect(useTranscriptStore.getState().viewState).toBe('processing')
      expect(useTranscriptStore.getState().processingStep).toBe('upload')

      await promise

      expect(useTranscriptStore.getState().viewState).toBe('editor')
      expect(useTranscriptStore.getState().processingStep).toBe('idle')
    })
  })

  describe('toggleHighlight', () => {
    beforeEach(async () => {
      await useTranscriptStore.getState().loadTranscript(createTestFile())
    })

    it('should toggle sentence highlight from false to true', () => {
      const { toggleHighlight } = useTranscriptStore.getState()

      toggleHighlight('s1')

      const state = useTranscriptStore.getState()
      const sentence = state.transcript?.sections[0].sentences[0]
      expect(sentence?.isHighlight).toBe(true)
    })

    it('should toggle sentence highlight from true to false', () => {
      const { toggleHighlight } = useTranscriptStore.getState()

      // Toggle twice
      toggleHighlight('s1')
      toggleHighlight('s1')

      const state = useTranscriptStore.getState()
      const sentence = state.transcript?.sections[0].sentences[0]
      expect(sentence?.isHighlight).toBe(false)
    })

    it('should only toggle the specified sentence', () => {
      const { toggleHighlight } = useTranscriptStore.getState()

      toggleHighlight('s1')

      const state = useTranscriptStore.getState()
      const s1 = state.transcript?.sections[0].sentences[0]
      const s2 = state.transcript?.sections[0].sentences[1]

      expect(s1?.isHighlight).toBe(true)
      expect(s2?.isHighlight).toBe(false)
    })

    it('should do nothing if transcript is null', () => {
      useTranscriptStore.getState().reset()
      const { toggleHighlight } = useTranscriptStore.getState()

      // Should not throw
      expect(() => toggleHighlight('s1')).not.toThrow()
    })
  })

  describe('setCurrentTime', () => {
    it('should update current time', () => {
      const { setCurrentTime } = useTranscriptStore.getState()

      setCurrentTime(42.5)

      expect(useTranscriptStore.getState().currentTime).toBe(42.5)
    })
  })

  describe('setIsPlaying', () => {
    it('should update playing state', () => {
      const { setIsPlaying } = useTranscriptStore.getState()

      setIsPlaying(true)
      expect(useTranscriptStore.getState().isPlaying).toBe(true)

      setIsPlaying(false)
      expect(useTranscriptStore.getState().isPlaying).toBe(false)
    })
  })

  describe('setActiveSentenceId', () => {
    it('should update active sentence ID', () => {
      const { setActiveSentenceId } = useTranscriptStore.getState()

      setActiveSentenceId('s1')
      expect(useTranscriptStore.getState().activeSentenceId).toBe('s1')

      setActiveSentenceId(null)
      expect(useTranscriptStore.getState().activeSentenceId).toBeNull()
    })
  })

  describe('seekToSentence', () => {
    beforeEach(async () => {
      await useTranscriptStore.getState().loadTranscript(createTestFile())
    })

    it('should seek to sentence start time', () => {
      const { seekToSentence } = useTranscriptStore.getState()

      const startTime = seekToSentence('s2')

      expect(startTime).toBe(5)
      expect(useTranscriptStore.getState().currentTime).toBe(5)
    })

    it('should return null for non-existent sentence', () => {
      const { seekToSentence } = useTranscriptStore.getState()

      const startTime = seekToSentence('nonexistent')

      expect(startTime).toBeNull()
    })

    it('should return null if transcript is not loaded', () => {
      useTranscriptStore.getState().reset()
      const { seekToSentence } = useTranscriptStore.getState()

      const startTime = seekToSentence('s1')

      expect(startTime).toBeNull()
    })
  })

  describe('reset', () => {
    it('should reset to initial state', async () => {
      // Modify state
      await useTranscriptStore.getState().loadTranscript(createTestFile())
      useTranscriptStore.getState().setCurrentTime(50)
      useTranscriptStore.getState().setIsPlaying(true)

      // Reset
      useTranscriptStore.getState().reset()

      const state = useTranscriptStore.getState()
      expect(state.transcript).toBeNull()
      expect(state.videoUrl).toBeNull()
      expect(state.viewState).toBe('upload')
      expect(state.currentTime).toBe(0)
      expect(state.isPlaying).toBe(false)
    })
  })
})
