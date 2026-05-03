export function formatDistance(
  meters: number,
  unit: 'km' | 'mi' = 'km'
): string {
  if (unit === 'mi') {
    const miles = meters / 1609.344
    return miles >= 10 ? miles.toFixed(1) : miles.toFixed(2)
  }
  const km = meters / 1000
  return km >= 10 ? km.toFixed(1) : km.toFixed(2)
}

export function distanceToMeters(
  value: number,
  unit: 'km' | 'mi' = 'km'
): number {
  return unit === 'mi' ? value * 1609.344 : value * 1000
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = Math.floor(totalSeconds % 60)
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

export function estimateDuration(meters: number, paceMinPerKm: number): string {
  const km = meters / 1000
  const totalMinutes = km * paceMinPerKm
  return formatDuration(totalMinutes * 60)
}

export function formatPace(
  paceMinPerKm: number,
  unit: 'km' | 'mi' = 'km'
): string {
  const pace = unit === 'mi' ? paceMinPerKm * 1.60934 : paceMinPerKm
  const m = Math.floor(pace)
  const s = Math.round((pace - m) * 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export function estimateCalories(
  meters: number,
  weightKg: number = 70
): number {
  const km = meters / 1000
  return Math.round((km / 70) * weightKg * 60)
}
