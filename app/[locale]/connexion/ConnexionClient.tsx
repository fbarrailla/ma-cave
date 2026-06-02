'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

type Mode = 'login' | 'register' | 'magic'

export function ConnexionClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const supabase = createClient()
  const t = useTranslations('auth')

  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) { setError(t('wrong_credentials')); setLoading(false); return }
    router.push(redirect)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.fullName } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setMessage(t('confirm_email'))
    setLoading(false)
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}` },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setMessage(t('magic_sent'))
    setLoading(false)
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37] transition-colors"

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#f0e8d8] p-6">
      {message ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">✉️</div>
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
          )}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t('login')}
            </button>
            <button onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t('register')}
            </button>
          </div>

          {mode === 'magic' ? (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder={t('email_placeholder')} className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('magic_send')}
              </button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-center text-sm text-[#722f37] hover:underline">
                {t('magic_back')}
              </button>
            </form>
          ) : mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder={t('email_placeholder')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                <input type="password" required value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="••••••••" className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('submit_login')}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setMode('magic')} className="text-sm text-[#722f37] hover:underline">
                  {t('magic_link')}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name')}</label>
                <input required value={form.fullName} onChange={e => update('fullName', e.target.value)}
                  placeholder={t('name_placeholder')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder={t('email_placeholder')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                <input type="password" required minLength={8} value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder={t('password_placeholder')} className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('submit_register')}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  )
}
