"use client";

import { useEffect } from "react";
import { useTitle } from "@/components/RootLayout/TitleContext";

export default function Groups() {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Groups");
  }, [setTitle]);

  return <div>Groups</div>;
}
