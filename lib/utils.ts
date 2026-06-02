import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return formatDate(date)
}

export const WINE_REGIONS = [
  'Bordeaux', 'Bourgogne', 'Champagne', 'Rhône', 'Alsace',
  'Loire', 'Provence', 'Languedoc-Roussillon', 'Sud-Ouest',
  'Jura', 'Savoie', 'Beaujolais', 'Corse', 'Autre',
]

export const WINE_COLORS = [
  { value: 'rouge', label: 'Rouge' },
  { value: 'blanc', label: 'Blanc' },
  { value: 'rosé', label: 'Rosé' },
  { value: 'effervescent', label: 'Effervescent' },
  { value: 'liquoreux', label: 'Liquoreux' },
] as const

export const BOTTLE_SIZES = [
  { value: '37.5cl', label: 'Demi-bouteille (37.5cl)' },
  { value: '75cl', label: 'Bouteille standard (75cl)' },
  { value: '150cl', label: 'Magnum (150cl)' },
  { value: '300cl', label: 'Double magnum (300cl)' },
  { value: '600cl', label: 'Impériale (600cl)' },
] as const

export const WINE_COLOR_BADGE: Record<string, string> = {
  rouge: 'bg-red-100 text-red-800',
  blanc: 'bg-yellow-50 text-yellow-800',
  rosé: 'bg-pink-100 text-pink-800',
  effervescent: 'bg-blue-100 text-blue-800',
  liquoreux: 'bg-amber-100 text-amber-800',
}

export const WINE_COLOR_DOT: Record<string, string> = {
  rouge: 'bg-red-600',
  blanc: 'bg-yellow-300',
  rosé: 'bg-pink-400',
  effervescent: 'bg-blue-400',
  liquoreux: 'bg-amber-500',
}
