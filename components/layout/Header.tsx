'use client'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PlusCircle, MessageSquare, User, LogOut, Menu, X } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!user) { setUnread(0); return }
    const supabase = createClient()
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages').select('*', { count: 'exact', head: true })
        .eq('read', false).neq('sender_id', user.id)
      setUnread(count ?? 0)
    }
    fetchUnread()

    // Realtime for new and updated messages
    const ch = supabase.channel('header-unread')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchUnread)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, fetchUnread)
      .subscribe()

    // Re-fetch when user returns to the tab (Realtime UPDATE can be delayed)
    const onVisible = () => { if (document.visibilityState === 'visible') fetchUnread() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      supabase.removeChannel(ch)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [user])

  // Re-fetch on navigation (e.g. returning from a conversation clears the badge)
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase.from('messages').select('*', { count: 'exact', head: true })
      .eq('read', false).neq('sender_id', user.id)
      .then(({ count }) => setUnread(count ?? 0))
  }, [pathname, user])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next })
  }

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? 'oklch(19% 0.07 15 / 0.97)'
          : 'oklch(19% 0.07 15)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 oklch(68% 0.09 68 / 0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="text-2xl leading-none select-none"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'oklch(68% 0.09 68)' }}
          >
            𝕄
          </span>
          <span className="flex flex-col leading-none">
            <span
              className="text-xl tracking-wide"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'oklch(97.5% 0.005 80)' }}
            >
              Ma Cave
            </span>
            <span
              className="text-[9px] tracking-[0.18em] uppercase"
              style={{ color: 'oklch(68% 0.09 68)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}
            >
              {t('tagline')}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/annonces"
            className="text-[11px] uppercase tracking-[0.14em] font-medium link-gold"
            style={{ color: 'oklch(82% 0.06 72)', fontFamily: 'var(--font-sans)' }}
          >
            {t('explore')}
          </Link>

          {user ? (
            <>
              <Link
                href="/annonces/nouvelle"
                className="flex items-center gap-2 px-5 py-2 text-[11px] uppercase tracking-[0.12em] font-medium transition-all duration-200"
                style={{
                  border: '1px solid oklch(68% 0.09 68)',
                  color: 'oklch(68% 0.09 68)',
                  fontFamily: 'var(--font-sans)',
                  borderRadius: '2px',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.backgroundColor = 'oklch(68% 0.09 68)'
                  el.style.color = 'oklch(19% 0.07 15)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.backgroundColor = 'transparent'
                  el.style.color = 'oklch(68% 0.09 68)'
                }}
              >
                <PlusCircle size={12} />
                {t('sell')}
              </Link>

              <Link href="/messages" className="relative group" style={{ color: 'oklch(82% 0.06 72)' }}>
                <MessageSquare size={18} className="transition-colors group-hover:text-[oklch(68%_0.09_68)]" />
                {unread > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 text-[9px] font-bold flex items-center justify-center rounded-full"
                    style={{ backgroundColor: 'oklch(68% 0.09 68)', color: 'oklch(19% 0.07 15)' }}
                  >
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>

              <Link href="/profil" className="group" style={{ color: 'oklch(82% 0.06 72)' }}>
                <User size={18} className="transition-colors group-hover:text-[oklch(68%_0.09_68)]" />
              </Link>

              <button onClick={signOut} className="group" style={{ color: 'oklch(82% 0.06 72)' }}>
                <LogOut size={18} className="transition-colors group-hover:text-[oklch(68%_0.09_68)]" />
              </button>
            </>
          ) : (
            <Link
              href="/connexion"
              className="px-5 py-2 text-[11px] uppercase tracking-[0.12em] font-medium transition-all duration-200"
              style={{
                border: '1px solid oklch(68% 0.09 68)',
                color: 'oklch(68% 0.09 68)',
                fontFamily: 'var(--font-sans)',
                borderRadius: '2px',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.backgroundColor = 'oklch(68% 0.09 68)'
                el.style.color = 'oklch(19% 0.07 15)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.backgroundColor = 'transparent'
                el.style.color = 'oklch(68% 0.09 68)'
              }}
            >
              {t('login')}
            </Link>
          )}

          {/* Locale switcher */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-6">
            {(['fr', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className="text-[10px] uppercase tracking-[0.1em] px-1.5 py-0.5 transition-all"
                style={{
                  color: locale === l ? 'oklch(68% 0.09 68)' : 'oklch(55% 0.04 72)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: locale === l ? 600 : 400,
                  borderBottom: locale === l ? '1px solid oklch(68% 0.09 68)' : '1px solid transparent',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ color: 'oklch(82% 0.06 72)' }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 py-6 flex flex-col gap-5 border-t"
          style={{ borderColor: 'oklch(68% 0.09 68 / 0.15)', backgroundColor: 'oklch(19% 0.07 15)' }}
        >
          <Link href="/annonces" onClick={() => setOpen(false)}
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{ color: 'oklch(82% 0.06 72)', fontFamily: 'var(--font-sans)' }}>
            {t('explore')}
          </Link>
          {user ? (
            <>
              <Link href="/annonces/nouvelle" onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.14em]"
                style={{ color: 'oklch(82% 0.06 72)', fontFamily: 'var(--font-sans)' }}>
                {t('sell')}
              </Link>
              <Link href="/messages" onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.14em]"
                style={{ color: 'oklch(82% 0.06 72)', fontFamily: 'var(--font-sans)' }}>
                {t('messages')} {unread > 0 && `(${unread})`}
              </Link>
              <Link href="/profil" onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.14em]"
                style={{ color: 'oklch(82% 0.06 72)', fontFamily: 'var(--font-sans)' }}>
                {t('profile')}
              </Link>
              <button onClick={signOut}
                className="text-left text-[11px] uppercase tracking-[0.14em]"
                style={{ color: 'oklch(68% 0.09 68)', fontFamily: 'var(--font-sans)' }}>
                {t('logout')}
              </button>
            </>
          ) : (
            <Link href="/connexion" onClick={() => setOpen(false)}
              className="text-[11px] uppercase tracking-[0.14em]"
              style={{ color: 'oklch(68% 0.09 68)', fontFamily: 'var(--font-sans)' }}>
              {t('login')}
            </Link>
          )}
          {/* Mobile locale switcher */}
          <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'oklch(68% 0.09 68 / 0.15)' }}>
            {(['fr', 'en'] as const).map(l => (
              <button
                key={l}
                onClick={() => { switchLocale(l); setOpen(false) }}
                className="text-[11px] uppercase tracking-[0.14em]"
                style={{
                  color: locale === l ? 'oklch(68% 0.09 68)' : 'oklch(55% 0.04 72)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: locale === l ? 600 : 400,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
