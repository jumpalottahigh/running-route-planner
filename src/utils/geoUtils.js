const R = 6371000; // Earth radius in meters

export function degreesToRadians(deg) {
  return (deg * Math.PI) / 180;
}

export function radiansToDegrees(rad) {
  return (rad * 180) / Math.PI;
}

/**
 * Offset a coordinate by a given distance and bearing.
 * @param {number} lat
 * @param {number} lng
 * @param {number} distanceMeters
 * @param {number} bearingDegrees - 0 = north, 90 = east
 */
export function offsetCoordinate(lat, lng, distanceMeters, bearingDegrees) {
  const latRad = degreesToRadians(lat);
  const lngRad = degreesToRadians(lng);
  const bearingRad = degreesToRadians(bearingDegrees);
  const d = distanceMeters / R;

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(d) +
    Math.cos(latRad) * Math.sin(d) * Math.cos(bearingRad)
  );

  const newLngRad = lngRad + Math.atan2(
    Math.sin(bearingRad) * Math.sin(d) * Math.cos(latRad),
    Math.cos(d) - Math.sin(latRad) * Math.sin(newLatRad)
  );

  return {
    lat: radiansToDegrees(newLatRad),
    lng: radiansToDegrees(newLngRad),
  };
}

/**
 * Calculate distance between two lat/lng points in meters (Haversine).
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLng = degreesToRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(degreesToRadians(lat1)) *
    Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Convert GeoJSON LineString coordinates to Leaflet [lat,lng] pairs.
 */
export function geoJsonToLatLngs(coordinates) {
  return coordinates.map(([lng, lat]) => [lat, lng]);
}

/**
 * Calculate total length of a GeoJSON coordinate array in meters.
 */
export function routeLength(coordinates) {
  let total = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    total += haversineDistance(lat1, lng1, lat2, lng2);
  }
  return total;
}
