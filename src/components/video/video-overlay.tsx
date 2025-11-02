import { useCurrentHighlightText } from '@/stores/transcript-store'

export const VideoOverlay = () => {
  const currentText = useCurrentHighlightText()

  if (!currentText) return null

  return (
    <div
      data-testid="video-overlay"
      className="absolute bottom-20 left-0 right-0 flex justify-center px-4 pointer-events-none"
    >
      <div
        className="
          bg-black/80 backdrop-blur-sm
          text-white px-6 py-3 rounded-lg
          max-w-2xl text-center
          animate-in fade-in duration-300
          shadow-xl border border-white/20
        "
      >
        <p className="text-lg font-medium leading-relaxed">{currentText}</p>
      </div>
    </div>
  )
}
