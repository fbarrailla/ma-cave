'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      const next = new URLSearchParams(window.location.search).get('next') || '/'
      if (data.session) {
        router.replace(next)
      } else {
        // Handle hash-based token (magic link)
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            router.replace(next)
          }
        })
      }
    })
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#722f37] mx-auto mb-4" />
        <p className="text-gray-500">Connexion en cours…</p>
      </div>
    </div>
  )
}
