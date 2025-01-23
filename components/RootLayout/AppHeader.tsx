import { useState, MouseEvent } from "react";
import { Toolbar, IconButton, Typography, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon, Logout } from "@mui/icons-material";
import { StyledAppBar } from "@/styles/layoutStyles";

interface AppHeaderProps {
  open: boolean;
  handleDrawerToggle: () => void;
  title?: string;
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
      <Toolbar sx={{ minHeight: 56, height: 56 }}>
        <IconButton
          color="inherit"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{
            marginRight: 5,
            padding: "12px",
          }}
        >
          <MenuIcon sx={{ fontSize: "1.25rem" }} />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: "1rem",
            lineHeight: "56px",
          }}
        >
          {title}
        </Typography>
        <div>
          <IconButton
            onClick={handleMenu}
            color="inherit"
            sx={{
              padding: "12px",
              "& .MuiSvgIcon-root": {
                fontSize: "1.25rem",
              },
            }}
          >
            <Logout />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={menuAnchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem>
              <form action="/signout" method="post">
                <button
                  type="submit"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    font: "inherit",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Sign Out
                </button>
              </form>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </StyledAppBar>
  );
}

export default AppHeader;
