import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TransactionsTab from "@/components/SplitGroupTabs/TransactionsTab";
import SettleUpTab from "@/components/SplitGroupTabs/SettleUpTab";
import GroupDetailsTab from "@/components/SplitGroupTabs/GroupDetailsTab";

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

        <h1 className="text-3xl font-bold text-black dark:text-white mb-4">{group.name}</h1>

        <p className="text-lg text-gray-700 dark:text-gray-300">{group.description}</p>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="my-4">
          <TabsList>
            <TabsTrigger value="transactions">Expenses</TabsTrigger>
            <TabsTrigger value="settle-up">Settle Up</TabsTrigger>
            <TabsTrigger value="details">Group Details</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <TransactionsTab group={group} groupId={groupId || ''} />
          </TabsContent>
          <TabsContent value="settle-up">
            <SettleUpTab group={group} />
          </TabsContent>
          <TabsContent value="details">
            <GroupDetailsTab group={group} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Group;
