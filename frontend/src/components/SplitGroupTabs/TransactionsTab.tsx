import { AddExpenseModal } from "../Modals/AddExpenseModal";

const TransactionsTab = ({ group, groupId }: { group: any; groupId: string }) => {
  return (
    <div>
      {/* Add Expense Button */}
      <div className="flex justify-between items-center my-4">
        <p className="text-lg text-gray-700 dark:text-gray-300">{group.description}</p>
        {groupId && <AddExpenseModal groupId={groupId} />}
      </div>

      {/* Transactions List */}
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">Transactions</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        {group.groupTransactions.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-400">No transactions yet</p>
        ) : (
          <ul>
            {group.groupTransactions.map((transaction: any) => (
              <li key={transaction._id} className="py-2 border-b border-gray-200 dark:border-gray-700">
                {transaction.paidBy.name} {" paid for "} {transaction.description} -{" "}
                <span className="text-green-500 font-bold">${transaction.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionsTab;
