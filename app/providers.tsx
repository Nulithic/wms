"use client";

import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { TitleProvider } from "@/components/NavBar/TitleContext";
import { getQueryClient } from "@/app/queryClient";
import theme from "@/components/RootLayout/theme";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <TitleProvider>{children}</TitleProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
}
