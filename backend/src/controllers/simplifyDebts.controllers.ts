import mongoose, { ObjectId } from 'mongoose';
import Group from '../models/Groups.model'; // Import the Group model


// Function to simplify debts
const simplifyDebts = async (groupId: string) => {
    const group = await Group.findById(groupId);  // Fetch from the Group model
    if (!group) return { success: false, message: 'Group not found' };

    // Map each user to their net balance
    const balanceMap: Record<string, number> = {};

    group.owes.forEach((oweEntry: any) => {
        const from = oweEntry.from.toString();
        const to = oweEntry.to.toString();
        
        // Deduct from the "from" user
        balanceMap[from] = (balanceMap[from] || 0) - oweEntry.amount;
        
        // Add to the "to" user
        balanceMap[to] = (balanceMap[to] || 0) + oweEntry.amount;
    });

    const creditors: any[] = [];
    const debtors: any[] = [];
    

    // Split users into creditors (positive balance) and debtors (negative balance)
    Object.keys(balanceMap).forEach(user => {
        const balance = balanceMap[user];
        if (balance > 0) {
            creditors.push({ user, balance });
        } else if (balance < 0) {
            debtors.push({ user, balance: -balance });
        }
    });

    // Simplify the debts
    let simplifiedOwes: { amount: number; from?: ObjectId | null; to?: ObjectId | null }[] = [];

    while (creditors.length && debtors.length) {
        const creditor = creditors[0];
        const debtor = debtors[0];

        const minAmount = Math.min(creditor.balance, debtor.balance);

        // Create a new simplified owe entry as a Mongoose document
        simplifiedOwes.push({
            from: debtor.user,
            to: creditor.user,
            amount: minAmount
        });

        // Adjust balances
        creditor.balance -= minAmount;
        debtor.balance -= minAmount;

        // Remove settled creditors or debtors
        if (creditor.balance === 0) creditors.shift();
        if (debtor.balance === 0) debtors.shift();
    }

    // Update the group's owes with the simplified debts
    group.owes = simplifiedOwes.map(owe => ({
        amount: owe.amount,
        from: owe.from,
        to: owe.to,
    })) as mongoose.Types.DocumentArray<any>; 
    
    await group.save();

    return { success: true, message: 'Debts simplified successfully' };
};

export default simplifyDebts