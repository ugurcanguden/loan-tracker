import React from 'react';
import { Switch, SwitchProps, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';

interface BaseSwitchProps extends Omit<SwitchProps, 'trackColor' | 'thumbColor'> {
    variant?: 'default' | 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

export const BaseSwitch: React.FC<BaseSwitchProps> = ({
    value,
    onValueChange,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    ...props
}) => {
    const { theme } = useThemeContext();

    const getVariantColors = () => {
        switch (variant) {
            case 'secondary':
                return {
                    trackColor: {
                        false: theme.colors.border,
                        true: theme.colors.secondary,
                    },
                    thumbColor: value ? theme.colors.card : theme.colors.background,
                };
            case 'default':
                return {
                    trackColor: {
                        false: theme.colors.border,
                        true: theme.colors.text,
                    },
                    thumbColor: value ? theme.colors.card : theme.colors.background,
                };
            default:
                return {
                    trackColor: {
                        false: theme.colors.border,
                        true: theme.colors.primary,
                    },
                    thumbColor: value ? theme.colors.card : theme.colors.background,
                };
        }
    };

    const getSize = () => {
        switch (size) {
            case 'small':
                return { transform: [{ scale: 0.8 }] };
            case 'large':
                return { transform: [{ scale: 1.2 }] };
            default:
                return { transform: [{ scale: 1 }] };
        }
    };

    const styles = StyleSheet.create({
        switch: {
            ...getSize(),
            opacity: disabled ? 0.5 : 1,
        },
    });

    const { trackColor, thumbColor } = getVariantColors();

    return (
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={trackColor}
            thumbColor={thumbColor}
            disabled={disabled}
            style={styles.switch}
            {...props}
        />
    );
}; 