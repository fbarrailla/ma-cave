'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { ListingCard } from '@/components/listings/ListingCard'
import Link from 'next/link'
import { PlusCircle, Loader2 } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import type { Profile, ListingWithSeller } from '@/lib/supabase/types'

export default function ProfilPage() {
  const user = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [listings, setListings] = useState<ListingWithSeller[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user === undefined) return
    if (user === null) { router.push('/connexion?redirect=/profil'); return }

    const supabase = createClient()
    Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('listings')
        .select('*, profiles:seller_id(id, full_name, avatar_url, location)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false }),
    ]).then(([{ data: p }, { data: l }]) => {
      setProfile(p)
      setListings((l ?? []) as unknown as ListingWithSeller[])
      setLoading(false)
    })
  }, [user])

  if (user === undefined || loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#722f37]" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-[#1a1209]">Mon profil</h1>

      <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
        <h2 className="font-semibold text-gray-800 mb-5">Informations personnelles</h2>
        <ProfileForm profile={profile} userId={user.id} />
      </div>

      <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Coordonnées bancaires</h2>
        <p className="text-sm text-gray-500 mb-5">
          Renseignez vos coordonnées bancaires pour recevoir vos paiements. Ces informations sont sécurisées et ne sont jamais partagées.
        </p>
        <ProfileForm profile={profile} userId={user.id} bankOnly />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1a1209]">Mes annonces</h2>
          <Link href="/annonces/nouvelle"
            className="flex items-center gap-1.5 bg-[#722f37] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#9b3d47] transition-colors">
            <PlusCircle className="h-4 w-4" /> Nouvelle annonce
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-[#f0e8d8]">
            <div className="text-4xl mb-3">🍷</div>
            <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore d&apos;annonce</p>
            <Link href="/annonces/nouvelle"
              className="inline-flex items-center gap-2 bg-[#722f37] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors">
              <PlusCircle className="h-4 w-4" /> Créer ma première annonce
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
