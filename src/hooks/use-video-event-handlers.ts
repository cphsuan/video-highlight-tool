import { useEffect } from 'react'

interface UseVideoEventHandlersProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  setCurrentTime: (time: number) => void
  setIsPlaying: (playing: boolean) => void
  setIsPlayerReady: (ready: boolean) => void
  setPlayerError: (error: { message: string; error: Error } | null) => void
  isSeekingRef: React.MutableRefObject<boolean>
}

/**
 * Custom hook to manage all video element event handlers
 */
export const useVideoEventHandlers = ({
  videoRef,
  setCurrentTime,
  setIsPlaying,
  setIsPlayerReady,
  setPlayerError,
  isSeekingRef,
}: UseVideoEventHandlersProps) => {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      // Don't update store during seeking to prevent race conditions
      if (!isSeekingRef.current) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      setIsPlayerReady(true)
      setPlayerError(null)
    }

    const handleCanPlay = () => {
      setIsPlayerReady(true)
    }

    const handleError = (e: Event) => {
      console.error('Video error:', e)
      setPlayerError({
        message: 'Failed to load video. Please check the video file.',
        error: new Error('Video loading failed'),
      })
      setIsPlaying(false)
    }

    const handleSeeking = () => {
      // Seeking started
    }

    const handleSeeked = () => {
      // Don't clear isSeekingRef here - let the seeking function manage it
      // This prevents conflicts with seekWithPlaybackResume
    }

    const handlePlay = () => {
      // Clear seeking flag when video actually starts playing
      if (isSeekingRef.current) {
        isSeekingRef.current = false
      }
      setIsPlaying(true)
    }

    const handlePause = () => {
      // Don't update state if we're in the middle of a seek operation
      if (!isSeekingRef.current) {
        setIsPlaying(false)
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('seeking', handleSeeking)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('seeking', handleSeeking)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoRef, setCurrentTime, setIsPlaying, setIsPlayerReady, setPlayerError, isSeekingRef])
}
