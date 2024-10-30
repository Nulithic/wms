import { FormEvent } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";

interface AddMenuItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAddMenuItem: (menuItemData: any) => void;
  menuItems: any[];
}

export default function AddMenuItemDialog({ open, onClose, onAddMenuItem, menuItems }: AddMenuItemDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;

    // Set order_index to be last in the list
    const lastOrderIndex = menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.order_index)) + 1 : 0;

    onAddMenuItem({
      title,
      order_index: lastOrderIndex,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Menu Item</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField name="title" label="Title" required fullWidth autoFocus />
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
