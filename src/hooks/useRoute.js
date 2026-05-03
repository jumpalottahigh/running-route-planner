import { useState, useCallback } from 'react'
import { generateCircularRoute } from '../services/routeService'
import { distanceToMeters } from '../utils/formatUtils'

export function useRoute() {
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [seed, setSeed] = useState(Math.floor(Math.random() * 9999))

  const generate = useCallback(
    async ({ lat, lng, distance, unit, profile }) => {
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
        setError(err.message)
        setRoute(null)
      } finally {
        setLoading(false)
      }
    },
    [seed]
  )

  const regenerate = useCallback(async (params) => {
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
      setError(err.message)
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
