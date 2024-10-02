import express, { Request, Response } from "express";
import Transaction from "../models/Transactions";

const router = express.Router();

// Route to add a new transaction
router.post("/add", async (req: Request, res: Response) => {
  const { userId, amount, category, subCategory, date, name, notes } = req.body;

  try {
    // Create a new transaction
    const newTransaction = new Transaction({
      userId,
      amount,
      category,
      subCategory,
      date,
      name,
      notes,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction", error: (error as Error).message });
  }
});

// Route to get all transactions for a specific user
router.get("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const transactions = await Transaction.find({ userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error: (error as Error).message });
  }
});

export default router;
