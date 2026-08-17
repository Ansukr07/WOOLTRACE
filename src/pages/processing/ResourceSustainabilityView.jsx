import React, { useState } from "react";
import { useGlobalState } from "../../context/GlobalStateContext";
import ResourceKPIGrid from "./components/ResourceKPIGrid";
import StageResourceAnalysis from "./components/StageResourceAnalysis";
import ResourceAnalyticsCharts from "./components/ResourceAnalyticsCharts";
import ResourceAnomaliesAlerts from "./components/ResourceAnomaliesAlerts";
import ResourceHistoryTable from "./components/ResourceHistoryTable";
import ResourceLogModal from "./components/ResourceLogModal";
import { Leaf, PlusCircle, RefreshCw, Layers, BarChart2, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import "./ResourceSustainabilityView.css";

const ResourceSustainabilityView = () => {
  const state = useGlobalState() || {};
  const {
    resourceLogs = [],
    logResourceUsage = () => {},
    waterReuseRate = 24.7,
    processingRequests = []
  } = state;

  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [showLogModal, setShowLogModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSaveLog = (newLog) => {
    logResourceUsage(newLog);
    setToastMessage(`Resource log ${newLog.id} successfully recorded for batch ${newLog.batchId}`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="sustainability-view-container animate-fade-up">
      <div className="sustainability-page-header panel">
        <div className="header-left-group">
          <div className="header-badge">
            <Leaf size={14} /> WoolTrace Resource & Eco Intelligence
          </div>
          <h1>Energy & Water Consumption Tracking</h1>
          <p>Real-time resource intensity monitoring, closed-loop water recycling, and facility efficiency analytics.</p>
        </div>
        <div className="header-right-actions">
          <button className="btn-secondary" onClick={() => setActiveTab("ANALYTICS")}>
            <BarChart2 size={16} /> Analytics
          </button>
          <button className="btn-primary" onClick={() => setShowLogModal(true)}>
            <PlusCircle size={16} /> + Log Resource Entry
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="sustainability-toast">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="sustainability-sub-tabs">
        <button
          className={`sub-tab-btn ${activeTab === "OVERVIEW" ? "active" : ""}`}
          onClick={() => setActiveTab("OVERVIEW")}
        >
          <Leaf size={16} /> Overview & KPIs
        </button>
        <button
          className={`sub-tab-btn ${activeTab === "STAGES" ? "active" : ""}`}
          onClick={() => setActiveTab("STAGES")}
        >
          <Layers size={16} /> Stage Analysis
        </button>
        <button
          className={`sub-tab-btn ${activeTab === "ANALYTICS" ? "active" : ""}`}
          onClick={() => setActiveTab("ANALYTICS")}
        >
          <BarChart2 size={16} /> Historical Charts
        </button>
        <button
          className={`sub-tab-btn ${activeTab === "ANOMALIES" ? "active" : ""}`}
          onClick={() => setActiveTab("ANOMALIES")}
        >
          <AlertTriangle size={16} /> Anomalies & AI Recommendations
        </button>
        <button
          className={`sub-tab-btn ${activeTab === "LOGS" ? "active" : ""}`}
          onClick={() => setActiveTab("LOGS")}
        >
          <FileText size={16} /> Consumption Logs
        </button>
      </div>

      {activeTab === "OVERVIEW" && (
        <>
          <ResourceKPIGrid logs={resourceLogs} waterReuseRate={waterReuseRate} />
          <StageResourceAnalysis />
          <ResourceAnomaliesAlerts />
          <ResourceHistoryTable logs={resourceLogs} onOpenLogModal={() => setShowLogModal(true)} />
        </>
      )}

      {activeTab === "STAGES" && (
        <>
          <StageResourceAnalysis />
          <ResourceHistoryTable logs={resourceLogs} onOpenLogModal={() => setShowLogModal(true)} />
        </>
      )}

      {activeTab === "ANALYTICS" && (
        <>
          <ResourceAnalyticsCharts />
          <ResourceKPIGrid logs={resourceLogs} waterReuseRate={waterReuseRate} />
        </>
      )}

      {activeTab === "ANOMALIES" && (
        <>
          <ResourceAnomaliesAlerts />
        </>
      )}

      {activeTab === "LOGS" && (
        <>
          <ResourceHistoryTable logs={resourceLogs} onOpenLogModal={() => setShowLogModal(true)} />
        </>
      )}

      <ResourceLogModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSave={handleSaveLog}
        batches={processingRequests}
      />
    </div>
  );
};

export default ResourceSustainabilityView;
