import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BaseView } from './BaseView';
import { useThemeContext } from '@guden-theme';

export interface BaseTabsProps {
  activeTab: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function BaseTabs({ activeTab, onChange, style, children }: BaseTabsProps) {
  const { theme } = useThemeContext();
  const tabs = React.Children.toArray(children);

  return (
    <BaseView style={[styles.container, style]}>
      {tabs.map((tab, index) => {
        return React.cloneElement(tab as React.ReactElement, {
          key: index,
          active: index === activeTab,
          onPress: () => onChange(index),
        });
      })}
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
}); 