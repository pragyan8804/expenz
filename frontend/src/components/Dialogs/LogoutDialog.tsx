import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LogoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const LogoutDialog = ({ isOpen, onOpenChange }: LogoutDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="dark:text-white">Are you sure you want to log out?</DialogTitle>
        <DialogDescription>
          <div className="flex justify-end gap-3 dark:text-white">
            <Button onClick={() => onOpenChange(false)}>No</Button>
            <Link to="/" onClick={() => onOpenChange(false)}>
              <Button variant="destructive">Log Out</Button>
            </Link>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
