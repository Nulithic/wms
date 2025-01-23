"use client";

import { useState, ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import { useUserMenuItems } from "@/libs/api/queries/menuItemQueries";
import { NavBar } from "../NavBar/NavBar";
import { useTitle } from "../NavBar/TitleContext";

interface ClientRootLayoutProps {
  children: ReactNode;
}

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  const [open, setOpen] = useState<boolean>(true);
  const { showNavBar, actions } = useTitle();
  const { data: userMenuItems, isLoading } = useUserMenuItems();

  const handleDrawerToggle = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppHeader open={open} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar open={open} menuItems={userMenuItems} isLoading={isLoading} />
      <Box component="main" sx={{ flexGrow: 1, marginTop: "56px", display: "flex", flexDirection: "column" }}>
        {showNavBar && <NavBar actions={actions} />}
        <Box sx={{ p: 2, bgcolor: "#eee", flex: 1 }}>
          <Box sx={{ p: 2, bgcolor: "#fff", height: "100%", borderRadius: 2 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
