interface UrlParams {
  lat?: number
  lng?: number
  distance: number
  unit: 'km' | 'mi'
  pace: number
  profile: 'foot-walking' | 'foot-hiking'
  selectedRoute: number
}

export function encodeRouteToUrl(params: {
  startPoint: Position | null
  distance: number
  unit: 'km' | 'mi'
  pace: number
  profile: 'foot-walking' | 'foot-hiking'
  selectedRouteIndex: number
}): string {
  const searchParams = new URLSearchParams()

  if (params.startPoint) {
    searchParams.set('lat', params.startPoint.lat.toString())
    searchParams.set('lng', params.startPoint.lng.toString())
  }

  searchParams.set('distance', params.distance.toString())
  searchParams.set('unit', params.unit)
  searchParams.set('pace', params.pace.toString())
  searchParams.set('profile', params.profile)
  searchParams.set('selectedRoute', params.selectedRouteIndex.toString())

  return searchParams.toString()
}

export function decodeUrlToParams(hash: string): Partial<UrlParams> | null {
  if (!hash) return null

  try {
    const searchParams = new URLSearchParams(hash.replace(/^#/, ''))

    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const distance = searchParams.get('distance')
    const unit = searchParams.get('unit')
    const pace = searchParams.get('pace')
    const profile = searchParams.get('profile')
    const selectedRoute = searchParams.get('selectedRoute')

    if (!distance || !unit || !pace || !profile) {
      return null
    }

    const params: Partial<UrlParams> = {
      distance: parseFloat(distance),
      unit: unit as 'km' | 'mi',
      pace: parseFloat(pace),
      profile: profile as 'foot-walking' | 'foot-hiking',
      selectedRoute: selectedRoute ? parseInt(selectedRoute) : 0
    }

    if (lat && lng) {
      params.lat = parseFloat(lat)
      params.lng = parseFloat(lng)
    }

    return params
  } catch (error) {
    console.error('Error decoding URL params:', error)
    return null
  }
}

export function getShareableUrl(): string {
  const hash = encodeRouteToUrl({
    startPoint: null,
    distance: 0,
    unit: 'km',
    pace: 0,
    profile: 'foot-walking',
    selectedRouteIndex: 0
  })

  return `${window.location.origin}${window.location.pathname}#${hash}`
}
