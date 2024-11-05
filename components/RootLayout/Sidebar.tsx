import { useState, Fragment, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Box,
} from "@mui/material";
import { Label, ExpandLess, ExpandMore, Settings } from "@mui/icons-material";
import { StyledDrawer } from "@/styles/layoutStyles";
import DrawerHeader from "./DrawerHeader";
import { MenuItemData } from "@/libs/api/types";
import { pathUtils } from "@/utils/pathUtils";
interface MenuItem extends MenuItemData {
  children: MenuItem[];
}

interface SidebarProps {
  open: boolean;
  menuItems: MenuItemData[] | undefined;
  isLoading: boolean;
}

function Sidebar({ open, menuItems, isLoading }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (menuItems) {
      const tree = buildMenuTree(menuItems);
      setMenuTree(tree);
    }
  }, [menuItems]);

  const buildMenuTree = (items: MenuItemData[]): MenuItem[] => {
    const itemMap = new Map<string, MenuItem>();

    // First, convert all items to MenuItem type with empty children array
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    const tree: MenuItem[] = [];

    // Then build the tree structure
    items.forEach((item) => {
      const menuItem = itemMap.get(item.id);
      if (menuItem) {
        if (item.parent_id === null) {
          tree.push(menuItem);
        } else {
          const parent = itemMap.get(item.parent_id);
          if (parent) {
            parent.children.push(menuItem);
          }
        }
      }
    });

    // Sort by order_index
    tree.sort((a, b) => a.order_index - b.order_index);
    tree.forEach((item) => {
      item.children.sort((a, b) => a.order_index - b.order_index);
    });

    return tree;
  };

  const handleNav = (path: string | null, parentPath?: string | null) => (): void => {
    if (path) {
      const fullPath = pathUtils.combine(parentPath || "", path);
      router.push(fullPath);
    }
  };

  const handleExpanded = (item: MenuItem) => (): void => {
    if (item.children.length > 0) {
      setExpanded(expanded === item.title ? false : item.title);
    } else if (item.path) {
      router.push(item.path);
      setExpanded(false);
    }
  };

  const listStyles = {
    mainList: (isExpanded: boolean) => ({
      backgroundColor: isExpanded ? theme.palette.action.hover : theme.palette.background.paper,
      boxShadow: isExpanded ? `inset 4px 0 ${theme.palette.primary.main}` : "none",
      position: "relative",
      zIndex: 1,
    }),
    subList: {
      position: "relative",
      zIndex: 0,
      marginLeft: theme.spacing(0.5),
    },
  };

  const listItemStyles = {
    root: (isActive: boolean) => ({
      display: "block",
      backgroundColor: isActive ? theme.palette.action.selected : "inherit",
    }),
    button: (isSubItem: boolean) => ({
      minHeight: 48,
      justifyContent: open ? "initial" : "center",
      px: theme.spacing(isSubItem ? 4 : 2.5),
    }),
    icon: {
      minWidth: 0,
      mr: open ? theme.spacing(3) : "auto",
      justifyContent: "center",
    },
    text: {
      opacity: open ? 1 : 0,
    },
    settingsButton: {
      marginTop: "auto",
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  };

  const renderMenuItem = (item: MenuItem, isChild = false, parentPath?: string | null) => {
    const isActive = item.path ? pathname === item.path : false;
    const hasChildren = item.children.length > 0;

    return (
      <ListItem disablePadding sx={listItemStyles.root(isActive)}>
        <ListItemButton
          sx={listItemStyles.button(isChild)}
          onClick={isChild ? handleNav(item.path, parentPath) : handleExpanded(item)}
        >
          <ListItemIcon sx={listItemStyles.icon}>
            <Label />
          </ListItemIcon>
          <ListItemText primary={item.title} sx={listItemStyles.text} />
          {hasChildren && !isChild && (expanded === item.title ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderChildItems = (item: MenuItem) => (
    <Collapse in={expanded === item.title} timeout="auto" unmountOnExit>
      <List disablePadding sx={listStyles.subList}>
        {item.children.map((child) => (
          <Fragment key={child.id}>{renderMenuItem(child, true, item.path)}</Fragment>
        ))}
      </List>
    </Collapse>
  );

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader />
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {menuTree.map((item) => (
          <Fragment key={item.id}>
            <List disablePadding sx={listStyles.mainList(expanded === item.title)}>
              {renderMenuItem(item)}
              {item.children.length > 0 && renderChildItems(item)}
            </List>
          </Fragment>
        ))}
        <ListItem disablePadding sx={listItemStyles.settingsButton}>
          <ListItemButton onClick={() => router.push("/settings")} sx={listItemStyles.button(false)}>
            <ListItemIcon sx={listItemStyles.icon}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={listItemStyles.text} />
          </ListItemButton>
        </ListItem>
      </Box>
    </StyledDrawer>
  );
}

export default Sidebar;
