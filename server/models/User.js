import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currency: {
      code: { type: String, default: 'INR' },
      symbol: { type: String, default: '₹' }
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
