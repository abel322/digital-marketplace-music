const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'
const API_KEY = process.env.YOUTUBE_API_KEY

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  durationSeconds: number
  channelTitle: string
  publishedAt: string
  viewCount: string
}

export interface YouTubePlaylist {
  id: string
  title: string
  description: string
  thumbnail: string
  itemCount: number
  channelTitle: string
}

export async function searchVideos(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`
  )
  const data = await res.json()
  if (!data.items) return []
  const ids = data.items.map((item: any) => item.id.videoId).join(',')
  return getVideosByIds(ids)
}

export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  const videos = await getVideosByIds(videoId)
  return videos[0] ?? null
}

export async function getVideosByIds(ids: string): Promise<YouTubeVideo[]> {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${ids}&key=${API_KEY}`
  )
  const data = await res.json()
  if (!data.items) return []
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url,
    duration: item.contentDetails.duration,
    durationSeconds: parseDuration(item.contentDetails.duration),
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics?.viewCount || '0',
  }))
}

export async function getChannelPlaylists(channelId: string): Promise<YouTubePlaylist[]> {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=20&key=${API_KEY}`
  )
  const data = await res.json()
  if (!data.items) return []
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail:
      item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    itemCount: item.contentDetails.itemCount,
    channelTitle: item.snippet.channelTitle,
  }))
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
}

export function getThumbnailUrl(videoId: string, quality: 'default' | 'hq' | 'maxres' = 'hq'): string {
  const qualityMap = { default: 'default', hq: 'hqdefault', maxres: 'maxresdefault' }
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  return hours * 3600 + minutes * 60 + seconds
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}
