import React, { useState } from 'react';
import { PlayCircle, FileText, Search, Star } from 'lucide-react';
import './Academy.css';

const courses = [
  { id: 1, title: 'How to Improve Wool Quality before Shearing', duration: '12 min', type: 'video', category: 'Quality', rating: 4.9, views: '1.2k' },
  { id: 2, title: 'Understanding Market Prices & Reverse Bidding', duration: '8 min', type: 'video', category: 'Business', rating: 4.8, views: '850' },
  { id: 3, title: 'Best Practices for Sheep Nutrition', duration: '5 min read', type: 'article', category: 'Farming', rating: 4.7, views: '500' },
  { id: 4, title: 'Government Schemes for Wool Farmers 2026', duration: '15 min read', type: 'article', category: 'Schemes', rating: 4.9, views: '3.1k' },
];

const Academy = () => {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Quality', 'Business', 'Farming', 'Schemes'];

  const filteredCourses = activeTab === 'All' ? courses : courses.filter(c => c.category === activeTab);

  return (
    <div className="academy-page">
      <div className="page-header">
        <div>
          <h1>Wool Academy</h1>
          <p>Learn best practices, market trends, and improve your yield.</p>
        </div>
      </div>

      <div className="academy-hero panel">
        <div className="hero-content">
          <span className="featured-tag">Featured Course</span>
          <h2>Modern Shearing Techniques for Maximum Yield</h2>
          <p>Learn how to shear your sheep without damaging the fleece, ensuring you get Grade A certification.</p>
          <button className="btn-primary mt-4"><PlayCircle size={20} /> Watch Now (24 min)</button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search for videos, articles, and guides..." />
        </div>
      </div>

      <div className="category-tabs mt-2">
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card panel">
            <div className="course-thumbnail">
              {course.type === 'video' ? <PlayCircle size={48} color="#FFFFFF" /> : <FileText size={48} color="#FFFFFF" />}
              <span className="duration">{course.duration}</span>
            </div>
            <div className="course-info">
              <span className="course-category">{course.category}</span>
              <h3>{course.title}</h3>
              <div className="course-meta">
                <div className="flex gap-2 align-center">
                  <Star size={14} fill="#EAB308" color="#EAB308" /> {course.rating}
                </div>
                <span>•</span>
                <span>{course.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Academy;
