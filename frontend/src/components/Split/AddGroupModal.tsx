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

export function AddGroupModal() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Group</Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black dark:bg-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
          <DialogDescription>
            Enter the details of your new group below.
          </DialogDescription>
        </DialogHeader>

        {/* Group Form */}
        <div className="space-y-4">
          {/* Group Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group Name"
            />
          </div>

          {/* Group Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group Description"
            />
          </div>

          {/* Group Members */}
          <div>
            <Label htmlFor="members">Members</Label>
            <Input
              id="members"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="Members (comma separated)"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Add Group</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

