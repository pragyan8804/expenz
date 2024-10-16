import { Sidebar } from "@/components/Sidebar";
import { AddGroupModal } from "@/components/Modals/AddGroupModal";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useFormatDate from "@/hooks/useFormatDate";

interface User {
  _id: string;
  username: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  members: User[];
  createdAt: string;
}

const Split = () => {
  const { formatDate } = useFormatDate();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const currentUserId = localStorage.getItem("userId");

  // Fetch groups from backend
  useEffect(() => {
    const fetchGroups = () => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups?userId=${currentUserId}`)
        .then(response => {
          setGroups(response.data); // Handle the groups data
        })
        .catch(error => {
          console.error("Error fetching groups:", error);
        });
    };
    fetchGroups();
  }, []);

  // Handle group card click
  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar />

      <div className="flex flex-col items-center max-w-4xl mx-auto w-full p-4 h-screen overflow-y-auto">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Split the Bill</h1>

        <div className="flex w-full mb-4 gap-x-4 py-4 justify-between">
          <Input
            placeholder="Search groups..."
            className="w-full bg-white border-gray-300 dark:bg-black dark:border-gray-600 dark:text-white max-w-md"
          />
          <AddGroupModal />
        </div>

        <div className="grid grid-cols-1 gap-4 w-full">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => handleGroupClick(group._id)}
              className="bg-white dark:bg-black border border-gray-300 dark:border-gray-600 p-4 rounded-lg shadow hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-950 transition-all flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{group.name}</h2>
                <p className="text-gray-700 dark:text-gray-400">
                  Members: {group.members.map((member: User) => member.username).join(", ")}
                </p>
              </div>
              <span className="text-gray-500 dark:text-gray-300">{formatDate(group.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Split;
