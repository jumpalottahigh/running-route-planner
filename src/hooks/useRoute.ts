import { useState, useCallback } from 'react'
import { generateCircularRoute } from '../services/routeService'
import { distanceToMeters } from '../utils/formatUtils'

interface UseRouteReturn {
  route: Route | null
  loading: boolean
  error: string | null
  generate: (params: GenerateRouteParams) => Promise<void>
  regenerate: (params: GenerateRouteParams) => Promise<void>
  clearRoute: () => void
}

export function useRoute(): UseRouteReturn {
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seed, setSeed] = useState(Math.floor(Math.random() * 9999))

  const generate = useCallback(
    async ({ lat, lng, distance, unit, profile }: GenerateRouteParams) => {
      setLoading(true)
      setError(null)
      try {
        const distanceMeters = distanceToMeters(distance, unit)
        const result = await generateCircularRoute({
          lat,
          lng,
          distanceMeters,
          seed,
          profile
        })
        setRoute(result)
      } catch (err) {
        setError((err as Error).message || 'Failed to generate route')
        setRoute(null)
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
    try {
      const distanceMeters = distanceToMeters(params.distance, params.unit)
      const result = await generateCircularRoute({
        lat: params.lat,
        lng: params.lng,
        distanceMeters,
        seed: newSeed,
        profile: params.profile
      })
      setRoute(result)
    } catch (err) {
      setError((err as Error).message || 'Failed to regenerate route')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearRoute = useCallback(() => {
    setRoute(null)
    setError(null)
  }, [])

  return { route, loading, error, generate, regenerate, clearRoute }
}
