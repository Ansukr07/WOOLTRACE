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
    c.id !== 'WOOL' && c.id !== 'APPLE' && c.category !== 'FIBER' && (
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
              Agricultural market intelligence
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D', margin: '8px 0 4px 0' }}>
              Good morning, {user?.name || 'Ramesh Kumar'}
            </h1>
            <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
              Discover real-time mandi prices, buyer procurement demand, and net realization for your agricultural produce.
            </p>
          </div>

          <div className="dashboard-primary-actions">
            <button 
              onClick={() => navigate('/farmer/market?tab=lots')}
              className="dashboard-action dashboard-action-dark"
            >
              <Plus size={16} />
              <span>Create sell lot</span>
            </button>
            <button 
              onClick={() => navigate('/farmer/market')}
              className="dashboard-action dashboard-action-light"
            >
              <Target size={16} />
              <span>Open market intelligence</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Section: What Are You Looking to Sell? ── */}
      <div className="crop-selector-panel">
        <div className="crop-selector-header">
          <div>
            <h2>
              What are you looking to sell today?
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Select your crop to see live modal prices, buyer procurement demand, and net realization comparisons.
            </p>
          </div>

          <div className="crop-search">
            <Search size={14} color="#64748B" />
            <input 
              type="text" 
              placeholder="Search crop or variety..." 
              value={cropSearchQuery}
              onChange={(e) => setCropSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Commodity Chips Ticker */}
        <div className="commodity-strip">
          {filteredCommodities.map(c => {
            const isSelected = c.id === selectedCropId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCropId(c.id)}
                className={`commodity-chip ${isSelected ? 'selected' : ''}`}
              >
                <div className="commodity-name">{c.name}</div>
                <div className="commodity-price">
                  ₹{c.basePricePerKg}/kg
                </div>
                <div className="commodity-demand">
                  {c.demandLevel} Demand
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
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
              <span className="type">Direct buyer</span>
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
            <div className="chart-meta-row">
              <span>Six-month market movement</span>
              <div className="chart-legend">
                <span><i className="legend-dot benchmark" /> Benchmark</span>
                <span><i className="legend-dot mandi" /> Mandi</span>
                <span><i className="legend-dot buyer" /> Direct buyer</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A9D86E" stopOpacity={0.32}/>
                    <stop offset="100%" stopColor="#A9D86E" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="colorMandi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8EA4B8" stopOpacity={0.12}/>
                    <stop offset="100%" stopColor="#8EA4B8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="#DDE2DA" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#7A827C', fontSize: 11}} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#7A827C', fontSize: 11}} domain={['auto', 'auto']} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  cursor={{ stroke: '#9AA49C', strokeWidth: 1, strokeDasharray: '3 4' }}
                  contentStyle={{ border: '1px solid #DDE2DA', borderRadius: '9px', boxShadow: '0 10px 30px rgba(11,18,13,.10)', fontSize: '12px' }}
                  formatter={(value, name) => [`₹${value}/kg`, name === 'price' ? 'Benchmark' : name === 'mandi' ? 'Mandi' : 'Direct buyer']}
                />
                <Area type="monotone" dataKey="mandi" stroke="#8EA4B8" strokeWidth={1.5} fill="url(#colorMandi)" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="processor" stroke="#4C8A62" strokeWidth={1.5} fill="transparent" dot={false} activeDot={{ r: 4 }} />
                <Area type="monotone" dataKey="price" stroke="#111814" strokeWidth={2.5} fill="url(#colorPrice)" dot={false} activeDot={{ r: 5, fill: '#111814', stroke: '#fff', strokeWidth: 2 }} />
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
                <Users size={16} /> Buyer demand
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
