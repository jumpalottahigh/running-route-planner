import DistanceInput from './DistanceInput'
import PaceSettings from './PaceSettings'
import RouteStats from './RouteStats'

export default function Sidebar({
  distance,
  unit,
  pace,
  profile,
  route,
  loading,
  error,
  onDistanceChange,
  onUnitChange,
  onPaceChange,
  onProfileChange,
  onGenerate,
  onRegenerate
}) {
  return (
    <aside className='sidebar'>
      <div className='sidebar-header'>
        <h1 className='logo'>
          <span className='logo-icon'>🏃</span>
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
        </div>

        {error && (
          <div className='error-banner'>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <RouteStats route={route} unit={unit} pace={pace} />
      </div>

      <div className='sidebar-footer'>
        <p>Click the map to set your start point</p>
      </div>
    </aside>
  )
}

