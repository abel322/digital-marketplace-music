'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Play, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import axios from 'axios'

// ============================================================================
// INTERFACES
// ============================================================================

export interface YouTubeVideo {
  videoId: string
  title: string
  channelTitle: string
  description: string
  thumbnail: string
  duration: number // in seconds
  publishedAt: string
}

export interface YouTubeSearchProps {
  onVideoSelect: (video: YouTubeVideo) => void
  className?: string
}

interface YouTubeSearchState {
  query: string
  results: YouTubeVideo[]
  loading: boolean
  error: string | null
  selectedVideo: YouTubeVideo | null
  showPreview: boolean
  pageToken: string | null
  prevPageToken: string | null
}

// ============================================================================
// YOUTUBE SEARCH COMPONENT
// ============================================================================

export default function YouTubeSearch({ onVideoSelect, className = '' }: YouTubeSearchProps) {
  const { user } = useAuth()
  const [state, setState] = useState<YouTubeSearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    selectedVideo: null,
    showPreview: false,
    pageToken: null,
    prevPageToken: null,
  })

  // Debounced search
  useEffect(() => {
    if (state.query.length < 3) return

    const timeoutId = setTimeout(() => {
      searchVideos(state.query)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [state.query])

  // ============================================================================
  // ROLE RESTRICTION
  // ============================================================================

  if (!user || (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          You do not have permission to access YouTube search. This feature is only available for admins and instructors.
        </p>
      </div>
    )
  }

  // ============================================================================
  // SEARCH VIDEOS
  // ============================================================================

  const searchVideos = async (query: string, pageToken?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const params = new URLSearchParams({
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: '12',
        ...(pageToken && { pageToken }),
      })

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?${params.toString()}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )

      const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',')

      // Get video details including duration
      const detailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=contentDetails,snippet&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      )

      const videos: YouTubeVideo[] = detailsResponse.data.items.map((item: any) => ({
        videoId: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: parseDuration(item.contentDetails.duration),
        publishedAt: item.snippet.publishedAt,
      }))

      setState(prev => ({
        ...prev,
        results: videos,
        loading: false,
        pageToken: response.data.nextPageToken || null,
        prevPageToken: response.data.prevPageToken || null,
      }))
    } catch (error) {
      console.error('YouTube search error:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to search YouTube. Please check your API key and try again.',
      }))
    }
  }

  // ============================================================================
  // PARSE DURATION (ISO 8601 to seconds)
  // ============================================================================

  const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return 0

    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0

    return hours * 3600 + minutes * 60 + seconds
  }

  // ============================================================================
  // FORMAT DURATION
  // ============================================================================

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (state.query.length >= 3) {
      searchVideos(state.query)
    }
  }

  const handlePreview = (video: YouTubeVideo) => {
    setState(prev => ({ ...prev, selectedVideo: video, showPreview: true }))
  }

  const handleSelect = (video: YouTubeVideo) => {
    onVideoSelect(video)
    setState(prev => ({ ...prev, showPreview: false, selectedVideo: null }))
  }

  const handleNextPage = () => {
    if (state.pageToken) {
      searchVideos(state.query, state.pageToken)
    }
  }

  const handlePrevPage = () => {
    if (state.prevPageToken) {
      searchVideos(state.query, state.prevPageToken)
    }
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={state.query}
            onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
            placeholder="Search YouTube videos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
          />
        </div>
        <button
          type="submit"
          disabled={state.loading || state.query.length < 3}
          className="px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff8555] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </form>

      {/* Error Message */}
      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{state.error}</p>
          <button
            onClick={() => searchVideos(state.query)}
            className="mt-2 text-sm text-red-600 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results Grid */}
      {state.results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.results.map((video) => (
              <div
                key={video.videoId}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{video.channelTitle}</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(video)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <Play className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleSelect(video)}
                      className="flex-1 px-3 py-1.5 text-sm bg-[#FF6B35] text-white rounded hover:bg-[#ff8555]"
                    >
                      Use This
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={!state.prevPageToken}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!state.pageToken}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Preview Modal */}
      {state.showPreview && state.selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">{state.selectedVideo.title}</h2>
              <button
                onClick={() => setState(prev => ({ ...prev, showPreview: false }))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${state.selectedVideo.videoId}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <button
                onClick={() => handleSelect(state.selectedVideo!)}
                className="w-full px-4 py-2 bg-[#FF6B35] text-white rounded hover:bg-[#ff8555]"
              >
                Use This Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
