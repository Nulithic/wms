"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
  showNavBar: boolean;
  setShowNavBar: (show: boolean) => void;
  actions: React.ReactNode;
  setActions: (actions: React.ReactNode) => void;
}

// Create the context
const TitleContext = createContext<TitleContextType>({
  title: "",
  setTitle: () => {},
  showNavBar: false,
  setShowNavBar: () => {},
  actions: null,
  setActions: () => {},
});

// Custom hook for easy access
export const useTitle = () => useContext(TitleContext);

// Provider component
export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>("");
  const [showNavBar, setShowNavBar] = useState(false);
  const [actions, setActions] = useState<React.ReactNode>(null);

  return (
    <TitleContext.Provider
      value={{
        title,
        setTitle,
        showNavBar,
        setShowNavBar,
        actions,
        setActions,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
