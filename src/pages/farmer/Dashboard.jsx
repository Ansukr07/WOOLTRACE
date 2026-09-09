import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Clock, 
  Box, 
  TrendingUp,
  Plus,
  MapPin,
  ArrowRight,
  Warehouse,
  Target,
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  Users,
  Activity,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import { COMMODITIES, getCommodityById } from '../../services/market/cropCommodityRegistry';
import { agmarknetService } from '../../services/market/agmarknetService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batches = [], buyerDemands = [], marketOffers = [] } = useGlobalState();
  
  const [selectedCropId, setSelectedCropId] = useState('WHEAT');
  const [cropSearchQuery, setCropSearchQuery] = useState('');
  const [chartData, setChartData] = useState([]);
  
  const activeBatches = batches.length;
  const totalProduceQuantity = batches.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0);
  const pendingOffersCount = marketOffers.filter(o => o.status === 'PENDING').length;

  const currentCommodity = getCommodityById(selectedCropId);

  useEffect(() => {
    try {
      const liveData = agmarknetService.getMarketSummary();
      if (liveData && liveData.length > 0) {
        const base = currentCommodity.basePricePerKg;
        const transformed = liveData.map((item, idx) => ({
          name: item.month,
          price: Number((base * (0.92 + idx * 0.02)).toFixed(1)),
          mandi: Number((base * (0.88 + idx * 0.02)).toFixed(1)),
          processor: Number((base * (0.96 + idx * 0.02)).toFixed(1))
        }));
        setChartData(transformed);
      }
    } catch (_err) {
      console.warn('Dashboard market overview using fallback series');
    }
  }, [selectedCropId]);

  const filteredCommodities = COMMODITIES.filter(c => 
    c.id !== 'WOOL' && c.category !== 'FIBER' && (
    c.name.toLowerCase().includes(cropSearchQuery.toLowerCase()) ||
    c.hindiName.includes(cropSearchQuery)
  ));

  return (
    <div className="farmer-dashboard">
      {/* Top Welcome Banner */}
      <div className="welcome-banner" style={{ background: '#FFFFFF', border: '1px solid rgba(11,18,13,0.10)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ background: '#DDFF86', color: '#0B120D', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SIH 2026 · Agricultural Market Intelligence
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D', margin: '8px 0 4px 0' }}>
              Good morning, {user?.name || 'Ramesh Kumar'}
            </h1>
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
              Discover real-time mandi prices, buyer procurement demand, and net realization for your agricultural produce.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => navigate('/farmer/market?tab=lots')}
              className="btn-primary"
              style={{ padding: '10px 18px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} />
              <span>Create sell lot</span>
            </button>
            <button 
              onClick={() => navigate('/farmer/market')}
              style={{
                background: '#DDFF86', color: '#0B120D', border: '1px solid rgba(11,18,13,0.15)',
                padding: '10px 18px', borderRadius: '8px', fontWeight: '800', fontSize: '13px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Target size={16} />
              <span>Open market intelligence</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Section: What Are You Looking to Sell? ── */}
      <div style={{
        background: '#FFFFFF', border: '1px solid rgba(11,18,13,0.10)',
        borderRadius: '16px', padding: '20px 24px', marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(11,18,13,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#0B120D" />
              What are you looking to sell today?
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Select your crop to see live modal prices, buyer procurement demand, and net realization comparisons.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8F8F3', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.10)' }}>
            <Search size={14} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search crop or variety..." 
              value={cropSearchQuery}
              onChange={(e) => setCropSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '160px', color: '#0B120D' }}
            />
          </div>
        </div>

        {/* Commodity Chips Ticker */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
          {filteredCommodities.map(c => {
            const isSelected = c.id === selectedCropId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCropId(c.id)}
                style={{
                  background: isSelected ? '#0B120D' : '#F8F8F3',
                  color: isSelected ? '#FFFFFF' : '#0B120D',
                  border: isSelected ? '1px solid #0B120D' : '1px solid rgba(11,18,13,0.10)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  minWidth: '140px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '800' }}>{c.name}</div>
                <div style={{ fontSize: '14px', fontWeight: '800', marginTop: '4px', color: isSelected ? '#DDFF86' : '#0B120D' }}>
                  ₹{c.basePricePerKg}/kg
                </div>
                <div style={{ fontSize: '11px', color: isSelected ? '#BED5E5' : '#64748B', marginTop: '2px' }}>
                  {c.demandLevel} Demand
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row" style={{ marginBottom: '24px' }}>
        <div className="metric-card" onClick={() => navigate('/farmer/market?tab=transactions')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-green"><Wallet size={24} /></div>
          <div className="metric-info">
            <span className="label">Total Produce Revenue</span>
            <span className="value">₹1,48,500</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/market?tab=transactions')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-yellow"><Clock size={24} /></div>
          <div className="metric-info">
            <span className="label">Escrow Secured</span>
            <span className="value">₹52,000</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/market?tab=lots')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-blue"><Box size={24} /></div>
          <div className="metric-info">
              <span className="label">Active sell lots</span>
            <span className="value">{activeBatches}</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/market?tab=lots')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-primary"><Layers size={24} /></div>
          <div className="metric-info">
              <span className="label">Sell-ready volume</span>
            <span className="value">{totalProduceQuantity.toLocaleString('en-IN')} KG</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Left: Market Overview & Price Trends for Selected Commodity */}
        <div className="market-overview panel">
          <div className="panel-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                {currentCommodity.name} - Price Intelligence (APMC & Mills)
              </h2>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Category: {currentCommodity.category} · Updated Live via CEDA / Mandi
              </span>
            </div>
            <div className="time-filters">
              <button className="active" onClick={() => navigate(`/farmer/market?crop=${selectedCropId}`)}>
                Full Market Hub <ArrowRight size={14}/>
              </button>
            </div>
          </div>
          
          <div className="current-prices" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            <div className="price-item">
              <span className="type">APMC Mandi Yard</span>
              <span className="price">₹{currentCommodity.mandiPricePerKg}/KG</span>
              <span className="trend up"><TrendingUp size={14} /> +3.2%</span>
            </div>
            <div className="price-item">
              <span className="type">Processor Direct</span>
              <span className="price">₹{currentCommodity.processorQuotePerKg}/KG</span>
              <span className="trend up"><TrendingUp size={14} /> +7.8%</span>
            </div>
            <div className="price-item">
              <span className="type">Institutional Co-op</span>
              <span className="price">₹{currentCommodity.institutionalQuotePerKg}/KG</span>
              <span className="trend up"><TrendingUp size={14} /> +8.9%</span>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DDFF86" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#DDFF86" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} domain={['auto', 'auto']} />
                <Tooltip formatter={(value) => [`₹${value}/KG`, 'Benchmark Price']} />
                <Area type="monotone" dataKey="price" stroke="#0B120D" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Buyer Demands & My Produce Quick Actions */}
        <div className="side-panel">
          {/* Live Buyer Demand Opportunities */}
          <div className="panel" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} /> Verified Buyer Demand
              </h2>
              <span style={{ fontSize: '11px', fontWeight: '800', background: '#DDFF86', padding: '2px 6px', borderRadius: '4px' }}>
                {(buyerDemands || []).length} Active
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(buyerDemands || []).slice(0, 3).map(bd => (
                <div key={bd.id} style={{
                  background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.08)',
                  borderRadius: '10px', padding: '10px 12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0B120D' }}>{bd.cropName}</strong>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{bd.buyerName}</div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0B120D' }}>
                      ₹{bd.minPrice} - ₹{bd.maxPrice}/kg
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                    <span>Req: <strong>{bd.quantityRequired.toLocaleString('en-IN')} KG</strong></span>
                    <button 
                      onClick={() => navigate('/farmer/market')}
                      style={{ background: '#0B120D', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Quote Lot →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions panel">
            <h2>Quick Produce Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => navigate('/farmer/market?tab=lots')}>
                <Plus size={18} />
                <span>Register Produce Batch</span>
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/farmer/trust')}>
                <MapPin size={18} />
                    <span>Quality & trust record</span>
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/farmer/storage')}>
                <Warehouse size={18} />
                <span>Compare storage options</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
