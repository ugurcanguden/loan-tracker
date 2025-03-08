import React, { useCallback } from 'react';
import { BaseTextInput } from '../BaseTextInput';
import { TextInputProps } from 'react-native';

interface BaseAmountInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    value: string;
    onChangeText: (value: string, formattedValue: string) => void;
    currency?: string;
    locale?: string;
    decimals?: number;
    error?: boolean;
    variant?: 'default' | 'outline' | 'filled';
}

export const BaseAmountInput: React.FC<BaseAmountInputProps> = ({
    value,
    onChangeText,
    currency = 'TRY',
    locale = 'tr-TR',
    decimals = 2,
    error = false,
    variant = 'default',
    ...props
}) => {
    const formatAmount = useCallback((text: string) => {
        // Remove non-numeric characters
        const numericValue = text.replace(/[^0-9]/g, '');
        
        // Convert to number and divide by 100 to handle decimals
        const amount = Number(numericValue) / Math.pow(10, decimals);
        
        // Format the number according to locale and currency
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(amount);
    }, [currency, locale, decimals]);

    const handleChangeText = (text: string) => {
        // Remove currency symbol and non-numeric characters for raw value
        const rawValue = text.replace(/[^0-9]/g, '');
        const formattedValue = formatAmount(rawValue);
        onChangeText(rawValue, formattedValue);
    };

    return (
        <BaseTextInput
            value={formatAmount(value)}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            variant={variant}
            error={error}
            {...props}
        />
    );
}; 