import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Package } from 'lucide-react'
import { formatPrice, WINE_COLOR_BADGE, WINE_COLOR_DOT } from '@/lib/utils'
import type { ListingWithSeller } from '@/lib/supabase/types'

interface ListingCardProps {
  listing: ListingWithSeller
}

const COLOR_LABELS: Record<string, string> = {
  rouge: 'Rouge', blanc: 'Blanc', rosé: 'Rosé',
  effervescent: 'Effervescent', liquoreux: 'Liquoreux',
}

export function ListingCard({ listing }: ListingCardProps) {
  const image = listing.images?.[0]
  const colorClass = listing.color ? WINE_COLOR_BADGE[listing.color] : 'bg-gray-100 text-gray-700'
  const dotClass = listing.color ? WINE_COLOR_DOT[listing.color] : 'bg-gray-400'

  return (
    <Link href={`/annonces/${listing.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-[#f0e8d8] flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-[#f5f0e8]">
        {image ? (
          <Image src={image} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-20">🍷</span>
          </div>
        )}
        {listing.status !== 'active' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
              {listing.status === 'sold' ? 'Vendu' : 'Réservé'}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {listing.color ? COLOR_LABELS[listing.color] : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-semibold text-[#1a1209] line-clamp-1 group-hover:text-[#722f37] transition-colors">
            {listing.title}
          </h3>
          {listing.producer && (
            <p className="text-sm text-gray-500 line-clamp-1">{listing.producer}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          {listing.region && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {listing.region}
            </span>
          )}
          {listing.vintage && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {listing.vintage}
            </span>
          )}
          {(listing.quantity ?? 1) > 1 && (
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" /> ×{listing.quantity}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-[#722f37]">{formatPrice(listing.price)}</span>
          <span className="text-xs text-gray-400">{listing.bottle_size}</span>
        </div>

        {listing.profiles && (
          <p className="text-xs text-gray-400 truncate">
            Par {listing.profiles.full_name || 'Particulier'}
            {listing.profiles.location && ` · ${listing.profiles.location}`}
          </p>
        )}
      </div>
    </Link>
  )
}
