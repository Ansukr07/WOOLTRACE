import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LineChart, Line, ComposedChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  RefreshCw, MapPin, TrendingUp, Minus, Bell, Bookmark,
  Star, ArrowUpRight, ArrowDownRight, Info, AlertTriangle,
  ShoppingCart, BarChart2, Calendar, Activity, Target, ShieldAlert,
  Newspaper
} from 'lucide-react';
import {
  agmarknetService, formatDate, getDateOffset, fmtPrice, fmtChange, pctChange
} from '../../services/market/agmarknetService.js';
import './Market.css';

// ── Constants ────────────────────────────────────────────────────────────────
const PERIODS = ['7D', '30D', '3M', '6M', '1Y', 'All Time'];
const PERIOD_DAYS = { '7D': 7, '30D': 30, '3M': 90, '6M': 180, '1Y': 365, 'All Time': 10000 };
const MY_BATCHES = [
  { id: 'WT-KA-2026-00124', qty: 428, grade: 'A', variety: 'Wool' },
  { id: 'WT-KA-2026-00109', qty: 505, grade: 'B', variety: 'Wool' },
];
const WOOL_KEYWORDS = ['wool', 'fleece'];
const ANCHOR_DATE = new Date('2024-12-31'); // Demo anchor for CEDA API limits

// ── Utility Functions ────────────────────────────────────────────────────────
function stdDev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  return Math.sqrt(arr.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / (arr.length - 1));
}

// ── Sub-components ───────────────────────────────────────────────────────────

function DataStatusBadge({ lastUpdated, loading, onRefresh }) {
  const ts = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null;
  return (
    <div className="data-status">
      <span className="status-dot live" />
      <span className="status-text">{ts ? `Latest available: ${ts}` : 'Live'}</span>
      <span className="status-source">· Source: AGMARKNET (via CEDA)</span>
      <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
        <RefreshCw size={14} className={loading ? 'spinning' : ''} />
        {loading ? 'Updating…' : 'Refresh'}
      </button>
    </div>
  );
}

