file_path = '/home/jayy/sih/src/context/GlobalStateContext.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add processing facility state and functions if not present
helpers_code = '''
  // -- Processing Unit Profile & Facility State -----------------------------
  const [processingFacility, setProcessingFacility] = useState({
    id: 'PU-01',
    name: 'WoolCraft Processing Centre',
    address: 'Mysuru Industrial Zone, Mysuru, Karnataka',
    lat: 12.2958,
    lng: 76.6394,
    verified: true,
    status: 'ACCEPTING_BATCHES',
    totalCapacityKg: 5000,
    currentWorkloadKg: 3420,
    operatingHours: '08:00 - 20:00 IST',
    activeOperators: 8,
    activeEquipment: 12,
    operations: ['Sorting', 'Washing', 'Carding', 'Spinning', 'Dyeing']
  });

  const receiveProcessingBatch = (batchId, receivedQty, discrepancyReason = '') => {
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
      description: Received  KG at facility.
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
      title: OPERATION STARTED: ,
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'In Progress',
      actor: ${operatorName} (Processing Unit),
      description: Operation  initiated using . 
    });
  };

  const completeProcessingOperation = (batchId, outputQty, wasteQty = 0, outputBatchId = '', notes = '') => {
    const childId = outputBatchId || ${batchId}-P01;

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
      description: Processing completed. Output:  KG, Waste:  KG. Created child output batch .
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
      description: Batch verified and packed. Available in Outbound Dispatch Queue.
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
      description: Dispatched to  via . 
    });
  };

  const updateFacilityStatus = (newStatus) => {
    setProcessingFacility(prev => ({ ...prev, status: newStatus }));
  };
'''

# Inject helpers before return statement in Provider
if 'receiveProcessingBatch' not in content:
    target_str = "return (\n    <GlobalStateContext.Provider value={{"
    new_str = helpers_code + "\n  " + target_str
    content = content.replace(target_str, new_str)

    # Also add to provider value object
    provider_value_target = "// Processing\n      processingRequests, addProcessingRequest, updateProcessingRequest,\n      processingRecords, addProcessingRecord, updateProcessingRecord"
    provider_value_replacement = """// Processing
      processingFacility, updateFacilityStatus,
      processingRequests, addProcessingRequest, updateProcessingRequest,
      processingRecords, addProcessingRecord, updateProcessingRecord,
      receiveProcessingBatch, startProcessingOperation, completeProcessingOperation,
      markProcessingReadyToShip, dispatchProcessingBatch"""
    
    content = content.replace(provider_value_target, provider_value_replacement)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected processing helpers and facility context successfully.")
else:
    print("Processing helpers already injected.")
