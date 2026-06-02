'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { MessageThread } from '@/components/messages/MessageThread'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import type { Profile, Message } from '@/lib/supabase/types'

type OtherUser = Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
type ListingPreview = { id: string; title: string; images: string[] | null; price: number }
type ConvData = { id: string; buyer_id: string; seller_id: string; listings: ListingPreview | null; buyer: OtherUser; seller: OtherUser }

function ConversationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const user = useUser()
  const id = searchParams.get('id')
  const [conv, setConv] = useState<ConvData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { router.replace('/messages'); return }
    if (user === undefined) return
    if (user === null) { router.push('/connexion'); return }

    const supabase = createClient()
    supabase
      .from('conversations')
      .select(`id, buyer_id, seller_id,
        listings:listing_id(id, title, images, price),
        buyer:buyer_id(id, full_name, avatar_url),
        seller:seller_id(id, full_name, avatar_url)`)
      .eq('id', id).single()
      .then(({ data }) => {
        if (!data) { router.replace('/messages'); return }
        const c = data as unknown as ConvData
        if (c.buyer_id !== user.id && c.seller_id !== user.id) { router.replace('/messages'); return }
        setConv(c)
        return supabase.from('messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true })
      })
      .then(result => {
        if (!result) return
        setMessages((result.data ?? []) as Message[])
        setLoading(false)
        createClient().from('messages').update({ read: true })
          .eq('conversation_id', id!).neq('sender_id', user.id).eq('read', false)
      })
  }, [user, id])

  if (user === undefined || loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#722f37]" />
      </div>
    )
  }

  if (!conv || !user) return null

  const other: OtherUser = user.id === conv.buyer_id ? conv.seller : conv.buyer

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <Link href="/messages" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-[#722f37]/10 flex items-center justify-center font-bold text-[#722f37]">
          {other?.full_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900">{other?.full_name ?? 'Particulier'}</div>
          {conv.listings && (
            <Link href={`/annonces/detail?id=${conv.listings.id}`} className="text-xs text-[#722f37] hover:underline truncate block">
              {conv.listings.title} · {formatPrice(conv.listings.price)}
            </Link>
          )}
        </div>
        {conv.listings?.images?.[0] && (
          <Link href={`/annonces/detail?id=${conv.listings.id}`}>
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={conv.listings.images[0]} alt={conv.listings.title} fill className="object-cover" />
            </div>
          </Link>
        )}
      </div>

      <MessageThread
        conversationId={id!}
        currentUserId={user.id}
        initialMessages={messages}
        otherUserName={other?.full_name ?? 'Particulier'}
      />
    </div>
  )
}

export default function ConversationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64"><Loader2 className="h-8 w-8 animate-spin text-[#722f37]" /></div>}>
      <ConversationContent />
    </Suspense>
  )
}
