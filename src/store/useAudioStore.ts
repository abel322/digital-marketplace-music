import { create } from 'zustand'

export interface Track {
  id: string
  title: string
  artist: string
  audioUrl: string
  coverUrl?: string
  bpm?: number | string
  key?: string
}

export interface AudioStoreState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean

  // Actions
  playTrack: (track: Track) => void
  togglePlay: () => void
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  closePlayer: () => void
}

export const useAudioStore = create<AudioStoreState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,

  playTrack: (track: Track) => {
    const { currentTrack, isPlaying } = get()
    if (currentTrack?.id === track.id) {
      set({ isPlaying: !isPlaying })
    } else {
      set({
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      })
    }
  },

  togglePlay: () => {
    const { currentTrack, isPlaying } = get()
    if (!currentTrack) return
    set({ isPlaying: !isPlaying })
  },

  pause: () => {
    set({ isPlaying: false })
  },

  seek: (time: number) => {
    set({ currentTime: time })
  },

  setVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    set({
      volume: clampedVolume,
      isMuted: clampedVolume === 0 ? true : get().isMuted,
    })
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }))
  },

  setCurrentTime: (time: number) => {
    set({ currentTime: time })
  },

  setDuration: (duration: number) => {
    set({ duration: duration })
  },

  closePlayer: () => {
    set({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    })
  },
}))
