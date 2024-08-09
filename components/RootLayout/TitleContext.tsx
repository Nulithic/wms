import { createContext, useContext, ReactNode, useState } from "react";

// Create the context
const TitleContext = createContext({
  title: "",
  setTitle: (title: string) => {},
});

// Custom hook for easy access
export const useTitle = () => useContext(TitleContext);

// Provider component
export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>("");

  return <TitleContext.Provider value={{ title, setTitle }}>{children}</TitleContext.Provider>;
};
