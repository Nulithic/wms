"use client";

import { useEffect } from "react";
import { useTitle } from "@/components/RootLayout/TitleContext";

export default function Roles() {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Roles");
  }, [setTitle]);

  return <div>Roles</div>;
}
