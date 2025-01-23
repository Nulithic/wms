"use client";

import { useTitle } from "@/components/NavBar/TitleContext";
import { useEffect } from "react";

const Page = () => {
  const { setShowNavBar, setActions } = useTitle();

  useEffect(() => {
    setShowNavBar(true);
    setActions(null);
    return () => {
      setShowNavBar(false);
      setActions(null);
    };
  }, [setShowNavBar, setActions]);

  return <div>Page</div>;
};

export default Page;
