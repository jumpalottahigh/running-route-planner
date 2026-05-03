import { useState, useEffect } from 'react'

interface UseGeolocationReturn {
  position: Position | null
  loading: boolean
  error: string | null
}

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<Position | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.warn('Geolocation error:', err.message)
        let message = err.message
        if (err.code === 1) {
          message =
            'Location permission denied. Tap the map to set your start point.'
        } else if (err.code === 2) {
          message = 'Unable to retrieve location. Check your connection.'
        } else if (err.code === 3) {
          message = 'Location request timed out. Please try again.'
        }
        setError(message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  return { position, loading, error }
}