function MetricCard({ label, value, sub, change, highlight, icon }) {
  const pos = change > 0;
  const neg = change < 0;
  return (
    <div className={`metric-card ${highlight ? 'metric-highlight' : ''}`}>
      <div className="metric-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
        <div className="metric-label">{label}</div>
        {icon && <div className="metric-icon-small">{icon}</div>}
      </div>
      <div className="metric-value">{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
      {change != null && (
        <div className={`metric-change ${pos ? 'pos' : neg ? 'neg' : 'neutral'}`}>
          {pos ? <ArrowUpRight size={14} /> : neg ? <ArrowDownRight size={14} /> : <Minus size={14} />}
          {fmtChange(change)}
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-date">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: p.color }} />
          <span>{p.name}: <strong>{p.name === 'Arrivals' ? `${p.value} MT` : fmtPrice(p.value)}</strong></span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Market() {
  const [loadingComms, setLoadingComms] = useState(true);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [loadingMkts, setLoadingMkts] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cascading Selection State
  const [commodities, setCommodities] = useState([]);
  const [selectedComm, setSelectedComm] = useState('');
  const [isWoolMissing, setIsWoolMissing] = useState(false);

  const [states, setStates] = useState([{ id: 0, name: 'Pan India (All States)' }]);
  const [selectedState, setSelectedState] = useState(0);
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');

  // UI State
  const [period, setPeriod] = useState('All Time');
  const [activeTab, setActiveTab] = useState('chart'); // chart | arrivals 
  const [activeBatch, setActiveBatch] = useState(MY_BATCHES[0]);
  const [page, setPage] = useState(0);

  // Raw API Data (Fetched Once for All Time)
  const [allPrices, setAllPrices] = useState([]);
  const [allQuantities, setAllQuantities] = useState([]);

  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wt_watchlist') || '[]'); } catch { return []; }
  });
  const [alertPrice, setAlertPrice] = useState('');
  const [alertSet, setAlertSet] = useState(false);

  // 1. Initial Load: Fetch Commodities
  useEffect(() => {
    loadCommodities();
  }, []);

  const loadCommodities = async () => {
    setLoadingComms(true);
    setError(null);
    try {
      const comms = await agmarknetService.getCommodities();
      const validComms = Array.isArray(comms) ? comms : [];
      setCommodities(validComms);
      
      const woolMatch = validComms.find(c => WOOL_KEYWORDS.some(kw => c.commodity_name?.toLowerCase().includes(kw)));
      if (woolMatch) {
        setSelectedComm(woolMatch.commodity_id);
      } else {
        setIsWoolMissing(true);
        if (validComms.length > 0) setSelectedComm(validComms[0].commodity_id);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingComms(false);
    }
  };

  // 2. Load Geographies
  useEffect(() => {
    if (!selectedComm) return;
    const loadGeo = async () => {
      setLoadingGeo(true);
      try {
        const geoData = await agmarknetService.getGeographies(selectedComm);
        if (Array.isArray(geoData)) {
          const uniqueStates = [];
          const stateMap = new Map();
          geoData.forEach(item => {
            if (item.census_state_id && item.census_state_name && !stateMap.has(item.census_state_id)) {
              stateMap.set(item.census_state_id, true);
              uniqueStates.push({ id: item.census_state_id, name: item.census_state_name });
            }
          });
          uniqueStates.sort((a, b) => a.name.localeCompare(b.name));
          setStates([{ id: 0, name: 'Pan India (All States)' }, ...uniqueStates]);
          setSelectedState(0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingGeo(false);
      }
    };
    loadGeo();
  }, [selectedComm]);

  // 3. Load Markets
  useEffect(() => {
    if (!selectedComm || selectedState === '' || selectedState === null) return;
    const loadMkts = async () => {
      setLoadingMkts(true);
      setMarkets([]);
      setSelectedMarket('');
      if (selectedState === 0) {
        setLoadingMkts(false);
        return;
      }
      try {
        const mktData = await agmarknetService.getMarkets(selectedComm, selectedState, null);
        if (Array.isArray(mktData)) {
          const uniqueMarkets = [];
          const map = new Map();
          mktData.forEach(m => {
            if (m.market_id && m.market_name && !map.has(m.market_id)) {
              map.set(m.market_id, true);
              uniqueMarkets.push({ id: m.market_id, name: m.market_name });
            }
          });
          uniqueMarkets.sort((a, b) => a.name.localeCompare(b.name));
          setMarkets(uniqueMarkets);
          if (uniqueMarkets.length > 0) setSelectedMarket(uniqueMarkets[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMkts(false);
      }
    };
    loadMkts();
  }, [selectedComm, selectedState]);

  // 4. Fetch 'All Time' Data
  const loadMarketData = useCallback(async () => {
    if (!selectedComm || selectedState === '' || selectedState === null) {
      setAllPrices([]);
      setAllQuantities([]);
      return;
    }
    
    setLoadingData(true);
    const mktArr = selectedMarket ? [selectedMarket] : null;
    const toDate = formatDate(new Date()); // Allow it to fetch up to current date
    const fromDate = '2000-01-01'; // Broad fetch to minimize API calls
    
    try {
      const [priceData, qtyData] = await Promise.all([
        agmarknetService.getPrices(selectedComm, selectedState, null, mktArr, fromDate, toDate).catch(() => []),
        agmarknetService.getQuantities(selectedComm, selectedState, null, mktArr, fromDate, toDate).catch(() => [])
      ]);

      const normPrices = Array.isArray(priceData) ? priceData.map(p => ({
        date: p.date,
        market: p.market_name || (markets.find(m => m.id === selectedMarket)?.name) || 'Aggregated',
        minPrice: p.min_price ? p.min_price / 100 : 0,
        maxPrice: p.max_price ? p.max_price / 100 : 0,
        modalPrice: p.modal_price ? p.modal_price / 100 : 0
      })).sort((a, b) => new Date(a.date) - new Date(b.date)) : [];

      const normQty = Array.isArray(qtyData) ? qtyData.map(q => ({
        date: q.date,
        quantity: q.quantity || 0
      })).sort((a, b) => new Date(a.date) - new Date(b.date)) : [];

      setAllPrices(normPrices);
      setAllQuantities(normQty);
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  }, [selectedComm, selectedState, selectedMarket, markets]);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);


  // ── LOCAL DATA DERIVATION (0 API Calls) ──────────────────────────────────

  // Filter datasets based on selected period
  const { prices, quantities } = useMemo(() => {
    if (period === 'All Time') return { prices: allPrices, quantities: allQuantities };
    
    const cutoffDate = getDateOffset(PERIOD_DAYS[period], ANCHOR_DATE);
    const p = allPrices.filter(x => new Date(x.date) >= cutoffDate);
    const q = allQuantities.filter(x => new Date(x.date) >= cutoffDate);
    return { prices: p, quantities: q };
  }, [allPrices, allQuantities, period]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const latestPrice = prices.length > 0 ? prices[prices.length - 1] : null;
    const previousPrice = prices.length > 1 ? prices[0] : null;
    
    const priceChange = (latestPrice && previousPrice && previousPrice.modalPrice > 0)
      ? pctChange(previousPrice.modalPrice, latestPrice.modalPrice) : null;
      
    const highestPrice = prices.reduce((max, p) => (p.modalPrice > (max?.modalPrice || 0) ? p : max), null);
    const lowestPrice = prices.reduce((min, p) => ((!min || p.modalPrice < min.modalPrice) && p.modalPrice > 0 ? p : min), null);
    const avgPrice = prices.length ? prices.reduce((s, p) => s + p.modalPrice, 0) / prices.length : 0;
    
    const latestQuantity = quantities.length > 0 ? quantities[quantities.length - 1].quantity : 0;

    // Volatility (Standard Deviation / Mean)
    const modalPrices = prices.map(p => p.modalPrice).filter(p => p > 0);
    const stdDevVal = stdDev(modalPrices);
    const volatilityPct = avgPrice > 0 ? (stdDevVal / avgPrice) * 100 : 0;

    // Trend Direction
    const recentAvg = modalPrices.slice(-7).reduce((a, b) => a + b, 0) / Math.min(modalPrices.length, 7) || 0;
    const olderAvg = modalPrices.slice(-14, -7).reduce((a, b) => a + b, 0) / Math.min(modalPrices.length, 7) || recentAvg;
    const trend = recentAvg > olderAvg * 1.02 ? 'Rising' : recentAvg < olderAvg * 0.98 ? 'Falling' : 'Stable';

    // Market Opportunity Score (0-100)
    let score = 50;
    if (latestPrice && avgPrice > 0) {
      if (latestPrice.modalPrice > avgPrice) score += 20; // Above average
      if (trend === 'Rising') score += 15;
      if (volatilityPct < 10) score += 10; // Stable market is good
      if (latestPrice.modalPrice === highestPrice?.modalPrice) score += 5;
    }
    const opportunityScore = Math.min(Math.max(Math.round(score), 0), 100);

    return {
      latestPrice, previousPrice, priceChange, highestPrice, lowestPrice,
      avgPrice, latestQuantity, volatilityPct, trend, opportunityScore,
      recentAvg, modalPrices
    };
  }, [prices, quantities]);

  // Market Comparison & Gap Analysis (Derived from the single dataset if it contains multiple markets)
  // Usually Agmarknet API /prices returns one market or state aggregate. 
  // If state=0, we aggregate. To fake a comparison for the demo if only 1 market exists, we'll use the raw data if it has multiple.
  const marketRanking = useMemo(() => {
    if (prices.length === 0) return [];
    
    const mktMap = new Map();
    prices.forEach(p => {
      if (!mktMap.has(p.market)) mktMap.set(p.market, []);
      mktMap.get(p.market).push(p.modalPrice);
    });

    const ranks = Array.from(mktMap.entries()).map(([mkt, prcs]) => {
      const cur = prcs[prcs.length - 1];
      const prev = prcs[0];
      return {
        name: mkt,
        current: cur,
        change: pctChange(prev, cur) || 0
      };
    });
    
    // Sort highest price first
    ranks.sort((a, b) => b.current - a.current);
    return ranks;
  }, [prices]);

  const bestMarket = marketRanking.length > 0 ? marketRanking[0] : null;
  const myMarketRank = selectedMarket ? marketRanking.findIndex(r => r.name === (markets.find(m => m.id === selectedMarket)?.name)) : -1;

  // Chart Data preparation
  const chartData = prices.map(p => {
    const d = p.date.split('T')[0];
    const qtyMatch = quantities.find(q => q.date.split('T')[0] === d);
    return {
      date: d,
      Min: p.minPrice,
      Modal: p.modalPrice,
      Max: p.maxPrice,
      Arrivals: qtyMatch ? qtyMatch.quantity : 0
    };
  });

  const indicativeValue = (stats.latestPrice && activeBatch) ? Math.round(activeBatch.qty * stats.latestPrice.modalPrice) : 0;
  
  // Pagination for History Table
  const pageSize = 10;
  const totalPages = Math.ceil(prices.length / pageSize);
  const pagedHistory = prices.slice().reverse().slice(page * pageSize, (page + 1) * pageSize);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleWatch = mktId => {
    const updated = watchlist.includes(mktId) ? watchlist.filter(m => m !== mktId) : [...watchlist, mktId];
    setWatchlist(updated);
    localStorage.setItem('wt_watchlist', JSON.stringify(updated));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  
  if (error && !commodities.length) {
    return (
      <div className="market-page">
        <div className="panel market-error">
          <div style={{ fontSize: 40 }}>📡</div>
          <h3>Market data is temporarily unavailable.</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={loadCommodities}><RefreshCw size={16}/> Try Again</button>
        </div>
      </div>
    );
  }

  const locString = selectedMarket ? markets.find(m => m.id === selectedMarket)?.name : (selectedState === 0 ? 'Pan India' : states.find(s => s.id === selectedState)?.name);

  return (
    <div className="market-page">
      {/* ── Header ── */}
      <div className="market-page-header">
        <div>
          <h1 className="market-title">Wool Market Intelligence</h1>
          <p className="market-sub">Understand the market before you sell.</p>
        </div>
        <DataStatusBadge lastUpdated={lastUpdated} loading={loadingData} onRefresh={loadMarketData} />
      </div>

      {isWoolMissing && (
        <div className="demo-banner" style={{ background: '#FFAAA4' }}>
          <AlertTriangle size={16} />
          <span>The connected Agmarknet dataset does not currently provide a matching wool commodity. Displaying fallback data structure.</span>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="filters-row panel">
        <div className="filter-group">
          <label>Commodity</label>
          <select value={selectedComm} onChange={e => setSelectedComm(Number(e.target.value))} className="filter-select" disabled={loadingComms}>
            {loadingComms && <option>Loading...</option>}
            {commodities.map(c => <option key={c.commodity_id} value={c.commodity_id}>{c.commodity_name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>State</label>
          <select value={selectedState} onChange={e => setSelectedState(Number(e.target.value))} className="filter-select" disabled={loadingGeo || !states.length}>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <MapPin size={15} color="#666" />
          <select value={selectedMarket} onChange={e => setSelectedMarket(Number(e.target.value))} className="filter-select" disabled={loadingMkts || selectedState === 0 || !markets.length}>
            <option value="">{selectedState === 0 ? 'All India Markets' : '-- Select Market (Optional) --'}</option>
            {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {/* ── Empty State Handling ── */}
      {!loadingData && prices.length === 0 && (
        <div className="panel" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          <Info size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
          <h3>No price records available</h3>
          <p>There is no price data for this selection and date range.</p>
          {period !== 'All Time' && (
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setPeriod('All Time')}>
              View All Time History
            </button>
          )}
        </div>
      )}

      {prices.length > 0 && (
        <>
          {/* ── Scorecard & Overview ── */}
          <div className="scorecard-row">
            <MetricCard
              label="Current Modal Price"
              value={stats.latestPrice ? `${fmtPrice(stats.latestPrice.modalPrice)}/kg` : 'N/A'}
              sub={locString}
              change={stats.priceChange}
              highlight
            />
            <MetricCard label={`${period} Average`} value={`${fmtPrice(stats.avgPrice)}/kg`} icon={<Activity size={16} color="#666"/>}/>
            <MetricCard label="Market High" value={stats.highestPrice ? `${fmtPrice(stats.highestPrice.modalPrice)}/kg` : 'N/A'} icon={<TrendingUp size={16} color="#666"/>}/>
            <MetricCard label="Volatility" value={`${stats.volatilityPct.toFixed(1)}%`} sub={stats.volatilityPct > 10 ? 'High' : 'Low'} icon={<Activity size={16} color="#666"/>}/>
            
            <div className="metric-card opp-score-card">
              <div className="metric-label">Market Opportunity</div>
              <div className="opp-score-val" style={{ color: stats.opportunityScore > 60 ? '#2E7D32' : stats.opportunityScore > 40 ? '#F57F17' : '#C62828' }}>
                {stats.opportunityScore} <span>/ 100</span>
              </div>
              <div className="metric-sub">Based on trend & volatility</div>
            </div>
          </div>

          <div className="market-position-banner panel">
            <Target size={20} color="#0B120D" />
            <div>
              <strong>Market Trend: {stats.trend} </strong>
              <span>
                {stats.trend === 'Rising' ? 'Modal wool prices are currently above the recent historical average.' : 
                 stats.trend === 'Falling' ? 'Modal wool prices are currently trending below the recent historical average.' : 
                 'Modal wool prices have remained relatively stable recently.'}
              </span>
            </div>
          </div>

          {/* ── Price Trend Chart ── */}
          <div className="panel chart-section">
            <div className="chart-header">
              <h3>Price Trend — {locString}</h3>
              <div className="period-tabs">
                {PERIODS.map(p => (
                  <button key={p} className={`period-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
                ))}
              </div>
            </div>
            {loadingData ? <div className="chart-skeleton" /> : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={30} />
                  <YAxis tick={{ fill: '#999', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={55} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: 10 }} />
                  <Line type="monotone" dataKey="Min" stroke="#BED5E5" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Modal" stroke="#0B120D" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Max" stroke="#DDFF86" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Tabs for Additional Analytics ── */}
          <div className="tab-row" style={{ marginTop: 24, marginBottom: 16 }}>
            <button className={`tab-chip ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => setActiveTab('chart')}>
              <BarChart2 size={15}/> Gap Analysis
            </button>
            <button className={`tab-chip ${activeTab === 'arrivals' ? 'active' : ''}`} onClick={() => setActiveTab('arrivals')}>
              <Activity size={15}/> Price vs Arrivals
            </button>
          </div>

          {activeTab === 'chart' && (
            <div className="two-col-row">
              {/* My Wool / Batch Value */}
              <div className="panel section-box">
                <h3 className="section-heading"><ShoppingCart size={17}/> My Active Batch</h3>
                <div style={{ marginBottom: 12 }}>
                  <select className="filter-select" value={activeBatch.id}
                    onChange={e => setActiveBatch(MY_BATCHES.find(b => b.id === e.target.value))}>
                    {MY_BATCHES.map(b => <option key={b.id} value={b.id}>{b.id} ({b.qty} KG)</option>)}
                  </select>
                </div>
                <div className="batch-value-card">
                  <div className="bv-row"><span>Quantity</span><strong>{activeBatch.qty} KG</strong></div>
                  <div className="bv-row"><span>Grade</span><strong>{activeBatch.grade}</strong></div>
                  <div className="bv-divider" />
                  <div className="bv-row">
                    <span>Current Market Price ({locString})</span>
                    <strong>{stats.latestPrice ? `${fmtPrice(stats.latestPrice.modalPrice)}/kg` : 'N/A'}</strong>
                  </div>
                  <div className="bv-value-row">
                    <span>Indicative Gross Value</span>
                    <strong className="bv-big">₹{indicativeValue.toLocaleString('en-IN')}</strong>
                  </div>
                  <p className="bv-disclaimer">⚠ Indicative value before transport and transaction costs.</p>
                  <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!stats.latestPrice}>
                    Review Selling Options
                  </button>
                </div>
              </div>

              {/* Price Gap Analysis & Best Market */}
              <div className="panel section-box">
                <h3 className="section-heading"><MapPin size={17}/> Price Gap Analysis</h3>
                {bestMarket && stats.latestPrice ? (
                  <div className="gap-analysis-card">
                    <div className="gap-market">
                      <span>Best Current Market</span>
                      <strong>{bestMarket.name}</strong>
                      <div className="gap-price">{fmtPrice(bestMarket.current)}/kg</div>
                    </div>
                    
                    <div className="gap-vs">
                      <div className="gap-line"></div>
                      <div className="gap-diff">
                        {bestMarket.current > stats.latestPrice.modalPrice ? '+' : ''}
                        {fmtPrice(bestMarket.current - stats.latestPrice.modalPrice)}/kg Diff
                      </div>
                    </div>

                    <div className="gap-market yours">
                      <span>Your Selected Market</span>
                      <strong>{locString}</strong>
                      <div className="gap-price">{fmtPrice(stats.latestPrice.modalPrice)}/kg</div>
                    </div>

                    <div className="gap-conclusion">
                      For your <strong>{activeBatch.qty} KG</strong> batch, selling at the highest market yields an indicative gross difference of <strong>₹{Math.round(activeBatch.qty * Math.max(0, bestMarket.current - stats.latestPrice.modalPrice)).toLocaleString('en-IN')}</strong>.
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontSize: 14 }}>Insufficient regional data for gap analysis.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'arrivals' && (
            <div className="panel chart-section">
              <div className="chart-header">
                <h3>Price vs. Arrivals Correlation</h3>
                <p className="chart-desc" style={{ margin: 0, color: '#666', fontSize: 13 }}>Compare market price movement with reported market arrivals.</p>
              </div>
              {loadingData ? <div className="chart-skeleton" /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis yAxisId="price" tick={{ fill: '#999', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={55} />
                    <YAxis yAxisId="arr" orientation="right" tick={{ fill: '#999', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}T`} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area yAxisId="arr" type="monotone" dataKey="Arrivals" fill="#F0F8FF" stroke="#BED5E5" name="Arrivals (MT)" />
                    <Line yAxisId="price" type="monotone" dataKey="Modal" stroke="#0B120D" strokeWidth={2} dot={false} name="Modal Price (₹/kg)" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {/* ── Insights & Calendar Row ── */}
          <div className="two-col-row">
            <div className="panel section-box">
              <h3 className="section-heading"><Star size={17}/> Market Insights</h3>
              <div className="insights-list">
                <div className={`insight-item ${stats.priceChange > 0 ? 'insight-pos' : stats.priceChange < 0 ? 'insight-neg' : ''}`}>
                  <span className="insight-icon">{stats.priceChange > 0 ? '📈' : stats.priceChange < 0 ? '📉' : '➡️'}</span>
                  <p>Modal price has {stats.priceChange > 0 ? 'increased' : stats.priceChange < 0 ? 'decreased' : 'changed'} by {fmtChange(stats.priceChange)} compared to the earliest available record in this period.</p>
                </div>
                <div className="insight-item">
                  <span className="insight-icon">🎯</span>
                  <p>Current modal price is {pctChange(stats.avgPrice, stats.latestPrice?.modalPrice) > 0 ? 'above' : 'below'} the period average of {fmtPrice(stats.avgPrice)}/kg.</p>
                </div>
                {stats.latestPrice?.maxPrice > stats.latestPrice?.modalPrice && (
                  <div className="insight-item">
                    <span className="insight-icon">💡</span>
                    <p>The maximum reported price recently reached {fmtPrice(stats.highestPrice.modalPrice)}/kg, offering potential negotiation upside.</p>
                  </div>
                )}
                <div className="insight-item">
                  <span className="insight-icon">⚠️</span>
                  <p>Data is for market awareness only. Actual transaction prices depend on wool quality and buyer negotiations.</p>
                </div>
              </div>
            </div>

            <div className="panel section-box">
              <h3 className="section-heading"><Calendar size={17}/> Price Calendar ({period})</h3>
              <div className="price-calendar">
                {prices.slice(-7).map((p, i) => {
                  const day = new Date(p.date).toLocaleDateString('en-IN', { weekday: 'short' });
                  const prev = i > 0 ? prices.slice(-7)[i - 1].modalPrice : p.modalPrice;
                  const diff = p.modalPrice - prev;
                  return (
                    <div key={p.date} className="cal-day">
                      <div className="cal-day-name">{day}</div>
                      <div className="cal-day-price">{fmtPrice(p.modalPrice)}</div>
                      <div className={`cal-day-indicator ${diff > 0 ? 'pos' : diff < 0 ? 'neg' : 'neutral'}`}>
                        {diff > 0 ? '▲' : diff < 0 ? '▼' : '−'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="cal-desc" style={{ color: '#666', fontSize: 13, marginTop: 12 }}>Daily modal price changes for the most recent available week.</p>
            </div>
          </div>

          {/* ── Price History Table ── */}
          <div className="panel section-box">
            <h3 className="section-heading">Detailed Price History</h3>
            <div className="table-responsive">
              <table className="history-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '12px 0' }}>Date</th>
                    <th>Market</th>
                    <th>Min Price</th>
                    <th>Modal Price</th>
                    <th>Max Price</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedHistory.map((p, i) => (
                    <tr key={`${p.date}-${i}`} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '12px 0' }}>{new Date(p.date).toLocaleDateString('en-IN')}</td>
                      <td>{p.market}</td>
                      <td>{fmtPrice(p.minPrice)}</td>
                      <td style={{ fontWeight: 600 }}>{fmtPrice(p.modalPrice)}</td>
                      <td>{fmtPrice(p.maxPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, alignItems: 'center' }}>
                <button className="btn-secondary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</button>
                <span style={{ fontSize: 14, color: '#666' }}>Page {page + 1} of {totalPages}</span>
                <button className="btn-secondary" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            )}
          </div>

          {/* ── Bottom Features: Watchlist, Alerts, News ── */}
          <div className="three-col-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 20 }}>
            
            {/* Watchlist */}
            <div className="panel section-box">
              <h3 className="section-heading"><Bookmark size={17}/> My Watchlist</h3>
              {selectedMarket && (
                <button className="btn-primary" style={{ marginBottom: 16, width: '100%' }} onClick={() => toggleWatch(selectedMarket)}>
                  {watchlist.includes(selectedMarket) ? 'Remove Current Market' : 'Save Current Market'}
                </button>
              )}
              {watchlist.length === 0 ? (
                <p style={{ color: '#666', fontSize: 14 }}>No markets saved.</p>
              ) : (
                <div className="watch-list">
                  {watchlist.map(id => {
                    const mkt = markets.find(m => m.id === id);
                    return (
                      <div key={id} className="watch-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                        <strong>{mkt?.name || `Market #${id}`}</strong>
                        <button className="remove-watch" onClick={() => toggleWatch(id)} style={{ color: '#E53935', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Alerts */}
            <div className="panel section-box">
              <h3 className="section-heading"><ShieldAlert size={17}/> Price Alerts</h3>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 12 }}>Get notified when prices hit your target.</p>
              <div className="alert-form">
                <label style={{ display: 'block', fontSize: 12, marginBottom: 4, fontWeight: 500 }}>Target Price (₹/kg)</label>
                <input 
                  type="number" 
                  value={alertPrice} 
                  onChange={e => setAlertPrice(e.target.value)} 
                  placeholder="e.g. 400"
                  className="filter-select"
                  style={{ marginBottom: 12, width: '100%', boxSizing: 'border-box' }}
                />
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => setAlertSet(true)}>
                  {alertSet ? 'Alert Saved ✓' : 'Set Alert'}
                </button>
              </div>
            </div>

            {/* Market News */}
            <div className="panel section-box">
              <h3 className="section-heading"><Newspaper size={17}/> Wool Market News</h3>
              <div className="news-placeholder" style={{ textAlign: 'center', padding: '30px 0', color: '#999' }}>
                <Newspaper size={32} color="#ccc" style={{ marginBottom: 10 }} />
                <p style={{ margin: '0 0 10px 0' }}>News integration pending.</p>
                <span className="badge" style={{ background: '#f0f0f0', color: '#666', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>Coming Soon</span>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
