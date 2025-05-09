import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { spacing } from '../../../theme/theme';

export interface BaseScrollViewProps extends ScrollViewProps {
    variant?: 'default' | 'card';
    padding?: 'none' | 'small' | 'medium' | 'large';
    backgroundColor?: string;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
}

export const BaseScrollView: React.FC<BaseScrollViewProps> = ({
    children,
    style,
    variant = 'default',
    padding = 'none',
    backgroundColor,
    showsHorizontalScrollIndicator = false,
    showsVerticalScrollIndicator = false,
    ...props
}) => {
    const { theme } = useThemeContext();

    const getVariantStyle = () => {
        switch (variant) {
            case 'card':
                return {
                    backgroundColor: backgroundColor || theme.colors.card,
                };
            default:
                return {
                    backgroundColor: backgroundColor || theme.colors.background,
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
        },
    });

    return (
        <ScrollView
            style={[styles.container, style]}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            {...props}
        >
            {children}
        </ScrollView>
    );
};