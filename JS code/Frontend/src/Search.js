import React, { useState} from 'react';
import MetroLogo from './public_png/metro.png';


const InfoSection = ({ stations = [], onStationClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStations = stations.length > 0 ? stations.filter(station => {
    const stationName = typeof station.name === 'string' ? station.name : 
    Array.isArray(station.name) ? station.name[0] : '';
    return stationName.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div className="info-section">
      <input type="text" className="search" placeholder="Поиск станции..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
      <div className="stations-list">
        <ul>
          {filteredStations.map(station => (
            <li className="station" key={station.id}>
              <strong>{typeof station.name === 'string' && station.name.toLowerCase()}</strong>
              <div className="OneStation" onClick={() => onStationClick(`${station.latitude}, ${station.longitude}`)}>
                <div className="circle-container">
                  <span className="color-circle" style={{ backgroundColor: `#${station.color_line}` }}></span>
                  <img src={MetroLogo} alt="M" className="circle-image" />
                </div>
                {station.name}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoSection;
