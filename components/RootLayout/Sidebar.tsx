import { useState, Fragment } from "react";
import { Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { Label, ExpandLess, ExpandMore } from "@mui/icons-material";
import { StyledDrawer } from "@/styles/layoutStyles";
import DrawerHeader from "./DrawerHeader";
import { menuItems, subMenuItems } from "@/utils/menuItems";

interface SidebarProps {
  open: boolean;
}

function Sidebar({ open }: SidebarProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleExpanded = (panel: string) => () => {
    setExpanded(expanded === panel ? false : panel);
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader />
      <Divider />
      {menuItems.map((text, index) => (
        <Fragment key={index}>
          <List disablePadding sx={{ background: expanded === text ? "#f9f9f9" : "#fff", boxShadow: expanded === text ? "inset 4px 0 #f48020" : "#fff" }}>
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={handleExpanded(text)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Label />
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={expanded === text} easing="ease-in" timeout="auto" unmountOnExit>
              {subMenuItems.map((subText, index) => (
                <List disablePadding key={index}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        px: 2.5,
                      }}
                    >
                      {/* <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: expanded ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <Label />
                      </ListItemIcon> */}
                      <ListItemText primary={subText} />
                    </ListItemButton>
                  </ListItem>
                </List>
              ))}
            </Collapse>
          </List>
        </Fragment>
      ))}
    </StyledDrawer>
  );
}

export default Sidebar;
