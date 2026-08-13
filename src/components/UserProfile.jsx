import React from 'react';
import { AlertCircle, Target, Eye, CheckCircle2 } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  return (
    <section className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-header animate-fade-up">
          <span className="profile-subtitle">THE WOOLTRACE USER</span>
        </div>

      <div className="profile-content">
        {/* Top Left */}
        <div className="text-block text-tl animate-fade-up delay-400">
          <p>Wool farmers often face fragmented markets, uncertain pricing, limited access to quality services and little visibility into where their wool goes after leaving the farm.</p>
        </div>

        {/* Top Right */}
        <div className="text-block text-tr animate-fade-up delay-400">
          <p>He wants better prices, trusted buyers, verified quality and a simple way to manage his wool from production to sale.</p>
        </div>

        {/* Center Image with floating cards */}
        <div className="center-stage animate-fade-up delay-200">
          <img src="/indian_farmer.jpg" alt="Farmer" className="farmer-img" />
          
          <div className="floating-card card-tl">
            <span className="card-title">Challenge</span>
            <div className="icon-wrapper icon-dark">
              <AlertCircle size={20} />
            </div>
          </div>

          <div className="floating-card card-tr">
            <span className="card-title">Drive</span>
            <div className="icon-wrapper icon-accent">
              <Target size={20} />
            </div>
          </div>

          <div className="floating-card card-bl">
            <span className="card-title">Expectation</span>
            <div className="icon-wrapper icon-dark">
              <Eye size={20} />
            </div>
          </div>

          <div className="floating-card card-br">
            <span className="card-title">Satisfaction</span>
            <div className="icon-wrapper icon-accent">
              <CheckCircle2 size={20} />
            </div>
          </div>

          {/* SVG connecting lines could go here, for simplicity handled via CSS borders if possible, but exact SVG is complex. I'll add subtle line indicators using CSS. */}
          <div className="connection-lines">
            <div className="line line-tl"></div>
            <div className="line line-tr"></div>
            <div className="line line-bl"></div>
            <div className="line line-br"></div>
          </div>
        </div>

        {/* Bottom Left */}
        <div className="text-block text-bl animate-fade-up delay-400">
          <p>He expects one reliable platform to track his wool, understand market prices, access services and connect directly with buyers.</p>
        </div>

        {/* Bottom Right */}
        <div className="text-block text-br animate-fade-up delay-400">
          <p>With WoolTrace, every batch gets a digital identity, quality can be verified, market opportunities become visible and the journey from farm to fabric becomes transparent.</p>
        </div>
      </div>
      </div>
    </section>
  );
};

export default UserProfile;
