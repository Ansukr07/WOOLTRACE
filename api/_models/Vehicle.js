import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  transporterId: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, required: true },
  capacity: { type: Number, required: true },
  registrationNumber: { type: String },
  insuranceExpiry: { type: Date },
  status: { type: String, default: 'AVAILABLE' }, // AVAILABLE, IN_USE, MAINTENANCE
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
