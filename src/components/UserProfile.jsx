import React, { useState } from 'react';
import { AlertCircle, Target, Eye, CheckCircle2, Plus, Minus } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <section className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-header animate-fade-up">
          <span className="profile-subtitle">THE WOOLTRACE FARMER &amp; PRODUCER</span>
        </div>

        <div className="profile-desktop-grid profile-content">
          {/* Top Left */}
          <div className="text-block text-tl animate-fade-up delay-400">
            <p>Indian farmers often face fragmented markets, high transportation costs, uncertain prices, and weak bargaining power when selling harvests alone.</p>
          </div>

          {/* Top Right */}
          <div className="text-block text-tr animate-fade-up delay-400">
            <p>He wants transparent price discovery across nearby Mandis and Mills, verified institutional buyers, and fair net earnings after freight and storage.</p>
          </div>

          {/* Center Image with floating cards */}
          <div className="center-stage animate-fade-up delay-200">
            <img src="/indian_farmer.jpg" alt="Indian Farmer" className="farmer-img" />
            
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

            <div className="connection-lines">
              <div className="line line-tl"></div>
              <div className="line line-tr"></div>
              <div className="line line-bl"></div>
              <div className="line line-br"></div>
            </div>
          </div>

          {/* Bottom Left */}
          <div className="text-block text-bl animate-fade-up delay-400">
            <p>He expects one reliable platform to compare market prices, calculate net profit after logistics/storage, and negotiate directly with verified buyers.</p>
          </div>

          {/* Bottom Right */}
          <div className="text-block text-br animate-fade-up delay-400">
            <p>With WoolTrace, farmers and FPOs discover better prices, get matched with verified corporate buyers, secure payments in escrow, and track their produce journey.</p>
          </div>
        </div>

        {/* Mobile Accordion View */}
        <div className="profile-mobile-view">
          <div className="mobile-farmer-header animate-fade-up delay-200">
            <img src="/indian_farmer.jpg" alt="Indian Farmer" className="mobile-farmer-img" />
          </div>

          <div className="mobile-accordion">
            <div className="accordion-item animate-fade-up delay-300">
              <button 
                className={`accordion-header ${openSection === 'challenge' ? 'active' : ''}`}
                onClick={() => toggleSection('challenge')}
              >
                <div className="header-left">
                  <div className="icon-wrapper icon-dark">
                    <AlertCircle size={18} />
                  </div>
                  <span className="accordion-title">Challenge</span>
                </div>
                <div className="accordion-toggle">
                  {openSection === 'challenge' ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              {openSection === 'challenge' && (
                <div className="accordion-content">
                  <p>Indian farmers often face fragmented markets, high transportation costs, uncertain prices, and weak bargaining power when selling harvests alone.</p>
                </div>
              )}
            </div>

            <div className="accordion-item animate-fade-up delay-350">
              <button 
                className={`accordion-header ${openSection === 'drive' ? 'active' : ''}`}
                onClick={() => toggleSection('drive')}
              >
                <div className="header-left">
                  <div className="icon-wrapper icon-accent">
                    <Target size={18} />
                  </div>
                  <span className="accordion-title">Drive</span>
                </div>
                <div className="accordion-toggle">
                  {openSection === 'drive' ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              {openSection === 'drive' && (
                <div className="accordion-content">
                  <p>He wants transparent price discovery across nearby Mandis and Mills, verified institutional buyers, and fair net earnings after freight and storage.</p>
                </div>
              )}
            </div>

            <div className="accordion-item animate-fade-up delay-400">
              <button 
                className={`accordion-header ${openSection === 'expectation' ? 'active' : ''}`}
                onClick={() => toggleSection('expectation')}
              >
                <div className="header-left">
                  <div className="icon-wrapper icon-dark">
                    <Eye size={18} />
                  </div>
                  <span className="accordion-title">Expectation</span>
                </div>
                <div className="accordion-toggle">
                  {openSection === 'expectation' ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              {openSection === 'expectation' && (
                <div className="accordion-content">
                  <p>He expects one reliable platform to compare market prices, calculate net profit after logistics/storage, and negotiate directly with verified buyers.</p>
                </div>
              )}
            </div>

            <div className="accordion-item animate-fade-up delay-450">
              <button 
                className={`accordion-header ${openSection === 'satisfaction' ? 'active' : ''}`}
                onClick={() => toggleSection('satisfaction')}
              >
                <div className="header-left">
                  <div className="icon-wrapper icon-accent">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="accordion-title">Satisfaction</span>
                </div>
                <div className="accordion-toggle">
                  {openSection === 'satisfaction' ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              {openSection === 'satisfaction' && (
                <div className="accordion-content">
                  <p>With WoolTrace, farmers and FPOs discover better prices, get matched with verified corporate buyers, secure payments in escrow, and track their produce journey.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
