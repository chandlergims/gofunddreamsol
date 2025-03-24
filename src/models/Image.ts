import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
