import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { BaseText } from './BaseText';
import { useThemeContext } from '@guden-theme';

export interface BaseTabItemProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function BaseTabItem({ label, active, onPress, color, style }: BaseTabItemProps) {
  const { theme } = useThemeContext();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderBottomColor: active ? (color || theme.colors.primary) : 'transparent',
        },
        style,
      ]}
    >
      <BaseText
        variant="body"
        weight={active ? 'bold' : 'regular'}
        style={[
          styles.label,
          {
            color: active ? (color || theme.colors.primary) : theme.colors.text,
          },
        ]}
      >
        {label}
      </BaseText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  label: {
    textAlign: 'center',
  },
}); 