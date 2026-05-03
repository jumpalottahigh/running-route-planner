import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import RouteLayer from './RouteLayer';

// Fix Leaflet default icon paths broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function RecenterMap({ center }) {
  const map = useMap();
  const prevCenter = useRef(null);
  useEffect(() => {
    if (
      center &&
      (!prevCenter.current ||
        prevCenter.current.lat !== center.lat ||
        prevCenter.current.lng !== center.lng)
    ) {
      map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
      prevCenter.current = center;
    }
  }, [center, map]);
  return null;
}

export default function MapView({ startPoint, onMapClick, route }) {
  const defaultCenter = startPoint
    ? [startPoint.lat, startPoint.lng]
    : [51.505, -0.09];

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        {startPoint && <RecenterMap center={startPoint} />}
        <ClickHandler onMapClick={onMapClick} />
        <RouteLayer startPoint={startPoint} route={route} />
      </MapContainer>

      {!startPoint && (
        <div className="map-hint">
          📍 Click anywhere on the map to set your start point
        </div>
      )}
    </div>
  );
}
