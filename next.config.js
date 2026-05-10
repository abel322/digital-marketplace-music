/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── Images ───────────────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    unoptimized: true
  },

  // ─── Compiler ─────────────────────────────────────────────────────────────
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ─── Security & Performance Headers ──────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff2|woff)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // ─── Redirects ────────────────────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/courses', destination: '/products?type=COURSE', permanent: true },
      { source: '/samples', destination: '/products?type=SAMPLE_PACK', permanent: true },
      { source: '/music', destination: '/products?type=MUSIC', permanent: true },
    ]
  },

  // ─── Experimental / Server Actions ────────────────────────────────────────
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  // ─── Transpile packages that need it ──────────────────────────────────────
  transpilePackages: [],

  // Suppress Next.js warnings about Prisma in edge runtimes
  serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
