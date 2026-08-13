import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    id: 1,
    question: "How do I trace a batch of wool?",
    answer: "You can easily trace any wool batch by scanning the provided QR code or entering the Batch ID into our trace platform. This will display the complete timeline from the specific farm of origin to the current stage of processing."
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "For our marketplace transactions, we support direct bank transfers, UPI, and major credit/debit cards. All payments are secured and held in escrow until the quality verification is complete."
  },
  {
    id: 3,
    question: "Is there a free trial available?",
    answer: "Yes, farmers can join the WoolTrace platform and create their first 5 digital batch identities for free. Buyers and processors can explore the marketplace for free before committing to a trading tier."
  },
  {
    id: 4,
    question: "Is technical support available?",
    answer: "Absolutely! We provide 24/7 support for all our users. Farmers can also access dedicated local support agents in key wool-producing regions across India."
  },
  {
    id: 5,
    question: "How does the quality verification work?",
    answer: "Independent, certified quality inspectors examine the raw wool at designated warehouses. They upload the lab results and grading directly to the batch's digital identity, ensuring complete trust for the buyer."
  },
  {
    id: 6,
    question: "Is my data secure with your product?",
    answer: "Data security is our top priority. All transactions and batch histories are securely encrypted. We only share specific batch information with verified participants in your supply chain."
  }
];

const FAQ = () => {
  const [openId, setOpenId] = useState(1);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-wrapper">
      <div className="faq-container">
        
        <div className="faq-left animate-fade-up">
          <h2>Frequently Asked<br/>Questions</h2>
          <p>For any unanswered questions, reach out to our support team via email. We'll respond as soon as possible to assist you.</p>
        </div>

        <div className="faq-right animate-fade-up delay-200">
          <div className="accordion">
            {faqs.map((faq) => (
              <div 
                className={`accordion-item ${openId === faq.id ? 'open' : ''}`} 
                key={faq.id}
                onClick={() => toggleAccordion(faq.id)}
              >
                <div className="accordion-header">
                  <h3>{faq.question}</h3>
                  <button className="toggle-btn">
                    {openId === faq.id ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                </div>
                
                <div className="accordion-body">
                  <div className="accordion-content">
                    {faq.answer}
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

export default FAQ;
