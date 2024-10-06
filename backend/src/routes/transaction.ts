import express, { Request, Response } from "express";
import Transaction from "../models/Transactions";
import mongoose from "mongoose";

const router = express.Router();

// Route to add a new transaction
router.post("/add", async (req: Request, res: Response) => {
  const { userId, amount, category, subCategory, date, name, notes } = req.body;

  try {
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

//Route to edit a transaction
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, category, subCategory, date, name, notes } = req.body;

  try {
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { amount, category, subCategory, date, name, notes },
        { new: true }
      );

      if (!updatedTransaction) {
      res.status(404).json({ message: "Transaction not found" });
      }

      res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
    } catch (error) {
      res.status(500).json({ message: "Error updating transaction", error: (error as Error).message });
    }
})

// Route to delete a transaction
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
     res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error: (error as Error).message });
  }
});

// Route to get total amounts for expenses, income, and investments for a specific user
router.get("/totals/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Convert userId to ObjectId for aggregation queries
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Get the total expenses, income, and investments for the user
    const [totalExpenses, totalIncome, totalInvestments] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: objectUserId, category: "Expense" } }, // Match transactions for "Expense" category
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } } // Sum amounts
      ]),
      Transaction.aggregate([
        { $match: { userId: objectUserId, category: "Income" } }, // Match transactions for "Income" category
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } } // Sum amounts
      ]),
      Transaction.aggregate([
        { $match: { userId: objectUserId, category: "Investment" } }, // Match transactions for "Investment" category
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } } // Sum amounts
      ]),
    ]);

    // Format the response
    res.status(200).json({
      totalExpenses: totalExpenses[0]?.totalAmount || 0,
      totalIncome: totalIncome[0]?.totalAmount || 0,
      totalInvestments: totalInvestments[0]?.totalAmount || 0,
    });
  } catch (error) {
    console.error("Error:", error); // Log error for debugging
    res.status(500).json({ message: "Error calculating totals", error: (error as Error).message });
  }
});

// Route to get expense distribution by subCategory for a specific user
router.get("/expenses/distribution/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Convert userId to ObjectId
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Aggregate expenses by subCategory and sum the amounts
    const expenseDistribution = await Transaction.aggregate([
      { $match: { userId: objectUserId, category: "Expense" } },
      { $group: { _id: "$subCategory", totalAmount: { $sum: "$amount" } } }
    ]);

    // Respond with the grouped data
    res.status(200).json(expenseDistribution);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving expense distribution", error: (error as Error).message });
  }
});

export default router;
