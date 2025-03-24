import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useThemeContext } from '@guden-theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface CoreButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>; // ✅ style desteği
}

export const CoreButton: React.FC<CoreButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  iconLeft,
  iconRight,
  style,
}) => {
  const { theme } = useThemeContext();

  const getBackgroundColor = (): string => {
    if (disabled) return theme.disabled;
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'danger':
        return theme.error;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return theme.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return theme.placeholder;
    switch (variant) {
      case 'outline':
        return theme.primary;
      case 'ghost':
        return theme.text;
      default:
        return '#fff';
    }
  };

  const getBorderStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? theme.border : theme.primary,
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          width: fullWidth ? '100%' : undefined,
        },
        getBorderStyle(),
        style, // ✅ dışarıdan gelen stil burada uygulanıyor
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
          <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});
