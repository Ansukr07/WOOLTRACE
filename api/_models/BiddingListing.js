import mongoose from 'mongoose';

const biddingListingSchema = new mongoose.Schema({
  listingId: { type: String, required: true, unique: true },
  batchId: { type: String, required: true },
  farmerId: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  minimumIncrement: { type: Number, required: true },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date, required: true },
  status: { type: String, default: 'ACTIVE' }, // ACTIVE, CLOSED, EXPIRED
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.BiddingListing || mongoose.model('BiddingListing', biddingListingSchema);
