"use client";

import { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SortableList } from "@/components/SortableList";
import { useMenuItems } from "@/libs/api/queries/admin/menuItemQueries";
import { UniqueIdentifier } from "@dnd-kit/core";
import AddMenuItemDialog from "./AddMenuItemDialog";

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const StyledInstructions = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export default function MenuItemsPage() {
  const { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();
  const { data: menuItems, isLoading } = getMenuItems();
  const [localItems, setLocalItems] = useState(menuItems || []);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    if (menuItems) {
      const filteredItems = menuItems.filter((item) => !deletedIds.includes(item.id));
      setLocalItems(filteredItems);
    }
  }, [menuItems, deletedIds]);

  const handleChange = (items: any[]) => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index,
    }));
    setLocalItems(updatedItems);
  };

  const handleDelete = (id: UniqueIdentifier) => {
    const stringId = id.toString();
    setDeletedIds((prev) => [...prev, stringId]);
    setLocalItems((prev) => prev.filter((item) => item.id !== stringId));
  };

  const handleSave = async () => {
    if (deletedIds.length > 0) {
      for (const id of deletedIds) {
        await deleteMenuItem(id);
      }
      setDeletedIds([]);
    }

    await updateMenuItem(localItems);
  };

  const handleAddMenuItem = async (menuItemData: any) => {
    await addMenuItem(menuItemData);
    setOpenAddDialog(false);
  };

  const hasChanges = () => {
    if (deletedIds.length > 0) return true;
    if (!menuItems || menuItems.length !== localItems.length) return true;

    return localItems.some((item, index) => {
      const originalItem = menuItems.find((mi) => mi.id === item.id);
      return originalItem && originalItem.order_index !== index;
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
      <StyledHeader>
        <Typography variant="h6" component="h1">
          Menu Items
        </Typography>
      </StyledHeader>
      <StyledInstructions>
        Drag each menu item to the preferred order. Click the name of the menu item to edit configuration options.
      </StyledInstructions>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)}>
          Add
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!hasChanges()}>
          Save Changes
        </Button>
      </Box>
      <SortableList
        items={localItems}
        onChange={handleChange}
        renderItem={(item) => (
          <SortableList.Item id={item.id} onDelete={handleDelete}>
            <SortableList.DragHandle />
            <Box component="span">{item.title}</Box>
          </SortableList.Item>
        )}
      />
      <AddMenuItemDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAddMenuItem={handleAddMenuItem}
        menuItems={localItems}
      />
    </Box>
  );
}
