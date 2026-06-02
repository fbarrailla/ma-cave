'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Check } from 'lucide-react'
import type { Profile } from '@/lib/supabase/types'
import { WINE_REGIONS } from '@/lib/utils'

interface ProfileFormProps {
  profile: Profile | null
  userId: string
  bankOnly?: boolean
}

export function ProfileForm({ profile, userId, bankOnly = false }: ProfileFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    iban: profile?.iban || '',
    bic: profile?.bic || '',
    account_holder: profile?.account_holder || '',
  })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSaved(false)

    const payload = bankOnly
      ? { iban: form.iban, bic: form.bic, account_holder: form.account_holder }
      : { full_name: form.full_name, bio: form.bio, phone: form.phone, location: form.location }

    const { error } = await supabase.from('profiles').update(payload).eq('id', userId)
    if (error) { setError(error.message); setLoading(false); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setLoading(false)
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37] transition-colors"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {!bankOnly ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Prénom et nom</label>
              <input value={form.full_name} onChange={e => update('full_name', e.target.value)}
                placeholder="Jean Dupont" className={inputClass} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Téléphone</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                placeholder="+33 6 00 00 00 00" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Localisation</label>
            <select value={form.location} onChange={e => update('location', e.target.value)} className={inputClass}>
              <option value="">Sélectionner une région</option>
              {WINE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>À propos de moi</label>
            <textarea value={form.bio} onChange={e => update('bio', e.target.value)}
              rows={3} placeholder="Passionné de vins depuis..." className={`${inputClass} resize-none`} />
          </div>
        </>
      ) : (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
            <span>🔒</span>
            <span>Vos coordonnées bancaires sont stockées de manière sécurisée et ne sont visibles que par vous.</span>
          </div>
          <div>
            <label className={labelClass}>Titulaire du compte</label>
            <input value={form.account_holder} onChange={e => update('account_holder', e.target.value)}
              placeholder="Jean Dupont" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>IBAN</label>
            <input value={form.iban} onChange={e => update('iban', e.target.value.replace(/\s/g, '').toUpperCase())}
              placeholder="FR76 0000 0000 0000 0000 0000 000" className={inputClass}
              maxLength={34} />
          </div>
          <div>
            <label className={labelClass}>BIC / SWIFT</label>
            <input value={form.bic} onChange={e => update('bic', e.target.value.toUpperCase())}
              placeholder="BNPAFRPP" className={inputClass} maxLength={11} />
          </div>
        </>
      )}

      <button type="submit" disabled={loading}
        className="flex items-center gap-2 bg-[#722f37] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Enregistré !' : 'Sauvegarder'}
      </button>
    </form>
  )
}
