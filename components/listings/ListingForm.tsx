'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { WINE_REGIONS, WINE_COLORS, BOTTLE_SIZES } from '@/lib/utils'
import { Upload, X, Loader2 } from 'lucide-react'
import type { Listing } from '@/lib/supabase/types'

interface ListingFormProps {
  userId: string
  listing?: Listing
}

export function ListingForm({ userId, listing }: ListingFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>(listing?.images || [])

  const [form, setForm] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    producer: listing?.producer || '',
    appellation: listing?.appellation || '',
    region: listing?.region || '',
    vintage: listing?.vintage?.toString() || '',
    grape_variety: listing?.grape_variety || '',
    color: listing?.color || '',
    price: listing?.price?.toString() || '',
    quantity: listing?.quantity?.toString() || '1',
    bottle_size: listing?.bottle_size || '75cl',
  })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true)
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage.from('listings').upload(path, file)
      if (!uploadError) {
        const { data } = supabase.storage.from('listings').getPublicUrl(path)
        uploaded.push(data.publicUrl)
      }
    }
    setImages(prev => [...prev, ...uploaded].slice(0, 6))
    setUploadingImages(false)
  }

  const removeImage = async (url: string) => {
    const path = url.split('/listings/')[1]
    await supabase.storage.from('listings').remove([path])
    setImages(prev => prev.filter(i => i !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      title: form.title,
      description: form.description || null,
      producer: form.producer || null,
      appellation: form.appellation || null,
      region: form.region || null,
      vintage: form.vintage ? parseInt(form.vintage) : null,
      grape_variety: form.grape_variety || null,
      color: (form.color as Listing['color']) || null,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      bottle_size: form.bottle_size as Listing['bottle_size'],
      images,
    }

    if (listing) {
      const { error } = await supabase.from('listings').update(payload).eq('id', listing.id)
      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/annonces/${listing.id}`)
    } else {
      const { data, error } = await supabase.from('listings').insert({ ...payload, seller_id: userId }).select().single()
      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/annonces/${data.id}`)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37] transition-colors"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Images */}
      <div className="bg-white rounded-xl border border-[#f0e8d8] p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Photos</h2>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 6 && (
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#722f37] hover:text-[#722f37] transition-colors">
              {uploadingImages ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              <span className="text-xs">Ajouter</span>
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => e.target.files && handleImageUpload(e.target.files)} />
        <p className="text-xs text-gray-400">Max 6 photos · JPG, PNG, WebP · 5 Mo max par photo</p>
      </div>

      {/* Infos principales */}
      <div className="bg-white rounded-xl border border-[#f0e8d8] p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Informations</h2>
        <div>
          <label className={labelClass}>Titre de l'annonce *</label>
          <input required value={form.title} onChange={e => update('title', e.target.value)}
            placeholder="Ex: Pétrus 2015 - 75cl" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Producteur / Château</label>
            <input value={form.producer} onChange={e => update('producer', e.target.value)}
              placeholder="Ex: Château Margaux" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Appellation</label>
            <input value={form.appellation} onChange={e => update('appellation', e.target.value)}
              placeholder="Ex: Pomerol" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Région</label>
            <select value={form.region} onChange={e => update('region', e.target.value)} className={inputClass}>
              <option value="">Sélectionner</option>
              {WINE_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Millésime</label>
            <input type="number" value={form.vintage} onChange={e => update('vintage', e.target.value)}
              placeholder="Ex: 2018" min="1900" max={new Date().getFullYear()} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Couleur</label>
            <select value={form.color} onChange={e => update('color', e.target.value)} className={inputClass}>
              <option value="">Sélectionner</option>
              {WINE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Cépage</label>
            <input value={form.grape_variety} onChange={e => update('grape_variety', e.target.value)}
              placeholder="Ex: Merlot, Cabernet" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)}
            rows={4} placeholder="Décrivez votre bouteille, son état, ses caractéristiques..."
            className={`${inputClass} resize-none`} />
        </div>
      </div>

      {/* Prix et quantité */}
      <div className="bg-white rounded-xl border border-[#f0e8d8] p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Prix & Quantité</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Prix (€) *</label>
            <input required type="number" value={form.price} onChange={e => update('price', e.target.value)}
              placeholder="0.00" min="0.01" step="0.01" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Quantité</label>
            <input type="number" value={form.quantity} onChange={e => update('quantity', e.target.value)}
              min="1" max="999" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Format</label>
            <select value={form.bottle_size} onChange={e => update('bottle_size', e.target.value)} className={inputClass}>
              {BOTTLE_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#722f37] text-white py-3 rounded-xl font-semibold hover:bg-[#9b3d47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {listing ? "Mettre à jour l'annonce" : "Publier l'annonce"}
      </button>
    </form>
  )
}
