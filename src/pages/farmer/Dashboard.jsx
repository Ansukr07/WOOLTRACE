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
  ArrowRight
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
import { qaService } from '../../services/qa/qaService';
import { agmarknetService, formatDate, getDateOffset } from '../../services/market/agmarknetService';
import './Dashboard.css';

// Default mock data just in case API fails
const fallbackPriceData = [
  { name: 'Jan', fine: 380, medium: 320, coarse: 260 },
  { name: 'Feb', fine: 390, medium: 330, coarse: 265 },
  { name: 'Mar', fine: 385, medium: 335, coarse: 270 },
  { name: 'Apr', fine: 400, medium: 340, coarse: 275 },
  { name: 'May', fine: 410, medium: 345, coarse: 270 },
  { name: 'Jun', fine: 415, medium: 350, coarse: 280 },
  { name: 'Jul', fine: 420, medium: 350, coarse: 280 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(fallbackPriceData);
  const [currentPrices, setCurrentPrices] = useState({ fine: 420, medium: 350, coarse: 280, trend: 1.5 });

  useEffect(() => {
    const storedUser = localStorage.getItem('wooltrace_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apiBatches = await qaService.getBatches('FARMER-01');
      setBatches(apiBatches);
      
      // Fetch Market Data for the graph
      try {
        const comms = await agmarknetService.getCommodities();
        const validComms = Array.isArray(comms) ? comms : [];
        const woolComm = validComms.find(c => ['wool', 'fleece'].some(kw => c.commodity_name?.toLowerCase().includes(kw)));
        
        if (woolComm) {
          const endDate = new Date('2024-12-31'); // Anchor date for demo api
          const startDate = getDateOffset(180, endDate); // 6 months
          
          // Try fetching pan-India prices
          const prices = await agmarknetService.getPrices(
            woolComm.commodity_id, 
            0, // 0 = Pan India
            null, 
            null, 
            formatDate(startDate), 
            formatDate(endDate)
          );
          
          if (prices && prices.length > 0) {
            // Group by month — field is `p.date`, prices are in paise (÷100)
            const monthlyData = {};
            prices.forEach(p => {
              const raw = p.date || p.reported_date || p.arrival_date;
              if (!raw) return;
              const d = new Date(raw);
              if (isNaN(d.getTime())) return; // skip invalid dates
              const month = d.toLocaleString('en-US', { month: 'short' });
              if (!monthlyData[month]) monthlyData[month] = { sum: 0, count: 0, monthOrder: d.getMonth() };
              const modalPrice = (p.modal_price || p.max_price || p.min_price || 0) / 100;
              monthlyData[month].sum += modalPrice;
              monthlyData[month].count += 1;
            });
            
            const processedData = Object.entries(monthlyData)
              .sort((a, b) => a[1].monthOrder - b[1].monthOrder)
              .map(([month, data]) => {
                const basePrice = data.sum / data.count;
                return {
                  name: month,
                  fine: Math.round(basePrice * 1.2),
                  medium: Math.round(basePrice),
                  coarse: Math.round(basePrice * 0.8)
                };
              });
            
            if (processedData.length > 0) {
              setChartData(processedData.slice(-7));
              const latest = processedData[processedData.length - 1];
              setCurrentPrices({
                fine: latest.fine,
                medium: latest.medium,
                coarse: latest.coarse,
                trend: processedData.length > 1
                  ? ((latest.medium - processedData[processedData.length - 2].medium) / processedData[processedData.length - 2].medium * 100)
                  : 0
              });
            }
          }
        }
      } catch (marketErr) {
        console.error("Market API error on dashboard:", marketErr);
        // Fall back to existing mock data
      }
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeBatches = batches.length;
  const woolAvailable = batches.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  
  if (loading) {
    return (
      <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 16 }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #E5E5E5', borderTop: '4px solid #16A34A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: '#666', fontWeight: 600 }}>Loading your farm dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user ? user.name : 'Farmer'}</h1>
        <p>Here is your farm's overview for today.</p>
      </div>

      {/* Top Metrics */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => navigate('/farmer/wallet')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-green"><Wallet size={24} /></div>
          <div className="metric-info">
            <span className="label">Total Balance</span>
            <span className="value">₹48,500</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/wallet')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-yellow"><Clock size={24} /></div>
          <div className="metric-info">
            <span className="label">Pending Payments</span>
            <span className="value">₹12,400</span>
          </div>
        </div>
        <div className="metric-card" onClick={() => navigate('/farmer/my-wool')} style={{ cursor: 'pointer' }}>
          <div className="metric-icon bg-blue"><Box size={24} /></div>
          <div className="metric-info">
            <span className="label">Active Batches</span>
            <span className="value">{activeBatches}</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon bg-primary"><Scale size={24} /></div>
          <div className="metric-info">
            <span className="label">Wool Available</span>
            <span className="value">{woolAvailable} KG</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Market Overview */}
        <div className="market-overview panel">
          <div className="panel-header">
            <h2>Market Overview</h2>
            <div className="time-filters">
              <button className="active" onClick={() => navigate('/farmer/market')}>View Market <ArrowRight size={14}/></button>
            </div>
          </div>
          
          <div className="current-prices">
            <div className="price-item">
              <span className="type">Fine Wool</span>
              <span className="price">₹{currentPrices.fine}/kg</span>
              <span className={`trend ${currentPrices.trend >= 0 ? 'up' : 'down'}`}><TrendingUp size={16} className={currentPrices.trend < 0 ? 'flip-v' : ''}/> {currentPrices.trend >= 0 ? '+' : ''}{currentPrices.trend.toFixed(1)}%</span>
            </div>
            <div className="price-item">
              <span className="type">Medium Wool</span>
              <span className="price">₹{currentPrices.medium}/kg</span>
              <span className={`trend ${currentPrices.trend >= 0 ? 'up' : 'down'}`}><TrendingUp size={16} className={currentPrices.trend < 0 ? 'flip-v' : ''}/> {currentPrices.trend >= 0 ? '+' : ''}{currentPrices.trend.toFixed(1)}%</span>
            </div>
            <div className="price-item">
              <span className="type">Coarse Wool</span>
              <span className="price">₹{currentPrices.coarse}/kg</span>
              <span className={`trend ${currentPrices.trend >= 0 ? 'up' : 'down'}`}><TrendingUp size={16} className={currentPrices.trend < 0 ? 'flip-v' : ''}/> {currentPrices.trend >= 0 ? '+' : ''}{currentPrices.trend.toFixed(1)}%</span>
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
                <Tooltip />
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
              <button className="action-btn secondary" onClick={() => navigate('/farmer/market')}>
                <Tag size={20} />
                <span>Sell Wool</span>
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/farmer/track')}>
                <MapPin size={20} />
                <span>Track Batch</span>
              </button>
            </div>
          </div>

          <div className="recent-activity panel">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon bg-blue"><Box size={16} /></div>
                <div className="activity-text">
                  <p>Batch <strong>WT-KA-124</strong> created</p>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon bg-green"><Wallet size={16} /></div>
                <div className="activity-text">
                  <p>Payment received for <strong>WT-KA-118</strong></p>
                  <span>Yesterday</span>
                </div>
              </div>
            </div>
            <button className="view-all-btn">
              View All <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
