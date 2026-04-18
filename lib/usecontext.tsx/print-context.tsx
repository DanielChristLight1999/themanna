"use client";
import { createContext, useContext, useRef, ReactNode } from "react";

type PrintContextType = {
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const PrintContext = createContext<PrintContextType | undefined>(undefined);

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <PrintContext.Provider value={{ contentRef }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrintContext = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error("usePrintContext must be used within a PrintProvider");
  }
  return context;
};
