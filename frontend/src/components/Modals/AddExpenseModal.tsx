import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { MultiSelect } from '@/components/ui/multi-select'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const AddExpenseModal = ({ groupId }: { groupId: string }) => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [paidBy, setPaidBy] = useState<string | undefined>(undefined)
  const [splitBetween, setSplitBetween] = useState<string[]>([])
  const [members, setMembers] = useState<{ _id: string; username: string }[]>(
    []
  )

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/groups/${groupId}`
        )
        setMembers(data.members)
      } catch (error) {
        console.error('Error fetching group members:', error)
      }
    }

    fetchGroupMembers()
  }, [groupId])

  const handleAddExpense = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/group-transactions/add`,
        {
          amount,
          description,
          paidBy,
          groupId,
          splitBetween,
        }
      )
      window.location.reload()
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="dark:text-white">Add a New Expense</DialogTitle>
        <div className="space-y-4 dark:text-white">
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value ? Number(e.target.value) : 0)
              }
            />
            {/* Paid By (Dropdown Menu) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {paidBy
                    ? members.find((m) => m._id === paidBy)?.username
                    : 'Paid By'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup
                  value={paidBy}
                  onValueChange={setPaidBy}
                >
                  {members.map((member) => (
                    <DropdownMenuRadioItem key={member._id} value={member._id}>
                      {member.username}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Split Between (Multi-Select) */}
          <MultiSelect
            options={members.map((member) => ({
              label: member.username,
              value: member._id,
            }))}
            onValueChange={setSplitBetween}
            defaultValue={splitBetween}
            placeholder="Split Between"
          />
          {/* Add Expense Button */}
          <div className="flex justify-end">
            <Button onClick={handleAddExpense}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
