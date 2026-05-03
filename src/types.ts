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

export interface SavedRoute {
  id: string
  name: string
  distance: number
  unit: 'km' | 'mi'
  pace: number
  profile: 'foot-walking' | 'foot-hiking'
  startPoint: Position
  routes: Route[]
  selectedRouteIndex: number
  savedAt: number
}
