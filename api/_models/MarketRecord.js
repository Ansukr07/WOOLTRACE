import mongoose from 'mongoose';

const marketRecordSchema = new mongoose.Schema({
  kind: { type: String, required: true, enum: ['LOT', 'DEMAND', 'OFFER', 'TRANSACTION', 'DISPUTE'] },
  recordId: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, default: 'ACTIVE' }
}, { timestamps: true });

marketRecordSchema.index({ kind: 1, recordId: 1 }, { unique: true });

export default mongoose.models.MarketRecord || mongoose.model('MarketRecord', marketRecordSchema);
