import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Clock, 
  Box, 
  Scale, 
  TrendingUp,
  Plus,
  Tag,
  MapPin,
  ArrowRight,
  Warehouse,
  ShieldCheck
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
import { agmarknetService, formatDate, getDateOffset } from '../../services/market/agmarknetService';
import './Dashboard.css';

const fallbackPriceData = [
  { name: 'Feb', fine: 410, medium: 345, coarse: 275 },
  { name: 'Mar', fine: 418, medium: 350, coarse: 280 },
  { name: 'Apr', fine: 425, medium: 355, coarse: 285 },
  { name: 'May', fine: 430, medium: 360, coarse: 290 },
  { name: 'Jun', fine: 440, medium: 365, coarse: 295 },
  { name: 'Jul', fine: 448, medium: 370, coarse: 300 },
  { name: 'Aug', fine: 455, medium: 380, coarse: 310 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batches, warehouses } = useGlobalState();
  const [chartData, setChartData] = useState(fallbackPriceData);
  const [currentPrices, setCurrentPrices] = useState({ fine: 455, medium: 380, coarse: 310, trend: 2.8 });

  useEffect(() => {
    fetchMarketOverview();
  }, []);

  const fetchMarketOverview = async () => {
    try {
      const prices = await agmarknetService.getPrices(101, 0, null, null, '2026-01-01', '2026-08-17');
      if (prices && prices.length > 0) {
        const monthlyData = {};
        prices.forEach(p => {
          const d = new Date(p.date);
          const month = d.toLocaleString('en-US', { month: 'short' });
          if (!monthlyData[month]) monthlyData[month] = { sum: 0, count: 0, monthOrder: d.getMonth() };
          const modalPrice = (p.modal_price || 0) / 100;
          monthlyData[month].sum += modalPrice;
          monthlyData[month].count += 1;
        });

        const processed = Object.entries(monthlyData)
          .sort((a, b) => a[1].monthOrder - b[1].monthOrder)
          .map(([month, data]) => {
            const base = data.sum / data.count;
            return {
              name: month,
              fine: Math.round(base * 1.15),
              medium: Math.round(base),
              coarse: Math.round(base * 0.82)
            };
          });

        if (processed.length > 0) {
          setChartData(processed.slice(-7));
          const latest = processed[processed.length - 1];
          setCurrentPrices({
            fine: latest.fine,
            medium: latest.medium,
            coarse: latest.coarse,
            trend: 2.8
          });
        }
      }
    } catch (e) {
      console.warn('Dashboard market overview using default series');
    }
  };

  const activeBatches = batches.length;
  const woolAvailable = batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user ? user.name : 'Rajesh Gowda'}</h1>
        <p>Here is your WoolTrace farm operations overview for today.</p>
      </div>

      {/* Top Metrics */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => navigate('/farmer/wallet')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-green"><Wallet size={24} /></div>
          <div className="metric-info">
            <span className="label">Total Balance</span>
            <span className="value">₹1,81,900</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/wallet')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-yellow"><Clock size={24} /></div>
          <div className="metric-info">
            <span className="label">Escrow Secured</span>
            <span className="value">₹48,500</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/my-wool')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-blue"><Box size={24} /></div>
          <div className="metric-info">
            <span className="label">Registered Batches</span>
            <span className="value">{activeBatches}</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/my-wool')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-primary"><Scale size={24} /></div>
          <div className="metric-info">
            <span className="label">Total Wool Harvested</span>
            <span className="value">{woolAvailable.toLocaleString('en-IN')} KG</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Market Overview */}
        <div className="market-overview panel">
          <div className="panel-header">
            <h2>Mandi Price Trends (APMC Live)</h2>
            <div className="time-filters">
              <button className="active" onClick={() => navigate('/farmer/market')}>
                Full Market Intelligence <ArrowRight size={14}/>
              </button>
            </div>
          </div>
          
          <div className="current-prices">
            <div className="price-item">
              <span className="type">Fine Merino Wool</span>
              <span className="price">₹{currentPrices.fine}/KG</span>
              <span className="trend up"><TrendingUp size={16} /> +{currentPrices.trend}%</span>
            </div>
            <div className="price-item">
              <span className="type">Medium Crossbred</span>
              <span className="price">₹{currentPrices.medium}/KG</span>
              <span className="trend up"><TrendingUp size={16} /> +2.1%</span>
            </div>
            <div className="price-item">
              <span className="type">Coarse Carpet Wool</span>
              <span className="price">₹{currentPrices.coarse}/KG</span>
              <span className="trend up"><TrendingUp size={16} /> +1.4%</span>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DDFF86" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#DDFF86" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip formatter={(value) => [`₹${value}/KG`, 'Price']} />
                <Area type="monotone" dataKey="fine" stroke="#0B120D" strokeWidth={2} fillOpacity={1} fill="url(#colorFine)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="side-panel">
          <div className="quick-actions panel">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => navigate('/farmer/my-wool')}>
                <Plus size={20} />
                <span>Create Wool Batch</span>
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/farmer/track')}>
                <MapPin size={20} />
                <span>Track Batch Passport</span>
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/farmer/warehouses')}>
                <Warehouse size={20} />
                <span>Find Warehouses</span>
              </button>
            </div>
          </div>

          <div className="recent-activity panel">
            <h2>Recent Batch History</h2>
            <div className="activity-list">
              {batches.slice(0, 3).map((b, i) => (
                <div key={b.id || i} className="activity-item" onClick={() => navigate(`/farmer/batch/${b.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="activity-icon bg-blue"><Box size={16} /></div>
                  <div className="activity-text">
                    <p><strong>{b.id}</strong> — {b.quantity} KG ({b.woolType})</p>
                    <span>Stage: {b.currentStage} · {b.origin}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn" onClick={() => navigate('/farmer/my-wool')}>
              View All Batches <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
