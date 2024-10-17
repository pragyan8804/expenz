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
// router.get('/', async (_req, res) => {
//     try {
//         // Fetch all groups and populate members' details
//         const groups = await Group.find().populate('members', 'username _id');
//         res.status(200).json(groups);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching groups', error: (error as Error).message });
//     }
// });

//Get the groups of that user on the split page
router.get('/', async (req: any, res:any) => {
    try {
        const { userId } = req.query; // Get the userId from query parameters or you can use req.body for POST

        // Validate if userId is provided
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
        }

        // Find groups where the current user is a member
        const groups = await Group.find({ members: userId }).populate('members', 'username _id');

        if (!groups.length) {
            res.status(404).json({ message: 'No groups found for this user' });
        }

        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error: (error as Error).message });
    }
});

// Get group by id, for the group pages
router.get('/:groupId', async (req:any, res:any) => {
    try {
        const { groupId } = req.params;

        // Making sure groupId is defined and valid
        if (!groupId || !mongoose.isValidObjectId(groupId)) {
            return res.status(400).json({ message: 'Invalid Group ID' });
        }

        const group = await Group.findById(groupId)
            .populate('members', ' name username _id')
            .populate({
                path: 'groupTransactions',
                model: 'GroupTransactions',
                populate: {
                    path: 'paidBy',
                    model: 'User',
                    select: 'username name'
                }
            })
            .populate({
                path: 'owes.from owes.to',
                model: 'User',
                select: 'username name'
            });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        } 

        res.status(200).json(group);
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group', error: (error as Error).message });
    }
});

//Add member to existing group
router.post('/add-member/:groupId', async (req: any, res: any) => {
    try {
        const { groupId } = req.params;
        const { usernames } = req.body;

        const validUsers = await User.find({ username: { $in: usernames } });

        if (validUsers.length !== usernames.length) {
            return res.status(400).json({ message: 'user does not exist' });
        }

        const userIds = validUsers.map(user => user._id);

            // Update the group by adding new members
        const group = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: { $each: userIds } } }, // Prevent duplicates
        { new: true }
        ).populate('members', 'username name _id');

        if(!group) {
            res.status(404).json({ message: 'Group not found' });
        }

        // Add group to each new user's list of groups
        await User.updateMany(
        { _id: { $in: userIds } },
        { $addToSet: { groups: groupId } } // Prevent duplicates
        );

        res.status(200).json({ message: 'Group updated successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error updating group', error: (error as Error).message });
    }
});

export default router