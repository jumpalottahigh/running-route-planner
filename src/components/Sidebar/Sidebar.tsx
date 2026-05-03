import type { FC } from 'react'
import { useState } from 'react'
import DistanceInput from './DistanceInput'
import PaceSettings from './PaceSettings'
import RouteStats from './RouteStats'
import SavedRoutesList from './SavedRoutesList'

interface SidebarProps {
  distance: number
  unit: 'km' | 'mi'
  pace: number
  profile: 'foot-walking' | 'foot-hiking'
  route: Route | null
  routes: Route[] | null
  selectedRouteIndex: number
  loading: boolean
  error: string | null
  savedRoutes: SavedRoute[]
  onDistanceChange: (distance: number) => void
  onUnitChange: (unit: 'km' | 'mi') => void
  onPaceChange: (pace: number) => void
  onProfileChange: (profile: 'foot-walking' | 'foot-hiking') => void
  onGenerate: () => void
  onRegenerate: () => void
  onSelectRoute: (index: number) => void
  onShare: () => void
  onSave: (name: string) => void
  onLoadSavedRoute: (route: SavedRoute) => void
  onDeleteSavedRoute: (id: string) => void
}

const Sidebar: FC<SidebarProps> = ({
  distance,
  unit,
  pace,
  profile,
  route,
  routes,
  selectedRouteIndex,
  loading,
  error,
  savedRoutes,
  onDistanceChange,
  onUnitChange,
  onPaceChange,
  onProfileChange,
  onGenerate,
  onRegenerate,
  onSelectRoute,
  onShare,
  onSave,
  onLoadSavedRoute,
  onDeleteSavedRoute
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveRouteName, setSaveRouteName] = useState('')

  const handleSaveRoute = () => {
    const name =
      saveRouteName.trim() || `Route ${new Date().toLocaleDateString()}`
    onSave(name)
    setSaveRouteName('')
    setShowSaveDialog(false)
  }
  return (
    <aside className='sidebar'>
      <div className='sidebar-header'>
        <h1 className='logo'>
          <img src='/favicon.png' alt='RunLoop' className='logo-icon' />
          RunLoop
        </h1>
        <p className='tagline'>Smart circular routes for runners</p>
      </div>

      <div className='sidebar-scroll'>
        <DistanceInput
          distance={distance}
          unit={unit}
          onChange={onDistanceChange}
          onUnitChange={onUnitChange}
        />

        <SavedRoutesList
          routes={savedRoutes}
          onLoad={onLoadSavedRoute}
          onDelete={onDeleteSavedRoute}
        />

        <PaceSettings
          pace={pace}
          unit={unit}
          profile={profile}
          onPaceChange={onPaceChange}
          onProfileChange={onProfileChange}
        />

        <div className='action-buttons'>
          <button
            className='btn btn-primary'
            onClick={onGenerate}
            disabled={loading}
            id='generate-btn'
          >
            {loading ? (
              <span className='btn-loading'>
                <span className='spinner'></span> Generating…
              </span>
            ) : (
              '🗺️ Generate Route'
            )}
          </button>

          {route && (
            <button
              className='btn btn-secondary'
              onClick={onRegenerate}
              disabled={loading}
              id='shuffle-btn'
            >
              🔀 Shuffle Route
            </button>
          )}

          {route && (
            <button
              className='btn btn-secondary'
              onClick={onShare}
              id='share-btn'
            >
              🔗 Share Route
            </button>
          )}

          {route && (
            <button
              className='btn btn-secondary'
              onClick={() => setShowSaveDialog(true)}
              id='save-btn'
            >
              💾 Save Route
            </button>
          )}
        </div>

        {error && (
          <div className='error-banner'>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {routes && routes.length > 0 && (
          <div className='route-selector'>
            <p className='route-selector-label'>Choose a route:</p>
            <div className='route-options'>
              {routes.map((r, idx) => (
                <button
                  key={idx}
                  className={`route-option ${selectedRouteIndex === idx ? 'selected' : ''}`}
                  onClick={() => onSelectRoute(idx)}
                >
                  <span className='route-number'>{idx + 1}</span>
                  <span className='route-info'>
                    {(r.distanceMeters / 1000).toFixed(1)} km
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <RouteStats route={route} unit={unit} pace={pace} />
      </div>

      <div className='sidebar-footer'>
        <p>Click the map to set your start point</p>
      </div>

      {showSaveDialog && (
        <div className='modal-overlay' onClick={() => setShowSaveDialog(false)}>
          <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>Save Route</h2>
            <input
              type='text'
              className='modal-input'
              placeholder='Enter route name (optional)'
              value={saveRouteName}
              onChange={(e) => setSaveRouteName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRoute()
              }}
              autoFocus
            />
            <div className='modal-buttons'>
              <button
                className='modal-btn modal-btn-cancel'
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button
                className='modal-btn modal-btn-save'
                onClick={handleSaveRoute}
              >
                Save Route
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
