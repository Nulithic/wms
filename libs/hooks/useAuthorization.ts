import { usePathname } from "next/navigation";
import { useUserMenuItems } from "@/libs/api/queries/menuItemQueries";

const excludedPaths = ["/", "/unauthorized"];

export function useAuthorization() {
  const pathname = usePathname();
  const { data: menuItems, isLoading } = useUserMenuItems();

  const isAuthorized = () => {
    if (excludedPaths.includes(pathname)) {
      return true;
    }

    const authorized = menuItems?.some((item) => {
      // For parent items, just normalize their path
      let fullPath = item.parent_id
        ? `/${menuItems.find((p) => p.id === item.parent_id)?.path}/${item.path}`
        : `/${item.path}`;

      fullPath = fullPath.replace(/\/+/g, "/"); // Normalize slashes

      // Check if this is a parent path of the current pathname
      const isParentPath = pathname.startsWith(fullPath + "/");

      // Exact match
      if (fullPath === pathname) return true;

      // Dynamic route match
      if (fullPath.includes("[") && pathname.startsWith(fullPath.split("[")[0])) return true;

      // Parent path match (for nested routes)
      if (isParentPath) return true;

      return false;
    });

    return authorized;
  };

  return {
    isAuthorized: isAuthorized(),
    isLoading,
  };
}
