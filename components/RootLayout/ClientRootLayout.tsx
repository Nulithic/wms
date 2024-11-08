"use client";

import { useState, useMemo, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";

import theme from "./theme";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import { useUserMenuItems } from "@/libs/api/queries/menuItemQueries";
import { pathUtils } from "@/utils/pathUtils";
interface ClientRootLayoutProps {
  children: ReactNode;
}

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(true);

  const { data: userMenuItems, isLoading } = useUserMenuItems();

  const currentTitle = useMemo(() => {
    if (!userMenuItems || isLoading) return "";

    // Split the pathname into segments and remove empty strings
    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      // Handle root path
      const rootItem = userMenuItems.find((item) => item.path === "/");
      return rootItem?.title || "Home";
    }

    // Try to find the deepest matching item by traversing the path segments
    let currentPath = "";
    let matchedTitle = "";

    for (const segment of pathSegments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : `/${segment}`;

      const matchingItem = userMenuItems.find((item) => {
        // For parent items
        if (!item.parent_id && item.path === currentPath) {
          return true;
        }

        // For child items
        if (item.parent_id) {
          const parent = userMenuItems.find((p) => p.id === item.parent_id);
          if (parent?.path) {
            const combinedPath = pathUtils.combine(parent.path, item.path || "");
            return currentPath === combinedPath;
          }
        }
        return false;
      });

      if (matchingItem) {
        matchedTitle = matchingItem.title;
      }
    }

    return matchedTitle;
  }, [userMenuItems, pathname, isLoading]);

  const handleDrawerToggle = () => setOpen(!open);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppHeader open={open} handleDrawerToggle={handleDrawerToggle} title={currentTitle} />
          <Sidebar open={open} menuItems={userMenuItems} isLoading={isLoading} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
