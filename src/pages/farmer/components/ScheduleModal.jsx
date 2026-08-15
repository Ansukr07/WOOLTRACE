import React, { useState } from 'react';
import { CalendarDays, Users, MapPin, Clock, X } from 'lucide-react';
import './ScheduleModal.css';

const sessions = [
  { date: 'Today', time: '4:00 PM', group: 'Bikaner Cluster', state: 'Rajasthan', topic: 'Pre-shearing hygiene & blade care', facilitator: 'Ramesh Kumar Sharma', attendees: 126, seats: 20 },
  { date: 'Tomorrow', time: '10:30 AM', group: 'Kullu Valley Group', state: 'Himachal Pradesh', topic: 'Fiber sorting & BIS grading basics', facilitator: 'Priya Thakur', attendees: 84, seats: 15 },
  { date: '16 Aug', time: '9:00 AM', group: 'Mandya Shepherd Circle', state: 'Karnataka', topic: 'Batch QR creation on WoolTrace', facilitator: 'Suresh Gowda', attendees: 112, seats: 10 },
  { date: '17 Aug', time: '3:00 PM', group: 'Jodhpur Wool Collective', state: 'Rajasthan', topic: 'Market price analysis & reverse bidding', facilitator: 'Fatima Begum', attendees: 98, seats: 25 },
  { date: '18 Aug', time: '11:00 AM', group: 'Leh Pashmina Farmers', state: 'Ladakh', topic: 'Sustainable grazing & water conservation', facilitator: 'Dorje Namgyal', attendees: 67, seats: 12 },
  { date: '20 Aug', time: '2:00 PM', group: 'Barmer Wool Circle', state: 'Rajasthan', topic: 'Wool storage best practices', facilitator: 'Bhura Ram Joshi', attendees: 143, seats: 18 },
];

export default function ScheduleModal({ onClose }) {
  const [rsvpSet, setRsvpSet] = useState(new Set());

  const toggleRsvp = (index) => {
    setRsvpSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="quiz-backdrop" onClick={onClose}>
      <div className="quiz-modal schedule-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Upcoming Sessions</h2>
            <p className="modal-subtitle">Join live learning sessions near you</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-content">
          <div className="sessions-list">
            {sessions.map((session, i) => {
              const isRsvped = rsvpSet.has(i);
              return (
                <div key={i} className="session-card">
                  <div className="session-card-header">
                    <div className="session-date-time">
                      <span className="date-badge"><CalendarDays size={14}/> {session.date}</span>
                      <span className="time-info"><Clock size={14}/> {session.time}</span>
                    </div>
                    <button 
                      className={`rsvp-btn ${isRsvped ? 'rsvped' : ''}`}
                      onClick={() => toggleRsvp(i)}
                    >
                      {isRsvped ? 'RSVPed ✓' : 'RSVP'}
                    </button>
                  </div>
                  <h3 className="session-group">{session.group}</h3>
                  <div className="session-location">
                    <MapPin size={14} />
                    <span>{session.state}</span>
                  </div>
                  <div className="session-topic">
                    <strong>Topic:</strong> {session.topic}
                  </div>
                  <div className="session-facilitator">
                    <strong>Facilitator:</strong> {session.facilitator}
                  </div>
                  <div className="session-footer">
                    <div className="attendee-info">
                      <Users size={14} />
                      <span>{session.attendees} attending</span>
                    </div>
                    <div className="seat-info">
                      <span className={session.seats < 15 ? 'seats-low' : 'seats-ok'}>{session.seats} seats left</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="done-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
