import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, []);

  return { isAdmin, isLoading };
}
