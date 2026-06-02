import Link from 'next/link'
import { Wine } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#4a1d24] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wine className="h-5 w-5 text-[#c9a84c]" />
              <span className="font-bold text-lg"><span className="text-[#c9a84c]">Ma</span> Cave</span>
            </div>
            <p className="text-sm text-white/60">
              La marketplace de confiance entre passionnés de vin. Achetez, vendez et échangez vos plus belles bouteilles.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[#c9a84c]">Navigation</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/annonces" className="hover:text-white transition-colors">Explorer les annonces</Link></li>
              <li><Link href="/annonces/nouvelle" className="hover:text-white transition-colors">Vendre une bouteille</Link></li>
              <li><Link href="/connexion" className="hover:text-white transition-colors">Mon compte</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-[#c9a84c]">Informations</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors">CGU</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/40">
          © {new Date().getFullYear()} Ma Cave. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
