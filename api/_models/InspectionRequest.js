import mongoose from 'mongoose';

const inspectionRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  batchId: { type: String, required: true },
  farmerId: { type: String, required: true },
  farmerName: { type: String },
  location: { type: String },
  quantity: { type: Number },
  woolType: { type: String },
  preferredDate: { type: Date },
  message: { type: String },
  status: { type: String, default: 'PENDING_ASSIGNMENT' },
  inspectorId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.InspectionRequest || mongoose.model('InspectionRequest', inspectionRequestSchema);
