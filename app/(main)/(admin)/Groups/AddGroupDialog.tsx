"use client";

import { useState, FormEvent } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";

import { GroupData } from "@/libs/api/types";

interface AddGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onAddGroup: (groupData: Partial<GroupData>) => void;
}

export default function AddGroupDialog({ open, onClose, onAddGroup }: AddGroupDialogProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    onAddGroup(formJson);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

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
      <DialogTitle>Add Group</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus
            required
            id="name"
            name="name"
            label="Group Name"
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
          Add Group
        </Button>
      </DialogActions>
    </Dialog>
  );
}
