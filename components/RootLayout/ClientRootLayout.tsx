"use client";

import { useState, useMemo, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";

import theme from "./theme";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import { useMenuItems } from "@/libs/api/queries/admin/menuItemQueries";
import { pathUtils } from "@/utils/pathUtils";
interface ClientRootLayoutProps {
  children: ReactNode;
}

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(true);
  const { getMenuItems } = useMenuItems();
  const { data: menuItems, isLoading } = getMenuItems();

  const currentTitle = useMemo(() => {
    if (!menuItems || isLoading) return "";

    // Split the pathname into segments and remove empty strings
    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments.length === 0) {
      // Handle root path
      const rootItem = menuItems.find((item) => item.path === "/");
      return rootItem?.title || "Home";
    }

    // Try to find the deepest matching item by traversing the path segments
    let currentPath = "";
    let matchedTitle = "";

    for (const segment of pathSegments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : `/${segment}`;

      const matchingItem = menuItems.find((item) => {
        // For parent items
        if (!item.parent_id && item.path === currentPath) {
          return true;
        }

        // For child items
        if (item.parent_id) {
          const parent = menuItems.find((p) => p.id === item.parent_id);
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
  }, [menuItems, pathname, isLoading]);

  const handleDrawerToggle = () => setOpen(!open);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppHeader open={open} handleDrawerToggle={handleDrawerToggle} title={currentTitle} />
          <Sidebar open={open} menuItems={menuItems} isLoading={isLoading} />
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
