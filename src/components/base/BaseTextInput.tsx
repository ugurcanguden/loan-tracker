import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { spacing, typography } from '../../../theme/theme';

export interface BaseTextInputProps extends TextInputProps {
    variant?: 'default' | 'outline' | 'filled';
    error?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export const BaseTextInput: React.FC<BaseTextInputProps> = ({
    style,
    variant = 'default',
    error = false,
    size = 'medium',
    ...props
}) => {
    const { theme } = useThemeContext();

    const getVariantStyle = () => {
        const base = {
            color: theme.text,
            borderRadius: spacing.sm,
        };

        switch (variant) {
            case 'outline':
                return {
                    ...base,
                    borderWidth: 1,
                    borderColor: error ? theme.error : theme.border,
                    backgroundColor: 'transparent',
                };
            case 'filled':
                return {
                    ...base,
                    backgroundColor: error ? theme.error + '10' : theme.card,
                    borderWidth: 1,
                    borderColor: 'transparent',
                };
            default:
                return {
                    ...base,
                    borderBottomWidth: 1,
                    borderColor: error ? theme.error : theme.border,
                    backgroundColor: 'transparent',
                };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return {
                    fontSize: typography.fontSizes.sm,
                    padding: spacing.sm,
                };
            case 'large':
                return {
                    fontSize: typography.fontSizes.lg,
                    padding: spacing.lg,
                };
            default:
                return {
                    fontSize: typography.fontSizes.md,
                    padding: spacing.md,
                };
        }
    };

    const styles = StyleSheet.create({
        input: {
            ...getVariantStyle(),
            ...getSizeStyle(),
        },
    });

    return (
        <TextInput
            style={[styles.input, style]}
            placeholderTextColor={theme.placeholder}
            {...props}
        />
    );
}; 