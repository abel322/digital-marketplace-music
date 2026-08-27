'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useAudioStore } from '@/store/useAudioStore'
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  X,
  Music2,
  RotateCcw,
  RotateCw,
} from 'lucide-react'

// Helper function to format time in mm:ss
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export default function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    pause,
    seek,
    setVolume,
    toggleMute,
    setCurrentTime,
    setDuration,
    closePlayer,
  } = useAudioStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sync isPlaying state with HTML5 audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay or interruption error handler
          console.warn('Audio play request prevented or interrupted:', err)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

  // Sync volume and mute with audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  // Don't render until mounted on client or if no track is active
  if (!isMounted || !currentTrack) {
    return null
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    seek(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return
    const newTime = Math.max(0, Math.min(duration || 100, currentTime + seconds))
    seek(newTime)
    audioRef.current.currentTime = newTime
  }

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 text-white shadow-2xl transition-all duration-300 ease-in-out"
      role="region"
      aria-label="Reproductor de audio global"
    >
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="auto"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration
          if (d && !isNaN(d)) setDuration(d)
        }}
        onDurationChange={(e) => {
          const d = e.currentTarget.duration
          if (d && !isNaN(d)) setDuration(d)
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime)
        }}
        onEnded={() => {
          pause()
          setCurrentTime(0)
          if (audioRef.current) audioRef.current.currentTime = 0
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-6">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: TRACK INFO (LEFT) */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0 justify-between md:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            {/* Cover art thumbnail */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-neutral-800 border border-neutral-700/60 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md">
              {currentTrack.coverUrl ? (
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#FF6B35]/30 to-[#4ECDC4]/30 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-[#FF6B35]" />
                </div>
              )}

              {/* Playing indicator animation */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-1 gap-0.5">
                  <span className="w-0.5 h-3 bg-[#FF6B35] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-0.5 h-4 bg-[#FF6B35] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-0.5 h-2 bg-[#FF6B35] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>

            {/* Track Title & Artist */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white truncate leading-tight">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-neutral-400 truncate mt-0.5">
                {currentTrack.artist || 'DigitalMarket'}
              </p>

              {/* Badges for BPM & Key */}
              {(currentTrack.bpm || currentTrack.key) && (
                <div className="flex items-center gap-1.5 mt-1">
                  {currentTrack.bpm && (
                    <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FF6B35]/20 text-[#FF8C61] border border-[#FF6B35]/30 leading-none">
                      {currentTrack.bpm} BPM
                    </span>
                  )}
                  {currentTrack.key && (
                    <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#4ECDC4]/20 text-[#6FD9D1] border border-[#4ECDC4]/30 leading-none">
                      {currentTrack.key}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile-only close button */}
          <button
            onClick={closePlayer}
            className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            aria-label="Cerrar reproductor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: PLAYBACK CONTROLS & PROGRESS (CENTER) */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4 max-w-xl">
          {/* Action Buttons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Rewind 5s */}
            <button
              onClick={() => handleSkip(-5)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Retroceder 5 segundos"
              title="Retroceder 5s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] hover:from-[#E65A2E] hover:to-[#FF6B35] text-white flex items-center justify-center shadow-lg shadow-[#FF6B35]/30 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            {/* Forward 5s */}
            <button
              onClick={() => handleSkip(5)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Adelantar 5 segundos"
              title="Adelantar 5s"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Time Scrubber Bar */}
          <div className="w-full flex items-center gap-2.5 sm:gap-3 text-xs text-neutral-400 font-mono select-none">
            <span className="min-w-[34px] text-right text-[11px] sm:text-xs">
              {formatTime(currentTime)}
            </span>

            <div className="relative flex-1 flex items-center group py-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeekChange}
                className="w-full h-1.5 group-hover:h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-[#FF6B35] transition-all duration-150"
                style={{
                  background: `linear-gradient(to right, #FF6B35 ${progressPercent}%, #404040 ${progressPercent}%)`,
                }}
                aria-label="Barra de progreso de audio"
              />
            </div>

            <span className="min-w-[34px] text-left text-[11px] sm:text-xs">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: VOLUME & CLOSE (RIGHT) */}
        {/* ========================================================================= */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Volume range slider */}
          <div className="w-20 lg:w-28 flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeSliderChange}
              className="w-full h-1.5 bg-neutral-700 rounded-full appearance-none cursor-pointer accent-[#FF6B35] transition-all"
              style={{
                background: `linear-gradient(to right, #FF6B35 ${(isMuted ? 0 : volume) * 100}%, #404040 ${(isMuted ? 0 : volume) * 100}%)`,
              }}
              aria-label="Control de volumen"
            />
          </div>

          {/* Close Player Button */}
          <button
            onClick={closePlayer}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors ml-1"
            aria-label="Cerrar reproductor"
            title="Cerrar reproductor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  )
}
