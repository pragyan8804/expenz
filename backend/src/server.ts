import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transaction';
import groupRoutes from './routes/group';
import groupTransactionRoutes from './routes/grouptransaction';
import checkUsernameRoutes from './routes/checkusername';
import simplifyDebtRoutes from './routes/simplifydebts';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/group-transactions', groupTransactionRoutes);
app.use('/api/check-username', checkUsernameRoutes);
app.use('/api/simplify-debts', simplifyDebtRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connection successful');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
    });