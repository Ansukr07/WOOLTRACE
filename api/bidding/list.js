import dbConnect from '../_utils/db.js';
import BiddingListing from '../_models/BiddingListing.js';
import WoolBatch from '../_models/WoolBatch.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await dbConnect();
    const { batchId, farmerId, startingPrice, minimumIncrement, durationHours } = req.body;

    const batch = await WoolBatch.findOne({ batchId, farmerId });
    if (!batch) return res.status(404).json({ message: 'Batch not found or unauthorized' });

    const existingListing = await BiddingListing.findOne({ batchId, status: 'ACTIVE' });
    if (existingListing) return res.status(400).json({ message: 'Batch is already listed for bidding' });

    const count = await BiddingListing.countDocuments();
    const listingId = `LIST-${String(count + 1).padStart(5, '0')}`;
    const endTime = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    const listing = await BiddingListing.create({
      listingId,
      batchId,
      farmerId,
      startingPrice,
      minimumIncrement,
      endTime
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
