import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BaseTextInput } from '../BaseTextInput';
import { TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../../../theme/themeContext';
import { spacing } from '../../../../theme/theme';

interface BaseSearchInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    value: string;
    onChangeText: (value: string) => void;
    containerStyle?: ViewStyle;
    showClearButton?: boolean;
    onClear?: () => void;
}

export const BaseSearchInput: React.FC<BaseSearchInputProps> = ({
    value,
    onChangeText,
    containerStyle,
    showClearButton = true,
    onClear,
    ...props
}) => {
    const { theme } = useThemeContext();

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.card,
            borderRadius: spacing.md,
            paddingHorizontal: spacing.sm,
        },
        searchIcon: {
            marginRight: spacing.sm,
        },
        input: {
            flex: 1,
            paddingVertical: spacing.sm,
        },
        clearButton: {
            padding: spacing.xs,
        },
    });

    const handleClear = () => {
        onChangeText('');
        onClear?.();
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Ionicons
                name="search"
                size={20}
                color={theme.secondary}
                style={styles.searchIcon}
            />
            <BaseTextInput
                value={value}
                onChangeText={onChangeText}
                style={styles.input}
                placeholder="Search..."
                {...props}
            />
            {showClearButton && value.length > 0 && (
                <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.secondary}
                    onPress={handleClear}
                    style={styles.clearButton}
                />
            )}
        </View>
    );
}; 