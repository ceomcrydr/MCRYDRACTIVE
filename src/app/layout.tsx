import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MCRYDR — Motorcycle Community',
  description: 'The community hub for motorcycle riders, shops, and brands.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
