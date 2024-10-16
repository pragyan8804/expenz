import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.model"

const router = express.Router();

//Signup
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: "Username already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup Error: ", error);
        res.status(500).json({ message: (error as Error).message });
    }
});

//Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username});
        if (!user) {
            res.status(400).json({ message: "Invalid username or password" });
            return;
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            res.status(400).json({ message: "Invalid username or password" });
            return;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get user details by userId
router.get("/users/:userId", async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("username name");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

//Get user ids from usernames (used in group creation)
router.post('/users/ids', async (req: any, res: any) => {
    const { usernames } = req.body;

    try {
        const users = await User.find({ username: { $in: usernames } }, '_id'); // Get only the ObjectIds
        const userIds = users.map(user => user._id);

        res.status(200).json(userIds);  // Send back the array of ObjectIds
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user IDs', error: (error as Error).message });
    }
});

export default router;