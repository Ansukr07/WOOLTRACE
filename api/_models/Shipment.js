import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  transportRequestId: { type: String, required: true },
  orderId: { type: String },
  batchId: { type: String, required: true },
  transporterId: { type: String, required: true },
  vehicleId: { type: String }, // Can be assigned later
  status: { 
    type: String, 
    default: 'ACCEPTED',
    enum: ['ACCEPTED', 'VEHICLE_ASSIGNED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED', 'COMPLETED', 'CANCELLED']
  },
  currentLocation: { type: String },
  pickupTime: { type: Date },
  deliveryTime: { type: Date },
  estimatedArrival: { type: Date },
  proofOfDelivery: {
    receiverName: { type: String },
    notes: { type: String },
    photoUrl: { type: String },
    documentUrl: { type: String },
    timestamp: { type: Date }
  },
  transportFee: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
