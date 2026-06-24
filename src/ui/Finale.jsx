import { useState, useRef } from 'react'

import { INSTAGRAM_URL } from '../config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import GoldenTicket from './GoldenTicket.jsx'

const Finale = ({ onDismiss }) => {
  const { t } = useLanguage()

  const [ticketNumber, setTicketNumber] = useState(null)
  const svgRef = useRef(null)

  const generateTicketNumber = () =>
    String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')

  const handleGetTicket = () => {
    if (!ticketNumber) setTicketNumber(generateTicketNumber())
  }

  const handleDownload = () => {
    if (!svgRef.current) return
    const xml = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `golden-ticket-atome-${ticketNumber}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="finale">
      <p className="finale__kicker">{t.finale.kicker}</p>
      <p className="finale__text">
        {t.finale.text1}<br />
        {t.finale.text2}
      </p>

      {ticketNumber && (
        <div className="finale__ticket">
          <GoldenTicket number={ticketNumber} ref={svgRef} />
        </div>
      )}

      <div className="finale__actions">
        {ticketNumber ? (
          <button className="btn btn--primary" onClick={handleDownload}>
            {t.finale.download}
          </button>
        ) : (
          <button className="btn btn--primary" onClick={handleGetTicket}>
            {t.finale.getTicket}
          </button>
        )}
        <a className="btn" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>

      <button className="finale__dismiss" onClick={onDismiss}>
        {t.finale.dismiss}
      </button>
    </div>
  )
}

export default Finale
