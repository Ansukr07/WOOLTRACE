import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
  },
  state: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'FARMER',
  },
  preferredLanguage: {
    type: String,
    default: 'en',
  },
  notifications: {
    telegram: {
      enabled: { type: Boolean, default: false },
      chatId: { type: String, default: null },
      connectedAt: { type: Date, default: null },
    },
    whatsapp: {
      enabled: { type: Boolean, default: false },
      phone: { type: String, default: null },
    },
    inApp: {
      enabled: { type: Boolean, default: true },
    },
  },
  telegramLinkToken: { type: String, select: false },
  telegramLinkExpiresAt: { type: Date, select: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
