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
import { Label, ExpandLess, ExpandMore, Settings, Home } from "@mui/icons-material";
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
  onOpenChange: (open: boolean) => void;
}

function Sidebar({ open, menuItems, isLoading, onOpenChange }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isHoverOpen, setIsHoverOpen] = useState(false);

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

  const handleMouseEnter = () => {
    if (!open) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setIsHoverOpen(true);
      onOpenChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    if (isHoverOpen) {
      const timeout = setTimeout(() => {
        onOpenChange(false);
        setIsHoverOpen(false);
      }, 300);
      setHoverTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  useEffect(() => {
    if (!open) {
      setIsHoverOpen(false);
    }
  }, [open]);

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

  const isMenuItemActive = (item: MenuItem, parentPath?: string): boolean => {
    // Build the full path for the current item
    const fullItemPath = pathUtils.combine(parentPath || "", item.path || "");

    if (pathname === fullItemPath) return true;

    // Check if any children are active
    return item.children.some((child) => isMenuItemActive(child, fullItemPath));
  };

  const listItemStyles = {
    root: (isActive: boolean, isChild = false) => ({
      display: "block",
      borderTop: isActive ? `1px solid ${theme.palette.primary.main}40` : "none",
      borderBottom: isActive ? `1px solid ${theme.palette.primary.main}40` : "none",
      backgroundColor: isActive ? theme.palette.primary.main + "08" : "inherit",
      borderLeft: !isChild && isActive ? `4px solid ${theme.palette.primary.main}` : "none",
      paddingLeft: !isChild && isActive ? 0 : "4px",
    }),
    button: (isChild: boolean) => ({
      height: isChild ? 36 : 48,
      justifyContent: open ? "initial" : "center",
      px: theme.spacing(isChild ? 4 : 2.5),
    }),
    icon: {
      minWidth: 0,
      mr: open ? theme.spacing(3) : "auto",
      justifyContent: "center",
    },
    text: (isChild: boolean) => ({
      opacity: open ? 1 : 0,
      "& .MuiTypography-root": {
        // fontSize: isChild ? "0.875rem" : "inherit",
        fontWeight: isChild ? "normal" : 600,
      },
    }),
    settingsButton: {
      marginTop: "auto",
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  };

  const renderMenuItem = (item: MenuItem, isChild = false, parentPath?: string | null) => {
    // Pass the parent path to isMenuItemActive
    const isActive = isMenuItemActive(item, parentPath || "");
    const hasChildren = item.children.length > 0;

    return (
      <ListItem disablePadding sx={listItemStyles.root(isActive, isChild)}>
        <ListItemButton
          sx={listItemStyles.button(isChild)}
          onClick={isChild ? handleNav(item.path, parentPath) : handleExpanded(item)}
        >
          {!isChild && (
            <ListItemIcon sx={listItemStyles.icon}>
              <Label />
            </ListItemIcon>
          )}
          <ListItemText primary={item.title} sx={listItemStyles.text(isChild)} />
          {hasChildren && !isChild && (expanded === item.title ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderChildItems = (item: MenuItem) => (
    <Collapse in={expanded === item.title} timeout="auto" unmountOnExit>
      <List disablePadding sx={listStyles.subList}>
        {item.children.map((child) => (
          <Fragment key={child.id}>
            {renderMenuItem(child, true, item.path)}
            <Divider />
          </Fragment>
        ))}
      </List>
    </Collapse>
  );

  return (
    <StyledDrawer variant="permanent" open={open} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DrawerHeader open={open} />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <List disablePadding>
          <ListItem disablePadding sx={listItemStyles.root(pathname === "/")}>
            <ListItemButton onClick={() => router.push("/")} sx={listItemStyles.button(false)}>
              <ListItemIcon sx={listItemStyles.icon}>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" sx={listItemStyles.text(false)} />
            </ListItemButton>
          </ListItem>
        </List>
        {/* <Divider /> */}

        {menuTree.map((item) => (
          <Fragment key={item.id}>
            <List disablePadding sx={listStyles.mainList(expanded === item.title)}>
              {renderMenuItem(item)}
              {item.children.length > 0 && renderChildItems(item)}
            </List>
            {/* <Divider /> */}
          </Fragment>
        ))}
        <ListItem disablePadding sx={listItemStyles.settingsButton}>
          <ListItemButton onClick={() => router.push("/settings")} sx={listItemStyles.button(false)}>
            <ListItemIcon sx={listItemStyles.icon}>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={listItemStyles.text(false)} />
          </ListItemButton>
        </ListItem>
      </Box>
    </StyledDrawer>
  );
}

export default Sidebar;
