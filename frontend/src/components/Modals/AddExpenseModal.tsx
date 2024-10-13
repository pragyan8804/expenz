import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

export const AddExpenseModal = ({ groupId }: { groupId: string }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);

  const handleAddExpense = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/groups/${groupId}/add-transaction`, {
        description,
        amount,
      });
      // Refresh the page or refetch group data here
      window.location.reload();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add a New Expense</DialogTitle>
        <div className="space-y-4">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button onClick={handleAddExpense}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
