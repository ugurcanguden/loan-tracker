import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeContext } from '@guden-theme';

interface CoreCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined';
}

const CoreCard: React.FC<CoreCardProps> = ({
  children,
  style,
  padding = 'medium',
  variant = 'default',
}) => {
  const { theme } = useThemeContext();

  const paddingStyles = {
    none: 0,
    small: 8,
    medium: 16,
    large: 24,
  };

  const cardStyles = [
    styles.card,
    {
      backgroundColor: theme.colors.background,
      padding: paddingStyles[padding],
      borderColor: variant === 'outlined' ? theme.colors.border : 'transparent',
      borderWidth: variant === 'outlined' ? 1 : 0,
      shadowColor: theme.colors.shadow,
    },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default CoreCard;