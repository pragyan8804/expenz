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
        { $match: { userId: objectUserId, category: "Expense" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { userId: objectUserId, category: "Income" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { userId: objectUserId, category: "Investment" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
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

// Route to get income and expenses by month for a specific user
router.get("/totals/monthly/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Convert userId to ObjectId for aggregation queries
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Aggregate income and expenses by month for the user
    const monthlyData = await Transaction.aggregate([
      { $match: { userId: objectUserId } }, // Filter by userId
      {
        $group: {
          _id: {
            month: { $month: "$date" },    // Group by month
            year: { $year: "$date" },      // Also group by year to avoid issues across different years
            category: "$category"          // Group by category (Income or Expense)
          },
          totalAmount: { $sum: "$amount" } // Sum amounts for each category
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.category", "Income"] }, "$totalAmount", 0]
            }
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ["$_id.category", "Expense"] }, "$totalAmount", 0]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          income: 1,
          expenses: 1
        }
      }
    ]);

    res.status(200).json(monthlyData);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving monthly income and expenses", error: (error as Error).message });
  }
});

export default router;
