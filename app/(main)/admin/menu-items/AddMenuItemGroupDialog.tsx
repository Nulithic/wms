import { FormEvent } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";

interface AddMenuItemGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onAddGroup: (groupData: any) => void;
}

export default function AddMenuItemGroupDialog({ open, onClose, onAddGroup }: AddMenuItemGroupDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    onAddGroup({
      name,
      order_index: 0, // You might want to adjust this
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Menu Item Group</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField name="name" label="Group Name" required fullWidth autoFocus />
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
