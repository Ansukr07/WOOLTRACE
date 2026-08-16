import mongoose from 'mongoose';

const LearningResourceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'article', 'website', 'training'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  sourceOrganization: {
    type: String,
    required: true,
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  isOfficial: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.LearningResource || mongoose.model('LearningResource', LearningResourceSchema);
