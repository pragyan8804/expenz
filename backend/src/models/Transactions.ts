import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Expense', 'Income', 'Investment'],
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
