import React, { useState } from "react";
import { Layers, Droplets, Zap, Scale, CheckCircle, AlertTriangle } from "lucide-react";
import "./StageResourceAnalysis.css";

const STAGE_DATA = [
  {
    id: "SCOURING",
    name: "Wool Scouring & Washing",
    description: "Raw wool immersion, dirt removal & aqueous grease extraction.",
    waterLiters: 3295,
    waterIntensity: 7.7,
    waterBenchmark: 8.0,
    recycledWaterPct: 24.7,
    energyKwh: 120,
    energyIntensity: 0.28,
    energyBenchmark: 0.30,
    yieldPct: 92.4,
    efficiencyScore: 94,
    status: "OPTIMAL",
    primaryEquipment: "Industrial Scouring Line #1",
    recommendation: "Maintain hot water counter-flow recirculation to sustain 24.7% recycling rate."
  },
  {
    id: "CARDING",
    name: "Carding & Combing",
    description: "Mechanical fiber alignment and burr/vegetable matter separation.",
    waterLiters: 1950,
    waterIntensity: 3.0,
    waterBenchmark: 3.5,
    recycledWaterPct: 24.6,
    energyKwh: 234,
    energyIntensity: 0.36,
    energyBenchmark: 0.35,
    yieldPct: 94.1,
    efficiencyScore: 91,
    status: "OPTIMAL",
    primaryEquipment: "High-Speed Carding Machine #03",
    recommendation: "Inspect roller friction calibration to lower energy consumption by ~0.02 kWh/kg."
  },
  {
    id: "DYEING",
    name: "Natural Dyeing & Tinting",
    description: "Aqueous immersion dyeing using botanical & non-toxic pigments.",
    waterLiters: 4200,
    waterIntensity: 12.0,
    waterBenchmark: 10.0,
    recycledWaterPct: 26.1,
    energyKwh: 185,
    energyIntensity: 0.53,
    energyBenchmark: 0.45,
    yieldPct: 91.8,
    efficiencyScore: 78,
    status: "WARNING",
    primaryEquipment: "Vessel Dyeing Rig #02",
    recommendation: "Water intensity exceeded benchmark by 2.0 L/kg. Optimize rinse cycle count."
  },
  {
    id: "DRYING",
    name: "Thermal Convection Drying",
    description: "Moisture reduction of scoured fleece to baseline 12-14%.",
    waterLiters: 250,
    waterIntensity: 0.5,
    waterBenchmark: 0.6,
    recycledWaterPct: 0,
    energyKwh: 310,
    energyIntensity: 0.62,
    energyBenchmark: 0.40,
    yieldPct: 98.2,
    efficiencyScore: 68,
    status: "ANOMALY",
    primaryEquipment: "Conveyor Thermal Dryer #01",
    recommendation: "Chamber heater #3 calibration defect causing 55% energy surge. Schedule maintenance."
  },
  {
    id: "SPINNING",
    name: "Yarn Spinning & Winding",
    description: "Drafting, twisting and spooling clean fleece into processing yarn.",
    waterLiters: 480,
    waterIntensity: 0.8,
    waterBenchmark: 1.0,
    recycledWaterPct: 25.0,
    energyKwh: 168,
    energyIntensity: 0.28,
    energyBenchmark: 0.30,
    yieldPct: 95.6,
    efficiencyScore: 96,
    status: "OPTIMAL",
    primaryEquipment: "Ring Spinning Frame #04",
    recommendation: "Operating on green solar microgrid tariff. Peak efficiency achieved."
  }
];

