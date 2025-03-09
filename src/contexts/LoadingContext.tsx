import React, { createContext, useContext, useState } from "react";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apiCallCountLoading, setApiCallCount] = useState(0);
  const showLoading = () => setApiCallCount((prev) => prev + 1);
  const hideLoading = () => setApiCallCount((prev) => prev - 1);
  const isLoading = apiCallCountLoading > 0;
  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
