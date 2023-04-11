"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface ContextProps {
  index: number;
  incrementIndex: () => void;
}

const IndexContext = createContext<ContextProps>({
  index: 0,
  incrementIndex: () => {},
});

export default function IndexProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<number>(0);
  const incrementIndex = () => {
    const oldState = index;
    setIndex(oldState + 1);
  };
  return (
    <IndexContext.Provider value={{ index, incrementIndex }}>
      {children}
    </IndexContext.Provider>
  );
}

export const useIncrementContext = () => useContext(IndexContext);
