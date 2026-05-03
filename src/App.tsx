import { useState, useCallback, useEffect, FC, useRef } from 'react'
import MapView from './components/Map/MapView'
import Sidebar from './components/Sidebar/Sidebar'
import { useGeolocation } from './hooks/useGeolocation'
import { useRoute } from './hooks/useRoute'
import { useSavedRoutes } from './hooks/useSavedRoutes'
import { encodeRouteToUrl, decodeUrlToParams } from './utils/urlUtils'

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

  const {
    savedRoutes,
    saveRoute,
    loadRoute,
    deleteRoute
  } = useSavedRoutes()

  const route = routes ? routes[selectedRouteIndex] : null

  const [startPoint, setStartPoint] = useState<Position | null>(null)
  const [distance, setDistance] = useState(5)
  const [unit, setUnit] = useState<'km' | 'mi'>('km')
  const [pace, setPace] = useState(5.5)
  const [profile, setProfile] = useState<'foot-walking' | 'foot-hiking'>(
    'foot-walking'
  )

  const urlSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Restore state from URL on mount
  useEffect(() => {
    const params = decodeUrlToParams(window.location.hash)
    if (params) {
      if (params.distance) setDistance(params.distance)
      if (params.unit) setUnit(params.unit)
      if (params.pace) setPace(params.pace)
      if (params.profile) setProfile(params.profile)
      if (params.lat && params.lng) {
        setStartPoint({ lat: params.lat, lng: params.lng })
      }
    }
  }, [])

  // Sync state to URL on change (debounced)
  useEffect(() => {
    if (urlSyncTimeoutRef.current) {
      clearTimeout(urlSyncTimeoutRef.current)
    }

    urlSyncTimeoutRef.current = setTimeout(() => {
      const urlHash = encodeRouteToUrl({
        startPoint,
        distance,
        unit,
        pace,
        profile,
        selectedRouteIndex
      })
      window.history.replaceState(null, '', `#${urlHash}`)
    }, 500)

    return () => {
      if (urlSyncTimeoutRef.current) {
        clearTimeout(urlSyncTimeoutRef.current)
      }
    }
  }, [startPoint, distance, unit, pace, profile, selectedRouteIndex])

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

  const handleShare = useCallback(async () => {
    const urlHash = encodeRouteToUrl({
      startPoint,
      distance,
      unit,
      pace,
      profile,
      selectedRouteIndex
    })
    const shareUrl = `${window.location.origin}${window.location.pathname}#${urlHash}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Route URL copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy URL:', err)
      alert('Could not copy URL. Please try again.')
    }
  }, [startPoint, distance, unit, pace, profile, selectedRouteIndex])

  const handleSave = useCallback(
    (name: string) => {
      if (!routes || !startPoint) return

      const savedRoute: SavedRoute = {
        id: Date.now().toString(),
        name,
        distance,
        unit,
        pace,
        profile,
        startPoint,
        routes,
        selectedRouteIndex,
        savedAt: Date.now()
      }

      saveRoute(savedRoute)
      alert(`Route "${name}" saved!`)
    },
    [routes, startPoint, distance, unit, pace, profile, selectedRouteIndex, saveRoute]
  )

  const handleLoadSavedRoute = useCallback(
    (savedRoute: SavedRoute) => {
      setStartPoint(savedRoute.startPoint)
      setDistance(savedRoute.distance)
      setUnit(savedRoute.unit)
      setPace(savedRoute.pace)
      setProfile(savedRoute.profile)
      selectRoute(savedRoute.selectedRouteIndex)
    },
    [selectRoute]
  )

  const handleDeleteSavedRoute = useCallback(
    (id: string) => {
      if (confirm('Delete this saved route?')) {
        deleteRoute(id)
      }
    },
    [deleteRoute]
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
        savedRoutes={savedRoutes}
        onDistanceChange={setDistance}
        onUnitChange={handleUnitChange}
        onPaceChange={setPace}
        onProfileChange={setProfile}
        onGenerate={handleGenerate}
        onRegenerate={handleRegenerate}
        onSelectRoute={selectRoute}
        onShare={handleShare}
        onSave={handleSave}
        onLoadSavedRoute={handleLoadSavedRoute}
        onDeleteSavedRoute={handleDeleteSavedRoute}
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
