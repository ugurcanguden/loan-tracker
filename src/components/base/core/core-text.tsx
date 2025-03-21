import { useThemeContext } from '@guden-theme';
import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native'; 

export interface CoreTextProps extends TextProps {
  variant?: 'body' | 'title' | 'subtitle' | 'caption' | 'label' | 'error';
  weight?: 'regular' | 'medium' | 'bold';
}

export const CoreText: React.FC<CoreTextProps> = ({
  children,
  style,
  variant = 'body',
  weight = 'regular',
  ...props
}) => {
  const { theme } = useThemeContext();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'title':
        return { fontSize: 24, lineHeight: 32, fontWeight: 'bold', textAlign: 'center' };
      case 'subtitle':
        return { fontSize: 18, lineHeight: 24 };
      case 'caption':
        return { fontSize: 12, lineHeight: 16 };
      case 'label':
        return { fontSize: 14, lineHeight: 20 };
      case 'error':
        return { fontSize: 12, lineHeight: 16, color: theme.error };
      default:
        return { fontSize: 16, lineHeight: 24, color: theme.text };
    }
  };

  const styles = StyleSheet.create({
    text: {
      color: theme.text,
      ...getVariantStyle(),
    },
  });

  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};
