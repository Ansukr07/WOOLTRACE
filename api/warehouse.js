import connectToDatabase from './_utils/db.js';
import WarehouseRelease from './_models/WarehouseRelease.js';
import { getApiRoute, handleCors } from './_utils/http.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  try {
    await connectToDatabase();
    const parts = getApiRoute(req).split('/').filter(Boolean);
    const approve = parts.includes('approve');
    const releaseId = approve ? parts[parts.indexOf('approve') - 1] : null;

    if (req.method === 'GET') {
      const query = req.query?.status ? { status: req.query.status } : {};
      return res.status(200).json(await WarehouseRelease.find(query).sort({ createdAt: -1 }));
    }
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.batchId || !body.releasedQty || !body.requestedBy || !body.destination) return res.status(400).json({ message: 'batchId, releasedQty, requestedBy and destination are required' });
      const release = await WarehouseRelease.create({ ...body, releaseId: body.releaseId || `REL-${Date.now()}` });
      return res.status(201).json(release);
    }
    if (req.method === 'PUT' && approve && releaseId) {
      const release = await WarehouseRelease.findOneAndUpdate({ releaseId }, { status: 'Approved', approvedBy: req.body?.approvedBy || 'Warehouse Superintendent', approvedAt: new Date() }, { new: true });
      return release ? res.status(200).json(release) : res.status(404).json({ message: 'Release not found' });
    }
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
