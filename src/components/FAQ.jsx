import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './FAQ.css';

const faqsData = [
  {
    question: "How does price discovery work on the platform?",
    answer: "WoolTrace aggregates real-time mandi prices, direct processing mill quotes, and institutional demand across agricultural commodities. Farmers can simulate transport distance and storage carrying costs to see their exact Net Farm-Gate Realization."
  },
  {
    question: "How do I trace an agricultural produce batch?",
    answer: "Every harvest registered on WoolTrace receives a unique cryptographic Batch ID and QR Passport. Scanning the QR code displays the complete verified timeline from farm of origin, lab quality certification, warehouse storage, and delivery status."
  },
  {
    question: "How are farmer payments protected through Escrow?",
    answer: "When an offer is agreed upon, the buyer's funds are secured in the WoolTrace Escrow Vault. Payments are automatically released in verified milestones: advance upon dispatch, balance upon gate quality inspection."
  },
  {
    question: "How can smallholder farmers aggregate produce using FPOs?",
    answer: "Individual smallholders can use the FPO Bulk Aggregator tool to pool smaller harvest lots (e.g. 500 KG wheat + 800 KG onion) into institutional-grade volume lots (1,000+ KG) to unlock corporate procurement price premiums."
  },
  {
    question: "How are quality grades verified for different crops?",
    answer: "Independent certified inspectors verify quality parameters based on crop-specific standards (e.g. moisture and protein for wheat, caliber and firmness for tomatoes, staple and micron for cotton/wool) and issue cryptographic QA certificates."
  }
];

const FAQ = () => {
  const [openIndices, setOpenIndices] = useState([0]);

  const toggleFAQ = (index) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter(i => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  return (
    <section className="faq-wrapper">
      <div className="faq-container">
        <div className="faq-header animate-fade-up">
          <span className="faq-subtitle">ANSWERS &amp; ASSISTANCE</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          {faqsData.map((faq, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div 
                key={index} 
                className={`faq-item animate-fade-up ${isOpen ? 'open' : ''}`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <button 
                  className="faq-question" 
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{faq.question}</span>
                  <div className="faq-icon-wrapper">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
