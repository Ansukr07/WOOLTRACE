import React from 'react';
import './WoolCloudLoader.css';

const WoolCloudLoader = ({ text = 'Loading WoolTrace...', fullScreen = true }) => {
  return (
    <div className={`minimal-loader-wrapper ${fullScreen ? 'fullscreen-overlay' : 'inline-loader'}`}>
      <div className="minimal-loader-container">
        {/* Sleek Spinning Ring */}
        <div className="minimal-spinner"></div>
      </div>

      {/* Clean Typography */}
      <div className="minimal-loader-text">
        <div className="minimal-brand">
          WOOL<span>TRACE</span>
        </div>
        <p className="minimal-status">{text}</p>
      </div>
    </div>
  );
};

export default WoolCloudLoader;