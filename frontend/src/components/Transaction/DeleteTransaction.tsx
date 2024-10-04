import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

interface DeleteTransactionProps {
  transactionId: string;
  onDeleteSuccess: (id: string) => void;
}

const DeleteTransaction: React.FC<DeleteTransactionProps> = ({ transactionId, onDeleteSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found.");
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction.");
      }

      // Call the success callback after the transaction is successfully deleted
      onDeleteSuccess(transactionId);
      setIsOpen(false);
      window.location.reload(); //refresh the page so that the deleted transaction vanishes from the screen
    } catch (err: any) {
      setError(err.message || 'Error deleting transaction.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-red-500">
            <Trash2Icon className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>Do you really want to delete this transaction? This action cannot be undone.</p>
          {error && <p className="text-red-500">{error}</p>}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteTransaction;
