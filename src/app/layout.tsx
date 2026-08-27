import type { Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GlobalAudioPlayer from '@/components/audio/GlobalAudioPlayer'
import { rootMetadata, websiteJsonLd } from '@/lib/seo'

export const metadata = rootMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF6B35',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* JSON-LD Structured Data — WebSite + SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Preconnect to key third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="pb-24 sm:pb-28" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <Footer />
          <GlobalAudioPlayer />
        </Providers>
      </body>
    </html>
  )
}

