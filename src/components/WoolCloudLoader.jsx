import React from 'react';
import './WoolCloudLoader.css';

const WoolCloudLoader = ({ text = 'Authenticating WoolTrace Session...', fullScreen = true }) => {
  return (
    <div className={`wool-cloud-loader-wrapper ${fullScreen ? 'fullscreen-overlay' : 'inline-loader'}`}>
      <div className="wool-cloud-container">
        {/* Outer Trace Line Orbit */}
        <div className="wool-trace-orbit">
          <div className="orbit-dot farm-dot" title="Farm"></div>
          <div className="orbit-dot quality-dot" title="Quality"></div>
          <div className="orbit-dot market-dot" title="Market"></div>
          <div className="orbit-dot processing-dot" title="Processing"></div>
        </div>

        {/* Translucent Rotating Wool Cloud Core */}
        <div className="wool-cloud-core">
          <svg
            className="wool-cloud-svg"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Radial Gradients aligned with brand.md palette */}
              <radialGradient id="woolIvoryGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EDEDCE" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#EDEDCE" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#EDEDCE" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="woolSoftLimeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DDFF86" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#DDFF86" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#DDFF86" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="woolSkyBlueGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#BED5E5" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#BED5E5" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Cloud Puffs Layer 1 - Warm Ivory */}
            <g className="cloud-layer layer-back">
              <circle cx="70" cy="90" r="42" fill="url(#woolIvoryGlow)" />
              <circle cx="130" cy="90" r="42" fill="url(#woolIvoryGlow)" />
              <circle cx="100" cy="65" r="46" fill="url(#woolIvoryGlow)" />
              <circle cx="100" cy="115" r="40" fill="url(#woolIvoryGlow)" />
            </g>

            {/* Cloud Puffs Layer 2 - Soft Lime Accent */}
            <g className="cloud-layer layer-mid">
              <circle cx="85" cy="80" r="32" fill="url(#woolSoftLimeGlow)" />
              <circle cx="120" cy="85" r="30" fill="url(#woolSoftLimeGlow)" />
              <circle cx="100" cy="100" r="35" fill="url(#woolSoftLimeGlow)" />
            </g>

            {/* Cloud Puffs Layer 3 - Sky Blue Trace & Highlight */}
            <g className="cloud-layer layer-front">
              <circle cx="65" cy="105" r="26" fill="url(#woolSkyBlueGlow)" />
              <circle cx="135" cy="105" r="26" fill="url(#woolSkyBlueGlow)" />
              <circle cx="100" cy="75" r="28" fill="url(#woolSkyBlueGlow)" />
            </g>

            {/* Translucent Wool Fiber Threads / Swirl Motif */}
            <path
              d="M 60 100 Q 80 70 100 100 T 140 100"
              stroke="#0B120D"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.25"
              fill="none"
              className="wool-fiber-path"
            />
            <path
              d="M 70 115 Q 100 135 130 115"
              stroke="#0B120D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.2"
              fill="none"
              className="wool-fiber-path-2"
            />
          </svg>

          {/* Center WoolTrace Logo Monogram */}
          <div className="wool-center-badge">
            <span className="wool-badge-wt">WT</span>
          </div>
        </div>
      </div>

      {/* Brand Text & Status Caption */}
      <div className="wool-loader-caption">
        <div className="brand-title">
          WOOL<span>TRACE</span>
        </div>
        <p className="status-text">{text}</p>
        <div className="trace-line-indicator">
          <span>Farm</span> &bull; <span>Wool</span> &bull; <span>Quality</span> &bull; <span>Market</span> &bull; <span>Fabric</span>
        </div>
      </div>
    </div>
  );
};

export default WoolCloudLoader;