const StageResourceAnalysis = () => {
  const [selectedStageId, setSelectedStageId] = useState("SCOURING");
  const activeStage = STAGE_DATA.find(s => s.id === selectedStageId) || STAGE_DATA[0];

  return (
    <div className="stage-analysis-container panel">
      <div className="panel-header-custom">
        <div>
          <h3><Layers size={18} /> Stage-by-Stage Resource & Intensity Breakdown</h3>
          <p className="panel-sub">Analyze water, energy, and yield efficiency across each processing stage</p>
        </div>
      </div>

      <div className="stage-tabs-row">
        {STAGE_DATA.map((stage) => (
          <button
            key={stage.id}
            className={`stage-tab-btn ${selectedStageId === stage.id ? "active" : ""}`}
            onClick={() => setSelectedStageId(stage.id)}
          >
            <span className="stage-tab-name">{stage.name}</span>
            <span className={`stage-status-badge status-${stage.status.toLowerCase()}`}>
              {stage.status}
            </span>
          </button>
        ))}
      </div>

      <div className="stage-detail-card">
        <div className="stage-detail-header">
          <div className="stage-title-group">
            <h4>{activeStage.name}</h4>
            <p>{activeStage.description}</p>
            <div className="stage-equipment-tag">
              Equipment: <strong>{activeStage.primaryEquipment}</strong>
            </div>
          </div>
          <div className="stage-score-box">
            <div className="score-number">{activeStage.efficiencyScore}<span>/100</span></div>
            <div className="score-label">Efficiency Index</div>
          </div>
        </div>

        <div className="stage-metrics-grid">
          <div className="stage-metric-box">
            <div className="metric-box-title"><Droplets className="text-blue" size={16} /> Water Usage & Intensity</div>
            <div className="metric-box-value">{activeStage.waterLiters.toLocaleString()} L</div>
            <div className="metric-box-sub">Intensity: <strong>{activeStage.waterIntensity} L/kg</strong> <span className="benchmark-text">(Target &le; {activeStage.waterBenchmark})</span></div>
            <div className="progress-bar-wrapper">
              <div className={`progress-fill ${activeStage.waterIntensity > activeStage.waterBenchmark ? "over" : "good"}`} style={{ width: `${Math.min(100, (activeStage.waterIntensity / (activeStage.waterBenchmark * 1.5)) * 100)}%` }}></div>
            </div>
            <div className="metric-box-footer"><span>Recycled Water: <strong>{activeStage.recycledWaterPct}%</strong></span></div>
          </div>

          <div className="stage-metric-box">
            <div className="metric-box-title"><Zap className="text-amber" size={16} /> Energy Usage & Intensity</div>
            <div className="metric-box-value">{activeStage.energyKwh.toLocaleString()} kWh</div>
            <div className="metric-box-sub">Intensity: <strong>{activeStage.energyIntensity} kWh/kg</strong> <span className="benchmark-text">(Target &le; {activeStage.energyBenchmark})</span></div>
            <div className="progress-bar-wrapper">
              <div className={`progress-fill ${activeStage.energyIntensity > activeStage.energyBenchmark ? "over" : "good"}`} style={{ width: `${Math.min(100, (activeStage.energyIntensity / (activeStage.energyBenchmark * 1.5)) * 100)}%` }}></div>
            </div>
            <div className="metric-box-footer"><span>Power Source: <strong>Grid + Solar</strong></span></div>
          </div>

          <div className="stage-metric-box">
            <div className="metric-box-title"><Scale className="text-green" size={16} /> Processing Yield</div>
            <div className="metric-box-value">{activeStage.yieldPct}%</div>
            <div className="metric-box-sub">Clean Wool Output Quality</div>
            <div className="progress-bar-wrapper">
              <div className="progress-fill good" style={{ width: `${activeStage.yieldPct}%` }}></div>
            </div>
            <div className="metric-box-footer"><span>Waste Retention: <strong>{(100 - activeStage.yieldPct).toFixed(1)}%</strong></span></div>
          </div>
        </div>

        <div className={`stage-recommendation-alert alert-${activeStage.status.toLowerCase()}`}>
          <div className="alert-icon-col">
            {activeStage.status === "OPTIMAL" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div className="alert-content-col">
            <strong>Stage Optimization Insight:</strong>
            <p>{activeStage.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageResourceAnalysis;
