"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import MultiSelectChip from "@/components/MultiSelectChip";

import { UserData } from "@/libs/api/types";
import { useRoles } from "@/libs/api/queries/rolesQueries";

const groupList = ["SPL", "Oved", "Tzumi"];

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (userData: Partial<UserData>) => void;
}

export default function AddUserDialog({ open, onClose, onAddUser }: AddUserDialogProps) {
  const { getRoles } = useRoles();
  const { data: roles, isLoading, isError } = getRoles({ page: 1, perPage: 1000 });

  const [roleList, setRoleList] = useState<string[]>([]);

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

  useEffect(() => {
    if (isLoading) return;
    if (isError) return;
    setRoleList(roles?.map((role) => role.role_name) || []);
  }, [isLoading, isError, roles]);

  console.log(roleList);

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
