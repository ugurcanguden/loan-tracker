import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theme, darkTheme, lightTheme } from './theme';
import { useColorScheme } from 'react-native';

// Theme Context için TypeScript tipi
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
  const systemTheme = useColorScheme(); // Cihazın varsayılan temasını al
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  useEffect(() => {
    console.log('Tema değişti:', isDarkMode ? 'Dark Mode' : 'Light Mode');
  }, [isDarkMode]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook ile kullanım kolaylığı sağla
export const useThemeContext = () => useContext(ThemeContext);
