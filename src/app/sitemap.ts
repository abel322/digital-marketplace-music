import { MetadataRoute } from 'next'

// In production this would fetch real product slugs from the DB
const STATIC_PRODUCTS = [
    'produccion-musical-completa',
    'trap-essentials-2024',
    'mezcla-mastering-pro',
    'fl-studio-completo',
    'lofi-chill-beats-vol3',
    'house-music-pack-vol1',
    'rnb-guitar-loops',
    'piano-melodies-bundle',
]

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digitalmarket.com'
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/auth/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ]

    const productRoutes: MetadataRoute.Sitemap = STATIC_PRODUCTS.map((slug) => ({
        url: `${baseUrl}/products/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    return [...staticRoutes, ...productRoutes]
}
