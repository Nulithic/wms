import { useEffect } from "react";
import { useTitle } from "@/components/NavBar/TitleContext";

export const useStaticTitle = (title: string) => {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(title);
    return () => setTitle(""); // Clean up when component unmounts
  }, [title, setTitle]);
};
