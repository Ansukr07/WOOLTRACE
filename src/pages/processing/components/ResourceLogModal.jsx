import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Droplets, Zap, Scale, FileText, CheckCircle } from "lucide-react";
import "./ResourceLogModal.css";

const ResourceLogModal = ({ isOpen, onClose, onSave, batches = [] }) => {
  const [batchId, setBatchId] = useState(batches[0]?.batchId || "WT-KA-2026-00124");
  const [stage, setStage] = useState("SCOURING");
  const [processedQtyKg, setProcessedQtyKg] = useState(450);
  const [waterLiters, setWaterLiters] = useState(3400);
  const [recycledWaterLiters, setRecycledWaterLiters] = useState(850);
  const [energyKwh, setEnergyKwh] = useState(130);
  const [yieldPct, setYieldPct] = useState(92.5);
  const [operator, setOperator] = useState("Ramesh Kumar");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const waterIntensity = processedQtyKg > 0 ? (waterLiters / processedQtyKg).toFixed(1) : 0;
  const energyIntensity = processedQtyKg > 0 ? (energyKwh / processedQtyKg).toFixed(2) : 0;
  const recycledPct = waterLiters > 0 ? ((recycledWaterLiters / waterLiters) * 100).toFixed(1) : 0;
  const estimatedCost = Math.round(waterLiters * 0.12 + energyKwh * 8.5);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: `RSL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      batchId,
      stage,
      stageName: stage === "SCOURING" ? "Wool Scouring & Washing" :
                 stage === "CARDING" ? "Carding & Combing" :
                 stage === "DYEING" ? "Natural Dyeing & Tinting" :
                 stage === "DRYING" ? "Thermal Convection Drying" : "Yarn Spinning",
      date: new Date().toISOString(),
      processedQtyKg: Number(processedQtyKg),
      waterLiters: Number(waterLiters),
      recycledWaterLiters: Number(recycledWaterLiters),
      waterIntensityLPerKg: Number(waterIntensity),
      energyKwh: Number(energyKwh),
      energyIntensityKwhPerKg: Number(energyIntensity),
      yieldPct: Number(yieldPct),
      costInr: estimatedCost,
      operator,
      status: Number(waterIntensity) > 10.0 || Number(energyIntensity) > 0.5 ? "WARNING" : "OPTIMAL",
      notes
    };
    onSave(newLog);
    onClose();
  };

  const modalContent = (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Log Resource & Energy Usage</h3>
            <p className="modal-subtitle">Record energy, water, and yield data for processing batch</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-row grid-2">
            <div className="form-group">
              <label>Select Batch ID</label>
              <select value={batchId} onChange={(e) => setBatchId(e.target.value)} required>
                {batches.map((b) => (
                  <option key={b.batchId || b.id} value={b.batchId || b.id}>
                    {b.batchId || b.id} - {b.woolType || "Wool Batch"} ({b.quantity || 400} KG)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Processing Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="SCOURING">Scouring & Washing</option>
                <option value="CARDING">Carding & Combing</option>
                <option value="DYEING">Natural Dyeing</option>
                <option value="DRYING">Thermal Drying</option>
                <option value="SPINNING">Yarn Spinning</option>
              </select>
            </div>
          </div>

          <div className="form-row grid-3">
            <div className="form-group">
              <label>Processed Weight (KG)</label>
              <input type="number" value={processedQtyKg} onChange={(e) => setProcessedQtyKg(e.target.value)} min="1" required />
            </div>
            <div className="form-group">
              <label>Water Used (Liters)</label>
              <input type="number" value={waterLiters} onChange={(e) => setWaterLiters(e.target.value)} min="0" required />
            </div>
            <div className="form-group">
              <label>Recycled Water (Liters)</label>
              <input type="number" value={recycledWaterLiters} onChange={(e) => setRecycledWaterLiters(e.target.value)} min="0" />
            </div>
          </div>

          <div className="form-row grid-3">
            <div className="form-group">
              <label>Energy Consumed (kWh)</label>
              <input type="number" value={energyKwh} onChange={(e) => setEnergyKwh(e.target.value)} min="0" required />
            </div>
            <div className="form-group">
              <label>Clean Yield (%)</label>
              <input type="number" step="0.1" value={yieldPct} onChange={(e) => setYieldPct(e.target.value)} min="10" max="100" required />
            </div>
            <div className="form-group">
              <label>Operator Name</label>
              <input type="text" value={operator} onChange={(e) => setOperator(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Operational Notes</label>
            <textarea rows="2" placeholder="Enter batch cycle observations or calibration notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="live-calculations-preview">
            <div className="calc-box"><span className="calc-label">Water Intensity:</span><strong className="calc-val">{waterIntensity} L/kg</strong></div>
            <div className="calc-box"><span className="calc-label">Energy Intensity:</span><strong className="calc-val">{energyIntensity} kWh/kg</strong></div>
            <div className="calc-box"><span className="calc-label">Recycling Rate:</span><strong className="calc-val">{recycledPct}%</strong></div>
            <div className="calc-box"><span className="calc-label">Est. Utility Cost:</span><strong className="calc-val">{"₹"}{estimatedCost}</strong></div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary"><CheckCircle size={16} /> Save Resource Log</button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ResourceLogModal;
