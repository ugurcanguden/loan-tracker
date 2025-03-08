import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseTextInput } from '../BaseTextInput';
import { TextInputProps } from 'react-native';
import { spacing } from '../../../../theme/theme';

interface BaseTextAreaProps extends Omit<TextInputProps, 'multiline' | 'numberOfLines'> {
    minHeight?: number;
    maxHeight?: number;
}

export const BaseTextArea: React.FC<BaseTextAreaProps> = ({
    style,
    minHeight = 100,
    maxHeight,
    ...props
}) => {
    const styles = StyleSheet.create({
        textArea: {
            minHeight,
            ...(maxHeight ? { maxHeight } : {}),
            textAlignVertical: 'top',
            paddingTop: spacing.sm,
        },
    });

    return (
        <BaseTextInput
            style={[styles.textArea, style]}
            multiline
            numberOfLines={4}
            {...props}
        />
    );
}; 