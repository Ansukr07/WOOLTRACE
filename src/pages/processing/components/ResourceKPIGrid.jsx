import React from "react";
import { Droplets, Zap, RefreshCw, Scale, DollarSign, Leaf, TrendingDown, TrendingUp } from "lucide-react";
import "./ResourceKPIGrid.css";

const ResourceKPIGrid = ({ logs = [], waterReuseRate = 24.7 }) => {
  const totalWater = logs.reduce((sum, l) => sum + (l.waterLiters || 0), 0) || 12175;
  const totalEnergy = logs.reduce((sum, l) => sum + (l.energyKwh || 0), 0) || 1017;
  const totalProcessedKg = logs.reduce((sum, l) => sum + (l.processedQtyKg || 0), 0) || 2528;
  const totalCost = logs.reduce((sum, l) => sum + (l.costInr || 0), 0) || 11352;
  const totalRecycledWater = logs.reduce((sum, l) => sum + (l.recycledWaterLiters || 0), 0) || 2515;

  const avgWaterIntensity = totalProcessedKg > 0 ? (totalWater / totalProcessedKg).toFixed(1) : "7.7";
  const avgEnergyIntensity = totalProcessedKg > 0 ? (totalEnergy / totalProcessedKg).toFixed(2) : "0.28";
  const avgYield = logs.length > 0 ? (logs.reduce((sum, l) => sum + (l.yieldPct || 0), 0) / logs.length).toFixed(1) : "92.4";
  const costPerKg = totalProcessedKg > 0 ? (totalCost / totalProcessedKg).toFixed(2) : "4.49";
  const co2FootprintKg = (totalEnergy * 0.82 + (totalWater - totalRecycledWater) * 0.0003).toFixed(1);

  return (
    <div className="resource-kpi-grid">
      <div className="resource-kpi-card water-card">
        <div className="kpi-header">
          <div className="kpi-icon-wrapper water-icon"><Droplets size={22} /></div>
          <span className="kpi-badge water-badge"><TrendingDown size={12} style={{ marginRight: 4 }} /> -4.2% vs avg</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-label">TOTAL WATER CONSUMPTION</div>
          <div className="kpi-value">{totalWater.toLocaleString()} <span className="kpi-unit">Liters</span></div>
          <div className="kpi-sub-value">Intensity: <strong>{avgWaterIntensity} L/kg</strong> <span className="kpi-benchmark">(Target &le; 8.0 L/kg)</span></div>
        </div>
        <div className="kpi-footer">
          <span>Recycled: <strong>{totalRecycledWater.toLocaleString()} L</strong></span>
          <span className="kpi-dot-status optimal">Optimal Line</span>
        </div>
      </div>

      <div className="resource-kpi-card energy-card">
        <div className="kpi-header">
          <div className="kpi-icon-wrapper energy-icon"><Zap size={22} /></div>
          <span className="kpi-badge energy-badge"><TrendingDown size={12} style={{ marginRight: 4 }} /> -2.8% vs avg</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-label">TOTAL ENERGY CONSUMPTION</div>
          <div className="kpi-value">{totalEnergy.toLocaleString()} <span className="kpi-unit">kWh</span></div>
          <div className="kpi-sub-value">Intensity: <strong>{avgEnergyIntensity} kWh/kg</strong> <span className="kpi-benchmark">(Target &le; 0.35 kWh/kg)</span></div>
        </div>
        <div className="kpi-footer">
          <span>Thermal/Electric: <strong>45% / 55%</strong></span>
          <span className="kpi-dot-status optimal">Eco Tariff</span>
        </div>
      </div>

      <div className="resource-kpi-card recycling-card">
        <div className="kpi-header">
          <div className="kpi-icon-wrapper recycling-icon"><RefreshCw size={22} /></div>
          <span className="kpi-badge success-badge"><TrendingUp size={12} style={{ marginRight: 4 }} /> +3.5% recycled</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-label">WATER REUSE & RECYCLING</div>
          <div className="kpi-value">{waterReuseRate}% <span className="kpi-unit">Efficiency</span></div>
          <div className="kpi-sub-value">Closed Loop: <strong>Scouring Bath #2</strong></div>
        </div>
        <div className="kpi-footer">
          <span>Effluent Savings: <strong>{totalRecycledWater.toLocaleString()} L</strong></span>
          <span className="kpi-dot-status optimal">Zero Liquid Goal</span>
        </div>
      </div>

      <div className="resource-kpi-card yield-card">
        <div className="kpi-header">
          <div className="kpi-icon-wrapper yield-icon"><Scale size={22} /></div>
          <span className="kpi-badge success-badge"><TrendingUp size={12} style={{ marginRight: 4 }} /> +1.2% yield</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-label">AVERAGE PROCESSING YIELD</div>
          <div className="kpi-value">{avgYield}% <span className="kpi-unit">Clean Wool</span></div>
          <div className="kpi-sub-value">Processed: <strong>{totalProcessedKg.toLocaleString()} KG Raw</strong></div>
        </div>
        <div className="kpi-footer">
          <span>Waste Loss: <strong>{(100 - parseFloat(avgYield)).toFixed(1)}%</strong></span>
          <span className="kpi-dot-status optimal">Grade A Clean</span>
        </div>
      </div>

      <div className="resource-kpi-card cost-card">
        <div className="kpi-header">
          <div className="kpi-icon-wrapper cost-icon"><DollarSign size={22} /></div>
          <span className="kpi-badge neutral-badge">Utility Cost</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-label">TOTAL UTILITY COST</div>
          <div className="kpi-value">{"₹"}{totalCost.toLocaleString()}</div>
          <div className="kpi-sub-value">Unit Overhead: <strong>{"₹"}{costPerKg}/kg</strong></div>
        </div>
        <div className="kpi-footer">
          <span>Water/Power Ratio: <strong>32% / 68%</strong></span>
          <span className="kpi-dot-status optimal">Budget Approved</span>
        </div>
      </div>

      <div className="resource-kpi-card eco-card">
        <div className="kpi-header">
          <div className="kpi-icon-wrapper eco-icon"><Leaf size={22} /></div>
          <span className="kpi-badge eco-badge">Sustainability</span>
        </div>
        <div className="kpi-body">
          <div className="kpi-label">CARBON FOOTPRINT</div>
          <div className="kpi-value">{co2FootprintKg} <span className="kpi-unit">kg CO&#8208;e</span></div>
          <div className="kpi-sub-value">Per KG Wool: <strong>{(parseFloat(co2FootprintKg) / (totalProcessedKg || 1)).toFixed(2)} kg CO&#8208;e/kg</strong></div>
        </div>
        <div className="kpi-footer">
          <span>Renewables Share: <strong>38% Solar</strong></span>
          <span className="kpi-dot-status optimal">Verified Green</span>
        </div>
      </div>
    </div>
  );
};

export default ResourceKPIGrid;
