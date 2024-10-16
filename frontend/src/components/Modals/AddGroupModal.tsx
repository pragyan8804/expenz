import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export function AddGroupModal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState([{ username: "", valid: null as boolean | null }]); // Allow true, false, and null

  // Function to handle adding a new participant input
  const addMembers = () => {
    setMembers([...members, { username: "", valid: null }]);
  };

  // Function to handle removing a participant
  const removeMembers = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  // Function to handle username change and validate it with backend
  const handleUsernameChange = async (index: number, username: string) => {
    const updatedMembers = [...members];
    updatedMembers[index].username = username;

    // Send request to backend to check if username exists
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/check-username/${username}`);
      updatedMembers[index].valid = response.status === 200 ? true : false; // Username exists or not
    } catch (error) {
      updatedMembers[index].valid = false; // Username doesn't exist
    }

    setMembers(updatedMembers);
  };


  //First get the userId from the backend, then hit the create route
  // Handle form submission to create the group
  const handleSubmit = async () => {
  // Filter valid members
  const validMembers = members.filter(p => p.valid).map(p => p.username);

  if (validMembers.length === 0) {
    toast({
      title: "Error",
      description: "Please add at least one valid member.",
      variant: "destructive",
    })
    return;
  }

  try {
    // Fetch ObjectIds for valid usernames
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/users/ids`, { usernames: validMembers });

    const userIds = response.data; // Array of ObjectIds

    const groupData = {
      name,
      description,
      members: userIds  // Use ObjectIds instead of usernames
    };

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/groups/create`, groupData);

    if (res.status === 201) {
      toast({
        title: "Group created",
        description: "Group created successfully",
        variant: "default",
      })
      setIsOpen(false);
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      })
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create group",
      variant: "destructive",
    })
    console.error(error);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Group</Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black dark:bg-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add Group</DialogTitle>
          <DialogDescription className="dark:text-white">
            Enter the details of your new group below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 dark:text-white">
          <div>
            <Label htmlFor="name" className="dark:text-white">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group Name"
              className="dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="dark:text-white">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group Description"
              className="dark:text-white"
            />
          </div>

          <div>
            <Label className="dark:text-white">Members</Label>

            {members.map((member, index) => (
              <div key={index} className="flex items-center mt-2 space-x-2">
                <Input
                  value={member.username}
                  onChange={(e) => handleUsernameChange(index, e.target.value)}
                  placeholder="Username"
                  className={`${
                    member.valid === true
                      ? "border-green-500"
                      : member.valid === false
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  onClick={() => removeMembers(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            ))}

            <Button
              onClick={addMembers}
              variant="outline"
              className="mt-2 dark:text-white"
            >
              Add Member
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Add Group</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
