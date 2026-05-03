import { useEffect } from 'react'
import type { FC } from 'react'
import { Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { geoJsonToLatLngs } from '../../utils/geoUtils'

function createStartIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <div style="
          position:absolute;
          width:36px;height:36px;
          border:2px solid #a78bfa;
          border-radius:50%;
          opacity:0.5;
          animation:ring-pulse 2s ease-out infinite;
        "></div>
        <div style="
          width:16px;height:16px;
          background:#a78bfa;
          border-radius:50%;
          border:3px solid #fff;
          box-shadow:0 0 12px rgba(167,139,250,0.8);
          position:relative;z-index:1;
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })
}

function interpolateColor(startColor: string, endColor: string, factor: number): string {
  const start = parseInt(startColor.substring(1), 16)
  const end = parseInt(endColor.substring(1), 16)

  const r1 = (start >> 16) & 255
  const g1 = (start >> 8) & 255
  const b1 = start & 255

  const r2 = (end >> 16) & 255
  const g2 = (end >> 8) & 255
  const b2 = end & 255

  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function createGradientPolylines(
  coordinates: [number, number][],
  segmentCount: number = 20
): Array<{ positions: [number, number][]; color: string }> {
  const latlngs = geoJsonToLatLngs(coordinates)
  const segments: Array<{ positions: [number, number][]; color: string }> = []

  const pointsPerSegment = Math.max(1, Math.floor(latlngs.length / segmentCount))

  for (let i = 0; i < segmentCount; i++) {
    const startIdx = i * pointsPerSegment
    const endIdx = Math.min((i + 1) * pointsPerSegment + 1, latlngs.length)

    if (startIdx >= latlngs.length) break

    const factor = i / (segmentCount - 1)
    const color = interpolateColor('#00FF87', '#3B82F6', factor)

    segments.push({
      positions: latlngs.slice(startIdx, endIdx),
      color
    })
  }

  return segments
}

interface RouteLayerProps {
  startPoint: Position | null;
  route: Route | null;
}

const RouteLayer: FC<RouteLayerProps> = ({ startPoint, route }) => {
  const map = useMap()

  useEffect(() => {
    if (route?.coordinates?.length) {
      const latlngs = geoJsonToLatLngs(route.coordinates)
      const bounds = L.latLngBounds(latlngs)
      map.fitBounds(bounds, { padding: [60, 60], animate: true })
    }
  }, [route, map])

  const startIcon = createStartIcon()

  return (
    <>
      {startPoint && (
        <Marker position={[startPoint.lat, startPoint.lng]} icon={startIcon} />
      )}
      {route?.coordinates?.length && (
        <>
          {/* Shadow/glow layer with gradient */}
          {createGradientPolylines(route.coordinates, 25).map((segment, idx) => (
            <Polyline
              key={`shadow-${idx}`}
              positions={segment.positions}
              pathOptions={{ color: segment.color, weight: 8, opacity: 0.12 }}
            />
          ))}
          {/* Main route line with gradient */}
          {createGradientPolylines(route.coordinates, 25).map((segment, idx) => (
            <Polyline
              key={`main-${idx}`}
              positions={segment.positions}
              pathOptions={{ color: segment.color, weight: 3, opacity: 0.9 }}
            />
          ))}
        </>
      )}
    </>
  )
}

export default RouteLayer

