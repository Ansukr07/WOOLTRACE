import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, BarChart3, CheckCircle2, ChevronRight, ShieldCheck, Sprout, WalletCards } from 'lucide-react';
import './khetsetu/KhetSetu.css';

const stats = [['₹2.4 Cr+', 'value discovered this week'], ['1,240', 'active farmer lots'], ['86', 'verified buyers nearby'], ['24h', 'average payment settlement']];

export default function LandingPage() {
  return <div className="ks-landing">
    <header className="ks-topbar">
      <Link to="/" className="ks-brand"><span className="ks-seed">✦</span> KHET<span>SETU</span></Link>
      <nav><a href="#how">How it works</a><a href="#network">For FPOs</a><a href="#trust">Trust centre</a></nav>
      <div className="ks-top-actions"><Link to="/login" className="ks-login">Sign in</Link><Link to="/platform" className="ks-button ks-button-dark">Open platform <ArrowRight size={16}/></Link></div>
    </header>
    <main>
      <section className="ks-hero"><div className="ks-hero-copy">
        <div className="ks-eyebrow"><span className="ks-live-dot"/> AI market intelligence for Indian agriculture</div>
        <h1>Know the market.<br/><em>Sell with confidence.</em></h1>
        <p>KhetSetu helps farmers and FPOs discover the right price, the right buyer, and the right moment to sell - from farm gate to verified payment.</p>
        <div className="ks-hero-ctas"><Link to="/platform" className="ks-button ks-button-lime">Explore your market <ArrowRight size={17}/></Link><a href="#how" className="ks-watch">See how KhetSetu works <ChevronRight size={17}/></a></div>
        <div className="ks-trust-row"><div className="ks-avatars"><span>R</span><span>S</span><span>A</span><span>+</span></div><p>Built for 10,000+ growers, FPOs &amp; buyers</p></div>
      </div><div className="ks-hero-visual"><div className="ks-orbit ks-orbit-one"/><div className="ks-orbit ks-orbit-two"/><div className="ks-pulse-card ks-pulse-top"><div className="ks-mini-icon orange"><BarChart3 size={18}/></div><div><small>Today's price signal</small><b>Hold for 3-5 days</b><span className="up">↑ 4.8% projected</span></div></div><div className="ks-harvest-image"><img src="/harvester.jpg" alt="Farmer working in a field"/><div className="ks-image-overlay"><Sprout size={20}/><span>Crop intelligence, rooted locally</span></div></div><div className="ks-pulse-card ks-pulse-bottom"><div className="ks-mini-icon green"><BadgeCheck size={19}/></div><div><small>Buyer match found</small><b>Shree Foods Pvt. Ltd.</b><span>92% lot-fit score</span></div></div></div></section>
      <section className="ks-stat-band">{stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
      <section id="how" className="ks-section ks-how"><div className="ks-section-lead"><div className="ks-eyebrow">One connected market journey</div><h2>Less guessing. More bargaining power.</h2><p>Every decision, service and transaction comes together in a single farmer-first workflow.</p></div><div className="ks-steps"><article><span className="ks-step-num">01</span><BarChart3/><h3>Read your market</h3><p>Compare local mandi prices, arrivals, demand signals and expected trends in one view.</p></article><article><span className="ks-step-num">02</span><Sprout/><h3>Create a sell-ready lot</h3><p>Add produce, quality grade, quantity and your preferred sale window in minutes.</p></article><article><span className="ks-step-num">03</span><BadgeCheck/><h3>Match with trusted buyers</h3><p>Receive offers from verified buyers whose requirements fit your lot.</p></article><article><span className="ks-step-num">04</span><WalletCards/><h3>Settle with certainty</h3><p>Coordinate pickup and track protected UPI payments from offer to settlement.</p></article></div></section>
      <section id="network" className="ks-fpo-banner"><div><div className="ks-eyebrow">Made for collective strength</div><h2>Your FPO’s market desk,<br/>always on.</h2><p>Aggregate member lots, unlock larger buyers and negotiate with live intelligence at your side.</p><Link to="/platform" className="ks-button ks-button-white">View FPO workspace <ArrowRight size={16}/></Link></div><div className="ks-fpo-points"><p><CheckCircle2/> Aggregate lots across members</p><p><CheckCircle2/> Coordinate storage &amp; transport</p><p><CheckCircle2/> Share transparent transaction records</p></div></section>
      <section id="trust" className="ks-trust-section"><ShieldCheck/><div><div className="ks-eyebrow">Verified. Transparent. Accountable.</div><h2>A more dependable agricultural market.</h2></div><p>Buyer credentials, quality specifications, logistics status and every payment milestone are visible in one shared record.</p></section>
    </main><footer className="ks-footer"><div className="ks-brand"><span className="ks-seed">✦</span> KHET<span>SETU</span></div><span>Market access that moves with the farmer.</span><span>© 2026 KhetSetu</span></footer>
  </div>;
}
