import mongoose from 'mongoose';

const transportRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  orderId: { type: String }, // Optional, could be just a batch move
  batchId: { type: String, required: true },
  requestedBy: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  pickupAddress: { type: String },
  destination: { type: String, required: true },
  destinationAddress: { type: String },
  quantity: { type: Number, required: true },
  woolType: { type: String },
  preferredPickupDate: { type: Date },
  estimatedDistance: { type: Number },
  estimatedFee: { type: Number },
  status: { type: String, default: 'AVAILABLE' }, // AVAILABLE, ACCEPTED, CANCELLED
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.TransportRequest || mongoose.model('TransportRequest', transportRequestSchema);
