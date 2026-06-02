import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, WINE_COLOR_BADGE, WINE_COLOR_DOT } from '@/lib/utils'
import { MapPin, Calendar, Package, Wine, Pencil, Eye } from 'lucide-react'
import { ContactButton } from '@/components/listings/ContactButton'
import { ImageGallery } from '@/components/listings/ImageGallery'
import type { Profile, Listing } from '@/lib/supabase/types'

const COLOR_LABELS: Record<string, string> = {
  rouge: 'Rouge', blanc: 'Blanc', rosé: 'Rosé',
  effervescent: 'Effervescent', liquoreux: 'Liquoreux',
}
const STATUS_LABELS: Record<string, string> = {
  active: 'Disponible', reserved: 'Réservé', sold: 'Vendu',
}
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  sold: 'bg-red-100 text-red-800',
}

type ListingWithProfile = Listing & {
  profiles: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'bio' | 'location' | 'created_at'> | null
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data }, { data: { user } }] = await Promise.all([
    supabase
      .from('listings')
      .select('*, profiles:seller_id(id, full_name, avatar_url, bio, location, created_at)')
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ])

  const listing = data as ListingWithProfile | null
  if (!listing) notFound()

  const isOwner = user?.id === listing.seller_id
  const colorClass = listing.color ? (WINE_COLOR_BADGE[listing.color] ?? '') : ''
  const dotClass = listing.color ? (WINE_COLOR_DOT[listing.color] ?? '') : ''
  const status = listing.status ?? 'active'

  // Increment views (fire and forget)
  supabase.from('listings').update({ views: (listing.views ?? 0) + 1 }).eq('id', id)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#722f37]">Accueil</Link>
        <span>/</span>
        <Link href="/annonces" className="hover:text-[#722f37]">Annonces</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={listing.images ?? []} title={listing.title} />

          <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] ?? ''}`}>
                    {STATUS_LABELS[status] ?? status}
                  </span>
                  {listing.color && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                      {COLOR_LABELS[listing.color]}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-[#1a1209]">{listing.title}</h1>
                {listing.producer && <p className="text-gray-500 mt-1">{listing.producer}</p>}
              </div>
              {isOwner && (
                <Link href={`/annonces/${id}/editer`}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex-shrink-0">
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-gray-100">
              {listing.region && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#722f37]" />
                  <div>
                    <div className="text-xs text-gray-400">Région</div>
                    <div className="font-medium">{listing.region}</div>
                  </div>
                </div>
              )}
              {listing.appellation && (
                <div className="flex items-center gap-2 text-sm">
                  <Wine className="h-4 w-4 text-[#722f37]" />
                  <div>
                    <div className="text-xs text-gray-400">Appellation</div>
                    <div className="font-medium">{listing.appellation}</div>
                  </div>
                </div>
              )}
              {listing.vintage && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#722f37]" />
                  <div>
                    <div className="text-xs text-gray-400">Millésime</div>
                    <div className="font-medium">{listing.vintage}</div>
                  </div>
                </div>
              )}
              {listing.grape_variety && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#722f37]">🍇</span>
                  <div>
                    <div className="text-xs text-gray-400">Cépage</div>
                    <div className="font-medium">{listing.grape_variety}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-[#722f37]" />
                <div>
                  <div className="text-xs text-gray-400">Format</div>
                  <div className="font-medium">{listing.bottle_size ?? '75cl'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-[#722f37]" />
                <div>
                  <div className="text-xs text-gray-400">Vues</div>
                  <div className="font-medium">{listing.views ?? 0}</div>
                </div>
              </div>
            </div>

            {listing.description && (
              <div className="mt-4">
                <h2 className="font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-4">
              Publiée le {listing.created_at ? formatDate(listing.created_at) : ''}
            </p>
          </div>
        </div>

        {/* Right: Price + Seller + Contact */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-[#722f37]">{formatPrice(listing.price)}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              par bouteille · {listing.quantity ?? 1} disponible{(listing.quantity ?? 1) > 1 ? 's' : ''}
            </p>

            {!isOwner && status === 'active' && (
              <ContactButton
                listingId={listing.id}
                sellerId={listing.seller_id}
                currentUserId={user?.id}
              />
            )}

            {isOwner && (
              <Link href={`/annonces/${id}/editer`}
                className="block w-full text-center bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors">
                Modifier l&apos;annonce
              </Link>
            )}
          </div>

          {listing.profiles && (
            <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Vendeur</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#722f37]/10 flex items-center justify-center text-xl font-bold text-[#722f37]">
                  {listing.profiles.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{listing.profiles.full_name ?? 'Particulier'}</div>
                  {listing.profiles.location && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {listing.profiles.location}
                    </div>
                  )}
                </div>
              </div>
              {listing.profiles.bio && (
                <p className="text-sm text-gray-500 line-clamp-3">{listing.profiles.bio}</p>
              )}
              {listing.profiles.created_at && (
                <p className="text-xs text-gray-400 mt-2">
                  Membre depuis {formatDate(listing.profiles.created_at)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
