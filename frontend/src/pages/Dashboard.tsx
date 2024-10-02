import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { AddTransactionModal } from "@/components/Dashboard/AddTransactionModal";
import { ExpenseChart } from "@/components/Dashboard/ExpenseChart";
import { IncomeVsExpenses } from "@/components/Dashboard/IncomeVsExpenses";

export function Dashboard() {
  return (
    <div className="flex bg-white dark:bg-black h-screen overflow-y-auto">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Financial Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-600">Total Expenses</h2>
            <p className="text-3xl font-bold mt-2">$2,450.00</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-600">Total Income</h2>
            <p className="text-3xl font-bold mt-2">$5,000.00</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-600">Total Investments</h2>
            <p className="text-3xl font-bold mt-2">$2,000.00</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 justify-center align-center">
          <ExpenseChart />
          <IncomeVsExpenses />
        </div>

        {/* Add Expense Button */}
        <div className="flex justify-end mb-8">
          <AddTransactionModal />
        </div>

        
      </main>
    </div>
  );
}
