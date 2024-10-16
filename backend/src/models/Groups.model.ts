import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',  
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    groupTransactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "groupTransactions"
        }
    ],
    owes: [
        {
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            amount: {
                type: Number,
                required: true,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Group', groupSchema)