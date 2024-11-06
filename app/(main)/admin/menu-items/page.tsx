"use client";

import { Box, Button, Typography } from "@mui/material";
import { useMenuItemGroups } from "@/libs/api/queries/admin/menuItemGroupQueries";
import { useRouter, usePathname } from "next/navigation";
import AddMenuItemGroupDialog from "./AddMenuItemGroupDialog";
import { useState, useEffect } from "react";
import { SortableList } from "@/components/SortableList";
import { MenuItemGroupData } from "@/libs/api/types";

export default function MenuItemsPage() {
  const router = useRouter();
  const { getMenuItemGroups, addMenuItemGroup, updateMenuItemGroup, deleteMenuItemGroup } = useMenuItemGroups();
  const { data: groups, isLoading } = getMenuItemGroups();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [localGroups, setLocalGroups] = useState<MenuItemGroupData[]>([]);
  const [deletedGroups, setDeletedGroups] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (groups) {
      setLocalGroups(groups);
      setHasChanges(false);
    }
  }, [groups]);

  const handleAddGroup = async (groupData: Omit<MenuItemGroupData, "id">) => {
    const response = await addMenuItemGroup(groupData);
    setOpenAddDialog(false);
    if (response.data) {
      setLocalGroups([...localGroups, response.data]);
      setHasChanges(true);
    }
  };

  const pathname = usePathname();

  const handleGroupClick = (groupId: string) => {
    router.push(`${pathname}/${groupId}`);
  };

  const handleDeleteGroup = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this group? This will also delete all menu items in this group.")
    ) {
      setDeletedGroups([...deletedGroups, id]);
      setLocalGroups(localGroups.filter((group) => group.id !== id));
      setHasChanges(true);
    }
  };

  const handleChange = (items: MenuItemGroupData[]) => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index,
    }));
    setLocalGroups(updatedItems);
    setHasChanges(true);
  };

  const handleSave = async () => {
    // First delete any groups that were marked for deletion
    for (const groupId of deletedGroups) {
      await deleteMenuItemGroup(groupId);
    }
    setDeletedGroups([]); // Clear the deleted groups array

    // Update all changed groups in a single request
    const changedGroups = localGroups.filter((localGroup) => {
      const originalGroup = groups?.find((g) => g.id === localGroup.id);
      return originalGroup && originalGroup.order_index !== localGroup.order_index;
    });

    if (changedGroups.length > 0) {
      await updateMenuItemGroup(changedGroups);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Menu Item Groups</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
            Add Group
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={!hasChanges}>
            Save Changes
          </Button>
        </Box>
      </Box>

      <SortableList
        items={localGroups}
        onChange={handleChange}
        renderItem={(group) => (
          <SortableList.Item id={group.id} onDelete={() => handleDeleteGroup(group.id)}>
            <SortableList.DragHandle />
            <Box
              onClick={() => handleGroupClick(group.id)}
              sx={{
                flex: 1,
                cursor: "pointer",
              }}
            >
              <Typography variant="h6">{group.name}</Typography>
            </Box>
          </SortableList.Item>
        )}
      />

      <AddMenuItemGroupDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAddGroup={handleAddGroup}
      />
    </Box>
  );
}
