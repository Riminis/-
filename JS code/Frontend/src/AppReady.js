import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, useMap, Tooltip, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './public_css/App.css';
import RedMarker    from './public_png/marker-icon-2x-red.png';
import ShadowMarker from './public_png/marker-shadow.png'; 


const customIcon = new L.Icon({
  iconUrl: RedMarker,
  shadowUrl: ShadowMarker,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

function AppReady({ userMarkers, requstResult, stations }) {
  const moscowCoordinates = [55.751244, 37.618423];
  const bounds = [[55.4, 37],[56, 38.5]];
  const [showTooltips, setShowTooltips] = useState(false);
  const [mapCenter, setMapCenter] = useState(moscowCoordinates);
  const [zoom, setZoom] = useState(11);
  const [centerLock, setCenterLock] = useState(false);
  const resultMetroMarkers = requstResult?.data_metro_flow || [];
  const resultRoadMarkers = requstResult?.data_road || [];

  function sortMarkersClockwiseAndUpdateCenter(markers, onMarkerUpdate) {
    const center = markers.reduce(
      (acc, marker) => [acc[0] + marker.lat, acc[1] + marker.lng],
      [0, 0]
    ).map(val => val / markers.length);
    const sortedMarkers = markers.sort((a, b) => {
      const angleA = Math.atan2(a.lng - center[1], a.lat - center[0]);
      const angleB = Math.atan2(b.lng - center[1], b.lat - center[0]);
      return angleA - angleB;
    });
    return sortedMarkers;
  }


  return (
    <div className="AppReady">
      <MapContainer className="map" center={mapCenter} zoom={zoom} maxBounds={bounds} minZoom={13} maxZoom={16} 
        style={{ height: '600px', width: '100%' }} onClick={(e) => e.originalEvent.stopPropagation()}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {userMarkers?.length > 0 && userMarkers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
            {/*<Popup>Ваша метка</Popup>*/}
          </Marker>
        ))}
        {userMarkers.length > 2 && (
          <Polygon positions={sortMarkersClockwiseAndUpdateCenter(userMarkers)} color="orange" fillOpacity={0.2} />
        )}

        <ChangeView center={userMarkers[0]} zoom={14} />
        {resultRoadMarkers.map((road, index) => {
          if (road.coordinates && road.coordinates.length > 0) {
            const reversedCoordinates = road.coordinates.map(coord => [coord[1], coord[0]]);
            //console.log(road.point);
            var roadColor;
            if(road.point>4){
              roadColor = "darkred"
            }else if(road.point>2.5) {
              roadColor = "red"
            }else if(road.point>1.75) {
              roadColor = "orrange"
            }else if(road.point>1) {
              roadColor = "yellow"
            }else{
              roadColor = "green"
            }
            return (
              <Polyline key={index} positions={reversedCoordinates} fillOpacity={0} color={roadColor}>
                <Popup>
                  <div>
                    <h3>{road.name}</h3>
                    <p>Тип дороги: {road.type}</p>
                    <p>Трафик утром: <strong>{road.capacity_m}</strong></p>
                    <p>Трафик вечером: <strong>{road.capacity_e}</strong></p>
                  </div>
                </Popup>
              </Polyline>
            );
          } else {
            console.error('Invalid road data:', road);
            return null;
          }
        })}
        {resultMetroMarkers.map((marker, index) => {
          if (marker.lst && marker.lng) {
            const station = stations.find(s => s.name[0] === marker.name);
            // Если станция найдена, используем ее цвет
            const color = station ? `#${station.color_line}` : 'black';
            return (
              <CircleMarker key={index} center={[marker.lng, marker.lst]} radius="7"  fillOpacity={1} weight={1} color="black" fillColor={color}>
                <Popup>
                  <div>
                    <h3>{marker.name}</h3>
                    <p>Линия: {marker.Line}</p>
                    <p>Пассажиры вход (утро): <strong>{marker.people_flow_in_m}</strong></p>
                    <p>Пассажиры выход (утро): <strong>{marker.people_flow_out_m}</strong></p>
                    <p>Пассажиры вход (вечер): <strong>{marker.people_flow_in_e}</strong></p>
                    <p>Пассажиры выход (вечер): <strong>{marker.people_flow_out_e}</strong></p>
                  </div>
                </Popup>
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  {marker.name}
                </Tooltip>
              </CircleMarker>
            );
          } else {
            console.error('Invalid metro marker data:', marker);
            return null;
          }
        })}
      </MapContainer>    
    </div>
  );
}

export default AppReady;