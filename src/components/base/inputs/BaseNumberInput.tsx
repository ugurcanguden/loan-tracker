import React from 'react';
import { BaseTextInput } from '../BaseTextInput';
import { TextInputProps } from 'react-native';

interface BaseNumberInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    value: string;
    onChangeText: (value: string, numericValue: number) => void;
    min?: number;
    max?: number;
    allowDecimal?: boolean;
    decimalPlaces?: number;
    error?: boolean;
}

export const BaseNumberInput: React.FC<BaseNumberInputProps> = ({
    value,
    onChangeText,
    min,
    max,
    allowDecimal = false,
    decimalPlaces = 2,
    error = false,
    ...props
}) => {
    const validateNumber = (text: string): { isValid: boolean; value: string } => {
        // Remove any non-numeric characters except decimal point if allowed
        const regex = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;
        let cleanValue = text.replace(regex, '');

        // Handle decimal places
        if (allowDecimal) {
            const parts = cleanValue.split('.');
            if (parts.length > 2) {
                // Keep only first decimal point
                cleanValue = parts[0] + '.' + parts.slice(1).join('');
            }
            if (parts[1]?.length > decimalPlaces) {
                // Limit decimal places
                cleanValue = parts[0] + '.' + parts[1].slice(0, decimalPlaces);
            }
        }

        // Convert to number for validation
        const numValue = Number(cleanValue);

        // Validate min/max
        if (min !== undefined && numValue < min) {
            return { isValid: false, value: min.toString() };
        }
        if (max !== undefined && numValue > max) {
            return { isValid: false, value: max.toString() };
        }

        return { isValid: true, value: cleanValue };
    };

    const handleChangeText = (text: string) => {
        const { value: validatedValue } = validateNumber(text);
        const numericValue = Number(validatedValue);
        onChangeText(validatedValue, numericValue);
    };

    return (
        <BaseTextInput
            value={value}
            onChangeText={handleChangeText}
            keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
            variant={error ? 'outline' : 'default'}
            error={error}
            {...props}
        />
    );
}; 