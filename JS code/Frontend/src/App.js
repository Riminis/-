import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, useMap, Tooltip, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './public_css/App.css';
import RedMarker    from './public_png/marker-icon-2x-red.png';
import cursor       from './public_png/cursor.png';
import marker       from './public_png/marker.png';
import ShadowMarker from './public_png/marker-shadow.png'; 
import twoMarker    from './public_png/twomarker.png';
import Musor        from './public_png/trash.png';

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

function App({ mapCenterProp, zoomProp, activeButton, setActiveButton, onMarkerUpdate, onClearMarkers  }) {
  const moscowCoordinates = [55.751244, 37.618423];
  const bounds = [[55.4, 37],[56, 38.5]];
  const [stations, setStations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [showTooltips, setShowTooltips] = useState(false);
  const clearButtonRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(moscowCoordinates);
  const [zoom, setZoom] = useState(11);
  const [centerLock, setCenterLock] = useState(false);

  useEffect(() => {
    if (mapCenterProp && !centerLock) {
      setMapCenter(mapCenterProp);
      setZoom(zoomProp || 14);
    }
  }, [mapCenterProp, zoomProp, centerLock]);

  const handleMapMove = () => {
    if (centerLock) {
      setCenterLock(false); // Разблокируем, если пользователь сам двигает карту
    }
  };

  useEffect(() => {
    fetch('https://traffic-backend-v3zi.onrender.com/metro_stations')
      .then((response) => response.json())
      .then((data) => setStations(data));
  }, []);

  const setMetroStationMarkers = useCallback(() => {
    return stations.map((station) => (
      <DynamicCircleMarker key={station.id} station={station} showTooltip={showTooltips} />
    ));
  }, [stations, showTooltips]);

  const AddMarker = () => {
    useMapEvents({
      click: (e) => {
        if (activeButton === 2) {
          onClearMarkers(); 
          setMarkers([e.latlng]);
        } else if (activeButton === 3) {
          setMarkers((prevMarkers) => {
            const newMarkers = [...prevMarkers, e.latlng];
            sortMarkersClockwiseAndUpdateCenter(newMarkers, onMarkerUpdate);
            return newMarkers;
          });
        }
  
        if (activeButton === 2 || activeButton === 3) {
          if (onMarkerUpdate) {
            onMarkerUpdate(e.latlng.lat, e.latlng.lng);
          }
        }
      }
    });
    return null;
  };

  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
    if (buttonNumber === 2 ||buttonNumber === 3) {
      setMarkers([]);
    }
  };

  const handleClearMarkers = () => {
    setMarkers([]);  // Сбрасываем метки в App.js
    if (onClearMarkers) {
      onClearMarkers();  // Вызываем функцию сброса из Main.js
    }
  };
  
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

  const DynamicCircleMarker = React.memo(({ station, showTooltip }) => {
    const map = useMap();
    const [radius, setRadius] = useState(5);

    useEffect(() => {
      if (map) {
        let previousZoom = map.getZoom();

        const zoomListener = () => {
          const currentZoom = map.getZoom();

          if ((currentZoom > 13 && previousZoom <= 13) || (currentZoom <= 13 && previousZoom > 13)) {
            setRadius(currentZoom > 13 ? 5 : 4);
          }
          setShowTooltips(currentZoom > 13);
          previousZoom = currentZoom;
        };

        map.on('zoomend', zoomListener);

        return () => {
          map.off('zoomend', zoomListener);
        };
      }
    }, [map]);

    return (
      <CircleMarker
        key={station.id}
        center={[station.latitude, station.longitude]}
        radius={radius}
        fillColor={`#${station.color_line}`}
        fillOpacity={1}
        weight={1}
        color="black"
      >
        <Popup>
          <div className="station-popup">
            <h3><center>{station.name}</center></h3>
            <p><span style={{ color: station.color_line }}>{station.name_line}</span></p>
            {/*<p>Пропускная способность: {station.limit}</p>
            <p>Текущая загрузка: {station.flow}</p>
            <p>Цветовая линия: {station.color_line}</p>*/}
          </div>
        </Popup>
        {showTooltip && (
          <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
            {station.name}
          </Tooltip>
        )}
      </CircleMarker>
    );
  });

  return (
    <div className="App">
      <MapContainer className="map" center={mapCenter} zoom={zoom} whenReady={(map) => map.target.on('move', handleMapMove)}
        maxBounds={bounds}
        minZoom={10} maxZoom={16}
        style={{ height: '600px', width: '100%' }}
        onClick={(e) => e.originalEvent.stopPropagation()}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ChangeView center={mapCenter} zoom={zoom} />

        {markers.length > 2 && (
          <Polygon positions={sortMarkersClockwiseAndUpdateCenter(markers, onMarkerUpdate)} color="orange" fillOpacity={0.2} />
        )}

        {markers.map((marker, index) => (
          <Marker key={index} position={marker} icon={customIcon}>
          </Marker>
        ))}

        <AddMarker />
        {setMetroStationMarkers()}
      </MapContainer>
      <div className="button-overlay" >
        <button onClick={() => handleButtonClick(1)}  className={activeButton === 1 ? 'active-button' : 'nonactive-button'}>
        <img src={cursor} alt="Очистить метки" />
        </button>
        <button onClick={() => handleButtonClick(2)}  className={activeButton === 2 ? 'active-button' : 'nonactive-button'}>
        <img src={marker} alt="Очистить метки" />
        </button>
        <button onClick={() => handleButtonClick(3)}  className={activeButton === 3 ? 'active-button' : 'nonactive-button'}>
        <img src={twoMarker} alt="Очистить метки" />
        </button >
        <button ref={clearButtonRef} className="nonactive-button" onClick={handleClearMarkers}>
            <img src={Musor} alt="Очистить метки" />
        </button>
      </div>
    </div>
  );
}

export default App;

// {roads.map((road) => (
//   <Marker key={road.id} position={[road.latitude, road.longitude]}>
//     <Popup>
//       <div className="road-popup">
//         <h3>{road.name}</h3>
//         <p>Пропускная способность: {road.capacity}</p>
//         <p>Текущая загрузка: {road.current_load}</p>
//       </div>
//     </Popup>
//   </Marker>
// ))}

// {/* <div className="toggle-container" onClick={handleToggle}>
// <div className={`toggle-button ${isToggled ? 'toggled' : ''}`}></div>
// </div> */}