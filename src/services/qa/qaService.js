export const qaService = {
  async getBatches(farmerId = 'FARMER-01') {
    const res = await fetch(`/api/batches?farmerId=${farmerId}`);
    const data = await res.json();
    return data.success ? data.data : [];
  },

  async createBatch(payload) {
    const res = await fetch('/api/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getRequests(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/qa/requests?${params}`);
    const data = await res.json();
    return data.success ? data.data : [];
  },

  async getRequestById(id) {
    const res = await fetch(`/api/qa/requests?id=${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
  },

  async createRequest(payload) {
    const res = await fetch('/api/qa/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async updateRequest(requestId, updates) {
    const res = await fetch('/api/qa/requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, ...updates })
    });
    return res.json();
  },

  async getCertificate(id) {
    const res = await fetch(`/api/qa/certificates?id=${id}`);
    const data = await res.json();
    return data.success ? data.data : null;
  },

  async getCertificateByBatch(batchId) {
    const res = await fetch(`/api/qa/certificates?batchId=${batchId}`);
    const data = await res.json();
    return data.success ? data.data : null;
  },

  async issueCertificate(payload) {
    const res = await fetch('/api/qa/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
