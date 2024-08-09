"use client";

import { useEffect } from "react";
import { useTitle } from "@/components/RootLayout/TitleContext";

export default function Home() {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle("Home");
  }, [setTitle]);

  return (
    <main>
      <div>Home</div>
    </main>
  );
}
