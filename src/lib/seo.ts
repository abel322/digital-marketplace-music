import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://digitalmarket.com'
const SITE_NAME = 'DigitalMarket'
const DEFAULT_DESCRIPTION = 'La plataforma definitiva para cursos de producción musical, samples packs, loops y música digital. Aprende, crea y vende.'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`

/** Root metadata shared across all pages */
export const rootMetadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: `${SITE_NAME} — Cursos de Producción Musical & Samples`,
        template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
        'cursos producción musical', 'samples packs', 'loops', 'música digital',
        'fl studio', 'ableton', 'mezcla mastering', 'beats', 'trap samples',
        'cursos online música', 'aprender producción', 'digital marketplace',
    ],
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: BASE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} — Cursos de Producción Musical & Samples`,
        description: DEFAULT_DESCRIPTION,
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} — Plataforma de productos digitales de música`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} — Cursos de Producción Musical & Samples`,
        description: DEFAULT_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
        creator: '@digitalmarket',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    alternates: {
        canonical: BASE_URL,
        languages: { 'es-ES': BASE_URL },
    },
}

/** Generate metadata for a product detail page */
export function generateProductMetadata(product: {
    title: string
    description?: string | null
    slug: string
    price: number
    type: string
    image?: string | null
}): Metadata {
    const title = `${product.title} — ${product.type === 'COURSE' ? 'Curso' : product.type === 'SAMPLE_PACK' ? 'Sample Pack' : 'Música'}`
    const description = product.description || `Descarga o accede ahora: ${product.title}. Precio: $${product.price}.`
    const url = `${BASE_URL}/products/${product.slug}`
    const image = product.image || DEFAULT_OG_IMAGE

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: 'website',
            url,
            title,
            description,
            images: [{ url: image, width: 1200, height: 630, alt: product.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
        other: {
            // Schema.org JSON-LD can be injected separately via generateJsonLd()
            'product:price:amount': String(product.price),
            'product:price:currency': 'USD',
        },
    }
}

/** JSON-LD structured data for a product */
export function generateProductJsonLd(product: {
    title: string
    description?: string | null
    slug: string
    price: number
    rating?: number | null
    reviewCount?: number
    image?: string | null
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description || '',
        image: product.image || DEFAULT_OG_IMAGE,
        url: `${BASE_URL}/products/${product.slug}`,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/products/${product.slug}`,
        },
        ...(product.rating && product.reviewCount && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
                bestRating: 5,
                worstRating: 1,
            },
        }),
    }
}

/** JSON-LD for WebSite (search action) — used in root layout */
export const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/products?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
    },
}
