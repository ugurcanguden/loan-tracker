import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext({
  refreshCount: 0,
  setRefreshCount: (count: number) => {},
});

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <GlobalStateContext.Provider value={{ refreshCount, setRefreshCount }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext); 