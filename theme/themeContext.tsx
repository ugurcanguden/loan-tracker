import React, { createContext, useState, useContext } from 'react';
import { Theme, darkTheme, lightTheme } from './theme';

// Context için TypeScript tipi oluştur
interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  theme: Theme;
}

// Varsayılan değerleri belirle
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  setIsDarkMode: () => {},
  theme: lightTheme,
});

// Theme Provider Bileşeni
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook ile kullanım kolaylığı sağla
export const useThemeContext = () => useContext(ThemeContext);
