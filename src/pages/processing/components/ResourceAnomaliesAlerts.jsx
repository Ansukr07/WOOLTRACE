import React from "react";
import { AlertTriangle, Sparkles, CheckCircle, Zap, Droplets, RefreshCw } from "lucide-react";
import "./ResourceAnomaliesAlerts.css";

const ANOMALIES_LIST = [
  {
    id: "ANO-01",
    stage: "DRYING",
    type: "ENERGY_SPIKE",
    title: "Thermal Dryer #01 Energy Spike Detected",
    batchId: "WT-HP-2026-00045",
    severity: "HIGH",
    impact: "0.62 kWh/kg (+55% above baseline)",
    time: "2 hours ago",
    cause: "Heating element coil #3 calibration drift causing continuous load draw.",
    action: "Calibrate chamber thermostat and set max heater duty cycle to 80%."
  },
  {
    id: "ANO-02",
    stage: "DYEING",
    type: "WATER_EXCEEDANCE",
    title: "Vessel Dyeing Rig #02 Water Rinse Overflow",
    batchId: "WT-KA-2026-00121",
    severity: "MEDIUM",
    impact: "12.0 L/kg (+20% above 10.0 L/kg target)",
    time: "5 hours ago",
    cause: "Manual triple rinse cycle triggered instead of automated counter-current rinse.",
    action: "Enforce automated PLC rinse sequence for all natural indigo batches."
  }
];

const RECOMMENDATIONS_LIST = [
  {
    id: "REC-01",
    category: "HEAT RECOVERY",
    title: "Install Dryer Exhaust Air-to-Water Exchanger",
    description: "Capture waste heat from thermal dryer conveyor #01 exhaust to pre-heat scouring water from 22C to 55C.",
    potentialSavings: "?18,400 / month",
    paybackMonths: 4.2,
    co2Reduction: "1.4 Tons CO2e/mo",
    icon: <Zap size={20} className="text-amber" />
  },
  {
    id: "REC-02",
    category: "WATER RECYCLING",
    title: "Scouring Bath #2 Ultrafiltration Loop",
    description: "Direct scouring rinse water through secondary micro-filtration to boost overall facility water reuse from 24.7% to 35.0%.",
    potentialSavings: "12,500 Liters / week",
    paybackMonths: 6.0,
    co2Reduction: "0.8 Tons CO2e/mo",
    icon: <Droplets size={20} className="text-blue" />
  },
  {
    id: "REC-03",
    category: "TARIFF OPTIMIZATION",
    title: "Shift Carding & Spinning to Off-Peak Hours",
    description: "Schedule high-horsepower mechanical carding between 22:00 and 06:00 to utilize green off-peak electricity tariffs.",
    potentialSavings: "?14,200 / month",
    paybackMonths: 1.0,
    co2Reduction: "0.5 Tons CO2e/mo",
    icon: <RefreshCw size={20} className="text-green" />
  }
];

const ResourceAnomaliesAlerts = () => {
  return (
    <div className="anomalies-recommendations-section grid-2-col">
      <div className="panel anomalies-card">
        <div className="panel-card-header">
          <h3><AlertTriangle className="text-amber" size={18} /> Active Consumption Anomalies</h3>
          <span className="alert-badge-count">{ANOMALIES_LIST.length} Alerts Active</span>
        </div>

        <div className="anomalies-list">
          {ANOMALIES_LIST.map((anomaly) => (
            <div key={anomaly.id} className={`anomaly-item severity-${anomaly.severity.toLowerCase()}`}>
              <div className="anomaly-top-row">
                <span className="anomaly-type-pill">{anomaly.stage} &bull; {anomaly.type}</span>
                <span className="anomaly-time">{anomaly.time}</span>
              </div>

              <h4 className="anomaly-title">{anomaly.title}</h4>
              <div className="anomaly-impact-tag">
                Impact: <strong>{anomaly.impact}</strong> &bull; Batch: <strong>{anomaly.batchId}</strong>
              </div>

              <p className="anomaly-cause"><strong>Root Cause:</strong> {anomaly.cause}</p>

              <div className="anomaly-action-box">
                <strong>Recommended Action:</strong> {anomaly.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel recommendations-card">
        <div className="panel-card-header">
          <h3><Sparkles className="text-purple" size={18} /> AI Sustainability & Eco Insights</h3>
          <span className="ai-verified-tag"><CheckCircle size={12} /> WoolTrace Eco Engine</span>
        </div>

        <div className="recommendations-list">
          {RECOMMENDATIONS_LIST.map((rec) => (
            <div key={rec.id} className="rec-item-card">
              <div className="rec-header">
                <div className="rec-icon-bg">{rec.icon}</div>
                <div className="rec-title-group">
                  <span className="rec-category">{rec.category}</span>
                  <h4>{rec.title}</h4>
                </div>
              </div>

              <p className="rec-description">{rec.description}</p>

              <div className="rec-metrics-footer">
                <div className="rec-stat">
                  <span>Est. Savings:</span>
                  <strong>{rec.potentialSavings}</strong>
                </div>
                <div className="rec-stat">
                  <span>Payback:</span>
                  <strong>{rec.paybackMonths} Mo</strong>
                </div>
                <div className="rec-stat">
                  <span>CO2 Reduction:</span>
                  <strong className="text-green">{rec.co2Reduction}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceAnomaliesAlerts;
