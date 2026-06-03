import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cata Classic Pre-Raid BiS',
  description: 'Pre-Raid Best in Slot gear lists for all specs in Cataclysm Classic',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
