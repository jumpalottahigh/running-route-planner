import { useState, useCallback, useEffect } from 'react'
import MapView from './components/Map/MapView'
import Sidebar from './components/Sidebar/Sidebar'
import { useGeolocation } from './hooks/useGeolocation'
import { useRoute } from './hooks/useRoute'

export default function App() {
  const { position } = useGeolocation()
  const { route, loading, error, generate, regenerate, clearRoute } = useRoute()

  const [startPoint, setStartPoint] = useState(null)
  const [distance, setDistance] = useState(5)
  const [unit, setUnit] = useState('km')
  const [pace, setPace] = useState(5.5)
  const [profile, setProfile] = useState('foot-walking')

  // Set start from geolocation when available (once)
  useEffect(() => {
    if (position && !startPoint) {
      setStartPoint(position)
    }
  }, [position, startPoint])

  const handleMapClick = useCallback(
    (pos) => {
      setStartPoint(pos)
      clearRoute()
    },
    [clearRoute]
  )

  const handleGenerate = useCallback(() => {
    if (!startPoint) return
    generate({
      lat: startPoint.lat,
      lng: startPoint.lng,
      distance,
      unit,
      profile
    })
  }, [startPoint, distance, unit, profile, generate])

  const handleRegenerate = useCallback(() => {
    if (!startPoint) return
    regenerate({
      lat: startPoint.lat,
      lng: startPoint.lng,
      distance,
      unit,
      profile
    })
  }, [startPoint, distance, unit, profile, regenerate])

  const handleUnitChange = useCallback(
    (newUnit) => {
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
        loading={loading}
        error={error}
        onDistanceChange={setDistance}
        onUnitChange={handleUnitChange}
        onPaceChange={setPace}
        onProfileChange={setProfile}
        onGenerate={handleGenerate}
        onRegenerate={handleRegenerate}
      />
      <MapView
        startPoint={startPoint}
        onMapClick={handleMapClick}
        route={route}
      />
    </div>
  )
}
