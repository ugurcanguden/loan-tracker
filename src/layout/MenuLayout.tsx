// @guden-layout/MenuLayout.tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useThemeContext } from '@guden-theme';

interface MenuLayoutProps {
  children: React.ReactNode;
}

export const MenuLayout: React.FC<MenuLayoutProps> = ({ children }) => {
  const { theme } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20
  },
  content: {
    flex: 1,
  },
});
