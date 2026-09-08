import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-wrapper">
      <div className="hero-container">
        <div className="hero-typography animate-fade-up">
          <h1 className="hero-title">
            <div className="title-row">
              <span>One</span>
              <img src="/indian_sheep.jpg" alt="Agricultural Farmland" className="inline-img img-landscape" />
            </div>
            <div className="title-row">
              <span>connected</span>
            </div>
            <div className="title-row">
              <img src="/raw_wool.jpg" alt="Produce Harvest" className="inline-img img-harvester" />
              <span className="highlight-text">agri market ecosystem</span>
            </div>
          </h1>
        </div>

        <div className="hero-content">
          <div className="tags-container animate-fade-up delay-200">
            <div className="tag">Market Intelligence</div>
            <div className="tag">Price Discovery</div>
            <div className="tag">Buyer Linkages</div>
            <div className="tag">Quality Assurance</div>
            <div className="tag">Produce Traceability</div>
            <div className="tag">Escrow Security</div>
          </div>
          <div className="description animate-fade-up delay-300">
            <p>
              WoolTrace connects farmers, FPOs, buyers, mills, warehouses, and logistics through one transparent platform. Discover real-time prices across Mandis and Processors, find verified buyers, and complete secure, escrow-backed sales across all agricultural commodities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
