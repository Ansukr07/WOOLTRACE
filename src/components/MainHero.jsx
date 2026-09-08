import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, QrCode } from 'lucide-react';
import './MainHero.css';

const MainHero = () => {
  const navigate = useNavigate();

  return (
    <section className="main-hero-wrapper">
      <div className="main-hero-container">
        {/* Top Heading Section */}
        <div className="main-hero-top">
          <div className="main-hero-heading animate-fade-up">
            <div className="heading-line">
              <span>FROM FARM TO</span>
              <div className="heading-pill">
                <img src="/harvester.jpg" alt="Farm Produce" />
              </div>
              <span>MARKET</span>
            </div>
            <div className="heading-line">
              <span>TRACE EVERY</span>
              <span className="heading-accent">HARVEST.</span>
            </div>
          </div>
          
          <div className="main-hero-side-text animate-fade-up delay-200">
            <p>CONNECTING INDIA'S<br/>AGRICULTURAL ECOSYSTEM</p>
            <div className="side-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>

        {/* Large Image Section */}
        <div className="main-hero-image-wrapper animate-fade-up delay-300">
          <img src="/landscape.jpg" alt="Agricultural Farmland" className="main-hero-img" />
          
          <div className="image-overlay">
            {/* Top Left Label */}
            <div className="overlay-top-left">
              <span className="overlay-label">WOOLTRACE &middot; SIH 2026</span>
            </div>

            {/* Bottom Left Content */}
            <div className="overlay-bottom-left">
              <div className="stats-container">
                <div className="stat-card">
                  <h3>10+</h3>
                  <p>COMMODITY MARKETS</p>
                </div>
                <div className="stat-card">
                  <h3>REAL-TIME</h3>
                  <p>PRICE DISCOVERY</p>
                </div>
              </div>
              <div className="overlay-description">
                <p>Know your market. Discover better prices across Mandis, Mills and Co-operatives, and sell agricultural produce transparently.</p>
              </div>
            </div>

            {/* Bottom Right CTA */}
            <div className="overlay-bottom-right">
              <button className="primary-cta" onClick={() => navigate('/farmer/market')}>
                DISCOVER MARKET PRICES &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainHero;
