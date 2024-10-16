import { AddGroupMemberModal } from "../Modals/AddGroupMemberModal";

const GroupDetailsTab = ({ group }: { group: any }) => {
  return (
    <div className="my-4 dark:text-white">

      <AddGroupMemberModal groupId={group._id} />

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">
        Group Members
      </h2>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        {group.members.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-400">No members yet</p>
        ) : (
          <ul>
            {group.members.map((member: any) => (
              <li key={member._id} className="py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg text-gray-900 dark:text-white">
                  {member.name || 'Name Not Available'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {' '}({member.username})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">
        Description
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-lg text-gray-700 dark:text-gray-300">{group.description}</p>
      </div> */}
    </div>
  );
};

export default GroupDetailsTab;
