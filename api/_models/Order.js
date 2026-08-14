import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  bidId: { type: String, required: true },
  batchId: { type: String, required: true },
  farmerId: { type: String, required: true },
  buyerId: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'PENDING' }, // PENDING, IN_ESCROW, RELEASED
  transportStatus: { type: String, default: 'NOT_STARTED' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
