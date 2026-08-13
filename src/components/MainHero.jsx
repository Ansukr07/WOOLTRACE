import React from 'react';
import './MainHero.css';

const MainHero = () => {
  return (
    <section className="main-hero-wrapper">
      <div className="main-hero-container">
        {/* Top Heading Section */}
      <div className="main-hero-top">
        <div className="main-hero-heading animate-fade-up">
          <div className="heading-line">
            <span>FROM FARM TO</span>
            <div className="heading-pill">
              <img src="/harvester.jpg" alt="Farm Pill" />
            </div>
            <span>FABRIC</span>
          </div>
          <div className="heading-line">
            <span>TRACE EVERY</span>
            <span className="heading-accent">FIBER.</span>
          </div>
        </div>
        
        <div className="main-hero-side-text animate-fade-up delay-200">
          <p>CONNECTING INDIA'S<br/>WOOL ECOSYSTEM</p>
          <div className="side-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>

      {/* Large Image Section */}
      <div className="main-hero-image-wrapper animate-fade-up delay-300">
        <img src="/landscape.jpg" alt="Lush Green Landscape" className="main-hero-img" />
        
        <div className="image-overlay">
          {/* Top Left Label */}
          <div className="overlay-top-left">
            <span className="overlay-label">WOOLTRACE&reg;</span>
          </div>

          {/* Bottom Left Content */}
          <div className="overlay-bottom-left">
            <div className="stats-container">
              <div className="stat-card">
                <h3>1</h3>
                <p>DIGITAL IDENTITY</p>
              </div>
              <div className="stat-card">
                <h3>END-TO-END</h3>
                <p>TRACEABILITY</p>
              </div>
            </div>
            <div className="overlay-description">
              <p>Track, verify and trade wool through a single connected platform — from sheep farm to finished fabric.</p>
            </div>
          </div>

          {/* Bottom Right CTA */}
          <div className="overlay-bottom-right">
            <button className="primary-cta">
              TRACE A WOOL BATCH &rarr;
            </button>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default MainHero;
