import { PRESAVE_URL } from '../config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const Hud = ({ muted, onToggleMute, showPresave }) => {
  const { lang, setLang, t } = useLanguage()

  return (
    <header className="hud-top">
      <div className="hud-id">
        <span className="hud-id__artist">Sacha Requiem</span>
        <span className="hud-id__title">ATOME</span>
      </div>

      <div className="hud-actions">
        {showPresave && (
          <a className="hud-btn hud-btn--red" href={PRESAVE_URL} target="_blank" rel="noreferrer">
            {t.hud.presave}
          </a>
        )}

        <div className="hud-lang" role="group" aria-label="Langue / Language">
          <button
            className={`hud-lang__btn${lang === 'fr' ? ' is-active' : ''}`}
            onClick={() => setLang('fr')}
            aria-pressed={lang === 'fr'}
          >
            FR
          </button>
          <span className="hud-lang__sep" aria-hidden="true">/</span>
          <button
            className={`hud-lang__btn${lang === 'en' ? ' is-active' : ''}`}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>

        <button
          className="hud-btn"
          onClick={onToggleMute}
          aria-label={muted ? t.hud.soundOn : t.hud.soundOff}
        >
          {muted ? t.hud.muted : t.hud.sound}
        </button>
      </div>
    </header>
  )
}

export default Hud
