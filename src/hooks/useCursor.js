import { useEffect } from 'react'

/**
 * Passe le curseur en "pointer" tant que `hovered` est vrai,
 * et le restaure proprement au démontage.
 * Utilisé par tous les objets cliquables de la scène.
 */
export const useCursor = (hovered) => {
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])
}
