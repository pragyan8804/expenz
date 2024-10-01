import express, { Request, Response, NextFunction } from "express";
import Transaction from "../models/Transactions";
import jwt from "jsonwebtoken";
// import User from "../models/User";

// Extend the Request interface to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

const router = express.Router();

// Middleware to verify JWT and extract userId
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decodedToken: any) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    // Attach userId from decodedToken to req.userId
    req.userId = decodedToken.userId;
    next();
  });
};

// Route to add a new transaction
router.post("/add", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { amount, category, subCategory, date, name, notes } = req.body;

  try {
    // Create a new transaction
    const newTransaction = new Transaction({
      userId: req.userId,  // Link transaction to the user
      amount,
      category,
      subCategory,
      date,
      name,
      notes
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error: (error as Error).message });
  }
});

// Route to get all transactions for the authenticated user
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error: (error as Error).message });
  }
});

export default router;
