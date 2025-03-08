import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { spacing, shadows } from '../../../theme/theme';
import { BaseText } from './BaseText';

export interface BaseTouchableProps extends TouchableOpacityProps {
    variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'background';
    size?: 'small' | 'medium' | 'large';
    elevated?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
}

export const BaseTouchable: React.FC<BaseTouchableProps> = ({
    children,
    style,
    variant = 'default',
    size = 'medium',
    elevated = false,
    disabled = false,
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    ...props
}) => {
    const { theme } = useThemeContext();

    const getVariantStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: backgroundColor || (disabled ? theme.colors.disabled : theme.colors.primary),
                };
            case 'secondary':
                return {
                    backgroundColor: backgroundColor || (disabled ? theme.colors.disabled : theme.colors.secondary),
                };
            case 'outline':
                return {
                    backgroundColor: backgroundColor || 'transparent',
                    borderWidth: borderWidth || 1,
                    borderColor: borderColor || (disabled ? theme.colors.disabled : theme.colors.primary),
                };
            case 'background':
                return {
                    backgroundColor: backgroundColor || theme.colors.background,
                    borderRadius: borderRadius || 0,
                };
            default:
                return {
                    backgroundColor: backgroundColor || theme.colors.card,
                };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return {
                    padding: spacing.sm,
                    borderRadius: borderRadius || spacing.sm,
                };
            case 'large':
                return {
                    padding: spacing.lg,
                    borderRadius: borderRadius || spacing.md,
                };
            default:
                return {
                    padding: spacing.md,
                    borderRadius: borderRadius || spacing.sm,
                };
        }
    };

    const styles = StyleSheet.create({
        button: {
            ...getVariantStyle(),
            ...getSizeStyle(),
            ...(elevated ? shadows.sm : {}),
            opacity: disabled ? 0.7 : 1,
        },
    });

    return (
        <TouchableOpacity
            style={[styles.button, style]}
            disabled={disabled}
            {...props}
        > 
            {children}
        </TouchableOpacity>
    );
}; 