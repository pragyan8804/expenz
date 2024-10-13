import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AddExpenseModal } from "@/components/Modals/AddExpenseModal";

const Group = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/${groupId}`);
        setGroup(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group:", error);
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto py-5 max-w-4xl">
        {/* Group Heading */}
        <h1 className="text-3xl font-bold text-black dark:text-white">{group.name}</h1>

        {/* Group members */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">Group Members</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          {group.members.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-400">No members yet</p>
          ) : (
            <ul>
              {group.members.map((member: any) => (
                <li key={member._id} className="py-2 border-b border-gray-200 dark:border-gray-700">
                  {member.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Group Description and Add Expense Button */}
        <div className="flex justify-between items-center my-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">{group.description}</p>
          {groupId && <AddExpenseModal groupId={groupId} />}
        </div>

        {/* Who Owes Whom */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">Who Owes Whom</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          {group.owes.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-400">No one owes anyone yet</p>
          ) : (
            <ul>
              {group.owes.map((debt: any, index: number) => (
                <li key={index} className="py-2 border-b border-gray-200 dark:border-gray-700">
                  {/* Display username instead of userId */}
                  {debt.from.name} owes {debt.to.name}{" "}
                  <span className="text-red-500 font-bold">${debt.amount.toFixed(2)}</span> {/* Colored amount */}
                </li>
              ))}
            </ul>
          )}
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
                  {transaction.description} -{" "}
                  <span className="text-green-500 font-bold">${transaction.amount.toFixed(2)}</span> {/* Colored transaction amount */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Group;
