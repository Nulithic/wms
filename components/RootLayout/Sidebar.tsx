import { useState, Fragment } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, useTheme } from "@mui/material";
import { Label, ExpandLess, ExpandMore } from "@mui/icons-material";
import { StyledDrawer } from "@/styles/layoutStyles";
import DrawerHeader from "./DrawerHeader";

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
  };

  const renderListItem = (item: UserItem, isSubItem = false) => {
    const isActive = pathname === item.path;

    return (
      <ListItem disablePadding sx={listItemStyles.root(isActive)}>
        <ListItemButton sx={listItemStyles.button(isSubItem)} onClick={isSubItem ? handleNav(item, isSubItem) : handleExpanded(item)}>
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
      {userItems.map((item, index) => (
        <Fragment key={index}>
          <List disablePadding sx={listStyles.mainList(expanded === item.title)}>
            {renderListItem(item)}
            {item.hasSubItems && renderSubItems(item)}
          </List>
        </Fragment>
      ))}
    </StyledDrawer>
  );
}

export default Sidebar;
