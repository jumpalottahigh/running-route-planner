import { useState, useCallback, useEffect, FC } from 'react'
import MapView from './components/Map/MapView'
import Sidebar from './components/Sidebar/Sidebar'
import { useGeolocation } from './hooks/useGeolocation'
import { useRoute } from './hooks/useRoute'

const App: FC = () => {
  const { position } = useGeolocation()
  const {
    routes,
    selectedRouteIndex,
    loading,
    error,
    generate,
    regenerate,
    selectRoute,
    clearRoute
  } = useRoute()

  const route = routes ? routes[selectedRouteIndex] : null

  const [startPoint, setStartPoint] = useState<Position | null>(null)
  const [distance, setDistance] = useState(5)
  const [unit, setUnit] = useState<'km' | 'mi'>('km')
  const [pace, setPace] = useState(5.5)
  const [profile, setProfile] = useState<'foot-walking' | 'foot-hiking'>(
    'foot-walking'
  )

  // Set start from geolocation when available (once)
  useEffect(() => {
    if (position && !startPoint) {
      setStartPoint(position)
    }
  }, [position, startPoint])

  const handleMapClick = useCallback(
    (pos: Position) => {
      setStartPoint(pos)
      clearRoute()
    },
    [clearRoute]
  )

  const handleGenerate = useCallback(() => {
    if (!startPoint) return
    const params: GenerateRouteParams = {
      lat: startPoint.lat,
      lng: startPoint.lng,
      distance,
      unit,
      profile: profile as 'foot-walking' | 'foot-hiking' | 'cycling-regular'
    }
    generate(params)
  }, [startPoint, distance, unit, profile, generate])

  const handleRegenerate = useCallback(() => {
    if (!startPoint) return
    const params: GenerateRouteParams = {
      lat: startPoint.lat,
      lng: startPoint.lng,
      distance,
      unit,
      profile: profile as 'foot-walking' | 'foot-hiking' | 'cycling-regular'
    }
    regenerate(params)
  }, [startPoint, distance, unit, profile, regenerate])

  const handleUnitChange = useCallback(
    (newUnit: 'km' | 'mi') => {
      if (newUnit === unit) return
      if (newUnit === 'mi') {
        setDistance((prev) => +(prev / 1.60934).toFixed(1))
      } else {
        setDistance((prev) => +(prev * 1.60934).toFixed(1))
      }
      setUnit(newUnit)
    },
    [unit]
  )

  return (
    <div className='app-layout'>
      <Sidebar
        distance={distance}
        unit={unit}
        pace={pace}
        profile={profile}
        route={route}
        routes={routes}
        selectedRouteIndex={selectedRouteIndex}
        loading={loading}
        error={error}
        onDistanceChange={setDistance}
        onUnitChange={handleUnitChange}
        onPaceChange={setPace}
        onProfileChange={setProfile}
        onGenerate={handleGenerate}
        onRegenerate={handleRegenerate}
        onSelectRoute={selectRoute}
      />
      <MapView
        startPoint={startPoint}
        onMapClick={handleMapClick}
        route={route}
      />
    </div>
  )
}

export default App
