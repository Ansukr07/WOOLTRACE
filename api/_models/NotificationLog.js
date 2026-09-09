import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  channel: { type: String, enum: ['TELEGRAM', 'IN_APP'], required: true },
  eventType: { type: String, required: true },
  title: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'SENT', 'FAILED'], default: 'PENDING' },
  providerMessageId: String,
  error: String,
  idempotencyKey: { type: String, unique: true, sparse: true },
  sentAt: Date,
}, { timestamps: true });

export default mongoose.models.NotificationLog || mongoose.model('NotificationLog', notificationLogSchema);
