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
              <img src="/indian_sheep.jpg" alt="Sheep Farm" className="inline-img img-landscape" />
            </div>
            <div className="title-row">
              <span>connected</span>
            </div>
            <div className="title-row">
              <img src="/raw_wool.jpg" alt="Raw Wool" className="inline-img img-harvester" />
              <span className="highlight-text">wool ecosystem</span>
            </div>
          </h1>
        </div>

        <div className="hero-content">
          <div className="tags-container animate-fade-up delay-200">
            <div className="tag">Wool Traceability</div>
            <div className="tag">Quality Assurance</div>
            <div className="tag">Marketplace</div>
            <div className="tag">Supply Chain</div>
            <div className="tag">Farm to Fabric</div>
            <div className="tag">Digital Identity</div>
          </div>
          <div className="description animate-fade-up delay-300">
            <p>
              WoolTrace connects farmers, buyers, quality inspectors, transporters, warehouses and processing units through one connected digital ecosystem. Every wool batch can be tracked, verified and managed from farm to fabric.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
