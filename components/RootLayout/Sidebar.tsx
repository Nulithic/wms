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
import { useMenuItems } from "@/libs/api/queries/admin/menuItemQueries";
import { MenuItemData } from "@/libs/api/types";
type UserItem = {
  title: string;
  path: string;
  subItems: UserItem[];
  hasSubItems: boolean;
};

interface SidebarProps {
  open: boolean;
  userItems: UserItem[];
}

function Sidebar({ open, userItems }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | false>(false);

  // Menu Items

  const { getMenuItems } = useMenuItems();
  const { data: menuItems, isLoading, isError } = getMenuItems();

  const [menuTree, setMenuTree] = useState<MenuItemData[]>([]);

  useEffect(() => {
    if (menuItems) {
      const tree = buildMenuTree(menuItems);
      setMenuTree(tree);
    }
  }, [menuItems]);

  const buildMenuTree = (items: MenuItemData[]): MenuItemData[] => {
    const itemMap = new Map<string, MenuItemData & { children: MenuItemData[] }>();
    items.forEach((item) => itemMap.set(item.id, { ...item, children: [] }));

    const tree: MenuItemData[] = [];
    itemMap.forEach((item) => {
      if (item.parent_id === null) {
        tree.push(item);
      } else {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(item);
        }
      }
    });

    return tree;
  };

  // End Menu Items

  const handleNav = (item: UserItem, isSubItem: boolean) => (): void => {
    router.push(item.path);
    if (!isSubItem && !item.hasSubItems) {
      setExpanded(false);
    }
  };

  const handleExpanded = (item: UserItem) => (): void => {
    if (item.hasSubItems) {
      setExpanded(expanded === item.title ? false : item.title);
    } else {
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

  const renderListItem = (item: UserItem, isSubItem = false) => {
    const isActive = pathname === item.path;

    return (
      <ListItem disablePadding sx={listItemStyles.root(isActive)}>
        <ListItemButton
          sx={listItemStyles.button(isSubItem)}
          onClick={isSubItem ? handleNav(item, isSubItem) : handleExpanded(item)}
        >
          <ListItemIcon sx={listItemStyles.icon}>
            <Label />
          </ListItemIcon>
          <ListItemText primary={item.title} sx={listItemStyles.text} />
          {item.hasSubItems && !isSubItem && (expanded === item.title ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderSubItems = (item: UserItem) => (
    <Collapse in={expanded === item.title} timeout="auto" unmountOnExit>
      <List disablePadding sx={listStyles.subList}>
        {item.subItems.map((subItem, index) => (
          <Fragment key={index}>{renderListItem(subItem, true)}</Fragment>
        ))}
      </List>
    </Collapse>
  );

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader />
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {userItems.map((item, index) => (
          <Fragment key={index}>
            <List disablePadding sx={listStyles.mainList(expanded === item.title)}>
              {renderListItem(item)}
              {item.hasSubItems && renderSubItems(item)}
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
