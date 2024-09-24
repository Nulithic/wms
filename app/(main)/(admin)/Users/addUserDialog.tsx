"use client";

import { useState, FormEvent } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import MultiSelectChip from "@/components/MultiSelectChip";
import { UserData } from "@/libs/api/types";

const roleList = ["Admin", "Manager", "Customer"];
const groupList = ["SPL", "Oved", "Tzumi"];

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (userData: Partial<UserData>) => void;
}

export default function AddUserDialog({ open, onClose, onAddUser }: AddUserDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // formData.append("roles", selectedRoles.join(","));
    // formData.append("groups", selectedGroups.join(","));

    const formJson = Object.fromEntries(formData.entries());

    // Add roles and groups as arrays
    formJson.roles = JSON.stringify(selectedRoles);
    formJson.groups = JSON.stringify(selectedGroups);

    onAddUser(formJson);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedRoles([]);
    setSelectedGroups([]);
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
          />
          <MultiSelectChip
            itemList={roleList}
            label="Roles"
            selectedValues={selectedRoles}
            setSelectedValues={setSelectedRoles}
          />
          <MultiSelectChip
            itemList={groupList}
            label="Groups"
            selectedValues={selectedGroups}
            setSelectedValues={setSelectedGroups}
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
