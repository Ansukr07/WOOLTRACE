import React, { useState } from "react";
import { Search, Filter, Download, Droplets, Zap, Scale, CheckCircle, AlertTriangle, AlertCircle, FileText } from "lucide-react";
import "./ResourceHistoryTable.css";

const ResourceHistoryTable = ({ logs = [], onOpenLogModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredLogs = logs.filter(log => {
    if (!log) return false;
    const query = searchQuery.toLowerCase();
    const matchesSearch = (log.batchId || "").toLowerCase().includes(query) ||
                          (log.operator || "").toLowerCase().includes(query) ||
                          (log.stageName || "").toLowerCase().includes(query);

    let matchesStage = true;
    if (stageFilter !== "ALL") matchesStage = log.stage === stageFilter;

    let matchesStatus = true;
    if (statusFilter !== "ALL") matchesStatus = log.status === statusFilter;

    return matchesSearch && matchesStage && matchesStatus;
  });

  const exportCSV = () => {
    const headers = "Record ID,Batch ID,Stage,Date,Processed Qty (kg),Water (L),Water Intensity (L/kg),Energy (kWh),Energy Intensity (kWh/kg),Yield (%),Cost (INR),Status,Operator\n";
    const rows = filteredLogs.map(l => 
      `${l.id},${l.batchId},${l.stage},${l.date},${l.processedQtyKg},${l.waterLiters},${l.waterIntensityLPerKg},${l.energyKwh},${l.energyIntensityKwhPerKg},${l.yieldPct},${l.costInr},${l.status},"${l.operator}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wooltrace_resource_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="resource-history-container panel">
      <div className="panel-header-row">
        <div>
          <h3><FileText size={18} /> Resource & Energy Consumption History</h3>
          <p className="panel-sub">Auditable log of energy, water, and yield records per batch stage</p>
        </div>
        <div className="table-header-actions">
          <button className="btn-secondary btn-sm" onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>
          <button className="btn-primary btn-sm" onClick={onOpenLogModal}>
            + Log Consumption Entry
          </button>
        </div>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by Batch ID, Stage, or Operator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="ALL">All Stages</option>
            <option value="SCOURING">Scouring & Washing</option>
            <option value="CARDING">Carding & Combing</option>
            <option value="DYEING">Natural Dyeing</option>
            <option value="DRYING">Thermal Drying</option>
            <option value="SPINNING">Yarn Spinning</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="OPTIMAL">Optimal Baseline</option>
            <option value="WARNING">Warning Ratios</option>
            <option value="ANOMALY">Anomaly Spike</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="resource-table">
          <thead>
            <tr>
              <th>Log ID / Date</th>
              <th>Batch ID</th>
              <th>Stage</th>
              <th>Processed (KG)</th>
              <th>Water (L)</th>
              <th>Water L/kg</th>
              <th>Energy (kWh)</th>
              <th>Energy kWh/kg</th>
              <th>Yield (%)</th>
              <th>COST ({"₹"})</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center", padding: "40px", color: "#64748B" }}>
                  <AlertCircle size={28} style={{ margin: "0 auto 8px", display: "block", opacity: 0.5 }} />
                  No resource consumption records found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <strong>{log.id}</strong>
                    <div className="log-date">{new Date(log.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </td>
                  <td>
                    <span className="batch-pill">{log.batchId}</span>
                  </td>
                  <td>
                    <strong>{log.stageName || log.stage}</strong>
                  </td>
                  <td>{log.processedQtyKg.toLocaleString()} KG</td>
                  <td>
                    <span className="text-blue font-semibold">{log.waterLiters.toLocaleString()} L</span>
                    {log.recycledWaterLiters > 0 && (
                      <div className="sub-text">({log.recycledWaterLiters} L recycled)</div>
                    )}
                  </td>
                  <td>
                    <strong className={log.waterIntensityLPerKg > 10.0 ? "text-red" : ""}>
                      {log.waterIntensityLPerKg} L/kg
                    </strong>
                  </td>
                  <td>
                    <span className="font-semibold">{log.energyKwh.toLocaleString()} kWh</span>
                  </td>
                  <td>
                    <strong className={log.energyIntensityKwhPerKg > 0.5 ? "text-red" : ""}>
                      {log.energyIntensityKwhPerKg} kWh/kg
                    </strong>
                  </td>
                  <td>
                    <span className="badge-yield">{log.yieldPct}%</span>
                  </td>
                  <td>
                    <strong>{"₹"}{log.costInr.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className={`status-pill status-${log.status.toLowerCase()}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceHistoryTable;
