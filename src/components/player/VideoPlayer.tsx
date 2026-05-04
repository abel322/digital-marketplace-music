'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

// ============================================================================
// INTERFACES
// ============================================================================

export interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
}

interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  showControls: boolean
}

// ============================================================================
// VIDEO PLAYER COMPONENT
// ============================================================================

export default function VideoPlayer({ src, poster, title, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
    isFullscreen: false,
    showControls: true,
  })

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: video.duration }))
    }

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: video.currentTime }))
    }

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
      video.currentTime = 0
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setState(prev => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Auto-hide controls
  useEffect(() => {
    if (state.isPlaying && state.showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, showControls: false }))
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [state.isPlaying, state.showControls])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (state.isPlaying) {
      video.pause()
    } else {
      video.play()
    }

    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const seek = (time: number) => {
    const video = videoRef.current
    if (!video) return

    const clampedTime = Math.max(0, Math.min(time, state.duration))
    video.currentTime = clampedTime
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
    const video = videoRef.current
    if (!video) return

    const newVolume = parseInt(e.target.value)
    video.volume = newVolume / 100
    setState(prev => ({ ...prev, volume: newVolume, isMuted: newVolume === 0 }))
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (state.isMuted) {
      video.volume = state.volume / 100
      setState(prev => ({ ...prev, isMuted: false }))
    } else {
      video.volume = 0
      setState(prev => ({ ...prev, isMuted: true }))
    }
  }

  const toggleFullscreen = async () => {
    const container = containerRef.current
    if (!container) return

    try {
      if (!state.isFullscreen) {
        await container.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const handleMouseMove = () => {
    setState(prev => ({ ...prev, showControls: true }))
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
  }

  const handleVideoClick = () => {
    togglePlayPause()
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
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      style={{ aspectRatio: '16/9' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => state.isPlaying && setState(prev => ({ ...prev, showControls: false }))}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleVideoClick}
        preload="metadata"
      />

      {/* Play Button Overlay (when paused) */}
      {!state.isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="w-20 h-20 flex items-center justify-center bg-[#FF6B35] hover:bg-[#ff8555] rounded-full transition-colors">
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          state.showControls || !state.isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Title */}
        {title && (
          <div className="text-white text-sm font-medium mb-2 truncate">
            {title}
          </div>
        )}

        {/* Progress Bar */}
        <div
          className="h-1 bg-gray-600 rounded-full cursor-pointer mb-3 group"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-[#FF6B35] rounded-full transition-all group-hover:h-1.5"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="text-white hover:text-[#FF6B35] transition-colors"
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? (
              <Pause className="w-6 h-6" fill="white" />
            ) : (
              <Play className="w-6 h-6" fill="white" />
            )}
          </button>

          {/* Time Display */}
          <div className="text-white text-sm">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </div>

          <div className="flex-1" />

          {/* Volume Controls - Desktop only */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-[#FF6B35] transition-colors"
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
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
              aria-label="Volume"
            />
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-[#FF6B35] transition-colors"
            aria-label={state.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {state.isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
