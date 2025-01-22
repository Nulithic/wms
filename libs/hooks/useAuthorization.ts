import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserMenuItems } from "@/libs/api/queries/menuItemQueries";
import { createClient } from "@/libs/supabase/client";

const excludedPaths = ["/", "/settings"];

export function useAuthorization() {
  const pathname = usePathname();
  const { data: menuItems, isLoading: isMenuLoading } = useUserMenuItems();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      const supabase = createClient();

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsAdmin(false);
          return;
        }

        const { data, error } = await supabase
          .from("user_groups")
          .select("groups!inner(*)")
          .eq("user_id", session.user.id)
          .eq("groups.code", "admin")
          .single();

        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    }

    checkAdminStatus();
  }, []);

  const isAuthorized = () => {
    // Admin users are authorized for all routes
    if (isAdmin) return true;

    // Check excluded paths
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
    isAdmin,
    isAuthorized: isAuthorized(),
    isLoading: isMenuLoading || isAdminLoading,
  };
}
