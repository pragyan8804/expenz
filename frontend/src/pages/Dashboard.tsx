import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { AddTransactionModal } from "@/components/Dashboard/AddTransactionModal";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { IncomeVsExpenses } from "@/components/Dashboard/IncomeVsExpenses";
import axios from "axios";

export function Dashboard() {
  const [totals, setTotals] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    totalInvestments: 0,
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchTotals() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/totals/${userId}`);
        setTotals(response.data);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }

    fetchTotals();
  }, [userId]);

  return (
    <div className="flex bg-white dark:bg-black ">
      <Sidebar />

      <main className="flex-1 p-8 dark:bg-black dark:text-white  h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Financial Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Total Expenses</h2>
            <p className="text-3xl font-bold mt-2">${totals.totalExpenses.toFixed(2)}</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Total Income</h2>
            <p className="text-3xl font-bold mt-2">${totals.totalIncome.toFixed(2)}</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Total Investments</h2>
            <p className="text-3xl font-bold mt-2">${totals.totalInvestments.toFixed(2)}</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 justify-center align-center">
          <ExpenseChart />
          <IncomeVsExpenses />
        </div>

        {/* Add Expense Button */}
        <div className="fixed bottom-4 right-4">
          <AddTransactionModal />
        </div>
      </main>
    </div>
  );
}
