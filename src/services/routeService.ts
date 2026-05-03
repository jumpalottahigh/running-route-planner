const ORS_BASE = 'https://api.openrouteservice.org/v2'
const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY

interface GenerateRouteInput {
  lat: number
  lng: number
  distanceMeters: number
  seed: number
  profile: 'foot-walking' | 'foot-hiking' | 'cycling-regular'
}

interface RouteResult {
  coordinates: [number, number][]
  distanceMeters: number
  durationSeconds: number
  geojson: any
}

async function fetchRoute(input: GenerateRouteInput): Promise<RouteResult> {
  const url = `${ORS_BASE}/directions/${input.profile}/geojson`

  const body = {
    coordinates: [[input.lng, input.lat]],
    options: {
      round_trip: {
        length: Math.round(input.distanceMeters),
        points: 3,
        seed: input.seed
      }
    },
    instructions: false
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: ORS_API_KEY.trim(),
      'Content-Type': 'application/json',
      Accept: 'application/json, application/geo+json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    let message = `ORS API error (${response.status})`
    try {
      const err = await response.json()
      message = err?.error?.message || message
    } catch (_) {}
    throw new Error(message)
  }

  const geojson = await response.json()
  const feature = geojson?.features?.[0]

  if (!feature) {
    throw new Error(
      'No route returned from the API. Try a different distance or location.'
    )
  }

  const coords = feature.geometry.coordinates
  const summary = feature.properties?.summary

  return {
    coordinates: coords,
    distanceMeters: summary?.distance ?? 0,
    durationSeconds: summary?.duration ?? 0,
    geojson: feature
  }
}

export async function generateCircularRoute(
  input: GenerateRouteInput
): Promise<RouteResult> {
  if (!ORS_API_KEY || !ORS_API_KEY.trim()) {
    throw new Error('API key not configured. Check your .env.local file.')
  }

  return fetchRoute(input)
}

export async function generateMultipleRoutes(
  input: GenerateRouteInput,
  count: number = 3
): Promise<RouteResult[]> {
  if (!ORS_API_KEY || !ORS_API_KEY.trim()) {
    throw new Error('API key not configured. Check your .env.local file.')
  }

  const routes = await Promise.all(
    Array.from({ length: count }).map((_, i) =>
      fetchRoute({
        ...input,
        seed: input.seed + i * 1000
      })
    )
  )

  return routes
}
