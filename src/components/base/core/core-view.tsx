import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeContext } from '@guden-theme';

type Variant = 'default' | 'card' | 'section';
type PaddingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type GapSize = 'none' | 'xs' | 'sm' | 'md' | 'lg';

interface CoreViewProps extends ViewProps {
  variant?: Variant;
  padding?: PaddingSize;
  gap?: GapSize;
  children: React.ReactNode;
}

export const CoreView: React.FC<CoreViewProps> = ({
  variant = 'default',
  padding = 'none',
  gap = 'none',
  style,
  children,
  ...rest
}) => {
  const { theme } = useThemeContext();

  const paddingValue =  0;
  const gapValue = 0;

  const baseStyles = [
    {
      padding: paddingValue,
    },
    variant === 'card' && {
      backgroundColor: theme.card,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    variant === 'section' && {
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.md,
    },
  ];

  return (
    <View
      style={[baseStyles, style]}
      {...rest}
    >
      {React.Children.map(children, (child, index) => (
        <View style={index !== 0 ? { marginTop: gapValue } : undefined}>
          {child}
        </View>
      ))}
    </View>
  );
};
