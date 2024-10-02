import React from 'react';
import './public_css/LoadingScreen.css';

const LoadingScreen = () => {
  const renderWakeUp = () => {
    fetch('https://traffic-backend-v3zi.onrender.com/start');

  }
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      {renderWakeUp()}
    </div>
  );
};

export default LoadingScreen;
