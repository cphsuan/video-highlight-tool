import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ControlBar } from '@/components/video/control-bar'
import { useTranscriptStore } from '@/stores/transcript-store'
import type { Transcript } from '@/types/transcript'
import { getHighlightSegments } from '@/utils/highlight-playback'

const createMockTranscript = (): Transcript => ({
  videoId: 'test-video',
  title: 'Test Video',
  duration: 100,
  sections: [
    {
      id: 'section1',
      title: 'Section 1',
      sentences: [
        { id: 's1', start: 5, end: 10, text: 'First sentence', isHighlight: true },
        { id: 's2', start: 10, end: 15, text: 'Second sentence', isHighlight: false },
        { id: 's3', start: 15, end: 20, text: 'Third sentence', isHighlight: true },
      ],
    },
    {
      id: 'section2',
      title: 'Section 2',
      sentences: [
        { id: 's4', start: 25, end: 30, text: 'Fourth sentence', isHighlight: true },
      ],
    },
  ],
})

describe('ControlBar', () => {
  beforeEach(() => {
    useTranscriptStore.getState().reset()
  })

  const setTranscriptState = (
    transcript: Transcript,
    state: Partial<ReturnType<typeof useTranscriptStore.getState>> = {}
  ) => {
    useTranscriptStore.setState({
      transcript,
      highlightSegments: getHighlightSegments(transcript),
      ...state,
    })
  }

  describe('rendering', () => {
    it('should render all control buttons', () => {
      render(<ControlBar />)

      expect(screen.getByLabelText('Previous highlight')).toBeInTheDocument()
      expect(screen.getByLabelText('Play')).toBeInTheDocument()
      expect(screen.getByLabelText('Next highlight')).toBeInTheDocument()
    })

    it('should display current time and duration', () => {
      setTranscriptState(createMockTranscript(), { currentTime: 65 })

      render(<ControlBar />)

      expect(screen.getByText('01:05 / 01:40')).toBeInTheDocument()
    })

    it('should show pause icon when playing', () => {
      useTranscriptStore.setState({ isPlaying: true })

      render(<ControlBar />)

      expect(screen.getByLabelText('Pause')).toBeInTheDocument()
    })

    it('should show play icon when paused', () => {
      useTranscriptStore.setState({ isPlaying: false })

      render(<ControlBar />)

      expect(screen.getByLabelText('Play')).toBeInTheDocument()
    })

    it('should display 00:00 / 00:00 when no transcript loaded', () => {
      render(<ControlBar />)

      expect(screen.getByText('00:00 / 00:00')).toBeInTheDocument()
    })
  })

  describe('play/pause button', () => {
    it('should call handlePlayPause when clicked', async () => {
      const user = userEvent.setup()
      const handlePlayPause = vi.fn()

      render(<ControlBar handlePlayPause={handlePlayPause} />)

      const playButton = screen.getByLabelText('Play')
      await user.click(playButton)

      expect(handlePlayPause).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when handlePlayPause is not provided', () => {
      render(<ControlBar />)

      const playButton = screen.getByLabelText('Play')
      expect(playButton).toBeDisabled()
    })
  })

  describe('previous highlight button', () => {
    it('should navigate to previous highlight', async () => {
      const user = userEvent.setup()
      const transcript = createMockTranscript()

      setTranscriptState(transcript, { currentTime: 26 })

      render(<ControlBar />)

      const prevButton = screen.getByLabelText('Previous highlight')
      await user.click(prevButton)

      // At time 26, previous highlight is at 25
      expect(useTranscriptStore.getState().currentTime).toBe(25)
    })

    it('should be disabled when no previous highlight exists', () => {
      const transcript = createMockTranscript()

      setTranscriptState(transcript, { currentTime: 0 })

      render(<ControlBar />)

      const prevButton = screen.getByLabelText('Previous highlight')
      expect(prevButton).toBeDisabled()
      expect(prevButton).toHaveAttribute('aria-disabled', 'true')
      expect(prevButton).toHaveAttribute('title', 'No previous highlight available')
    })

    it('should be disabled when no highlights exist', () => {
      const transcript: Transcript = {
        videoId: 'test',
        title: 'Test',
        duration: 100,
        sections: [
          {
            id: 'sec1',
            title: 'Section 1',
            sentences: [
              { id: 's1', start: 0, end: 5, text: 'No highlights', isHighlight: false },
            ],
          },
        ],
      }

      setTranscriptState(transcript, { currentTime: 10 })

      render(<ControlBar />)

      const prevButton = screen.getByLabelText('Previous highlight')
      expect(prevButton).toBeDisabled()
    })

    it('should have correct title when enabled', () => {
      const transcript = createMockTranscript()

      setTranscriptState(transcript, { currentTime: 26 })

      render(<ControlBar />)

      const prevButton = screen.getByLabelText('Previous highlight')
      expect(prevButton).toHaveAttribute('title', 'Go to previous highlight')
    })

    it('should navigate to most recent previous highlight', async () => {
      const user = userEvent.setup()
      const transcript = createMockTranscript()

      // Set time to 18 seconds (within highlight at 15-20s)
      // getPreviousHighlightSegment looks for segments with start < 18
      // Should find highlights at 5 and 15, returns the most recent one (15)
      setTranscriptState(transcript, { currentTime: 18 })

      render(<ControlBar />)

      const prevButton = screen.getByLabelText('Previous highlight')
      await user.click(prevButton)

      expect(useTranscriptStore.getState().currentTime).toBe(15)
    })
  })

  describe('next highlight button', () => {
    it('should navigate to next highlight', async () => {
      const user = userEvent.setup()
      const transcript = createMockTranscript()

      setTranscriptState(transcript, { currentTime: 7 })

      render(<ControlBar />)

      const nextButton = screen.getByLabelText('Next highlight')
      await user.click(nextButton)

      expect(useTranscriptStore.getState().currentTime).toBe(15)
    })

    it('should be disabled when no next highlight exists', () => {
      const transcript = createMockTranscript()

      setTranscriptState(transcript, { currentTime: 50 })

      render(<ControlBar />)

      const nextButton = screen.getByLabelText('Next highlight')
      expect(nextButton).toBeDisabled()
      expect(nextButton).toHaveAttribute('aria-disabled', 'true')
      expect(nextButton).toHaveAttribute('title', 'No next highlight available')
    })

    it('should be disabled when no highlights exist', () => {
      const transcript: Transcript = {
        videoId: 'test',
        title: 'Test',
        duration: 100,
        sections: [
          {
            id: 'sec1',
            title: 'Section 1',
            sentences: [
              { id: 's1', start: 0, end: 5, text: 'No highlights', isHighlight: false },
            ],
          },
        ],
      }

      setTranscriptState(transcript, { currentTime: 0 })

      render(<ControlBar />)

      const nextButton = screen.getByLabelText('Next highlight')
      expect(nextButton).toBeDisabled()
    })

    it('should have correct title when enabled', () => {
      const transcript = createMockTranscript()

      setTranscriptState(transcript, { currentTime: 7 })

      render(<ControlBar />)

      const nextButton = screen.getByLabelText('Next highlight')
      expect(nextButton).toHaveAttribute('title', 'Go to next highlight')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ControlBar />)

      expect(screen.getByLabelText('Previous highlight')).toBeInTheDocument()
      expect(screen.getByLabelText('Play')).toBeInTheDocument()
      expect(screen.getByLabelText('Next highlight')).toBeInTheDocument()
    })

    it('should update ARIA label when playing state changes', () => {
      const { rerender } = render(<ControlBar />)

      expect(screen.getByLabelText('Play')).toBeInTheDocument()

      act(() => {
        useTranscriptStore.setState({ isPlaying: true })
      })
      rerender(<ControlBar />)

      expect(screen.getByLabelText('Pause')).toBeInTheDocument()
    })

    it('should have aria-disabled attribute on disabled buttons', () => {
      useTranscriptStore.setState({ currentTime: 0 })

      render(<ControlBar />)

      const prevButton = screen.getByLabelText('Previous highlight')
      expect(prevButton).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('time formatting', () => {
    it('should format time correctly for minutes:seconds', () => {
      setTranscriptState(createMockTranscript(), { currentTime: 125 })

      render(<ControlBar />)

      expect(screen.getByText('02:05 / 01:40')).toBeInTheDocument()
    })

    it('should pad single-digit seconds with zero', () => {
      setTranscriptState(createMockTranscript(), { currentTime: 5 })

      render(<ControlBar />)

      expect(screen.getByText('00:05 / 01:40')).toBeInTheDocument()
    })

    it('should handle zero duration gracefully', () => {
      const transcript = createMockTranscript()
      transcript.duration = 0

      setTranscriptState(transcript, { currentTime: 0 })

      render(<ControlBar />)

      expect(screen.getByText('00:00 / 00:00')).toBeInTheDocument()
    })
  })
})
