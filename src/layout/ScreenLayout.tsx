import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useThemeContext } from '@guden-theme';

interface ScreenLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  header,
  children,
  footer,
}) => {
  const { theme } = useThemeContext();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {header && <View style={styles.header}>{header}</View>}

      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: theme.spacing.md }]}
      >
        {children}
      </ScrollView>

      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
  },
  content: {
    flexGrow: 1,
    paddingVertical: 12,
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
  },
});
