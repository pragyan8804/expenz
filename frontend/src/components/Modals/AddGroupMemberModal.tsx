import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'

export function AddGroupMemberModal({ groupId }: { groupId: string }) {
  const [members, setMembers] = useState([
    { username: '', valid: null as boolean | null },
  ]) // Validity check

  const addMembers = () =>
    setMembers([...members, { username: '', valid: null }])

  const removeMembers = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index)
    setMembers(updatedMembers)
  }

  const handleUsernameChange = async (index: number, username: string) => {
    const updatedMembers = [...members]
    updatedMembers[index].username = username

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/check-username/${username}`
      )
      updatedMembers[index].valid = response.status === 200 ? true : false
    } catch (error) {
      updatedMembers[index].valid = false
    }

    setMembers(updatedMembers)
  }

  const handleSubmit = async () => {
    const validMembers = members.filter((p) => p.valid).map((p) => p.username)

    if (validMembers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one valid member.',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/groups/add-member/${groupId}`,
        {
          usernames: validMembers,
        }
      )

      if (response.status === 200) {
        toast({
          title: 'Members added',
          description: 'Group members added successfully',
          variant: 'default',
        })
        window.location.reload()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add members',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add members',
        variant: 'destructive',
      })
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Group Member</Button>
      </DialogTrigger>
      <DialogContent className="dark:text-white">
        <DialogHeader>
          <DialogTitle>Add Group Members</DialogTitle>
          <DialogDescription>
            Add members to your existing group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={member.username}
                onChange={(e) => handleUsernameChange(index, e.target.value)}
                placeholder="Username"
                className={
                  member.valid === true
                    ? 'border-green-500'
                    : member.valid === false
                    ? 'border-red-500'
                    : ''
                }
              />
              <button
                onClick={() => removeMembers(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 />
              </button>
            </div>
          ))}
          <Button onClick={addMembers} variant="outline">
            Add Member
          </Button>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Members</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
