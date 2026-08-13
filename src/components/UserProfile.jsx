import React from 'react';
import { AlertCircle, Target, Eye, CheckCircle2 } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  return (
    <section className="profile-container">
      <div className="glow-background animate-fade-up"></div>
      
      <div className="profile-header animate-fade-up">
        <span className="profile-subtitle">USER PROFILE</span>
      </div>

      <div className="profile-content">
        {/* Top Left */}
        <div className="text-block text-tl animate-fade-up delay-400">
          <p>He struggles with fragmented tools that don't reflect real-time field conditions, making decisions slow and reactive instead of precise.</p>
        </div>

        {/* Top Right */}
        <div className="text-block text-tr animate-fade-up delay-400">
          <p>He wants full control and clarity over land performance, resource usage, and operational efficiency in one system.</p>
        </div>

        {/* Center Image with floating cards */}
        <div className="center-stage animate-fade-up delay-200">
          <img src="/indian_farmer.jpg" alt="Farmer" className="farmer-img" />
          
          <div className="floating-card card-tl">
            <span className="card-title">Challenge</span>
            <div className="icon-wrapper icon-coral">
              <AlertCircle size={20} />
            </div>
          </div>

          <div className="floating-card card-tr">
            <span className="card-title">Drive</span>
            <div className="icon-wrapper icon-lime">
              <Target size={20} />
            </div>
          </div>

          <div className="floating-card card-bl">
            <span className="card-title">Expectation</span>
            <div className="icon-wrapper icon-blue">
              <Eye size={20} />
            </div>
          </div>

          <div className="floating-card card-br">
            <span className="card-title">Satisfaction</span>
            <div className="icon-wrapper icon-lime">
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
          <p>He expects a single source of truth that connects water, machinery, and crop health in real time.</p>
        </div>

        {/* Bottom Right */}
        <div className="text-block text-br animate-fade-up delay-400">
          <p>He feels in control when every field, machine, and water flow responds instantly as one intelligent system.</p>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
