"use client";

import { useState, useMemo, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";

import theme from "./theme";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import { userItems } from "@/utils/menuItems";
import { getTitleFromPath } from "@/utils/navigation";

interface ClientRootLayoutProps {
  children: ReactNode;
}

// Wrap the RootLayout with TitleProvider
export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  const pathname = usePathname();
  const currentTitle = useMemo(() => getTitleFromPath(userItems, pathname), [pathname]);

  const [open, setOpen] = useState<boolean>(true);

  const handleDrawerToggle = () => setOpen(!open);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppHeader open={open} handleDrawerToggle={handleDrawerToggle} title={currentTitle} />
          <Sidebar open={open} userItems={userItems} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
