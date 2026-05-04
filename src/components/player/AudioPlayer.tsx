'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// ============================================================================
// INTERFACES
// ============================================================================

export interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
}

interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

// ============================================================================
// AUDIO PLAYER COMPONENT
// ============================================================================

export default function AudioPlayer({ src, title, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
  })

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }))
    }

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }))
    }

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
      audio.currentTime = 0
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlayPause()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        seek(state.currentTime - 5)
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        seek(state.currentTime + 5)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [state.currentTime])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (state.isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }

    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (!audio) return

    const clampedTime = Math.max(0, Math.min(time, state.duration))
    audio.currentTime = clampedTime
    setState(prev => ({ ...prev, currentTime: clampedTime }))
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * state.duration
    seek(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseInt(e.target.value)
    audio.volume = newVolume / 100
    setState(prev => ({ ...prev, volume: newVolume, isMuted: newVolume === 0 }))
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (state.isMuted) {
      audio.volume = state.volume / 100
      setState(prev => ({ ...prev, isMuted: false }))
    } else {
      audio.volume = 0
      setState(prev => ({ ...prev, isMuted: true }))
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = state.duration > 0 
    ? (state.currentTime / state.duration) * 100 
    : 0

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`bg-gray-900 rounded-lg p-4 ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Title */}
      {title && (
        <div className="text-white text-sm font-medium mb-3 truncate">
          {title}
        </div>
      )}

      {/* Controls Container */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div
            className="h-2 bg-gray-700 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-[#FF6B35] rounded-full transition-all group-hover:bg-[#ff8555]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="w-10 h-10 flex items-center justify-center bg-[#FF6B35] hover:bg-[#ff8555] rounded-full transition-colors"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? (
              <Pause className="w-5 h-5 text-white" fill="white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            )}
          </button>

          {/* Volume Controls - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 flex-1">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={state.isMuted ? 'Unmute' : 'Mute'}
            >
              {state.isMuted || state.volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={state.isMuted ? 0 : state.volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint - Desktop only */}
      <div className="hidden lg:block mt-3 text-xs text-gray-500">
        Space: Play/Pause • ← →: Seek 5s
      </div>
    </div>
  )
}
