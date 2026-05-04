'use client'

import { useState } from 'react'
import {
    Box, Typography, Stack, Skeleton,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import YouTubeIcon from '@mui/icons-material/YouTube'

interface YouTubeEmbedProps {
    videoId: string
    title?: string
    aspectRatio?: '16/9' | '4/3'
    showBranding?: boolean
    autoplay?: boolean
}

/**
 * Lazy-loaded YouTube embed with a custom poster/thumbnail that only
 * loads the actual iframe after the user clicks play (lite-youtube pattern).
 * This avoids adding 500 KB of YouTube scripts on page load.
 */
export default function YouTubeEmbed({
    videoId,
    title = 'Video',
    aspectRatio = '16/9',
    showBranding = true,
    autoplay = true,
}: YouTubeEmbedProps) {
    const [active, setActive] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    const paddingTop = aspectRatio === '16/9' ? '56.25%' : '75%'

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                paddingTop,
                borderRadius: 3,
                overflow: 'hidden',
                background: '#000',
                cursor: active ? 'default' : 'pointer',
                '&:hover .play-btn': !active ? { transform: 'scale(1.1)' } : {},
            }}
            onClick={() => !active && setActive(true)}
        >
            {/* Skeleton while thumbnail loads */}
            {!imageLoaded && !active && (
                <Skeleton
                    variant="rectangular"
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'none' }}
                />
            )}

            {/* Thumbnail */}
            {!active && (
                <Box
                    component="img"
                    src={thumbnailUrl}
                    alt={title}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e: any) => { e.currentTarget.src = fallbackUrl; setImageLoaded(true) }}
                    sx={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        transition: 'filter 0.3s ease',
                        '&:hover': { filter: 'brightness(0.85)' },
                    }}
                />
            )}

            {/* Dark overlay */}
            {!active && (
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 40%)' }} />
            )}

            {/* Play Button */}
            {!active && (
                <Box
                    className="play-btn"
                    sx={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'transform 0.25s ease',
                    }}
                >
                    <Box sx={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(255,107,53,0.5)',
                    }}>
                        <PlayArrowIcon sx={{ color: '#fff', fontSize: 38, ml: 0.5 }} />
                    </Box>
                </Box>
            )}

            {/* Title overlay */}
            {!active && showBranding && imageLoaded && (
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <YouTubeIcon sx={{ color: '#FF0000', fontSize: 20 }} />
                        <Typography variant="caption" fontWeight={600} color="#fff" noWrap>
                            {title}
                        </Typography>
                    </Stack>
                </Box>
            )}

            {/* Actual iframe (only rendered after click) */}
            {active && (
                <Box
                    component="iframe"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sx={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        border: 'none',
                    }}
                />
            )}
        </Box>
    )
}
