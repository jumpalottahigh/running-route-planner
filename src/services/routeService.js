const ORS_BASE = 'https://api.openrouteservice.org/v2'
const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY

/**
 * Generate a circular running route using OpenRouteService.
 * @param {object} params
 * @param {number} params.lat - Start latitude
 * @param {number} params.lng - Start longitude
 * @param {number} params.distanceMeters - Target round-trip distance in meters
 * @param {number} params.seed - Random seed for different routes
 * @param {'foot-walking'|'foot-hiking'|'cycling-regular'} params.profile
 */
export async function generateCircularRoute({
  lat,
  lng,
  distanceMeters,
  seed,
  profile = 'foot-walking'
}) {
  if (!ORS_API_KEY || !ORS_API_KEY.trim()) {
    throw new Error('API key not configured. Check your .env.local file.')
  }

  const url = `${ORS_BASE}/directions/${profile}/geojson`

  const body = {
    coordinates: [[lng, lat]],
    options: {
      round_trip: {
        length: Math.round(distanceMeters),
        points: 3,
        seed: seed
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
    coordinates: coords, // [[lng, lat], ...]
    distanceMeters: summary?.distance ?? 0,
    durationSeconds: summary?.duration ?? 0,
    geojson: feature
  }
}
