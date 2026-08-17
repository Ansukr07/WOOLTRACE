import re

file_path = '/home/jayy/sih/src/context/GlobalStateContext.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace broken helper string
old_helpers_pattern = r'const receiveProcessingBatch = [\s\S]*?const updateFacilityStatus = \(newStatus\) => \{\n    setProcessingFacility\(prev => \(\{ \.\.\.prev, status: newStatus \}\)\);\n  \};'

new_helpers_code = '''const receiveProcessingBatch = (batchId, receivedQty, discrepancyReason = '') => {
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        const expected = r.quantity || receivedQty;
        return {
          ...r,
          status: 'RECEIVED',
          receivedQuantity: receivedQty,
          expectedQuantity: expected,
          discrepancyReason,
          receivedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: 'RECEIVED AT PROCESSING UNIT',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Received',
      actor: 'Factory Receiver (Processing Unit Admin)',
      description: `Received ${receivedQty} KG at facility.${discrepancyReason ? ' Quantity Discrepancy logged: ' + discrepancyReason : ''}`
    });
  };

  const startProcessingOperation = (batchId, operation, operatorName, equipment, notes = '') => {
    const recordId = 'REC-2026-' + String(Math.floor(10000 + Math.random() * 90000));
    
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'PROCESSING',
          operation,
          operatorName,
          equipment,
          progressPct: 15,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    const newRecord = {
      id: recordId,
      recordId,
      batchId,
      processingUnitId: 'PU-01',
      operatorName: operatorName || 'Factory Operator',
      operation,
      inputQuantity: 400,
      status: 'IN_PROGRESS',
      startTime: new Date().toISOString(),
      equipment: equipment || 'Machine #01',
      notes
    };

    setProcessingRecords(prev => [newRecord, ...prev]);

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: `OPERATION STARTED: ${operation.toUpperCase()}`,
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'In Progress',
      actor: `${operatorName} (Processing Unit)`,
      description: `Operation ${operation} initiated using ${equipment}. ${notes}`
    });
  };

  const completeProcessingOperation = (batchId, outputQty, wasteQty = 0, outputBatchId = '', notes = '') => {
    const childId = outputBatchId || `${batchId}-P01`;

    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          outputQuantity: outputQty,
          wasteQuantity: wasteQty,
          outputBatchId: childId,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    setProcessingRecords(prev => prev.map(rec => {
      if (rec.batchId === batchId && rec.status === 'IN_PROGRESS') {
        return {
          ...rec,
          status: 'COMPLETED',
          outputQuantity: outputQty,
          wasteQuantity: wasteQty,
          outputBatchId: childId,
          completionTime: new Date().toISOString(),
          notes
        };
      }
      return rec;
    }));

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: 'PROCESSING COMPLETED',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Completed',
      actor: 'Factory Supervisor',
      description: `Processing completed. Output: ${outputQty} KG, Waste: ${wasteQty} KG. Created child output batch ${childId}.`
    });
  };

  const markProcessingReadyToShip = (batchId) => {
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'READY_TO_SHIP',
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: 'READY TO SHIP',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Ready',
      actor: 'Processing Unit Admin',
      description: `Batch verified and packed. Available in Outbound Dispatch Queue.`
    });
  };

  const dispatchProcessingBatch = (batchId, destination = 'Bengaluru Textile Unit', transportPartner = 'Rapid Farm Logistics', notes = '') => {
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'DISPATCHED',
          transportStatus: 'Dispatched to Next Stage',
          destination,
          transportPartner,
          dispatchedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    addTraceEvent(batchId, {
      stage: 'TRANSPORT',
      title: 'OUTBOUND DISPATCHED',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Dispatched',
      actor: 'Processing Unit Admin',
      description: `Dispatched to ${destination} via ${transportPartner}. ${notes}`
    });
  };

  const updateFacilityStatus = (newStatus) => {
    setProcessingFacility(prev => ({ ...prev, status: newStatus }));
  };'''

content = re.sub(old_helpers_pattern, new_helpers_code, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed GlobalStateContext helpers syntax successfully.")