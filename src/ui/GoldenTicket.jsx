import { forwardRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const GoldenTicket = forwardRef(({ number }, ref) => {
  const { t } = useLanguage()
  const tk = t.ticket

  return (
    <svg ref={ref} className="ticket" viewBox="0 0 680 340" role="img" xmlns="http://www.w3.org/2000/svg">
      <title>Golden Ticket ATOME — Sacha Requiem</title>
      <desc>Billet nuit et or en forme de billet de cinéma, avec une souche détachable et un numéro de série.</desc>
      <defs>
        <path id="tk-shape" d="M54 60 L610 60 A14 14 0 0 1 624 74 A12 12 0 0 1 624 98 A12 12 0 0 1 624 122 A12 12 0 0 1 624 146 A12 12 0 0 1 624 170 A12 12 0 0 1 624 194 A12 12 0 0 1 624 218 A12 12 0 0 1 624 242 A12 12 0 0 1 624 266 L624 286 A14 14 0 0 1 610 300 L54 300 A14 14 0 0 1 40 286 L40 206 A26 26 0 0 1 40 154 L40 74 A14 14 0 0 1 54 60 Z" />
      </defs>

      {/* silhouette + double filet */}
      <use href="#tk-shape" fill="#0b1020" stroke="#b8923f" strokeWidth="1.4" />
      <use
        href="#tk-shape"
        fill="none"
        stroke="#e7c977"
        strokeOpacity="0.4"
        strokeWidth="0.8"
        transform="translate(338,180) scale(0.955) translate(-338,-180)"
      />

      {/* corps */}
      <path d="M150 91 L152 97 L158 98 L152 99 L150 105 L148 99 L142 98 L148 97 Z" fill="#e7c977" />
      <path d="M366 91 L368 97 L374 98 L368 99 L366 105 L364 99 L358 98 L364 97 Z" fill="#e7c977" />
      <text x="258" y="102" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="12" letterSpacing="4" fill="#e7c977">GOLDEN TICKET</text>

      <path d="M352 144 L355 156 L367 159 L355 162 L352 174 L349 162 L337 159 L349 156 Z" fill="#e23b2e" />
      <text x="258" y="182" textAnchor="middle" fontFamily="'Instrument Serif', Georgia, serif" fontSize="58" fill="#f2ead8">ATOME</text>

      <text x="64" y="216" fontFamily="'IBM Plex Mono', monospace" fontSize="12" fill="#c9bfa6">{tk.access}</text>

      <line x1="64" y1="238" x2="452" y2="238" stroke="#b8923f" strokeOpacity="0.22" strokeWidth="1" />
      <text x="64" y="268" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="18" fill="#b8923f">Sacha Requiem</text>
      <text x="452" y="268" textAnchor="end" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="18" fill="#b8923f">{tk.edition}</text>

      {/* perforation */}
      <g fill="#e7c977" fillOpacity="0.45">
        <circle cx="468" cy="84" r="3.5" />
        <circle cx="468" cy="108" r="3.5" />
        <circle cx="468" cy="132" r="3.5" />
        <circle cx="468" cy="156" r="3.5" />
        <circle cx="468" cy="180" r="3.5" />
        <circle cx="468" cy="204" r="3.5" />
        <circle cx="468" cy="228" r="3.5" />
        <circle cx="468" cy="252" r="3.5" />
        <circle cx="468" cy="276" r="3.5" />
      </g>

      {/* souche */}
      <path d="M549 80 L552 94 L566 97 L552 100 L549 114 L546 100 L532 97 L546 94 Z" fill="#e7c977" />
      <text x="549" y="150" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="11" letterSpacing="3" fill="#c9bfa6">{tk.admit}</text>
      <text x="549" y="184" textAnchor="middle" fontFamily="'Instrument Serif', Georgia, serif" fontSize="32" fill="#f2ead8">{tk.one}</text>
      <line x1="516" y1="202" x2="582" y2="202" stroke="#b8923f" strokeOpacity="0.3" strokeWidth="0.8" />
      <text x="549" y="230" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="15" letterSpacing="1" fill="#e7c977">N°{number}</text>
    </svg>
  )
})

GoldenTicket.displayName = 'GoldenTicket'

export default GoldenTicket
