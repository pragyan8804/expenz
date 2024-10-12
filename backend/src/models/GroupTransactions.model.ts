import mongoose from 'mongoose';

const groupTransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    paidBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    splitBetween: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    settled: {
        type: Boolean,
        default: false
    }
}); 

export default mongoose.model('GroupTransactions', groupTransactionSchema)