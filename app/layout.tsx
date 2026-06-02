import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ma Cave — Échangez vos bouteilles de vin',
  description: 'La marketplace entre particuliers pour acheter et vendre vos bouteilles de vin. Bordeaux, Bourgogne, Champagne et bien plus.',
  metadataBase: new URL('https://ma-cave.net'),
  openGraph: {
    title: 'Ma Cave — Échangez vos bouteilles de vin',
    description: 'La marketplace entre particuliers pour acheter et vendre vos bouteilles de vin.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`h-full antialiased ${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
