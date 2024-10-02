"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import MultiSelectChip from "@/components/MultiSelectChip";

import { UserData } from "@/libs/api/types";

const groupList = ["SPL", "Oved", "Tzumi"];

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (userData: Partial<UserData>) => void;
}

export default function AddUserDialog({ open, onClose, onAddUser }: AddUserDialogProps) {
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    if (formJson.password !== formJson.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Remove confirm field before sending to onAddUser
    const { confirm, ...userData } = formJson;
    onAddUser(userData);
    handleClose();
  };

  const handleClose = () => {
    setPasswordError(null);
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
      <DialogTitle>Add User</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus
            inputProps={{
              autoComplete: "off",
            }}
            required
            id="email"
            name="email"
            label="Email Address"
            type="email"
            variant="outlined"
            size="small"
            fullWidth
          />
          <TextField
            required
            autoComplete="new-password"
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            error={!!passwordError}
          />
          <TextField
            required
            id="confirm"
            name="confirm"
            label="Confirm Password"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            error={!!passwordError}
            helperText={passwordError}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" size="small" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" size="small" type="submit">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}
