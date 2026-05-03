import { useState, useCallback } from 'react'
import { generateMultipleRoutes } from '../services/routeService'
import { distanceToMeters } from '../utils/formatUtils'

interface UseRouteReturn {
  routes: Route[] | null
  selectedRouteIndex: number
  loading: boolean
  error: string | null
  generate: (params: GenerateRouteParams) => Promise<void>
  regenerate: (params: GenerateRouteParams) => Promise<void>
  selectRoute: (index: number) => void
  clearRoute: () => void
}

export function useRoute(): UseRouteReturn {
  const [routes, setRoutes] = useState<Route[] | null>(null)
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seed, setSeed] = useState(Math.floor(Math.random() * 9999))

  const generate = useCallback(
    async ({ lat, lng, distance, unit, profile }: GenerateRouteParams) => {
      setLoading(true)
      setError(null)
      setSelectedRouteIndex(0)
      try {
        const distanceMeters = distanceToMeters(distance, unit)
        const results = await generateMultipleRoutes(
          {
            lat,
            lng,
            distanceMeters,
            seed,
            profile
          },
          3
        )
        setRoutes(results)
      } catch (err) {
        setError((err as Error).message || 'Failed to generate route')
        setRoutes(null)
      } finally {
        setLoading(false)
      }
    },
    [seed]
  )

  const regenerate = useCallback(async (params: GenerateRouteParams) => {
    const newSeed = Math.floor(Math.random() * 9999)
    setSeed(newSeed)
    setLoading(true)
    setError(null)
    setSelectedRouteIndex(0)
    try {
      const distanceMeters = distanceToMeters(params.distance, params.unit)
      const results = await generateMultipleRoutes(
        {
          lat: params.lat,
          lng: params.lng,
          distanceMeters,
          seed: newSeed,
          profile: params.profile
        },
        3
      )
      setRoutes(results)
    } catch (err) {
      setError((err as Error).message || 'Failed to regenerate route')
    } finally {
      setLoading(false)
    }
  }, [])

  const selectRoute = useCallback((index: number) => {
    if (routes && index >= 0 && index < routes.length) {
      setSelectedRouteIndex(index)
    }
  }, [routes])

  const clearRoute = useCallback(() => {
    setRoutes(null)
    setSelectedRouteIndex(0)
    setError(null)
  }, [])

  return {
    routes,
    selectedRouteIndex,
    loading,
    error,
    generate,
    regenerate,
    selectRoute,
    clearRoute
  }
}
