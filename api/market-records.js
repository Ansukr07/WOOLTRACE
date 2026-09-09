import connectToDatabase from './_utils/db.js';
import MarketRecord from './_models/MarketRecord.js';

const ALLOWED_KINDS = new Set(['LOT', 'DEMAND', 'OFFER', 'TRANSACTION', 'DISPUTE']);

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    if (req.method === 'GET') {
      const kinds = String(req.query?.kind || '').split(',').filter(Boolean);
      const query = kinds.length ? { kind: { $in: kinds.filter(kind => ALLOWED_KINDS.has(kind)) } } : {};
      const records = await MarketRecord.find(query).sort({ updatedAt: -1 }).lean();
      return res.status(200).json({ records: records.map(record => ({ kind: record.kind, ...record.payload })) });
    }
    if (req.method === 'POST') {
      const { kind, record } = req.body || {};
      if (!ALLOWED_KINDS.has(kind) || !record?.id) return res.status(400).json({ error: 'kind and record.id are required' });
      const saved = await MarketRecord.findOneAndUpdate(
        { kind, recordId: String(record.id) },
        { $set: { payload: record, status: record.status || 'ACTIVE' } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      return res.status(200).json({ kind: saved.kind, ...saved.payload });
    }
    if (req.method === 'DELETE') {
      const { kind, id } = req.body || {};
      if (!ALLOWED_KINDS.has(kind) || !id) return res.status(400).json({ error: 'kind and id are required' });
      await MarketRecord.deleteOne({ kind, recordId: String(id) });
      return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('market-records error', error);
    return res.status(500).json({ error: 'Unable to sync market records' });
  }
}
