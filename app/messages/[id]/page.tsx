import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MessageThread } from '@/components/messages/MessageThread'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import type { Profile, Message } from '@/lib/supabase/types'

type OtherUser = Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
type ListingPreview = { id: string; title: string; images: string[] | null; price: number; status: string | null }

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: rawConv } = await supabase
    .from('conversations')
    .select(`
      id, buyer_id, seller_id,
      listings:listing_id(id, title, images, price, status),
      buyer:buyer_id(id, full_name, avatar_url),
      seller:seller_id(id, full_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (!rawConv) notFound()

  const conv = rawConv as unknown as {
    id: string
    buyer_id: string
    seller_id: string
    listings: ListingPreview | null
    buyer: OtherUser
    seller: OtherUser
  }

  const isMember = conv.buyer_id === user.id || conv.seller_id === user.id
  if (!isMember) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  // Mark messages as read
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', id)
    .neq('sender_id', user.id)
    .eq('read', false)

  const other: OtherUser = user.id === conv.buyer_id ? conv.seller : conv.buyer
  const listing = conv.listings

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <Link href="/messages" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#722f37]/10 flex items-center justify-center font-bold text-[#722f37]">
          {other?.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">{other?.full_name ?? 'Particulier'}</div>
          {listing && (
            <Link href={`/annonces/${listing.id}`} className="text-xs text-[#722f37] hover:underline truncate block">
              {listing.title} · {formatPrice(listing.price)}
            </Link>
          )}
        </div>
        {listing?.images?.[0] && (
          <Link href={`/annonces/${listing.id}`}>
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
            </div>
          </Link>
        )}
      </div>

      {/* Thread */}
      <MessageThread
        conversationId={id}
        currentUserId={user.id}
        initialMessages={(messages ?? []) as Message[]}
        otherUserName={other?.full_name ?? 'Particulier'}
      />
    </div>
  )
}
