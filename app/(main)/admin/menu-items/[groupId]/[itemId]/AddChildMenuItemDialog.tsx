import { FormEvent } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { MenuItemData } from "@/libs/api/types";
import { pathUtils } from "@/utils/pathUtils";
interface AddChildMenuItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAddChildItem: (menuItemData: Partial<MenuItemData>) => void;
  parentItem: MenuItemData;
  currentChildCount: number;
}

export default function AddChildMenuItemDialog({
  open,
  onClose,
  onAddChildItem,
  parentItem,
  currentChildCount,
}: AddChildMenuItemDialogProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const path = pathUtils.removeLeadingSlash(formData.get("path") as string);

    onAddChildItem({
      title,
      path,
      parent_id: parentItem.id,
      group_id: parentItem.group_id,
      order_index: currentChildCount,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Child Menu Item</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField name="title" label="Title" required fullWidth autoFocus />
          <TextField
            name="path"
            label="Path"
            required
            fullWidth
            helperText="Enter the path for this menu item (e.g., /admin/users)"
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
