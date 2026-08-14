import dbConnect from './_utils/db.js';
import WoolBatch from './_models/WoolBatch.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { farmerId } = req.query;
      let query = {};
      if (farmerId) query.farmerId = farmerId;
      
      const batches = await WoolBatch.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: batches });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { farmerId, farmerName, quantity, woolType, origin, shearingDate, images } = req.body;
      
      const count = await WoolBatch.countDocuments();
      const batchId = `WT-KA-2026-${String(count + 125).padStart(5, '0')}`;

      const batch = await WoolBatch.create({
        batchId,
        farmerId: farmerId || 'FARMER-01',
        farmerName: farmerName || 'Rajesh Kumar',
        quantity,
        woolType,
        origin,
        shearingDate,
        images
      });

      return res.status(201).json({ success: true, data: batch });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  res.status(405).json({ success: false, message: 'Method not allowed' });
}
