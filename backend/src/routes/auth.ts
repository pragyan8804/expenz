import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User"

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
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;