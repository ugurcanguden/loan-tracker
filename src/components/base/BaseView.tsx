import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { spacing, shadows } from '../../../theme/theme';

export interface BaseViewProps extends ViewProps {
    variant?: 'default' | 'card' | 'elevated' | 'background';
    padding?: 'none' | 'small' | 'medium' | 'large';
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
}

export const BaseView: React.FC<BaseViewProps> = ({
    children,
    style,
    variant = 'default',
    padding = 'none',
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    ...props
}) => {
    const { theme } = useThemeContext();

    const getVariantStyle = () => {
        switch (variant) {
            case 'card':
                return {
                    backgroundColor: backgroundColor || theme.colors.card,
                    borderRadius: borderRadius || spacing.md,
                    ...shadows.sm,
                };
            case 'elevated':
                return {
                    backgroundColor: backgroundColor || theme.colors.card,
                    borderRadius: borderRadius || spacing.lg,
                    ...shadows.md,
                };
            case 'background':
                return {
                    backgroundColor: backgroundColor || theme.colors.background,
                    borderRadius: borderRadius || 0,
                };
            default:
                return {
                    backgroundColor: backgroundColor || theme.colors.background,
                    borderRadius: borderRadius || 0,
                };
        }
    };

    const getPaddingStyle = () => {
        switch (padding) {
            case 'small':
                return spacing.sm;
            case 'medium':
                return spacing.md;
            case 'large':
                return spacing.lg;
            default:
                return 0;
        }
    };

    const styles = StyleSheet.create({
        container: {
            ...getVariantStyle(),
            padding: getPaddingStyle(),
            ...(borderColor && { borderColor }),
            ...(borderWidth !== undefined && { borderWidth }),
        },
    });

    return (
        <View style={[styles.container, style]} {...props}>
            {children}
        </View>
    );
}; 