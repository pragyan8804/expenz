import express from "express";
import Group from "../models/Groups.model";
import User from "../models/User.model";

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

export default router