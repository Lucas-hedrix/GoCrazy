import { createContext, useContext, useState } from "react";

const UIContext = createContext(null);
export const useUI = () => useContext(UIContext);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <UIContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
}
