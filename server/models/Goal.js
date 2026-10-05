import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: String, default: '' },
    category: { type: String, default: 'General' },
    color: { type: String, default: '#10b981' }
  },
  { timestamps: true }
);

export default mongoose.model('Goal', goalSchema);
