import { useEffect, useRef } from 'react'
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

export default function RouteLayer({ startPoint, route }) {
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
          {/* Shadow/glow layer */}
          <Polyline
            positions={geoJsonToLatLngs(route.coordinates)}
            pathOptions={{ color: '#a78bfa', weight: 8, opacity: 0.18 }}
          />
          {/* Main route line */}
          <Polyline
            positions={geoJsonToLatLngs(route.coordinates)}
            pathOptions={{ color: '#a78bfa', weight: 3, opacity: 0.9 }}
          />
        </>
      )}
    </>
  )
}
