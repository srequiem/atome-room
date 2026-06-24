import { useEffect } from 'react'

/**
 * Précharge une liste d'images en arrière-plan dès que `active` est vrai.
 * Sert à charger les visuels de la boîte à chaussures pendant que la
 * personne explore la chambre, pour que l'ouverture soit instantanée.
 */
export const useImagePreload = (urls, active = true) => {
  useEffect(() => {
    if (!active) return
    const images = urls.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })
    return () => {
      images.forEach((img) => {
        img.src = ''
      })
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps
}
