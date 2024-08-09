"use client";

import { useState, ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import { useTitle, TitleProvider } from "./TitleContext";

interface ClientRootLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: ClientRootLayoutProps) {
  const [open, setOpen] = useState<boolean>(true);
  const handleDrawerToggle = () => setOpen(!open);

  const { title } = useTitle(); // Get the title from context

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppHeader open={open} handleDrawerToggle={handleDrawerToggle} title={title} />
          <Sidebar open={open} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

// Wrap the RootLayout with TitleProvider
export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  return (
    <TitleProvider>
      <AppLayout>{children}</AppLayout>
    </TitleProvider>
  );
}
