export const processingService = {
  async getRequests(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/processing/requests?${params}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch {
      return [];
    }
  },

  async createRequest(payload) {
    try {
      const res = await fetch('/api/processing/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.json();
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  async updateRequest(requestId, updates) {
    try {
      const res = await fetch('/api/processing/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, ...updates })
      });
      return res.json();
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  async getRecords(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/processing/records?${params}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch {
      return [];
    }
  },

  async createRecord(payload) {
    try {
      const res = await fetch('/api/processing/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return res.json();
    } catch {
      return { success: false, error: 'Network error' };
    }
  },

  async updateRecord(recordId, updates) {
    try {
      const res = await fetch('/api/processing/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, ...updates })
      });
      return res.json();
    } catch {
      return { success: false, error: 'Network error' };
    }
  }
};
