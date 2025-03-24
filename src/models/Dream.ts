import mongoose from 'mongoose';

const DreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  fundingGoal: {
    type: Number,
    required: true,
  },
  currentFunding: {
    type: Number,
    default: 0,
  },
  creator: {
    type: String, // Ethereum address
    required: true,
    lowercase: true,
  },
  telegram: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'funded', 'completed', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
DreamSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Dream || mongoose.model('Dream', DreamSchema);
