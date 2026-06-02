'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Loader2 } from 'lucide-react'

interface ContactButtonProps {
  listingId: string
  sellerId: string
  currentUserId?: string
}

export function ContactButton({ listingId, sellerId, currentUserId }: ContactButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleContact = async () => {
    if (!currentUserId) {
      router.push(`/connexion?redirect=/annonces/${listingId}`)
      return
    }
    if (currentUserId === sellerId) return

    setLoading(true)
    // Find or create conversation
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_id', currentUserId)
      .single()

    if (existing) {
      router.push(`/messages/${existing.id}`)
      return
    }

    const { data: conv, error } = await supabase
      .from('conversations')
      .insert({ listing_id: listingId, buyer_id: currentUserId, seller_id: sellerId })
      .select()
      .single()

    if (error || !conv) { setLoading(false); return }
    router.push(`/messages/${conv.id}`)
  }

  return (
    <button onClick={handleContact} disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
      Contacter le vendeur
    </button>
  )
}
