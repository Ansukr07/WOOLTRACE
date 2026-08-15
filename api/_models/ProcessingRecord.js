import mongoose from 'mongoose';

const processingRecordSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  batchId: { type: String, required: true },
  parentBatchId: { type: String },
  processingRequestId: { type: String },
  processingUnitId: { type: String },
  processingUnitName: { type: String },
  operatorId: { type: String },
  operatorName: { type: String },
  operation: {
    type: String,
    required: true
    // Sorting | Washing | Carding | Spinning | Dyeing | Other
  },
  inputQuantity: { type: Number, required: true },
  outputQuantity: { type: Number },
  wasteQuantity: { type: Number },
  outputBatchId: { type: String },
  status: {
    type: String,
    default: 'IN_PROGRESS'
    // IN_PROGRESS | COMPLETED | FAILED
  },
  startTime: { type: Date },
  completionTime: { type: Date },
  equipment: { type: String },
  notes: { type: String },
  // Operation-specific fields (stored as a flexible object)
  operationData: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

processingRecordSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ProcessingRecord ||
  mongoose.model('ProcessingRecord', processingRecordSchema);
