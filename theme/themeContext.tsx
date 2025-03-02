import React, { createContext, useState, useContext } from 'react';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

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
  theme: DefaultTheme,
});

// Theme Provider Bileşeni
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook ile kullanım kolaylığı sağla
export const useThemeContext = () => useContext(ThemeContext);
