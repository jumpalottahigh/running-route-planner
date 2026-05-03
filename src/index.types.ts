// Global type definitions
export interface Position {
  lat: number
  lng: number
}

export interface Route {
  coordinates: [number, number][]
  distanceMeters: number
  durationSeconds: number
  geojson: any
}

export interface GenerateRouteParams {
  lat: number
  lng: number
  distance: number
  unit: 'km' | 'mi'
  profile: 'foot-walking' | 'foot-hiking' | 'cycling-regular'
}
