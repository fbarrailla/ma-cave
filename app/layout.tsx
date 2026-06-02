import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Ma Cave — Échangez vos bouteilles de vin',
  description: 'La marketplace entre particuliers pour acheter et vendre vos bouteilles de vin. Bordeaux, Bourgogne, Champagne et bien plus.',
  metadataBase: new URL('https://ma-cave.fr'),
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
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-screen flex flex-col bg-[#faf8f5]">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
