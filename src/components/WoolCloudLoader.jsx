import React from 'react';
import './WoolCloudLoader.css';

const WoolCloudLoader = ({ fullScreen = true }) => {
  return (
    <div className={`minimal-loader-wrapper ${fullScreen ? 'fullscreen-overlay' : 'inline-loader'}`}>
      <div className="minimal-loader-container" aria-label="Loading">
        <div className="minimal-spinner"></div>
      </div>
    </div>
  );
};

export default WoolCloudLoader;
