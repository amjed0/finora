import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ['expense', 'income'], required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    paymentMethod: { type: String, default: 'cash' },
    creditAccountId: { type: String, default: null },
    account: { type: String, default: 'Cash Wallet' },
    notes: { type: String, default: '' },
    isRecurring: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);
