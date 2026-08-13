import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* Top Section */}
        <div className="footer-top">
          
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <h3 className="footer-logo">WoolTrace</h3>
            <p>WoolTrace is a connected digital ecosystem for India's wool industry, tracking every step from farm to fabric.</p>
            <div className="social-links">
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">X</a>
              <a href="#" className="social-icon">IN</a>
            </div>
          </div>

          {/* Links Column */}
          <div className="footer-col links-col">
            <h4>LINKS</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          {/* Info Column */}
          <div className="footer-col info-col">
            <h4>INFO</h4>
            <div className="info-item">
              <MapPin size={16} className="info-icon" />
              <span>Ministry of Textiles, New Delhi, India</span>
            </div>
            <div className="info-item">
              <Phone size={16} className="info-icon" />
              <span>+91 (1800) 123 4567</span>
            </div>
            <div className="info-item">
              <Mail size={16} className="info-icon" />
              <span>support@wooltrace.in</span>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="footer-col newsletter-col">
            <h4>NEWSLETTER</h4>
            <p>Sign up to get updates & news on the wool industry.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email Address" required />
              <button type="submit">SUBSCRIBE NOW</button>
            </form>
          </div>

        </div>

        {/* Watermark Section */}
        <div className="footer-watermark">
          WoolTrace
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="copyright">
            &copy; 2026 All Rights Reserved by WoolTrace
          </div>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
