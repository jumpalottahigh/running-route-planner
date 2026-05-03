import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'saved_routes'
const MAX_ROUTES = 50

interface UseSavedRoutesReturn {
  savedRoutes: SavedRoute[]
  loading: boolean
  error: string | null
  saveRoute: (route: SavedRoute) => void
  loadRoute: (id: string) => SavedRoute | null
  deleteRoute: (id: string) => void
  getAllSaved: () => SavedRoute[]
}

export function useSavedRoutes(): UseSavedRoutesReturn {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load saved routes on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const routes = JSON.parse(stored) as SavedRoute[]
        setSavedRoutes(routes)
      }
      setLoading(false)
    } catch (err) {
      setError((err as Error).message || 'Failed to load saved routes')
      setLoading(false)
    }
  }, [])

  const saveRoute = useCallback((route: SavedRoute) => {
    try {
      setSavedRoutes((prev) => {
        const updated = [route, ...prev]
        // Keep only the most recent MAX_ROUTES
        const trimmed = updated.slice(0, MAX_ROUTES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
        return trimmed
      })
    } catch (err) {
      setError((err as Error).message || 'Failed to save route')
    }
  }, [])

  const loadRoute = useCallback(
    (id: string): SavedRoute | null => {
      return savedRoutes.find((r) => r.id === id) || null
    },
    [savedRoutes]
  )

  const deleteRoute = useCallback((id: string) => {
    try {
      setSavedRoutes((prev) => {
        const updated = prev.filter((r) => r.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      setError((err as Error).message || 'Failed to delete route')
    }
  }, [])

  const getAllSaved = useCallback(() => {
    return savedRoutes
  }, [savedRoutes])

  return {
    savedRoutes,
    loading,
    error,
    saveRoute,
    loadRoute,
    deleteRoute,
    getAllSaved
  }
}
