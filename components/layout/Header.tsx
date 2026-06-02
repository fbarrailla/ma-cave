'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Wine, PlusCircle, MessageSquare, User, LogOut, Menu, X } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false)
        .neq('sender_id', user.id)
        .in('conversation_id', supabase
          .from('conversations')
          .select('id')
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`) as unknown as string[]
        )
      setUnreadCount(count ?? 0)
    }
    fetchUnread()

    const channel = supabase.channel('unread-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchUnread)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-[#4a1d24] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide">
          <Wine className="h-6 w-6 text-[#c9a84c]" />
          <span className="text-[#c9a84c]">Ma</span>
          <span>Cave</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/annonces" className="text-sm hover:text-[#c9a84c] transition-colors">
            Explorer
          </Link>
          {user ? (
            <>
              <Link href="/annonces/nouvelle"
                className="flex items-center gap-1.5 bg-[#c9a84c] text-[#4a1d24] px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-[#e0bb5d] transition-colors">
                <PlusCircle className="h-4 w-4" />
                Vendre
              </Link>
              <Link href="/messages" className="relative hover:text-[#c9a84c] transition-colors">
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/profil" className="hover:text-[#c9a84c] transition-colors">
                <User className="h-5 w-5" />
              </Link>
              <button onClick={handleSignOut} className="hover:text-[#c9a84c] transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link href="/connexion"
              className="bg-[#c9a84c] text-[#4a1d24] px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-[#e0bb5d] transition-colors">
              Connexion
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#3d1820] border-t border-[#722f37] px-4 py-4 flex flex-col gap-4">
          <Link href="/annonces" onClick={() => setMenuOpen(false)} className="text-sm hover:text-[#c9a84c]">Explorer</Link>
          {user ? (
            <>
              <Link href="/annonces/nouvelle" onClick={() => setMenuOpen(false)} className="text-sm hover:text-[#c9a84c]">Vendre une bouteille</Link>
              <Link href="/messages" onClick={() => setMenuOpen(false)} className="text-sm hover:text-[#c9a84c]">Messages {unreadCount > 0 && `(${unreadCount})`}</Link>
              <Link href="/profil" onClick={() => setMenuOpen(false)} className="text-sm hover:text-[#c9a84c]">Mon profil</Link>
              <button onClick={handleSignOut} className="text-sm text-left hover:text-[#c9a84c]">Déconnexion</button>
            </>
          ) : (
            <Link href="/connexion" onClick={() => setMenuOpen(false)} className="text-sm hover:text-[#c9a84c]">Connexion</Link>
          )}
        </div>
      )}
    </header>
  )
}
