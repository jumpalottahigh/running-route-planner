const R = 6371000 // Earth radius in meters

export function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

export function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI
}

export function offsetCoordinate(
  lat: number,
  lng: number,
  distanceMeters: number,
  bearingDegrees: number
): { lat: number; lng: number } {
  const latRad = degreesToRadians(lat)
  const lngRad = degreesToRadians(lng)
  const bearingRad = degreesToRadians(bearingDegrees)
  const d = distanceMeters / R

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(d) +
      Math.cos(latRad) * Math.sin(d) * Math.cos(bearingRad)
  )

  const newLngRad =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(d) * Math.cos(latRad),
      Math.cos(d) - Math.sin(latRad) * Math.sin(newLatRad)
    )

  return {
    lat: radiansToDegrees(newLatRad),
    lng: radiansToDegrees(newLngRad)
  }
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = degreesToRadians(lat2 - lat1)
  const dLng = degreesToRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function geoJsonToLatLngs(
  coordinates: [number, number][]
): [number, number][] {
  return coordinates.map(([lng, lat]) => [lat, lng])
}

export function routeLength(coordinates: [number, number][]): number {
  let total = 0
  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1]
    const [lng2, lat2] = coordinates[i]
    total += haversineDistance(lat1, lng1, lat2, lng2)
  }
  return total
}
