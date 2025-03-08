import React from 'react';
import { FlatList, FlatListProps, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { spacing } from '../../../theme/theme';

export interface BaseFlatListProps<T> extends Omit<FlatListProps<T>, 'style'> {
    variant?: 'default' | 'card';
    padding?: 'none' | 'small' | 'medium' | 'large';
    backgroundColor?: string;
    contentContainerStyle?: any;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    style?: any;
}

export const BaseFlatList = <T extends any>({
    variant = 'default',
    padding = 'none',
    backgroundColor,
    contentContainerStyle,
    showsHorizontalScrollIndicator = false,
    showsVerticalScrollIndicator = false,
    style,
    ...props
}: BaseFlatListProps<T>) => {
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
        },
        content: {
            padding: getPaddingStyle(),
        },
    });

    return (
        <FlatList
            style={[styles.container, style]}
            contentContainerStyle={[styles.content, contentContainerStyle]}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            {...props}
        />
    );
}; 