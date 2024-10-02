import React, { useEffect, useState  } from 'react';
import LoadingScreen from './LoadingScreen';
import InfoSection from './Search';
import AppReady from './AppReady';
import Input from './Input';
import App from './App';
import './public_css/Main.css'

function Main() {
    const [stations, setStations] = useState([]);
    const [mapCenter, setMapCenter] = useState([55.751244, 37.618423]);
    const [zoom, setZoom] = useState(11);
    const [activeButton, setActiveButton] = useState(1);
    const [lng, setLatitude] = useState(null);
    const [lat, setLongitude] = useState(null);
    const [area, setArea] = useState('');
    const [area_office, setAreaOffic] = useState('');
    const [isResidential, setIsResidential] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [alredyMap, setAlreryMap] = useState(true);
    const [requstResult, setRequstResult] = useState(null);
    const [markers, setMarkers] = useState([]);
  
    useEffect(() => {//for search
      const fetchData = async () => {
        try {
          const response = await fetch('https://traffic-backend-v3zi.onrender.com/metro_stations');
          const data = await response.json();
          setStations(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false); 
        }
      };
  
      fetchData();
    }, []);
    

    const handleSubmit = async (e) => {//requst for alhoritm
      e.preventDefault();
      if (lat && lng) {
        const data = {
          lng,
          lat,
          area: parseInt(area),
          area_office: parseInt(area_office),
          isResidential: parseInt(isResidential)
        };
  
        try {
          const response = await fetch('https://traffic-backend-v3zi.onrender.com/roads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
    
          if (response.ok) {
            const text = await response.text(); // Получаем текст ответа
            //console.log(text);
            if (text) {
              const requstResult = JSON.parse(text);
              //console.log('Response from server:', requstResult.data_road);
              setRequstResult(requstResult);
              setAlreryMap(false);
            } else {
              console.log('Сервер вернул пустой ответ');
            }
          } else {
            console.error('Ошибка ответа от сервера:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Ошибка при выполнении fetch:', error);
        }
      } else {
        alert('Метка не установлена на карте');
      }
    };
  
    const handleMarkerUpdate = (lat, lng) => {
      setLatitude(lat);
      setLongitude(lng);
      setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
    };

    const handleClearMarkers = () => {
      setMarkers([]);
    };

    const handleStationClick = (coordinates) => {//for search
      const [lat, lng] = coordinates.split(',').map(Number);
      //console.log(lat, lng);
      setMapCenter([lat, lng]);
      setZoom(14);
    };

    return ( 
      <div>
        {isLoading ? ( <LoadingScreen />) : 
        ( <div> 
            <div className="container">
              <div className="map-section">
                {alredyMap === true ? 
                  (<App mapCenterProp={mapCenter} zoomProp={zoom} activeButton={activeButton} setActiveButton={setActiveButton} onMarkerUpdate={handleMarkerUpdate} onClearMarkers={handleClearMarkers} />) 
                  : (isLoading ? ( <LoadingScreen />) :(<AppReady stations={stations} userMarkers={markers} requstResult={requstResult} />))
                }
              </div>
              <div className='infoSection'>
                {activeButton === 1 ?
                  ( <InfoSection stations={stations} onStationClick={handleStationClick} /> ) : 
                  ( <Input area={area} setArea={setArea} area_office={area_office} setAreaOffic={setAreaOffic} isResidential={isResidential} setIsResidential={setIsResidential} handleSubmit={handleSubmit}/>)
                }
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default Main;