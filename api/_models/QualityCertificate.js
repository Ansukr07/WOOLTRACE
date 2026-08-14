import mongoose from 'mongoose';

const qualityCertificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  batchId: { type: String, required: true },
  requestId: { type: String, required: true },
  farmerName: { type: String },
  origin: { type: String },
  quantity: { type: Number },
  woolType: { type: String },
  
  grade: { type: String, required: true },
  overallScore: { type: Number, required: true },
  
  // Assessment metrics
  fiberDiameter: { type: Number },
  cleanliness: { type: Number },
  moisture: { type: Number },
  color: { type: String },
  strength: { type: String },
  contamination: { type: String },
  foreignMatter: { type: String },
  
  remarks: { type: String },
  
  inspectorId: { type: String },
  inspectorName: { type: String, default: 'Authorized Quality Inspector' },
  
  status: { type: String, default: 'VALID' },
  issuedAt: { type: Date, default: Date.now },
  
  verificationUrl: { type: String }
});

export default mongoose.models.QualityCertificate || mongoose.model('QualityCertificate', qualityCertificateSchema);
