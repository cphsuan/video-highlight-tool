import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/utils/time-utils'

interface VideoControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlayPause: () => void
  onSeek: (time: number) => void
  onPrevious?: () => void
  onNext?: () => void
}

export const VideoControls = ({
  isPlaying,
  currentTime,
  onPlayPause,
  onPrevious,
  onNext,
}: VideoControlsProps) => {
  return (
    <div
      data-testid="video-controls"
      className="flex items-center justify-between gap-6"
    >
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        className="text-white hover:bg-white/20 h-10 w-10"
      >
        <SkipBack className="w-6 h-6" />
      </Button>

      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlayPause}
        className="text-white hover:bg-white/20 h-12 w-12"
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8" />
        )}
      </Button>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        className="text-white hover:bg-white/20 h-10 w-10"
      >
        <SkipForward className="w-6 h-6" />
      </Button>

      {/* Time Display */}
      <div className="ml-auto text-white font-mono text-lg">
        {formatTime(currentTime)}
      </div>
    </div>
  )
}
