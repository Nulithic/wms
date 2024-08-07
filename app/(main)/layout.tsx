/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useState, ReactNode, MouseEvent, FormEvent } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { styled, useTheme, Theme, CSSObject, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Menu as MenuIcon, MoveToInbox as InboxIcon, Mail as MailIcon, AccountCircle, Label } from "@mui/icons-material";

import theme from "./theme";
import "./globals.css";
import SignOutMenuItem from "@/components/SignOutMenu";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  height: 64,
}));

const menuItems: string[] = ["Admin"];
const subMenuItems: string[] = ["User", "Roles", "Groups"];

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  const [open, setOpen] = useState<boolean>(true);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleDrawerToggle = () => setOpen(!open);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAccordChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <AppBar position="fixed" open={open}>
                <Toolbar>
                  <IconButton color="inherit" aria-label="toggle drawer" onClick={handleDrawerToggle} edge="start" sx={{ marginRight: 5 }}>
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Mini variant drawer
                  </Typography>
                  <div>
                    <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={menuAnchor}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(menuAnchor)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
                      <SignOutMenuItem />
                    </Menu>
                  </div>
                </Toolbar>
              </AppBar>

              <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                  <img
                    src="/splgroup_logo.png"
                    alt="SPL Group"
                    style={{
                      height: "80%", // Set to a percentage of the DrawerHeader height
                      width: "auto", // Maintain aspect ratio
                      objectFit: "contain", // Ensure the entire logo is visible
                      marginRight: "auto",
                    }}
                  />
                </DrawerHeader>
                <Divider />
                {menuItems.map((text, index) => (
                  <Accordion key={index} expanded={expanded === text} onChange={handleAccordChange(text)}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                      <Fragment>
                        <List disablePadding>
                          <ListItem key={text} disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                              }}
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
                            </ListItemButton>
                          </ListItem>
                        </List>
                      </Fragment>
                    </AccordionSummary>
                    <AccordionDetails>
                      {subMenuItems.map((subText, index) => (
                        <Fragment key={index}>
                          <List disablePadding>
                            <ListItem key={subText} disablePadding sx={{ display: "block" }}>
                              <ListItemButton
                                sx={{
                                  minHeight: 48,
                                  justifyContent: open ? "initial" : "center",
                                  px: 2.5,
                                }}
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
                                <ListItemText primary={subText} sx={{ opacity: open ? 1 : 0 }} />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </Fragment>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Drawer>

              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export default RootLayout;
