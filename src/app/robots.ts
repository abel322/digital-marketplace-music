import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://digitalmarket.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/dashboard/',
                    '/api/',
                    '/checkout/',
                    '/auth/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/dashboard/', '/api/', '/checkout/', '/auth/'],
                crawlDelay: 1,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
