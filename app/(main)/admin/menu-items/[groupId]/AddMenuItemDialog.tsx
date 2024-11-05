import { FormEvent } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { pathUtils } from "@/utils/pathUtils";
interface AddMenuItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAddMenuItem: (menuItemData: any) => void;
  menuItems: any[];
  groupId: string;
}

export default function AddMenuItemDialog({
  open,
  onClose,
  onAddMenuItem,
  menuItems,
  groupId,
}: AddMenuItemDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const path = pathUtils.removeLeadingSlash(formData.get("path") as string);

    const lastOrderIndex = menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.order_index)) + 1 : 0;

    const newMenuItem = {
      title,
      path,
      group_id: groupId,
      order_index: lastOrderIndex,
    };

    onAddMenuItem(newMenuItem);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Menu Item</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField name="title" label="Title" required fullWidth autoFocus />
          <TextField
            name="path"
            label="Path"
            required
            fullWidth
            helperText="Enter the path for this menu item (e.g., admin)"
          />
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
