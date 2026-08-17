/**
 * Quality Assurance & Batch Service for WoolTrace
 * Handles batch creation, inspection requests, and certificate generation with seamless client persistence.
 */

export const qaService = {
  async getBatches(farmerId = 'FARMER-01') {
    try {
      const res = await fetch(`/api/batches?farmerId=${farmerId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          return data.data;
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
        return list;
      }
    } catch (e) {}

    return [];
  },

  async getBatchById(id) {
    try {
      const res = await fetch(`/api/batches?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) return data.data;
      }
    } catch (e) {
      console.warn('API getBatchById fetch bypassed, reading local state');
    }

    try {
      const stored = localStorage.getItem('wt_batches_v2');
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find(b => b.id === id || b.batchId === id);
        if (match) return match;
      }
    } catch (e) {}

    return null;
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

    const newBatch = {
      id: newBatchId,
      batchId: newBatchId,
      farmerId: payload.farmerId || 'FARMER-01',
      farmerName: payload.farmerName || 'Rajesh Gowda',
      origin: payload.origin || 'Mandya, Karnataka',
      quantity: Number(payload.quantity) || 400,
      woolType: payload.woolType || 'Medium Crossbred Wool',
      shearingDate: payload.shearingDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      currentStage: 'FARM',
      currentStatus: 'Harvested at Farm',
      currentLocation: payload.origin || 'Registered Farm, Karnataka',
      qualityGrade: payload.qualityGrade || 'Pending QA',
      certificateStatus: 'Uninspected',
      certificateId: null,
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
    };

    // Save to local storage
    try {
      const stored = localStorage.getItem('wt_batches_v2');
      const list = stored ? JSON.parse(stored) : [];
      const updated = [newBatch, ...list.filter(b => b.id !== newBatchId)];
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
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.data;
      }
    } catch (e) {}

    try {
      const stored = localStorage.getItem('wt_qa_requests_v2');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  async createRequest(payload) {
    const newReq = {
      id: `QAR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PENDING_ASSIGNMENT',
      createdAt: new Date().toISOString(),
      ...payload
    };

    try {
      const stored = localStorage.getItem('wt_qa_requests_v2');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('wt_qa_requests_v2', JSON.stringify([newReq, ...list]));
    } catch (e) {}

    return { success: true, data: newReq };
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

  async issueCertificate(payload) {
    const certId = `WTC-QA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCert = {
      id: certId,
      certificateId: certId,
      batchId: payload.batchId,
      inspectorId: payload.inspectorId || 'QA-01',
      inspectorName: payload.inspectorName || 'Dr. Anita Desai',
      grade: payload.grade || 'A',
      overallScore: payload.overallScore || 88,
      fiberDiameter: payload.fiberDiameter || 21.5,
      yield: payload.yield || '72%',
      cleanliness: payload.cleanliness || 92,
      moisture: payload.moisture || 12,
      farmerName: payload.farmerName || 'Farmer',
      quantity: payload.quantity || 400,
      issuedAt: new Date().toISOString(),
      status: 'Approved',
      verificationUrl: `http://localhost:5173/verify/${certId}`
    };

    try {
      const stored = localStorage.getItem('wt_certificates_v2');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('wt_certificates_v2', JSON.stringify([newCert, ...list]));
    } catch (e) {}

    return { success: true, data: newCert };
  }
};
