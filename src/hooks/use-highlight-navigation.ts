import { useEffect } from 'react'
import type { HighlightSegment } from '@/types/transcript'
import { getNextHighlightSegment, getPreviousHighlightSegment } from '@/utils/highlight-playback'

interface UseHighlightNavigationProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  highlightSegments: HighlightSegment[]
  currentTime: number
  isPlaying: boolean
  isPlayerReady: boolean
  seekWithPlaybackResume: (time: number) => void
}

/**
 * Custom hook to handle keyboard navigation between highlight segments
 */
export const useHighlightNavigation = ({
  videoRef,
  highlightSegments,
  currentTime,
  isPlaying,
  isPlayerReady,
  seekWithPlaybackResume,
}: UseHighlightNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case 'ArrowRight': {
          // Skip to next highlight
          e.preventDefault()
          const nextSegment = getNextHighlightSegment(highlightSegments, currentTime)
          if (nextSegment) {
            seekWithPlaybackResume(nextSegment.start)
          }
          break
        }
        case 'ArrowLeft': {
          // Skip to previous highlight (or beginning of current if we're past 3s in)
          e.preventDefault()
          const previousSegment = getPreviousHighlightSegment(
            highlightSegments,
            currentTime - 3
          )
          if (previousSegment) {
            seekWithPlaybackResume(previousSegment.start)
          }
          break
        }
        case ' ': {
          // Space bar: toggle play/pause
          e.preventDefault()
          if (isPlayerReady && videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause()
            } else {
              videoRef.current.play()
            }
          }
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [highlightSegments, currentTime, isPlaying, isPlayerReady, videoRef, seekWithPlaybackResume])
}
