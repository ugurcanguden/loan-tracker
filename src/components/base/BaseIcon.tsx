import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeContext } from '@guden-theme';

interface BaseIconProps {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function BaseIcon({ 
  name, 
  size = 20,
  color,
  style 
}: BaseIconProps) {
  const { theme } = useThemeContext();
  
  return (
    <MaterialIcons 
      name={name}
      size={size}
      color={color || theme.colors.text}
      style={style}
    />
  );
} 