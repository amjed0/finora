import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['borrowing', 'lending', 'asset'], default: 'borrowing' },
    type: { type: String, default: 'credit_card' },
    balance: { type: Number, required: true, default: 0 },
    limit: { type: Number, default: 0 },
    apr: { type: Number, default: 0 },
    minPayment: { type: Number, default: 0 },
    dueDate: { type: String, default: '' },
    entity: { type: String, default: '' },
    color: { type: String, default: '#8b5cf6' },
    notes: { type: String, default: '' },
    accountNumber: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Credit', creditSchema);
