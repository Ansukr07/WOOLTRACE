import React from 'react';
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, BarChart2, Calendar, ShieldCheck } from 'lucide-react';
import { getCommodityById } from '../../../services/market/cropCommodityRegistry';

export default function PriceTrendsTab({
  selectedCommodityId = 'WHEAT',
  timeframe,
  setTimeframe,
  priceTrendsData
}) {
  const commodity = getCommodityById(selectedCommodityId);
  const data = priceTrendsData?.data || [];
  const stats = priceTrendsData?.stats || {};

  return (
    <div>
      <div className="market-card" style={{ marginBottom: '20px' }}>
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">
              <BarChart2 size={20} />
              {commodity.name} · Price Trends & Market Signals
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Multi-Channel Traded History (APMC Mandi vs Processing Mill vs Institutional)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['7D', '30D', '3M', '6M', '1Y'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  background: timeframe === tf ? '#0B120D' : '#F8F8F3',
                  color: timeframe === tf ? '#FFFFFF' : '#0B120D',
                  border: '1px solid rgba(11,18,13,0.15)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: '#F8F8F3',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>CURRENT MODAL</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>₹{stats.currentPrice || commodity.basePricePerKg}/KG</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>PERIOD RANGE</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>₹{stats.minPrice || (commodity.basePricePerKg * 0.9)} - ₹{stats.maxPrice || (commodity.basePricePerKg * 1.1)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>PRICE CHANGE</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>
              {stats.changePercent >= 0 ? '+' : ''}{stats.changePercent || commodity.priceChange30d}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>TOTAL ARRIVALS</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>{stats.totalVolumeTonnes || 420} Tonnes</div>
          </div>
        </div>

        <div style={{ width: '100%', height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis yAxisId="price" orientation="left" tick={{ fill: '#6B7280', fontSize: 11 }} domain={['auto', 'auto']} unit="₹" />
              <YAxis yAxisId="volume" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 11 }} domain={[0, 'auto']} unit="T" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'volumeTonnes' ? `${value} Tonnes` : `₹${value}/KG`,
                  name === 'avgTradedPrice' ? 'Average Traded Price' :
                  name === 'mandiPrice' ? 'APMC Mandi Auction' :
                  name === 'processorPrice' ? 'Processor Mill Quote' :
                  name === 'institutionalPrice' ? 'Institutional Co-op' : 'Arrival Volume'
                ]}
              />
              <Legend />
              <Bar yAxisId="volume" dataKey="volumeTonnes" name="Arrival Volume (T)" fill="#BED5E5" opacity={0.6} radius={[4, 4, 0, 0]} />
              <Area yAxisId="price" type="monotone" dataKey="avgTradedPrice" name="Avg Traded Price" fill="#EDEDCE" stroke="#0B120D" strokeWidth={2} />
              <Line yAxisId="price" type="monotone" dataKey="processorPrice" name="Processor Mill" stroke="#0B120D" strokeDasharray="4 4" dot={false} />
              <Line yAxisId="price" type="monotone" dataKey="mandiPrice" name="Mandi Auction" stroke="#6B7280" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
