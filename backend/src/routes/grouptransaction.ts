import express from "express";
import Group from '../models/Groups.model';
import GroupTransaction from '../models/GroupTransactions.model';
import mongoose from "mongoose";

const router = express.Router();

//Add a transaction to a group
router.post('/add', async (req: any, res: any) => {
    try {
        const { amount, description, paidBy, splitBetween, groupId } = req.body;
        
        // Make sure groupId is defined and valid
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            res.status(400).json({ message: 'Invalid groupId' });
        }

        // Convert groupId to ObjectId explicitly
        const groupObjectId = new mongoose.Types.ObjectId(groupId);

        const newTransaction = new GroupTransaction({
            amount,
            description,
            paidBy,
            group: groupObjectId,
            splitBetween,
        });
        await newTransaction.save();

        // Add the transaction to the group
        await Group.findByIdAndUpdate(groupId, {
            $push: { groupTransactions: newTransaction._id }
        });

        // // Logic to split the expense between members and update "owes"
        const perPersonAmount = amount / splitBetween.length;
        const group = await Group.findById(groupId);

        splitBetween.forEach((member: any) => {
            if(member !== paidBy) {
                if (!group) return;
                const oweEntry = group.owes.find(o => o.from?.equals(member) && o.to?.equals(paidBy)); 

                if(oweEntry) {
                    oweEntry.amount += perPersonAmount;
                } else {
                    group.owes.push({
                        from: member,
                        to: paidBy,
                        amount: perPersonAmount
                    });
                }
            }
        })

        if (group) {
            await group.save();
            res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
        } else {
            res.status(404).json({ message: "Group not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding transaction", error: (error as Error).message });
    }
})

//Settle up
router.post('/settle-up', async (req: any, res: any) => {
    try {
        const { amount, paidBy, paidTo, groupId } = req.body;

        //group id shjould be valid
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid groupId' });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        //find owe entry between paidBy user and paidTo user

        const oweEntry = group.owes.find(o => o.from?.equals(paidBy) && o.to?.equals(paidTo));

        if (!oweEntry) {
            return res.status(404).json({ message: 'Owe entry not found between these two' });
        }

        //subtract
        oweEntry.amount -= amount;

        //if  owe entry is 0, remove it
        // if (oweEntry.amount <= 0) {
        //     group.owes = group.owes.filter(
        //         (owe) => !(owe.from?.equals(paidBy) && owe.to?.equals(paidTo))
        //     );
        // }
        if (oweEntry.amount <= 0) {
            const index = group.owes.indexOf(oweEntry);
            if (index > -1) {
                group.owes.splice(index, 1);  // This is the correct way to remove a DocumentArray element
            }
        }

        await group.save();

        res.status(200).json({ message: 'Settled up successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error settling up', error: (error as Error).message });
    }
})

export default router;
