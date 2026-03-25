import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'PUBG UC Store | Buy UC Fast & Secure',
  description: 'The most trusted PUBG Mobile UC store. Buy Unknown Cash instantly with secure payment methods. Best prices, fast delivery, 24/7 support.',
  keywords: ['PUBG', 'UC', 'Unknown Cash', 'PUBG Mobile', 'Gaming', 'Top Up'],
  authors: [{ name: 'PUBG UC Store' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          theme="dark"
          toastOptions={{
            style: {
              background: 'oklch(0.16 0.01 250)',
              border: '1px solid oklch(0.28 0.02 250)',
              color: 'oklch(0.95 0 0)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
