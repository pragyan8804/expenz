import { SettleUpModal } from "../Modals/SettleUpModal";


const SettleUpTab = ({ group }: { group: any }) => {
  return (
    <div className="my-4 dark:text-white">
    <SettleUpModal groupId={group._id} />

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">Who Owes Whom</h2>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        {group.owes.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-400">No one owes anyone yet</p>
        ) : (
          <ul>
            {group.owes.map((debt: any, index: number) => (
              <li key={index} className="py-2 border-b border-gray-200 dark:border-gray-700">
                {debt.from.name} owes {debt.to.name}{" "}
                <span className="text-red-500 font-bold">${debt.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SettleUpTab;
