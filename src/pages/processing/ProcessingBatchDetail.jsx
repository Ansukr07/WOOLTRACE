import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import TraceabilityTimeline from '../../components/TraceabilityTimeline';
import { 
  ArrowLeft, Check, Play, Scissors, ShieldAlert, Award, Info, 
  Settings, Clock, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import './ProcessingBatchDetail.css';

const ProcessingBatchDetail = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const { 
    batches, certificates, 
    processingRequests, updateProcessingRequest,
    processingRecords, addProcessingRecord, updateProcessingRecord
  } = useGlobalState();

  const rawBatch = (batches || []).find(b => b.id === batchId);
  const cert = (certificates || []).find(c => c.batchId === batchId);

  const request = (processingRequests || []).find(r => r.batchId === batchId);
  
  const batchRecords = (processingRecords || []).filter(r => r.batchId === batchId);
  const activeRecord = batchRecords.find(r => r.status === 'IN_PROGRESS');

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [operationType, setOperationType] = useState('Sorting');
  const [inputQty, setInputQty] = useState(request ? request.quantity : 0);
  const [expectedOutput, setExpectedOutput] = useState(request ? request.quantity * 0.95 : 0);
  const [operatorName, setOperatorName] = useState('WoolCraft Processing Centre');
  const [equipmentName, setEquipmentName] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [sortedFine, setSortedFine] = useState(0);
  const [sortedMedium, setSortedMedium] = useState(0);
  const [sortedCoarse, setSortedCoarse] = useState(0);

  const [cleaningMethod, setCleaningMethod] = useState('Aqueous Scouring');
  const [moistureAfter, setMoistureAfter] = useState('12%');

  const [yarnType, setYarnType] = useState('Yarn 2/32');
  const [yarnCount, setYarnCount] = useState('32 Nm');

  const [dyeColor, setDyeColor] = useState('Indigo');
  const [dyeMethod, setDyeMethod] = useState('Vat Dyeing');
  const [colorCode, setColorCode] = useState('IND-402');

  const [actualOutput, setActualOutput] = useState(0);
  
  useEffect(() => {
    if (request) {
      setInputQty(request.quantity);
      setExpectedOutput(Number((request.quantity * 0.95).toFixed(1)));
    }
  }, [request]);

  useEffect(() => {
    if (activeRecord) {
      setActualOutput(activeRecord.inputQuantity);
    }
  }, [activeRecord]);

  if (!request) {
    return (
      <div className="processing-error-page" style={{ padding: '40px' }}>
        <button onClick={() => navigate('/processing')} className="btn-back">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="panel error-card" style={{ padding: '24px', textAlign: 'center', marginTop: '20px' }}>
          <ShieldAlert size={48} color="#FFAAA4" style={{ margin: '0 auto 12px' }} />
          <h2>Batch Request Not Found</h2>
          <p>The batch processing request for ID "{batchId}" could not be found or has not been requested.</p>
        </div>
      </div>
    );
  }

  const totalInputWeight = request.quantity;
  const currentFleeceQuantity = rawBatch ? rawBatch.quantity : request.quantity;

  const handleAcceptRequest = (accepted) => {
    if (accepted) {
      updateProcessingRequest(request.id, { status: 'ACCEPTED' });
    } else {
      updateProcessingRequest(request.id, { status: 'REJECTED' });
    }
    setShowAcceptModal(false);
  };

  const handleReceiveBatch = () => {
    updateProcessingRequest(request.id, { status: 'RECEIVED' });
    setShowReceiveModal(false);
  };

  const handleStartProcessing = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (Number(inputQty) <= 0) {
      setErrorMessage('Input quantity must be positive.');
      return;
    }
    if (Number(inputQty) > currentFleeceQuantity) {
      setErrorMessage(`Input quantity cannot exceed available batch quantity of ${currentFleeceQuantity} KG.`);
      return;
    }

    const opData = {};
    if (operationType === 'Sorting') {
      opData.fineWoolQty = Number(sortedFine);
      opData.mediumWoolQty = Number(sortedMedium);
      opData.coarseWoolQty = Number(sortedCoarse);
    } else if (operationType === 'Washing') {
      opData.cleaningMethod = cleaningMethod;
      opData.moistureAfter = moistureAfter;
    } else if (operationType === 'Spinning') {
      opData.yarnType = yarnType;
      opData.yarnCount = yarnCount;
    } else if (operationType === 'Dyeing') {
      opData.dyeColor = dyeColor;
      opData.dyeMethod = dyeMethod;
      opData.colorCode = colorCode;
    }

    const recordCount = (processingRecords || []).length;
    const newRecord = {
      id: `REC-2026-${String(recordCount + 1).padStart(5, '0')}`,
      batchId: batchId,
      processingRequestId: request.id,
      processingUnitId: 'PU-01',
      operatorName: operatorName,
      operation: operationType,
      inputQuantity: Number(inputQty),
      status: 'IN_PROGRESS',
      startTime: new Date().toISOString(),
      equipment: equipmentName,
      notes: notes,
      operationData: opData
    };

    addProcessingRecord(newRecord);
    updateProcessingRequest(request.id, { status: 'IN_PROGRESS' });
    
    setNotes('');
    setEquipmentName('');
    setShowStartModal(false);
  };

  const handleCompleteProcessing = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (Number(actualOutput) < 0) {
      setErrorMessage('Output quantity cannot be negative.');
      return;
    }
    if (Number(actualOutput) > activeRecord.inputQuantity) {
      setErrorMessage(`Output quantity cannot exceed input quantity of ${activeRecord.inputQuantity} KG.`);
      return;
    }

    const waste = activeRecord.inputQuantity - Number(actualOutput);
    const suffixNum = batchRecords.length;
    const outputBatchId = `${batchId}-P${String(suffixNum).padStart(2, '0')}`;

    updateProcessingRecord(activeRecord.id, {
      status: 'COMPLETED',
      outputQuantity: Number(actualOutput),
      wasteQuantity: waste,
      outputBatchId: outputBatchId,
      completionTime: new Date().toISOString()
    });

    const completedOps = [...batchRecords.filter(r => r.id !== activeRecord.id).map(r => r.operation), activeRecord.operation];
    const isAllCompleted = request.requestedOperations.every(op => completedOps.includes(op));

    if (isAllCompleted) {
      updateProcessingRequest(request.id, { status: 'COMPLETED' });
    } else {
      updateProcessingRequest(request.id, { status: 'RECEIVED' });
    }

    setShowCompleteModal(false);
  };

  return (
    <div className="processing-batch-detail">
      <div className="detail-navigation">
        <button onClick={() => navigate('/processing')} className="btn-back">
          <ArrowLeft size={16} /> Back to Queue
        </button>
        <div className="batch-status-header">
          <span className="batch-id-title">{batchId}</span>
          <span className={`status-pill ${request.status.toLowerCase()}`}>{request.status}</span>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-left">
          
          <div className="action-control-card panel">
            <h3>Workflow Action</h3>
            <p className="workflow-info">
              Current Step: <strong>{request.status.replace('_', ' ')}</strong>
            </p>

            {request.status === 'REQUESTED' && (
              <div className="action-row">
                <button className="btn-action btn-green" onClick={() => setShowAcceptModal(true)}>
                  Accept Processing Request
                </button>
                <button className="btn-action btn-outline-coral" onClick={() => handleAcceptRequest(false)}>
                  Reject Request
                </button>
              </div>
            )}

            {request.status === 'ACCEPTED' && (
              <div className="action-row">
                <button className="btn-action btn-primary" onClick={() => setShowReceiveModal(true)}>
                  Confirm Batch Physically Received
                </button>
              </div>
            )}

            {request.status === 'RECEIVED' && (
              <div className="action-row">
                <button className="btn-action btn-accent" onClick={() => setShowStartModal(true)}>
                  <Play size={16} /> Start Processing Operation
                </button>
              </div>
            )}

            {request.status === 'IN_PROGRESS' && activeRecord && (
              <div className="active-process-info">
                <div className="active-process-header">
                  <div className="spinner-indicator"></div>
                  <span>Processing: <strong>{activeRecord.operation}</strong></span>
                </div>
                <div className="active-process-details">
                  <div>Input Quantity: <strong>{activeRecord.inputQuantity} KG</strong></div>
                  <div>Started: <strong>{new Date(activeRecord.startTime).toLocaleTimeString()}</strong></div>
                  {activeRecord.equipment && <div>Equipment: <strong>{activeRecord.equipment}</strong></div>}
                </div>
                <button className="btn-action btn-green mt-4" onClick={() => setShowCompleteModal(true)}>
                  Complete Current Operation
                </button>
              </div>
            )}

            {request.status === 'COMPLETED' && (
              <div className="completed-success-card">
                <CheckCircle2 size={28} color="#166534" />
                <div>
                  <strong>All requested operations completed!</strong>
                  <p>The processed material is certified and traceable back to the farmer.</p>
                </div>
              </div>
            )}
          </div>

          <div className="batch-details-card panel">
            <h2>Batch Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Farmer Owner</span>
                <span className="value">{request.farmerName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Origin State</span>
                <span className="value">{request.origin}</span>
              </div>
              <div className="detail-item">
                <span className="label">Total Raw Quantity</span>
                <span className="value">{totalInputWeight} KG</span>
              </div>
              <div className="detail-item">
                <span className="label">Wool Type</span>
                <span className="value">{request.woolType}</span>
              </div>
              <div className="detail-item">
                <span className="label">Inspection Grade</span>
                <span className="value grade">{request.grade || 'Pending'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Quality Score</span>
                <span className="value">{cert ? `${cert.qualityScore}/100` : 'Pending'}</span>
              </div>
              <div className="detail-item full-width">
                <span className="label">Requested Operations</span>
                <div className="ops-pill-list">
                  {request.requestedOperations.map(op => (
                    <span key={op} className="op-pill">{op}</span>
                  ))}
                </div>
              </div>
              {request.message && (
                <div className="detail-item full-width">
                  <span className="label">Farmer Note</span>
                  <span className="value note-text">"{request.message}"</span>
                </div>
              )}
            </div>
          </div>

          <div className="processing-history-card panel">
            <h2>Processing History & Records</h2>
            {batchRecords.length === 0 ? (
              <p className="no-history-text">No operations recorded yet.</p>
            ) : (
              <div className="records-timeline">
                {batchRecords.map((rec) => {
                  const yieldVal = rec.outputQuantity ? ((rec.outputQuantity / rec.inputQuantity) * 100).toFixed(1) : null;
                  return (
                    <div key={rec.id} className={`timeline-record-item ${rec.status.toLowerCase()}`}>
                      <div className="record-header-row">
                        <span className="record-op-title">{rec.operation}</span>
                        <span className={`record-status-badge ${rec.status.toLowerCase()}`}>{rec.status}</span>
                      </div>
                      <div className="record-body-row">
                        <div>Input: <strong>{rec.inputQuantity} KG</strong></div>
                        {rec.outputQuantity && <div>Output: <strong>{rec.outputQuantity} KG</strong></div>}
                        {rec.wasteQuantity !== undefined && <div>Waste: <strong>{rec.wasteQuantity} KG</strong></div>}
                        {yieldVal && <div>Yield: <strong className="yield-hl">{yieldVal}%</strong></div>}
                      </div>
                      {rec.outputBatchId && (
                        <div className="record-output-batch">
                          Derived Batch ID: <span>{rec.outputBatchId}</span>
                        </div>
                      )}
                      {rec.notes && <div className="record-note">"{rec.notes}"</div>}
                      <div className="record-dates">
                        <span>Started: {new Date(rec.startTime).toLocaleString()}</span>
                        {rec.completionTime && <span>Completed: {new Date(rec.completionTime).toLocaleString()}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="detail-right">
          <TraceabilityTimeline batchId={batchId} />
        </div>
      </div>

      {showAcceptModal && (
        <div className="processing-modal-overlay">
          <div className="processing-modal">
            <div className="modal-header">
              <h3>Accept Processing Request</h3>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <p>Are you sure you want to accept this request to process batch <strong>{batchId}</strong>₹</p>
              <div className="requested-list-box">
                <strong>Requested Operations:</strong>
                <ul>
                  {request.requestedOperations.map(op => <li key={op}>{op}</li>)}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAcceptModal(false)}>Cancel</button>
              <button className="btn-green" onClick={() => handleAcceptRequest(true)}>Accept Request</button>
            </div>
          </div>
        </div>
      )}

      {showReceiveModal && (
        <div className="processing-modal-overlay">
          <div className="processing-modal">
            <div className="modal-header">
              <h3>Confirm Receipt</h3>
            </div>
            <div className="modal-body" style={{ padding: '20px' }}>
              <p>Confirm that the raw wool batch <strong>{batchId}</strong> weighing <strong>{request.quantity} KG</strong> has been physically received at your facility.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowReceiveModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleReceiveBatch}>Confirm Received</button>
            </div>
          </div>
        </div>
      )}

      {showStartModal && (
        <div className="processing-modal-overlay">
          <div className="processing-modal">
            <form onSubmit={handleStartProcessing}>
              <div className="modal-header">
                <h3>Start Processing Operation</h3>
              </div>
              <div className="modal-body" style={{ padding: '20px' }}>
                {errorMessage && <div className="modal-error-alert">{errorMessage}</div>}
                
                <div className="form-group">
                  <label>Operation Type</label>
                  <select 
                    value={operationType} 
                    onChange={(e) => {
                      setOperationType(e.target.value);
                      if (e.target.value === 'Sorting') {
                        setSortedFine(Math.round(request.quantity * 0.3));
                        setSortedMedium(Math.round(request.quantity * 0.65));
                      }
                    }}
                    style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
                  >
                    <option value="Sorting">Sorting</option>
                    <option value="Washing">Washing / Scouring</option>
                    <option value="Carding">Carding</option>
                    <option value="Spinning">Spinning</option>
                    <option value="Dyeing">Dyeing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Input Weight (KG)</label>
                  <input 
                    type="number" 
                    value={inputQty} 
                    onChange={(e) => setInputQty(Number(e.target.value))} 
                    required 
                    style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
                  />
                </div>

                {operationType === 'Sorting' && (
                  <div className="op-sub-form">
                    <h4>Sorting Output Breakdown (Expected)</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Fine Wool (KG)</label>
                        <input type="number" value={sortedFine} onChange={(e) => setSortedFine(Number(e.target.value))} style={{ width: '100%', padding: '6px' }} />
                      </div>
                      <div className="form-group">
                        <label>Medium Wool (KG)</label>
                        <input type="number" value={sortedMedium} onChange={(e) => setSortedMedium(Number(e.target.value))} style={{ width: '100%', padding: '6px' }} />
                      </div>
                      <div className="form-group">
                        <label>Coarse Wool (KG)</label>
                        <input type="number" value={sortedCoarse} onChange={(e) => setSortedCoarse(Number(e.target.value))} style={{ width: '100%', padding: '6px' }} />
                      </div>
                    </div>
                  </div>
                )}

                {operationType === 'Washing' && (
                  <div className="op-sub-form">
                    <h4>Washing details</h4>
                    <div className="form-group">
                      <label>Cleaning Method</label>
                      <input type="text" value={cleaningMethod} onChange={(e) => setCleaningMethod(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div className="form-group">
                      <label>Target Moisture % after drying</label>
                      <input type="text" value={moistureAfter} onChange={(e) => setMoistureAfter(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                  </div>
                )}

                {operationType === 'Spinning' && (
                  <div className="op-sub-form">
                    <h4>Spinning details</h4>
                    <div className="form-group">
                      <label>Yarn Type</label>
                      <input type="text" value={yarnType} onChange={(e) => setYarnType(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div className="form-group">
                      <label>Yarn Count (Nm/Ne)</label>
                      <input type="text" value={yarnCount} onChange={(e) => setYarnCount(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                  </div>
                )}

                {operationType === 'Dyeing' && (
                  <div className="op-sub-form">
                    <h4>Dyeing details</h4>
                    <div className="form-group">
                      <label>Dye Color / Name</label>
                      <input type="text" value={dyeColor} onChange={(e) => setDyeColor(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div className="form-group">
                      <label>Dye Method</label>
                      <input type="text" value={dyeMethod} onChange={(e) => setDyeMethod(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                    <div className="form-group">
                      <label>Color Code / Batch</label>
                      <input type="text" value={colorCode} onChange={(e) => setColorCode(e.target.value)} style={{ width: '100%', padding: '6px' }} />
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label>Operator / Facility Name</label>
                  <input type="text" value={operatorName} onChange={(e) => setOperatorName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label>Equipment Used</label>
                  <input type="text" value={equipmentName} placeholder="e.g. Sorter Machine XL" onChange={(e) => setEquipmentName(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </div>

                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label>Processing Notes</label>
                  <textarea value={notes} rows="3" onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowStartModal(false)}>Cancel</button>
                <button type="submit" className="btn-accent">Start Processing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCompleteModal && activeRecord && (
        <div className="processing-modal-overlay">
          <div className="processing-modal">
            <form onSubmit={handleCompleteProcessing}>
              <div className="modal-header">
                <h3>Complete Operation: {activeRecord.operation}</h3>
              </div>
              <div className="modal-body" style={{ padding: '20px' }}>
                {errorMessage && <div className="modal-error-alert">{errorMessage}</div>}
                <p>Record the final output weight after completing the operation.</p>
                
                <div className="form-group">
                  <label>Input Weight (KG)</label>
                  <input type="number" value={activeRecord.inputQuantity} disabled className="disabled-input" style={{ width: '100%', padding: '8px', marginBottom: '12px' }} />
                </div>

                <div className="form-group">
                  <label>Output Weight (KG)</label>
                  <input 
                    type="number" 
                    value={actualOutput} 
                    onChange={(e) => setActualOutput(Number(e.target.value))} 
                    required 
                    style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
                  />
                </div>

                <div className="yield-box">
                  Yield calculation: <strong>{((actualOutput / activeRecord.inputQuantity) * 100 || 0).toFixed(1)}%</strong>
                  <br />
                  Waste weight: <strong>{Math.max(0, activeRecord.inputQuantity - actualOutput)} KG</strong>
                </div>

                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label>Additional Notes / Report</label>
                  <textarea value={notes} rows="3" onChange={(e) => setNotes(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCompleteModal(false)}>Cancel</button>
                <button type="submit" className="btn-green">Complete & Update Traceability</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingBatchDetail;
