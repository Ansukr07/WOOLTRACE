import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import {
  ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function PriceTrendsTab({ trendPeriod, setTrendPeriod, trendResult }) {
  return (
    <div>
      <div className="market-card" style={{ marginBottom: '24px' }}>
        <div className="panel-header-row">
          <h3 className="panel-title">
            <TrendingUp size={20} />
            Multi-Channel Price Trends & Volume History
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['7D', '30D', '3M', '6M', '1Y'].map(p => (
              <button
                key={p}
                onClick={() => setTrendPeriod(p)}
                style={{
                  background: trendPeriod === p ? '#0B120D' : '#F8F8F3',
                  color: trendPeriod === p ? '#FFFFFF' : '#0B120D',
                  border: '1px solid rgba(11,18,13,0.15)',
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: '360px', width: '100%', marginTop: '16px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendResult.data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis yAxisId="price" orientation="left" tick={{ fill: '#6B7280', fontSize: 11 }} domain={['dataMin - 20', 'dataMax + 20']} />
              <YAxis yAxisId="volume" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Tooltip
                formatter={(val, name) => [name === 'Arrival Volume (Tonnes)' ? `${val} T` : `₹${val}/KG`, name]}
                contentStyle={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}
              />
              <Legend />
              <Bar yAxisId="volume" dataKey="volumeTonnes" name="Arrival Volume (Tonnes)" fill="#BED5E5" opacity={0.6} />
              <Area yAxisId="price" type="monotone" dataKey="mandiPrice" name="Nearby APMC Mandi" fill="#EDEDCE" stroke="#0B120D" strokeWidth={2} />
              <Line yAxisId="price" type="monotone" dataKey="processorPrice" name="Processing Mill Direct" stroke="#0B120D" strokeWidth={2.5} dot={false} />
              <Line yAxisId="price" type="monotone" dataKey="institutionalPrice" name="Institutional / Export" stroke="#0B120D" strokeWidth={2.5} strokeDasharray="4 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.08)',
          borderRadius: '10px', padding: '16px', marginTop: '16px', display: 'flex', gap: '14px', alignItems: 'center'
        }}>
          <Sparkles size={24} color="#0B120D" />
          <div style={{ fontSize: '13px', color: '#334155' }}>
            <strong>Data-Driven Trend Insight:</strong> {trendResult.stats.summaryText} Current processor direct quotes maintain an average premium of +₹28/KG over APMC baseline arrivals due to verified fiber clean yield guarantees.
          </div>
        </div>
      </div>
    </div>
  );
}