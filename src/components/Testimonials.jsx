import React from 'react';
import { Star } from 'lucide-react';
import './Testimonials.css';

const testimonialsData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Sheep Farmer',
    review: 'WoolTrace transformed how I sell my wool. The transparency is incredible and I finally get fair prices.',
    initial: 'R'
  },
  {
    id: 2,
    name: 'Priya Desai',
    role: 'Textile Manufacturer',
    review: 'A seamless platform for sourcing high-quality, verified Indian wool. It takes the guesswork out of procurement.',
    initial: 'P'
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Quality Inspector',
    review: 'The digital batch tracking makes quality assurance faster than ever. It perfectly bridges the gap between farm and fabric.',
    initial: 'A'
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials-section-bg">
      <div className="testimonials-wrapper">
        <div className="testimonials-container">
          <div className="testimonials-header animate-fade-up">
          <h2>What Our Customers Say</h2>
          <p>We are committed to transforming the Indian wool landscape with innovative and transparent solutions.</p>
        </div>

        <div className="testimonials-grid animate-fade-up delay-200">
          {testimonialsData.map((t) => (
            <div className="testimonial-card" key={t.id}>
              <div className="stars">
                <Star size={16} fill="#DDFF86" color="#DDFF86" />
                <Star size={16} fill="#DDFF86" color="#DDFF86" />
                <Star size={16} fill="#DDFF86" color="#DDFF86" />
                <Star size={16} fill="#DDFF86" color="#DDFF86" />
                <Star size={16} fill="#DDFF86" color="#DDFF86" />
              </div>
              <p className="review-text">{t.review}</p>
              
              <div className="reviewer-info">
                <div className="avatar">{t.initial}</div>
                <div className="reviewer-details">
                  <span className="reviewer-name">{t.name}</span>
                  <span className="reviewer-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default Testimonials;
