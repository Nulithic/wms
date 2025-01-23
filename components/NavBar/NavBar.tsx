import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useTitle } from "./TitleContext";
import { useUserMenuItems } from "@/libs/api/queries/menuItemQueries";
import { pathUtils } from "@/utils/pathUtils";

interface NavBarProps {
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function NavBar({ title, actions, className }: NavBarProps) {
  const pathname = usePathname();
  const { title: manualTitle } = useTitle();
  const { data: userMenuItems, isLoading } = useUserMenuItems();

  const currentTitle = useMemo(() => {
    if (manualTitle) return manualTitle;

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
  }, [userMenuItems, pathname, isLoading, manualTitle]);

  console.log(currentTitle);
  console.log(title);

  return (
    <Box
      className={className}
      sx={{
        borderColor: "divider",
        px: 3,
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h6">{title || currentTitle}</Typography>
      </Box>
      {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
    </Box>
  );
}
