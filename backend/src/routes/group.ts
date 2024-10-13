import express from "express";
import Group from "../models/Groups.model";
import User from "../models/User.model";
import mongoose from "mongoose";

const router = express.Router();

//Create new group
router.post('/create', async (req: any, res: any) => {
    try {
        const { name, description, members } = req.body;

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res.status(400).json({ message: 'One or more members do not exist' });
        }

        const group = new Group({
            name,
            description,
            members
        })
        await group.save();

        // Add group to each user's list of groups
        await User.updateMany(
            { _id: { $in: members } },
            { $push: { groups: group._id } }
        );

        res.status(201).json({ message: 'Group created successfully', group });

    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error: (error as Error).message });
    }
})

// Get all groups for the split page
router.get('/', async (_req, res) => {
    try {
        // Fetch all groups and populate members' details
        const groups = await Group.find().populate('members', 'username _id');
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error: (error as Error).message });
    }
});

// Get group by id, for the group pages
router.get('/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;

        // Making sure groupId is defined and valid
        if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
            res.status(400).json({ message: 'Group ID is required' });
        }

        const group = await Group.findById(groupId)
            .populate('members', 'username _id')
            .populate({
                path: 'groupTransactions',
                model: 'GroupTransactions',
            })
            .populate({
                path: 'owes.from owes.to',
                model: 'User',
                select: 'username name'
            });

        if (!group) {
            res.status(404).json({ message: 'Group not found' });
        } 

        res.status(200).json(group);
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group', error: (error as Error).message });
    }
});

export default router