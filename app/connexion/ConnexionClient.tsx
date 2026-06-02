'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

type Mode = 'login' | 'register' | 'magic'

export function ConnexionClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const supabase = createClient()

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
    if (error) { setError('Email ou mot de passe incorrect.'); setLoading(false); return }
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
    setMessage('Vérifiez votre email pour confirmer votre inscription.')
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
    setMessage('Lien magique envoyé ! Vérifiez votre email.')
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
              Connexion
            </button>
            <button onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Inscription
            </button>
          </div>

          {mode === 'magic' ? (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="votre@email.fr" className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Recevoir un lien magique
              </button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-center text-sm text-[#722f37] hover:underline">
                Retour à la connexion
              </button>
            </form>
          ) : mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="votre@email.fr" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input type="password" required value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="••••••••" className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Se connecter
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setMode('magic')} className="text-sm text-[#722f37] hover:underline">
                  Connexion sans mot de passe →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom et nom</label>
                <input required value={form.fullName} onChange={e => update('fullName', e.target.value)}
                  placeholder="Jean Dupont" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="votre@email.fr" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input type="password" required minLength={8} value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="8 caractères minimum" className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#722f37] text-white py-3 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Créer mon compte
              </button>
            </form>
          )}
        </>
      )}
    </div>
  )
}
