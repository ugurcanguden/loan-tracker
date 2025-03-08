import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  StyleProp 
} from 'react-native';
import { useThemeContext } from '@guden-theme';
import { BaseText } from './BaseText';

interface BaseButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function BaseButton({ 
  children, 
  variant = 'primary', 
  loading = false,
  style,
  disabled,
  ...rest 
}: BaseButtonProps) {
  const { theme } = useThemeContext();

  const buttonStyles = [
    styles.base,
    variant === 'primary' && { backgroundColor: theme.colors.primary },
    variant === 'secondary' && { backgroundColor: theme.colors.secondary },
    variant === 'outline' && { 
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary 
    },
    variant === 'icon' && styles.icon,
    disabled && { opacity: 0.5 },
    style,
  ];

  const textColor = variant === 'outline' ? theme.colors.primary : theme.colors.text;

  if (loading) {
    return (
      <TouchableOpacity 
        style={buttonStyles} 
        disabled={true}
        {...rest}
      >
        <ActivityIndicator color={textColor} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={buttonStyles}
      disabled={disabled || loading}
      {...rest}
    >
      {typeof children === 'string' ? (
        <BaseText 
          variant="subtitle" 
          style={[
            styles.text,
            { color: textColor }
          ]}
        >
          {children}
        </BaseText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    padding: 4,
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'center',
  },
}); 