import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatRelativeDate, formatPrice } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'
import type { Profile } from '@/lib/supabase/types'

type OtherUser = Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
type ListingPreview = { id: string; title: string; images: string[] | null; price: number }
type MessagePreview = { content: string; created_at: string | null; sender_id: string }

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion?redirect=/messages')

  const { data: rawConvs } = await supabase
    .from('conversations')
    .select(`
      id, listing_id, buyer_id, seller_id, last_message_at, created_at,
      listings:listing_id(id, title, images, price),
      buyer:buyer_id(id, full_name, avatar_url),
      seller:seller_id(id, full_name, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  const conversations = (rawConvs ?? []) as unknown as Array<{
    id: string
    listing_id: string | null
    buyer_id: string
    seller_id: string
    last_message_at: string | null
    created_at: string | null
    listings: ListingPreview | null
    buyer: OtherUser
    seller: OtherUser
  }>

  const conversationsWithMessages = await Promise.all(
    conversations.map(async (conv) => {
      const { data: lastMsg } = await supabase
        .from('messages')
        .select('content, created_at, sender_id')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const { count: unread } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('read', false)
        .neq('sender_id', user.id)

      return { ...conv, last_message: lastMsg as MessagePreview | null, unread_count: unread ?? 0 }
    })
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1209] mb-6">Messages</h1>

      {conversationsWithMessages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#f0e8d8]">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune conversation</p>
          <p className="text-sm text-gray-400 mt-1">Contactez un vendeur depuis une annonce pour démarrer</p>
          <Link href="/annonces" className="mt-4 inline-block bg-[#722f37] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#9b3d47] transition-colors">
            Explorer les annonces
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#f0e8d8] divide-y divide-gray-100">
          {conversationsWithMessages.map(conv => {
            const other: OtherUser = user.id === conv.buyer_id ? conv.seller : conv.buyer
            const listing = conv.listings
            const hasUnread = conv.unread_count > 0
            const lastMsgDate = conv.last_message?.created_at ?? conv.last_message_at ?? conv.created_at ?? ''

            return (
              <Link key={conv.id} href={`/messages/${conv.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#722f37]/10 flex items-center justify-center text-lg font-bold text-[#722f37]">
                    {other?.full_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  {hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#722f37] rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`font-semibold text-sm ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {other?.full_name ?? 'Particulier'}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {lastMsgDate ? formatRelativeDate(lastMsgDate) : ''}
                    </span>
                  </div>
                  {listing && (
                    <p className="text-xs text-[#722f37] font-medium truncate mb-0.5">
                      {listing.title} · {formatPrice(listing.price)}
                    </p>
                  )}
                  <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                    {conv.last_message
                      ? (conv.last_message.sender_id === user.id ? 'Vous : ' : '') + conv.last_message.content
                      : 'Nouvelle conversation'}
                  </p>
                </div>

                {listing?.images?.[0] && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
