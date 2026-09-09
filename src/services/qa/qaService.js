/**
 * Quality Assurance & Batch Service for WoolTrace
 * Handles batch creation, inspection requests, and certificate generation with seamless client persistence.
 */

const toNonNegativeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
};

const normalizeBatchRecord = (batch = {}) => {
  const quantity = toNonNegativeNumber(batch.quantity);
  const originalQuantity = toNonNegativeNumber(batch.originalQuantity, quantity);
  const reservedQuantity = toNonNegativeNumber(batch.reservedQuantity);
  const soldQuantity = toNonNegativeNumber(batch.soldQuantity);
  const availableQuantity = toNonNegativeNumber(
    batch.availableQuantity,
    Math.max(0, originalQuantity - reservedQuantity - soldQuantity)
  );
  const batchId = batch.batchId || batch.id;

  return {
    ...batch,
    id: batchId || batch.id,
    batchId,
    quantity,
    originalQuantity,
    availableQuantity,
    reservedQuantity,
    soldQuantity,
    sheepCount: toNonNegativeNumber(batch.sheepCount),
    storageStatus: batch.storageStatus || (batch.currentStage === 'WAREHOUSE' ? 'Stored' : 'Not Stored'),
    storageLocation: batch.storageLocation,
    storageSince: batch.storageSince || null,
    currentStage: batch.currentStage || 'FARM',
    currentStatus: batch.currentStatus || batch.status || 'Harvested at Farm',
    currentLocation: batch.currentLocation || batch.origin || 'Registered Farm',
    qualityGrade: batch.qualityGrade || 'Pending QA',
    certificateStatus: batch.certificateStatus || 'Uninspected',
    certificateId: batch.certificateId || null,
    images: batch.images || [],
    shearingDate: batch.shearingDate || batch.harvestDate || batch.createdAt,
    createdAt: batch.createdAt || new Date().toISOString(),
    updatedAt: batch.updatedAt || batch.createdAt || new Date().toISOString()
  };
};

