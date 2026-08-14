import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  bidId: { type: String, required: true, unique: true },
  listingId: { type: String, required: true },
  batchId: { type: String, required: true },
  farmerId: { type: String, required: true },
  bidderId: { type: String, required: true },
  bidderName: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'ACTIVE' }, // ACTIVE, HIGHEST, OUTBID, ACCEPTED, REJECTED, WITHDRAWN
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Bid || mongoose.model('Bid', bidSchema);
