import { useState, MouseEvent } from "react";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import SignOutMenuItem from "./SignOutMenu";
import { StyledAppBar } from "@/styles/layoutStyles";

interface AppHeaderProps {
  open: boolean;
  handleDrawerToggle: () => void;
  title: string;
}

function AppHeader({ open, handleDrawerToggle, title }: AppHeaderProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton color="inherit" aria-label="toggle drawer" onClick={handleDrawerToggle} edge="start" sx={{ marginRight: 5 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {title}
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
    </StyledAppBar>
  );
}

export default AppHeader;
