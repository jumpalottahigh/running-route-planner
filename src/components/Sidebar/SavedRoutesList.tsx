import type { FC } from 'react'
import './SavedRoutesList.css'

interface SavedRoutesListProps {
  routes: SavedRoute[]
  onLoad: (route: SavedRoute) => void
  onDelete: (id: string) => void
}

function formatDate(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const SavedRoutesList: FC<SavedRoutesListProps> = ({ routes, onLoad, onDelete }) => {
  if (routes.length === 0) {
    return null
  }

  return (
    <div className="saved-routes-list">
      <h3 className="saved-routes-title">📌 Saved Routes ({routes.length})</h3>
      <div className="saved-routes-items">
        {routes.map((route) => (
          <div key={route.id} className="saved-route-item">
            <div className="saved-route-info">
              <p className="saved-route-name">{route.name}</p>
              <div className="saved-route-meta">
                <span className="saved-route-distance">{route.distance} {route.unit}</span>
                <span className="saved-route-date">{formatDate(route.savedAt)}</span>
              </div>
            </div>
            <div className="saved-route-actions">
              <button
                className="saved-route-btn saved-route-load"
                onClick={() => onLoad(route)}
                title="Load this route"
              >
                ✓
              </button>
              <button
                className="saved-route-btn saved-route-delete"
                onClick={() => onDelete(route.id)}
                title="Delete this route"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedRoutesList
