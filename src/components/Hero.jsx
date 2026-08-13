import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero-typography animate-fade-up">
        <h1 className="hero-title">
          <div className="title-row">
            <span>Smart</span>
            <img src="/landscape.jpg" alt="Landscape" className="inline-img img-landscape" />
          </div>
          <div className="title-row">
            <span>farm ecosystem</span>
          </div>
          <div className="title-row">
            <img src="/harvester.jpg" alt="Harvester" className="inline-img img-harvester" />
            <span className="highlight-text">intelligence</span>
          </div>
        </h1>
      </div>

      <div className="hero-content">
        <div className="tags-container animate-fade-up delay-200">
          <div className="tag">SaaS</div>
          <div className="tag">AgriTech</div>
          <div className="tag">Dashboard</div>
          <div className="tag">Digital Twin</div>
          <div className="tag">Data Platform</div>
          <div className="tag">IoT System</div>
        </div>
        <div className="description animate-fade-up delay-300">
          <p>
            WoolTrace is an operating system for modern agriculture that connects land, water, and machinery into a unified real-time intelligence layer. Instead of fragmented farm management tools, it creates a living digital twin of the entire farm ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
