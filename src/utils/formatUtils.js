/**
 * Format meters to a readable distance string.
 * @param {number} meters
 * @param {'km'|'mi'} unit
 */
export function formatDistance(meters, unit = 'km') {
  if (unit === 'mi') {
    const miles = meters / 1609.344;
    return miles >= 10 ? miles.toFixed(1) : miles.toFixed(2);
  }
  const km = meters / 1000;
  return km >= 10 ? km.toFixed(1) : km.toFixed(2);
}

/**
 * Convert km target distance to meters, handling unit conversion.
 */
export function distanceToMeters(value, unit = 'km') {
  return unit === 'mi' ? value * 1609.344 : value * 1000;
}

/**
 * Format seconds into hh:mm:ss or mm:ss string.
 */
export function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Estimate run duration from distance (meters) and pace (min/km).
 */
export function estimateDuration(meters, paceMinPerKm) {
  const km = meters / 1000;
  const totalMinutes = km * paceMinPerKm;
  return formatDuration(totalMinutes * 60);
}

/**
 * Format pace as mm:ss /km or /mi.
 */
export function formatPace(paceMinPerKm, unit = 'km') {
  const pace = unit === 'mi' ? paceMinPerKm * 1.60934 : paceMinPerKm;
  const m = Math.floor(pace);
  const s = Math.round((pace - m) * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Estimate calories burned (rough MET-based formula).
 * @param {number} meters - distance in meters
 * @param {number} weightKg - user weight in kg (default 70)
 */
export function estimateCalories(meters, weightKg = 70) {
  const km = meters / 1000;
  // ~60 kcal per km per 70kg runner (rough estimate)
  return Math.round((km / 70) * weightKg * 60);
}
