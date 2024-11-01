"use client";

import { useState, useEffect } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import { SortableList } from "@/components/SortableList";
import { useMenuItems } from "@/libs/api/queries/admin/menuItemQueries";
import { useMenuItemGroups } from "@/libs/api/queries/admin/menuItemGroupQueries";
import { UniqueIdentifier } from "@dnd-kit/core";
import AddMenuItemDialog from "./AddMenuItemDialog";
import { useParams, useRouter } from "next/navigation";

export default function GroupMenuItemsPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();
  const { getMenuItemGroups } = useMenuItemGroups();
  const { data: menuItems, isLoading } = getMenuItems();
  const { data: group } = getMenuItemGroups();

  const [localItems, setLocalItems] = useState(menuItems || []);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const filteredItems = localItems.filter((item) => item.group_id === groupId && !item.parent_id);

  useEffect(() => {
    if (menuItems) {
      setLocalItems(menuItems);
    }
  }, [menuItems]);

  const handleAddMenuItem = async (menuItemData: any) => {
    await addMenuItem({
      ...menuItemData,
      group_id: groupId,
    });
    setOpenAddDialog(false);
  };

  const handleChange = (items: any[]) => {
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index,
    }));

    console.log(updatedItems);

    setLocalItems(updatedItems);
  };

  const handleItemClick = (itemId: string) => {
    router.push(`/Admin/MenuItems/${groupId}/${itemId}`);
  };

  const handleDeleteItem = (id: UniqueIdentifier) => {
    if (window.confirm("Are you sure you want to delete this menu item? This will also delete all child items.")) {
      const updatedItems = localItems
        .map((item) => {
          if (item.group_id === groupId) {
            return item.id !== id ? item : null;
          }
          return item;
        })
        .filter(Boolean) as typeof localItems;

      setLocalItems(updatedItems);
    }
  };

  const handleSave = async () => {
    // Get original parent items from this group
    const originalParentItems = menuItems?.filter((item) => item.group_id === groupId && !item.parent_id) || [];

    // Find parent items that were deleted from this group
    const deletedItems = originalParentItems.filter((originalItem) => {
      const stillExists = localItems.some(
        (localItem) => localItem.id === originalItem.id && localItem.group_id === groupId,
      );
      return !stillExists;
    });

    // Delete items first
    for (const item of deletedItems) {
      await deleteMenuItem(item.id);
    }

    // Then update the remaining parent items from this group
    const remainingItems = localItems.filter((item) => item.group_id === groupId && !item.parent_id);

    if (remainingItems.length > 0) {
      await updateMenuItem(remainingItems);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Typography variant="h5">Menu Item Group</Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">{group?.find((g) => g.id === groupId)?.name || "Menu Items"}</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
            Add Item
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>

      <SortableList
        items={filteredItems}
        onChange={handleChange}
        renderItem={(item) => (
          <SortableList.Item id={item.id} onDelete={handleDeleteItem}>
            <SortableList.DragHandle />
            <Box
              onClick={() => handleItemClick(item.id)}
              sx={{
                flex: 1,
                cursor: "pointer",
              }}
            >
              <Typography>{item.title}</Typography>
              <Typography variant="caption" color="textSecondary">
                {item.path}
              </Typography>
            </Box>
          </SortableList.Item>
        )}
      />

      <AddMenuItemDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAddMenuItem={handleAddMenuItem}
        menuItems={filteredItems}
        groupId={groupId as string}
      />
    </Box>
  );
}