const firstPresent = (...values) => values.find(value => value !== undefined && value !== null && value !== '');
const formatPercent = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const text = String(value);
  return text.includes('%') ? text : `${text}%`;
};
const readApiJson = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON response from QA API');
  }
};
const isBackendUnavailable = (response, data) => (
  response?.status === 502 ||
  response?.status === 503 ||
  response?.status === 504 ||
  data?.backendUnavailable === true
);
const getApiErrorMessage = (data, fallback) => data?.error || data?.message || fallback;
const toNumberOrUndefined = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${fieldName} must be a valid number`);
  return number;
};

export const qaService = {
  async getBatches(farmerId = 'FARMER-01') {
    try {
      const res = await fetch(`/api/batches?farmerId=${farmerId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          return data.data.map(normalizeBatchRecord);
        }
      }
    } catch (e) {
      console.warn('API getBatches fetch bypassed, reading local state');
    }

    // Local fallback
    try {
      const stored = localStorage.getItem('wt_batches_v2');
      if (stored) {
        const list = JSON.parse(stored);
        return list.map(normalizeBatchRecord);
      }
    } catch (e) {}

    return [];
  },

  async getBatchById(id) {
    try {
      const res = await fetch(`/api/batches?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return normalizeBatchRecord(data.data);
      }
    } catch (e) {
      console.warn('API getBatchById fetch bypassed, reading local state');
    }

    try {
      const stored = localStorage.getItem('wt_batches_v2');
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find(b => b.id === id || b.batchId === id);
        if (match) return normalizeBatchRecord(match);
      }
    } catch (e) {}

    return null;
  },

  async syncBatchToBackend(batch) {
    const normalizedBatch = normalizeBatchRecord(batch);
    if (!normalizedBatch.batchId) {
      return { success: false, error: 'batchId is required to sync WoolBatch' };
    }

    try {
      const existingRes = await fetch(`/api/batches?id=${normalizedBatch.batchId}`);
      const existingData = await readApiJson(existingRes);
      if (isBackendUnavailable(existingRes, existingData)) {
        return { success: true, backendUnavailable: true, persistedToBackend: false };
      }
      if (existingData?.success && existingData.data) {
        return { success: true, data: normalizeBatchRecord(existingData.data), alreadyExisted: true };
      }
      if (!existingRes.ok) {
        return { success: false, error: getApiErrorMessage(existingData, `Batch lookup failed with ${existingRes.status}`) };
      }

      const createRes = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedBatch)
      });
      const createdData = await readApiJson(createRes);
      if (isBackendUnavailable(createRes, createdData)) {
        return { success: true, backendUnavailable: true, persistedToBackend: false };
      }
      if (createdData?.success && createdData.data) {
        return { success: true, data: normalizeBatchRecord(createdData.data), alreadyExisted: false };
      }

      const refetchRes = await fetch(`/api/batches?id=${normalizedBatch.batchId}`);
      const refetchData = await readApiJson(refetchRes);
      if (isBackendUnavailable(refetchRes, refetchData)) {
        return { success: true, backendUnavailable: true, persistedToBackend: false };
      }
      if (refetchData?.success && refetchData.data) {
        return { success: true, data: normalizeBatchRecord(refetchData.data), alreadyExisted: true };
      }

      return { success: false, error: createdData?.error || createdData?.message || `Batch sync failed with ${createRes.status}` };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to sync WoolBatch to backend' };
    }
  },

  async createBatch(payload) {
    const stateCode = (payload.origin || '').toLowerCase().includes('rajasthan') ? 'RJ'
      : (payload.origin || '').toLowerCase().includes('himachal') ? 'HP'
      : (payload.origin || '').toLowerCase().includes('punjab') ? 'PB'
      : (payload.origin || '').toLowerCase().includes('gujarat') ? 'GJ'
      : (payload.origin || '').toLowerCase().includes('kashmir') ? 'JK'
      : 'KA';

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newBatchId = `WT-${stateCode}-2026-${randomSuffix}`;

    const quantity = toNonNegativeNumber(payload.quantity, 400);
    const newBatch = normalizeBatchRecord({
      id: newBatchId,
      batchId: newBatchId,
      farmerId: payload.farmerId || 'FARMER-01',
      farmerName: payload.farmerName || 'Rajesh Gowda',
      origin: payload.origin || 'Mandya, Karnataka',
      quantity,
      originalQuantity: payload.originalQuantity ?? quantity,
      availableQuantity: payload.availableQuantity ?? quantity,
      reservedQuantity: payload.reservedQuantity ?? 0,
      soldQuantity: payload.soldQuantity ?? 0,
      sheepCount: payload.sheepCount ?? 0,
      woolType: payload.woolType || 'Medium Crossbred Wool',
      shearingDate: payload.shearingDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      currentStage: 'FARM',
      currentStatus: 'Harvested at Farm',
      currentLocation: payload.origin || 'Registered Farm, Karnataka',
      qualityGrade: payload.qualityGrade || 'Pending QA',
      certificateStatus: 'Uninspected',
      certificateId: null,
      storageStatus: 'Not Stored',
      storageLocation: undefined,
      storageSince: null,
      verificationUrl: `http://localhost:5173/track/${newBatchId}`,
      events: [
        {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
                     new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          stage: 'FARM',
          title: 'Farm Shearing & Batch Registered',
          location: payload.origin || 'Registered Farm, Karnataka',
          status: 'Completed',
          actor: `${payload.farmerName || 'Farmer'} (Owner)`,
          description: `Batch #${newBatchId} registered with ${payload.quantity} KG of ${payload.woolType}. QR Passport generated.`
        }
      ]
    });

    // Save to local storage
    try {
      const stored = localStorage.getItem('wt_batches_v2');
      const list = stored ? JSON.parse(stored) : [];
      const updated = [newBatch, ...list.map(normalizeBatchRecord).filter(b => b.id !== newBatchId)];
      localStorage.setItem('wt_batches_v2', JSON.stringify(updated));
    } catch (e) {}

    // Also attempt backend API
    try {
      fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBatch)
      }).catch(() => {});
    } catch (e) {}

    return {
      success: true,
      data: newBatch
    };
  },

  async getRequests(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/qa/requests?${params}`);
      const data = await readApiJson(res);
      if (isBackendUnavailable(res, data)) {
        throw Object.assign(new Error(getApiErrorMessage(data, 'QA backend unavailable')), { backendUnavailable: true });
      }
      if (res.ok) {
        if (data.success) return data.data;
      }
      return [];
    } catch (e) {
      if (!e.backendUnavailable && e.name !== 'TypeError') return [];
    }

    try {
      const stored = localStorage.getItem('wt_qa_requests_v2');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  async getRequestById(id) {
    try {
      const res = await fetch(`/api/qa/requests?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data.data;
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem('wt_qa_requests_v2');
      const list = stored ? JSON.parse(stored) : [];
      return list.find(req => req.id === id || req.requestId === id) || null;
    } catch (e) {
      return null;
    }
  },

  async updateRequest(id, updates) {
    try {
      const res = await fetch('/api/qa/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id, ...updates })
      });
      const data = await readApiJson(res);
      if (isBackendUnavailable(res, data)) {
        throw Object.assign(new Error(getApiErrorMessage(data, 'QA backend unavailable')), { backendUnavailable: true });
      }
      if (res.ok) {
        if (data.success && data.data) return { success: true, data: data.data };
      }
      return { success: false, error: getApiErrorMessage(data, `QA API returned ${res.status}`) };
    } catch (e) {
      if (!e.backendUnavailable && e.name !== 'TypeError') {
        return { success: false, error: e.message };
      }
    }

    try {
      const stored = localStorage.getItem('wt_qa_requests_v2');
      const list = stored ? JSON.parse(stored) : [];
      const updated = list.map(req => (req.id === id || req.requestId === id) ? { ...req, ...updates } : req);
      localStorage.setItem('wt_qa_requests_v2', JSON.stringify(updated));
      return { success: true, data: updated.find(req => req.id === id || req.requestId === id) || null, persistedToBackend: false };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async createRequest(payload) {
    try {
      const res = await fetch('/api/qa/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await readApiJson(res);
      if (isBackendUnavailable(res, data)) {
        throw Object.assign(new Error(getApiErrorMessage(data, 'QA backend unavailable')), { backendUnavailable: true });
      }
      if (res.ok) {
        if (data.success && data.data) {
          const savedReq = { id: data.data.requestId || data.data.id, ...data.data };
          try {
            const stored = localStorage.getItem('wt_qa_requests_v2');
            const list = stored ? JSON.parse(stored) : [];
            localStorage.setItem('wt_qa_requests_v2', JSON.stringify([
              savedReq,
              ...list.filter(req => req.requestId !== savedReq.requestId && req.id !== savedReq.id)
            ]));
          } catch (e) {}
          return { success: true, data: savedReq };
        }
      }
      return { success: false, error: getApiErrorMessage(data, `QA API returned ${res.status}`) };
    } catch (e) {
      if (!e.backendUnavailable && e.name !== 'TypeError') {
        return { success: false, error: e.message };
      }
    }

    const requestId = payload.requestId || `QAR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq = {
      id: requestId,
      requestId,
      status: 'PENDING_ASSIGNMENT',
      createdAt: new Date().toISOString(),
      ...payload
    };

    try {
      const stored = localStorage.getItem('wt_qa_requests_v2');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('wt_qa_requests_v2', JSON.stringify([newReq, ...list]));
    } catch (e) {}

    return { success: true, data: newReq, persistedToBackend: false };
  },

  async getCertificateByBatch(batchId) {
    try {
      const res = await fetch(`/api/qa/certificates?batchId=${batchId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data.data;
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem('wt_certificates_v2');
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find(c => c.batchId === batchId);
        if (match) return match;
      }
    } catch (e) {}

    return null;
  },

  async getCertificates(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/qa/certificates?${params}`);
      const data = await readApiJson(res);
      if (isBackendUnavailable(res, data)) {
        throw Object.assign(new Error(getApiErrorMessage(data, 'QA backend unavailable')), { backendUnavailable: true });
      }
      if (res.ok && data.success) {
        return Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
      }
      return [];
    } catch (e) {
      if (!e.backendUnavailable && e.name !== 'TypeError') return [];
    }

    try {
      const stored = localStorage.getItem('wt_certificates_v2');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  async getCertificate(certificateId) {
    try {
      const res = await fetch(`/api/qa/certificates?id=${certificateId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data.data;
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem('wt_certificates_v2');
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find(c => c.id === certificateId || c.certificateId === certificateId);
        if (match) return match;
      }
    } catch (e) {}

    return null;
  },

  async issueCertificate(payload) {
    const certId = `WTC-QA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const cleanYieldValue = firstPresent(payload.cleanYield, payload.yieldPct, payload.yield);
    const newCert = {
      id: certId,
      certificateId: certId,
      batchId: payload.batchId,
      requestId: payload.requestId,
      inspectorId: payload.inspectorId,
      inspectorName: payload.inspectorName || 'Authorized Quality Inspector',
      grade: payload.grade,
      overallScore: toNumberOrUndefined(payload.overallScore, 'Overall Score'),
      fiberDiameter: toNumberOrUndefined(payload.fiberDiameter, 'Fiber Diameter'),
      stapleLength: toNumberOrUndefined(payload.stapleLength, 'Staple Length'),
      cleanYield: toNumberOrUndefined(cleanYieldValue, 'Clean Yield'),
      yieldPct: toNumberOrUndefined(firstPresent(payload.yieldPct, cleanYieldValue), 'Clean Yield'),
      yield: firstPresent(payload.yield, formatPercent(cleanYieldValue)),
      cleanliness: toNumberOrUndefined(payload.cleanliness, 'Cleanliness'),
      moisture: toNumberOrUndefined(payload.moisture, 'Moisture'),
      color: payload.color,
      strength: payload.strength,
      tensileStrength: payload.tensileStrength,
      contamination: payload.contamination,
      vegetableMatter: payload.vegetableMatter,
      foreignMatter: payload.foreignMatter,
      remarks: payload.remarks,
      farmerName: payload.farmerName,
      origin: payload.origin,
      quantity: payload.quantity,
      woolType: payload.woolType,
      issuedAt: new Date().toISOString(),
      status: 'Approved',
      verificationUrl: `http://localhost:5173/verify/${certId}`
    };
    Object.keys(newCert).forEach(key => {
      if (newCert[key] === undefined || newCert[key] === null || newCert[key] === '') delete newCert[key];
    });

    try {
      const res = await fetch('/api/qa/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert)
      });
      const data = await readApiJson(res);
      if (isBackendUnavailable(res, data)) {
        throw Object.assign(new Error(getApiErrorMessage(data, 'QA backend unavailable')), { backendUnavailable: true });
      }
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || `QA API returned ${res.status}`);
      }
      if (data.data) {
        const savedCert = data.data;
        try {
          const stored = localStorage.getItem('wt_certificates_v2');
          const list = stored ? JSON.parse(stored) : [];
          localStorage.setItem('wt_certificates_v2', JSON.stringify([
            savedCert,
            ...list.filter(cert => cert.certificateId !== newCert.certificateId && cert.certificateId !== savedCert.certificateId)
          ]));
        } catch (e) {}
        try {
          const stored = localStorage.getItem('wt_qa_requests_v2');
          const list = stored ? JSON.parse(stored) : [];
          localStorage.setItem('wt_qa_requests_v2', JSON.stringify(list.map(req => (
            req.id === payload.requestId || req.requestId === payload.requestId
              ? { ...req, status: 'CERTIFICATE_ISSUED' }
              : req
          ))));
        } catch (e) {}
        try {
          const stored = localStorage.getItem('wt_batches_v2');
          const list = stored ? JSON.parse(stored) : [];
          localStorage.setItem('wt_batches_v2', JSON.stringify(list.map(batch => (
            batch.id === payload.batchId || batch.batchId === payload.batchId
              ? normalizeBatchRecord({
                  ...batch,
                  certificateStatus: 'Certified',
                  qualityGrade: savedCert.grade || payload.grade,
                  certificateId: savedCert.certificateId
                })
              : batch
          ))));
        } catch (e) {}
        return { success: true, data: savedCert, persistedToBackend: true };
      }
      throw new Error('QA API did not return a certificate');
    } catch (error) {
      if (!error.backendUnavailable && error.name !== 'TypeError') {
        return { success: false, error: error.message };
      }
    }

    try {
      const stored = localStorage.getItem('wt_certificates_v2');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('wt_certificates_v2', JSON.stringify([newCert, ...list]));
    } catch (e) {}

    try {
      const stored = localStorage.getItem('wt_qa_requests_v2');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('wt_qa_requests_v2', JSON.stringify(list.map(req => (
        req.id === payload.requestId || req.requestId === payload.requestId
          ? { ...req, status: 'CERTIFICATE_ISSUED' }
          : req
      ))));
    } catch (e) {}

    try {
      const stored = localStorage.getItem('wt_batches_v2');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('wt_batches_v2', JSON.stringify(list.map(batch => (
        batch.id === payload.batchId || batch.batchId === payload.batchId
          ? normalizeBatchRecord({
              ...batch,
              certificateStatus: 'Certified',
              qualityGrade: payload.grade,
              certificateId: certId
            })
          : batch
      ))));
    } catch (e) {}

    return { success: true, data: newCert, persistedToBackend: false };
  }
};
