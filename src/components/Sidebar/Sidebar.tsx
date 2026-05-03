import type { FC } from 'react';
import DistanceInput from './DistanceInput';
import PaceSettings from './PaceSettings';
import RouteStats from './RouteStats';

interface SidebarProps {
  distance: number;
  unit: 'km' | 'mi';
  pace: number;
  profile: 'foot-walking' | 'foot-hiking';
  route: Route | null;
  routes: Route[] | null;
  selectedRouteIndex: number;
  loading: boolean;
  error: string | null;
  onDistanceChange: (distance: number) => void;
  onUnitChange: (unit: 'km' | 'mi') => void;
  onPaceChange: (pace: number) => void;
  onProfileChange: (profile: 'foot-walking' | 'foot-hiking') => void;
  onGenerate: () => void;
  onRegenerate: () => void;
  onSelectRoute: (index: number) => void;
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
  onDistanceChange,
  onUnitChange,
  onPaceChange,
  onProfileChange,
  onGenerate,
  onRegenerate,
  onSelectRoute,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">
          <span className="logo-icon">🏃</span>
          RunLoop
        </h1>
        <p className="tagline">Smart circular routes for runners</p>
      </div>

      <div className="sidebar-scroll">
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

        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={onGenerate}
            disabled={loading}
            id="generate-btn"
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span> Generating…
              </span>
            ) : (
              '🗺️ Generate Route'
            )}
          </button>

          {route && (
            <button
              className="btn btn-secondary"
              onClick={onRegenerate}
              disabled={loading}
              id="shuffle-btn"
            >
              🔀 Shuffle Route
            </button>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {routes && routes.length > 0 && (
          <div className="route-selector">
            <p className="route-selector-label">Choose a route:</p>
            <div className="route-options">
              {routes.map((r, idx) => (
                <button
                  key={idx}
                  className={`route-option ${selectedRouteIndex === idx ? 'selected' : ''}`}
                  onClick={() => onSelectRoute(idx)}
                >
                  <span className="route-number">{idx + 1}</span>
                  <span className="route-info">
                    {(r.distanceMeters / 1000).toFixed(1)} km
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <RouteStats route={route} unit={unit} pace={pace} />
      </div>

      <div className="sidebar-footer">
        <p>Click the map to set your start point</p>
      </div>
    </aside>
  );
};

export default Sidebar;


