"use client";

import { FormEvent } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { RoleData } from "@/libs/api/types";

interface AddRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onAddRole: (roleData: Partial<RoleData>) => void;
}

export default function AddRoleDialog({ open, onClose, onAddRole }: AddRoleDialogProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const formJson = Object.fromEntries(formData.entries());

    onAddRole(formJson);
    handleClose();
  };

  const handleClose = () => onClose();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        autoComplete: "off",
      }}
    >
      <DialogTitle>Add Role</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus
            inputProps={{
              autoComplete: "off",
            }}
            required
            id="role_name"
            name="role_name"
            label="Role Name"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
          />
          <TextField
            required
            id="description"
            name="description"
            label="Description"
            type="text"
            variant="outlined"
            size="small"
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" size="small" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" size="small" type="submit">
          Add Role
        </Button>
      </DialogActions>
    </Dialog>
  );
}
