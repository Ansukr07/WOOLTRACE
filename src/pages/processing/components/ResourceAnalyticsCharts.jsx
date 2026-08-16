import React, { useState } from "react";
import {
  ResponsiveContainer, AreaChart, BarChart, PieChart, Area, Bar, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { BarChart2, TrendingUp } from "lucide-react";
import "./ResourceAnalyticsCharts.css";

const TREND_DATA = [
  { date: "10 Aug", waterLiters: 2800, energyKwh: 210, waterIntensity: 7.8, energyIntensity: 0.29 },
  { date: "11 Aug", waterLiters: 3100, energyKwh: 245, waterIntensity: 8.1, energyIntensity: 0.31 },
  { date: "12 Aug", waterLiters: 2950, energyKwh: 220, waterIntensity: 7.6, energyIntensity: 0.28 },
  { date: "13 Aug", waterLiters: 3400, energyKwh: 260, waterIntensity: 7.9, energyIntensity: 0.30 },
  { date: "14 Aug", waterLiters: 4200, energyKwh: 310, waterIntensity: 9.2, energyIntensity: 0.42 },
  { date: "15 Aug", waterLiters: 3295, energyKwh: 234, waterIntensity: 7.7, energyIntensity: 0.28 },
];

const BATCH_INTENSITY_DATA = [
  { batch: "WT-KA-00124", waterIntensity: 7.7, energyIntensity: 0.28, targetWater: 8.0 },
  { batch: "WT-RJ-00089", waterIntensity: 6.8, energyIntensity: 0.36, targetWater: 8.0 },
  { batch: "WT-KA-00121", waterIntensity: 12.0, energyIntensity: 0.53, targetWater: 8.0 },
  { batch: "WT-HP-00045", waterIntensity: 4.2, energyIntensity: 0.62, targetWater: 8.0 },
  { batch: "WT-MH-00078", waterIntensity: 5.1, energyIntensity: 0.28, targetWater: 8.0 },
];

const STAGE_COST_SHARE = [
  { name: "Scouring", value: 38, color: "#0284C7" },
  { name: "Carding", value: 22, color: "#0B120D" },
  { name: "Dyeing", value: 25, color: "#D97706" },
  { name: "Drying", value: 10, color: "#DC2626" },
  { name: "Spinning", value: 5, color: "#16A34A" },
];

const ResourceAnalyticsCharts = () => {
  const [timeRange, setTimeRange] = useState("WEEKLY");
  const [metricMode, setMetricMode] = useState("CONSUMPTION");

  return (
    <div className="resource-charts-container">
      <div className="charts-main-header panel">
        <div className="charts-title-area">
          <h3><BarChart2 size={18} /> Historical Energy & Water Performance Analytics</h3>
          <p>Track consumption trends, intensity baselines, and resource cost share across operations</p>
        </div>
        <div className="charts-filter-controls">
          <div className="filter-pill-group">
            <button
              className={`pill-btn ${metricMode === "CONSUMPTION" ? "active" : ""}`}
              onClick={() => setMetricMode("CONSUMPTION")}
            >
              Total Volumes
            </button>
            <button
              className={`pill-btn ${metricMode === "INTENSITY" ? "active" : ""}`}
              onClick={() => setMetricMode("INTENSITY")}
            >
              Intensity Ratios
            </button>
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="charts-select-range"
          >
            <option value="DAILY">Last 24 Hours</option>
            <option value="WEEKLY">Last 7 Days</option>
            <option value="MONTHLY">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="charts-grid-row">
        <div className="panel chart-card">
          <div className="chart-card-header">
            <div>
              <h4>Daily Water & Energy Consumption Trend</h4>
              <span className="chart-subtitle">Water (Liters) vs Energy (kWh) over time</span>
            </div>
            <span className="trend-pill positive"><TrendingUp size={12} /> -3.4% Eco Savings</span>
          </div>
          <div className="chart-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              {metricMode === "CONSUMPTION" ? (
                <AreaChart data={TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B120D" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0B120D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#0284C7" fontSize={12} unit=" L" />
                  <YAxis yAxisId="right" orientation="right" stroke="#0B120D" fontSize={12} unit=" kWh" />
                  <Tooltip contentStyle={{ background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(11,18,13,0.1)" }} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="waterLiters" name="Water (L)" stroke="#0284C7" fillOpacity={1} fill="url(#colorWater)" />
                  <Area yAxisId="right" type="monotone" dataKey="energyKwh" name="Energy (kWh)" stroke="#0B120D" fillOpacity={1} fill="url(#colorEnergy)" />
                </AreaChart>
              ) : (
                <AreaChart data={TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#0284C7" fontSize={12} unit=" L/kg" />
                  <YAxis yAxisId="right" orientation="right" stroke="#0B120D" fontSize={12} unit=" kWh/kg" />
                  <Tooltip contentStyle={{ background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(11,18,13,0.1)" }} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="waterIntensity" name="Water Intensity (L/kg)" stroke="#0284C7" fill="#E0F2FE" />
                  <Area yAxisId="right" type="monotone" dataKey="energyIntensity" name="Energy Intensity (kWh/kg)" stroke="#0B120D" fill="#EDEDCE" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel chart-card">
          <div className="chart-card-header">
            <div>
              <h4>Batch Intensity vs WoolTrace Baseline Target</h4>
              <span className="chart-subtitle">Water Intensity (L/kg) per processed batch</span>
            </div>
          </div>
          <div className="chart-body" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BATCH_INTENSITY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="batch" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#475569" fontSize={12} unit=" L/kg" />
                <Tooltip contentStyle={{ background: "#FFFFFF", borderRadius: 8, border: "1px solid rgba(11,18,13,0.1)" }} />
                <Legend />
                <Bar dataKey="waterIntensity" name="Actual L/kg" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="targetWater" name="Target Baseline (8.0 L/kg)" fill="#DDFF86" stroke="#0B120D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="charts-grid-row second-row">
        <div className="panel chart-card">
          <div className="chart-card-header">
            <div>
              <h4>Resource Utility Cost Share by Stage</h4>
              <span className="chart-subtitle">Percentage share of water and electricity bill per operation</span>
            </div>
          </div>
          <div className="pie-chart-body" style={{ height: 240, display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={STAGE_COST_SHARE} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {STAGE_COST_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend-list">
              {STAGE_COST_SHARE.map((item) => (
                <div key={item.name} className="legend-item-row">
                  <span className="legend-dot" style={{ background: item.color }}></span>
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-pct">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAnalyticsCharts;
