import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VideoPlayer } from '@/components/video/video-player'
import { useTranscriptStore } from '@/stores/transcript-store'
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
        { id: 's1', start: 5, end: 10, text: 'First sentence', isHighlight: true },
        { id: 's2', start: 10, end: 15, text: 'Second sentence', isHighlight: false },
      ],
    },
  ],
})

describe('VideoPlayer', () => {
  beforeEach(() => {
    useTranscriptStore.getState().reset()
  })

  describe('rendering', () => {
    it('should display error message when no video is loaded', () => {
      render(<VideoPlayer />)

      expect(screen.getByText('Oops! No video loaded.')).toBeInTheDocument()
    })

    it('should render video player when video is loaded', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:test-url',
        highlightSegments: [
          {
            sentenceId: 's1',
            start: 5,
            end: 10,
            text: 'First sentence',
            sectionId: 'section1',
            sectionTitle: 'Section 1',
          },
        ],
      })

      render(<VideoPlayer />)

      expect(screen.getByText('Preview')).toBeInTheDocument()
      const video = screen.getByLabelText('Video player showing highlight segments')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('src', 'blob:test-url')
    })

    it('should render all child components', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:test-url',
        highlightSegments: [],
      })

      render(<VideoPlayer />)

      // Check for Preview header
      expect(screen.getByText('Preview')).toBeInTheDocument()

      // Check for video element
      expect(screen.getByLabelText('Video player showing highlight segments')).toBeInTheDocument()

      // Check for timeline (has data-testid)
      expect(screen.getByTestId('timeline-bar')).toBeInTheDocument()
    })
  })

  describe('video element attributes', () => {
    it('should have correct video attributes', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:test-url',
        highlightSegments: [],
      })

      render(<VideoPlayer />)

      const video = screen.getByLabelText('Video player showing highlight segments') as HTMLVideoElement

      expect(video).toHaveAttribute('preload', 'auto')
      expect(video).toHaveAttribute('width', '600')
      expect(video).toHaveAttribute('src', 'blob:test-url')
    })

    it('should have proper ARIA label', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:test-url',
        highlightSegments: [],
      })

      render(<VideoPlayer />)

      const video = screen.getByLabelText('Video player showing highlight segments')
      expect(video).toBeInTheDocument()
    })
  })

  describe('video URL handling', () => {
    it('should update video source when videoUrl changes', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:initial-url',
        highlightSegments: [],
      })

      const { rerender } = render(<VideoPlayer />)

      let video = screen.getByLabelText('Video player showing highlight segments') as HTMLVideoElement
      expect(video.src).toContain('blob:initial-url')

      // Update video URL
      useTranscriptStore.setState({ videoUrl: 'blob:updated-url' })
      rerender(<VideoPlayer />)

      video = screen.getByLabelText('Video player showing highlight segments') as HTMLVideoElement
      expect(video.src).toContain('blob:updated-url')
    })

    it('should show error when videoUrl becomes null', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:test-url',
        highlightSegments: [],
      })

      const { rerender } = render(<VideoPlayer />)
      expect(screen.getByLabelText('Video player showing highlight segments')).toBeInTheDocument()

      // Remove video URL
      useTranscriptStore.setState({ videoUrl: null })
      rerender(<VideoPlayer />)

      expect(screen.getByText('Oops! No video loaded.')).toBeInTheDocument()
      expect(screen.queryByLabelText('Video player showing highlight segments')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible structure', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:test-url',
        highlightSegments: [],
      })

      render(<VideoPlayer />)

      // Video should have ARIA label
      expect(screen.getByLabelText('Video player showing highlight segments')).toBeInTheDocument()

      // Timeline should have ARIA label
      expect(screen.getByLabelText('Video timeline')).toBeInTheDocument()
    })
  })

  describe('layout', () => {
    it('should render with correct structure', () => {
      const transcript = createMockTranscript()
      useTranscriptStore.setState({
        transcript,
        videoUrl: 'blob:test-url',
        highlightSegments: [],
      })

      const { container } = render(<VideoPlayer />)

      // Check for main container
      const mainContainer = container.querySelector('.h-full.flex.flex-col')
      expect(mainContainer).toBeInTheDocument()

      // Check for header
      expect(screen.getByText('Preview')).toBeInTheDocument()

      // Check for video container
      const videoContainer = container.querySelector('.relative.flex-1.bg-black')
      expect(videoContainer).toBeInTheDocument()
    })
  })
})
