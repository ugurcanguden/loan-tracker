import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';

export interface BaseTextProps extends TextProps {
    variant?: 'body' | 'title' | 'subtitle' | 'caption' | 'label' | 'error';
    weight?: 'regular' | 'medium' | 'bold';
}

export const BaseText: React.FC<BaseTextProps> = ({
    children,
    style,
    variant = 'body',
    weight = 'regular',
    ...props
}) => {
    const { theme } = useThemeContext();

    const getVariantStyle = (): TextStyle => {
        switch (variant) {
            case 'title':
                return {
                    fontSize: 24,
                    lineHeight: 32,
                    textAlign: 'center', 
                    borderRadius:80
                };
            case 'subtitle':
                return {
                    fontSize: 18,
                    lineHeight: 24,
                };
            case 'caption':
                return {
                    fontSize: 12,
                    lineHeight: 16,
                };
            case 'label':
                return {
                    fontSize: 14,
                    lineHeight: 20,
                };
            case 'error':
                return {
                    fontSize: 12,
                    lineHeight: 16,
                    color: theme.error,
                };
            default:
                return {
                    color: theme.text,
                    fontSize: 16,
                    lineHeight: 24,
                    borderRadius:80
                };
        }
    };

    const getWeightStyle = (): TextStyle => {
        switch (weight) {
            case 'bold':
                return { fontWeight: '700' as TextStyle['fontWeight'] };
            case 'medium':
                return { fontWeight: '500' as TextStyle['fontWeight'] };
            default:
                return { fontWeight: '400' as TextStyle['fontWeight'] };
        }
    };

    const styles = StyleSheet.create({
        text: {
            color: theme.text,
            ...getVariantStyle(),
            ...getWeightStyle(),
        },
    });

    return (
        <Text style={[styles.text, style]} {...props}>
            {children}
        </Text>
    );
};