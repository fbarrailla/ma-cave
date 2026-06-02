'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link, useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, formatDate, WINE_COLOR_BADGE, WINE_COLOR_DOT } from '@/lib/utils'
import { MapPin, Calendar, Package, Wine, Pencil, Eye, Loader2, CheckCircle } from 'lucide-react'
import { ContactButton } from '@/components/listings/ContactButton'
import { ImageGallery } from '@/components/listings/ImageGallery'
import { useUser } from '@/hooks/useUser'
import { useTranslations, useLocale } from 'next-intl'
import type { Listing, Profile } from '@/lib/supabase/types'

type ListingWithProfile = Listing & {
  profiles: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'bio' | 'location' | 'created_at'> | null
}

function ListingDetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const user = useUser()
  const locale = useLocale()
  const t = useTranslations('detail')
  const ts = useTranslations('status')
  const tc = useTranslations('common')
  const id = searchParams.get('id')
  const [listing, setListing] = useState<ListingWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    if (!id) { router.replace('/annonces'); return }
    const supabase = createClient()
    supabase
      .from('listings')
      .select('*, profiles:seller_id(id, full_name, avatar_url, bio, location, created_at)')
      .eq('id', id).single()
      .then(({ data }) => {
        if (!data) { router.replace('/annonces'); return }
        setListing(data as unknown as ListingWithProfile)
        supabase.from('listings').update({ views: ((data as ListingWithProfile).views ?? 0) + 1 }).eq('id', id)
        setLoading(false)
      })
  }, [id])

  const updateStatus = async (newStatus: 'active' | 'reserved' | 'sold') => {
    if (!listing || statusUpdating) return
    setStatusUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('listings').update({ status: newStatus }).eq('id', listing.id)
    if (!error) setListing({ ...listing, status: newStatus })
    setStatusUpdating(false)
  }

  if (loading || !id) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#722f37]" />
      </div>
    )
  }

  if (!listing) return null

  const isOwner = user?.id === listing.seller_id
  const colorClass = listing.color ? (WINE_COLOR_BADGE[listing.color] ?? '') : ''
  const dotClass = listing.color ? (WINE_COLOR_DOT[listing.color] ?? '') : ''
  const status = listing.status ?? 'active'

  const colorLabels: Record<string, string> = {
    rouge: locale === 'en' ? 'Red' : 'Rouge',
    blanc: locale === 'en' ? 'White' : 'Blanc',
    rosé: 'Rosé',
    effervescent: locale === 'en' ? 'Sparkling' : 'Effervescent',
    liquoreux: locale === 'en' ? 'Sweet' : 'Liquoreux',
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#722f37]">{tc('back_home')}</Link>
        <span>/</span>
        <Link href="/annonces" className="hover:text-[#722f37]">{tc('back_listings')}</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={listing.images ?? []} title={listing.title} />

          <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status] ?? ''}`}>
                    {ts(status as 'active' | 'reserved' | 'sold')}
                  </span>
                  {listing.color && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                      {colorLabels[listing.color]}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-[#1a1209]">{listing.title}</h1>
                {listing.producer && <p className="text-gray-500 mt-1">{listing.producer}</p>}
              </div>
              {isOwner && (
                <Link href={`/annonces/editer?id=${id}`}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex-shrink-0">
                  <Pencil className="h-4 w-4" /> {t('edit')}
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-gray-100">
              {listing.region && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#722f37]" />
                  <div><div className="text-xs text-gray-400">{t('region')}</div><div className="font-medium">{listing.region}</div></div>
                </div>
              )}
              {listing.appellation && (
                <div className="flex items-center gap-2 text-sm">
                  <Wine className="h-4 w-4 text-[#722f37]" />
                  <div><div className="text-xs text-gray-400">{t('appellation')}</div><div className="font-medium">{listing.appellation}</div></div>
                </div>
              )}
              {listing.vintage && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#722f37]" />
                  <div><div className="text-xs text-gray-400">{t('vintage')}</div><div className="font-medium">{listing.vintage}</div></div>
                </div>
              )}
              {listing.grape_variety && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#722f37]">🍇</span>
                  <div><div className="text-xs text-gray-400">{t('grape')}</div><div className="font-medium">{listing.grape_variety}</div></div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-[#722f37]" />
                <div><div className="text-xs text-gray-400">{t('format')}</div><div className="font-medium">{listing.bottle_size ?? '75cl'}</div></div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-[#722f37]" />
                <div><div className="text-xs text-gray-400">{t('views')}</div><div className="font-medium">{listing.views ?? 0}</div></div>
              </div>
            </div>

            {listing.description && (
              <div className="mt-4">
                <h2 className="font-semibold text-gray-800 mb-2">{t('description')}</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">
              {listing.created_at ? t('published', { date: formatDate(listing.created_at) }) : ''}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
            <div className="text-3xl font-bold text-[#722f37] mb-1">{formatPrice(listing.price)}</div>
            <p className="text-sm text-gray-500 mb-4">
              {t('per_bottle')} · {(listing.quantity ?? 1) === 1
                ? t('available_one', { n: listing.quantity ?? 1 })
                : t('available_other', { n: listing.quantity ?? 1 })}
            </p>
            {!isOwner && status === 'active' && (
              <ContactButton listingId={listing.id} sellerId={listing.seller_id} currentUserId={user?.id} />
            )}
            {isOwner && (
              <div className="space-y-3">
                <Link href={`/annonces/editer?id=${id}`}
                  className="block w-full text-center bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors">
                  {t('edit_listing')}
                </Link>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">{t('status_label')}</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['active', 'reserved', 'sold'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(s)}
                        disabled={statusUpdating || status === s}
                        className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium border transition-all ${
                          status === s
                            ? s === 'active' ? 'bg-green-50 border-green-300 text-green-800'
                            : s === 'reserved' ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                            : 'bg-red-50 border-red-300 text-red-800'
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        {statusUpdating && status !== s ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : status === s ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : null}
                        {ts(s)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {listing.profiles && (
            <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
              <h3 className="font-semibold text-gray-800 mb-4">{t('seller')}</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#722f37]/10 flex items-center justify-center text-xl font-bold text-[#722f37]">
                  {listing.profiles.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{listing.profiles.full_name ?? tc('particulier')}</div>
                  {listing.profiles.location && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {listing.profiles.location}
                    </div>
                  )}
                </div>
              </div>
              {listing.profiles.bio && <p className="text-sm text-gray-500 line-clamp-3">{listing.profiles.bio}</p>}
              {listing.profiles.created_at && (
                <p className="text-xs text-gray-400 mt-2">{t('member_since', { date: formatDate(listing.profiles.created_at) })}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ListingDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64"><Loader2 className="h-8 w-8 animate-spin text-[#722f37]" /></div>}>
      <ListingDetailContent />
    </Suspense>
  )
}
