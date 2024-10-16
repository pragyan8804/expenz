import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import axios from "axios";

export const SettleUpModal = ({ groupId }: { groupId: string }) => {
  const [amount, setAmount] = useState<number>(0);
  const [paidBy, setPaidBy] = useState<string | undefined>(undefined);
  const [paidTo, setPaidTo] = useState<string | undefined>(undefined);
  const [members, setMembers] = useState<{ _id: string; username: string }[]>([]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/groups/${groupId}`);
        setMembers(data.members);
      } catch (error) {
        console.error("Error fetching group members:", error);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  const handleSettleUp = async () => {
    if (!paidBy || !paidTo || amount <= 0) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/group-transactions/settle-up`, {
        amount,
        paidBy,
        paidTo,
        groupId,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error settling up:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Settle Up</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="dark:text-white">Settle Up</DialogTitle>
        <div className="space-y-4 flex flex-col dark:text-white">
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {paidBy ? members.find((m) => m._id === paidBy)?.username : "Paid By"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={paidBy} onValueChange={setPaidBy}>
                  {members.map((member) => (
                    <DropdownMenuRadioItem key={member._id} value={member._id}>
                      {member.username}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {paidTo ? members.find((m) => m._id === paidTo)?.username : "Paid To"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={paidTo} onValueChange={setPaidTo}>
                  {members.map((member) => (
                    <DropdownMenuRadioItem key={member._id} value={member._id}>
                      {member.username}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : 0)}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSettleUp}>Settle Up</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
