'use client'

import React from 'react'
import { useAudioStore, Track } from '@/store/useAudioStore'
import { Play, Pause } from 'lucide-react'

export interface PlayPreviewButtonProps {
  track: Track
  variant?: 'icon' | 'button' | 'pill' | 'overlay'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export default function PlayPreviewButton({
  track,
  variant = 'icon',
  size = 'md',
  className = '',
  label,
}: PlayPreviewButtonProps) {
  const { currentTrack, isPlaying, playTrack } = useAudioStore()

  const isCurrent = currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrent && isPlaying

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    playTrack(track)
  }

  // Size configurations
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
  }

  const buttonSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  // ============================================================================
  // OVERLAY VARIANT (e.g. for Product Card Image Hover)
  // ============================================================================
  if (variant === 'overlay') {
    return (
      <button
        onClick={handleClick}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-xl ${
          isCurrentlyPlaying
            ? 'bg-[#FF6B35] text-white scale-110 ring-4 ring-[#FF6B35]/40 animate-pulse'
            : 'bg-white/95 text-neutral-900 hover:bg-[#FF6B35] hover:text-white hover:scale-110'
        } ${className}`}
        aria-label={isCurrentlyPlaying ? `Pausar ${track.title}` : `Escuchar muestra de ${track.title}`}
        title={isCurrentlyPlaying ? 'Pausar' : 'Escuchar demo'}
      >
        {isCurrentlyPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
        )}
      </button>
    )
  }

  // ============================================================================
  // PILL VARIANT (e.g. with text "Demo" / "Preview")
  // ============================================================================
  if (variant === 'pill') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm ${
          isCurrentlyPlaying
            ? 'bg-[#FF6B35] text-white ring-2 ring-[#FF6B35]/50 animate-pulse'
            : 'bg-neutral-800/80 hover:bg-[#FF6B35] text-neutral-200 hover:text-white border border-neutral-700 hover:border-[#FF6B35]'
        } ${className}`}
        aria-label={isCurrentlyPlaying ? `Pausar ${track.title}` : `Reproducir ${track.title}`}
      >
        {isCurrentlyPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        )}
        <span>{label || (isCurrentlyPlaying ? 'Pausar' : 'Escuchar')}</span>
      </button>
    )
  }

  // ============================================================================
  // BUTTON VARIANT (Solid button with text)
  // ============================================================================
  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          isCurrentlyPlaying
            ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] text-white shadow-md shadow-[#FF6B35]/30'
            : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
        } ${className}`}
        aria-label={isCurrentlyPlaying ? `Pausar ${track.title}` : `Reproducir ${track.title}`}
      >
        {isCurrentlyPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
        <span>{label || (isCurrentlyPlaying ? 'Pausar demo' : 'Reproducir demo')}</span>
      </button>
    )
  }

  // ============================================================================
  // ICON VARIANT (Default round icon button)
  // ============================================================================
  return (
    <button
      onClick={handleClick}
      className={`rounded-full flex items-center justify-center transition-all duration-200 ${buttonSizes[size]} ${
        isCurrentlyPlaying
          ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/40 scale-105'
          : 'bg-neutral-800/90 text-neutral-200 hover:bg-[#FF6B35] hover:text-white hover:scale-105'
      } ${className}`}
      aria-label={isCurrentlyPlaying ? `Pausar ${track.title}` : `Escuchar ${track.title}`}
      title={isCurrentlyPlaying ? 'Pausar' : 'Reproducir'}
    >
      {isCurrentlyPlaying ? (
        <Pause className={`${iconSizes[size]} fill-current`} />
      ) : (
        <Play className={`${iconSizes[size]} fill-current ml-0.5`} />
      )}
    </button>
  )
}
