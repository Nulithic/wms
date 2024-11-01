"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useMenuItems } from "@/libs/api/queries/admin/menuItemQueries";
import AddChildMenuItemDialog from "./AddChildMenuItemDialog";
import { SortableList } from "@/components/SortableList";
import { UniqueIdentifier } from "@dnd-kit/core";
import { MenuItemData } from "@/libs/api/types";

export default function MenuItemDetailsPage() {
  const { itemId } = useParams();
  const actualItemId = Array.isArray(itemId) ? itemId[0] : itemId;
  const { getMenuItems, updateMenuItem, deleteMenuItem, addMenuItem } = useMenuItems();
  const { data: menuItems, isLoading } = getMenuItems();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const currentItem = menuItems?.find((item) => item.id === actualItemId);
  const [localChildItems, setLocalChildItems] = useState<any[]>([]);

  const [title, setTitle] = useState(currentItem?.title || "");
  const [path, setPath] = useState(currentItem?.path || "");

  useEffect(() => {
    if (currentItem) {
      setTitle(currentItem.title || "");
      setPath(currentItem.path || "");
    }
  }, [currentItem]);

  useEffect(() => {
    if (menuItems) {
      const childItems = menuItems.filter((item) => item.parent_id === actualItemId);
      setLocalChildItems(childItems);
    }
  }, [menuItems, actualItemId]);

  const handleSave = async () => {
    if (currentItem) {
      // Find items that were deleted locally
      const deletedItems =
        menuItems?.filter(
          (item) => item.parent_id === actualItemId && !localChildItems.find((localItem) => localItem.id === item.id),
        ) || [];

      // Delete items (cascade will handle any nested children)
      for (const item of deletedItems) {
        await deleteMenuItem(item.id);
      }

      // Update parent item and existing items
      const updatedParent = {
        ...currentItem,
        title,
        path,
      };

      // Only update the parent and existing items (no more new items handling)
      await updateMenuItem([updatedParent, ...localChildItems]);
    }
  };

  const handleAddChild = async (childData: Partial<MenuItemData>) => {
    // Add to database immediately
    const newItem = await addMenuItem({
      title: childData.title || "",
      path: childData.path || "",
      group_id: childData.group_id || null,
      order_index: localChildItems.length,
      parent_id: actualItemId,
    });

    // Update local state with the real item from the database
    if (newItem) {
      setLocalChildItems([...localChildItems, newItem]);
    }
    setOpenAddDialog(false);
  };

  const handleDeleteChild = (childId: UniqueIdentifier) => {
    // Only update local state
    setLocalChildItems(localChildItems.filter((item) => item.id !== childId));
  };

  const handleChildrenChange = (items: any[]) => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index,
    }));
    setLocalChildItems(updatedItems);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Menu Item Details
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField
          label="Path"
          value={path}
          onChange={(e) => {
            let newPath = e.target.value;
            // Add leading slash if not present and path is not empty
            if (newPath && !newPath.startsWith("/")) {
              newPath = `/${newPath}`;
            }
            setPath(newPath);
          }}
          required
          helperText="Enter the path for this menu item (e.g., users)"
        />
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Child Items</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenAddDialog(true)}>
          Add Child Item
        </Button>
      </Box>

      <SortableList
        items={localChildItems}
        onChange={handleChildrenChange}
        renderItem={(item) => (
          <SortableList.Item id={item.id} onDelete={handleDeleteChild}>
            <SortableList.DragHandle />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="caption" color="textSecondary">
                Path: {item.path}
              </Typography>
            </Box>
          </SortableList.Item>
        )}
      />

      {currentItem && (
        <AddChildMenuItemDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAddChildItem={handleAddChild}
          parentItem={currentItem}
          currentChildCount={localChildItems.length}
        />
      )}
    </Box>
  );
}
