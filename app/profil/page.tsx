import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { ListingCard } from '@/components/listings/ListingCard'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import type { ListingWithSeller } from '@/lib/supabase/types'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion?redirect=/profil')

  const [{ data: profile }, { data: listings }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('listings')
      .select('*, profiles:seller_id(id, full_name, avatar_url, location)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-[#1a1209]">Mon profil</h1>

      {/* Profile form */}
      <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
        <h2 className="font-semibold text-gray-800 mb-5">Informations personnelles</h2>
        <ProfileForm profile={profile} userId={user.id} />
      </div>

      {/* Bank details */}
      <div className="bg-white rounded-xl border border-[#f0e8d8] p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Coordonnées bancaires</h2>
        <p className="text-sm text-gray-500 mb-5">
          Renseignez vos coordonnées bancaires pour recevoir vos paiements. Ces informations sont sécurisées et ne sont jamais partagées.
        </p>
        <ProfileForm profile={profile} userId={user.id} bankOnly />
      </div>

      {/* My listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1a1209]">Mes annonces</h2>
          <Link href="/annonces/nouvelle"
            className="flex items-center gap-1.5 bg-[#722f37] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#9b3d47] transition-colors">
            <PlusCircle className="h-4 w-4" />
            Nouvelle annonce
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map(l => (
              <ListingCard key={l.id} listing={l as unknown as ListingWithSeller} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-[#f0e8d8]">
            <div className="text-4xl mb-3">🍷</div>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore d'annonce</p>
            <Link href="/annonces/nouvelle"
              className="inline-flex items-center gap-2 bg-[#722f37] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors">
              <PlusCircle className="h-4 w-4" />
              Créer ma première annonce
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
