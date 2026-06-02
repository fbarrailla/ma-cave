import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ListingForm } from '@/components/listings/ListingForm'

export default async function EditerAnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: { user } }, { data: listing }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('listings').select('*').eq('id', id).single(),
  ])

  if (!user) redirect('/connexion')
  if (!listing || listing.seller_id !== user.id) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1209] mb-6">Modifier l'annonce</h1>
      <ListingForm userId={user.id} listing={listing} />
    </div>
  )
}
